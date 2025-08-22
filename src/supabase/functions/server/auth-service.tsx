// EyeMotion Authentication Service
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { createUserProfile } from './database-setup.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// User Registration
export const registerUser = async (userData: {
  email: string;
  password: string;
  fullName: string;
  companyName?: string;
  industry?: string;
  country?: string;
  phone?: string;
}) => {
  try {
    console.log('🔐 Registering new user:', userData.email);

    // Create auth user
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: userData.email,
      password: userData.password,
      user_metadata: {
        full_name: userData.fullName,
        company_name: userData.companyName,
        industry: userData.industry || 'Film Production',
        country: userData.country || 'Thailand'
      },
      email_confirm: true // Auto-confirm since email server not configured
    });

    if (authError) throw authError;

    // Create user profile
    const profileResult = await createUserProfile(authData.user.id, {
      full_name: userData.fullName,
      company_name: userData.companyName,
      industry: userData.industry,
      country: userData.country,
      phone: userData.phone
    });

    if (!profileResult.success) {
      // Cleanup auth user if profile creation fails
      await supabase.auth.admin.deleteUser(authData.user.id);
      throw new Error(profileResult.error);
    }

    // Assign default freemium plan
    await assignDefaultPlan(authData.user.id);

    console.log('✅ User registered successfully:', authData.user.id);
    
    return {
      success: true,
      user: {
        id: authData.user.id,
        email: authData.user.email,
        fullName: userData.fullName,
        companyName: userData.companyName
      }
    };
  } catch (error) {
    console.error('❌ User registration failed:', error);
    return { success: false, error: error.message };
  }
};

// User Sign In
export const signInUser = async (email: string, password: string) => {
  try {
    console.log('🔐 Signing in user:', email);

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // Get user profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    if (profileError) {
      console.error('Profile fetch error:', profileError);
    }

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (
          name,
          features,
          credits_included,
          price
        )
      `)
      .eq('user_id', data.user.id)
      .eq('status', 'active')
      .single();

    console.log('✅ User signed in successfully:', data.user.id);

    return {
      success: true,
      user: {
        id: data.user.id,
        email: data.user.email,
        profile: profile || null,
        subscription: subscription || null,
        accessToken: data.session.access_token
      }
    };
  } catch (error) {
    console.error('❌ User sign in failed:', error);
    return { success: false, error: error.message };
  }
};

// Social Sign In (Google, GitHub, etc.)
export const signInWithProvider = async (provider: string, redirectTo?: string) => {
  try {
    console.log('🔐 Social sign in with:', provider);

    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: provider as any,
      options: {
        redirectTo: redirectTo || `${Deno.env.get('FRONTEND_URL')}/auth/callback`,
        queryParams: {
          access_type: 'offline',
          prompt: 'consent',
        }
      }
    });

    if (error) throw error;

    return {
      success: true,
      url: data.url
    };
  } catch (error) {
    console.error('❌ Social sign in failed:', error);
    return { success: false, error: error.message };
  }
};

// Handle OAuth Callback
export const handleOAuthCallback = async (code: string, state: string) => {
  try {
    console.log('🔐 Handling OAuth callback');

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) throw error;

    // Check if profile exists
    const { data: existingProfile } = await supabase
      .from('user_profiles')
      .select('id')
      .eq('id', data.user.id)
      .single();

    // Create profile if doesn't exist (new OAuth user)
    if (!existingProfile) {
      await createUserProfile(data.user.id, {
        full_name: data.user.user_metadata.full_name || data.user.user_metadata.name,
        avatar_url: data.user.user_metadata.avatar_url,
        preferences: {}
      });

      // Assign default plan for new OAuth users
      await assignDefaultPlan(data.user.id);
    }

    return {
      success: true,
      user: data.user,
      session: data.session
    };
  } catch (error) {
    console.error('❌ OAuth callback failed:', error);
    return { success: false, error: error.message };
  }
};

// Sign Out
export const signOutUser = async (accessToken: string) => {
  try {
    console.log('🔐 Signing out user');

    const { error } = await supabase.auth.admin.signOut(accessToken);

    if (error) throw error;

    console.log('✅ User signed out successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ User sign out failed:', error);
    return { success: false, error: error.message };
  }
};

// Get Current User
export const getCurrentUser = async (accessToken: string) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error) throw error;
    if (!user) throw new Error('User not found');

    // Get full profile
    const { data: profile, error: profileError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        *,
        subscription_plans (
          name,
          features,
          credits_included,
          price
        )
      `)
      .eq('user_id', user.id)
      .eq('status', 'active')
      .single();

    return {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        profile: profile || null,
        subscription: subscription || null
      }
    };
  } catch (error) {
    console.error('❌ Get current user failed:', error);
    return { success: false, error: error.message };
  }
};

