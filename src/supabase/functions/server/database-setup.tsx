// EyeMotion Database Setup and Management - Fixed Edge Function Version
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DATABASE_CONSTANTS } from './database-constants.tsx';
import { initializeTablesIndividually, createBasicTables, executeDatabaseFunction } from './sql-executor.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Execute complete database schema setup
export const createDatabaseTables = async () => {
  try {
    console.log('🗄️ Creating EyeMotion database schema...');

    // Try the individual table approach first
    const result = await initializeTablesIndividually();
    
    if (result.success) {
      console.log('✅ Database schema created successfully');
      return { success: true, message: 'Database schema created', details: result };
    }

    // Fallback to basic check
    console.log('Primary approach failed, trying fallback...');
    const fallbackResult = await createBasicTables();
    
    return {
      success: fallbackResult.success,
      message: fallbackResult.success ? 'Database schema verified' : 'Database schema creation failed',
      details: fallbackResult,
      fallback: true
    };
  } catch (error) {
    console.error('❌ Database schema creation failed:', error);
    return { success: false, error: error.message };
  }
};

// Validate database schema
export const validateDatabaseSchema = async () => {
  try {
    console.log('🔍 Validating database schema...');

    // Check if core tables exist
    const requiredTables = Object.values(DATABASE_CONSTANTS.TABLES);
    const existingTables = [];
    const missingTables = [];

    for (const tableName of requiredTables) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(0);

        if (error) {
          console.warn(`Table ${tableName} check failed:`, error.message);
          missingTables.push(tableName);
        } else {
          existingTables.push(tableName);
        }
      } catch (err) {
        missingTables.push(tableName);
      }
    }

    // Check schema version if possible
    let versionInfo = null;
    try {
      const { data: versionCheck, error: versionError } = await supabase
        .from('schema_version')
        .select('*')
        .order('applied_at', { ascending: false })
        .limit(1);

      if (!versionError && versionCheck) {
        versionInfo = versionCheck[0];
      }
    } catch (err) {
      console.warn('Schema version check failed:', err);
    }

    console.log('✅ Database schema validation completed');
    return { 
      success: true, 
      existingTables,
      missingTables,
      version: versionInfo,
      totalTables: requiredTables.length,
      existingCount: existingTables.length,
      missingCount: missingTables.length
    };
  } catch (error) {
    console.error('❌ Database schema validation failed:', error);
    return { success: false, error: error.message };
  }
};

