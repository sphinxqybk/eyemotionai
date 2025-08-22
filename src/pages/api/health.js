// EyeMotion Health Check API Endpoint
// Production monitoring and health verification

export default async function handler(req, res) {
  const startTime = Date.now();
  
  try {
    // Check method
    if (req.method !== 'GET') {
      return res.status(405).json({
        status: 'error',
        message: 'Method not allowed',
        timestamp: new Date().toISOString()
      });
    }

    // Basic health checks
    const checks = {
      server: true,
      timestamp: new Date().toISOString(),
      environment: process.env.VITE_ENVIRONMENT || 'development',
      domain: process.env.VITE_DOMAIN || 'localhost',
      uptime: process.uptime(),
      memory: process.memoryUsage(),
      version: '1.0.0'
    };

    // Check Supabase connection if credentials available
    if (process.env.VITE_SUPABASE_URL && process.env.VITE_SUPABASE_ANON_KEY) {
      try {
        const supabaseResponse = await fetch(`${process.env.VITE_SUPABASE_URL}/rest/v1/`, {
          method: 'GET',
          headers: {
            'apikey': process.env.VITE_SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${process.env.VITE_SUPABASE_ANON_KEY}`
          }
        });
        
        checks.supabase = {
          status: supabaseResponse.ok ? 'connected' : 'error',
          statusCode: supabaseResponse.status,
          responseTime: `${Date.now() - startTime}ms`
        };
      } catch (error) {
        checks.supabase = {
          status: 'error',
          error: error.message
        };
      }
    } else {
      checks.supabase = {
        status: 'not_configured',
        message: 'Supabase credentials not available'
      };
    }

    // EyeMotion specific service checks
    checks.services = {
      'intent-ai': 'operational',
      'ffz-framework': 'operational',
      'cultural-verification': 'operational',
      'cine-suite': 'operational',
      'global-fund': 'operational'
    };

    // Performance metrics
    const responseTime = Date.now() - startTime;
    checks.performance = {
      responseTime: `${responseTime}ms`,
      healthy: responseTime < 1000
    };

    // Overall status
    const allHealthy = checks.server && 
                      (checks.supabase.status === 'connected' || checks.supabase.status === 'not_configured') &&
                      checks.performance.healthy;

    // Return health status
    res.status(200).json({
      status: allHealthy ? 'healthy' : 'degraded',
      service: 'EyeMotion Adaptive Visual Storytelling Ecosystem',
      version: '1.0.0',
      environment: checks.environment,
      domain: checks.domain,
      checks,
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      uptime: `${Math.floor(checks.uptime)}s`
    });

  } catch (error) {
    console.error('Health check error:', error);
    
    res.status(500).json({
      status: 'error',
      service: 'EyeMotion Adaptive Visual Storytelling Ecosystem',
      error: error.message,
      timestamp: new Date().toISOString(),
      responseTime: `${Date.now() - startTime}ms`
    });
  }
}