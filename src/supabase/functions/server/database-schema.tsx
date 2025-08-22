// EyeMotion Complete Database Schema - Edge Function Version
import { DATABASE_CONSTANTS, SQL_HELPERS, SQL_PATTERNS } from './database-constants.tsx';

const { TABLES, USER_ROLES, SUBSCRIPTION_STATUS, PROJECT_TYPES, PROJECT_STATUS, PROCESSING_STATUS, PAYMENT_STATUS, TRANSACTION_TYPES, DEFAULTS, SUBSCRIPTION_PLANS } = DATABASE_CONSTANTS;
const { createUpdateTrigger, enableRLS, createIndex, createRLSPolicy, RLS_CONDITIONS } = SQL_HELPERS;
const { TIMESTAMPS, UUID_PRIMARY_KEY, METADATA_JSONB, CHECK_CONSTRAINTS } = SQL_PATTERNS;

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
-- USER PROFILES TABLE
-- ==========================================
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

  -- Create indexes
  ${createIndex('idx_user_profiles_role', TABLES.USER_PROFILES, 'role')}
  ${createIndex('idx_user_profiles_country', TABLES.USER_PROFILES, 'country')}
  ${createIndex('idx_user_profiles_industry', TABLES.USER_PROFILES, 'industry')}
  ${createIndex('idx_user_profiles_created_at', TABLES.USER_PROFILES, 'created_at')}

  -- Enable RLS
  ${enableRLS(TABLES.USER_PROFILES)}

  -- RLS Policies
  ${createRLSPolicy('Users can view own profile', TABLES.USER_PROFILES, 'SELECT', RLS_CONDITIONS.OWN_ID)}
  ${createRLSPolicy('Users can update own profile', TABLES.USER_PROFILES, 'UPDATE', RLS_CONDITIONS.OWN_ID)}
  ${createRLSPolicy('Admins can view all profiles', TABLES.USER_PROFILES, 'ALL', RLS_CONDITIONS.ADMIN_ACCESS)}

  -- Updated at trigger
  ${createUpdateTrigger(TABLES.USER_PROFILES)}

  -- Helper functions
  CREATE OR REPLACE FUNCTION create_user_profile_on_signup()
  RETURNS TRIGGER AS $trigger$
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
  $trigger$ LANGUAGE plpgsql SECURITY DEFINER;

  DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
  CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION create_user_profile_on_signup();
END;
$$ LANGUAGE plpgsql;

