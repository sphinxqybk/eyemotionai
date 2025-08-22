-- EyeMotion File Lifecycle Management SQL Functions

-- ==========================================
-- STORAGE USAGE CALCULATION FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION calculate_storage_usage()
RETURNS TABLE(
  user_id UUID,
  total_files INTEGER,
  total_storage_gb DECIMAL(10,3),
  hot_storage_gb DECIMAL(10,3),
  warm_storage_gb DECIMAL(10,3),
  archive_storage_gb DECIMAL(10,3),
  favorite_files INTEGER,
  monthly_cost_thb DECIMAL(10,2)
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    pf.user_id,
    COUNT(*)::INTEGER as total_files,
    ROUND(SUM(pf.file_size::decimal / 1024 / 1024 / 1024), 3) as total_storage_gb,
    ROUND(SUM(
      CASE WHEN pf.processing_status IN ('ready', 'uploaded') 
      THEN pf.file_size::decimal / 1024 / 1024 / 1024 
      ELSE 0 END
    ), 3) as hot_storage_gb,
    ROUND(SUM(
      CASE WHEN pf.processing_status = 'warm_storage' 
      THEN pf.file_size::decimal / 1024 / 1024 / 1024 
      ELSE 0 END
    ), 3) as warm_storage_gb,
    ROUND(SUM(
      CASE WHEN pf.processing_status IN ('archived', 'favorite_archive') 
      THEN pf.file_size::decimal / 1024 / 1024 / 1024 
      ELSE 0 END
    ), 3) as archive_storage_gb,
    COUNT(CASE WHEN pf.is_favorite THEN 1 END)::INTEGER as favorite_files,
    ROUND((
      SUM(CASE WHEN pf.processing_status IN ('ready', 'uploaded') 
          THEN pf.file_size::decimal / 1024 / 1024 / 1024 * 3.60 
          ELSE 0 END) +
      SUM(CASE WHEN pf.processing_status = 'warm_storage' 
          THEN pf.file_size::decimal / 1024 / 1024 / 1024 * 2.16 
          ELSE 0 END) +
      SUM(CASE WHEN pf.processing_status IN ('archived', 'favorite_archive') 
          THEN pf.file_size::decimal / 1024 / 1024 / 1024 * 0.72 
          ELSE 0 END)
    ), 2) as monthly_cost_thb
  FROM project_files pf
  WHERE pf.processing_status != 'deleted'
  GROUP BY pf.user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- FILE LIFECYCLE MANAGEMENT FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION manage_file_lifecycle()
RETURNS TABLE(
  processed_files INTEGER,
  archived_files INTEGER,
  deleted_files INTEGER,
  cost_savings_thb DECIMAL(10,2)
) AS $$
DECLARE
  v_processed INTEGER := 0;
  v_archived INTEGER := 0;
  v_deleted INTEGER := 0;
  v_cost_savings DECIMAL(10,2) := 0;
  file_record RECORD;
  plan_name TEXT;
  file_age_days INTEGER;
  archive_threshold INTEGER;
  delete_threshold INTEGER;
BEGIN
  
  -- Process files that need lifecycle management
  FOR file_record IN 
    SELECT 
      pf.*,
      sp.name as plan_name,
      EXTRACT(days FROM (NOW() - pf.updated_at)) as age_days
    FROM project_files pf
    JOIN projects p ON pf.project_id = p.id
    JOIN user_subscriptions us ON p.user_id = us.user_id
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE pf.processing_status IN ('ready', 'uploaded', 'warm_storage', 'archived')
      AND us.status = 'active'
      AND pf.updated_at < NOW() - INTERVAL '1 day'
  LOOP
    
    -- Get lifecycle thresholds based on plan
    CASE file_record.plan_name
      WHEN 'freemium' THEN
        archive_threshold := 30;
        delete_threshold := 90;
      WHEN 'creator' THEN
        archive_threshold := 90;
        delete_threshold := 365;
      WHEN 'pro' THEN
        archive_threshold := 180;
        delete_threshold := 730;
      WHEN 'studio' THEN
        archive_threshold := 365;
        delete_threshold := NULL; -- Never auto-delete
      ELSE
        archive_threshold := 30;
        delete_threshold := 90;
    END CASE;
    
    file_age_days := file_record.age_days;
    
    -- Archive old files
    IF file_age_days >= archive_threshold AND file_record.processing_status IN ('ready', 'uploaded') THEN
      UPDATE project_files 
      SET 
        processing_status = CASE 
          WHEN is_favorite THEN 'favorite_archive'
          ELSE 'archived'
        END,
        metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
          'archived_at', NOW(),
          'archived_reason', 'lifecycle_policy',
          'original_status', processing_status,
          'file_age_days', file_age_days
        ),
        updated_at = NOW()
      WHERE id = file_record.id;
      
      v_archived := v_archived + 1;
      v_processed := v_processed + 1;
      
      -- Calculate cost savings (moving from hot to archive storage)
      v_cost_savings := v_cost_savings + 
        (file_record.file_size::decimal / 1024 / 1024 / 1024) * (3.60 - 0.72);
    
    -- Delete very old files (non-favorites only)
    ELSIF delete_threshold IS NOT NULL 
          AND file_age_days >= delete_threshold 
          AND file_record.processing_status = 'archived'
          AND NOT file_record.is_favorite THEN
      
      -- Mark for deletion (soft delete for audit trail)
      UPDATE project_files 
      SET 
        processing_status = 'scheduled_deletion',
        metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
          'deletion_scheduled_at', NOW(),
          'deletion_reason', 'lifecycle_policy',
          'file_age_days', file_age_days,
          'grace_period_days', 7
        ),
        updated_at = NOW()
      WHERE id = file_record.id;
      
      v_deleted := v_deleted + 1;
      v_processed := v_processed + 1;
      
      -- Calculate cost savings (complete file deletion)
      v_cost_savings := v_cost_savings + 
        (file_record.file_size::decimal / 1024 / 1024 / 1024) * 0.72;
    
    -- Move to warm storage for medium-age files
    ELSIF file_age_days >= 30 
          AND file_age_days < archive_threshold 
          AND file_record.processing_status IN ('ready', 'uploaded') THEN
      
      UPDATE project_files 
      SET 
        processing_status = 'warm_storage',
        metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
          'moved_to_warm_at', NOW(),
          'original_status', processing_status,
          'file_age_days', file_age_days
        ),
        updated_at = NOW()
      WHERE id = file_record.id;
      
      v_processed := v_processed + 1;
      
      -- Calculate cost savings (moving from hot to warm storage)
      v_cost_savings := v_cost_savings + 
        (file_record.file_size::decimal / 1024 / 1024 / 1024) * (3.60 - 2.16);
    END IF;
    
  END LOOP;
  
  -- Actually delete files that have been scheduled for deletion and passed grace period
  UPDATE project_files 
  SET 
    processing_status = 'deleted',
    deleted_at = NOW(),
    metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
      'deleted_at', NOW(),
      'deleted_by', 'system_lifecycle'
    )
  WHERE processing_status = 'scheduled_deletion'
    AND updated_at < NOW() - INTERVAL '7 days'; -- 7-day grace period
  
  -- Return results
  RETURN QUERY SELECT v_processed, v_archived, v_deleted, v_cost_savings;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- USER STORAGE ANALYTICS FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION get_user_storage_analytics(p_user_id UUID)
