import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { Badge } from './ui/badge';
import { CheckCircle2, AlertCircle, Wifi, WifiOff } from 'lucide-react';

interface ConnectionStatus {
  connected: boolean;
  projectId: string | null;
  error: string | null;
  isDemoMode: boolean;
}

export function SupabaseConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    connected: false,
    projectId: null,
    error: null,
    isDemoMode: false
  });

  useEffect(() => {
    const checkConnection = async () => {
      try {
        if (!supabase) {
          setStatus({
            connected: false,
            projectId: null,
            error: 'Supabase client not initialized',
            isDemoMode: true
          });
          return;
        }

        // Test basic connection
        const { data, error } = await supabase.auth.getSession();
        
        if (error && error.message.includes('Invalid API key')) {
          setStatus({
            connected: false,
            projectId: null,
            error: 'Invalid API credentials',
            isDemoMode: false
          });
          return;
        }

        // Safe environment variable access
        const getEnvVar = (key: string): string => {
          try {
            if (typeof import.meta !== 'undefined' && import.meta.env) {
              return import.meta.env[key] || '';
            }
            
            if (typeof process !== 'undefined' && process.env) {
              return process.env[key] || '';
            }
            
            return '';
          } catch (error) {
            return '';
          }
        };

        // Try to get project info from the URL
        const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 
                           getEnvVar('SUPABASE_URL') ||
                           'https://nimyngpkksdzobzjjiaa.supabase.co';
        
        const projectId = supabaseUrl.match(/https:\/\/([^.]+)\.supabase\.co/)?.[1] || null;

        setStatus({
          connected: true,
          projectId,
          error: null,
          isDemoMode: false
        });

      } catch (error) {
        setStatus({
          connected: false,
          projectId: null,
          error: error instanceof Error ? error.message : 'Unknown connection error',
          isDemoMode: false
        });
      }
    };

    checkConnection();
  }, []);

  if (status.isDemoMode) {
    return (
      <Badge variant="secondary" className="gap-2 bg-story/20 text-story border-story/40">
        <WifiOff className="h-3 w-3" />
        Demo Mode
      </Badge>
    );
  }

  if (status.connected) {
    return (
      <Badge variant="secondary" className="gap-2 bg-experience/20 text-experience border-experience/40">
        <CheckCircle2 className="h-3 w-3" />
        {status.projectId ? `Connected: ${status.projectId}` : 'Connected'}
      </Badge>
    );
  }

  return (
    <Badge variant="destructive" className="gap-2">
      <AlertCircle className="h-3 w-3" />
      {status.error || 'Connection Failed'}
    </Badge>
  );
}

// Development-only detailed connection info
export function SupabaseConnectionDetails() {
  const [details, setDetails] = useState<any>(null);

  useEffect(() => {
    // Safe environment detection
    const isDevelopment = () => {
      try {
        // Check multiple development indicators
        if (typeof import.meta !== 'undefined' && import.meta.env) {
          return import.meta.env.DEV === true || import.meta.env.MODE === 'development';
        }
        
        if (typeof process !== 'undefined' && process.env) {
          return process.env.NODE_ENV === 'development';
        }
        
        // Fallback: check for localhost or development domains
        if (typeof window !== 'undefined') {
          return window.location.hostname === 'localhost' || 
                 window.location.hostname.includes('dev') ||
                 window.location.port === '3000' ||
                 window.location.port === '5173';
        }
        
        return false;
      } catch (error) {
        // Silent fallback - don't show debug info if environment detection fails
        return false;
      }
    };

    if (isDevelopment()) {
      const getDetails = () => {
        const getEnvVar = (key: string): string => {
          try {
            if (typeof import.meta !== 'undefined' && import.meta.env) {
              return import.meta.env[key] || 'Not found';
            }
            
            if (typeof process !== 'undefined' && process.env) {
              return process.env[key] || 'Not found';
            }
            
            return 'Not found';
          } catch (error) {
            return 'Error accessing env';
          }
        };

        const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 
                           getEnvVar('SUPABASE_URL') ||
                           'Not found';
        
        const supabaseKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 
                           getEnvVar('SUPABASE_ANON_KEY') ||
                           'Not found';

        const isDemoMode = getEnvVar('VITE_DEMO_MODE') === 'true';
        
        let environment = 'unknown';
        try {
          if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.MODE) {
            environment = import.meta.env.MODE;
          } else if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV) {
            environment = process.env.NODE_ENV;
          }
        } catch (error) {
          environment = 'detection-error';
        }
        
        setDetails({
          url: supabaseUrl,
          keyLength: supabaseKey !== 'Not found' ? supabaseKey.length : 0,
          isDemoMode,
          supabaseClient: !!supabase,
          environment,
          location: typeof window !== 'undefined' ? window.location.hostname : 'unknown'
        });
      };

      getDetails();
    }
  }, []);

  // Only show in development and when details are available
  if (!details) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 p-4 bg-card border border-border rounded-lg shadow-lg max-w-sm text-xs space-y-2">
      <h4 className="font-semibold text-sm flex items-center gap-2">
        <Wifi className="h-4 w-4" />
        Supabase Debug Info
      </h4>
      <div className="space-y-1 text-muted-foreground">
        <div>URL: {details.url.substring(0, 30)}...</div>
        <div>Key Length: {details.keyLength}</div>
        <div>Demo Mode: {details.isDemoMode ? 'Yes' : 'No'}</div>
        <div>Client: {details.supabaseClient ? 'Initialized' : 'Null'}</div>
        <div>Environment: {details.environment}</div>
        <div>Location: {details.location}</div>
      </div>
    </div>
  );
}