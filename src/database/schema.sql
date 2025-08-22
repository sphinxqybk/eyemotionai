-- EyeMotion Database Schema
-- Professional AI Film Ecosystem

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ===== USER PROFILES TABLE =====
-- Extends Supabase auth.users with business information
CREATE OR REPLACE FUNCTION create_user_profiles_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT NOT NULL,
    company_name TEXT,
    industry TEXT DEFAULT 'Film Production',
    country TEXT DEFAULT 'Thailand',
    phone TEXT,
    avatar_url TEXT,
    role TEXT DEFAULT 'user' CHECK (role IN ('user', 'admin', 'super_admin')),
    preferences JSONB DEFAULT '{}',
    onboarding_completed BOOLEAN DEFAULT FALSE,
    email_verified BOOLEAN DEFAULT FALSE,
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
  CREATE INDEX IF NOT EXISTS idx_user_profiles_country ON user_profiles(country);
  CREATE INDEX IF NOT EXISTS idx_user_profiles_industry ON user_profiles(industry);
  CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

  -- Enable RLS
  ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Users can view own profile" ON user_profiles 
    FOR SELECT USING (auth.uid() = id);
  
  CREATE POLICY "Users can update own profile" ON user_profiles 
    FOR UPDATE USING (auth.uid() = id);
  
  CREATE POLICY "Admins can view all profiles" ON user_profiles 
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );

  -- Updated at trigger
  CREATE OR REPLACE FUNCTION update_updated_at_column()
  RETURNS TRIGGER AS $$
  BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
  END;
  $$ language 'plpgsql';

  DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
  CREATE TRIGGER update_user_profiles_updated_at 
    BEFORE UPDATE ON user_profiles 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- ===== SUBSCRIPTION PLANS TABLE =====
CREATE OR REPLACE FUNCTION create_subscription_plans_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT UNIQUE NOT NULL,
    display_name TEXT NOT NULL,
    description TEXT,
    price INTEGER NOT NULL DEFAULT 0, -- In satang (Thai currency cents)
    currency TEXT DEFAULT 'thb',
    billing_interval TEXT DEFAULT 'month' CHECK (billing_interval IN ('month', 'year')),
    credits_included INTEGER DEFAULT 0,
    storage_gb INTEGER DEFAULT 5,
    features JSONB DEFAULT '[]',
    stripe_price_id TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
  CREATE INDEX IF NOT EXISTS idx_subscription_plans_price ON subscription_plans(price);
  CREATE INDEX IF NOT EXISTS idx_subscription_plans_sort ON subscription_plans(sort_order);

  -- Insert default plans
  INSERT INTO subscription_plans (name, display_name, description, price, credits_included, storage_gb, features) VALUES
  ('freemium', 'Freemium', 'Free tier with basic features', 0, 100, 1, '["basic_editing", "watermark", "limited_exports"]'),
  ('creator', 'Creator', 'Perfect for independent filmmakers', 29900, 1000, 5, '["hd_export", "basic_ai", "cloud_storage_5gb"]'),
  ('pro', 'Pro', 'Professional tools for serious creators', 99900, 5000, 50, '["4k_export", "advanced_ai", "cloud_storage_50gb", "priority_support"]'),
  ('studio', 'Studio', 'Complete studio solution', 299900, 20000, 500, '["unlimited_export", "premium_ai", "cloud_storage_500gb", "white_label", "api_access"]')
  ON CONFLICT (name) DO NOTHING;

  -- Enable RLS
  ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

  -- RLS Policies (read-only for authenticated users)
  CREATE POLICY "Authenticated users can view plans" ON subscription_plans 
    FOR SELECT USING (auth.role() = 'authenticated');
  
  CREATE POLICY "Admins can manage plans" ON subscription_plans 
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );

  -- Updated at trigger
  DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
  CREATE TRIGGER update_subscription_plans_updated_at 
    BEFORE UPDATE ON subscription_plans 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- ===== USER SUBSCRIPTIONS TABLE =====
CREATE OR REPLACE FUNCTION create_user_subscriptions_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID NOT NULL REFERENCES subscription_plans(id),
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing', 'incomplete')),
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
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure user has only one active subscription
    UNIQUE(user_id, status) WHERE status = 'active'
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
  CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
  CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_id ON user_subscriptions(stripe_subscription_id);
  CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period ON user_subscriptions(current_period_start, current_period_end);

  -- Enable RLS
  ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Users can view own subscription" ON user_subscriptions 
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Users can update own subscription" ON user_subscriptions 
    FOR UPDATE USING (auth.uid() = user_id);
  
  CREATE POLICY "Admins can view all subscriptions" ON user_subscriptions 
    FOR ALL USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );

  -- Updated at trigger
  DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
  CREATE TRIGGER update_user_subscriptions_updated_at 
    BEFORE UPDATE ON user_subscriptions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- ===== PROJECTS TABLE =====
