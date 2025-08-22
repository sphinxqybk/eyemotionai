import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

// Safe environment variable access
const getEnvVar = (key: string): string | undefined => {
  if (typeof import.meta !== 'undefined' && import.meta && import.meta.env) {
    return import.meta.env[key];
  }
  if (typeof process !== 'undefined' && process.env) {
    return process.env[key];
  }
  return undefined;
};

// Demo mode detection with safer environment access
let isDemoMode = false;
try {
  const demoModeValue = getEnvVar('VITE_DEMO_MODE');
  isDemoMode = demoModeValue === 'true' || supabase === null;
} catch (error) {
  // Silent error handling for production
  isDemoMode = supabase === null;
}

// User subscription and profile types
export interface UserProfile {
  id: string;
  user_id: string;
  full_name: string | null;
  email: string;
  avatar_url: string | null;
  subscription_tier: 'freemium' | 'creator' | 'pro' | 'studio' | null;
  subscription_status: 'active' | 'canceled' | 'past_due' | null;
  cultural_background: string | null;
  ffz_level: 0 | 1 | 2 | 3;
  credits_remaining: number;
  storage_used_gb: number;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  userProfile: UserProfile | null;
  session: Session | null;
  loading: boolean;
  signUp: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<{ success: boolean; error?: string }>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Demo user data
const createDemoUser = (email: string, fullName: string): { user: User; profile: UserProfile } => {
  const userId = `demo-user-${Date.now()}`;
  const now = new Date().toISOString();
  
  return {
    user: {
      id: userId,
      email,
      created_at: now,
      updated_at: now,
      email_confirmed_at: now,
      app_metadata: {},
      user_metadata: { full_name: fullName },
      aud: 'authenticated',
      role: 'authenticated'
    } as User,
    profile: {
      id: `profile-${userId}`,
      user_id: userId,
      full_name: fullName,
      email,
      avatar_url: null,
      subscription_tier: 'freemium',
      subscription_status: 'active',
      cultural_background: null,
      ffz_level: 0,
      credits_remaining: 100,
      storage_used_gb: 0.1,
      created_at: now,
      updated_at: now
    }
  };
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile from database
  const fetchUserProfile = async (userId: string): Promise<UserProfile | null> => {
    try {
      if (isDemoMode) {
        // Return demo profile if in demo mode
        const storedProfile = localStorage.getItem('demo-user-profile');
        if (storedProfile) {
          return JSON.parse(storedProfile);
        }
        return null;
      }

      if (!supabase) {
        console.warn('Supabase not available for fetchUserProfile');
        return null;
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', userId)
        .single();

      if (error) {
        // Handle the case where the table doesn't exist yet
        if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
          console.warn('User profiles table does not exist yet. Using demo mode fallback.');
          // Create a basic demo profile for this user
          const demoProfile: UserProfile = {
            id: `profile-${userId}`,
            user_id: userId,
            full_name: 'Demo User',
            email: 'demo@example.com',
            avatar_url: null,
            subscription_tier: 'freemium',
            subscription_status: 'active',
            cultural_background: null,
            ffz_level: 0,
            credits_remaining: 100,
            storage_used_gb: 0.1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          return demoProfile;
        }
        console.error('Error fetching user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in fetchUserProfile:', error);
      return null;
    }
  };

  // Create initial user profile
  const createUserProfile = async (user: User, fullName: string): Promise<UserProfile | null> => {
    try {
      if (isDemoMode) {
        // Create demo profile
        const demoProfile: UserProfile = {
          id: `profile-${user.id}`,
          user_id: user.id,
          full_name: fullName,
          email: user.email!,
          avatar_url: null,
          subscription_tier: 'freemium',
          subscription_status: 'active',
          cultural_background: null,
          ffz_level: 0,
          credits_remaining: 100,
          storage_used_gb: 0.1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        
        // Store in localStorage for demo
        localStorage.setItem('demo-user-profile', JSON.stringify(demoProfile));
        return demoProfile;
      }

      if (!supabase) {
        console.warn('Supabase not available for createUserProfile');
        return null;
      }

      const newProfile = {
        user_id: user.id,
        full_name: fullName,
        email: user.email!,
        avatar_url: null,
        subscription_tier: 'freemium' as const,
        subscription_status: 'active' as const,
        cultural_background: null,
        ffz_level: 0 as const,
        credits_remaining: 100, // Freemium tier credits
        storage_used_gb: 0,
      };

      const { data, error } = await supabase
        .from('user_profiles')
        .insert([newProfile])
        .select()
        .single();

      if (error) {
        // Handle the case where the table doesn't exist yet
        if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
          console.warn('User profiles table does not exist yet. Using demo mode fallback for profile creation.');
          // Create a basic demo profile for this user
          const demoProfile: UserProfile = {
            id: `profile-${user.id}`,
            user_id: user.id,
            full_name: fullName,
            email: user.email!,
            avatar_url: null,
            subscription_tier: 'freemium',
            subscription_status: 'active',
            cultural_background: null,
            ffz_level: 0,
            credits_remaining: 100,
            storage_used_gb: 0.1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          return demoProfile;
        }
        console.error('Error creating user profile:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createUserProfile:', error);
      return null;
    }
  };

  // Sign up function
  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      setLoading(true);

      if (isDemoMode) {
        // Demo mode signup
        const { user: demoUser, profile } = createDemoUser(email, fullName);
        
        // Store demo user
        localStorage.setItem('demo-user', JSON.stringify(demoUser));
        localStorage.setItem('demo-user-profile', JSON.stringify(profile));
        
        setUser(demoUser);
        setUserProfile(profile);
        
        return { 
          success: true, 
          error: 'Demo mode: Account created successfully!' 
        };
      }
      
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' };
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          }
        }
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile
        const profile = await createUserProfile(data.user, fullName);
        if (profile) {
          setUserProfile(profile);
        }
        
        return { 
          success: true, 
          error: data.user.email_confirmed_at ? undefined : 'Please check your email to confirm your account' 
        };
      }

      return { success: false, error: 'Failed to create account' };
    } catch (error) {
      console.error('Error in signUp:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Sign in function
  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);

      if (isDemoMode) {
        // Demo mode signin
        const storedUser = localStorage.getItem('demo-user');
        const storedProfile = localStorage.getItem('demo-user-profile');
        
        if (storedUser && storedProfile) {
          const demoUser = JSON.parse(storedUser);
          const demoProfile = JSON.parse(storedProfile);
          
          if (demoUser.email === email) {
            setUser(demoUser);
            setUserProfile(demoProfile);
            return { success: true };
          }
        }
        
        // Create new demo user if not found
        const { user: demoUser, profile } = createDemoUser(email, 'Demo User');
        localStorage.setItem('demo-user', JSON.stringify(demoUser));
        localStorage.setItem('demo-user-profile', JSON.stringify(profile));
        
        setUser(demoUser);
        setUserProfile(profile);
        return { success: true };
      }
      
      if (!supabase) {
        return { success: false, error: 'Authentication service not available' };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Fetch user profile
        const profile = await fetchUserProfile(data.user.id);
        if (profile) {
          setUserProfile(profile);
        }
        
        return { success: true };
      }

      return { success: false, error: 'Failed to sign in' };
    } catch (error) {
      console.error('Error in signIn:', error);
      return { success: false, error: 'An unexpected error occurred' };
    } finally {
      setLoading(false);
    }
  };

