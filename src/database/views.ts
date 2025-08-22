// EyeMotion Database Views and Analytics
import { DATABASE_CONSTANTS } from './constants';

const { TABLES } = DATABASE_CONSTANTS;

export const DATABASE_VIEWS = {
  // User Analytics View
  USER_ANALYTICS_VIEW: `
    CREATE OR REPLACE VIEW user_analytics AS
    SELECT 
      up.id,
      up.full_name,
      up.company_name,
      up.country,
      up.industry,
      up.role,
      up.created_at as user_created_at,
      up.last_login_at,
      sp.display_name as current_plan,
      sp.price as plan_price,
      us.status as subscription_status,
      us.created_at as subscription_created_at,
      us.current_period_end,
      (us.credits_included + us.extra_credits - us.credits_used) as credits_remaining,
      us.storage_used_gb,
      sp.storage_gb as storage_limit_gb,
      COUNT(DISTINCT p.id) as project_count,
      COUNT(DISTINCT pf.id) as file_count,
      COALESCE(SUM(pf.file_size), 0) as total_storage_bytes,
      COUNT(DISTINCT pt.id) FILTER (WHERE pt.status = 'completed') as completed_payments,
      COALESCE(SUM(pt.amount) FILTER (WHERE pt.status = 'completed'), 0) as total_spent_satang
    FROM ${TABLES.USER_PROFILES} up
    LEFT JOIN ${TABLES.USER_SUBSCRIPTIONS} us ON up.id = us.user_id AND us.status = 'active'
    LEFT JOIN ${TABLES.SUBSCRIPTION_PLANS} sp ON us.plan_id = sp.id
    LEFT JOIN ${TABLES.PROJECTS} p ON up.id = p.user_id
    LEFT JOIN ${TABLES.PROJECT_FILES} pf ON p.id = pf.project_id
    LEFT JOIN ${TABLES.PAYMENT_TRANSACTIONS} pt ON up.id = pt.user_id
    GROUP BY up.id, up.full_name, up.company_name, up.country, up.industry, up.role,
             up.created_at, up.last_login_at, sp.display_name, sp.price, us.status, 
             us.created_at, us.current_period_end, us.credits_included, 
             us.extra_credits, us.credits_used, us.storage_used_gb, sp.storage_gb;
  `,

  // Revenue Analytics View
  REVENUE_ANALYTICS_VIEW: `
    CREATE OR REPLACE VIEW revenue_analytics AS
    SELECT 
      DATE_TRUNC('day', pt.created_at) as date,
      COUNT(*) as transaction_count,
      SUM(pt.amount) as total_amount_satang,
      SUM(pt.amount)::DECIMAL / 100 as total_amount_baht,
      pt.transaction_type,
      pt.status,
      COUNT(DISTINCT pt.user_id) as unique_customers,
      AVG(pt.amount) as avg_transaction_amount
    FROM ${TABLES.PAYMENT_TRANSACTIONS} pt
    WHERE pt.status = 'completed'
    GROUP BY DATE_TRUNC('day', pt.created_at), pt.transaction_type, pt.status
    ORDER BY date DESC;
  `,

  // Subscription Analytics View
  SUBSCRIPTION_ANALYTICS_VIEW: `
    CREATE OR REPLACE VIEW subscription_analytics AS
    SELECT 
      sp.name as plan_name,
      sp.display_name,
      sp.price,
      COUNT(us.id) as active_subscriptions,
      COUNT(us.id) FILTER (WHERE us.created_at >= NOW() - INTERVAL '30 days') as new_subscriptions_30d,
      COUNT(us.id) FILTER (WHERE us.cancelled_at >= NOW() - INTERVAL '30 days') as cancelled_subscriptions_30d,
      SUM(sp.price * COUNT(us.id)) / 100 as monthly_recurring_revenue_baht,
      AVG(us.credits_used::DECIMAL / GREATEST(us.credits_included, 1)) * 100 as avg_credit_utilization_percent,
      AVG(us.storage_used_gb) as avg_storage_usage_gb
    FROM ${TABLES.SUBSCRIPTION_PLANS} sp
    LEFT JOIN ${TABLES.USER_SUBSCRIPTIONS} us ON sp.id = us.plan_id AND us.status = 'active'
    WHERE sp.is_active = true
    GROUP BY sp.id, sp.name, sp.display_name, sp.price
    ORDER BY sp.price;
  `,

  // Project Analytics View
  PROJECT_ANALYTICS_VIEW: `
    CREATE OR REPLACE VIEW project_analytics AS
    SELECT 
      p.type as project_type,
      p.status as project_status,
      COUNT(*) as project_count,
      COUNT(DISTINCT p.user_id) as unique_creators,
      AVG(p.file_count) as avg_files_per_project,
      AVG(p.total_duration) as avg_duration_seconds,
      AVG(p.export_count) as avg_exports_per_project,
      SUM(pf_stats.total_size_bytes) as total_storage_bytes,
      COUNT(*) FILTER (WHERE p.created_at >= NOW() - INTERVAL '30 days') as new_projects_30d,
      COUNT(*) FILTER (WHERE p.last_opened_at >= NOW() - INTERVAL '7 days') as active_projects_7d
    FROM ${TABLES.PROJECTS} p
    LEFT JOIN (
      SELECT 
        project_id,
        SUM(file_size) as total_size_bytes,
        COUNT(*) as file_count
      FROM ${TABLES.PROJECT_FILES}
      GROUP BY project_id
    ) pf_stats ON p.id = pf_stats.project_id
    GROUP BY p.type, p.status
    ORDER BY project_count DESC;
  `,

  // Credits Usage Analytics View
  CREDITS_ANALYTICS_VIEW: `
    CREATE OR REPLACE VIEW credits_analytics AS
    SELECT 
      cu.action,
      cu.resource_type,
      COUNT(*) as usage_count,
      SUM(cu.credits_used) as total_credits_used,
      AVG(cu.credits_used) as avg_credits_per_use,
      COUNT(DISTINCT cu.user_id) as unique_users,
      COUNT(*) FILTER (WHERE cu.created_at >= NOW() - INTERVAL '30 days') as usage_count_30d,
      SUM(cu.credits_used) FILTER (WHERE cu.created_at >= NOW() - INTERVAL '30 days') as credits_used_30d
    FROM ${TABLES.CREDITS_USAGE} cu
    GROUP BY cu.action, cu.resource_type
    ORDER BY total_credits_used DESC;
  `,

  // File Processing Analytics View
  FILE_PROCESSING_ANALYTICS_VIEW: `
    CREATE OR REPLACE VIEW file_processing_analytics AS
    SELECT 
      pf.processing_status,
      pf.file_type,
      COUNT(*) as file_count,
      COUNT(DISTINCT pf.user_id) as unique_users,
      AVG(pf.file_size) as avg_file_size_bytes,
      SUM(pf.file_size) as total_storage_bytes,
      AVG(EXTRACT(EPOCH FROM (pf.processing_completed_at - pf.processing_started_at))) as avg_processing_time_seconds,
      COUNT(*) FILTER (WHERE pf.processing_status = 'error') as error_count,
      COUNT(*) FILTER (WHERE pf.created_at >= NOW() - INTERVAL '24 hours') as files_24h,
      AVG(pf.credits_cost) as avg_credits_cost
    FROM ${TABLES.PROJECT_FILES} pf
    GROUP BY pf.processing_status, pf.file_type
    ORDER BY file_count DESC;
  `,

  // User Engagement View
  USER_ENGAGEMENT_VIEW: `
    CREATE OR REPLACE VIEW user_engagement AS
    SELECT 
      up.id as user_id,
      up.full_name,
      up.country,
      sp.display_name as plan,
      up.created_at as signup_date,
      up.last_login_at,
      EXTRACT(DAYS FROM (NOW() - up.last_login_at)) as days_since_last_login,
      COUNT(DISTINCT p.id) as total_projects,
      COUNT(DISTINCT pf.id) as total_files,
      COUNT(DISTINCT al.id) as total_activities,
      MAX(p.last_opened_at) as last_project_activity,
      COUNT(DISTINCT p.id) FILTER (WHERE p.last_opened_at >= NOW() - INTERVAL '7 days') as active_projects_7d,
      COUNT(DISTINCT al.id) FILTER (WHERE al.created_at >= NOW() - INTERVAL '30 days') as activities_30d,
      CASE 
        WHEN up.last_login_at >= NOW() - INTERVAL '7 days' THEN 'Active'
        WHEN up.last_login_at >= NOW() - INTERVAL '30 days' THEN 'Recently Active'  
        WHEN up.last_login_at >= NOW() - INTERVAL '90 days' THEN 'Inactive'
        ELSE 'Dormant'
      END as engagement_status
    FROM ${TABLES.USER_PROFILES} up
    LEFT JOIN ${TABLES.USER_SUBSCRIPTIONS} us ON up.id = us.user_id AND us.status = 'active'
    LEFT JOIN ${TABLES.SUBSCRIPTION_PLANS} sp ON us.plan_id = sp.id
    LEFT JOIN ${TABLES.PROJECTS} p ON up.id = p.user_id
    LEFT JOIN ${TABLES.PROJECT_FILES} pf ON p.id = pf.project_id
    LEFT JOIN ${TABLES.ACTIVITY_LOGS} al ON up.id = al.user_id
    GROUP BY up.id, up.full_name, up.country, sp.display_name, 
             up.created_at, up.last_login_at
    ORDER BY last_project_activity DESC NULLS LAST;
  `,

  // System Health View
  SYSTEM_HEALTH_VIEW: `
    CREATE OR REPLACE VIEW system_health AS
    SELECT 
      'users' as metric_type,
      COUNT(*) as total_count,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as count_24h,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as count_7d,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as count_30d,
      NULL as avg_value,
      NULL as error_rate
    FROM ${TABLES.USER_PROFILES}
    
    UNION ALL
    
    SELECT 
      'projects' as metric_type,
      COUNT(*) as total_count,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as count_24h,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as count_7d,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as count_30d,
      AVG(file_count) as avg_value,
      NULL as error_rate
    FROM ${TABLES.PROJECTS}
    
    UNION ALL
    
    SELECT 
      'files' as metric_type,
      COUNT(*) as total_count,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as count_24h,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as count_7d,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as count_30d,
      AVG(file_size) / 1024 / 1024 as avg_value, -- MB
      COUNT(*) FILTER (WHERE processing_status = 'error')::DECIMAL / GREATEST(COUNT(*), 1) * 100 as error_rate
    FROM ${TABLES.PROJECT_FILES}
    
    UNION ALL
    
    SELECT 
      'payments' as metric_type,
      COUNT(*) as total_count,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '24 hours') as count_24h,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '7 days') as count_7d,
      COUNT(*) FILTER (WHERE created_at >= NOW() - INTERVAL '30 days') as count_30d,
      AVG(amount) / 100 as avg_value, -- Baht
      COUNT(*) FILTER (WHERE status = 'failed')::DECIMAL / GREATEST(COUNT(*), 1) * 100 as error_rate
    FROM ${TABLES.PAYMENT_TRANSACTIONS};
  `
};

