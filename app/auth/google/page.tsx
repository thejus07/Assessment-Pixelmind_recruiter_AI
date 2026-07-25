"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { Loader2 } from 'lucide-react';

export default function GoogleAuthPage() {
  const router = useRouter();
  const { loginWithGoogle } = useAuth();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(false);

  const handleSelectAccount = async () => {
    setLoading(true);
    // Simulate Google OAuth handshake latency
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    try {
      await loginWithGoogle();
      toast("Sign in successful", "Authenticated via Google OAuth", "success");
      router.push('/dashboard');
    } catch (err) {
      toast("OAuth Handshake Failed", "Could not synchronize user scope.", "error");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f0f4f9] text-[#1f1f1f] flex items-center justify-center font-sans p-4 select-none">
      
      {/* Google Login Card */}
      <div className="w-full max-w-[450px] bg-white rounded-3xl p-10 border border-[#e3e3e3] shadow-md flex flex-col justify-between min-h-[500px] animate-[scaleIn_0.2s_ease-out]">
        <style>{`
          @keyframes scaleIn {
            from { transform: scale(0.98); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
        `}</style>
        
        {/* Top Logo and Header */}
        <div>
          {/* Google Icon */}
          <div className="w-8 h-8 mb-6">
            <svg viewBox="0 0 24 24" width="100%" height="100%">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l3.66-2.85z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.85c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-normal leading-tight mb-2">Sign in with Google</h2>
          <p className="text-sm text-[#444746] mb-8">to continue to <span className="font-semibold text-indigo-600">PixelMind Recruit AI</span></p>
          
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <Loader2 className="h-8 w-8 text-[#0b57d0] animate-spin" />
              <span className="text-xs text-[#444746]">Connecting to PixelMind...</span>
            </div>
          ) : (
            <div className="space-y-1">
              <div className="text-[11px] font-semibold text-[#444746] uppercase tracking-wider mb-2">Choose an account</div>
              
              {/* Account selection row */}
              <button
                onClick={handleSelectAccount}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-[#e3e3e3] hover:bg-[#f8f9fa] transition-colors cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80"
                    alt="Alex Mercer"
                    className="w-8 h-8 rounded-full border border-gray-200"
                  />
                  <div>
                    <div className="text-sm font-semibold text-[#1f1f1f]">Alex Mercer</div>
                    <div className="text-xs text-[#444746]">alex.mercer@pixelmind.ai</div>
                  </div>
                </div>
              </button>

              <button
                onClick={handleSelectAccount}
                className="w-full flex items-center p-3 rounded-xl border border-transparent hover:bg-[#f8f9fa] transition-colors cursor-pointer text-left text-xs font-semibold text-[#0b57d0] mt-1.5"
              >
                Use another account
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center text-xs text-[#747775] mt-8 pt-4 border-t border-[#f0f0f0]">
          <span>English (United States)</span>
          <div className="flex gap-4">
            <span className="hover:underline cursor-pointer">Help</span>
            <span className="hover:underline cursor-pointer">Privacy</span>
            <span className="hover:underline cursor-pointer">Terms</span>
          </div>
        </div>
      </div>
    </div>
  );
}
