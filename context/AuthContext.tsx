"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { mockProfile } from '../services/mockData';

interface AuthContextType {
  user: UserProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isDemoMode: boolean;
  loginWithEmail: (email: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<UserProfile>) => void;
  toggleDemoMode: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

  // Load initial state on client mount
  useEffect(() => {
    const storedUser = localStorage.getItem('recruitai_user');
    const storedAuth = localStorage.getItem('recruitai_authenticated');
    const storedDemo = localStorage.getItem('recruitai_demo_mode');

    if (storedUser && storedAuth === 'true') {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
    
    if (storedDemo !== null) {
      setIsDemoMode(storedDemo === 'true');
    } else {
      // Default to demo mode if no key is present in env
      const hasApiKey = !!(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
      setIsDemoMode(!hasApiKey);
    }

    setIsLoading(false);
  }, []);

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800)); // Simulated network latency
    
    // Create new profile based on email or load mock
    const newUser: UserProfile = {
      ...mockProfile,
      email,
      name: email.split('@')[0].replace(/[^a-zA-Z]/g, ' ').replace(/\b\w/g, c => c.toUpperCase()) || "User"
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('recruitai_user', JSON.stringify(newUser));
    localStorage.setItem('recruitai_authenticated', 'true');
    setIsLoading(false);
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    const newUser: UserProfile = {
      ...mockProfile,
      name: "Alex Mercer",
      email: "alex.mercer@pixelmind.ai"
    };

    setUser(newUser);
    setIsAuthenticated(true);
    localStorage.setItem('recruitai_user', JSON.stringify(newUser));
    localStorage.setItem('recruitai_authenticated', 'true');
    setIsLoading(false);
  };

  const logout = async () => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('recruitai_user');
    localStorage.setItem('recruitai_authenticated', 'false');
    setIsLoading(false);
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (!user) return;
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('recruitai_user', JSON.stringify(updatedUser));
  };

  const toggleDemoMode = () => {
    const nextVal = !isDemoMode;
    setIsDemoMode(nextVal);
    localStorage.setItem('recruitai_demo_mode', String(nextVal));
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      isLoading,
      isDemoMode,
      loginWithEmail,
      loginWithGoogle,
      logout,
      updateProfile,
      toggleDemoMode
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