// Additional helper views for reporting
export const REPORTING_VIEWS = {
  // Monthly Revenue Report
  MONTHLY_REVENUE_REPORT: `
    CREATE OR REPLACE VIEW monthly_revenue_report AS
    SELECT 
      DATE_TRUNC('month', pt.created_at) as month,
      COUNT(DISTINCT pt.user_id) as unique_customers,
      COUNT(*) as total_transactions,
      SUM(pt.amount) / 100 as total_revenue_baht,
      AVG(pt.amount) / 100 as avg_transaction_baht,
      SUM(CASE WHEN pt.transaction_type = 'subscription' THEN pt.amount ELSE 0 END) / 100 as subscription_revenue_baht,
      SUM(CASE WHEN pt.transaction_type = 'credit_purchase' THEN pt.amount ELSE 0 END) / 100 as credits_revenue_baht,
      COUNT(*) FILTER (WHERE pt.transaction_type = 'subscription') as subscription_transactions,
      COUNT(*) FILTER (WHERE pt.transaction_type = 'credit_purchase') as credit_transactions
    FROM ${TABLES.PAYMENT_TRANSACTIONS} pt
    WHERE pt.status = 'completed'
    GROUP BY DATE_TRUNC('month', pt.created_at)
    ORDER BY month DESC;
  `,

  // User Lifecycle Report
  USER_LIFECYCLE_REPORT: `
    CREATE OR REPLACE VIEW user_lifecycle_report AS
    SELECT 
      DATE_TRUNC('month', up.created_at) as signup_month,
      COUNT(*) as signups,
      COUNT(us.id) as activated_users,
      COUNT(us.id) FILTER (WHERE us.status = 'active') as currently_active,
      COUNT(us.id) FILTER (WHERE us.cancelled_at IS NOT NULL) as churned_users,
      COUNT(us.id)::DECIMAL / GREATEST(COUNT(*), 1) * 100 as activation_rate_percent,
      COUNT(us.id) FILTER (WHERE us.status = 'active')::DECIMAL / GREATEST(COUNT(us.id), 1) * 100 as retention_rate_percent,
      AVG(EXTRACT(DAYS FROM (COALESCE(us.cancelled_at, NOW()) - us.created_at))) as avg_lifetime_days
    FROM ${TABLES.USER_PROFILES} up
    LEFT JOIN ${TABLES.USER_SUBSCRIPTIONS} us ON up.id = us.user_id
    GROUP BY DATE_TRUNC('month', up.created_at)
    ORDER BY signup_month DESC;
  `,

  // Storage Usage Report
  STORAGE_USAGE_REPORT: `
    CREATE OR REPLACE VIEW storage_usage_report AS
    SELECT 
      sp.display_name as plan,
      sp.storage_gb as storage_limit_gb,
      COUNT(us.id) as active_subscriptions,
      AVG(us.storage_used_gb) as avg_storage_used_gb,
      MAX(us.storage_used_gb) as max_storage_used_gb,
      COUNT(us.id) FILTER (WHERE us.storage_used_gb > sp.storage_gb * 0.8) as near_limit_count,
      COUNT(us.id) FILTER (WHERE us.storage_used_gb >= sp.storage_gb) as over_limit_count,
      SUM(us.storage_used_gb) as total_storage_used_gb,
      AVG(us.storage_used_gb / GREATEST(sp.storage_gb, 1)) * 100 as avg_utilization_percent
    FROM ${TABLES.SUBSCRIPTION_PLANS} sp
    LEFT JOIN ${TABLES.USER_SUBSCRIPTIONS} us ON sp.id = us.plan_id AND us.status = 'active'
    WHERE sp.is_active = true
    GROUP BY sp.id, sp.display_name, sp.storage_gb
    ORDER BY sp.price;
  `
};

