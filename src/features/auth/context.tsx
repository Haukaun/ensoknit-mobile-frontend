import * as SecureStore from 'expo-secure-store';
import * as React from 'react';
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { authApi } from './api';
import type { UserResponse } from './types';

const USER_STORAGE_KEY = 'auth_user';

type AuthContextType = {
  user: UserResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (fullName: string, email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const cached = await SecureStore.getItemAsync(USER_STORAGE_KEY);
        if (cached) {
          setUser(JSON.parse(cached));
        }

        const serverUser = await authApi.getMe();
        setUser(serverUser);
        await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(serverUser));
      } catch {
        setUser(null);
        await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
      } finally {
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  const signIn = useCallback(async (email: string, password: string) => {
    const response = await authApi.signIn({ email, password });
    if (response.user) {
      setUser(response.user);
      await SecureStore.setItemAsync(USER_STORAGE_KEY, JSON.stringify(response.user));
    }
  }, []);

  const signUp = useCallback(async (fullName: string, email: string, password: string) => {
    try {
      await authApi.signUp({ fullName, email, password });
    } catch (error) {
      throw error;
    }
  }, []);

  const signOut = useCallback(async () => {
    await authApi.signOut();
    setUser(null);
    await SecureStore.deleteItemAsync(USER_STORAGE_KEY);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      signIn,
      signUp,
      signOut,
    }),
    [user, isLoading, signIn, signUp, signOut]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
