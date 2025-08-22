import React from 'react';

interface DemoModeIndicatorProps {
  language: 'th' | 'en';
}

export function DemoModeIndicator({ language }: DemoModeIndicatorProps) {
  // Simplified demo mode detection based on current configuration
  const checkDemoMode = (): boolean => {
    try {
      // Check if we have real Supabase configuration
      let supabaseUrl: string | undefined;
      let demoMode: string | undefined;
      
      if (typeof import.meta !== 'undefined' && import.meta?.env) {
        supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
        demoMode = import.meta.env.VITE_DEMO_MODE;
      }
      
      // We're in demo mode if explicitly set or if using demo credentials
      return demoMode === 'true' || !supabaseUrl || supabaseUrl.includes('demo');
    } catch (error) {
      console.log('Demo mode detection error:', error);
      return false; // Don't show demo indicator if detection fails
    }
  };

  const isDemoMode = checkDemoMode();

  if (!isDemoMode) {
    return null;
  }

  return (
    <span className="block mt-2 text-experience font-medium">
      {language === 'th' 
        ? '🎬 โหมดทดสอบ: คุณสามารถสมัครและทดลองใช้งานได้เลย!'
        : '🎬 Demo Mode: You can sign up and explore all features!'}
    </span>
  );
}