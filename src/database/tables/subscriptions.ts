// EyeMotion Subscription Tables Schema
import { DATABASE_CONSTANTS, SQL_HELPERS, SQL_PATTERNS } from '../constants';

const { TABLES, SUBSCRIPTION_STATUS, DEFAULTS, SUBSCRIPTION_PLANS, INDEXES } = DATABASE_CONSTANTS;
const { createUpdateTrigger, enableRLS, createIndex, createRLSPolicy, RLS_CONDITIONS } = SQL_HELPERS;
const { TIMESTAMPS, UUID_PRIMARY_KEY, CHECK_CONSTRAINTS } = SQL_PATTERNS;

export const SUBSCRIPTION_SCHEMA = {
  // Subscription Plans Table
  CREATE_PLANS_TABLE: `
    CREATE OR REPLACE FUNCTION create_subscription_plans_table()
    RETURNS VOID AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS ${TABLES.SUBSCRIPTION_PLANS} (
        ${UUID_PRIMARY_KEY},
        name TEXT UNIQUE NOT NULL,
        display_name TEXT NOT NULL,
        description TEXT,
        price INTEGER NOT NULL DEFAULT 0, -- In satang (Thai currency cents)
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
    END;
    $$ LANGUAGE plpgsql;
  `,

  // User Subscriptions Table
  CREATE_SUBSCRIPTIONS_TABLE: `
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
        metadata JSONB DEFAULT '{}',
        ${TIMESTAMPS},
        
        -- Ensure user has only one active subscription
        UNIQUE(user_id, status) WHERE status = '${SUBSCRIPTION_STATUS.ACTIVE}'
      );
    END;
    $$ LANGUAGE plpgsql;
  `,

  // Create indexes for both tables
  CREATE_INDEXES: [
    // Subscription Plans indexes
    createIndex(INDEXES.SUBSCRIPTION_PLANS[0], TABLES.SUBSCRIPTION_PLANS, 'is_active'),
    createIndex(INDEXES.SUBSCRIPTION_PLANS[1], TABLES.SUBSCRIPTION_PLANS, 'price'),
    createIndex(INDEXES.SUBSCRIPTION_PLANS[2], TABLES.SUBSCRIPTION_PLANS, 'sort_order'),
    
    // User Subscriptions indexes
    createIndex(INDEXES.USER_SUBSCRIPTIONS[0], TABLES.USER_SUBSCRIPTIONS, 'user_id'),
    createIndex(INDEXES.USER_SUBSCRIPTIONS[1], TABLES.USER_SUBSCRIPTIONS, 'status'),
    createIndex(INDEXES.USER_SUBSCRIPTIONS[2], TABLES.USER_SUBSCRIPTIONS, 'stripe_subscription_id'),
    createIndex(INDEXES.USER_SUBSCRIPTIONS[3], TABLES.USER_SUBSCRIPTIONS, 'current_period_start, current_period_end')
  ].join('\n'),

  // Setup RLS for both tables
  SETUP_RLS: `
    -- Subscription Plans RLS
    ${enableRLS(TABLES.SUBSCRIPTION_PLANS)}
    
    ${createRLSPolicy(
      'Authenticated users can view plans', 
      TABLES.SUBSCRIPTION_PLANS, 
      'SELECT', 
      RLS_CONDITIONS.AUTHENTICATED
    )}
    
    ${createRLSPolicy(
      'Admins can manage plans', 
      TABLES.SUBSCRIPTION_PLANS, 
      'ALL', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}

    -- User Subscriptions RLS
    ${enableRLS(TABLES.USER_SUBSCRIPTIONS)}
    
    ${createRLSPolicy(
      'Users can view own subscription', 
      TABLES.USER_SUBSCRIPTIONS, 
      'SELECT', 
      RLS_CONDITIONS.OWN_RECORD
    )}
    
    ${createRLSPolicy(
      'Users can update own subscription', 
      TABLES.USER_SUBSCRIPTIONS, 
      'UPDATE', 
      RLS_CONDITIONS.OWN_RECORD
    )}
    
    ${createRLSPolicy(
      'Admins can view all subscriptions', 
      TABLES.USER_SUBSCRIPTIONS, 
      'ALL', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}
  `,

  // Create triggers
  CREATE_TRIGGERS: [
    createUpdateTrigger(TABLES.SUBSCRIPTION_PLANS),
    createUpdateTrigger(TABLES.USER_SUBSCRIPTIONS)
  ].join('\n'),

  // Helper functions for subscriptions
  HELPER_FUNCTIONS: `
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

    -- Function to check if user has enough credits
    CREATE OR REPLACE FUNCTION check_user_credits(p_user_id UUID, p_credits_needed INTEGER)
    RETURNS BOOLEAN AS $$
    DECLARE
      v_credits_remaining INTEGER;
    BEGIN
      SELECT (credits_included + extra_credits - credits_used)
      INTO v_credits_remaining
      FROM ${TABLES.USER_SUBSCRIPTIONS}
      WHERE user_id = p_user_id 
        AND status = '${SUBSCRIPTION_STATUS.ACTIVE}'
      LIMIT 1;
      
      RETURN COALESCE(v_credits_remaining, 0) >= p_credits_needed;
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
      v_current_credits INTEGER;
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
      INSERT INTO credits_usage (
        user_id, subscription_id, credits_used, action, created_at
      ) VALUES (
        p_user_id, v_subscription_id, p_credits_to_deduct, p_action, NOW()
      );

      -- Return success
      RETURN QUERY SELECT TRUE, (v_total_available - p_credits_to_deduct), ''::TEXT;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to add extra credits
    CREATE OR REPLACE FUNCTION add_extra_credits(
      p_user_id UUID, 
      p_extra_credits INTEGER
    )
    RETURNS BOOLEAN AS $$
    BEGIN
      UPDATE ${TABLES.USER_SUBSCRIPTIONS}
      SET extra_credits = extra_credits + p_extra_credits,
          updated_at = NOW()
      WHERE user_id = p_user_id 
        AND status = '${SUBSCRIPTION_STATUS.ACTIVE}';
      
      RETURN FOUND;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to cancel subscription
    CREATE OR REPLACE FUNCTION cancel_user_subscription(p_user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      UPDATE ${TABLES.USER_SUBSCRIPTIONS}
      SET status = '${SUBSCRIPTION_STATUS.CANCELLED}',
          cancelled_at = NOW(),
          updated_at = NOW()
      WHERE user_id = p_user_id 
        AND status = '${SUBSCRIPTION_STATUS.ACTIVE}';
      
      RETURN FOUND;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to reactivate subscription
    CREATE OR REPLACE FUNCTION reactivate_user_subscription(p_user_id UUID)
    RETURNS BOOLEAN AS $$
    BEGIN
      UPDATE ${TABLES.USER_SUBSCRIPTIONS}
      SET status = '${SUBSCRIPTION_STATUS.ACTIVE}',
          cancelled_at = NULL,
          updated_at = NOW()
      WHERE user_id = p_user_id 
        AND status = '${SUBSCRIPTION_STATUS.CANCELLED}';
      
      RETURN FOUND;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `
};

// Complete subscription setup
export const SETUP_SUBSCRIPTIONS = `
  -- Create subscription plans table
  ${SUBSCRIPTION_SCHEMA.CREATE_PLANS_TABLE}
  
  -- Create user subscriptions table
  ${SUBSCRIPTION_SCHEMA.CREATE_SUBSCRIPTIONS_TABLE}
  
  -- Create indexes
  ${SUBSCRIPTION_SCHEMA.CREATE_INDEXES}
  
  -- Setup RLS
  ${SUBSCRIPTION_SCHEMA.SETUP_RLS}
  
  -- Create triggers
  ${SUBSCRIPTION_SCHEMA.CREATE_TRIGGERS}
  
  -- Create helper functions
  ${SUBSCRIPTION_SCHEMA.HELPER_FUNCTIONS}
`;

export default SUBSCRIPTION_SCHEMA;