// Update User Profile
export const updateUserProfile = async (userId: string, updates: any) => {
  try {
    console.log('🔐 Updating user profile:', userId);

    const { data, error } = await supabase
      .from('user_profiles')
      .update({
        ...updates,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)
      .select();

    if (error) throw error;

    console.log('✅ User profile updated:', userId);
    return { success: true, data: data[0] };
  } catch (error) {
    console.error('❌ Update user profile failed:', error);
    return { success: false, error: error.message };
  }
};

// Password Reset
export const resetPassword = async (email: string) => {
  try {
    console.log('🔐 Sending password reset:', email);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${Deno.env.get('FRONTEND_URL')}/auth/reset-password`
    });

    if (error) throw error;

    console.log('✅ Password reset sent:', email);
    return { success: true };
  } catch (error) {
    console.error('❌ Password reset failed:', error);
    return { success: false, error: error.message };
  }
};

// Update Password
export const updatePassword = async (accessToken: string, newPassword: string) => {
  try {
    console.log('🔐 Updating password');

    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) throw error;

    console.log('✅ Password updated successfully');
    return { success: true };
  } catch (error) {
    console.error('❌ Password update failed:', error);
    return { success: false, error: error.message };
  }
};

// Assign Default Plan (Freemium)
const assignDefaultPlan = async (userId: string) => {
  try {
    // Get freemium plan
    const { data: freemiumPlan, error: planError } = await supabase
      .from('subscription_plans')
      .select('*')
      .eq('name', 'freemium')
      .single();

    if (planError) throw planError;

    // Create subscription
    const { data, error } = await supabase
      .from('user_subscriptions')
      .insert({
        user_id: userId,
        plan_id: freemiumPlan.id,
        status: 'active',
        current_period_start: new Date().toISOString(),
        current_period_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(), // 1 year
        credits_included: freemiumPlan.credits_included,
        credits_used: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      });

    if (error) throw error;

    console.log('✅ Default freemium plan assigned:', userId);
    return { success: true, data };
  } catch (error) {
    console.error('❌ Assign default plan failed:', error);
    return { success: false, error: error.message };
  }
};

// Verify Access Token
export const verifyAccessToken = async (accessToken: string) => {
  try {
    const { data: { user }, error } = await supabase.auth.getUser(accessToken);

    if (error) throw error;
    if (!user) throw new Error('Invalid access token');

    return {
      success: true,
      userId: user.id,
      email: user.email
    };
  } catch (error) {
    console.error('❌ Access token verification failed:', error);
    return { success: false, error: error.message };
  }
};

// Delete User Account
export const deleteUserAccount = async (userId: string, accessToken: string) => {
  try {
    console.log('🔐 Deleting user account:', userId);

    // Cancel active subscriptions first
    const { error: cancelError } = await supabase
      .from('user_subscriptions')
      .update({ 
        status: 'cancelled',
        cancelled_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId);

    if (cancelError) throw cancelError;

    // Delete user data (cascade delete will handle related records)
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) throw deleteError;

    console.log('✅ User account deleted:', userId);
    return { success: true };
  } catch (error) {
    console.error('❌ Delete user account failed:', error);
    return { success: false, error: error.message };
  }
};