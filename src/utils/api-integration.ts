// EyeMotion API Integration for Scalable File Management
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// API Base URL
const API_BASE = `${supabaseUrl}/functions/v1/make-server-7dc8476e`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
    'apikey': supabaseAnonKey
  };
};

// Storage Analytics API
export const storageAPI = {
  // Get user storage analytics
  getUserAnalytics: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/storage/analytics/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Storage analytics failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get storage analytics:', error);
      throw error;
    }
  },

  // Optimize user storage
  optimizeStorage: async (userId: string, aggressive = false) => {
    try {
      const response = await fetch(`${API_BASE}/storage/optimize`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          userId,
          aggressive
        })
      });
      
      if (!response.ok) {
        throw new Error(`Storage optimization failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to optimize storage:', error);
      throw error;
    }
  },

  // Get storage recommendations
  getRecommendations: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/storage/recommendations/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Get recommendations failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get recommendations:', error);
      throw error;
    }
  }
};

// Cost Monitoring API
export const costAPI = {
  // Get user cost data
  getUserCosts: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/monitoring/costs/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Cost monitoring failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get cost data:', error);
      throw error;
    }
  },

  // Get cost history
  getCostHistory: async (userId: string, period = '30d') => {
    try {
      const response = await fetch(`${API_BASE}/monitoring/costs/${userId}/history?period=${period}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Cost history failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get cost history:', error);
      throw error;
    }
  },

  // Update cost alerts
  updateAlerts: async (userId: string, alerts: any) => {
    try {
      const response = await fetch(`${API_BASE}/monitoring/alerts/${userId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(alerts)
      });
      
      if (!response.ok) {
        throw new Error(`Update alerts failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update alerts:', error);
      throw error;
    }
  }
};

// File Lifecycle API
export const fileLifecycleAPI = {
  // Get file lifecycle data for project
  getProjectFiles: async (projectId: string) => {
    try {
      const response = await fetch(`${API_BASE}/files/lifecycle/project/${projectId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Project files failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get project files:', error);
      throw error;
    }
  },

  // Get file lifecycle data for user
  getUserFiles: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/files/lifecycle/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`User files failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get user files:', error);
      throw error;
    }
  },

  // Update file status
  updateFileStatus: async (fileId: string, status: string, metadata?: any) => {
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          status,
          metadata
        })
      });
      
      if (!response.ok) {
        throw new Error(`Update file status failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update file status:', error);
      throw error;
    }
  },

  // Mark file as favorite
  markAsFavorite: async (fileId: string, isFavorite: boolean) => {
    try {
      const response = await fetch(`${API_BASE}/files/${fileId}/favorite`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          is_favorite: isFavorite
        })
      });
      
      if (!response.ok) {
        throw new Error(`Mark favorite failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to mark as favorite:', error);
      throw error;
    }
  }
};

// Project Management API
export const projectAPI = {
  // Get user projects
  getUserProjects: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/projects/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Get projects failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get projects:', error);
      throw error;
    }
  },

  // Create new project
  createProject: async (projectData: any) => {
    try {
      const response = await fetch(`${API_BASE}/projects`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(projectData)
      });
      
      if (!response.ok) {
        throw new Error(`Create project failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to create project:', error);
      throw error;
    }
  },

  // Update project
  updateProject: async (projectId: string, updates: any) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`Update project failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update project:', error);
      throw error;
    }
  },

  // Delete project
  deleteProject: async (projectId: string) => {
    try {
      const response = await fetch(`${API_BASE}/projects/${projectId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Delete project failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to delete project:', error);
      throw error;
    }
  }
};

// User Profile API
export const userAPI = {
  // Get user profile with subscription
  getProfile: async () => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Get profile failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get profile:', error);
      throw error;
    }
  },

  // Update user profile
  updateProfile: async (updates: any) => {
    try {
      const response = await fetch(`${API_BASE}/auth/profile`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(updates)
      });
      
      if (!response.ok) {
        throw new Error(`Update profile failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to update profile:', error);
      throw error;
    }
  },

  // Get user analytics
  getAnalytics: async (userId: string) => {
    try {
      const response = await fetch(`${API_BASE}/admin/analytics/user/${userId}`, {
        method: 'GET',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) {
        throw new Error(`Get analytics failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Failed to get analytics:', error);
      throw error;
    }
  }
};

// Health Check API
export const healthAPI = {
  // Check system health
  checkHealth: async () => {
    try {
      const response = await fetch(`${API_BASE}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`Health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Health check failed:', error);
      throw error;
    }
  },

  // Check database health
  checkDatabase: async () => {
    try {
      const response = await fetch(`${API_BASE}/health/database`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseAnonKey
        }
      });
      
      if (!response.ok) {
        throw new Error(`Database health check failed: ${response.status}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Database health check failed:', error);
      throw error;
    }
  }
};

// Error handling utility
export const handleAPIError = (error: any) => {
  if (error.response) {
    // The request was made and the server responded with a status code
    // that falls out of the range of 2xx
    console.error('API Error Response:', error.response.data);
    return error.response.data.message || 'An error occurred';
  } else if (error.request) {
    // The request was made but no response was received
    console.error('API No Response:', error.request);
    return 'Network error - please check your connection';
  } else {
    // Something happened in setting up the request that triggered an Error
    console.error('API Error:', error.message);
    return error.message || 'An unexpected error occurred';
  }
};

// Export all APIs
export default {
  storage: storageAPI,
  cost: costAPI,
  fileLifecycle: fileLifecycleAPI,
  project: projectAPI,
  user: userAPI,
  health: healthAPI,
  handleError: handleAPIError
};