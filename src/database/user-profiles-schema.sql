-- EyeMotion User Profiles Table Schema
-- Production database schema for user management and subscription tracking

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User profiles table
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name TEXT,
    email TEXT NOT NULL,
    avatar_url TEXT,
    
    -- Subscription information
    subscription_tier TEXT CHECK (subscription_tier IN ('freemium', 'creator', 'pro', 'studio')) DEFAULT 'freemium',
    subscription_status TEXT CHECK (subscription_status IN ('active', 'canceled', 'past_due', 'paused')) DEFAULT 'active',
    subscription_start_date TIMESTAMPTZ,
    subscription_end_date TIMESTAMPTZ,
    
    -- Cultural and personal information
    cultural_background TEXT,
    preferred_language TEXT DEFAULT 'en' CHECK (preferred_language IN ('en', 'th')),
    country_code TEXT,
    timezone TEXT,
    
    -- FFZ (Film From Zero) progress tracking
    ffz_level INTEGER DEFAULT 0 CHECK (ffz_level >= 0 AND ffz_level <= 3),
    ffz_modules_completed INTEGER DEFAULT 0,
    ffz_certificates JSONB DEFAULT '[]'::jsonb,
    ffz_progress_data JSONB DEFAULT '{}'::jsonb,
    
    -- Usage tracking
    credits_remaining INTEGER DEFAULT 100,
    credits_used_total INTEGER DEFAULT 0,
    storage_used_gb DECIMAL(10,2) DEFAULT 0.00,
    storage_limit_gb DECIMAL(10,2) DEFAULT 1.00,
    
    -- Project and activity tracking
    projects_created INTEGER DEFAULT 0,
    projects_completed INTEGER DEFAULT 0,
    last_project_created_at TIMESTAMPTZ,
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Community and verification
    community_points INTEGER DEFAULT 0,
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'verified', 'expert')),
    cultural_verification_badges JSONB DEFAULT '[]'::jsonb,
    
    -- Preferences and settings
    notification_preferences JSONB DEFAULT '{
        "email_updates": true,
        "feature_announcements": true,
        "community_notifications": true,
        "marketing_emails": false
    }'::jsonb,
    
    privacy_settings JSONB DEFAULT '{
        "profile_visibility": "public",
        "project_visibility": "public",
        "cultural_sharing": true
    }'::jsonb,
    
    -- Metadata
    onboarding_completed BOOLEAN DEFAULT false,
    terms_accepted_at TIMESTAMPTZ,
    privacy_policy_accepted_at TIMESTAMPTZ,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Ensure one profile per user
    UNIQUE(user_id)
);

-- Subscription plans reference table
CREATE TABLE IF NOT EXISTS subscription_plans (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL UNIQUE,
    display_name TEXT NOT NULL,
    description TEXT,
    
    -- Pricing
    price INTEGER NOT NULL, -- Price in smallest currency unit (e.g., cents for USD, satang for THB)
    currency TEXT NOT NULL DEFAULT 'thb',
    billing_interval TEXT DEFAULT 'month' CHECK (billing_interval IN ('month', 'year')),
    
    -- Features and limits
    credits_included INTEGER DEFAULT 0,
    storage_gb DECIMAL(10,2) DEFAULT 1.00,
    max_projects INTEGER DEFAULT 10,
    max_collaborators INTEGER DEFAULT 1,
    
    -- Feature flags
    features JSONB DEFAULT '{}'::jsonb,
    ai_features_enabled BOOLEAN DEFAULT false,
    advanced_editing BOOLEAN DEFAULT false,
    watermark_removal BOOLEAN DEFAULT false,
    hd_export BOOLEAN DEFAULT false,
    four_k_export BOOLEAN DEFAULT false,
    unlimited_export BOOLEAN DEFAULT false,
    priority_support BOOLEAN DEFAULT false,
    api_access BOOLEAN DEFAULT false,
    white_label BOOLEAN DEFAULT false,
    
    -- FFZ access levels
    ffz_max_level INTEGER DEFAULT 0 CHECK (ffz_max_level >= 0 AND ffz_max_level <= 3),
    
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions tracking table
CREATE TABLE IF NOT EXISTS user_subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    plan_id UUID REFERENCES subscription_plans(id),
    
    status TEXT CHECK (status IN ('active', 'canceled', 'past_due', 'paused', 'trial')) DEFAULT 'active',
    
    -- Billing information
    stripe_subscription_id TEXT,
    stripe_customer_id TEXT,
    
    -- Dates
    started_at TIMESTAMPTZ DEFAULT NOW(),
    current_period_start TIMESTAMPTZ,
    current_period_end TIMESTAMPTZ,
    canceled_at TIMESTAMPTZ,
    trial_start TIMESTAMPTZ,
    trial_end TIMESTAMPTZ,
    
    -- Pricing snapshot (for historical tracking)
    price_snapshot INTEGER,
    currency_snapshot TEXT DEFAULT 'thb',
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- User activity log
CREATE TABLE IF NOT EXISTS user_activity_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    activity_type TEXT NOT NULL,
    activity_description TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    
    ip_address INET,
    user_agent TEXT,
    
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- FFZ progress tracking
CREATE TABLE IF NOT EXISTS ffz_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    module_id TEXT NOT NULL,
    module_name TEXT NOT NULL,
    level INTEGER NOT NULL CHECK (level >= 0 AND level <= 3),
    
    status TEXT DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed', 'certified')),
    progress_percentage INTEGER DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    
    -- Cultural context and learning data
    cultural_context JSONB DEFAULT '{}'::jsonb,
    learning_data JSONB DEFAULT '{}'::jsonb,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    
    UNIQUE(user_id, module_id)
);