-- ==========================================  
-- SUBSCRIPTION PLANS TABLE
-- ==========================================
CREATE OR REPLACE FUNCTION create_subscription_plans_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS ${TABLES.SUBSCRIPTION_PLANS} (
    ${UUID_PRIMARY_KEY},
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    currency TEXT DEFAULT '${DEFAULTS.CURRENCY}',
    billing_interval TEXT DEFAULT '${DEFAULTS.BILLING_INTERVAL}' CHECK (billing_interval IN ('month', 'year')),
    credits_included INTEGER DEFAULT 0,
    storage_gb INTEGER DEFAULT ${DEFAULTS.STORAGE_GB},
    features JSONB DEFAULT '[]',
    stripe_price_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    ${TIMESTAMPS}
  );

  -- Create indexes
  ${createIndex('idx_subscription_plans_active', TABLES.SUBSCRIPTION_PLANS, 'is_active')}
  ${createIndex('idx_subscription_plans_price', TABLES.SUBSCRIPTION_PLANS, 'price')}
  ${createIndex('idx_subscription_plans_sort', TABLES.SUBSCRIPTION_PLANS, 'sort_order')}

  -- Insert default plans
  ${Object.entries(SUBSCRIPTION_PLANS).map(([key, plan]) => `
    INSERT INTO ${TABLES.SUBSCRIPTION_PLANS} (
      name, display_name, description, price, credits_included, 
      storage_gb, features, sort_order
    ) VALUES (
      '${plan.name}', 
      '${plan.display_name}', 
      '${plan.description}', 
      ${plan.price}, 
      ${plan.credits_included}, 
      ${plan.storage_gb}, 
      '${JSON.stringify(plan.features)}',
      ${Object.keys(SUBSCRIPTION_PLANS).indexOf(key)}
    ) ON CONFLICT (name) DO UPDATE SET
      display_name = EXCLUDED.display_name,
      description = EXCLUDED.description,
      price = EXCLUDED.price,
      credits_included = EXCLUDED.credits_included,
      storage_gb = EXCLUDED.storage_gb,
      features = EXCLUDED.features,
      updated_at = NOW();
  `).join('')}

  -- Enable RLS
  ${enableRLS(TABLES.SUBSCRIPTION_PLANS)}
  
  ${createRLSPolicy('Authenticated users can view plans', TABLES.SUBSCRIPTION_PLANS, 'SELECT', RLS_CONDITIONS.AUTHENTICATED)}
  ${createRLSPolicy('Admins can manage plans', TABLES.SUBSCRIPTION_PLANS, 'ALL', RLS_CONDITIONS.ADMIN_ACCESS)}

  -- Updated at trigger
  ${createUpdateTrigger(TABLES.SUBSCRIPTION_PLANS)}
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- USER SUBSCRIPTIONS TABLE
-- ==========================================
CREATE OR REPLACE FUNCTION create_user_subscriptions_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS ${TABLES.USER_SUBSCRIPTIONS} (
    ${UUID_PRIMARY_KEY},
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES ${TABLES.SUBSCRIPTION_PLANS}(id),
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    status TEXT DEFAULT '${SUBSCRIPTION_STATUS.ACTIVE}' ${CHECK_CONSTRAINTS.STATUS(Object.values(SUBSCRIPTION_STATUS))},
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    cancelled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    credits_included INTEGER DEFAULT 0,
    credits_used INTEGER DEFAULT 0,
    extra_credits INTEGER DEFAULT 0,
    storage_used_gb DECIMAL(10,2) DEFAULT 0,
    ${METADATA_JSONB},
    ${TIMESTAMPS},
    
    UNIQUE(user_id, status) WHERE status = '${SUBSCRIPTION_STATUS.ACTIVE}'
  );

  -- Create indexes
  ${createIndex('idx_user_subscriptions_user_id', TABLES.USER_SUBSCRIPTIONS, 'user_id')}
  ${createIndex('idx_user_subscriptions_status', TABLES.USER_SUBSCRIPTIONS, 'status')}
  ${createIndex('idx_user_subscriptions_stripe_id', TABLES.USER_SUBSCRIPTIONS, 'stripe_subscription_id')}
  ${createIndex('idx_user_subscriptions_period', TABLES.USER_SUBSCRIPTIONS, 'current_period_start, current_period_end')}

  -- Enable RLS
  ${enableRLS(TABLES.USER_SUBSCRIPTIONS)}
  
  ${createRLSPolicy('Users can view own subscription', TABLES.USER_SUBSCRIPTIONS, 'SELECT', RLS_CONDITIONS.OWN_RECORD)}
  ${createRLSPolicy('Users can update own subscription', TABLES.USER_SUBSCRIPTIONS, 'UPDATE', RLS_CONDITIONS.OWN_RECORD)}
  ${createRLSPolicy('Admins can view all subscriptions', TABLES.USER_SUBSCRIPTIONS, 'ALL', RLS_CONDITIONS.ADMIN_ACCESS)}

  -- Updated at trigger
  ${createUpdateTrigger(TABLES.USER_SUBSCRIPTIONS)}
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PROJECTS TABLE
-- ==========================================
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
    total_duration INTEGER DEFAULT 0,
    export_count INTEGER DEFAULT 0,
    last_opened_at TIMESTAMPTZ DEFAULT NOW(),
    ${TIMESTAMPS}
  );

  -- Create indexes
  ${createIndex('idx_projects_user_id', TABLES.PROJECTS, 'user_id')}
  ${createIndex('idx_projects_status', TABLES.PROJECTS, 'status')}
  ${createIndex('idx_projects_type', TABLES.PROJECTS, 'type')}
  ${createIndex('idx_projects_created_at', TABLES.PROJECTS, 'created_at')}
  ${createIndex('idx_projects_last_opened', TABLES.PROJECTS, 'last_opened_at')}

  -- Enable RLS
  ${enableRLS(TABLES.PROJECTS)}
  
  ${createRLSPolicy('Users can manage own projects', TABLES.PROJECTS, 'ALL', RLS_CONDITIONS.OWN_RECORD)}
  ${createRLSPolicy('Admins can view all projects', TABLES.PROJECTS, 'SELECT', RLS_CONDITIONS.ADMIN_ACCESS)}

  -- Updated at trigger
  ${createUpdateTrigger(TABLES.PROJECTS)}
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PROJECT FILES TABLE
-- ==========================================
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
    duration INTEGER,
    resolution TEXT,
    fps DECIMAL(5,2),
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

  -- Create indexes
  ${createIndex('idx_project_files_project_id', TABLES.PROJECT_FILES, 'project_id')}
  ${createIndex('idx_project_files_user_id', TABLES.PROJECT_FILES, 'user_id')}
  ${createIndex('idx_project_files_type', TABLES.PROJECT_FILES, 'file_type')}
  ${createIndex('idx_project_files_status', TABLES.PROJECT_FILES, 'processing_status')}
  ${createIndex('idx_project_files_created_at', TABLES.PROJECT_FILES, 'created_at')}
  CREATE INDEX IF NOT EXISTS idx_project_files_tags ON ${TABLES.PROJECT_FILES} USING GIN(tags);

  -- Enable RLS
  ${enableRLS(TABLES.PROJECT_FILES)}
  
  ${createRLSPolicy('Users can manage own project files', TABLES.PROJECT_FILES, 'ALL', RLS_CONDITIONS.OWN_RECORD)}
  ${createRLSPolicy('Admins can view all files', TABLES.PROJECT_FILES, 'SELECT', RLS_CONDITIONS.ADMIN_ACCESS)}

  -- Updated at trigger
  ${createUpdateTrigger(TABLES.PROJECT_FILES)}

  -- File count trigger
  CREATE OR REPLACE FUNCTION update_project_file_count()
  RETURNS TRIGGER AS $trigger$
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
  $trigger$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS trigger_update_project_file_count ON ${TABLES.PROJECT_FILES};
  CREATE TRIGGER trigger_update_project_file_count
    AFTER INSERT OR DELETE ON ${TABLES.PROJECT_FILES}
    FOR EACH ROW EXECUTE FUNCTION update_project_file_count();
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- CREDITS USAGE TABLE
-- ==========================================
CREATE OR REPLACE FUNCTION create_credits_usage_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS ${TABLES.CREDITS_USAGE} (
    ${UUID_PRIMARY_KEY},
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES ${TABLES.USER_SUBSCRIPTIONS}(id),
    credits_used INTEGER NOT NULL ${CHECK_CONSTRAINTS.POSITIVE_NUMBER('credits_used')},
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  ${createIndex('idx_credits_usage_user_id', TABLES.CREDITS_USAGE, 'user_id')}
  ${createIndex('idx_credits_usage_subscription_id', TABLES.CREDITS_USAGE, 'subscription_id')}
  ${createIndex('idx_credits_usage_action', TABLES.CREDITS_USAGE, 'action')}
  ${createIndex('idx_credits_usage_created_at', TABLES.CREDITS_USAGE, 'created_at')}
  ${createIndex('idx_credits_usage_resource', TABLES.CREDITS_USAGE, 'resource_type, resource_id')}

  -- Enable RLS
  ${enableRLS(TABLES.CREDITS_USAGE)}
  
  ${createRLSPolicy('Users can view own credits usage', TABLES.CREDITS_USAGE, 'SELECT', RLS_CONDITIONS.OWN_RECORD)}
  ${createRLSPolicy('System can insert credits usage', TABLES.CREDITS_USAGE, 'INSERT', 'true')}
  ${createRLSPolicy('Admins can view all credits usage', TABLES.CREDITS_USAGE, 'SELECT', RLS_CONDITIONS.ADMIN_ACCESS)}
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- PAYMENT TRANSACTIONS TABLE
-- ==========================================
CREATE OR REPLACE FUNCTION create_payment_transactions_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS ${TABLES.PAYMENT_TRANSACTIONS} (
    ${UUID_PRIMARY_KEY},
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    stripe_subscription_id TEXT,
    amount INTEGER NOT NULL ${CHECK_CONSTRAINTS.POSITIVE_NUMBER('amount')},
    currency TEXT DEFAULT '${DEFAULTS.CURRENCY}',
    status TEXT NOT NULL ${CHECK_CONSTRAINTS.STATUS(Object.values(PAYMENT_STATUS))},
    payment_method TEXT DEFAULT 'stripe',
    transaction_type TEXT DEFAULT '${TRANSACTION_TYPES.SUBSCRIPTION}' ${CHECK_CONSTRAINTS.STATUS(Object.values(TRANSACTION_TYPES))},
    description TEXT,
    invoice_url TEXT,
    receipt_url TEXT,
    ${METADATA_JSONB},
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  ${createIndex('idx_payment_transactions_user_id', TABLES.PAYMENT_TRANSACTIONS, 'user_id')}
  ${createIndex('idx_payment_transactions_status', TABLES.PAYMENT_TRANSACTIONS, 'status')}
  ${createIndex('idx_payment_transactions_type', TABLES.PAYMENT_TRANSACTIONS, 'transaction_type')}
  ${createIndex('idx_payment_transactions_stripe_id', TABLES.PAYMENT_TRANSACTIONS, 'stripe_payment_intent_id')}
  ${createIndex('idx_payment_transactions_created_at', TABLES.PAYMENT_TRANSACTIONS, 'created_at')}

  -- Enable RLS
  ${enableRLS(TABLES.PAYMENT_TRANSACTIONS)}
  
  ${createRLSPolicy('Users can view own transactions', TABLES.PAYMENT_TRANSACTIONS, 'SELECT', RLS_CONDITIONS.OWN_RECORD)}
  ${createRLSPolicy('System can manage transactions', TABLES.PAYMENT_TRANSACTIONS, 'ALL', 'true')}
  ${createRLSPolicy('Admins can view all transactions', TABLES.PAYMENT_TRANSACTIONS, 'SELECT', RLS_CONDITIONS.ADMIN_ACCESS)}
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- ACTIVITY LOGS TABLE
-- ==========================================
CREATE OR REPLACE FUNCTION create_activity_logs_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS ${TABLES.ACTIVITY_LOGS} (
    ${UUID_PRIMARY_KEY},
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    details JSONB DEFAULT '{}',
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  ${createIndex('idx_activity_logs_user_id', TABLES.ACTIVITY_LOGS, 'user_id')}
  ${createIndex('idx_activity_logs_action', TABLES.ACTIVITY_LOGS, 'action')}
  ${createIndex('idx_activity_logs_resource', TABLES.ACTIVITY_LOGS, 'resource_type, resource_id')}
  ${createIndex('idx_activity_logs_created_at', TABLES.ACTIVITY_LOGS, 'created_at')}

  -- Enable RLS
  ${enableRLS(TABLES.ACTIVITY_LOGS)}
  
  ${createRLSPolicy('Users can view own activity logs', TABLES.ACTIVITY_LOGS, 'SELECT', RLS_CONDITIONS.OWN_RECORD)}
  ${createRLSPolicy('System can insert activity logs', TABLES.ACTIVITY_LOGS, 'INSERT', 'true')}
  ${createRLSPolicy('Admins can view all activity logs', TABLES.ACTIVITY_LOGS, 'SELECT', RLS_CONDITIONS.ADMIN_ACCESS)}
END;
$$ LANGUAGE plpgsql;

-- ==========================================
-- HELPER FUNCTIONS
-- ==========================================

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_current_subscription(p_user_id UUID)
RETURNS TABLE(
  subscription_id UUID,
  plan_name TEXT,
  plan_display_name TEXT,
  credits_remaining INTEGER,
  storage_used_gb DECIMAL,
  storage_limit_gb INTEGER,
  status TEXT,
  current_period_end TIMESTAMPTZ
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id as subscription_id,
    sp.name as plan_name,
    sp.display_name as plan_display_name,
    (us.credits_included + us.extra_credits - us.credits_used) as credits_remaining,
    us.storage_used_gb,
    sp.storage_gb as storage_limit_gb,
    us.status,
    us.current_period_end
  FROM ${TABLES.USER_SUBSCRIPTIONS} us
  JOIN ${TABLES.SUBSCRIPTION_PLANS} sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id 
    AND us.status = '${SUBSCRIPTION_STATUS.ACTIVE}'
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to deduct credits
CREATE OR REPLACE FUNCTION deduct_user_credits(
  p_user_id UUID, 
  p_credits_to_deduct INTEGER,
  p_action TEXT DEFAULT 'general_usage'
)
RETURNS TABLE(
  success BOOLEAN,
  remaining_credits INTEGER,
  error_message TEXT
) AS $$
DECLARE
  v_subscription_id UUID;
  v_total_available INTEGER;
BEGIN
  -- Get current subscription
  SELECT 
    id,
    (credits_included + extra_credits - credits_used)
  INTO v_subscription_id, v_total_available
  FROM ${TABLES.USER_SUBSCRIPTIONS}
  WHERE user_id = p_user_id 
    AND status = '${SUBSCRIPTION_STATUS.ACTIVE}'
  LIMIT 1;

  -- Check if subscription exists
  IF v_subscription_id IS NULL THEN
    RETURN QUERY SELECT FALSE, 0, 'No active subscription found';
    RETURN;
  END IF;

  -- Check if enough credits
  IF v_total_available < p_credits_to_deduct THEN
    RETURN QUERY SELECT FALSE, v_total_available, 'Insufficient credits';
    RETURN;
  END IF;

  -- Deduct credits
  UPDATE ${TABLES.USER_SUBSCRIPTIONS}
  SET credits_used = credits_used + p_credits_to_deduct,
      updated_at = NOW()
  WHERE id = v_subscription_id;

  -- Log the usage
  INSERT INTO ${TABLES.CREDITS_USAGE} (
    user_id, subscription_id, credits_used, action, created_at
  ) VALUES (
    p_user_id, v_subscription_id, p_credits_to_deduct, p_action, NOW()
  );

  -- Return success
  RETURN QUERY SELECT TRUE, (v_total_available - p_credits_to_deduct), ''::TEXT;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ==========================================
-- EXECUTE ALL TABLE CREATION FUNCTIONS
-- ==========================================

-- Execute all setup functions
SELECT create_user_profiles_table();
SELECT create_subscription_plans_table();
SELECT create_user_subscriptions_table();  
SELECT create_projects_table();
SELECT create_project_files_table();
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

-- Final comment
COMMENT ON SCHEMA public IS 'EyeMotion Professional AI Film Ecosystem Database Schema v1.0.0';
`;

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
      ('${TABLES.USER_PROFILES}'),
      ('${TABLES.SUBSCRIPTION_PLANS}'),
      ('${TABLES.USER_SUBSCRIPTIONS}'), 
      ('${TABLES.PROJECTS}'),
      ('${TABLES.PROJECT_FILES}'),
      ('${TABLES.CREDITS_USAGE}'),
      ('${TABLES.PAYMENT_TRANSACTIONS}'),
      ('${TABLES.ACTIVITY_LOGS}')
    ) AS t(table_name)
    ORDER BY table_name;
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
      '${TABLES.USER_PROFILES}' as table_name,
      COUNT(*) as row_count
    FROM ${TABLES.USER_PROFILES}
    UNION ALL
    SELECT '${TABLES.SUBSCRIPTION_PLANS}', COUNT(*) FROM ${TABLES.SUBSCRIPTION_PLANS}
    UNION ALL
    SELECT '${TABLES.USER_SUBSCRIPTIONS}', COUNT(*) FROM ${TABLES.USER_SUBSCRIPTIONS}
    UNION ALL
    SELECT '${TABLES.PROJECTS}', COUNT(*) FROM ${TABLES.PROJECTS}
    UNION ALL
    SELECT '${TABLES.PROJECT_FILES}', COUNT(*) FROM ${TABLES.PROJECT_FILES}
    UNION ALL
    SELECT '${TABLES.CREDITS_USAGE}', COUNT(*) FROM ${TABLES.CREDITS_USAGE}
    UNION ALL
    SELECT '${TABLES.PAYMENT_TRANSACTIONS}', COUNT(*) FROM ${TABLES.PAYMENT_TRANSACTIONS}
    UNION ALL
    SELECT '${TABLES.ACTIVITY_LOGS}', COUNT(*) FROM ${TABLES.ACTIVITY_LOGS}
    ORDER BY table_name;
  `
};

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

// Export complete schema for use in server initialization
export const initializeDatabase = () => COMPLETE_DATABASE_SCHEMA;

// Default export
export default {
  COMPLETE_DATABASE_SCHEMA,
  TABLE_FUNCTIONS,
  SCHEMA_VALIDATION,
  HEALTH_CHECKS,
  initializeDatabase
};