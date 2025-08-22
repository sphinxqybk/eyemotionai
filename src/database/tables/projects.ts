// EyeMotion Projects and Files Tables Schema
import { DATABASE_CONSTANTS, SQL_HELPERS, SQL_PATTERNS } from '../constants';

const { TABLES, PROJECT_TYPES, PROJECT_STATUS, PROCESSING_STATUS, INDEXES } = DATABASE_CONSTANTS;
const { createUpdateTrigger, enableRLS, createIndex, createRLSPolicy, RLS_CONDITIONS } = SQL_HELPERS;
const { TIMESTAMPS, UUID_PRIMARY_KEY, METADATA_JSONB, CHECK_CONSTRAINTS } = SQL_PATTERNS;

export const PROJECTS_SCHEMA = {
  // Projects Table
  CREATE_PROJECTS_TABLE: `
    CREATE OR REPLACE FUNCTION create_projects_table()
    RETURNS VOID AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS ${TABLES.PROJECTS} (
        ${UUID_PRIMARY_KEY},
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        description TEXT,
        type TEXT DEFAULT '${PROJECT_TYPES.FEATURE_FILM}' ${CHECK_CONSTRAINTS.STATUS(Object.values(PROJECT_TYPES))},
        status TEXT DEFAULT '${PROJECT_STATUS.DRAFT}' ${CHECK_CONSTRAINTS.STATUS(Object.values(PROJECT_STATUS))},
        thumbnail_url TEXT,
        settings JSONB DEFAULT '{}',
        collaboration_settings JSONB DEFAULT '{}',
        version INTEGER DEFAULT 1,
        file_count INTEGER DEFAULT 0,
        total_duration INTEGER DEFAULT 0, -- in seconds
        export_count INTEGER DEFAULT 0,
        last_opened_at TIMESTAMPTZ DEFAULT NOW(),
        ${TIMESTAMPS}
      );
    END;
    $$ LANGUAGE plpgsql;
  `,

  // Project Files Table
  CREATE_PROJECT_FILES_TABLE: `
    CREATE OR REPLACE FUNCTION create_project_files_table()
    RETURNS VOID AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS ${TABLES.PROJECT_FILES} (
        ${UUID_PRIMARY_KEY},
        project_id UUID NOT NULL REFERENCES ${TABLES.PROJECTS}(id) ON DELETE CASCADE,
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        filename TEXT NOT NULL,
        original_name TEXT NOT NULL,
        file_type TEXT NOT NULL,
        file_size BIGINT DEFAULT 0,
        mime_type TEXT,
        storage_path TEXT,
        thumbnail_url TEXT,
        duration INTEGER, -- in seconds for video files
        resolution TEXT, -- e.g., "1920x1080"
        fps DECIMAL(5,2), -- frames per second
        codec TEXT,
        bitrate BIGINT,
        processing_status TEXT DEFAULT '${PROCESSING_STATUS.PENDING}' ${CHECK_CONSTRAINTS.STATUS(Object.values(PROCESSING_STATUS))},
        processing_started_at TIMESTAMPTZ,
        processing_completed_at TIMESTAMPTZ,
        processing_error TEXT,
        credits_cost INTEGER DEFAULT 0,
        ${METADATA_JSONB},
        tags TEXT[] DEFAULT '{}',
        is_favorite BOOLEAN DEFAULT FALSE,
        ${TIMESTAMPS}
      );
    END;
    $$ LANGUAGE plpgsql;
  `,

  // Create indexes for both tables
  CREATE_INDEXES: [
    // Projects indexes
    createIndex(INDEXES.PROJECTS[0], TABLES.PROJECTS, 'user_id'),
    createIndex(INDEXES.PROJECTS[1], TABLES.PROJECTS, 'status'),
    createIndex(INDEXES.PROJECTS[2], TABLES.PROJECTS, 'type'),
    createIndex(INDEXES.PROJECTS[3], TABLES.PROJECTS, 'created_at'),
    createIndex(INDEXES.PROJECTS[4], TABLES.PROJECTS, 'last_opened_at'),
    
    // Project Files indexes
    createIndex(INDEXES.PROJECT_FILES[0], TABLES.PROJECT_FILES, 'project_id'),
    createIndex(INDEXES.PROJECT_FILES[1], TABLES.PROJECT_FILES, 'user_id'),
    createIndex(INDEXES.PROJECT_FILES[2], TABLES.PROJECT_FILES, 'file_type'),
    createIndex(INDEXES.PROJECT_FILES[3], TABLES.PROJECT_FILES, 'processing_status'),
    createIndex(INDEXES.PROJECT_FILES[4], TABLES.PROJECT_FILES, 'created_at'),
    `CREATE INDEX IF NOT EXISTS ${INDEXES.PROJECT_FILES[5]} ON ${TABLES.PROJECT_FILES} USING GIN(tags);`
  ].join('\n'),

  // Setup RLS for both tables
  SETUP_RLS: `
    -- Projects RLS
    ${enableRLS(TABLES.PROJECTS)}
    
    ${createRLSPolicy(
      'Users can manage own projects', 
      TABLES.PROJECTS, 
      'ALL', 
      RLS_CONDITIONS.OWN_RECORD
    )}
    
    ${createRLSPolicy(
      'Admins can view all projects', 
      TABLES.PROJECTS, 
      'SELECT', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}

    -- Project Files RLS
    ${enableRLS(TABLES.PROJECT_FILES)}
    
    ${createRLSPolicy(
      'Users can manage own project files', 
      TABLES.PROJECT_FILES, 
      'ALL', 
      RLS_CONDITIONS.OWN_RECORD
    )}
    
    ${createRLSPolicy(
      'Admins can view all files', 
      TABLES.PROJECT_FILES, 
      'SELECT', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}
  `,

  // Create triggers and functions
  CREATE_TRIGGERS: `
    ${createUpdateTrigger(TABLES.PROJECTS)}
    ${createUpdateTrigger(TABLES.PROJECT_FILES)}

    -- Function to update project file count
    CREATE OR REPLACE FUNCTION update_project_file_count()
    RETURNS TRIGGER AS $$
    BEGIN
      IF TG_OP = 'INSERT' THEN
        UPDATE ${TABLES.PROJECTS} 
        SET file_count = file_count + 1,
            updated_at = NOW()
        WHERE id = NEW.project_id;
        RETURN NEW;
      ELSIF TG_OP = 'DELETE' THEN
        UPDATE ${TABLES.PROJECTS} 
        SET file_count = file_count - 1,
            updated_at = NOW()
        WHERE id = OLD.project_id;
        RETURN OLD;
      END IF;
      RETURN NULL;
    END;
    $$ LANGUAGE plpgsql;

    -- Trigger for file count updates
    DROP TRIGGER IF EXISTS trigger_update_project_file_count ON ${TABLES.PROJECT_FILES};
    CREATE TRIGGER trigger_update_project_file_count
      AFTER INSERT OR DELETE ON ${TABLES.PROJECT_FILES}
      FOR EACH ROW EXECUTE FUNCTION update_project_file_count();

    -- Function to update project total duration
    CREATE OR REPLACE FUNCTION update_project_duration()
    RETURNS TRIGGER AS $$
    BEGIN
      -- Update total duration when file duration changes
      UPDATE ${TABLES.PROJECTS}
      SET total_duration = (
        SELECT COALESCE(SUM(duration), 0)
        FROM ${TABLES.PROJECT_FILES}
        WHERE project_id = COALESCE(NEW.project_id, OLD.project_id)
          AND processing_status = '${PROCESSING_STATUS.READY}'
      ),
      updated_at = NOW()
      WHERE id = COALESCE(NEW.project_id, OLD.project_id);
      
      RETURN COALESCE(NEW, OLD);
    END;
    $$ LANGUAGE plpgsql;

    -- Trigger for duration updates
    DROP TRIGGER IF EXISTS trigger_update_project_duration ON ${TABLES.PROJECT_FILES};
    CREATE TRIGGER trigger_update_project_duration
      AFTER INSERT OR UPDATE OF duration, processing_status OR DELETE ON ${TABLES.PROJECT_FILES}
      FOR EACH ROW EXECUTE FUNCTION update_project_duration();
  `,

  // Helper functions for projects and files
  HELPER_FUNCTIONS: `
    -- Function to get project with stats
    CREATE OR REPLACE FUNCTION get_project_with_stats(p_project_id UUID, p_user_id UUID)
    RETURNS TABLE(
      id UUID,
      name TEXT,
      description TEXT,
      type TEXT,
      status TEXT,
      thumbnail_url TEXT,
      file_count INTEGER,
      total_duration INTEGER,
      total_size_bytes BIGINT,
      last_opened_at TIMESTAMPTZ,
      created_at TIMESTAMPTZ,
      updated_at TIMESTAMPTZ
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        p.id,
        p.name,
        p.description,
        p.type,
        p.status,
        p.thumbnail_url,
        p.file_count,
        p.total_duration,
        COALESCE(SUM(pf.file_size), 0) as total_size_bytes,
        p.last_opened_at,
        p.created_at,
        p.updated_at
      FROM ${TABLES.PROJECTS} p
      LEFT JOIN ${TABLES.PROJECT_FILES} pf ON p.id = pf.project_id
      WHERE p.id = p_project_id 
        AND p.user_id = p_user_id
      GROUP BY p.id, p.name, p.description, p.type, p.status, 
               p.thumbnail_url, p.file_count, p.total_duration,
               p.last_opened_at, p.created_at, p.updated_at;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to get user's storage usage
    CREATE OR REPLACE FUNCTION get_user_storage_usage(p_user_id UUID)
    RETURNS TABLE(
      used_gb DECIMAL,
      limit_gb INTEGER,
      file_count INTEGER,
      available_gb DECIMAL
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        COALESCE(SUM(pf.file_size)::DECIMAL / (1024*1024*1024), 0) as used_gb,
        sp.storage_gb as limit_gb,
        COUNT(pf.id)::INTEGER as file_count,
        (sp.storage_gb - COALESCE(SUM(pf.file_size)::DECIMAL / (1024*1024*1024), 0)) as available_gb
      FROM user_subscriptions us
      JOIN subscription_plans sp ON us.plan_id = sp.id
      LEFT JOIN ${TABLES.PROJECTS} p ON p.user_id = us.user_id
      LEFT JOIN ${TABLES.PROJECT_FILES} pf ON pf.project_id = p.id
      WHERE us.user_id = p_user_id 
        AND us.status = 'active'
      GROUP BY sp.storage_gb
      LIMIT 1;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to mark project as opened
    CREATE OR REPLACE FUNCTION mark_project_opened(p_project_id UUID, p_user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      UPDATE ${TABLES.PROJECTS}
      SET last_opened_at = NOW(),
          updated_at = NOW()
      WHERE id = p_project_id 
        AND user_id = p_user_id;
      
      RETURN FOUND;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to duplicate project
    CREATE OR REPLACE FUNCTION duplicate_project(p_project_id UUID, p_user_id UUID, p_new_name TEXT)
    RETURNS UUID AS $$
    DECLARE
      v_new_project_id UUID;
      v_original_project RECORD;
    BEGIN
      -- Get original project
      SELECT * INTO v_original_project
      FROM ${TABLES.PROJECTS}
      WHERE id = p_project_id AND user_id = p_user_id;
      
      IF NOT FOUND THEN
        RETURN NULL;
      END IF;

      -- Create new project
      INSERT INTO ${TABLES.PROJECTS} (
        user_id, name, description, type, settings, 
        collaboration_settings, created_at, updated_at
      ) VALUES (
        p_user_id, 
        p_new_name, 
        v_original_project.description, 
        v_original_project.type,
        v_original_project.settings,
        v_original_project.collaboration_settings,
        NOW(),
        NOW()
      ) RETURNING id INTO v_new_project_id;

      -- Note: Files are not duplicated to avoid storage issues
      -- Users would need to re-upload files to the new project

      RETURN v_new_project_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to get project files with pagination
    CREATE OR REPLACE FUNCTION get_project_files_paginated(
      p_project_id UUID, 
      p_user_id UUID,
      p_limit INTEGER DEFAULT 20,
      p_offset INTEGER DEFAULT 0,
      p_file_type TEXT DEFAULT NULL
    )
    RETURNS TABLE(
      id UUID,
      filename TEXT,
      original_name TEXT,
      file_type TEXT,
      file_size BIGINT,
      thumbnail_url TEXT,
      duration INTEGER,
      processing_status TEXT,
      is_favorite BOOLEAN,
      tags TEXT[],
      created_at TIMESTAMPTZ
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        pf.id,
        pf.filename,
        pf.original_name,
        pf.file_type,
        pf.file_size,
        pf.thumbnail_url,
        pf.duration,
        pf.processing_status,
        pf.is_favorite,
        pf.tags,
        pf.created_at
      FROM ${TABLES.PROJECT_FILES} pf
      WHERE pf.project_id = p_project_id 
        AND pf.user_id = p_user_id
        AND (p_file_type IS NULL OR pf.file_type = p_file_type)
      ORDER BY pf.is_favorite DESC, pf.created_at DESC
      LIMIT p_limit OFFSET p_offset;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to update file processing status
    CREATE OR REPLACE FUNCTION update_file_processing_status(
      p_file_id UUID,
      p_status TEXT,
      p_error TEXT DEFAULT NULL,
      p_metadata JSONB DEFAULT NULL
    )
    RETURNS BOOLEAN AS $$
    BEGIN
      UPDATE ${TABLES.PROJECT_FILES}
      SET processing_status = p_status,
          processing_error = p_error,
          metadata = COALESCE(p_metadata, metadata),
          processing_completed_at = CASE 
            WHEN p_status = '${PROCESSING_STATUS.READY}' THEN NOW()
            ELSE processing_completed_at
          END,
          processing_started_at = CASE 
            WHEN p_status = '${PROCESSING_STATUS.PROCESSING}' THEN NOW()
            ELSE processing_started_at
          END,
          updated_at = NOW()
      WHERE id = p_file_id;
      
      RETURN FOUND;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `
};

// Complete projects setup
export const SETUP_PROJECTS = `
  -- Create projects table
  ${PROJECTS_SCHEMA.CREATE_PROJECTS_TABLE}
  
  -- Create project files table
  ${PROJECTS_SCHEMA.CREATE_PROJECT_FILES_TABLE}
  
  -- Create indexes
  ${PROJECTS_SCHEMA.CREATE_INDEXES}
  
  -- Setup RLS
  ${PROJECTS_SCHEMA.SETUP_RLS}
  
  -- Create triggers
  ${PROJECTS_SCHEMA.CREATE_TRIGGERS}
  
  -- Create helper functions
  ${PROJECTS_SCHEMA.HELPER_FUNCTIONS}
`;

export default PROJECTS_SCHEMA;