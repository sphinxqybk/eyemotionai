export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  tier: 'trial' | 'freelancer' | 'studio' | 'enterprise';
  trial_end?: string;
  subscription_status: 'active' | 'canceled' | 'past_due' | 'trial';
  created_at: string;
  updated_at: string;
}

export interface UserProfile {
  id: string;
  user_id: string;
  company_name?: string;
  industry?: string;
  team_size?: number;
  use_case?: string;
  phone?: string;
  country?: string;
  preferences: {
    language: 'th' | 'en';
    theme: 'dark' | 'light';
    notifications: boolean;
    newsletter: boolean;
  };
  created_at: string;
  updated_at: string;
}

export interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string }>;
  signInWithOAuth: (provider: 'google' | 'github') => Promise<void>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshUser: () => Promise<void>;
  isTrialActive: boolean;
  daysLeftInTrial: number;
  hasFeatureAccess: (feature: string) => boolean;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  data: any; // JSON data for project settings/content
  thumbnail_url?: string;
  status: 'draft' | 'processing' | 'completed' | 'failed';
  created_at: string;
  updated_at: string;
  last_accessed: string;
}

export interface UsageStats {
  user_id: string;
  date: string;
  features_used: {
    intent_ai: number;
    auto_cut: number;
    cinetone: number;
    exports: number;
    storage_gb: number;
  };
  total_render_time: number;
  projects_created: number;
}

// Feature access tiers
export const TIER_FEATURES = {
  trial: {
    max_projects: 3,
    max_exports: 5,
    storage_gb: 1,
    render_time_hours: 2,
    features: ['intent_ai', 'auto_cut', 'cinetone_basic'],
    collaboration: false,
    priority_support: false,
  },
  freelancer: {
    max_projects: 25,
    max_exports: 100,
    storage_gb: 50,
    render_time_hours: 50,
    features: ['intent_ai', 'auto_cut', 'cinetone_pro', 'advanced_export'],
    collaboration: false,
    priority_support: true,
  },
  studio: {
    max_projects: 100,
    max_exports: 500,
    storage_gb: 500,
    render_time_hours: 200,
    features: ['intent_ai', 'auto_cut', 'cinetone_pro', 'advanced_export', 'team_collaboration'],
    collaboration: true,
    priority_support: true,
  },
  enterprise: {
    max_projects: -1, // unlimited
    max_exports: -1,
    storage_gb: -1,
    render_time_hours: -1,
    features: ['all'],
    collaboration: true,
    priority_support: true,
    custom_integration: true,
  }
} as const;

export type FeatureName = 
  | 'intent_ai' 
  | 'auto_cut' 
  | 'cinetone_basic'
  | 'cinetone_pro' 
  | 'advanced_export'
  | 'team_collaboration'
  | 'custom_integration';