// User Profile Management
export const createUserProfile = async (userId: string, profileData: any) => {
  try {
    const { data, error } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.USER_PROFILES)
      .insert({
        id: userId,
        full_name: profileData.full_name,
        company_name: profileData.company_name,
        industry: profileData.industry || DATABASE_CONSTANTS.DEFAULTS.INDUSTRY,
        country: profileData.country || DATABASE_CONSTANTS.DEFAULTS.COUNTRY,
        phone: profileData.phone,
        avatar_url: profileData.avatar_url,
        preferences: profileData.preferences || {},
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    
    console.log('✅ User profile created:', userId);
    return { success: true, data: data?.[0] };
  } catch (error) {
    console.error('❌ Create user profile failed:', error);
    return { success: false, error: error.message };
  }
};

// Subscription Management
export const createSubscription = async (userId: string, planId: string, stripeData: any) => {
  try {
    const { data, error } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.USER_SUBSCRIPTIONS)
      .insert({
        user_id: userId,
        plan_id: planId,
        stripe_subscription_id: stripeData.subscriptionId,
        stripe_customer_id: stripeData.customerId,
        status: DATABASE_CONSTANTS.SUBSCRIPTION_STATUS.ACTIVE,
        current_period_start: stripeData.currentPeriodStart,
        current_period_end: stripeData.currentPeriodEnd,
        credits_included: stripeData.creditsIncluded,
        credits_used: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    
    console.log('✅ Subscription created:', userId, planId);
    return { success: true, data: data?.[0] };
  } catch (error) {
    console.error('❌ Create subscription failed:', error);
    return { success: false, error: error.message };
  }
};

// Project Management
export const createProject = async (userId: string, projectData: any) => {
  try {
    const { data, error } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.PROJECTS)
      .insert({
        user_id: userId,
        name: projectData.name,
        description: projectData.description,
        type: projectData.type || DATABASE_CONSTANTS.PROJECT_TYPES.FEATURE_FILM,
        settings: projectData.settings || {},
        thumbnail_url: projectData.thumbnail_url,
        status: DATABASE_CONSTANTS.PROJECT_STATUS.DRAFT,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    
    console.log('✅ Project created:', data?.[0]?.id);
    return { success: true, data: data?.[0] };
  } catch (error) {
    console.error('❌ Create project failed:', error);
    return { success: false, error: error.message };
  }
};

// File Management
export const uploadProjectFile = async (projectId: string, fileData: any) => {
  try {
    const { data, error } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.PROJECT_FILES)
      .insert({
        project_id: projectId,
        user_id: fileData.userId,
        filename: fileData.filename,
        original_name: fileData.originalName,
        file_type: fileData.fileType,
        file_size: fileData.fileSize,
        storage_path: fileData.storagePath,
        thumbnail_url: fileData.thumbnailUrl,
        duration: fileData.duration,
        metadata: fileData.metadata || {},
        processing_status: DATABASE_CONSTANTS.PROCESSING_STATUS.PENDING,
        created_at: new Date().toISOString()
      })
      .select();

    if (error) throw error;
    
    console.log('✅ File uploaded:', data?.[0]?.id);
    return { success: true, data: data?.[0] };
  } catch (error) {
    console.error('❌ File upload failed:', error);
    return { success: false, error: error.message };
  }
};

// Credits Management using database function (with fallback)
export const deductCredits = async (userId: string, amount: number, action: string) => {
  try {
    // Try using the database function first
    const functionResult = await executeDatabaseFunction('deduct_user_credits', {
      p_user_id: userId,
      p_credits_to_deduct: amount,
      p_action: action
    });

    if (functionResult.success) {
      const result = functionResult.data?.[0];
      if (result?.success) {
        console.log('✅ Credits deducted via function:', userId, amount, action);
        return { 
          success: true, 
          remainingCredits: result.remaining_credits 
        };
      } else {
        throw new Error(result?.error_message || 'Failed to deduct credits');
      }
    }

    // Fallback: Manual credits deduction
    console.log('Function approach failed, using manual deduction...');
    
    // Get current subscription
    const { data: subscription, error: subError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.USER_SUBSCRIPTIONS)
      .select('*')
      .eq('user_id', userId)
      .eq('status', DATABASE_CONSTANTS.SUBSCRIPTION_STATUS.ACTIVE)
      .single();

    if (subError) throw subError;

    const remainingCredits = subscription.credits_included - subscription.credits_used;
    if (remainingCredits < amount) {
      throw new Error('Insufficient credits');
    }

    // Update subscription credits
    const { error: updateError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.USER_SUBSCRIPTIONS)
      .update({ 
        credits_used: subscription.credits_used + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', subscription.id);

    if (updateError) throw updateError;

    // Log credits usage
    const { error: logError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.CREDITS_USAGE)
      .insert({
        user_id: userId,
        subscription_id: subscription.id,
        credits_used: amount,
        action: action,
        created_at: new Date().toISOString()
      });

    if (logError) {
      console.warn('Credits usage logging failed:', logError);
    }

    console.log('✅ Credits deducted via fallback:', userId, amount, action);
    return { 
      success: true, 
      remainingCredits: remainingCredits - amount 
    };
  } catch (error) {
    console.error('❌ Deduct credits failed:', error);
    return { success: false, error: error.message };
  }
};

// Analytics and Reporting
export const getUserAnalytics = async (userId: string) => {
  try {
    // Get user subscription
    const { data: subscription, error: subscriptionError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.USER_SUBSCRIPTIONS)
      .select(`
        *,
        subscription_plans (
          name,
          display_name,
          features,
          credits_included,
          price
        )
      `)
      .eq('user_id', userId)
      .eq('status', DATABASE_CONSTANTS.SUBSCRIPTION_STATUS.ACTIVE)
      .single();

    if (subscriptionError && subscriptionError.code !== 'PGRST116') {
      console.warn('Get subscription warning:', subscriptionError);
    }

    // Get user's projects
    const { data: projects, error: projectsError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.PROJECTS)
      .select('id, name, created_at, status, type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (projectsError) {
      console.warn('Get projects warning:', projectsError);
    }

    // Get recent credits usage
    const { data: creditsUsage, error: creditsError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.CREDITS_USAGE)
      .select('credits_used, action, created_at, resource_type')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(10);

    if (creditsError) {
      console.warn('Get credits usage warning:', creditsError);
    }

    // Get file count
    const { count: fileCount, error: fileCountError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.PROJECT_FILES)
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId);

    if (fileCountError) {
      console.warn('Get file count warning:', fileCountError);
    }

    return {
      success: true,
      data: {
        subscription: subscription || null,
        projects: projects || [],
        recentCreditsUsage: creditsUsage || [],
        totalProjects: projects?.length || 0,
        totalFiles: fileCount || 0,
        creditsRemaining: subscription ? 
          (subscription.credits_included + (subscription.extra_credits || 0) - subscription.credits_used) : 0
      }
    };
  } catch (error) {
    console.error('❌ Get user analytics failed:', error);
    return { success: false, error: error.message };
  }
};

// Database Health Check
export const checkDatabaseHealth = async () => {
  try {
    // Test basic connection
    const { data, error } = await supabase.auth.getSession();
    
    if (error && error.message !== 'Auth session missing!') {
      throw error;
    }

    // Test table access
    const { data: profileData, error: profileError } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.USER_PROFILES)
      .select('id')
      .limit(1);

    const healthStatus = {
      success: true,
      message: 'Database connection healthy',
      timestamp: new Date().toISOString(),
      tests: {
        connection: 'passed',
        tableAccess: profileError ? 'failed' : 'passed',
        auth: 'passed'
      }
    };

    if (profileError) {
      healthStatus.tests.tableAccess = 'failed';
      console.warn('Table access test failed:', profileError);
    }

    return healthStatus;
  } catch (error) {
    console.error('❌ Database health check failed:', error);
    return { 
      success: false, 
      error: error.message,
      timestamp: new Date().toISOString(),
      tests: {
        connection: 'failed',
        tableAccess: 'unknown',
        auth: 'failed'
      }
    };
  }
};

// Initialize database with validation
export const initializeDatabaseWithValidation = async () => {
  try {
    console.log('🚀 Initializing EyeMotion database...');

    // Create schema
    const createResult = await createDatabaseTables();
    
    if (!createResult.success) {
      console.warn('Schema creation had issues:', createResult.error);
    }

    // Validate schema
    const validateResult = await validateDatabaseSchema();
    if (!validateResult.success) {
      console.warn('Database validation warning:', validateResult.error);
    }

    // Health check
    const healthResult = await checkDatabaseHealth();
    if (!healthResult.success) {
      console.warn('Database health check warning:', healthResult.error);
    }

    const overallSuccess = createResult.success && 
                          (validateResult.success || validateResult.existingCount > 0) && 
                          healthResult.success;

    console.log(overallSuccess ? '✅ Database initialization completed successfully' : '⚠️ Database initialization completed with warnings');
    
    return {
      success: overallSuccess,
      message: overallSuccess ? 
        'Database initialized and validated' : 
        'Database initialization completed with some warnings',
      creation: createResult,
      validation: validateResult,
      health: healthResult
    };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    return { success: false, error: error.message };
  }
};

// Export all functions
export default {
  createDatabaseTables,
  validateDatabaseSchema,
  createUserProfile,
  createSubscription,
  createProject,
  uploadProjectFile,
  deductCredits,
  getUserAnalytics,
  checkDatabaseHealth,
  initializeDatabaseWithValidation
};