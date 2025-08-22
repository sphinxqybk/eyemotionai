// EyeMotion Backend Server - Main Entry Point
import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { logger } from 'npm:hono/logger';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

// Import services
import {
  createDatabaseTables,
  createUserProfile,
  createProject,
  getUserAnalytics,
  checkDatabaseHealth
} from './database-setup.tsx';

import {
  registerUser,
  signInUser,
  signInWithProvider,
  handleOAuthCallback,
  signOutUser,
  getCurrentUser,
  updateUserProfile,
  resetPassword,
  updatePassword,
  deleteUserAccount,
  verifyAccessToken
} from './auth-service.tsx';

import {
  createCheckoutSession,
  handleStripeWebhook,
  cancelSubscription,
  purchaseCredits,
  getPaymentHistory,
  initializeSubscriptionPlans
} from './payment-service.tsx';

import {
  initializeStorageBuckets,
  generateUploadUrl,
  confirmFileUpload,
  getProjectFiles,
  deleteFile,
  getFileDownloadUrl,
  getStorageUsage
} from './file-service.tsx';

import {
  getDashboardOverview,
  getUserManagement,
  getFinancialAnalytics,
  getSystemHealth,
  manageUserSubscription,
  exportAnalyticsData,
  verifyAdminAccess
} from './admin-service.tsx';

// Initialize Hono app
const app = new Hono();

// Middleware
app.use('*', cors({
  origin: ['http://localhost:3000', 'https://eyemotion.ai', 'https://*.eyemotion.ai'],
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true
}));

app.use('*', logger(console.log));

// Health check endpoint
app.get('/make-server-7dc8476e/health', async (c) => {
  try {
    const dbHealth = await checkDatabaseHealth();
    
    return c.json({
      status: 'healthy',
      service: 'eyemotion-backend',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      environment: Deno.env.get('NODE_ENV') || 'development',
      database: dbHealth.success ? 'healthy' : 'error',
      uptime: Deno.uptime ? Math.floor(Deno.uptime()) : 0
    });
  } catch (error) {
    console.error('Health check failed:', error);
    return c.json({
      status: 'unhealthy',
      error: error.message,
      timestamp: new Date().toISOString()
    }, 500);
  }
});

// Authentication middleware
const requireAuth = async (c: any, next: () => Promise<void>) => {
  try {
    const authHeader = c.req.header('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return c.json({ error: 'Missing or invalid authorization header' }, 401);
    }

    const accessToken = authHeader.substring(7);
    const verification = await verifyAccessToken(accessToken);
    
    if (!verification.success) {
      return c.json({ error: 'Invalid access token' }, 401);
    }

    c.set('userId', verification.userId);
    c.set('userEmail', verification.email);
    await next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return c.json({ error: 'Authentication failed' }, 401);
  }
};

// Admin middleware
const requireAdmin = async (c: any, next: () => Promise<void>) => {
  const userId = c.get('userId');
  const adminCheck = await verifyAdminAccess(userId);
  
  if (!adminCheck.success) {
    return c.json({ error: 'Admin access required' }, 403);
  }

  await next();
};

// ===== AUTHENTICATION ROUTES =====

// User Registration
app.post('/make-server-7dc8476e/auth/register', async (c) => {
  try {
    const body = await c.req.json();
    console.log('🔐 Registration request:', body.email);

    const result = await registerUser({
      email: body.email,
      password: body.password,
      fullName: body.fullName,
      companyName: body.companyName,
      industry: body.industry,
      country: body.country,
      phone: body.phone
    });

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      message: 'User registered successfully',
      user: result.user
    });
  } catch (error) {
    console.error('Registration error:', error);
    return c.json({ error: 'Registration failed' }, 500);
  }
});

// User Sign In
app.post('/make-server-7dc8476e/auth/signin', async (c) => {
  try {
    const body = await c.req.json();
    console.log('🔐 Sign in request:', body.email);

    const result = await signInUser(body.email, body.password);

    if (!result.success) {
      return c.json({ error: result.error }, 401);
    }

    return c.json({
      success: true,
      message: 'Signed in successfully',
      user: result.user
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return c.json({ error: 'Sign in failed' }, 500);
  }
});

// Social Sign In
app.post('/make-server-7dc8476e/auth/oauth/:provider', async (c) => {
  try {
    const provider = c.req.param('provider');
    const { redirectTo } = await c.req.json();

    const result = await signInWithProvider(provider, redirectTo);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      url: result.url
    });
  } catch (error) {
    console.error('OAuth error:', error);
    return c.json({ error: 'OAuth sign in failed' }, 500);
  }
});

// OAuth Callback
app.post('/make-server-7dc8476e/auth/callback', async (c) => {
  try {
    const { code, state } = await c.req.json();

    const result = await handleOAuthCallback(code, state);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      user: result.user,
      session: result.session
    });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return c.json({ error: 'OAuth callback failed' }, 500);
  }
});