RETURNS TABLE(
  total_files INTEGER,
  total_size_gb DECIMAL(10,3),
  hot_files INTEGER,
  hot_size_gb DECIMAL(10,3),
  warm_files INTEGER,
  warm_size_gb DECIMAL(10,3),
  archive_files INTEGER,
  archive_size_gb DECIMAL(10,3),
  favorite_files INTEGER,
  favorite_size_gb DECIMAL(10,3),
  monthly_cost_thb DECIMAL(10,2),
  potential_savings_thb DECIMAL(10,2),
  plan_name TEXT,
  storage_limit_gb INTEGER,
  storage_used_percentage DECIMAL(5,2)
) AS $$
BEGIN
  RETURN QUERY
  WITH storage_stats AS (
    SELECT 
      COUNT(*)::INTEGER as total_files,
      ROUND(SUM(pf.file_size::decimal / 1024 / 1024 / 1024), 3) as total_size_gb,
      COUNT(CASE WHEN pf.processing_status IN ('ready', 'uploaded') THEN 1 END)::INTEGER as hot_files,
      ROUND(SUM(CASE WHEN pf.processing_status IN ('ready', 'uploaded') 
                THEN pf.file_size::decimal / 1024 / 1024 / 1024 ELSE 0 END), 3) as hot_size_gb,
      COUNT(CASE WHEN pf.processing_status = 'warm_storage' THEN 1 END)::INTEGER as warm_files,
      ROUND(SUM(CASE WHEN pf.processing_status = 'warm_storage' 
                THEN pf.file_size::decimal / 1024 / 1024 / 1024 ELSE 0 END), 3) as warm_size_gb,
      COUNT(CASE WHEN pf.processing_status IN ('archived', 'favorite_archive') THEN 1 END)::INTEGER as archive_files,
      ROUND(SUM(CASE WHEN pf.processing_status IN ('archived', 'favorite_archive') 
                THEN pf.file_size::decimal / 1024 / 1024 / 1024 ELSE 0 END), 3) as archive_size_gb,
      COUNT(CASE WHEN pf.is_favorite THEN 1 END)::INTEGER as favorite_files,
      ROUND(SUM(CASE WHEN pf.is_favorite 
                THEN pf.file_size::decimal / 1024 / 1024 / 1024 ELSE 0 END), 3) as favorite_size_gb
    FROM project_files pf
    WHERE pf.user_id = p_user_id 
      AND pf.processing_status != 'deleted'
  ),
  user_plan AS (
    SELECT sp.name, sp.storage_gb
    FROM user_subscriptions us
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE us.user_id = p_user_id AND us.status = 'active'
    LIMIT 1
  )
  SELECT 
    ss.total_files,
    ss.total_size_gb,
    ss.hot_files,
    ss.hot_size_gb,
    ss.warm_files,
    ss.warm_size_gb,
    ss.archive_files,
    ss.archive_size_gb,
    ss.favorite_files,
    ss.favorite_size_gb,
    ROUND((ss.hot_size_gb * 3.60 + ss.warm_size_gb * 2.16 + ss.archive_size_gb * 0.72), 2) as monthly_cost_thb,
    ROUND((ss.hot_size_gb * (3.60 - 0.72)), 2) as potential_savings_thb, -- If all hot files moved to archive
    up.name as plan_name,
    up.storage_gb as storage_limit_gb,
    ROUND((ss.total_size_gb / up.storage_gb * 100), 2) as storage_used_percentage
  FROM storage_stats ss
  CROSS JOIN user_plan up;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- COST MONITORING FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION check_user_cost_limits()
