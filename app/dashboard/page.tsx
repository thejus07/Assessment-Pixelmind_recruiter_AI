"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/context/ToastContext';
import { 
  BarChart3, FileText, Briefcase, Calendar, Sparkles, 
  Bot, Users, Settings, User2, LogOut, Loader2, Menu, X, ShieldAlert, ShieldCheck
} from 'lucide-react';

import { OverviewPanel } from '@/components/dashboard/OverviewPanel';
import { AnalyzerPanel } from '@/components/dashboard/AnalyzerPanel';
import { MatcherPanel } from '@/components/dashboard/MatcherPanel';
import { CoverLetterPanel } from '@/components/dashboard/CoverLetterPanel';
import { InterviewPanel } from '@/components/dashboard/InterviewPanel';
import { CoachPanel } from '@/components/dashboard/CoachPanel';
import { RecruiterPanel } from '@/components/dashboard/RecruiterPanel';
import { SettingsPanel } from '@/components/dashboard/SettingsPanel';
import { ProfilePanel } from '@/components/dashboard/ProfilePanel';

type SidebarTab = 'dashboard' | 'analyzer' | 'matcher' | 'cover-letter' | 'interview' | 'coach' | 'recruiter' | 'settings' | 'profile';

export default function DashboardPage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, isDemoMode, toggleDemoMode, logout } = useAuth();
  const { toast } = useToast();

  const [activeTab, setActiveTab] = useState<SidebarTab>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState('');

  // Set date on client mount
  useEffect(() => {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    setCurrentDate(new Date().toLocaleDateString('en-US', options));
  }, []);

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground space-y-4">
        <Loader2 className="h-8 w-8 text-indigo-500 animate-spin" />
        <p className="text-xs text-muted-foreground animate-pulse">Synchronizing cloud credentials...</p>
      </div>
    );
  }

  const sidebarItems = [
    { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
    { id: 'analyzer', label: 'Resume Analyzer', icon: FileText },
    { id: 'matcher', label: 'Job Matcher', icon: Briefcase },
    { id: 'cover-letter', label: 'Cover Letter', icon: Sparkles },
    { id: 'interview', label: 'Interview Prep', icon: Calendar },
    { id: 'coach', label: 'Career Coach', icon: Bot },
    { id: 'recruiter', label: 'Recruiter', icon: Users },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User2 }
  ];

  const handleLogout = async () => {
    await logout();
    toast("Logged Out", "You have been signed out of the dashboard.", "info");
    router.replace('/');
  };

  const handleToggleDemoMode = () => {
    toggleDemoMode();
    toast(
      isDemoMode ? "Live API Mode Enabled" : "Demo Mode Enabled",
      isDemoMode ? "Real API queries will be sent to Gemini." : "Mock responses will generate locally.",
      "info"
    );
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      
      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-30 w-64 border-r border-border/80 bg-card/65 backdrop-blur-md transform transition-transform duration-200 ease-in-out lg:translate-x-0 lg:static lg:flex lg:flex-col ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        {/* Brand Header */}
        <div className="flex items-center justify-between p-4.5 border-b border-border/60">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => setActiveTab('dashboard')}>
            <div className="flex items-center justify-center p-1.5 bg-indigo-600 rounded-lg text-white">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              PixelMind <span className="text-foreground font-semibold">Recruit</span>
            </span>
          </div>
          <button className="lg:hidden p-1 rounded-lg hover:bg-muted text-muted-foreground" onClick={() => setSidebarOpen(false)}>
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        {/* Tab Items List */}
        <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
          {sidebarItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveTab(item.id as SidebarTab);
                setSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold cursor-pointer transition-all ${
                activeTab === item.id
                  ? 'bg-indigo-600/10 text-indigo-400 border border-indigo-500/10 shadow'
                  : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 border border-transparent'
              }`}
            >
              <item.icon className="h-4.5 w-4.5" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Bottom Profile Details */}
        <div className="p-4 border-t border-border/60 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <img src={user.avatarUrl} alt={user.name} className="w-8 h-8 rounded-full border border-border shrink-0 object-cover" />
            <div className="min-w-0">
              <h4 className="font-bold text-xs truncate leading-none">{user.name}</h4>
              <span className="text-[10px] text-muted-foreground truncate block mt-1">{user.email}</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-1.5 hover:bg-red-500/10 hover:text-red-400 text-muted-foreground rounded-lg transition-colors cursor-pointer"
            title="Sign Out"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </aside>

      {/* Main Workspace Frame */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden relative">
        
        {/* Top Control Bar */}
        <header className="h-16 border-b border-border/60 bg-card/45 backdrop-blur-md px-6 flex items-center justify-between z-10 shrink-0">
          <div className="flex items-center gap-3">
            <button className="lg:hidden p-1.5 rounded-lg hover:bg-muted text-muted-foreground cursor-pointer" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </button>
            <div className="hidden sm:block">
              <h1 className="font-extrabold text-sm tracking-tight">
                {activeTab === 'dashboard' ? 'Overview Stats' :
                 activeTab === 'analyzer' ? 'ATS Resume Analysis' :
                 activeTab === 'matcher' ? 'Job Description Matcher' :
                 activeTab === 'cover-letter' ? 'AI Cover Letter Builder' :
                 activeTab === 'interview' ? 'Mock Interview Board' :
                 activeTab === 'coach' ? 'AI Career Coach' :
                 activeTab === 'recruiter' ? 'Recruiter Rankings' :
                 activeTab === 'settings' ? 'System Settings' : 'Candidate Profile'}
              </h1>
              <p className="text-[10px] text-muted-foreground mt-0.5">{currentDate}</p>
            </div>
          </div>

          {/* Mode indicators & Actions */}
          <div className="flex items-center gap-3">
            {/* Toggle demo indicator badge */}
            <button
              onClick={handleToggleDemoMode}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black border transition-all cursor-pointer ${
                isDemoMode
                  ? 'bg-amber-500/5 border-amber-500/20 text-amber-400'
                  : 'bg-emerald-500/5 border-emerald-500/20 text-emerald-400'
              }`}
              title="Click to toggle Demo / Live API Modes"
            >
              {isDemoMode ? <ShieldAlert className="h-3 w-3" /> : <ShieldCheck className="h-3 w-3" />}
              {isDemoMode ? 'DEMO MODE' : 'LIVE API'}
            </button>
          </div>
        </header>

        {/* Scrollable Panel Workspace */}
        <main className="flex-1 overflow-y-auto p-6 bg-background grid-bg">
          <div className="max-w-7xl mx-auto h-full">
            {activeTab === 'dashboard' && <OverviewPanel onNavigate={(tab) => setActiveTab(tab as SidebarTab)} />}
            {activeTab === 'analyzer' && <AnalyzerPanel />}
            {activeTab === 'matcher' && <MatcherPanel />}
            {activeTab === 'cover-letter' && <CoverLetterPanel />}
            {activeTab === 'interview' && <InterviewPanel />}
            {activeTab === 'coach' && <CoachPanel />}
            {activeTab === 'recruiter' && <RecruiterPanel />}
            {activeTab === 'settings' && <SettingsPanel />}
            {activeTab === 'profile' && <ProfilePanel />}
          </div>
        </main>
      </div>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-20 bg-background/60 backdrop-blur-xs lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
