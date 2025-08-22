// EyeMotion File Lifecycle Management Service - Scalable & Cost-Optimized
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { DATABASE_CONSTANTS } from './database-constants.tsx';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// File lifecycle policies by subscription plan
const LIFECYCLE_POLICIES = {
  freemium: {
    archive_days: 30,
    delete_days: 90,
    storage_limit_gb: 1,
    compression_level: 'high'
  },
  creator: {
    archive_days: 90,
    delete_days: 365,
    storage_limit_gb: 50,
    compression_level: 'medium'
  },
  pro: {
    archive_days: 180,
    delete_days: 730,
    storage_limit_gb: 500,
    compression_level: 'low'
  },
  studio: {
    archive_days: 365,
    delete_days: null, // Never auto-delete
    storage_limit_gb: 2000,
    compression_level: 'none'
  }
};

// Storage cost calculation (per GB/month in THB)
const STORAGE_COSTS = {
  hot: 3.60,      // ฿3.60/GB/month (Supabase standard)
  warm: 2.16,     // ฿2.16/GB/month (compressed)
  archive: 0.72,  // ฿0.72/GB/month (Google Cloud Archive)
  cold: 0.36      // ฿0.36/GB/month (Google Cloud Coldline)
};

// File Lifecycle Management Service
export class FileLifecycleService {
  
  // Main lifecycle management function - runs daily
  async manageFileLifecycles() {
    try {
      console.log('🔄 Starting file lifecycle management...');
      
      // Get all files that need lifecycle processing
      const { data: filesToProcess, error } = await supabase
        .from(DATABASE_CONSTANTS.TABLES.PROJECT_FILES)
        .select(`
          *,
          projects!inner(user_id),
          user_subscriptions!inner(
            plan_id,
            subscription_plans!inner(name)
          )
        `)
        .in('processing_status', ['ready', 'uploaded'])
        .lt('updated_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()); // Older than 1 day

      if (error) throw error;

      console.log(`📁 Processing ${filesToProcess?.length || 0} files for lifecycle management`);

      // Process each file
      for (const file of filesToProcess || []) {
        await this.processFileLifecycle(file);
      }

      // Clean up expired files
      await this.cleanupExpiredFiles();
      
      // Update storage usage statistics
      await this.updateStorageStatistics();

      console.log('✅ File lifecycle management completed successfully');
      return { success: true, processed: filesToProcess?.length || 0 };
    } catch (error) {
      console.error('❌ File lifecycle management failed:', error);
      return { success: false, error: error.message };
    }
  }

  // Process individual file lifecycle
  private async processFileLifecycle(file: any) {
    try {
      const userPlan = file.user_subscriptions.subscription_plans.name;
      const policy = LIFECYCLE_POLICIES[userPlan] || LIFECYCLE_POLICIES.freemium;
      
      const fileAge = this.getFileAgeDays(file.updated_at);
      const newStatus = this.determineNewStatus(fileAge, policy, file.is_favorite);

      if (newStatus !== file.processing_status) {
        await this.updateFileStatus(file, newStatus, policy);
        console.log(`📁 File ${file.id} moved to ${newStatus} (age: ${fileAge} days)`);
      }
    } catch (error) {
      console.error(`❌ Failed to process file ${file.id}:`, error);
    }
  }

  // Determine new status based on age and policy
  private determineNewStatus(ageInDays: number, policy: any, isFavorite: boolean) {
    if (isFavorite) {
      // Favorites get special treatment - never auto-delete
      if (ageInDays >= 365) return 'favorite_archive';
      if (ageInDays >= policy.archive_days) return 'favorite_warm';
      return 'ready';
    }

    if (policy.delete_days && ageInDays >= policy.delete_days) {
      return 'scheduled_deletion';
    }
    
    if (ageInDays >= policy.archive_days) {
      return 'archived';
    }
    
    if (ageInDays >= 30) {
      return 'warm_storage';
    }
    
    return 'ready';
  }

  // Update file status and metadata
  private async updateFileStatus(file: any, newStatus: string, policy: any) {
    const updateData = {
      processing_status: newStatus,
      metadata: {
        ...file.metadata,
        lifecycle_updated_at: new Date().toISOString(),
        previous_status: file.processing_status,
        policy_applied: policy,
        cost_tier: this.getCostTier(newStatus)
      }
    };

    // Add compression info if moving to archive
    if (newStatus.includes('archive') || newStatus === 'warm_storage') {
      updateData.metadata.compression_applied = policy.compression_level;
      updateData.metadata.original_size = file.file_size;
    }

    const { error } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.PROJECT_FILES)
      .update(updateData)
      .eq('id', file.id);

    if (error) throw error;

    // Log the lifecycle change
    await this.logLifecycleChange(file, newStatus);
  }

