// EyeMotion Payments and Credits Tables Schema  
import { DATABASE_CONSTANTS, SQL_HELPERS, SQL_PATTERNS } from '../constants';

const { TABLES, PAYMENT_STATUS, TRANSACTION_TYPES, DEFAULTS, INDEXES } = DATABASE_CONSTANTS;
const { enableRLS, createIndex, createRLSPolicy, RLS_CONDITIONS } = SQL_HELPERS;
const { TIMESTAMPS, UUID_PRIMARY_KEY, METADATA_JSONB, CHECK_CONSTRAINTS } = SQL_PATTERNS;

export const PAYMENTS_SCHEMA = {
  // Credits Usage Table
  CREATE_CREDITS_USAGE_TABLE: `
    CREATE OR REPLACE FUNCTION create_credits_usage_table()
    RETURNS VOID AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS ${TABLES.CREDITS_USAGE} (
        ${UUID_PRIMARY_KEY},
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        subscription_id UUID REFERENCES ${TABLES.USER_SUBSCRIPTIONS}(id),
        credits_used INTEGER NOT NULL ${CHECK_CONSTRAINTS.POSITIVE_NUMBER('credits_used')},
        action TEXT NOT NULL,
        resource_type TEXT, -- 'file_upload', 'ai_processing', 'export', etc.
        resource_id UUID,
        details JSONB DEFAULT '{}',
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    END;
    $$ LANGUAGE plpgsql;
  `,

  // Payment Transactions Table  
  CREATE_PAYMENT_TRANSACTIONS_TABLE: `
    CREATE OR REPLACE FUNCTION create_payment_transactions_table()
    RETURNS VOID AS $$
    BEGIN
      CREATE TABLE IF NOT EXISTS ${TABLES.PAYMENT_TRANSACTIONS} (
        ${UUID_PRIMARY_KEY},
        user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
        stripe_payment_intent_id TEXT,
        stripe_subscription_id TEXT,
        amount INTEGER NOT NULL ${CHECK_CONSTRAINTS.POSITIVE_NUMBER('amount')}, -- In satang (Thai currency cents)
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
    END;
    $$ LANGUAGE plpgsql;
  `,

  // Activity Logs Table
  CREATE_ACTIVITY_LOGS_TABLE: `
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
    END;
    $$ LANGUAGE plpgsql;
  `,

  // Create indexes for all tables
  CREATE_INDEXES: [
    // Credits Usage indexes
    createIndex(INDEXES.CREDITS_USAGE[0], TABLES.CREDITS_USAGE, 'user_id'),
    createIndex(INDEXES.CREDITS_USAGE[1], TABLES.CREDITS_USAGE, 'subscription_id'),
    createIndex(INDEXES.CREDITS_USAGE[2], TABLES.CREDITS_USAGE, 'action'),
    createIndex(INDEXES.CREDITS_USAGE[3], TABLES.CREDITS_USAGE, 'created_at'),
    createIndex(INDEXES.CREDITS_USAGE[4], TABLES.CREDITS_USAGE, 'resource_type, resource_id'),
    
    // Payment Transactions indexes
    createIndex(INDEXES.PAYMENT_TRANSACTIONS[0], TABLES.PAYMENT_TRANSACTIONS, 'user_id'),
    createIndex(INDEXES.PAYMENT_TRANSACTIONS[1], TABLES.PAYMENT_TRANSACTIONS, 'status'),
    createIndex(INDEXES.PAYMENT_TRANSACTIONS[2], TABLES.PAYMENT_TRANSACTIONS, 'transaction_type'),
    createIndex(INDEXES.PAYMENT_TRANSACTIONS[3], TABLES.PAYMENT_TRANSACTIONS, 'stripe_payment_intent_id'),
    createIndex(INDEXES.PAYMENT_TRANSACTIONS[4], TABLES.PAYMENT_TRANSACTIONS, 'created_at'),
    
    // Activity Logs indexes
    createIndex(INDEXES.ACTIVITY_LOGS[0], TABLES.ACTIVITY_LOGS, 'user_id'),
    createIndex(INDEXES.ACTIVITY_LOGS[1], TABLES.ACTIVITY_LOGS, 'action'),
    createIndex(INDEXES.ACTIVITY_LOGS[2], TABLES.ACTIVITY_LOGS, 'resource_type, resource_id'),
    createIndex(INDEXES.ACTIVITY_LOGS[3], TABLES.ACTIVITY_LOGS, 'created_at')
  ].join('\n'),

  // Setup RLS for all tables
  SETUP_RLS: `
    -- Credits Usage RLS
    ${enableRLS(TABLES.CREDITS_USAGE)}
    
    ${createRLSPolicy(
      'Users can view own credits usage', 
      TABLES.CREDITS_USAGE, 
      'SELECT', 
      RLS_CONDITIONS.OWN_RECORD
    )}
    
    ${createRLSPolicy(
      'System can insert credits usage', 
      TABLES.CREDITS_USAGE, 
      'INSERT', 
      'true'
    )}
    
    ${createRLSPolicy(
      'Admins can view all credits usage', 
      TABLES.CREDITS_USAGE, 
      'SELECT', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}

    -- Payment Transactions RLS
    ${enableRLS(TABLES.PAYMENT_TRANSACTIONS)}
    
    ${createRLSPolicy(
      'Users can view own transactions', 
      TABLES.PAYMENT_TRANSACTIONS, 
      'SELECT', 
      RLS_CONDITIONS.OWN_RECORD
    )}
    
    ${createRLSPolicy(
      'System can manage transactions', 
      TABLES.PAYMENT_TRANSACTIONS, 
      'ALL', 
      'true'
    )}
    
    ${createRLSPolicy(
      'Admins can view all transactions', 
      TABLES.PAYMENT_TRANSACTIONS, 
      'SELECT', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}

    -- Activity Logs RLS
    ${enableRLS(TABLES.ACTIVITY_LOGS)}
    
    ${createRLSPolicy(
      'Users can view own activity logs', 
      TABLES.ACTIVITY_LOGS, 
      'SELECT', 
      RLS_CONDITIONS.OWN_RECORD
    )}
    
    ${createRLSPolicy(
      'System can insert activity logs', 
      TABLES.ACTIVITY_LOGS, 
      'INSERT', 
      'true'
    )}
    
    ${createRLSPolicy(
      'Admins can view all activity logs', 
      TABLES.ACTIVITY_LOGS, 
      'SELECT', 
      RLS_CONDITIONS.ADMIN_ACCESS
    )}
  `,

  // Helper functions for payments and credits
  HELPER_FUNCTIONS: `
    -- Function to log user activity
    CREATE OR REPLACE FUNCTION log_user_activity(
      p_user_id UUID,
      p_action TEXT,
      p_resource_type TEXT DEFAULT NULL,
      p_resource_id UUID DEFAULT NULL,
      p_details JSONB DEFAULT '{}',
      p_ip_address INET DEFAULT NULL,
      p_user_agent TEXT DEFAULT NULL
    )
    RETURNS UUID AS $$
    DECLARE
      v_log_id UUID;
    BEGIN
      INSERT INTO ${TABLES.ACTIVITY_LOGS} (
        user_id, action, resource_type, resource_id, 
        details, ip_address, user_agent, created_at
      ) VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id,
        p_details, p_ip_address, p_user_agent, NOW()
      ) RETURNING id INTO v_log_id;
      
      RETURN v_log_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to get user's credits history
    CREATE OR REPLACE FUNCTION get_user_credits_history(
      p_user_id UUID,
      p_limit INTEGER DEFAULT 50,
      p_offset INTEGER DEFAULT 0
    )
    RETURNS TABLE(
      id UUID,
      credits_used INTEGER,
      action TEXT,
      resource_type TEXT,
      details JSONB,
      created_at TIMESTAMPTZ
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        cu.id,
        cu.credits_used,
        cu.action,
        cu.resource_type,
        cu.details,
        cu.created_at
      FROM ${TABLES.CREDITS_USAGE} cu
      WHERE cu.user_id = p_user_id
      ORDER BY cu.created_at DESC
      LIMIT p_limit OFFSET p_offset;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to get user's payment history
    CREATE OR REPLACE FUNCTION get_user_payment_history(
      p_user_id UUID,
      p_limit INTEGER DEFAULT 20,
      p_offset INTEGER DEFAULT 0
    )
    RETURNS TABLE(
      id UUID,
      amount INTEGER,
      currency TEXT,
      status TEXT,
      transaction_type TEXT,
      description TEXT,
      invoice_url TEXT,
      receipt_url TEXT,
      created_at TIMESTAMPTZ,
      processed_at TIMESTAMPTZ
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        pt.id,
        pt.amount,
        pt.currency,
        pt.status,
        pt.transaction_type,
        pt.description,
        pt.invoice_url,
        pt.receipt_url,
        pt.created_at,
        pt.processed_at
      FROM ${TABLES.PAYMENT_TRANSACTIONS} pt
      WHERE pt.user_id = p_user_id
      ORDER BY pt.created_at DESC
      LIMIT p_limit OFFSET p_offset;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to calculate user's monthly spending
    CREATE OR REPLACE FUNCTION get_user_monthly_spending(p_user_id UUID, p_year INTEGER, p_month INTEGER)
    RETURNS TABLE(
      total_amount INTEGER,
      transaction_count INTEGER,
      subscription_amount INTEGER,
      credits_amount INTEGER,
      other_amount INTEGER
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        COALESCE(SUM(pt.amount), 0)::INTEGER as total_amount,
        COUNT(pt.id)::INTEGER as transaction_count,
        COALESCE(SUM(CASE WHEN pt.transaction_type = '${TRANSACTION_TYPES.SUBSCRIPTION}' THEN pt.amount ELSE 0 END), 0)::INTEGER as subscription_amount,
        COALESCE(SUM(CASE WHEN pt.transaction_type = '${TRANSACTION_TYPES.CREDIT_PURCHASE}' THEN pt.amount ELSE 0 END), 0)::INTEGER as credits_amount,
        COALESCE(SUM(CASE WHEN pt.transaction_type NOT IN ('${TRANSACTION_TYPES.SUBSCRIPTION}', '${TRANSACTION_TYPES.CREDIT_PURCHASE}') THEN pt.amount ELSE 0 END), 0)::INTEGER as other_amount
      FROM ${TABLES.PAYMENT_TRANSACTIONS} pt
      WHERE pt.user_id = p_user_id 
        AND pt.status = '${PAYMENT_STATUS.COMPLETED}'
        AND EXTRACT(YEAR FROM pt.created_at) = p_year
        AND EXTRACT(MONTH FROM pt.created_at) = p_month;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to cleanup old activity logs (keep last 90 days)
    CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
    RETURNS INTEGER AS $$
    DECLARE
      v_deleted_count INTEGER;
    BEGIN
      DELETE FROM ${TABLES.ACTIVITY_LOGS} 
      WHERE created_at < NOW() - INTERVAL '90 days';
      
      GET DIAGNOSTICS v_deleted_count = ROW_COUNT;
      RETURN v_deleted_count;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to record payment transaction
    CREATE OR REPLACE FUNCTION record_payment_transaction(
      p_user_id UUID,
      p_stripe_payment_intent_id TEXT,
      p_amount INTEGER,
      p_currency TEXT,
      p_status TEXT,
      p_transaction_type TEXT,
      p_description TEXT DEFAULT NULL,
      p_metadata JSONB DEFAULT '{}'
    )
    RETURNS UUID AS $$
    DECLARE
      v_transaction_id UUID;
    BEGIN
      INSERT INTO ${TABLES.PAYMENT_TRANSACTIONS} (
        user_id, stripe_payment_intent_id, amount, currency,
        status, transaction_type, description, metadata,
        processed_at, created_at
      ) VALUES (
        p_user_id, p_stripe_payment_intent_id, p_amount, p_currency,
        p_status, p_transaction_type, p_description, p_metadata,
        CASE WHEN p_status = '${PAYMENT_STATUS.COMPLETED}' THEN NOW() ELSE NULL END,
        NOW()
      ) RETURNING id INTO v_transaction_id;
      
      -- Log the payment activity
      PERFORM log_user_activity(
        p_user_id,
        'payment_' || p_status,
        'payment_transaction',
        v_transaction_id,
        jsonb_build_object(
          'amount', p_amount,
          'currency', p_currency,
          'type', p_transaction_type
        )
      );
      
      RETURN v_transaction_id;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;

    -- Function to get credits usage summary
    CREATE OR REPLACE FUNCTION get_credits_usage_summary(
      p_user_id UUID,
      p_start_date TIMESTAMPTZ DEFAULT NULL,
      p_end_date TIMESTAMPTZ DEFAULT NULL
    )
    RETURNS TABLE(
      action TEXT,
      total_credits INTEGER,
      usage_count INTEGER,
      avg_credits_per_use DECIMAL
    ) AS $$
    BEGIN
      RETURN QUERY
      SELECT 
        cu.action,
        SUM(cu.credits_used)::INTEGER as total_credits,
        COUNT(cu.id)::INTEGER as usage_count,
        AVG(cu.credits_used)::DECIMAL as avg_credits_per_use
      FROM ${TABLES.CREDITS_USAGE} cu
      WHERE cu.user_id = p_user_id
        AND (p_start_date IS NULL OR cu.created_at >= p_start_date)
        AND (p_end_date IS NULL OR cu.created_at <= p_end_date)
      GROUP BY cu.action
      ORDER BY total_credits DESC;
    END;
    $$ LANGUAGE plpgsql SECURITY DEFINER;
  `
};

// Complete payments setup
export const SETUP_PAYMENTS = `
  -- Create credits usage table
  ${PAYMENTS_SCHEMA.CREATE_CREDITS_USAGE_TABLE}
  
  -- Create payment transactions table
  ${PAYMENTS_SCHEMA.CREATE_PAYMENT_TRANSACTIONS_TABLE}
  
  -- Create activity logs table
  ${PAYMENTS_SCHEMA.CREATE_ACTIVITY_LOGS_TABLE}
  
  -- Create indexes
  ${PAYMENTS_SCHEMA.CREATE_INDEXES}
  
  -- Setup RLS
  ${PAYMENTS_SCHEMA.SETUP_RLS}
  
  -- Create helper functions
  ${PAYMENTS_SCHEMA.HELPER_FUNCTIONS}
`;

export default PAYMENTS_SCHEMA;