// Get Current User
app.get('/make-server-7dc8476e/auth/me', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.substring(7);

    const result = await getCurrentUser(accessToken!);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      user: result.user
    });
  } catch (error) {
    console.error('Get current user error:', error);
    return c.json({ error: 'Failed to get user' }, 500);
  }
});

// Update User Profile
app.put('/make-server-7dc8476e/auth/profile', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const updates = await c.req.json();

    const result = await updateUserProfile(userId, updates);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      message: 'Profile updated successfully',
      profile: result.data
    });
  } catch (error) {
    console.error('Update profile error:', error);
    return c.json({ error: 'Profile update failed' }, 500);
  }
});

// Sign Out
app.post('/make-server-7dc8476e/auth/signout', requireAuth, async (c) => {
  try {
    const authHeader = c.req.header('Authorization');
    const accessToken = authHeader?.substring(7);

    const result = await signOutUser(accessToken!);

    return c.json({
      success: true,
      message: 'Signed out successfully'
    });
  } catch (error) {
    console.error('Sign out error:', error);
    return c.json({ error: 'Sign out failed' }, 500);
  }
});

// ===== PAYMENT ROUTES =====

// Create Checkout Session
app.post('/make-server-7dc8476e/payments/checkout', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { planName, successUrl, cancelUrl } = await c.req.json();

    const result = await createCheckoutSession(userId, planName, successUrl, cancelUrl);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      sessionId: result.sessionId,
      checkoutUrl: result.checkoutUrl
    });
  } catch (error) {
    console.error('Create checkout error:', error);
    return c.json({ error: 'Checkout creation failed' }, 500);
  }
});

// Purchase Credits
app.post('/make-server-7dc8476e/payments/credits', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { creditAmount } = await c.req.json();

    const result = await purchaseCredits(userId, creditAmount);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      sessionId: result.sessionId,
      checkoutUrl: result.checkoutUrl
    });
  } catch (error) {
    console.error('Purchase credits error:', error);
    return c.json({ error: 'Credit purchase failed' }, 500);
  }
});

// Cancel Subscription
app.post('/make-server-7dc8476e/payments/cancel', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');

    const result = await cancelSubscription(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      message: 'Subscription cancelled successfully'
    });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    return c.json({ error: 'Subscription cancellation failed' }, 500);
  }
});

// Get Payment History
app.get('/make-server-7dc8476e/payments/history', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');

    const result = await getPaymentHistory(userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      payments: result.data
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    return c.json({ error: 'Failed to get payment history' }, 500);
  }
});

// Stripe Webhook
app.post('/make-server-7dc8476e/payments/webhook', async (c) => {
  try {
    const body = await c.req.text();
    const signature = c.req.header('stripe-signature');

    if (!signature) {
      return c.json({ error: 'Missing stripe signature' }, 400);
    }

    const result = await handleStripeWebhook(body, signature);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({ received: true });
  } catch (error) {
    console.error('Stripe webhook error:', error);
    return c.json({ error: 'Webhook processing failed' }, 500);
  }
});

// ===== PROJECT & FILE ROUTES =====

// Create Project
app.post('/make-server-7dc8476e/projects', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const projectData = await c.req.json();

    const result = await createProject(userId, projectData);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      message: 'Project created successfully',
      project: result.data
    });
  } catch (error) {
    console.error('Create project error:', error);
    return c.json({ error: 'Project creation failed' }, 500);
  }
});

// Generate Upload URL
app.post('/make-server-7dc8476e/files/upload-url', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const { projectId, fileName, fileSize, fileType } = await c.req.json();

    const result = await generateUploadUrl(userId, projectId, fileName, fileSize, fileType);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      uploadUrl: result.uploadUrl,
      fileId: result.fileId,
      creditsNeeded: result.creditsNeeded
    });
  } catch (error) {
    console.error('Generate upload URL error:', error);
    return c.json({ error: 'Upload URL generation failed' }, 500);
  }
});

// Confirm File Upload
app.post('/make-server-7dc8476e/files/:fileId/confirm', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const fileId = c.req.param('fileId');

    const result = await confirmFileUpload(fileId, userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      message: 'File upload confirmed',
      fileId: result.fileId,
      remainingCredits: result.remainingCredits
    });
  } catch (error) {
    console.error('Confirm upload error:', error);
    return c.json({ error: 'Upload confirmation failed' }, 500);
  }
});

// Get Project Files
app.get('/make-server-7dc8476e/projects/:projectId/files', requireAuth, async (c) => {
  try {
    const userId = c.get('userId');
    const projectId = c.req.param('projectId');

    const result = await getProjectFiles(projectId, userId);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      files: result.data
    });
  } catch (error) {
    console.error('Get project files error:', error);
    return c.json({ error: 'Failed to get project files' }, 500);
  }
});

