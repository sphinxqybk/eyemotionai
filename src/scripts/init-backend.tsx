#!/usr/bin/env -S deno run --allow-net --allow-env

// EyeMotion Backend Initialization Script
// Complete setup and verification for EyeMotion Professional AI Film Ecosystem

import { createFullBackup, checkBackupHealth } from './backend-backup.tsx';
import { performHealthCheck, startMonitoring, generateHealthReport } from './health-monitor.tsx';

const BACKEND_URL = 'http://localhost:8000'; // Local development
const PRODUCTION_URL = 'https://nimyngpkksdzobzjjiaa.supabase.co/functions/v1';

interface InitResult {
  success: boolean;
  component: string;
  message: string;
  details?: any;
  error?: string;
}

// ===== MAIN INITIALIZATION =====

export const initializeEyeMotionBackend = async (): Promise<void> => {
  console.log('🎬 EyeMotion Backend Initialization Starting...');
  console.log('🌟 Professional AI Film Ecosystem');
  console.log('═'.repeat(60));

  const results: InitResult[] = [];

  try {
    // 1. Environment Check
    console.log('\n📋 Step 1: Environment Verification');
    const envResult = await checkEnvironment();
    results.push(envResult);
    
    if (!envResult.success) {
      throw new Error('Environment check failed');
    }

    // 2. Database Initialization
    console.log('\n📊 Step 2: Database Initialization');
    const dbResult = await initializeDatabase();
    results.push(dbResult);

    // 3. Storage Setup
    console.log('\n💾 Step 3: Storage Bucket Setup');
    const storageResult = await initializeStorage();
    results.push(storageResult);

    // 4. Subscription Plans Setup
    console.log('\n💳 Step 4: Subscription Plans Setup');
    const plansResult = await initializeSubscriptionPlans();
    results.push(plansResult);

    // 5. Health Check
    console.log('\n🏥 Step 5: System Health Check');
    const healthResult = await runInitialHealthCheck();
    results.push(healthResult);

    // 6. Backup System
    console.log('\n📦 Step 6: Backup System Setup');
    const backupResult = await initializeBackupSystem();
    results.push(backupResult);

    // 7. Monitoring Setup
    console.log('\n📊 Step 7: Monitoring System Setup');
    const monitoringResult = await initializeMonitoring();
    results.push(monitoringResult);

    // Final Report
    console.log('\n═'.repeat(60));
    console.log('🎉 EyeMotion Backend Initialization Complete!');
    console.log('═'.repeat(60));

    printInitializationReport(results);

    // Generate and save setup completion status
    const completionStatus = {
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: Deno.env.get('NODE_ENV') || 'development',
      results: results,
      success: results.every(r => r.success)
    };

    await saveCompletionStatus(completionStatus);

    if (completionStatus.success) {
      console.log('\n✅ All systems initialized successfully!');
      console.log('🚀 EyeMotion Backend is ready for production use');
      
      // Start monitoring
      console.log('\n📊 Starting continuous health monitoring...');
      startMonitoring(5); // Check every 5 minutes
      
    } else {
      console.log('\n⚠️ Some components failed to initialize');
      console.log('Please check the errors above and retry');
    }

  } catch (error) {
    console.error('\n❌ Backend initialization failed:', error);
    
    results.push({
      success: false,
      component: 'initialization',
      message: 'Critical initialization failure',
      error: error.message
    });

    printInitializationReport(results);
    Deno.exit(1);
  }
};

// ===== INITIALIZATION STEPS =====