// Complete views setup
export const SETUP_VIEWS = `
  -- User Analytics View
  ${DATABASE_VIEWS.USER_ANALYTICS_VIEW}
  
  -- Revenue Analytics View
  ${DATABASE_VIEWS.REVENUE_ANALYTICS_VIEW}
  
  -- Subscription Analytics View
  ${DATABASE_VIEWS.SUBSCRIPTION_ANALYTICS_VIEW}
  
  -- Project Analytics View
  ${DATABASE_VIEWS.PROJECT_ANALYTICS_VIEW}
  
  -- Credits Analytics View
  ${DATABASE_VIEWS.CREDITS_ANALYTICS_VIEW}
  
  -- File Processing Analytics View
  ${DATABASE_VIEWS.FILE_PROCESSING_ANALYTICS_VIEW}
  
  -- User Engagement View
  ${DATABASE_VIEWS.USER_ENGAGEMENT_VIEW}
  
  -- System Health View
  ${DATABASE_VIEWS.SYSTEM_HEALTH_VIEW}
  
  -- Monthly Revenue Report
  ${REPORTING_VIEWS.MONTHLY_REVENUE_REPORT}
  
  -- User Lifecycle Report
  ${REPORTING_VIEWS.USER_LIFECYCLE_REPORT}
  
  -- Storage Usage Report
  ${REPORTING_VIEWS.STORAGE_USAGE_REPORT}
`;

export default DATABASE_VIEWS;