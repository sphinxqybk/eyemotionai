import { createClient } from '@supabase/supabase-js';

// Safe environment variable access with fallbacks
const getEnvVar = (key: string): string | undefined => {
  // Handle different environments (Vite, Node.js, etc.)
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[key];
  }
  
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  
  // Fallback for other environments
  if (typeof window !== 'undefined' && (window as any).env) {
    return (window as any).env[key];
  }
  
  return undefined;
};

// Get Supabase configuration with proper environment variable names
const supabaseUrl = getEnvVar('VITE_SUPABASE_URL') || 
                    getEnvVar('SUPABASE_URL') || 
                    'https://nimyngpkksdzobzjjiaa.supabase.co'; // From info.tsx as fallback

const supabaseAnonKey = getEnvVar('VITE_SUPABASE_ANON_KEY') || 
                        getEnvVar('SUPABASE_ANON_KEY') || 
                        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5pbXluZ3Bra3Nkem9iempqaWFhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5OTM5NTksImV4cCI6MjA3MDU2OTk1OX0.k_LGj2tom155w3cJA6qUNQsTapyT8qKf84Oe15Yv9f4'; // From info.tsx as fallback

const isDemoMode = getEnvVar('VITE_DEMO_MODE') === 'true';
const hasValidConfig = !!(supabaseUrl && supabaseAnonKey && 
  !supabaseUrl.includes('demo') && 
  !supabaseAnonKey.includes('demo'));

if (hasValidConfig) {
  console.log('🚀 EyeMotion connected to Supabase successfully');
  console.log('📍 Supabase URL:', supabaseUrl.replace(/https?:\/\//, '').split('.')[0] + '.supabase.co');
} else if (isDemoMode) {
  console.log('🎬 EyeMotion running in demo mode');
} else {
  console.warn('⚠️ EyeMotion: Supabase configuration missing, falling back to demo mode');
}

export const supabase = hasValidConfig
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null;