-- Cultural verification records
CREATE TABLE IF NOT EXISTS cultural_verification_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    
    content_type TEXT NOT NULL, -- 'project', 'story', 'cultural_documentation'
    content_id UUID,
    
    verification_status TEXT DEFAULT 'pending' CHECK (verification_status IN ('pending', 'approved', 'rejected', 'needs_revision')),
    cultural_context TEXT,
    verification_notes TEXT,
    
    verified_by UUID REFERENCES auth.users(id), -- Verifier user ID
    verified_at TIMESTAMPTZ,
    
    community_score DECIMAL(3,2), -- Community verification score (0.00 to 5.00)
    expert_review BOOLEAN DEFAULT false,
    
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insert default subscription plans
INSERT INTO subscription_plans (name, display_name, description, price, credits_included, storage_gb, features, ffz_max_level) VALUES
    ('freemium', 'Freemium', 'Free tier with basic features', 0, 100, 1.00, '{"basic_editing": true, "watermark": true, "community_access": true}', 0),
    ('creator', 'Creator', 'Perfect for independent filmmakers', 29900, 1000, 5.00, '{"hd_export": true, "basic_ai": true, "cloud_storage": true}', 1),
    ('pro', 'Pro', 'Professional tools for serious creators', 99900, 5000, 50.00, '{"4k_export": true, "advanced_ai": true, "priority_support": true}', 2),
    ('studio', 'Studio', 'Complete studio solution', 299900, 20000, 500.00, '{"unlimited_export": true, "premium_ai": true, "white_label": true, "api_access": true}', 3)
