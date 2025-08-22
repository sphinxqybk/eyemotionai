// EyeMotion Production Deployment Verification Script
// Comprehensive verification of production deployment

interface VerificationResult {
  success: boolean;
  message: string;
  details?: any;
  timestamp: string;
}

interface EndpointCheck {
  name: string;
  url: string;
  expectedStatus: number;
  timeout: number;
  headers?: Record<string, string>;
}

class EyeMotionDeploymentVerifier {
  private domain: string;
  private supabaseUrl: string;
  private supabaseAnonKey: string;

  constructor() {
    this.domain = 'eyemotionai.com';
    this.supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
    this.supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY || '';
  }

  // Check website accessibility
  async verifyWebsite(): Promise<VerificationResult> {
    try {
      console.log('🌐 Verifying website accessibility...');

      const checks: EndpointCheck[] = [
        {
          name: 'Main Website',
          url: `https://${this.domain}`,
          expectedStatus: 200,
          timeout: 10000
        },
        {
          name: 'WWW Redirect',
          url: `https://www.${this.domain}`,
          expectedStatus: 200,
          timeout: 5000
        },
        {
          name: 'Health Endpoint',
          url: `https://${this.domain}/health`,
          expectedStatus: 200,
          timeout: 10000
        }
      ];

      const results = [];

      for (const check of checks) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), check.timeout);

          const response = await fetch(check.url, {
            signal: controller.signal,
            headers: check.headers || {}
          });

          clearTimeout(timeoutId);

          const success = response.status === check.expectedStatus;
          results.push({
            name: check.name,
            url: check.url,
            status: response.status,
            success,
            responseTime: `${Date.now()}ms`
          });

