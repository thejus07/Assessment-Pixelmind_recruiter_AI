"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile } from '../types';
import { mockProfile } from '../services/mockData';
import { useUser, useClerk } from '@clerk/nextjs';

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

const hasClerkKey = () => !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

/**
 * 1. REAL CLERK AUTH PROVIDER
 * Active when NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY is configured
 */
const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoaded, isSignedIn, user } = useUser();
  const { signOut } = useClerk();
  
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  useEffect(() => {
    if (isLoaded && isSignedIn && user) {
      // Map the real Google / Email Clerk account profile details
      setProfile({
        name: user.fullName || user.username || "Candidate Profile",
        email: user.primaryEmailAddress?.emailAddress || "",
        avatarUrl: user.imageUrl,
        title: (user.publicMetadata?.role as string) === 'recruiter' 
          ? "Verified Recruiter" 
          : "Senior Software Engineer",
        bio: "Authenticated securely via live Clerk SSO.",
        skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
        experience: [
          {
            company: "Clerk Session",
            role: "Verified Account User",
            duration: "Present",
            description: "Session data loaded directly from active Google Account authentication scopes."
          }
        ],
        education: [],
        certifications: [],
        projects: []
      });
    } else {
      setProfile(null);
    }
  }, [isLoaded, isSignedIn, user]);

  const loginWithEmail = async () => {
    // Handled natively by Clerk UI
  };

  const loginWithGoogle = async () => {
    // Handled natively by Clerk UI
  };

  const logout = async () => {
    await signOut();
  };

  const updateProfile = (updates: Partial<UserProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
    }
  };

  const toggleDemoMode = () => {
    setIsDemoMode(!isDemoMode);
  };

  return (
    <AuthContext.Provider value={{
      user: profile,
      isAuthenticated: isSignedIn || false,
      isLoading: !isLoaded,
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

/**
 * 2. MOCK AUTH PROVIDER
 * Fallback active in Demo Mode (without Clerk configured)
 */
const MockAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(true);

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
    }

    setIsLoading(false);
  }, []);

  const loginWithEmail = async (email: string) => {
    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 800));
    
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

/**
 * 3. HYBRID DISPATCHER PROVIDER
 */
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const hasClerk = hasClerkKey();

  if (hasClerk) {
    return <ClerkAuthProvider>{children}</ClerkAuthProvider>;
  }

  return <MockAuthProvider>{children}</MockAuthProvider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
export default AuthProvider;
