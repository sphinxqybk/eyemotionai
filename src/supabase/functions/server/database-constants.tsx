// EyeMotion Database Constants and Configuration - Edge Function Version
export const DATABASE_CONSTANTS = {
  // Table Names
  TABLES: {
    USER_PROFILES: 'user_profiles',
    SUBSCRIPTION_PLANS: 'subscription_plans', 
    USER_SUBSCRIPTIONS: 'user_subscriptions',
    PROJECTS: 'projects',
    PROJECT_FILES: 'project_files',
    CREDITS_USAGE: 'credits_usage',
    PAYMENT_TRANSACTIONS: 'payment_transactions',
    ACTIVITY_LOGS: 'activity_logs'
  },

  // User Roles
  USER_ROLES: {
    USER: 'user',
    ADMIN: 'admin',
    SUPER_ADMIN: 'super_admin'
  },

  // Subscription Status
  SUBSCRIPTION_STATUS: {
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
    PAST_DUE: 'past_due',
    TRIALING: 'trialing',
    INCOMPLETE: 'incomplete'
  },

  // Project Types
  PROJECT_TYPES: {
    FEATURE_FILM: 'feature_film',
    SHORT_FILM: 'short_film',
    COMMERCIAL: 'commercial',
    MUSIC_VIDEO: 'music_video',
    DOCUMENTARY: 'documentary',
    SOCIAL_MEDIA: 'social_media',
    OTHER: 'other'
  },

  // Project Status
  PROJECT_STATUS: {
    DRAFT: 'draft',
    IN_PROGRESS: 'in_progress',
    REVIEW: 'review',
    COMPLETED: 'completed',
    ARCHIVED: 'archived'
  },

  // File Processing Status
  PROCESSING_STATUS: {
    PENDING: 'pending',
    PENDING_UPLOAD: 'pending_upload',
    UPLOADED: 'uploaded',
    PROCESSING: 'processing',
    READY: 'ready',
    ERROR: 'error'
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded',
    CANCELLED: 'cancelled'
  },

  // Transaction Types
  TRANSACTION_TYPES: {
    SUBSCRIPTION: 'subscription',
    CREDIT_PURCHASE: 'credit_purchase',
    ONE_TIME: 'one_time',
    REFUND: 'refund'
  },

  // Default Values
  DEFAULTS: {
    INDUSTRY: 'Film Production',
    COUNTRY: 'Thailand',
    CURRENCY: 'thb',
    BILLING_INTERVAL: 'month',
    STORAGE_GB: 5
  },

  // EyeMotion Subscription Plans
  SUBSCRIPTION_PLANS: {
    FREEMIUM: {
      name: 'freemium',
      display_name: 'Freemium',
      description: 'Free tier with basic features',
      price: 0,
      credits_included: 50,
      storage_gb: 1,
      features: ['basic_editing', 'watermark', 'limited_exports']
    },
    CREATOR: {
      name: 'creator',
      display_name: 'Creator',
      description: 'Perfect for independent filmmakers',
      price: 29900, // ฿299 in satang
      credits_included: 500,
      storage_gb: 50,
      features: ['hd_export', 'basic_ai', 'cloud_storage_50gb']
    },
    PRO: {
      name: 'pro',
      display_name: 'Pro',
      description: 'Professional tools for serious creators',
      price: 99900, // ฿999 in satang
      credits_included: 2000,
      storage_gb: 500,
      features: ['4k_export', 'advanced_ai', 'cloud_storage_500gb', 'priority_support']
    },
    STUDIO: {
      name: 'studio',
      display_name: 'Studio',
      description: 'Complete studio solution',
      price: 299900, // ฿2,999 in satang
      credits_included: 10000,
      storage_gb: 2000,
      features: ['unlimited_export', 'premium_ai', 'cloud_storage_2tb', 'white_label', 'api_access']
    }
  }
};

// SQL Helper Functions
export const SQL_HELPERS = {
  // Enable UUID extension
  ENABLE_UUID: `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`,
  
  // Updated at trigger function
  UPDATE_TIMESTAMP_FUNCTION: `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
      NEW.updated_at = NOW();
      RETURN NEW;
    END;
    $$ language 'plpgsql';
  `,

  // Create trigger for updated_at
  createUpdateTrigger: (tableName: string) => `
    DROP TRIGGER IF EXISTS update_${tableName}_updated_at ON ${tableName};
    CREATE TRIGGER update_${tableName}_updated_at 
      BEFORE UPDATE ON ${tableName} 
      FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
  `,

  // Enable RLS
  enableRLS: (tableName: string) => `
    ALTER TABLE ${tableName} ENABLE ROW LEVEL SECURITY;
  `,

  // Create index
  createIndex: (indexName: string, tableName: string, columns: string) => `
    CREATE INDEX IF NOT EXISTS ${indexName} ON ${tableName}(${columns});
  `,

  // Create RLS policy
  createRLSPolicy: (policyName: string, tableName: string, operation: string, condition: string) => `
    CREATE POLICY "${policyName}" ON ${tableName} 
      FOR ${operation} USING (${condition});
  `,

  // Common RLS conditions
  RLS_CONDITIONS: {
    OWN_RECORD: 'auth.uid() = user_id',
    OWN_ID: 'auth.uid() = id',
    ADMIN_ACCESS: `
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    `,
    AUTHENTICATED: `auth.role() = 'authenticated'`
  }
};

// Common SQL patterns
export const SQL_PATTERNS = {
  // Standard timestamps
  TIMESTAMPS: `
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  `,

  // UUID primary key
  UUID_PRIMARY_KEY: `
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4()
  `,

  // User reference with cascade delete
  USER_REFERENCE: `
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE
  `,

  // Standard metadata JSONB
  METADATA_JSONB: `
    metadata JSONB DEFAULT '{}'
  `,

  // Common check constraints
  CHECK_CONSTRAINTS: {
    STATUS: (statuses: string[]) => `CHECK (status IN (${statuses.map(s => `'${s}'`).join(', ')}))`,
    ROLE: (roles: string[]) => `CHECK (role IN (${roles.map(r => `'${r}'`).join(', ')}))`,
    POSITIVE_NUMBER: (column: string) => `CHECK (${column} >= 0)`
  }
};

export default DATABASE_CONSTANTS;