CREATE OR REPLACE FUNCTION create_projects_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT DEFAULT 'feature_film' CHECK (type IN ('feature_film', 'short_film', 'commercial', 'music_video', 'documentary', 'social_media', 'other')),
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'review', 'completed', 'archived')),
    thumbnail_url TEXT,
    settings JSONB DEFAULT '{}',
    collaboration_settings JSONB DEFAULT '{}',
    version INTEGER DEFAULT 1,
    file_count INTEGER DEFAULT 0,
    total_duration INTEGER DEFAULT 0, -- in seconds
    export_count INTEGER DEFAULT 0,
    last_opened_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
  CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
  CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
  CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
  CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON projects(last_opened_at);

  -- Enable RLS
  ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Users can manage own projects" ON projects 
    FOR ALL USING (auth.uid() = user_id);
  
  CREATE POLICY "Admins can view all projects" ON projects 
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );

  -- Updated at trigger
  DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
  CREATE TRIGGER update_projects_updated_at 
    BEFORE UPDATE ON projects 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
END;
$$ LANGUAGE plpgsql;

-- ===== PROJECT FILES TABLE =====
CREATE OR REPLACE FUNCTION create_project_files_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
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
    processing_status TEXT DEFAULT 'pending' CHECK (processing_status IN ('pending', 'pending_upload', 'uploaded', 'processing', 'ready', 'error')),
    processing_started_at TIMESTAMPTZ,
    processing_completed_at TIMESTAMPTZ,
    processing_error TEXT,
    credits_cost INTEGER DEFAULT 0,
    metadata JSONB DEFAULT '{}',
    tags TEXT[] DEFAULT '{}',
    is_favorite BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
  CREATE INDEX IF NOT EXISTS idx_project_files_user_id ON project_files(user_id);
  CREATE INDEX IF NOT EXISTS idx_project_files_type ON project_files(file_type);
  CREATE INDEX IF NOT EXISTS idx_project_files_status ON project_files(processing_status);
  CREATE INDEX IF NOT EXISTS idx_project_files_created_at ON project_files(created_at);
  CREATE INDEX IF NOT EXISTS idx_project_files_tags ON project_files USING GIN(tags);

  -- Enable RLS
  ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Users can manage own project files" ON project_files 
    FOR ALL USING (auth.uid() = user_id);
  
  CREATE POLICY "Admins can view all files" ON project_files 
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );

  -- Updated at trigger
  DROP TRIGGER IF EXISTS update_project_files_updated_at ON project_files;
  CREATE TRIGGER update_project_files_updated_at 
    BEFORE UPDATE ON project_files 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

  -- Update project file count trigger
  CREATE OR REPLACE FUNCTION update_project_file_count()
  RETURNS TRIGGER AS $$
  BEGIN
    IF TG_OP = 'INSERT' THEN
      UPDATE projects 
      SET file_count = file_count + 1,
          updated_at = NOW()
      WHERE id = NEW.project_id;
      RETURN NEW;
    ELSIF TG_OP = 'DELETE' THEN
      UPDATE projects 
      SET file_count = file_count - 1,
          updated_at = NOW()
      WHERE id = OLD.project_id;
      RETURN OLD;
    END IF;
    RETURN NULL;
  END;
  $$ LANGUAGE plpgsql;

  DROP TRIGGER IF EXISTS trigger_update_project_file_count ON project_files;
  CREATE TRIGGER trigger_update_project_file_count
    AFTER INSERT OR DELETE ON project_files
    FOR EACH ROW EXECUTE FUNCTION update_project_file_count();
END;
$$ LANGUAGE plpgsql;

-- ===== CREDITS USAGE TABLE =====
CREATE OR REPLACE FUNCTION create_credits_usage_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS credits_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES user_subscriptions(id),
    credits_used INTEGER NOT NULL,
    action TEXT NOT NULL,
    resource_type TEXT, -- 'file_upload', 'ai_processing', 'export', etc.
    resource_id UUID,
    details JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_credits_usage_user_id ON credits_usage(user_id);
  CREATE INDEX IF NOT EXISTS idx_credits_usage_subscription_id ON credits_usage(subscription_id);
  CREATE INDEX IF NOT EXISTS idx_credits_usage_action ON credits_usage(action);
  CREATE INDEX IF NOT EXISTS idx_credits_usage_created_at ON credits_usage(created_at);
  CREATE INDEX IF NOT EXISTS idx_credits_usage_resource ON credits_usage(resource_type, resource_id);

  -- Enable RLS
  ALTER TABLE credits_usage ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Users can view own credits usage" ON credits_usage 
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Admins can view all credits usage" ON credits_usage 
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );
END;
$$ LANGUAGE plpgsql;