const checkEnvironment = async (): Promise<InitResult> => {
  try {
    console.log('🔍 Checking environment variables...');

    const requiredEnvVars = [
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY', 
      'SUPABASE_SERVICE_ROLE_KEY'
    ];

    const missing: string[] = [];
    const configured: string[] = [];

    for (const envVar of requiredEnvVars) {
      const value = Deno.env.get(envVar);
      if (!value) {
        missing.push(envVar);
      } else {
        configured.push(envVar);
      }
    }

    // Optional environment variables
    const optionalEnvVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'OPENAI_API_KEY'
    ];

    const optional: Record<string, boolean> = {};
    for (const envVar of optionalEnvVars) {
      optional[envVar] = !!Deno.env.get(envVar);
    }

    if (missing.length > 0) {
      return {
        success: false,
        component: 'environment',
        message: `Missing required environment variables: ${missing.join(', ')}`,
        details: { missing, configured, optional }
      };
    }

    console.log('✅ Environment variables configured');
    console.log(`📋 Required: ${configured.length}/${requiredEnvVars.length}`);
    console.log(`📋 Optional: ${Object.values(optional).filter(Boolean).length}/${optionalEnvVars.length}`);

    return {
      success: true,
      component: 'environment',
      message: 'Environment variables verified',
      details: { configured, optional }
    };
  } catch (error) {
    return {
      success: false,
      component: 'environment',
      message: 'Environment check failed',
      error: error.message
    };
  }
};

const initializeDatabase = async (): Promise<InitResult> => {
  try {
    console.log('📊 Initializing database schema...');

    const response = await fetch(`${getBaseUrl()}/make-server-7dc8476e/init/database`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Database initialization failed');
    }

    console.log('✅ Database schema initialized');

    return {
      success: true,
      component: 'database',
      message: 'Database schema created successfully',
      details: result
    };
  } catch (error) {
    console.error('❌ Database initialization failed:', error);
    
    return {
      success: false,
      component: 'database',
      message: 'Database initialization failed',
      error: error.message
    };
  }
};