// ===== ADMIN ROUTES =====

// Admin Dashboard Overview
app.get('/make-server-7dc8476e/admin/dashboard', requireAuth, requireAdmin, async (c) => {
  try {
    const result = await getDashboardOverview();

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      dashboard: result.data
    });
  } catch (error) {
    console.error('Admin dashboard error:', error);
    return c.json({ error: 'Dashboard data retrieval failed' }, 500);
  }
});

// User Management
app.get('/make-server-7dc8476e/admin/users', requireAuth, requireAdmin, async (c) => {
  try {
    const page = parseInt(c.req.query('page') || '1');
    const limit = parseInt(c.req.query('limit') || '50');
    const filter = c.req.query('filter') || '';

    const result = await getUserManagement(page, limit, filter);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      ...result.data
    });
  } catch (error) {
    console.error('User management error:', error);
    return c.json({ error: 'User management data retrieval failed' }, 500);
  }
});

// Financial Analytics
app.get('/make-server-7dc8476e/admin/analytics/financial', requireAuth, requireAdmin, async (c) => {
  try {
    const period = c.req.query('period') || '30d';

    const result = await getFinancialAnalytics(period);

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      analytics: result.data
    });
  } catch (error) {
    console.error('Financial analytics error:', error);
    return c.json({ error: 'Financial analytics retrieval failed' }, 500);
  }
});

// System Health
app.get('/make-server-7dc8476e/admin/system', requireAuth, requireAdmin, async (c) => {
  try {
    const result = await getSystemHealth();

    if (!result.success) {
      return c.json({ error: result.error }, 400);
    }

    return c.json({
      success: true,
      system: result.data
    });
  } catch (error) {
    console.error('System health error:', error);
    return c.json({ error: 'System health check failed' }, 500);
  }
});

// ===== INITIALIZATION ROUTES =====

// Initialize Database
app.post('/make-server-7dc8476e/init/database', async (c) => {
  try {
    console.log('🚀 Initializing database schema...');

    const result = await createDatabaseTables();

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: 'Database initialized successfully'
    });
  } catch (error) {
    console.error('Database initialization error:', error);
    return c.json({ error: 'Database initialization failed' }, 500);
  }
});

// Initialize Storage
app.post('/make-server-7dc8476e/init/storage', async (c) => {
  try {
    console.log('🚀 Initializing storage buckets...');

    const result = await initializeStorageBuckets();

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: 'Storage buckets initialized successfully'
    });
  } catch (error) {
    console.error('Storage initialization error:', error);
    return c.json({ error: 'Storage initialization failed' }, 500);
  }
});

// Initialize Subscription Plans
app.post('/make-server-7dc8476e/init/plans', async (c) => {
  try {
    console.log('🚀 Initializing subscription plans...');

    const result = await initializeSubscriptionPlans();

    if (!result.success) {
      return c.json({ error: result.error }, 500);
    }

    return c.json({
      success: true,
      message: 'Subscription plans initialized successfully'
    });
  } catch (error) {
    console.error('Plans initialization error:', error);
    return c.json({ error: 'Plans initialization failed' }, 500);
  }
});

// Complete System Initialization
app.post('/make-server-7dc8476e/init/complete', async (c) => {
  try {
    console.log('🚀 Complete system initialization...');

    // Initialize all components
    const dbResult = await createDatabaseTables();
    const storageResult = await initializeStorageBuckets();
    const plansResult = await initializeSubscriptionPlans();

    const results = [
      { component: 'database', ...dbResult },
      { component: 'storage', ...storageResult },
      { component: 'plans', ...plansResult }
    ];

    const allSuccessful = results.every(r => r.success);

    return c.json({
      success: allSuccessful,
      message: allSuccessful ? 
        'EyeMotion backend initialized successfully' : 
        'Some components failed to initialize',
      results: results,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Complete initialization error:', error);
    return c.json({ error: 'System initialization failed' }, 500);
  }
});

// 404 Handler
app.notFound((c) => {
  return c.json({
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist',
    availableEndpoints: [
      '/make-server-7dc8476e/health',
      '/make-server-7dc8476e/auth/*',
      '/make-server-7dc8476e/payments/*',
      '/make-server-7dc8476e/projects/*',
      '/make-server-7dc8476e/files/*',
      '/make-server-7dc8476e/admin/*'
    ]
  }, 404);
});

// Error Handler
app.onError((err, c) => {
  console.error('Server error:', err);
  return c.json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  }, 500);
});

// Start server
console.log('🎬 EyeMotion Backend Server Starting...');
console.log('🌐 Environment:', Deno.env.get('NODE_ENV') || 'development');
console.log('🔗 Health check: /make-server-7dc8476e/health');

// Serve the application
Deno.serve(app.fetch);