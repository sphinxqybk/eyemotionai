// EyeMotion User Profiles Table Schema
import { DATABASE_CONSTANTS, SQL_HELPERS, SQL_PATTERNS } from '../constants';

const { TABLES, USER_ROLES, DEFAULTS, INDEXES } = DATABASE_CONSTANTS;
const { createUpdateTrigger, enableRLS, createIndex, createRLSPolicy, RLS_CONDITIONS } = SQL_HELPERS;
const { TIMESTAMPS, UUID_PRIMARY_KEY, METADATA_JSONB, CHECK_CONSTRAINTS } = SQL_PATTERNS;

export const USER_PROFILES_SCHEMA = {
  // Main table creation function
  CREATE_TABLE: `
    CREATE OR REPLACE FUNCTION create_user_profiles_table()
    RETURNS VOID AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS ${TABLES.USER_PROFILES} (
        id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
        full_name TEXT NOT NULL,
        company_name TEXT,
        industry TEXT DEFAULT '${DEFAULTS.INDUSTRY}',
        country TEXT DEFAULT '${DEFAULTS.COUNTRY}',
        phone TEXT,
        avatar_url TEXT,
        role TEXT DEFAULT '${USER_ROLES.USER}' ${CHECK_CONSTRAINTS.ROLE(Object.values(USER_ROLES))},
        preferences JSONB DEFAULT '{}',
        onboarding_completed BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        last_login_at TIMESTAMPTZ,
        ${TIMESTAMPS}
      );
    END;
    $$ LANGUAGE plpgsql;
  `,

  // Create indexes
  CREATE_INDEXES: [
    createIndex(INDEXES.USER_PROFILES[0], TABLES.USER_PROFILES, 'role'),
    createIndex(INDEXES.USER_PROFILES[1], TABLES.USER_PROFILES, 'country'),
    createIndex(INDEXES.USER_PROFILES[2], TABLES.USER_PROFILES, 'industry'),
    createIndex(INDEXES.USER_PROFILES[3], TABLES.USER_PROFILES, 'created_at')
  ].join('\n'),

  // Enable RLS and create policies
  SETUP_RLS: `
    ${enableRLS(TABLES.USER_PROFILES)}
    
    ${createRLSPolicy(
      'Users can view own profile', 
      TABLES.USER_PROFILES, 
      'SELECT', 
      RLS_CONDITIONS.OWN_ID
    )}
    
    ${createRLSPolicy(
      'Users can update own profile', 
      TABLES.USER_PROFILES, 
      'UPDATE', 
      RLS_CONDITIONS.OWN_ID
    )}
    
    ${createRLSPolicy(
      'Admins can view all profiles', 
      TABLES.USER_PROFILES, 
      'ALL', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}
  `,

  // Create triggers
  CREATE_TRIGGERS: createUpdateTrigger(TABLES.USER_PROFILES),

  // Helper functions for user profiles
  HELPER_FUNCTIONS: `
    -- Function to create user profile after auth signup
    CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
    RETURNS TRIGGER AS $$
    BEGIN
      INSERT INTO ${TABLES.USER_PROFILES} (
        id, 
        full_name, 
        email_verified,
        created_at,
        updated_at
      ) VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email_confirmed_at IS NOT NULL,
        NOW(),
        NOW()
      );
      RETURN NEW;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Trigger to auto-create profile
    DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW EXECUTE FUNCTION create_user_profile_on_signup();

    -- Function to update last login
    CREATE OR REPLACE FUNCTION update_user_last_login(p_user_id UUID)
    RETURNS VOID AS $$
    BEGIN
      UPDATE ${TABLES.USER_PROFILES}
      SET last_login_at = NOW(),
          updated_at = NOW()
      WHERE id = p_user_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to check if user is admin
    CREATE OR REPLACE FUNCTION is_admin(p_user_id UUID)
    RETURNS BOOLEAN AS $$
    DECLARE
      user_role TEXT;
    BEGIN
      SELECT role INTO user_role
      FROM ${TABLES.USER_PROFILES}
      WHERE id = p_user_id;
      
      RETURN user_role IN ('${USER_ROLES.ADMIN}', '${USER_ROLES.SUPER_ADMIN}');
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to get user profile with subscription
    CREATE OR REPLACE FUNCTION get_user_profile_with_subscription(p_user_id UUID)
    RETURNS TABLE(
      id UUID,
      full_name TEXT,
      company_name TEXT,
      industry TEXT,
      country TEXT,
      avatar_url TEXT,
      role TEXT,
      current_plan TEXT,
      subscription_status TEXT,
      credits_remaining INTEGER
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        up.id,
        up.full_name,
        up.company_name,
        up.industry,
        up.country,
        up.avatar_url,
        up.role,
        sp.display_name as current_plan,
        us.status as subscription_status,
        (us.credits_included + us.extra_credits - us.credits_used) as credits_remaining
      FROM ${TABLES.USER_PROFILES} up
      LEFT JOIN user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
      LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
      WHERE up.id = p_user_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `
};

// Complete user profiles setup
export const SETUP_USER_PROFILES = `
  -- Enable UUID extension
  ${SQL_HELPERS.ENABLE_UUID}
  
  -- Create updated_at trigger function
  ${SQL_HELPERS.UPDATE_TIMESTAMP_FUNCTION}
  
  -- Create user profiles table
  ${USER_PROFILES_SCHEMA.CREATE_TABLE}
  
  -- Create indexes
  ${USER_PROFILES_SCHEMA.CREATE_INDEXES}
  
  -- Setup RLS
  ${USER_PROFILES_SCHEMA.SETUP_RLS}
  
  -- Create triggers
  ${USER_PROFILES_SCHEMA.CREATE_TRIGGERS}
  
  -- Create helper functions
  ${USER_PROFILES_SCHEMA.HELPER_FUNCTIONS}
`;

export default USER_PROFILES_SCHEMA;