RETURNS TABLE(
  user_id UUID,
  plan_name TEXT,
  current_cost_thb DECIMAL(10,2),
  cost_limit_thb DECIMAL(10,2),
  cost_percentage DECIMAL(5,2),
  alert_level TEXT,
  storage_gb DECIMAL(10,3)
) AS $$
BEGIN
  RETURN QUERY
  WITH user_costs AS (
    SELECT 
      pf.user_id,
      sp.name as plan_name,
      ROUND((
        SUM(CASE WHEN pf.processing_status IN ('ready', 'uploaded') 
            THEN pf.file_size::decimal / 1024 / 1024 / 1024 * 3.60 
            ELSE 0 END) +
        SUM(CASE WHEN pf.processing_status = 'warm_storage' 
            THEN pf.file_size::decimal / 1024 / 1024 / 1024 * 2.16 
            ELSE 0 END) +
        SUM(CASE WHEN pf.processing_status IN ('archived', 'favorite_archive') 
            THEN pf.file_size::decimal / 1024 / 1024 / 1024 * 0.72 
            ELSE 0 END)
      ), 2) as current_cost_thb,
      ROUND(SUM(pf.file_size::decimal / 1024 / 1024 / 1024), 3) as storage_gb
    FROM project_files pf
    JOIN projects p ON pf.project_id = p.id
    JOIN user_subscriptions us ON p.user_id = us.user_id
    JOIN subscription_plans sp ON us.plan_id = sp.id
    WHERE pf.processing_status != 'deleted'
      AND us.status = 'active'
    GROUP BY pf.user_id, sp.name
  )
  SELECT 
    uc.user_id,
    uc.plan_name,
    uc.current_cost_thb,
    CASE uc.plan_name
      WHEN 'freemium' THEN 50.00::DECIMAL(10,2)
      WHEN 'creator' THEN 200.00::DECIMAL(10,2)
      WHEN 'pro' THEN 800.00::DECIMAL(10,2)
      WHEN 'studio' THEN 3000.00::DECIMAL(10,2)
      ELSE 50.00::DECIMAL(10,2)
    END as cost_limit_thb,
    ROUND((uc.current_cost_thb / CASE uc.plan_name
      WHEN 'freemium' THEN 50.00
      WHEN 'creator' THEN 200.00
      WHEN 'pro' THEN 800.00
      WHEN 'studio' THEN 3000.00
      ELSE 50.00
    END * 100), 2) as cost_percentage,
    CASE 
      WHEN uc.current_cost_thb / CASE uc.plan_name
        WHEN 'freemium' THEN 50.00
        WHEN 'creator' THEN 200.00
        WHEN 'pro' THEN 800.00
        WHEN 'studio' THEN 3000.00
        ELSE 50.00
      END >= 0.90 THEN 'critical'
      WHEN uc.current_cost_thb / CASE uc.plan_name
        WHEN 'freemium' THEN 50.00
        WHEN 'creator' THEN 200.00
        WHEN 'pro' THEN 800.00
        WHEN 'studio' THEN 3000.00
        ELSE 50.00
      END >= 0.75 THEN 'warning'
      ELSE 'ok'
    END as alert_level,
    uc.storage_gb
  FROM user_costs uc
  WHERE uc.current_cost_thb > 10; -- Only return users with significant costs
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- STORAGE CLEANUP OPTIMIZATION FUNCTION
-- ==========================================