  // Sign out function
  const signOut = async () => {
    try {
      setLoading(true);

      if (isDemoMode) {
        // Demo mode signout
        localStorage.removeItem('demo-user');
        localStorage.removeItem('demo-user-profile');
        setUser(null);
        setUserProfile(null);
        setSession(null);
        return;
      }

      if (!supabase) {
        console.warn('Supabase not available for sign out');
        return;
      }

      await supabase.auth.signOut();
      setUser(null);
      setUserProfile(null);
      setSession(null);
    } catch (error) {
      console.error('Error in signOut:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update user profile
  const updateProfile = async (updates: Partial<UserProfile>) => {
    try {
      if (isDemoMode) {
        // Demo mode update profile
        if (!user || !userProfile) {
          return { success: false, error: 'No user signed in' };
        }

        const updatedProfile = { ...userProfile, ...updates, updated_at: new Date().toISOString() };
        localStorage.setItem('demo-user-profile', JSON.stringify(updatedProfile));
        setUserProfile(updatedProfile);
        return { success: true };
      }

      if (!supabase) {
        return { success: false, error: 'Database service not available' };
      }

      if (!user || !userProfile) {
        return { success: false, error: 'No user signed in' };
      }

      const { data, error } = await supabase
        .from('user_profiles')
        .update(updates)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) {
        // Handle the case where the table doesn't exist yet
        if (error.code === 'PGRST205' || error.message.includes('schema cache')) {
          console.warn('User profiles table does not exist yet. Using demo mode fallback for profile update.');
          // Update profile in localStorage as fallback
          const updatedProfile = { ...userProfile, ...updates, updated_at: new Date().toISOString() };
          setUserProfile(updatedProfile);
          return { success: true };
        }
        console.error('Error updating profile:', error);
        return { success: false, error: error.message };
      }

      setUserProfile(data);
      return { success: true };
    } catch (error) {
      console.error('Error in updateProfile:', error);
      return { success: false, error: 'An unexpected error occurred' };
    }
  };

  // Refresh user profile
  const refreshProfile = async () => {
    if (isDemoMode && user) {
      const storedProfile = localStorage.getItem('demo-user-profile');
      if (storedProfile) {
        setUserProfile(JSON.parse(storedProfile));
      }
      return;
    }

    if (user && supabase) {
      const profile = await fetchUserProfile(user.id);
      if (profile) {
        setUserProfile(profile);
      }
    }
  };

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isDemoMode) {
          // Demo mode initialization
          const storedUser = localStorage.getItem('demo-user');
          const storedProfile = localStorage.getItem('demo-user-profile');
          
          if (storedUser && storedProfile) {
            setUser(JSON.parse(storedUser));
            setUserProfile(JSON.parse(storedProfile));
          }
          
          setLoading(false);
          return;
        }

        // Check if supabase client is available
        if (!supabase) {
          console.warn('Supabase client not available. Auth features disabled.');
          setLoading(false);
          return;
        }

        // Get initial session
        const { data: { session: initialSession } } = await supabase.auth.getSession();
        
        if (initialSession) {
          setSession(initialSession);
          setUser(initialSession.user);
          
          // Fetch user profile
          const profile = await fetchUserProfile(initialSession.user.id);
          if (profile) {
            setUserProfile(profile);
          }
        }
      } catch (error) {
        console.error('Error initializing auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Only set up auth state listener if supabase is available and not in demo mode
    if (isDemoMode || !supabase) {
      return;
    }

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // Development-only logging (removed for production)
        if (import.meta.env.DEV) {
          console.log('Auth state change:', event, session?.user?.email);
        }
        
        setSession(session);
        setUser(session?.user ?? null);
        
        if (session?.user) {
          // Fetch user profile on sign in
          const profile = await fetchUserProfile(session.user.id);
          if (profile) {
            setUserProfile(profile);
          }
        } else {
          // Clear profile on sign out
          setUserProfile(null);
        }
        
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const value = {
    user,
    userProfile,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    updateProfile,
    refreshProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}