  // Clean up expired files (scheduled for deletion)
  private async cleanupExpiredFiles() {
    try {
      console.log('🗑️ Cleaning up expired files...');

      // Get files scheduled for deletion
      const { data: expiredFiles, error } = await supabase
        .from(DATABASE_CONSTANTS.TABLES.PROJECT_FILES)
        .select('*')
        .eq('processing_status', 'scheduled_deletion')
        .lt('updated_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()); // 7 days grace period

      if (error) throw error;

      for (const file of expiredFiles || []) {
        await this.deleteFile(file);
      }

      console.log(`🗑️ Cleaned up ${expiredFiles?.length || 0} expired files`);
    } catch (error) {
      console.error('❌ Failed to cleanup expired files:', error);
    }
  }

  // Actually delete file from storage and database
  private async deleteFile(file: any) {
    try {
      // Delete from Supabase storage
      if (file.storage_path) {
        const { error: storageError } = await supabase.storage
          .from('project-files')
          .remove([file.storage_path]);

        if (storageError) {
          console.warn(`⚠️ Failed to delete storage file ${file.storage_path}:`, storageError);
        }
      }

      // Delete thumbnail if exists
      if (file.thumbnail_url) {
        const thumbnailPath = file.thumbnail_url.split('/').pop();
        await supabase.storage
          .from('thumbnails')
          .remove([thumbnailPath]);
      }

      // Mark as deleted in database (soft delete for audit trail)
      const { error } = await supabase
        .from(DATABASE_CONSTANTS.TABLES.PROJECT_FILES)
        .update({
          processing_status: 'deleted',
          deleted_at: new Date().toISOString(),
          metadata: {
            ...file.metadata,
            deletion_reason: 'lifecycle_policy',
            deleted_by: 'system'
          }
        })
        .eq('id', file.id);

      if (error) throw error;

      // Log cost savings
      await this.logCostSavings(file);

      console.log(`🗑️ Successfully deleted file ${file.id} (${file.filename})`);
    } catch (error) {
      console.error(`❌ Failed to delete file ${file.id}:`, error);
    }
  }

  // Update storage usage statistics for all users
  private async updateStorageStatistics() {
    try {
      console.log('📊 Updating storage statistics...');

      // Calculate storage usage by user and tier
      const { data: storageStats, error } = await supabase.rpc('calculate_storage_usage');

      if (error) throw error;

      // Update user subscription storage usage
      for (const stat of storageStats || []) {
        await supabase
          .from(DATABASE_CONSTANTS.TABLES.USER_SUBSCRIPTIONS)
          .update({
            storage_used_gb: stat.total_storage_gb,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', stat.user_id)
          .eq('status', 'active');
      }

      console.log(`📊 Updated storage statistics for ${storageStats?.length || 0} users`);
    } catch (error) {
      console.error('❌ Failed to update storage statistics:', error);
    }
  }

  // Get user storage analytics
  async getUserStorageAnalytics(userId: string) {
    try {
      const { data: files, error } = await supabase
        .from(DATABASE_CONSTANTS.TABLES.PROJECT_FILES)
        .select('*')
        .eq('user_id', userId)
        .neq('processing_status', 'deleted');

      if (error) throw error;

      const analytics = this.calculateStorageAnalytics(files || []);
      const costs = this.calculateStorageCosts(analytics);
      const suggestions = this.generateOptimizationSuggestions(analytics);

      return {
        success: true,
        data: {
          analytics,
          costs,
          suggestions,
          total_files: files?.length || 0
        }
      };
    } catch (error) {
      console.error('❌ Failed to get storage analytics:', error);
      return { success: false, error: error.message };
    }
  }

  // Calculate storage analytics by tier
  private calculateStorageAnalytics(files: any[]) {
    const analytics = {
      hot: { count: 0, size_gb: 0 },
      warm: { count: 0, size_gb: 0 },
      archive: { count: 0, size_gb: 0 },
      favorites: { count: 0, size_gb: 0 },
      total: { count: files.length, size_gb: 0 }
    };

    for (const file of files) {
      const sizeGb = (file.file_size || 0) / (1024 * 1024 * 1024);
      analytics.total.size_gb += sizeGb;

      if (file.is_favorite) {
        analytics.favorites.count++;
        analytics.favorites.size_gb += sizeGb;
      }

      switch (file.processing_status) {
        case 'ready':
        case 'uploaded':
          analytics.hot.count++;
          analytics.hot.size_gb += sizeGb;
          break;
        case 'warm_storage':
          analytics.warm.count++;
          analytics.warm.size_gb += sizeGb;
          break;
        case 'archived':
        case 'favorite_archive':
          analytics.archive.count++;
          analytics.archive.size_gb += sizeGb;
          break;
      }
    }

    return analytics;
  }

  // Calculate monthly storage costs
  private calculateStorageCosts(analytics: any) {
    return {
      hot: analytics.hot.size_gb * STORAGE_COSTS.hot,
      warm: analytics.warm.size_gb * STORAGE_COSTS.warm,
      archive: analytics.archive.size_gb * STORAGE_COSTS.archive,
      total: (
        analytics.hot.size_gb * STORAGE_COSTS.hot +
        analytics.warm.size_gb * STORAGE_COSTS.warm +
        analytics.archive.size_gb * STORAGE_COSTS.archive
      ),
      currency: 'THB',
      period: 'monthly'
    };
  }

  // Generate optimization suggestions
  private generateOptimizationSuggestions(analytics: any) {
    const suggestions = [];

    if (analytics.hot.size_gb > 10) {
      suggestions.push({
        type: 'archive_old_files',
        potential_savings: analytics.hot.size_gb * 0.5 * (STORAGE_COSTS.hot - STORAGE_COSTS.archive),
        description: 'Archive files older than 30 days to reduce costs by 75%'
      });
    }

    if (analytics.total.count > 1000 && analytics.favorites.count / analytics.total.count < 0.1) {
      suggestions.push({
        type: 'cleanup_unused',
        potential_savings: analytics.total.size_gb * 0.3 * STORAGE_COSTS.hot,
        description: 'Clean up unused files to free up space and reduce costs'
      });
    }

    if (analytics.warm.size_gb > analytics.archive.size_gb && analytics.warm.size_gb > 5) {
      suggestions.push({
        type: 'aggressive_archiving',
        potential_savings: analytics.warm.size_gb * (STORAGE_COSTS.warm - STORAGE_COSTS.archive),
        description: 'Move warm storage files to archive for additional savings'
      });
    }

    return suggestions;
  }

  // Utility functions
  private getFileAgeDays(updatedAt: string): number {
    return Math.floor((Date.now() - new Date(updatedAt).getTime()) / (1000 * 60 * 60 * 24));
  }

  private getCostTier(status: string): string {
    switch (status) {
      case 'ready':
      case 'uploaded': return 'hot';
      case 'warm_storage': return 'warm';
      case 'archived':
      case 'favorite_archive': return 'archive';
      case 'cold_storage': return 'cold';
      default: return 'hot';
    }
  }

  private async logLifecycleChange(file: any, newStatus: string) {
    try {
      await supabase
        .from(DATABASE_CONSTANTS.TABLES.ACTIVITY_LOGS)
        .insert({
          user_id: file.user_id,
          action: 'file_lifecycle_change',
          resource_type: 'file',
          resource_id: file.id,
          details: {
            filename: file.filename,
            old_status: file.processing_status,
            new_status: newStatus,
            file_age_days: this.getFileAgeDays(file.updated_at),
            file_size_gb: (file.file_size || 0) / (1024 * 1024 * 1024)
          }
        });
    } catch (error) {
      console.warn('Failed to log lifecycle change:', error);
    }
  }

  private async logCostSavings(file: any) {
    const sizeMb = (file.file_size || 0) / (1024 * 1024);
    const monthlySavings = (sizeMb / 1024) * STORAGE_COSTS.hot;

    try {
      await supabase
        .from(DATABASE_CONSTANTS.TABLES.ACTIVITY_LOGS)
        .insert({
          user_id: file.user_id,
          action: 'cost_optimization',
          resource_type: 'file',
          resource_id: file.id,
          details: {
            action_type: 'file_deletion',
            filename: file.filename,
            file_size_mb: sizeMb,
            monthly_savings_thb: monthlySavings,
            deletion_reason: 'lifecycle_policy'
          }
        });
    } catch (error) {
      console.warn('Failed to log cost savings:', error);
    }
  }
}

// Cost monitoring and alerting service
export class CostMonitoringService {
  
  // Check user costs against limits
  async checkUserCosts(userId: string) {
    try {
      const storageAnalytics = await new FileLifecycleService().getUserStorageAnalytics(userId);
      if (!storageAnalytics.success) throw new Error(storageAnalytics.error);

      const { costs } = storageAnalytics.data;
      const userPlan = await this.getUserPlan(userId);
      const costLimit = this.getCostLimit(userPlan.name);

      const costPercentage = (costs.total / costLimit) * 100;

      // Send alerts based on cost percentage
      if (costPercentage >= 90) {
        await this.sendCostAlert(userId, 'critical', { costs, limit: costLimit, percentage: costPercentage });
      } else if (costPercentage >= 75) {
        await this.sendCostAlert(userId, 'warning', { costs, limit: costLimit, percentage: costPercentage });
      }

      return {
        success: true,
        data: {
          costs,
          limit: costLimit,
          percentage: costPercentage,
          status: costPercentage >= 90 ? 'critical' : costPercentage >= 75 ? 'warning' : 'ok'
        }
      };
    } catch (error) {
      console.error('❌ Failed to check user costs:', error);
      return { success: false, error: error.message };
    }
  }

  private async getUserPlan(userId: string) {
    const { data, error } = await supabase
      .from(DATABASE_CONSTANTS.TABLES.USER_SUBSCRIPTIONS)
      .select(`
        *,
        subscription_plans(*)
      `)
      .eq('user_id', userId)
      .eq('status', 'active')
      .single();

    if (error) throw error;
    return data.subscription_plans;
  }

  private getCostLimit(planName: string): number {
    const limits = {
      freemium: 50,    // ฿50/month
      creator: 200,    // ฿200/month
      pro: 800,        // ฿800/month
      studio: 3000     // ฿3,000/month
    };
    return limits[planName] || limits.freemium;
  }

  private async sendCostAlert(userId: string, severity: string, data: any) {
    // Log the alert
    await supabase
      .from(DATABASE_CONSTANTS.TABLES.ACTIVITY_LOGS)
      .insert({
        user_id: userId,
        action: 'cost_alert',
        details: {
          severity,
          current_cost: data.costs.total,
          cost_limit: data.limit,
          percentage: data.percentage,
          alert_time: new Date().toISOString()
        }
      });

    // Here you would integrate with email service to send actual alerts
    console.log(`🚨 Cost alert sent to user ${userId}: ${severity} - ${data.percentage.toFixed(1)}% of limit`);
  }
}

// Export the services
export default {
  FileLifecycleService,
  CostMonitoringService
};