CREATE OR REPLACE FUNCTION optimize_user_storage(p_user_id UUID, p_aggressive BOOLEAN DEFAULT FALSE)
RETURNS TABLE(
  files_processed INTEGER,
  storage_freed_gb DECIMAL(10,3),
  cost_savings_thb DECIMAL(10,2),
  optimization_actions TEXT[]
) AS $$
DECLARE
  v_files_processed INTEGER := 0;
  v_storage_freed DECIMAL(10,3) := 0;
  v_cost_savings DECIMAL(10,2) := 0;
  v_actions TEXT[] := ARRAY[]::TEXT[];
  file_record RECORD;
BEGIN
  
  -- Archive old hot storage files
  FOR file_record IN 
    SELECT * FROM project_files 
    WHERE user_id = p_user_id 
      AND processing_status IN ('ready', 'uploaded')
      AND updated_at < NOW() - INTERVAL '7 days'
      AND NOT is_favorite
  LOOP
    UPDATE project_files 
    SET 
      processing_status = 'archived',
      metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
        'optimization_archived_at', NOW(),
        'optimization_reason', 'cost_optimization'
      ),
      updated_at = NOW()
    WHERE id = file_record.id;
    
    v_files_processed := v_files_processed + 1;
    v_storage_freed := v_storage_freed + (file_record.file_size::decimal / 1024 / 1024 / 1024);
    v_cost_savings := v_cost_savings + 
      (file_record.file_size::decimal / 1024 / 1024 / 1024) * (3.60 - 0.72);
    v_actions := array_append(v_actions, 'archived_old_files');
  END LOOP;
  
  -- If aggressive optimization, delete very old archived files (non-favorites)
  IF p_aggressive THEN
    FOR file_record IN 
      SELECT * FROM project_files 
      WHERE user_id = p_user_id 
        AND processing_status = 'archived'
        AND updated_at < NOW() - INTERVAL '6 months'
        AND NOT is_favorite
    LOOP
      UPDATE project_files 
      SET 
        processing_status = 'deleted',
        deleted_at = NOW(),
        metadata = COALESCE(metadata, '{}'::jsonb) || jsonb_build_object(
          'optimization_deleted_at', NOW(),
          'optimization_reason', 'aggressive_cost_optimization'
        )
      WHERE id = file_record.id;
      
      v_files_processed := v_files_processed + 1;
      v_storage_freed := v_storage_freed + (file_record.file_size::decimal / 1024 / 1024 / 1024);
      v_cost_savings := v_cost_savings + 
        (file_record.file_size::decimal / 1024 / 1024 / 1024) * 0.72;
      v_actions := array_append(v_actions, 'deleted_old_archived_files');
    END LOOP;
  END IF;
  
  -- Log the optimization
  INSERT INTO activity_logs (user_id, action, details)
  VALUES (
    p_user_id,
    'storage_optimization',
    jsonb_build_object(
      'files_processed', v_files_processed,
      'storage_freed_gb', v_storage_freed,
      'cost_savings_thb', v_cost_savings,
      'aggressive_mode', p_aggressive,
      'actions', v_actions
    )
  );
  
  RETURN QUERY SELECT v_files_processed, v_storage_freed, v_cost_savings, v_actions;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- SCHEDULE AUTOMATED TASKS
-- ==========================================

-- Schedule daily file lifecycle management (runs at 2 AM)
SELECT cron.schedule(
  'eyemotion-file-lifecycle',
  '0 2 * * *',
  'SELECT manage_file_lifecycle();'
);

