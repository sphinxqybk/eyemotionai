// EyeMotion Admin Dashboard Service
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabase = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
);

// Admin User Verification
export const verifyAdminAccess = async (userId: string) => {
  try {
    const { data: profile, error } = await supabase
      .from('user_profiles')
      .select('role, permissions')
      .eq('id', userId)
      .single();

    if (error) throw error;

    const isAdmin = profile?.role === 'admin' || profile?.role === 'super_admin';
    if (!isAdmin) {
      throw new Error('Insufficient admin privileges');
    }

    return { success: true, role: profile.role };
  } catch (error) {
    console.error('❌ Admin access verification failed:', error);
    return { success: false, error: error.message };
  }
};

// Dashboard Overview Analytics
export const getDashboardOverview = async () => {
  try {
    console.log('📊 Getting dashboard overview...');

    // Get user statistics
    const { data: userStats, error: userError } = await supabase
      .from('user_profiles')
      .select('id, created_at, country')
      .order('created_at', { ascending: false });

    if (userError) throw userError;

    // Get subscription statistics
    const { data: subStats, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        id, status, created_at, plan_id,
        subscription_plans (name, price)
      `)
      .order('created_at', { ascending: false });

    if (subError) throw subError;

    // Get project statistics
    const { data: projectStats, error: projectError } = await supabase
      .from('projects')
      .select('id, created_at, status, type')
      .order('created_at', { ascending: false });

    if (projectError) throw projectError;

    // Get revenue statistics
    const { data: revenueStats, error: revenueError } = await supabase
      .from('payment_transactions')
      .select('amount, currency, created_at, status')
      .eq('status', 'completed')
      .order('created_at', { ascending: false });

    if (revenueError) throw revenueError;

    // Calculate metrics
    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    // User metrics
    const totalUsers = userStats.length;
    const newUsersThisMonth = userStats.filter(u => 
      new Date(u.created_at) >= thirtyDaysAgo
    ).length;
    const newUsersThisWeek = userStats.filter(u => 
      new Date(u.created_at) >= sevenDaysAgo
    ).length;

    // Subscription metrics
    const activeSubscriptions = subStats.filter(s => s.status === 'active').length;
    const paidSubscriptions = subStats.filter(s => 
      s.status === 'active' && s.subscription_plans?.price > 0
    ).length;
    const freeUsers = subStats.filter(s => 
      s.status === 'active' && s.subscription_plans?.price === 0
    ).length;

    // Revenue metrics
    const totalRevenue = revenueStats.reduce((sum, t) => sum + (t.amount || 0), 0) / 100; // Convert from satang
    const monthlyRevenue = revenueStats.filter(t => 
      new Date(t.created_at) >= thirtyDaysAgo
    ).reduce((sum, t) => sum + (t.amount || 0), 0) / 100;

    // Project metrics
    const totalProjects = projectStats.length;
    const activeProjects = projectStats.filter(p => p.status === 'active').length;
    const completedProjects = projectStats.filter(p => p.status === 'completed').length;

    // Plan distribution
    const planDistribution = subStats.reduce((acc, sub) => {
      const planName = sub.subscription_plans?.name || 'unknown';
      acc[planName] = (acc[planName] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Country distribution
    const countryDistribution = userStats.reduce((acc, user) => {
      const country = user.country || 'Unknown';
      acc[country] = (acc[country] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log('✅ Dashboard overview generated');

    return {
      success: true,
      data: {
        users: {
          total: totalUsers,
          newThisMonth: newUsersThisMonth,
          newThisWeek: newUsersThisWeek,
          growthRate: totalUsers > 0 ? (newUsersThisMonth / totalUsers * 100).toFixed(1) : '0'
        },
        subscriptions: {
          total: activeSubscriptions,
          paid: paidSubscriptions,
          free: freeUsers,
          conversionRate: totalUsers > 0 ? (paidSubscriptions / totalUsers * 100).toFixed(1) : '0'
        },
        revenue: {
          total: totalRevenue,
          monthly: monthlyRevenue,
          mrr: calculateMRR(subStats),
          arpu: paidSubscriptions > 0 ? (monthlyRevenue / paidSubscriptions).toFixed(2) : '0'
        },
        projects: {
          total: totalProjects,
          active: activeProjects,
          completed: completedProjects,
          avgPerUser: totalUsers > 0 ? (totalProjects / totalUsers).toFixed(1) : '0'
        },
        distributions: {
          plans: planDistribution,
          countries: countryDistribution
        }
      }
    };
  } catch (error) {
    console.error('❌ Dashboard overview failed:', error);
    return { success: false, error: error.message };
  }
};

// Calculate Monthly Recurring Revenue
const calculateMRR = (subscriptions: any[]) => {
  return subscriptions
    .filter(s => s.status === 'active' && s.subscription_plans?.price > 0)
    .reduce((sum, s) => sum + (s.subscription_plans?.price || 0), 0) / 100;
};

// Get User Management Data
export const getUserManagement = async (page = 1, limit = 50, filter = '') => {
  try {
    console.log('👥 Getting user management data...');

    const offset = (page - 1) * limit;
    
    let query = supabase
      .from('user_profiles')
      .select(`
        *,
        user_subscriptions!inner (
          status,
          created_at as subscription_date,
          subscription_plans (name, price)
        )
      `)
      .order('created_at', { ascending: false })
      .range(offset, offset + limit - 1);

    if (filter) {
      query = query.or(`full_name.ilike.%${filter}%,email.ilike.%${filter}%`);
    }

    const { data, error, count } = await query;

    if (error) throw error;

    // Get total count for pagination
    const { count: totalCount, error: countError } = await supabase
      .from('user_profiles')
      .select('id', { count: 'exact', head: true });

    if (countError) throw countError;

    console.log('✅ User management data retrieved');

    return {
      success: true,
      data: {
        users: data,
        pagination: {
          page,
          limit,
          total: totalCount || 0,
          pages: Math.ceil((totalCount || 0) / limit)
        }
      }
    };
  } catch (error) {
    console.error('❌ Get user management failed:', error);
    return { success: false, error: error.message };
  }
};

// Get Financial Analytics
export const getFinancialAnalytics = async (period = '30d') => {
  try {
    console.log('💰 Getting financial analytics...');

    const now = new Date();
    let startDate: Date;

    switch (period) {
      case '7d':
        startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
        break;
      case '30d':
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
        break;
      case '90d':
        startDate = new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
        break;
      case '1y':
        startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
        break;
      default:
        startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    }

    // Get payment transactions
    const { data: transactions, error: transError } = await supabase
      .from('payment_transactions')
      .select('amount, currency, created_at, status, metadata')
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (transError) throw transError;

    // Get subscription events
    const { data: subscriptions, error: subError } = await supabase
      .from('user_subscriptions')
      .select(`
        created_at, status, plan_id,
        subscription_plans (name, price)
      `)
      .gte('created_at', startDate.toISOString())
      .order('created_at', { ascending: true });

    if (subError) throw subError;

    // Calculate daily revenue
    const dailyRevenue = transactions
      .filter(t => t.status === 'completed')
      .reduce((acc, t) => {
        const date = new Date(t.created_at).toISOString().split('T')[0];
        acc[date] = (acc[date] || 0) + (t.amount || 0) / 100;
        return acc;
      }, {} as Record<string, number>);

    // Calculate subscription growth
    const subscriptionGrowth = subscriptions.reduce((acc, s) => {
      const date = new Date(s.created_at).toISOString().split('T')[0];
      if (!acc[date]) acc[date] = { new: 0, cancelled: 0 };
      
      if (s.status === 'active') {
        acc[date].new += 1;
      } else if (s.status === 'cancelled') {
        acc[date].cancelled += 1;
      }
      
      return acc;
    }, {} as Record<string, { new: number; cancelled: number }>);

    // Revenue by plan
    const revenueByPlan = subscriptions
      .filter(s => s.status === 'active')
      .reduce((acc, s) => {
        const planName = s.subscription_plans?.name || 'unknown';
        const planPrice = s.subscription_plans?.price || 0;
        acc[planName] = (acc[planName] || 0) + planPrice / 100;
        return acc;
      }, {} as Record<string, number>);

    // Calculate metrics
    const totalRevenue = Object.values(dailyRevenue).reduce((sum, rev) => sum + rev, 0);
    const avgDailyRevenue = totalRevenue / Object.keys(dailyRevenue).length;
    
    // Churn rate calculation
    const activeCount = subscriptions.filter(s => s.status === 'active').length;
    const cancelledCount = subscriptions.filter(s => s.status === 'cancelled').length;
    const churnRate = activeCount > 0 ? (cancelledCount / (activeCount + cancelledCount) * 100) : 0;

    console.log('✅ Financial analytics generated');

    return {
      success: true,
      data: {
        summary: {
          totalRevenue,
          avgDailyRevenue: avgDailyRevenue.toFixed(2),
          churnRate: churnRate.toFixed(2),
          period
        },
        dailyRevenue,
        subscriptionGrowth,
        revenueByPlan,
        transactions: transactions.slice(-20) // Last 20 transactions
      }
    };
  } catch (error) {
    console.error('❌ Financial analytics failed:', error);
    return { success: false, error: error.message };
  }
};

// Get System Health Metrics
export const getSystemHealth = async () => {
  try {
    console.log('🔧 Getting system health metrics...');

    // Database health
    const { data: dbHealth, error: dbError } = await supabase
      .from('user_profiles')
      .select('count')
      .limit(1);

    // Storage usage
    const { data: storageStats, error: storageError } = await supabase
      .from('project_files')
      .select('file_size, processing_status, created_at');

    if (storageError) throw storageError;

    // Calculate storage metrics
    const totalStorageBytes = storageStats.reduce((sum, file) => 
      sum + (file.file_size || 0), 0
    );
    const totalStorageGB = totalStorageBytes / (1024 * 1024 * 1024);

    // Processing status distribution
    const processingStats = storageStats.reduce((acc, file) => {
      const status = file.processing_status || 'unknown';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Error rate calculation
    const errorRate = storageStats.length > 0 ? 
      ((processingStats.error || 0) / storageStats.length * 100) : 0;

    // Recent activity
    const recentFiles = storageStats
      .filter(f => new Date(f.created_at) > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .length;

    console.log('✅ System health metrics generated');

    return {
      success: true,
      data: {
        database: {
          status: dbError ? 'error' : 'healthy',
          error: dbError?.message
        },
        storage: {
          totalGB: totalStorageGB.toFixed(2),
          totalFiles: storageStats.length,
          recentFiles,
          errorRate: errorRate.toFixed(2)
        },
        processing: processingStats,
        uptime: {
          status: 'healthy',
          lastCheck: new Date().toISOString()
        }
      }
    };
  } catch (error) {
    console.error('❌ System health check failed:', error);
    return { success: false, error: error.message };
  }
};

// Manage User Subscription
export const manageUserSubscription = async (
  adminUserId: string, 
  targetUserId: string, 
  action: string, 
  planId?: string
) => {
  try {
    console.log('🔧 Managing user subscription:', action, targetUserId);

    // Verify admin access
    const adminCheck = await verifyAdminAccess(adminUserId);
    if (!adminCheck.success) {
      throw new Error('Admin access required');
    }

    switch (action) {
      case 'upgrade':
        if (!planId) throw new Error('Plan ID required for upgrade');
        
        // Update subscription
        const { error: upgradeError } = await supabase
          .from('user_subscriptions')
          .update({
            plan_id: planId,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', targetUserId)
          .eq('status', 'active');

        if (upgradeError) throw upgradeError;
        break;

      case 'cancel':
        // Cancel subscription
        const { error: cancelError } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'cancelled',
            cancelled_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          })
          .eq('user_id', targetUserId)
          .eq('status', 'active');

        if (cancelError) throw cancelError;
        break;

      case 'reactivate':
        // Reactivate subscription
        const { error: reactivateError } = await supabase
          .from('user_subscriptions')
          .update({
            status: 'active',
            cancelled_at: null,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', targetUserId)
          .eq('status', 'cancelled');

        if (reactivateError) throw reactivateError;
        break;

      default:
        throw new Error('Invalid action');
    }

    // Log admin action
    await logAdminAction(adminUserId, 'subscription_management', {
      action,
      targetUserId,
      planId,
      timestamp: new Date().toISOString()
    });

    console.log('✅ User subscription managed:', action, targetUserId);
    return { success: true, message: `Subscription ${action} completed` };
  } catch (error) {
    console.error('❌ Manage user subscription failed:', error);
    return { success: false, error: error.message };
  }
};

// Log Admin Actions
const logAdminAction = async (adminUserId: string, action: string, details: any) => {
  try {
    await supabase
      .from('activity_logs')
      .insert({
        user_id: adminUserId,
        action: `admin:${action}`,
        details: details,
        ip_address: null, // Would be populated in real implementation
        user_agent: null, // Would be populated in real implementation
        created_at: new Date().toISOString()
      });

    console.log('✅ Admin action logged:', action);
  } catch (error) {
    console.error('❌ Log admin action failed:', error);
  }
};

// Export Analytics Data
export const exportAnalyticsData = async (
  adminUserId: string, 
  dataType: string, 
  format = 'json'
) => {
  try {
    console.log('📊 Exporting analytics data:', dataType);

    // Verify admin access
    const adminCheck = await verifyAdminAccess(adminUserId);
    if (!adminCheck.success) {
      throw new Error('Admin access required');
    }

    let data: any;

    switch (dataType) {
      case 'users':
        const { data: userData, error: userError } = await supabase
          .from('user_profiles')
          .select(`
            *,
            user_subscriptions (
              status, created_at,
              subscription_plans (name, price)
            )
          `);
        if (userError) throw userError;
        data = userData;
        break;

      case 'revenue':
        const { data: revenueData, error: revenueError } = await supabase
          .from('payment_transactions')
          .select('*')
          .eq('status', 'completed');
        if (revenueError) throw revenueError;
        data = revenueData;
        break;

      case 'projects':
        const { data: projectData, error: projectError } = await supabase
          .from('projects')
          .select('*');
        if (projectError) throw projectError;
        data = projectData;
        break;

      default:
        throw new Error('Invalid data type');
    }

    // Log export action
    await logAdminAction(adminUserId, 'data_export', {
      dataType,
      format,
      recordCount: data.length,
      timestamp: new Date().toISOString()
    });

    console.log('✅ Analytics data exported:', dataType);
    return {
      success: true,
      data: format === 'json' ? data : convertToCSV(data),
      filename: `eyemotion_${dataType}_${new Date().toISOString().split('T')[0]}.${format}`
    };
  } catch (error) {
    console.error('❌ Export analytics data failed:', error);
    return { success: false, error: error.message };
  }
};

// Convert data to CSV format
const convertToCSV = (data: any[]) => {
  if (!data.length) return '';

  const headers = Object.keys(data[0]);
  const csvContent = [
    headers.join(','),
    ...data.map(row =>
      headers.map(header => {
        const value = row[header];
        return typeof value === 'string' ? `"${value.replace(/"/g, '""')}"` : value;
      }).join(',')
    )
  ].join('\n');

  return csvContent;
};