-- ===== PAYMENT TRANSACTIONS TABLE =====
CREATE OR REPLACE FUNCTION create_payment_transactions_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS payment_transactions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stripe_payment_intent_id TEXT,
    stripe_subscription_id TEXT,
    amount INTEGER NOT NULL, -- In satang (Thai currency cents)
    currency TEXT DEFAULT 'thb',
    status TEXT NOT NULL CHECK (status IN ('pending', 'completed', 'failed', 'refunded', 'cancelled')),
    payment_method TEXT DEFAULT 'stripe',
    transaction_type TEXT DEFAULT 'subscription' CHECK (transaction_type IN ('subscription', 'credit_purchase', 'one_time', 'refund')),
    description TEXT,
    invoice_url TEXT,
    receipt_url TEXT,
    metadata JSONB DEFAULT '{}',
    processed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
  );

  -- Create indexes
  CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
  CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
  CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(transaction_type);
  CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_id ON payment_transactions(stripe_payment_intent_id);
  CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);

  -- Enable RLS
  ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Users can view own transactions" ON payment_transactions 
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Admins can view all transactions" ON payment_transactions 
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );
END;
$$ LANGUAGE plpgsql;

-- ===== ACTIVITY LOGS TABLE =====
CREATE OR REPLACE FUNCTION create_activity_logs_table()
RETURNS VOID AS $$
BEGIN
  CREATE TABLE IF NOT EXISTS activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
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
  CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
  CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
  CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
  CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

  -- Enable RLS
  ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

  -- RLS Policies
  CREATE POLICY "Users can view own activity logs" ON activity_logs 
    FOR SELECT USING (auth.uid() = user_id);
  
  CREATE POLICY "Admins can view all activity logs" ON activity_logs 
    FOR SELECT USING (
      EXISTS (
        SELECT 1 FROM user_profiles 
        WHERE id = auth.uid() 
        AND role IN ('admin', 'super_admin')
      )
    );

  -- Auto-delete old logs (keep last 90 days)
  CREATE OR REPLACE FUNCTION cleanup_old_activity_logs()
  RETURNS VOID AS $$
  BEGIN
    DELETE FROM activity_logs 
    WHERE created_at < NOW() - INTERVAL '90 days';
  END;
  $$ LANGUAGE plpgsql;
END;
$$ LANGUAGE plpgsql;

-- ===== HELPFUL FUNCTIONS =====

-- Function to get user's current subscription
CREATE OR REPLACE FUNCTION get_user_current_subscription(p_user_id UUID)
RETURNS TABLE(
  subscription_id UUID,
  plan_name TEXT,
  credits_remaining INTEGER,
  storage_used_gb DECIMAL,
  storage_limit_gb INTEGER,
  status TEXT
) AS $$
BEGIN
  RETURN QUERY
  SELECT 
    us.id as subscription_id,
    sp.display_name as plan_name,
    (us.credits_included + us.extra_credits - us.credits_used) as credits_remaining,
    us.storage_used_gb,
    sp.storage_gb as storage_limit_gb,
    us.status
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id 
    AND us.status = 'active'
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
  FROM user_subscriptions
  WHERE user_id = p_user_id 
    AND status = 'active'
  LIMIT 1;
  
  RETURN COALESCE(v_credits_remaining, 0) >= p_credits_needed;
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
  LEFT JOIN projects p ON p.user_id = us.user_id
  LEFT JOIN project_files pf ON pf.project_id = p.id
  WHERE us.user_id = p_user_id 
    AND us.status = 'active'
  GROUP BY sp.storage_gb
  LIMIT 1;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ===== VIEWS FOR ANALYTICS =====

-- User analytics view
CREATE OR REPLACE VIEW user_analytics AS
SELECT 
  up.id,
  up.full_name,
  up.company_name,
  up.country,
  up.created_at as user_created_at,
  sp.display_name as current_plan,
  us.status as subscription_status,
  us.created_at as subscription_created_at,
  (us.credits_included + us.extra_credits - us.credits_used) as credits_remaining,
  COUNT(DISTINCT p.id) as project_count,
  COUNT(DISTINCT pf.id) as file_count,
  COALESCE(SUM(pf.file_size), 0) as total_storage_bytes
FROM user_profiles up
LEFT JOIN user_subscriptions us ON up.id = us.user_id AND us.status = 'active'
LEFT JOIN subscription_plans sp ON us.plan_id = sp.id
LEFT JOIN projects p ON up.id = p.user_id
LEFT JOIN project_files pf ON p.id = pf.project_id
GROUP BY up.id, up.full_name, up.company_name, up.country, up.created_at, 
         sp.display_name, us.status, us.created_at, us.credits_included, 
         us.extra_credits, us.credits_used;

-- Revenue analytics view
CREATE OR REPLACE VIEW revenue_analytics AS
SELECT 
  DATE_TRUNC('day', pt.created_at) as date,
  COUNT(*) as transaction_count,
  SUM(pt.amount) as total_amount_satang,
  SUM(pt.amount)::DECIMAL / 100 as total_amount_baht,
  pt.transaction_type,
  pt.status
FROM payment_transactions pt
WHERE pt.status = 'completed'
GROUP BY DATE_TRUNC('day', pt.created_at), pt.transaction_type, pt.status
ORDER BY date DESC;

COMMENT ON SCHEMA public IS 'EyeMotion Professional AI Film Ecosystem Database Schema';
COMMENT ON TABLE user_profiles IS 'Extended user profile information beyond Supabase auth';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans for EyeMotion services';
COMMENT ON TABLE user_subscriptions IS 'User subscription