-- Schedule hourly cost monitoring (runs every hour)
SELECT cron.schedule(
  'eyemotion-cost-monitoring', 
  '0 * * * *',
  'INSERT INTO activity_logs (action, details) 
   SELECT ''cost_monitoring_check'', 
          jsonb_build_object(''alerts'', json_agg(row_to_json(cost_check)))
   FROM (SELECT * FROM check_user_cost_limits() WHERE alert_level != ''ok'') cost_check;'
);

-- Schedule weekly storage statistics refresh (runs Sunday at 1 AM)
SELECT cron.schedule(
  'eyemotion-storage-stats-refresh',
  '0 1 * * 0',
  'REFRESH MATERIALIZED VIEW IF EXISTS user_storage_usage;'
);

-- ==========================================
-- UTILITY FUNCTIONS
-- ==========================================

-- Function to get file lifecycle recommendations for a user
CREATE OR REPLACE FUNCTION get_lifecycle_recommendations(p_user_id UUID)
RETURNS TABLE(
  recommendation_type TEXT,
  affected_files INTEGER,
  potential_savings_thb DECIMAL(10,2),
  description TEXT
) AS $$
BEGIN
  RETURN QUERY
  -- Recommend archiving old hot files
  SELECT 
    'archive_old_files'::TEXT,
    COUNT(*)::INTEGER,
    ROUND(SUM(file_size::decimal / 1024 / 1024 / 1024) * (3.60 - 0.72), 2),
    'Archive files older than 30 days to reduce storage costs by 75%'::TEXT
  FROM project_files 
  WHERE user_id = p_user_id 
    AND processing_status IN ('ready', 'uploaded')
    AND updated_at < NOW() - INTERVAL '30 days'
    AND NOT is_favorite
  HAVING COUNT(*) > 0
  
  UNION ALL
  
  -- Recommend deleting very old archived files
  SELECT 
    'delete_old_archived'::TEXT,
    COUNT(*)::INTEGER,
    ROUND(SUM(file_size::decimal / 1024 / 1024 / 1024) * 0.72, 2),
    'Delete archived files older than 1 year to eliminate storage costs'::TEXT
  FROM project_files 
  WHERE user_id = p_user_id 
    AND processing_status = 'archived'
    AND updated_at < NOW() - INTERVAL '1 year'
    AND NOT is_favorite
  HAVING COUNT(*) > 0
  
  UNION ALL
  
  -- Recommend marking important files as favorites
  SELECT 
    'mark_favorites'::TEXT,
    COUNT(*)::INTEGER,
    0.00::DECIMAL(10,2),
    'Mark important files as favorites to protect them from automatic deletion'::TEXT
  FROM project_files 
  WHERE user_id = p_user_id 
    AND NOT is_favorite
    AND (
      file_type LIKE '%final%' OR 
      file_type LIKE '%master%' OR
      filename ILIKE '%final%' OR
      filename ILIKE '%master%'
    )
  HAVING COUNT(*) > 0;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_project_files_lifecycle 
ON project_files(user_id, processing_status, updated_at, is_favorite);

CREATE INDEX IF NOT EXISTS idx_project_files_size_status 
ON project_files(processing_status, file_size) 
WHERE processing_status != 'deleted';

CREATE INDEX IF NOT EXISTS idx_activity_logs_cost_monitoring 
ON activity_logs(action, created_at) 
WHERE action IN ('cost_alert', 'storage_optimization', 'file_lifecycle_change');

-- Grant necessary permissions
GRANT EXECUTE ON FUNCTION calculate_storage_usage() TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION manage_file_lifecycle() TO service_role;
GRANT EXECUTE ON FUNCTION get_user_storage_analytics(UUID) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION check_user_cost_limits() TO service_role;
GRANT EXECUTE ON FUNCTION optimize_user_storage(UUID, BOOLEAN) TO authenticated, service_role;
GRANT EXECUTE ON FUNCTION get_lifecycle_recommendations(UUID) TO authenticated, service_role;

-- Final comment
COMMENT ON FUNCTION manage_file_lifecycle() IS 'EyeMotion automated file lifecycle management - runs daily to optimize storage costs';
COMMENT ON FUNCTION calculate_storage_usage() IS 'Calculate storage usage statistics for all users with cost breakdown';
COMMENT ON FUNCTION check_user_cost_limits() IS 'Monitor user storage costs and generate alerts when approaching limits';