const initializeStorage = async (): Promise<InitResult> => {
  try {
    console.log('💾 Setting up storage buckets...');

    const response = await fetch(`${getBaseUrl()}/make-server-7dc8476e/init/storage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Storage initialization failed');
    }

    console.log('✅ Storage buckets configured');

    return {
      success: true,
      component: 'storage',
      message: 'Storage buckets created successfully',
      details: result
    };
  } catch (error) {
    console.error('❌ Storage initialization failed:', error);
    
    return {
      success: false,
      component: 'storage',
      message: 'Storage initialization failed',
      error: error.message
    };
  }
};

const initializeSubscriptionPlans = async (): Promise<InitResult> => {
  try {
    console.log('💳 Setting up subscription plans...');

    const response = await fetch(`${getBaseUrl()}/make-server-7dc8476e/init/plans`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
      }
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      throw new Error(result.error || 'Subscription plans initialization failed');
    }

    console.log('✅ Subscription plans configured');

    return {
      success: true,
      component: 'subscription_plans',
      message: 'Subscription plans created successfully',
      details: result
    };
  } catch (error) {
    console.error('❌ Subscription plans initialization failed:', error);
    
    return {
      success: false,
      component: 'subscription_plans',
      message: 'Subscription plans initialization failed',
      error: error.message
    };
  }
};

const runInitialHealthCheck = async (): Promise<InitResult> => {
  try {
    console.log('🏥 Running comprehensive health check...');

    const healthStatus = await performHealthCheck();

    const criticalIssues = healthStatus.alerts.filter(a => a.level === 'critical');
    const warnings = healthStatus.alerts.filter(a => a.level === 'warning');

    if (criticalIssues.length > 0) {
      console.log('❌ Critical health issues detected:');
      criticalIssues.forEach(issue => {
        console.log(`  - ${issue.component}: ${issue.message}`);
      });
    }

    if (warnings.length > 0) {
      console.log('⚠️ Health warnings detected:');
      warnings.forEach(warning => {
        console.log(`  - ${warning.component}: ${warning.message}`);
      });
    }

    const isHealthy = healthStatus.overall === 'healthy' || healthStatus.overall === 'warning';

    if (isHealthy) {
      console.log('✅ System health check passed');
    }

    return {
      success: isHealthy,
      component: 'health_check',
      message: `System health: ${healthStatus.overall}`,
      details: {
        overall: healthStatus.overall,
        components: Object.keys(healthStatus.components).map(key => ({
          name: key,
          status: healthStatus.components[key as keyof typeof healthStatus.components].status
        })),
        criticalIssues: criticalIssues.length,
        warnings: warnings.length
      }
    };
  } catch (error) {
    console.error('❌ Health check failed:', error);
    
    return {
      success: false,
      component: 'health_check',
      message: 'Health check failed',
      error: error.message
    };
  }
};

const initializeBackupSystem = async (): Promise<InitResult> => {
  try {
    console.log('📦 Setting up backup system...');

    // Check backup system health
    const backupHealth = await checkBackupHealth();
    
    if (!backupHealth.success) {
      throw new Error(`Backup system unhealthy: ${backupHealth.error}`);
    }

    // Create initial backup
    console.log('📦 Creating initial system backup...');
    const initialBackup = await createFullBackup();
    
    if (!initialBackup.success) {
      throw new Error(`Initial backup failed: ${initialBackup.error}`);
    }

    console.log('✅ Backup system initialized');
    console.log(`📦 Initial backup created: ${initialBackup.data!.metadata.totalSize}`);

    return {
      success: true,
      component: 'backup_system',
      message: 'Backup system initialized successfully',
      details: {
        initialBackupSize: initialBackup.data!.metadata.totalSize,
        backupTimestamp: initialBackup.data!.metadata.timestamp
      }
    };
  } catch (error) {
    console.error('❌ Backup system initialization failed:', error);
    
    return {
      success: false,
      component: 'backup_system',
      message: 'Backup system initialization failed',
      error: error.message
    };
  }
};

const initializeMonitoring = async (): Promise<InitResult> => {
  try {
    console.log('📊 Setting up monitoring system...');

    // The monitoring system will be started at the end of initialization
    // For now, just verify it's ready

    const healthReport = await generateHealthReport();
    
    console.log('✅ Monitoring system ready');

    return {
      success: true,
      component: 'monitoring',
      message: 'Monitoring system configured successfully',
      details: {
        healthReportGenerated: true,
        reportLength: healthReport.length
      }
    };
  } catch (error) {
    console.error('❌ Monitoring system initialization failed:', error);
    
    return {
      success: false,
      component: 'monitoring',
      message: 'Monitoring system initialization failed',
      error: error.message
    };
  }
};

// ===== UTILITY FUNCTIONS =====

const getBaseUrl = (): string => {
  const supabaseUrl = Deno.env.get('SUPABASE_URL');
  if (supabaseUrl) {
    return `${supabaseUrl}/functions/v1`;
  }
  return BACKEND_URL;
};

const printInitializationReport = (results: InitResult[]): void => {
  console.log('\n📋 INITIALIZATION REPORT');
  console.log('─'.repeat(50));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}`);
  console.log(`❌ Failed: ${failed.length}`);
  console.log(`📊 Total: ${results.length}`);

  if (successful.length > 0) {
    console.log('\n✅ SUCCESSFUL COMPONENTS:');
    successful.forEach(result => {
      console.log(`  ✓ ${result.component}: ${result.message}`);
    });
  }

  if (failed.length > 0) {
    console.log('\n❌ FAILED COMPONENTS:');
    failed.forEach(result => {
      console.log(`  ✗ ${result.component}: ${result.message}`);
      if (result.error) {
        console.log(`    Error: ${result.error}`);
      }
    });
  }

  console.log('─'.repeat(50));
};

const saveCompletionStatus = async (status: any): Promise<void> => {
  try {
    // Save to file for reference
    const statusJson = JSON.stringify(status, null, 2);
    const filename = `/tmp/eyemotion-init-${Date.now()}.json`;
    
    await Deno.writeTextFile(filename, statusJson);
    console.log(`📄 Initialization report saved: ${filename}`);
  } catch (error) {
    console.warn('⚠️ Could not save initialization report:', error.message);
  }
};

// ===== CLI INTERFACE =====

const printUsage = (): void => {
  console.log(`
🎬 EyeMotion Backend Initialization Tool

Usage:
  deno run --allow-net --allow-env --allow-write init-backend.tsx [command]

Commands:
  init, setup     - Complete backend initialization
  health          - Run health check only
  backup          - Create backup only
  monitor         - Start monitoring only
  report          - Generate system report
  help            - Show this help

Environment Variables Required:
  SUPABASE_URL              - Supabase project URL
  SUPABASE_ANON_KEY         - Supabase anonymous key
  SUPABASE_SERVICE_ROLE_KEY - Supabase service role key

Optional Environment Variables:
  STRIPE_SECRET_KEY         - Stripe payment processing
  STRIPE_WEBHOOK_SECRET     - Stripe webhook verification
  OPENAI_API_KEY           - OpenAI API integration

Examples:
  # Complete initialization
  deno run --allow-net --allow-env --allow-write init-backend.tsx init

  # Health check only
  deno run --allow-net --allow-env init-backend.tsx health

  # Generate report
  deno run --allow-net --allow-env init-backend.tsx report
`);
};

// ===== COMMAND HANDLERS =====

const handleHealthCommand = async (): Promise<void> => {
  console.log('🏥 Running EyeMotion health check...');
  
  const healthStatus = await performHealthCheck();
  const report = await generateHealthReport();
  
  console.log('\n' + report);
  
  if (healthStatus.overall === 'healthy') {
    console.log('\n✅ System is healthy!');
  } else {
    console.log(`\n⚠️ System status: ${healthStatus.overall.toUpperCase()}`);
  }
};

const handleBackupCommand = async (): Promise<void> => {
  console.log('📦 Creating EyeMotion backup...');
  
  const backup = await createFullBackup();
  
  if (backup.success) {
    console.log('✅ Backup completed successfully!');
    console.log(`📦 Size: ${backup.data!.metadata.totalSize}`);
    console.log(`📄 Files: ${backup.data!.metadata.fileCount}`);
  } else {
    console.error('❌ Backup failed:', backup.error);
    Deno.exit(1);
  }
};

const handleMonitorCommand = async (): Promise<void> => {
  console.log('📊 Starting EyeMotion monitoring...');
  
  startMonitoring(5); // Check every 5 minutes
  
  console.log('✅ Monitoring started (every 5 minutes)');
  console.log('Press Ctrl+C to stop monitoring');
  
  // Keep the process running
  while (true) {
    await new Promise(resolve => setTimeout(resolve, 60000)); // Wait 1 minute
  }
};

const handleReportCommand = async (): Promise<void> => {
  console.log('📋 Generating EyeMotion system report...');
  
  const report = await generateHealthReport();
  
  console.log('\n' + report);
  
  // Save report to file
  const filename = `/tmp/eyemotion-report-${Date.now()}.txt`;
  await Deno.writeTextFile(filename, report);
  console.log(`\n📄 Report saved: ${filename}`);
};

// ===== MAIN CLI ENTRY POINT =====

if (import.meta.main) {
  const command = Deno.args[0] || 'init';
  
  console.log('🎬 EyeMotion Professional AI Film Ecosystem');
  console.log('🚀 Backend Initialization & Management Tool');
  console.log('═'.repeat(60));
  
  try {
    switch (command.toLowerCase()) {
      case 'init':
      case 'setup':
        await initializeEyeMotionBackend();
        break;
        
      case 'health':
        await handleHealthCommand();
        break;
        
      case 'backup':
        await handleBackupCommand();
        break;
        
      case 'monitor':
        await handleMonitorCommand();
        break;
        
      case 'report':
        await handleReportCommand();
        break;
        
      case 'help':
      case '--help':
      case '-h':
        printUsage();
        break;
        
      default:
        console.error(`❌ Unknown command: ${command}`);
        printUsage();
        Deno.exit(1);
    }
  } catch (error) {
    console.error('❌ Command failed:', error);
    Deno.exit(1);
  }
}

console.log('\n🎬 EyeMotion Backend Management Tool Ready');
console.log('📚 Use "help" command for usage instructions');