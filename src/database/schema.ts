// EyeMotion Complete Database Schema
// Main schema file that imports and executes all table schemas

import { SQL_HELPERS } from './constants';
import { SETUP_USER_PROFILES } from './tables/user-profiles';
import { SETUP_SUBSCRIPTIONS } from './tables/subscriptions';  
import { SETUP_PROJECTS } from './tables/projects';
import { SETUP_PAYMENTS } from './tables/payments';
import { SETUP_VIEWS } from './views';

// Complete database schema setup SQL
export const COMPLETE_DATABASE_SCHEMA = `
-- ==========================================
-- EyeMotion Professional AI Film Ecosystem
-- Complete Database Schema Setup
-- ==========================================

-- Enable required extensions
${SQL_HELPERS.ENABLE_UUID}

-- Create shared functions
${SQL_HELPERS.UPDATE_TIMESTAMP_FUNCTION}

-- ==========================================
-- USER PROFILES SETUP
-- ==========================================
${SETUP_USER_PROFILES}

-- ==========================================  
-- SUBSCRIPTIONS SETUP
-- ==========================================
${SETUP_SUBSCRIPTIONS}

-- ==========================================
-- PROJECTS & FILES SETUP  
-- ==========================================
${SETUP_PROJECTS}

-- ==========================================
-- PAYMENTS & CREDITS SETUP
-- ==========================================
${SETUP_PAYMENTS}

-- ==========================================
-- ANALYTICS VIEWS SETUP
-- ==========================================
${SETUP_VIEWS}

-- ==========================================
-- EXECUTE ALL TABLE CREATION FUNCTIONS
-- ==========================================

-- Execute user profiles setup
SELECT create_user_profiles_table();

-- Execute subscription setup
SELECT create_subscription_plans_table();
SELECT create_user_subscriptions_table();  

-- Execute projects setup
SELECT create_projects_table();
SELECT create_project_files_table();

-- Execute payments setup
SELECT create_credits_usage_table();
SELECT create_payment_transactions_table();
SELECT create_activity_logs_table();

-- ==========================================
-- DATABASE INITIALIZATION COMPLETE
-- ==========================================

-- Add schema version for tracking
CREATE TABLE IF NOT EXISTS schema_version (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_version (version, description) VALUES 
('1.0.0', 'Initial EyeMotion database schema with user profiles, subscriptions, projects, files, payments, and analytics')
ON CONFLICT (version) DO UPDATE SET applied_at = NOW();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Enable realtime for specific tables (if using Supabase realtime)
-- ALTER PUBLICATION supabase_realtime ADD TABLE user_profiles;
-- ALTER PUBLICATION supabase_realtime ADD TABLE projects;
-- ALTER PUBLICATION supabase_realtime ADD TABLE project_files;

-- Final comment
COMMENT ON SCHEMA public IS 'EyeMotion Professional AI Film Ecosystem Database Schema v1.0.0';
`;

// Individual table creation functions for modularity
export const TABLE_FUNCTIONS = {
  createUserProfiles: () => 'SELECT create_user_profiles_table();',
  createSubscriptionPlans: () => 'SELECT create_subscription_plans_table();', 
  createUserSubscriptions: () => 'SELECT create_user_subscriptions_table();',
  createProjects: () => 'SELECT create_projects_table();',
  createProjectFiles: () => 'SELECT create_project_files_table();',
  createCreditsUsage: () => 'SELECT create_credits_usage_table();',
  createPaymentTransactions: () => 'SELECT create_payment_transactions_table();',
  createActivityLogs: () => 'SELECT create_activity_logs_table();'
};

// Schema validation functions
export const SCHEMA_VALIDATION = {
  // Check if all tables exist
  CHECK_TABLES_EXIST: `
    SELECT 
      table_name,
      CASE WHEN EXISTS (
        SELECT 1 FROM information_schema.tables 
        WHERE table_schema = 'public' AND table_name = t.table_name
      ) THEN 'EXISTS' ELSE 'MISSING' END as status
    FROM (VALUES 
      ('user_profiles'),
      ('subscription_plans'),
      ('user_subscriptions'), 
      ('projects'),
      ('project_files'),
      ('credits_usage'),
      ('payment_transactions'),
      ('activity_logs')
    ) AS t(table_name)
    ORDER BY table_name;
  `,

  // Check if all indexes exist
  CHECK_INDEXES_EXIST: `
    SELECT 
      schemaname,
      tablename,
      indexname,
      indexdef
    FROM pg_indexes 
    WHERE schemaname = 'public'
      AND tablename IN (
        'user_profiles', 'subscription_plans', 'user_subscriptions',
        'projects', 'project_files', 'credits_usage', 
        'payment_transactions', 'activity_logs'
      )
    ORDER BY tablename, indexname;
  `,

  // Check RLS policies
  CHECK_RLS_POLICIES: `
    SELECT 
      tablename,
      policyname,
      permissive,
      roles,
      cmd,
      qual
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `,

  // Verify schema version
  CHECK_SCHEMA_VERSION: `
    SELECT version, applied_at, description 
    FROM schema_version 
    ORDER BY applied_at DESC 
    LIMIT 1;
  `
};

// Database health check functions
export const HEALTH_CHECKS = {
  // Check database connection and basic functionality
  BASIC_HEALTH_CHECK: `
    SELECT 
      'database_connection' as check_type,
      'healthy' as status,
      NOW() as checked_at,
      version() as database_version;
  `,

  // Check table row counts
  TABLE_ROW_COUNTS: `
    SELECT 
      'user_profiles' as table_name,
      COUNT(*) as row_count
    FROM user_profiles
    UNION ALL
    SELECT 'subscription_plans', COUNT(*) FROM subscription_plans
    UNION ALL
    SELECT 'user_subscriptions', COUNT(*) FROM user_subscriptions
    UNION ALL
    SELECT 'projects', COUNT(*) FROM projects
    UNION ALL
    SELECT 'project_files', COUNT(*) FROM project_files
    UNION ALL
    SELECT 'credits_usage', COUNT(*) FROM credits_usage
    UNION ALL
    SELECT 'payment_transactions', COUNT(*) FROM payment_transactions
    UNION ALL
    SELECT 'activity_logs', COUNT(*) FROM activity_logs
    ORDER BY table_name;
  `,

  // Check for recent activity
  RECENT_ACTIVITY_CHECK: `
    SELECT 
      'recent_signups' as metric,
      COUNT(*) as count
    FROM user_profiles 
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    UNION ALL
    SELECT 
      'recent_projects' as metric,
      COUNT(*) as count
    FROM projects 
    WHERE created_at >= NOW() - INTERVAL '24 hours'
    UNION ALL
    SELECT 
      'recent_files' as metric,
      COUNT(*) as count
    FROM project_files 
    WHERE created_at >= NOW() - INTERVAL '24 hours';
  `
};

// Export complete schema for use in server initialization
export const initializeDatabase = () => COMPLETE_DATABASE_SCHEMA;

// Export individual components for testing or partial setup
export {
  SETUP_USER_PROFILES,
  SETUP_SUBSCRIPTIONS, 
  SETUP_PROJECTS,
  SETUP_PAYMENTS,
  SETUP_VIEWS
};

// Default export
export default {
  COMPLETE_DATABASE_SCHEMA,
  TABLE_FUNCTIONS,
  SCHEMA_VALIDATION,
  HEALTH_CHECKS,
  initializeDatabase
};