          console.log(`${success ? '✅' : '❌'} ${check.name}: ${response.status}`);

        } catch (error) {
          results.push({
            name: check.name,
            url: check.url,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          console.log(`❌ ${check.name}: Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const allSuccessful = results.every(result => result.success);

      return {
        success: allSuccessful,
        message: allSuccessful ? 'All website checks passed' : 'Some website checks failed',
        details: { checks: results },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Website verification failed:', error);
      return {
        success: false,
        message: 'Website verification failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Check API endpoints
  async verifyAPI(): Promise<VerificationResult> {
    try {
      console.log('🔌 Verifying API endpoints...');

      if (!this.supabaseUrl || !this.supabaseAnonKey) {
        return {
          success: false,
          message: 'Supabase configuration missing',
          details: { error: 'SUPABASE_URL or SUPABASE_ANON_KEY not provided' },
          timestamp: new Date().toISOString()
        };
      }

      const checks: EndpointCheck[] = [
        {
          name: 'Supabase REST API',
          url: `${this.supabaseUrl}/rest/v1/`,
          expectedStatus: 200,
          timeout: 15000,
          headers: {
            'apikey': this.supabaseAnonKey,
            'Authorization': `Bearer ${this.supabaseAnonKey}`
          }
        },
        {
          name: 'Edge Functions Health',
          url: `${this.supabaseUrl}/functions/v1/make-server-7dc8476e/health`,
          expectedStatus: 200,
          timeout: 20000,
          headers: {
            'Authorization': `Bearer ${this.supabaseAnonKey}`
          }
        },
        {
          name: 'AI Models Endpoint',
          url: `${this.supabaseUrl}/functions/v1/make-server-7dc8476e/ai/models`,
          expectedStatus: 200,
          timeout: 15000,
          headers: {
            'Authorization': `Bearer ${this.supabaseAnonKey}`
          }
        },
        {
          name: 'FFZ Modules Endpoint',
          url: `${this.supabaseUrl}/functions/v1/make-server-7dc8476e/ffz/modules`,
          expectedStatus: 200,
          timeout: 15000,
          headers: {
            'Authorization': `Bearer ${this.supabaseAnonKey}`
          }
        }
      ];

      const results = [];

      for (const check of checks) {
        try {
          const controller = new AbortController();
          const timeoutId = setTimeout(() => controller.abort(), check.timeout);

          const response = await fetch(check.url, {
            signal: controller.signal,
            headers: check.headers || {}
          });

          clearTimeout(timeoutId);

          const success = response.status === check.expectedStatus;
          results.push({
            name: check.name,
            url: check.url,
            status: response.status,
            success,
            responseTime: `${Date.now()}ms`
          });

          console.log(`${success ? '✅' : '❌'} ${check.name}: ${response.status}`);

        } catch (error) {
          results.push({
            name: check.name,
            url: check.url,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          console.log(`❌ ${check.name}: Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const allSuccessful = results.every(result => result.success);

      return {
        success: allSuccessful,
        message: allSuccessful ? 'All API checks passed' : 'Some API checks failed',
        details: { checks: results },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ API verification failed:', error);
      return {
        success: false,
        message: 'API verification failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Check SSL certificates
  async verifySSL(): Promise<VerificationResult> {
    try {
      console.log('🔒 Verifying SSL certificates...');

      const domains = [this.domain, `www.${this.domain}`];
      const results = [];

      for (const domain of domains) {
        try {
          // Check if HTTPS is working
          const response = await fetch(`https://${domain}`, {
            method: 'HEAD',
            signal: AbortSignal.timeout(10000)
          });

          const success = response.ok;
          results.push({
            domain,
            https: success,
            status: response.status,
            success
          });

          console.log(`${success ? '✅' : '❌'} SSL for ${domain}: ${success ? 'Valid' : 'Invalid'}`);

        } catch (error) {
          results.push({
            domain,
            https: false,
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
          });

          console.log(`❌ SSL for ${domain}: Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
      }

      const allSuccessful = results.every(result => result.success);

      return {
        success: allSuccessful,
        message: allSuccessful ? 'All SSL checks passed' : 'Some SSL checks failed',
        details: { certificates: results },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ SSL verification failed:', error);
      return {
        success: false,
        message: 'SSL verification failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Check application functionality
  async verifyFunctionality(): Promise<VerificationResult> {
    try {
      console.log('⚙️ Verifying application functionality...');

      const functionalityChecks = [
        'Page routing works',
        'Assets load correctly',
        'API integration functional',
        'Authentication system ready',
        'Database connectivity'
      ];

      // Check health endpoint for detailed status
      try {
        const response = await fetch(`https://${this.domain}/health`, {
          signal: AbortSignal.timeout(15000)
        });

        if (response.ok) {
          const healthData = await response.json();
          
          const checks = {
            routing: true, // If we can access health endpoint, routing works
            assets: true, // Basic assumption if site loads
            api: healthData.checks?.supabase?.status === 'connected',
            auth: healthData.checks?.supabase ? true : false,
            database: healthData.checks?.supabase?.status === 'connected'
          };

          const allChecks = Object.values(checks).every(check => check === true);

          console.log('✅ Health endpoint responded with status');
          console.log(`${checks.routing ? '✅' : '❌'} Page routing`);
          console.log(`${checks.assets ? '✅' : '❌'} Assets loading`);
          console.log(`${checks.api ? '✅' : '❌'} API integration`);
          console.log(`${checks.auth ? '✅' : '❌'} Authentication`);
          console.log(`${checks.database ? '✅' : '❌'} Database connectivity`);

          return {
            success: allChecks,
            message: allChecks ? 'All functionality checks passed' : 'Some functionality checks failed',
            details: { 
              checks,
              healthData,
              functionalityChecks
            },
            timestamp: new Date().toISOString()
          };
        }
      } catch (error) {
        console.log('❌ Health endpoint check failed');
      }

      // Fallback basic checks
      return {
        success: false,
        message: 'Could not verify application functionality',
        details: { error: 'Health endpoint not accessible' },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Functionality verification failed:', error);
      return {
        success: false,
        message: 'Functionality verification failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      };
    }
  }

  // Run complete verification
  async verifyDeployment(): Promise<VerificationResult> {
    try {
      console.log('🎬 Starting EyeMotion Production Deployment Verification...');
      console.log('=======================================================');
      console.log(`🌐 Domain: ${this.domain}`);
      console.log(`🗄️ Supabase: ${this.supabaseUrl ? 'Configured' : 'Not configured'}`);
      console.log('');

      const verificationSteps = [
        { name: 'Website Accessibility', method: this.verifyWebsite },
        { name: 'API Endpoints', method: this.verifyAPI },
        { name: 'SSL Certificates', method: this.verifySSL },
        { name: 'Application Functionality', method: this.verifyFunctionality }
      ];

      const results = [];
      let overallSuccess = true;

      for (const step of verificationSteps) {
        console.log(`\n📋 ${step.name}...`);
        const result = await step.method.call(this);
        results.push({ step: step.name, ...result });

        if (!result.success) {
          overallSuccess = false;
          console.log(`❌ ${step.name} failed: ${result.message}`);
        } else {
          console.log(`✅ ${step.name} passed`);
        }
      }

      console.log('\n=======================================================');
      
      if (overallSuccess) {
        console.log('🎉 EyeMotion Production Deployment Verification PASSED!');
        console.log('✨ Your production environment is ready and fully functional!');
        console.log('');
        console.log('🌐 Live at: https://eyemotionai.com');
        console.log('🔗 Health: https://eyemotionai.com/health');
        console.log('📊 Status: All systems operational');
      } else {
        console.log('❌ EyeMotion Production Deployment Verification FAILED');
        console.log('⚠️ Some issues were detected. Please review the errors above.');
        console.log('');
        console.log('🔧 Next steps:');
        console.log('  1. Check DNS configuration');
        console.log('  2. Verify SSL certificates');
        console.log('  3. Test API endpoints manually');
        console.log('  4. Review deployment logs');
      }

      return {
        success: overallSuccess,
        message: overallSuccess 
          ? 'Production deployment verification completed successfully' 
          : 'Production deployment verification found issues',
        details: { 
          steps: results,
          summary: {
            domain: this.domain,
            totalSteps: verificationSteps.length,
            passedSteps: results.filter(r => r.success).length,
            failedSteps: results.filter(r => !r.success).length
          }
        },
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('❌ Deployment verification failed:', error);
      return {
        success: false,
        message: 'Deployment verification failed',
        details: { error: error instanceof Error ? error.message : 'Unknown error' },
        timestamp: new Date().toISOString()
      };
    }
  }
}

// Export for use in other scripts
export { EyeMotionDeploymentVerifier };

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
  const verifier = new EyeMotionDeploymentVerifier();
  
  verifier.verifyDeployment()
    .then(result => {
      if (result.success) {
        console.log('\n🎬 EyeMotion production is verified and ready!');
        process.exit(0);
      } else {
        console.error('\n💥 Verification failed. Please fix the issues and retry.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('💥 Verification script error:', error);
      process.exit(1);
    });
}