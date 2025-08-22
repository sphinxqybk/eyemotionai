-- EyeMotion Manual Database Setup
-- Run this SQL directly in Supabase SQL Editor if Edge Functions fail

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ==========================================
-- SHARED FUNCTIONS
-- ==========================================

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- ==========================================
-- USER PROFILES TABLE
-- ==========================================

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_profiles_country ON user_profiles(country);
CREATE INDEX IF NOT EXISTS idx_user_profiles_industry ON user_profiles(industry);
CREATE INDEX IF NOT EXISTS idx_user_profiles_created_at ON user_profiles(created_at);

-- RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

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

-- Trigger
DROP TRIGGER IF EXISTS update_user_profiles_updated_at ON user_profiles;
CREATE TRIGGER update_user_profiles_updated_at 
  BEFORE UPDATE ON user_profiles 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- SUBSCRIPTION PLANS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS subscription_plans (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT UNIQUE NOT NULL,
  display_name TEXT NOT NULL,
  description TEXT,
  price INTEGER NOT NULL DEFAULT 0,
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

-- Insert default plans
INSERT INTO subscription_plans (name, display_name, description, price, credits_included, storage_gb, features, sort_order) VALUES 
('freemium', 'Freemium', 'Free tier with basic features', 0, 50, 1, '["basic_editing", "watermark", "limited_exports"]', 0),
('creator', 'Creator', 'Perfect for independent filmmakers', 29900, 500, 50, '["hd_export", "basic_ai", "cloud_storage_50gb"]', 1),
('pro', 'Pro', 'Professional tools for serious creators', 99900, 2000, 500, '["4k_export", "advanced_ai", "cloud_storage_500gb", "priority_support"]', 2),
('studio', 'Studio', 'Complete studio solution', 299900, 10000, 2000, '["unlimited_export", "premium_ai", "cloud_storage_2tb", "white_label", "api_access"]', 3)
ON CONFLICT (name) DO UPDATE SET
  display_name = EXCLUDED.display_name,
  description = EXCLUDED.description,
  price = EXCLUDED.price,
  credits_included = EXCLUDED.credits_included,
  storage_gb = EXCLUDED.storage_gb,
  features = EXCLUDED.features,
  updated_at = NOW();

-- Indexes
CREATE INDEX IF NOT EXISTS idx_subscription_plans_active ON subscription_plans(is_active);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_price ON subscription_plans(price);
CREATE INDEX IF NOT EXISTS idx_subscription_plans_sort ON subscription_plans(sort_order);

-- RLS
ALTER TABLE subscription_plans ENABLE ROW LEVEL SECURITY;

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

-- Trigger
DROP TRIGGER IF EXISTS update_subscription_plans_updated_at ON subscription_plans;
CREATE TRIGGER update_subscription_plans_updated_at 
  BEFORE UPDATE ON subscription_plans 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- USER SUBSCRIPTIONS TABLE
-- ==========================================

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
  
  UNIQUE(user_id, status) WHERE status = 'active'
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_id ON user_subscriptions(stripe_subscription_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_period ON user_subscriptions(current_period_start, current_period_end);

-- RLS
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;

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

-- Trigger
DROP TRIGGER IF EXISTS update_user_subscriptions_updated_at ON user_subscriptions;
CREATE TRIGGER update_user_subscriptions_updated_at 
  BEFORE UPDATE ON user_subscriptions 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- PROJECTS TABLE
-- ==========================================

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
  total_duration INTEGER DEFAULT 0,
  export_count INTEGER DEFAULT 0,
  last_opened_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_type ON projects(type);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at);
CREATE INDEX IF NOT EXISTS idx_projects_last_opened ON projects(last_opened_at);

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

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

-- Trigger
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at 
  BEFORE UPDATE ON projects 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ==========================================
-- PROJECT FILES TABLE
-- ==========================================

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
  duration INTEGER,
  resolution TEXT,
  fps DECIMAL(5,2),
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_user_id ON project_files(user_id);
CREATE INDEX IF NOT EXISTS idx_project_files_type ON project_files(file_type);
CREATE INDEX IF NOT EXISTS idx_project_files_status ON project_files(processing_status);
CREATE INDEX IF NOT EXISTS idx_project_files_created_at ON project_files(created_at);
CREATE INDEX IF NOT EXISTS idx_project_files_tags ON project_files USING GIN(tags);

-- RLS
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

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

-- Trigger
DROP TRIGGER IF EXISTS update_project_files_updated_at ON project_files;
CREATE TRIGGER update_project_files_updated_at 
  BEFORE UPDATE ON project_files 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- File count trigger
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

-- ==========================================
-- CREDITS USAGE TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS credits_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES user_subscriptions(id),
  credits_used INTEGER NOT NULL CHECK (credits_used >= 0),
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_credits_usage_user_id ON credits_usage(user_id);
CREATE INDEX IF NOT EXISTS idx_credits_usage_subscription_id ON credits_usage(subscription_id);
CREATE INDEX IF NOT EXISTS idx_credits_usage_action ON credits_usage(action);
CREATE INDEX IF NOT EXISTS idx_credits_usage_created_at ON credits_usage(created_at);
CREATE INDEX IF NOT EXISTS idx_credits_usage_resource ON credits_usage(resource_type, resource_id);

-- RLS
ALTER TABLE credits_usage ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own credits usage" ON credits_usage 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert credits usage" ON credits_usage 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all credits usage" ON credits_usage 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- ==========================================
-- PAYMENT TRANSACTIONS TABLE
-- ==========================================

CREATE TABLE IF NOT EXISTS payment_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  stripe_payment_intent_id TEXT,
  stripe_subscription_id TEXT,
  amount INTEGER NOT NULL CHECK (amount >= 0),
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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_payment_transactions_user_id ON payment_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_status ON payment_transactions(status);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_type ON payment_transactions(transaction_type);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_stripe_id ON payment_transactions(stripe_payment_intent_id);
CREATE INDEX IF NOT EXISTS idx_payment_transactions_created_at ON payment_transactions(created_at);

-- RLS
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own transactions" ON payment_transactions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can manage transactions" ON payment_transactions 
  FOR ALL WITH CHECK (true);

CREATE POLICY "Admins can view all transactions" ON payment_transactions 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

-- ==========================================
-- ACTIVITY LOGS TABLE
-- ==========================================

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

-- Indexes
CREATE INDEX IF NOT EXISTS idx_activity_logs_user_id ON activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_action ON activity_logs(action);
CREATE INDEX IF NOT EXISTS idx_activity_logs_resource ON activity_logs(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_activity_logs_created_at ON activity_logs(created_at);

-- RLS
ALTER TABLE activity_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own activity logs" ON activity_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "System can insert activity logs" ON activity_logs 
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view all activity logs" ON activity_logs 
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_profiles 
      WHERE id = auth.uid() 
      AND role IN ('admin', 'super_admin')
    )
  );

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
  FROM user_subscriptions us
  JOIN subscription_plans sp ON us.plan_id = sp.id
  WHERE us.user_id = p_user_id 
    AND us.status = 'active'
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
  FROM user_subscriptions
  WHERE user_id = p_user_id 
    AND status = 'active'
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
  UPDATE user_subscriptions
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

-- ==========================================
-- SCHEMA VERSION TRACKING
-- ==========================================

CREATE TABLE IF NOT EXISTS schema_version (
  version TEXT PRIMARY KEY,
  applied_at TIMESTAMPTZ DEFAULT NOW(),
  description TEXT
);

INSERT INTO schema_version (version, description) VALUES 
('1.0.0', 'Initial EyeMotion database schema with user profiles, subscriptions, projects, files, payments, and analytics')
ON CONFLICT (version) DO UPDATE SET applied_at = NOW();

-- ==========================================
-- PERMISSIONS
-- ==========================================

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT ON ALL TABLES IN SCHEMA public TO anon, authenticated;

-- Final comment
COMMENT ON SCHEMA public IS 'EyeMotion Professional AI Film Ecosystem Database Schema v1.0.0';

-- Done!
SELECT 'EyeMotion database schema setup completed successfully!' as result;