ON CONFLICT (name) DO UPDATE SET
    display_name = EXCLUDED.display_name,
    description = EXCLUDED.description,
    price = EXCLUDED.price,
    credits_included = EXCLUDED.credits_included,
    storage_gb = EXCLUDED.storage_gb,
    features = EXCLUDED.features,
    ffz_max_level = EXCLUDED.ffz_max_level,
    updated_at = NOW();

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_subscription_tier ON user_profiles(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_user_profiles_ffz_level ON user_profiles(ffz_level);
CREATE INDEX IF NOT EXISTS idx_user_profiles_last_active ON user_profiles(last_active_at);

CREATE INDEX IF NOT EXISTS idx_user_subscriptions_user_id ON user_subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_status ON user_subscriptions(status);
CREATE INDEX IF NOT EXISTS idx_user_subscriptions_stripe_id ON user_subscriptions(stripe_subscription_id);

CREATE INDEX IF NOT EXISTS idx_user_activity_logs_user_id ON user_activity_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_type ON user_activity_logs(activity_type);
CREATE INDEX IF NOT EXISTS idx_user_activity_logs_created_at ON user_activity_logs(created_at);

CREATE INDEX IF NOT EXISTS idx_ffz_progress_user_id ON ffz_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_ffz_progress_level ON ffz_progress(level);
CREATE INDEX IF NOT EXISTS idx_ffz_progress_status ON ffz_progress(status);

CREATE INDEX IF NOT EXISTS idx_cultural_verification_user_id ON cultural_verification_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_cultural_verification_status ON cultural_verification_logs(verification_status);
CREATE INDEX IF NOT EXISTS idx_cultural_verification_content ON cultural_verification_logs(content_type, content_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update updated_at columns
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscription_plans_updated_at BEFORE UPDATE ON subscription_plans FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_subscriptions_updated_at BEFORE UPDATE ON user_subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_ffz_progress_updated_at BEFORE UPDATE ON ffz_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cultural_verification_updated_at BEFORE UPDATE ON cultural_verification_logs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies

-- Enable RLS on all tables
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE ffz_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE cultural_verification_logs ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view their own profile" ON user_profiles
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" ON user_profiles
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" ON user_profiles
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- User subscriptions policies
CREATE POLICY "Users can view their own subscriptions" ON user_subscriptions
    FOR SELECT USING (auth.uid() = user_id);

-- User activity logs policies  
CREATE POLICY "Users can view their own activity logs" ON user_activity_logs
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Service can insert activity logs" ON user_activity_logs
    FOR INSERT WITH CHECK (true);

-- FFZ progress policies
CREATE POLICY "Users can view their own FFZ progress" ON ffz_progress
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own FFZ progress" ON ffz_progress
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own FFZ progress" ON ffz_progress
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Cultural verification policies
CREATE POLICY "Users can view their own verification logs" ON cultural_verification_logs
    FOR SELECT USING (auth.uid() = user_id OR auth.uid() = verified_by);

CREATE POLICY "Users can create verification requests" ON cultural_verification_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Public read access for subscription plans
CREATE POLICY "Anyone can view subscription plans" ON subscription_plans
    FOR SELECT USING (is_active = true);

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT SELECT ON subscription_plans TO anon, authenticated;
GRANT ALL ON user_profiles TO authenticated;
GRANT ALL ON user_subscriptions TO authenticated;
GRANT ALL ON user_activity_logs TO authenticated;
GRANT ALL ON ffz_progress TO authenticated;
GRANT ALL ON cultural_verification_logs TO authenticated;

-- Functions for user management

-- Function to create user profile after signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO public.user_profiles (user_id, full_name, email)
    VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.email);
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically create profile after user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update user last_active_at
CREATE OR REPLACE FUNCTION public.update_user_last_active(user_uuid UUID)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles 
    SET last_active_at = NOW() 
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's current subscription tier
CREATE OR REPLACE FUNCTION public.get_user_subscription_tier(user_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    tier TEXT;
BEGIN
    SELECT subscription_tier INTO tier
    FROM user_profiles
    WHERE user_id = user_uuid;
    
    RETURN COALESCE(tier, 'freemium');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can access FFZ level
CREATE OR REPLACE FUNCTION public.can_access_ffz_level(user_uuid UUID, requested_level INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    user_tier TEXT;
    max_level INTEGER;
BEGIN
    -- Get user's subscription tier
    SELECT subscription_tier INTO user_tier
    FROM user_profiles
    WHERE user_id = user_uuid;
    
    -- Get max FFZ level for their tier
    SELECT ffz_max_level INTO max_level
    FROM subscription_plans
    WHERE name = COALESCE(user_tier, 'freemium');
    
    RETURN requested_level <= COALESCE(max_level, 0);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to use credits
CREATE OR REPLACE FUNCTION public.use_credits(user_uuid UUID, credits_to_use INTEGER)
RETURNS BOOLEAN AS $$
DECLARE
    current_credits INTEGER;
BEGIN
    -- Get current credits
    SELECT credits_remaining INTO current_credits
    FROM user_profiles
    WHERE user_id = user_uuid;
    
    -- Check if user has enough credits
    IF current_credits >= credits_to_use THEN
        -- Deduct credits
        UPDATE user_profiles
        SET 
            credits_remaining = credits_remaining - credits_to_use,
            credits_used_total = credits_used_total + credits_to_use,
            updated_at = NOW()
        WHERE user_id = user_uuid;
        
        RETURN true;
    ELSE
        RETURN false;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add credits (for subscription renewals, etc.)
CREATE OR REPLACE FUNCTION public.add_credits(user_uuid UUID, credits_to_add INTEGER)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles
    SET 
        credits_remaining = credits_remaining + credits_to_add,
        updated_at = NOW()
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to update storage usage
CREATE OR REPLACE FUNCTION public.update_storage_usage(user_uuid UUID, storage_gb DECIMAL)
RETURNS void AS $$
BEGIN
    UPDATE user_profiles
    SET 
        storage_used_gb = storage_gb,
        updated_at = NOW()
    WHERE user_id = user_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to log user activity
CREATE OR REPLACE FUNCTION public.log_user_activity(
    user_uuid UUID,
    activity_type TEXT,
    activity_description TEXT DEFAULT NULL,
    metadata JSONB DEFAULT '{}'::jsonb
)
RETURNS void AS $$
BEGIN
    INSERT INTO user_activity_logs (user_id, activity_type, activity_description, metadata)
    VALUES (user_uuid, activity_type, activity_description, metadata);
    
    -- Also update last_active_at
    PERFORM public.update_user_last_active(user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

COMMENT ON TABLE user_profiles IS 'User profiles with subscription and FFZ progress tracking';
COMMENT ON TABLE subscription_plans IS 'Available subscription plans and their features';
COMMENT ON TABLE user_subscriptions IS 'User subscription history and current status';
COMMENT ON TABLE user_activity_logs IS 'User activity tracking for analytics and support';
COMMENT ON TABLE ffz_progress IS 'Film From Zero educational progress tracking';
COMMENT ON TABLE cultural_verification_logs IS 'Cultural authenticity verification records';