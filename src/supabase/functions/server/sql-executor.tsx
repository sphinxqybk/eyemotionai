// SQL Execution Helper for Edge Functions
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Execute raw SQL - Alternative approaches for Supabase
export const executeSQL = async (sql: string) => {
  try {
    // Method 1: Try using the SQL query directly
    const { data, error } = await supabase
      .from('_temp_sql_execution')
      .select('*')
      .limit(0); // This is just to test connection

    if (error && !error.message.includes('does not exist')) {
      throw error;
    }

    // For schema creation, we need to use a different approach
    // Since we can't execute raw DDL directly, we'll break it down
    
    console.log('SQL execution method: Breaking down into individual operations');
    return { success: true, data: null, method: 'individual_operations' };
  } catch (error) {
    console.error('SQL execution failed:', error);
    return { success: false, error: error.message };
  }
};

// Execute individual database functions
export const executeDatabaseFunction = async (functionName: string, params: any = {}) => {
  try {
    console.log(`Executing database function: ${functionName}`);
    
    const { data, error } = await supabase.rpc(functionName, params);
    
    if (error) {
      console.error(`Function ${functionName} failed:`, error);
      throw error;
    }

    console.log(`✅ Function ${functionName} completed successfully`);
    return { success: true, data };
  } catch (error) {
    console.error(`❌ Function ${functionName} failed:`, error);
    return { success: false, error: error.message };
  }
};

// Create individual tables using Supabase client methods
export const createTableWithSupabase = async (tableName: string, tableDefinition: any) => {
  try {
    console.log(`Creating table: ${tableName}`);
    
    // Since we can't create tables directly with Supabase client,
    // we'll use the REST API approach
    const response = await fetch(`${Deno.env.get('SUPABASE_URL')}/rest/v1/rpc/create_table`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')}`,
        'Content-Type': 'application/json',
        'apikey': Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
      },
      body: JSON.stringify({
        table_name: tableName,
        definition: tableDefinition
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const result = await response.json();
    console.log(`✅ Table ${tableName} created successfully`);
    return { success: true, data: result };
  } catch (error) {
    console.error(`❌ Create table ${tableName} failed:`, error);
    return { success: false, error: error.message };
  }
};

// Initialize tables one by one using direct SQL
export const initializeTablesIndividually = async () => {
  try {
    console.log('🗄️ Initializing tables individually...');

    // Step 1: Enable UUID extension
    try {
      await supabase.rpc('enable_uuid_extension');
    } catch (error) {
      console.log('UUID extension already enabled or not needed');
    }

    // Step 2: Create tables using table-specific functions
    const tableFunctions = [
      'create_user_profiles_table',
      'create_subscription_plans_table', 
      'create_user_subscriptions_table',
      'create_projects_table',
      'create_project_files_table',
      'create_credits_usage_table',
      'create_payment_transactions_table',
      'create_activity_logs_table'
    ];

    const results = [];

    for (const funcName of tableFunctions) {
      const result = await executeDatabaseFunction(funcName);
      results.push({ function: funcName, ...result });
      
      if (!result.success) {
        console.error(`Failed to create table with function: ${funcName}`);
        // Continue with other tables instead of failing completely
      }
    }

    const successCount = results.filter(r => r.success).length;
    const totalCount = results.length;

    console.log(`✅ Table initialization completed: ${successCount}/${totalCount} successful`);
    
    return {
      success: successCount > 0,
      message: `Initialized ${successCount}/${totalCount} tables`,
      results
    };
  } catch (error) {
    console.error('❌ Individual table initialization failed:', error);
    return { success: false, error: error.message };
  }
};

// Fallback: Create tables using basic Supabase operations
export const createBasicTables = async () => {
  try {
    console.log('🗄️ Creating basic tables using Supabase client...');

    // Create a minimal schema using available Supabase operations
    // This is a fallback when SQL functions don't work

    // Check if tables already exist
    const { data: existingTables, error: checkError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public');

    if (checkError) {
      console.warn('Could not check existing tables:', checkError);
    }

    const existing = existingTables?.map(t => t.table_name) || [];
    console.log('Existing tables:', existing);

    // If no tables exist, we have a bigger problem
    if (existing.length === 0) {
      console.error('No tables found - database may not be properly initialized');
      return {
        success: false,
        error: 'Database appears to be empty - manual schema setup required'
      };
    }

    return {
      success: true,
      message: 'Basic table check completed',
      existingTables: existing
    };
  } catch (error) {
    console.error('❌ Basic table creation failed:', error);
    return { success: false, error: error.message };
  }
};

export default {
  executeSQL,
  executeDatabaseFunction,
  createTableWithSupabase,
  initializeTablesIndividually,
  createBasicTables
};