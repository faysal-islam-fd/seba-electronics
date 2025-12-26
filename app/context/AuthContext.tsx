'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User, getAuthToken, getUser, saveUser, removeAuthToken, getProfile } from '@/app/lib/authApi';

interface AuthContextType {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  login: (login: string, password: string) => Promise<{ success: boolean; message?: string; errors?: any }>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount and verify token
  useEffect(() => {
    const loadUser = async () => {
      const token = getAuthToken();
      const storedUser = getUser();
      
      if (token) {
        // If we have a stored user, set it immediately for faster UI
        if (storedUser) {
          setUserState(storedUser);
        }
        
        // Always verify token by fetching profile to ensure it's valid
        try {
          const profileResult = await getProfile();
          if (profileResult.success && profileResult.data) {
            setUserState(profileResult.data);
            // Save the fresh user data
            saveUser(profileResult.data);
          } else {
            // Token invalid, clear auth
            removeAuthToken();
            setUserState(null);
          }
        } catch (error) {
          // Token invalid or expired, or network error
          // Only clear if we don't have a stored user (might be network issue)
          if (!storedUser) {
            removeAuthToken();
            setUserState(null);
          }
          // If we have stored user, keep it but mark as potentially stale
        }
      } else {
        // No token, clear any stale user data
        if (storedUser) {
          removeAuthToken();
          setUserState(null);
        }
      }
      
      setIsLoading(false);
    };
    
    loadUser();
  }, []);

  const setUser = useCallback((newUser: User | null) => {
    setUserState(newUser);
  }, []);

  const refreshUser = useCallback(async () => {
    try {
      const profileResult = await getProfile();
      if (profileResult.success) {
        setUserState(profileResult.data);
      }
    } catch (error) {
      console.error('Failed to refresh user:', error);
    }
  }, []);

  const login = async (loginCredential: string, password: string): Promise<{ success: boolean; message?: string; errors?: any }> => {
    try {
      const { login: loginApi } = await import('@/app/lib/authApi');
      const result = await loginApi(loginCredential, password);
      
      if (result.success && result.data) {
        setUserState(result.data.user);
        return { success: true };
      } else {
        return { success: false, message: result.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.message || 'Login failed',
        errors: error.errors
      };
    }
  };

  const logout = async (): Promise<void> => {
    try {
      const { logout: logoutApi } = await import('@/app/lib/authApi');
      await logoutApi();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setUserState(null);
      removeAuthToken();
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isLoggedIn: !!user, 
      isLoading,
      login, 
      logout,
      refreshUser,
      setUser,
    }}>
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

