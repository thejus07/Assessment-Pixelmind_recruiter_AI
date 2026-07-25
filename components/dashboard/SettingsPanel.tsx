"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  Key, Moon, Sun, Bell, CreditCard, ShieldCheck, 
  Settings, Loader2, Sparkles, RefreshCw
} from 'lucide-react';

export const SettingsPanel: React.FC = () => {
  const { isDemoMode, toggleDemoMode } = useAuth();
  const { toast } = useToast();

  const [apiKey, setApiKey] = useState('');
  const [themeMode, setThemeMode] = useState<'dark' | 'light'>('dark');
  
  // Simulated settings states
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [weeklyDigest, setWeeklyDigest] = useState(false);
  const [activePlan, setActivePlan] = useState<'Free' | 'Pro'>('Pro');

  useEffect(() => {
    // Check local storage for api key
    const key = localStorage.getItem('recruitai_gemini_api_key') || '';
    setApiKey(key);

    // Check body class for theme
    const isDark = document.documentElement.classList.contains('dark');
    setThemeMode(isDark ? 'dark' : 'light');
  }, []);

  const handleSaveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('recruitai_gemini_api_key', apiKey.trim());
      // Deactivate demo mode when a key is saved
      if (isDemoMode) {
        toggleDemoMode();
      }
      toast("API Key Configured", "Actual Google Gemini integrations activated successfully.", "success");
    } else {
      localStorage.removeItem('recruitai_gemini_api_key');
      if (!isDemoMode) {
        toggleDemoMode();
      }
      toast("API Key Cleared", "Demo fallback mode reactivated.", "info");
    }
  };

  const handleToggleTheme = () => {
    const root = document.documentElement;
    if (themeMode === 'dark') {
      root.classList.remove('dark');
      setThemeMode('light');
      toast("Light Theme Active", "Visual layout toggled to light theme variables.", "info");
    } else {
      root.classList.add('dark');
      setThemeMode('dark');
      toast("Dark Theme Active", "Visual layout toggled to dark theme variables.", "info");
    }
  };

  const handleTogglePlan = () => {
    const nextPlan = activePlan === 'Free' ? 'Pro' : 'Free';
    setActivePlan(nextPlan);
    toast("Subscription Updated", `Simulated account tier updated to ${nextPlan}.`, "success");
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start max-w-4xl mx-auto">
      
      {/* AI Key & Theme Config */}
      <div className="space-y-6">
        
        {/* API override */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Key className="h-4.5 w-4.5" />
            <h3 className="font-bold text-sm text-foreground">API Credentials</h3>
          </div>
          
          <p className="text-[10px] text-muted-foreground leading-relaxed">
            By default, PixelMind runs in **Demo Mode** using mock responses. Paste your Google Gemini API key below to test real, live resume analysis and interview prep questions.
          </p>

          <div className="space-y-2">
            <input
              type="password"
              placeholder="AIzaSy..."
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background outline-none text-xs focus:ring-1 focus:ring-indigo-500 font-mono"
            />
            <button
              onClick={handleSaveApiKey}
              className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer transition-colors shadow"
            >
              Save Credentials
            </button>
          </div>
        </div>

        {/* Theme Settings */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            {themeMode === 'dark' ? <Moon className="h-4.5 w-4.5" /> : <Sun className="h-4.5 w-4.5" />}
            <h3 className="font-bold text-sm text-foreground">Aesthetics Theme</h3>
          </div>
          
          <p className="text-[10px] text-muted-foreground">Select your interface design mode. Custom glassmorphic properties adapt dynamically.</p>

          <button
            onClick={handleToggleTheme}
            className="w-full flex items-center justify-between p-3 rounded-xl border border-border bg-background hover:bg-muted/40 transition-colors text-xs font-semibold cursor-pointer"
          >
            <span>Current: {themeMode === 'dark' ? 'Dark Mode' : 'Light Mode'}</span>
            <div className="flex items-center gap-1.5 text-indigo-400">
              Change Mode
              <RefreshCw className="h-3.5 w-3.5" />
            </div>
          </button>
        </div>
      </div>

      {/* Notifications & Plan */}
      <div className="space-y-6">
        
        {/* Subscription Status */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <CreditCard className="h-4.5 w-4.5" />
            <h3 className="font-bold text-sm text-foreground">Billing & Plan</h3>
          </div>
          
          <p className="text-[10px] text-muted-foreground">Current mock tier status. Toggle tiers to test dashboard limits.</p>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border bg-background/50">
            <div>
              <div className="text-xs font-bold text-foreground">{activePlan} Access</div>
              <p className="text-[9px] text-muted-foreground mt-0.5">
                {activePlan === 'Pro' ? 'Unlimited scans and prep active.' : 'Limited to 3 scans monthly.'}
              </p>
            </div>
            <button
              onClick={handleTogglePlan}
              className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-[10px] font-bold cursor-pointer transition-colors shadow"
            >
              Toggle Tier
            </button>
          </div>
        </div>

        {/* Notification checkboxes */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
          <div className="flex items-center gap-2 text-indigo-400">
            <Bell className="h-4.5 w-4.5" />
            <h3 className="font-bold text-sm text-foreground">Mock Alerts</h3>
          </div>
          
          <p className="text-[10px] text-muted-foreground">Setup alerts for candidate resume analyses or recruiter listings.</p>

          <div className="space-y-3.5 pt-2">
            {[
              { id: 'email', label: 'Email alerts on analysis complete', state: emailAlerts, setState: setEmailAlerts },
              { id: 'weekly', label: 'Weekly recruiter candidate summaries', state: weeklyDigest, setState: setWeeklyDigest }
            ].map((check) => (
              <label key={check.id} className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={check.state}
                  onChange={() => check.setState(!check.state)}
                  className="rounded border-border bg-background text-indigo-600 outline-none w-4 h-4"
                />
                <span className="text-xs font-medium text-foreground/95">{check.label}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
export default SettingsPanel;
