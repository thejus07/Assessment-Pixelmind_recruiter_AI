"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { SignIn, SignUp } from '@clerk/nextjs';
import { Mail, ShieldCheck, Globe, ArrowRight, Loader2, Sparkles, X } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: 'login' | 'signup';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, defaultMode = 'login' }) => {
  const router = useRouter();
  const { loginWithEmail, loginWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const [mode, setMode] = useState<'login' | 'signup'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);

  const hasClerk = process.env.NEXT_PUBLIC_ENABLE_CLERK === 'true' && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  React.useEffect(() => {
    if (isOpen && hasClerk) {
      router.push(mode === 'login' ? '/sign-in' : '/sign-up');
      onClose();
    }
  }, [isOpen, hasClerk, mode, router, onClose]);

  if (!isOpen) return null;

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast("Please enter your email", "An email address is required to sign in.", "error");
      return;
    }
    
    setLoading(true);
    try {
      await loginWithEmail(email);
      toast(
        mode === 'login' ? "Welcome back!" : "Account created!",
        `Signed in successfully as ${email}`,
        "success"
      );
      onClose();
      router.push('/dashboard');
    } catch (err: any) {
      toast("Authentication Failed", err.message || "Something went wrong", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = () => {
    setOauthLoading(true);
    window.location.href = '/auth/google';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm animate-[fadeIn_0.15s_ease-out]">
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes scaleIn {
          from { transform: scale(0.95); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
      `}</style>
      
      {/* Backdrop click close */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-md p-6 rounded-2xl glass-panel shadow-2xl z-10 border border-white/10 dark:border-white/5 bg-card/65 animate-[scaleIn_0.2s_ease-out] overflow-hidden">
        
        {/* Glow orb */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors p-1.5 rounded-lg hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6 mt-2">
          <div className="inline-flex items-center justify-center p-2 bg-indigo-500/10 text-indigo-400 rounded-xl mb-3">
            <Sparkles className="h-6 w-6" />
          </div>
          <h3 className="text-xl font-bold tracking-tight">
            {mode === 'login' ? 'Sign in to PixelMind' : 'Create your account'}
          </h3>
          <p className="text-sm text-muted-foreground mt-1.5">
            Optimize resumes and match jobs with Gemini AI
          </p>
        </div>

        {/* OAuth Buttons */}
        <div className="space-y-3 mb-5">
          <button
            onClick={handleGoogleAuth}
            disabled={loading || oauthLoading}
            className="w-full flex items-center justify-center gap-3 px-4 py-2.5 rounded-xl border border-border bg-card/80 hover:bg-muted font-medium text-sm transition-all duration-200 cursor-pointer disabled:opacity-50"
          >
            {oauthLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : (
              <Globe className="h-4 w-4 text-indigo-500" />
            )}
            Continue with Google
          </button>
        </div>

        <div className="relative my-5">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">Or continue with email</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleEmailAuth} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="email"
                required
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1">
              Password
            </label>
            <div className="relative">
              <ShieldCheck className="absolute left-3 top-3 h-4.5 w-4.5 text-muted-foreground" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-border bg-background focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || oauthLoading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4.5 w-4.5 animate-spin" />
            ) : (
              <>
                {mode === 'login' ? 'Sign In' : 'Sign Up'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Footer Toggle */}
        <div className="text-center mt-5 text-xs text-muted-foreground">
          {mode === 'login' ? (
            <span>
              Don't have an account?{' '}
              <button
                onClick={() => setMode('signup')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
              >
                Sign Up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{' '}
              <button
                onClick={() => setMode('login')}
                className="text-indigo-400 hover:text-indigo-300 font-semibold cursor-pointer underline underline-offset-2"
              >
                Sign In
              </button>
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthModal;
