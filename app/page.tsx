"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { AuthModal } from '@/components/shared/AuthModal';
import { useToast } from '@/context/ToastContext';
import { 
  Sparkles, FileText, Briefcase, Calendar, ChevronDown, Check, ArrowRight,
  Shield, BrainCircuit, Users, BarChart3, Star, Mail, Globe, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LandingPage() {
  const router = useRouter();
  const { isAuthenticated, loginWithGoogle, isDemoMode, toggleDemoMode } = useAuth();
  const { toast } = useToast();
  
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  
  // Interactive Hero Widget State
  const [simulatedScore, setSimulatedScore] = useState(65);
  
  // Pricing billing period state
  const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'annually'>('monthly');

  // FAQ Active State
  const [activeFaq, setActiveFaq] = useState<number | null>(null);

  const openAuth = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLiveDemo = async () => {
    toast("Launching Live Demo", "Setting up preloaded developer profile...", "info");
    await loginWithGoogle();
    router.push('/dashboard');
  };

  const handleGetStarted = () => {
    if (isAuthenticated) {
      router.push('/dashboard');
    } else {
      openAuth('signup');
    }
  };

  // Helper to determine mock ATS feedback
  const getSimulatedFeedback = (score: number) => {
    if (score < 60) return { text: "Critical gaps found in resume structure.", color: "text-red-400 border-red-500/20 bg-red-500/5" };
    if (score < 80) return { text: "Good profile. Missing key industry keywords.", color: "text-amber-400 border-amber-500/20 bg-amber-500/5" };
    return { text: "Excellent resume. High probability of interview calls!", color: "text-emerald-400 border-emerald-500/20 bg-emerald-500/5" };
  };

  const simulatedFeedback = getSimulatedFeedback(simulatedScore);

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background text-foreground grid-bg select-none">
      
      {/* Background ambient light rings */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-600/5 blur-[120px] pointer-events-none animate-pulse-slow" />
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-500/10 dark:bg-purple-600/5 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 left-1/3 w-[700px] h-[700px] rounded-full bg-indigo-500/5 dark:bg-indigo-700/5 blur-[150px] pointer-events-none" />

      {/* Floating Header */}
      <header className="sticky top-4 z-40 max-w-7xl mx-auto px-4 w-full">
        <nav className="w-full px-6 py-3.5 rounded-2xl glass-panel flex items-center justify-between shadow-xl">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => router.push('/')}>
            <div className="flex items-center justify-center p-2 bg-indigo-600 rounded-xl text-white shadow-lg shadow-indigo-600/20">
              <Sparkles className="h-5 w-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              PixelMind <span className="text-foreground font-semibold">Recruit</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#workflow" className="hover:text-foreground transition-colors">AI Workflow</a>
            <a href="#pricing" className="hover:text-foreground transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </div>

          <div className="flex items-center gap-3">
            {isAuthenticated ? (
              <button
                onClick={() => router.push('/dashboard')}
                className="flex items-center gap-1.5 px-4.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm transition-all duration-200 cursor-pointer shadow-lg shadow-indigo-600/25"
              >
                Go to Dashboard
                <ArrowRight className="h-4 w-4" />
              </button>
            ) : (
              <>
                <button
                  onClick={() => openAuth('login')}
                  className="px-4 py-2 hover:bg-muted font-semibold text-sm rounded-xl transition-all cursor-pointer text-muted-foreground hover:text-foreground"
                >
                  Sign In
                </button>
                <button
                  onClick={handleGetStarted}
                  className="px-4.5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm rounded-xl transition-all cursor-pointer shadow-lg shadow-indigo-600/20"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 pt-16 md:pt-24 pb-16 flex flex-col lg:flex-row items-center gap-12 relative z-10">
        <div className="flex-1 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold mb-6">
            <Sparkles className="h-3.5 w-3.5 animate-spin" />
            Powered by Google Gemini 2.5 API
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Supercharge Your Job Search with <span className="gradient-text">Recruit AI</span>
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto lg:mx-0">
            A premium full-stack platform designed to analyze resume ATS compatibility, bridge skill gaps, draft tailor-made cover letters, and prepare you for live tech interviews.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
            <button
              onClick={handleGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-base shadow-lg shadow-indigo-600/25 transition-all cursor-pointer"
            >
              Get Started Free
              <ArrowRight className="h-5 w-5" />
            </button>
            <button
              onClick={handleLiveDemo}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3.5 border border-border bg-card/60 hover:bg-muted font-bold rounded-xl text-base transition-all cursor-pointer"
            >
              Try Live Demo
            </button>
          </div>
        </div>

        {/* Hero Interactive Widget (ATS Score Simulator) */}
        <div className="flex-1 w-full max-w-md lg:max-w-none">
          <div className="w-full p-6 rounded-2xl glass-panel border border-white/10 dark:border-white/5 bg-card/65 shadow-2xl relative">
            <div className="absolute top-3 right-3 text-xs text-indigo-400 font-semibold bg-indigo-500/10 px-2.5 py-1 rounded-full">
              Interactive Preview
            </div>

            <h3 className="font-bold text-lg mb-2">ATS Simulator</h3>
            <p className="text-xs text-muted-foreground mb-6">Drag the slider to preview how AI scores your resume structure.</p>
            
            {/* Gauge */}
            <div className="flex flex-col items-center justify-center mb-6">
              <div className="relative w-36 h-36 flex items-center justify-center">
                {/* SVG Ring */}
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-muted/20"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r="60"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={376.8}
                    strokeDashoffset={376.8 - (376.8 * simulatedScore) / 100}
                    className={`transition-all duration-300 ${
                      simulatedScore < 60 ? 'text-red-500' :
                      simulatedScore < 80 ? 'text-amber-500' : 'text-emerald-500'
                    }`}
                  />
                </svg>
                <div className="absolute flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold tracking-tight">{simulatedScore}</span>
                  <span className="text-[10px] text-muted-foreground uppercase font-bold tracking-wider">ATS Score</span>
                </div>
              </div>

              {/* Slider Control */}
              <div className="w-full px-4 mt-6">
                <input
                  type="range"
                  min="30"
                  max="98"
                  value={simulatedScore}
                  onChange={(e) => setSimulatedScore(Number(e.target.value))}
                  className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <div className="flex justify-between text-[10px] text-muted-foreground font-semibold mt-2">
                  <span>UNOPTIMIZED (30)</span>
                  <span>ATS-READY (98)</span>
                </div>
              </div>
            </div>

            {/* Dynamic AI comments card */}
            <div className={`p-4 rounded-xl border ${simulatedFeedback.color} transition-all duration-300 text-sm font-medium text-center`}>
              {simulatedFeedback.text}
            </div>

            <div className="grid grid-cols-2 gap-3 mt-4 text-xs font-semibold text-muted-foreground">
              <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-background/50 border border-border/50">
                <div className={`w-2 h-2 rounded-full ${simulatedScore >= 80 ? 'bg-emerald-500' : 'bg-red-500'}`} />
                {simulatedScore >= 80 ? 'Skills Matched' : 'Missing 5+ Skills'}
              </div>
              <div className="flex items-center gap-1.5 p-2.5 rounded-lg bg-background/50 border border-border/50">
                <div className={`w-2 h-2 rounded-full ${simulatedScore >= 70 ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                {simulatedScore >= 70 ? 'Good Formatting' : 'Bad Section Titles'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted Ticker */}
      <section className="py-12 border-y border-border/50 bg-muted/20 relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-xs uppercase tracking-widest font-extrabold text-muted-foreground mb-6">
            TRUSTED BY SOFTWARE ENGINEERS WORLDWIDE
          </p>
          <div className="relative flex items-center justify-center">
            {/* Logos Grid */}
            <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6 opacity-45 grayscale contrast-200">
              <span className="font-extrabold text-xl tracking-tight">VERCEL</span>
              <span className="font-bold text-xl tracking-tight">stripe</span>
              <span className="font-black text-xl tracking-tight">Linear</span>
              <span className="font-mono font-bold text-xl tracking-tight">supabase</span>
              <span className="font-extrabold text-xl tracking-tight">NOTION</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Bento Grid */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            AI Toolchain Tailored for Recruiters & Candidates
          </h2>
          <p className="text-muted-foreground text-sm">
            Everything you need to bypass applicant scanners, mock live interview loops, and rank applicants in bulk.
          </p>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Resume Analyzer */}
          <div className="md:col-span-2 p-6 rounded-2xl glass-panel bg-card/45 hover:bg-card/75 border border-border/50 transition-all group cursor-pointer">
            <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <FileText className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Resume Analyzer</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Upload your PDF/TXT resume to extract and scan core segments. Google Gemini scores formatting, points out grammatical issues, lists critical weaknesses, and identifies crucial missing credentials.
            </p>
            <div className="flex items-center gap-1 text-xs text-indigo-400 font-semibold group-hover:underline">
              Analyze your resume <ArrowRight className="h-3 w-3" />
            </div>
          </div>

          {/* Card 2: Job Matcher */}
          <div className="p-6 rounded-2xl glass-panel bg-card/45 hover:bg-card/75 border border-border/50 transition-all group cursor-pointer">
            <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Briefcase className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Job Matcher</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Paste the target description and verify how your background scores against it. Detect keyword gaps, required technical skills, and calculate interview call odds.
            </p>
          </div>

          {/* Card 3: AI Cover Letter */}
          <div className="p-6 rounded-2xl glass-panel bg-card/45 hover:bg-card/75 border border-border/50 transition-all group cursor-pointer">
            <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Sparkles className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Cover Letter Generator</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Generate tailor-made cover letters for companies with three distinct tone selectors: Bold, Creative, or Professional. Copy or download in one click.
            </p>
          </div>

          {/* Card 4: Recruiter Dashboard */}
          <div className="md:col-span-2 p-6 rounded-2xl glass-panel bg-card/45 hover:bg-card/75 border border-border/50 transition-all group cursor-pointer">
            <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit mb-4 group-hover:scale-110 transition-transform">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-bold text-lg mb-2">Recruiter Bulk Ranker</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Hiring managers can drop dozens of applicant resumes simultaneously. PixelMind parses them all in parallel, displays comparison grids, and ranks applications based on skills and background match levels.
            </p>
          </div>
        </div>
      </section>

      {/* AI Workflow Section */}
      <section id="workflow" className="max-w-7xl mx-auto px-6 py-20 relative z-10 scroll-mt-24 border-t border-border/50">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            How PixelMind Recruit Works
          </h2>
          <p className="text-muted-foreground text-sm">
            Our pipeline utilizes Google Gemini API and Supabase schema stores to optimize your job application cycle.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { step: "01", title: "Drop Resume", desc: "Drag and drop your PDF or TXT resume into the secure analyzer panel." },
            { step: "02", title: "Verify ATS Gaps", desc: "Get an interactive grading feedback breakdown showing critical missing keywords." },
            { step: "03", title: "Optimize & Prep", desc: "Generate custom cover letters and practice mock coding/behavioral questions." },
            { step: "04", title: "Secure Offer", desc: "Apply with Vercel/Stripe-ready credentials and land your target role." }
          ].map((item, idx) => (
            <div key={idx} className="relative p-5 rounded-xl bg-card/20 border border-border/40 text-center md:text-left">
              <div className="text-4xl font-black text-indigo-500/20 mb-3 md:absolute md:top-4 md:right-4">{item.step}</div>
              <h4 className="font-bold text-base mb-2 mt-2">{item.title}</h4>
              <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>



      {/* Pricing Section */}
      <section id="pricing" className="max-w-7xl mx-auto px-6 py-20 relative z-10 border-t border-border/50 scroll-mt-24">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Transparent Pricing Built to Scale
          </h2>
          <p className="text-muted-foreground text-sm mb-6">
            Get started for free or upgrade to premium packages for unbounded AI audits.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-2 p-1.5 rounded-xl bg-card border border-border">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                billingPeriod === 'monthly' ? 'bg-indigo-600 text-white shadow' : 'text-muted-foreground'
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setBillingPeriod('annually')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                billingPeriod === 'annually' ? 'bg-indigo-600 text-white shadow' : 'text-muted-foreground'
              }`}
            >
              Annually (Save 20%)
            </button>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {/* Card 1: Hobby */}
          <div className="p-6 rounded-2xl glass-panel bg-card/45 border border-border/50 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-lg mb-1">Free Tier</h4>
              <p className="text-xs text-muted-foreground mb-4">Perfect for quick scans</p>
              <div className="text-3xl font-black mb-6">$0</div>
              <ul className="space-y-3.5 text-xs text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> 3 AI Resume Scans / Mo</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> 1 Job Compatibility Check</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> 2 Career Coach Chat replies</li>
                <li className="flex items-center gap-2 text-muted-foreground/45"><X className="h-4 w-4 text-red-500/40" /> Recruiter Candidate Table</li>
              </ul>
            </div>
            <button onClick={handleGetStarted} className="w-full py-2.5 rounded-xl border border-border hover:bg-muted font-bold text-xs cursor-pointer transition-all">
              Get Started
            </button>
          </div>

          {/* Card 2: Pro (Best Value) */}
          <div className="p-6 rounded-2xl glass-panel bg-indigo-950/20 border-2 border-indigo-500 flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-3 right-3 text-[10px] font-bold text-indigo-400 bg-indigo-500/20 px-2 py-0.5 rounded-full">
              POPULAR
            </div>
            <div>
              <h4 className="font-bold text-lg mb-1 text-indigo-400">Pro Developer</h4>
              <p className="text-xs text-muted-foreground mb-4">Unlimited developer tools</p>
              <div className="text-3xl font-black mb-6">
                ${billingPeriod === 'monthly' ? '19' : '15'}{' '}
                <span className="text-xs font-normal text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Unlimited Resume Scans</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Unlimited Cover Letter generation</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Unlimited Interview Preparations</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Full Career Coach history access</li>
              </ul>
            </div>
            <button onClick={handleGetStarted} className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs cursor-pointer shadow-lg shadow-indigo-600/35 transition-all">
              Upgrade Now
            </button>
          </div>

          {/* Card 3: Enterprise */}
          <div className="p-6 rounded-2xl glass-panel bg-card/45 border border-border/50 flex flex-col justify-between">
            <div>
              <h4 className="font-bold text-lg mb-1">Recruiter Core</h4>
              <p className="text-xs text-muted-foreground mb-4">For sourcing and bulk ranking</p>
              <div className="text-3xl font-black mb-6">
                ${billingPeriod === 'monthly' ? '79' : '63'}{' '}
                <span className="text-xs font-normal text-muted-foreground">/ month</span>
              </div>
              <ul className="space-y-3.5 text-xs text-muted-foreground mb-8">
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Everything in Pro</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Parallel Bulk resume scanner</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Sorter/Ranking applicants table</li>
                <li className="flex items-center gap-2"><Check className="h-4 w-4 text-indigo-400" /> Team member seats (up to 5)</li>
              </ul>
            </div>
            <button onClick={handleGetStarted} className="w-full py-2.5 rounded-xl border border-border hover:bg-muted font-bold text-xs cursor-pointer transition-all">
              Contact Sales
            </button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="max-w-4xl mx-auto px-6 py-20 relative z-10 border-t border-border/50 scroll-mt-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-4">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="space-y-4">
          {[
            {
              q: "How does the AI Resume Analyzer scan my file?",
              a: "When you upload a PDF or TXT file, our backend extracts the textual representation of your credentials. Google Gemini models then inspect your content against layout guidelines, structural scoring conventions, and list suggestions based on modern recruitment standards."
            },
            {
              q: "Can I run the application offline or without API keys?",
              a: "Absolutely! The project has a pre-configured 'Demo Mode'. If no Gemini or Clerk keys are found, all components will simulate operations locally in your browser cache. This allows instant assessment without signing up for cloud credentials."
            },
            {
              q: "Are my uploaded resumes stored securely?",
              a: "Yes! If Supabase storage is configured, your documents are uploaded directly to protected Supabase Storage buckets. In Demo Mode, your resumes are kept locally in your browser's private localStorage, meaning no data ever leaves your device."
            },
            {
              q: "Does this support high-volume candidate scanning for recruiters?",
              a: "Yes, the Recruiter Dashboard supports dropping multiple resumes in bulk. The model parses the files in parallel and structures them into a sorting and filtering grid categorized by match level, experience, strengths, and missing skills."
            }
          ].map((faq, idx) => (
            <div key={idx} className="rounded-xl border border-border bg-card/25 overflow-hidden transition-all duration-200">
              <button
                onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                className="w-full px-5 py-4 flex items-center justify-between text-left font-bold text-sm cursor-pointer hover:bg-muted/30 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`h-4.5 w-4.5 text-muted-foreground transition-transform duration-200 ${activeFaq === idx ? 'transform rotate-180' : ''}`} />
              </button>
              
              <AnimatePresence initial={false}>
                {activeFaq === idx && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="px-5 pb-4 pt-1 text-xs text-muted-foreground border-t border-border/20 leading-relaxed">
                      {faq.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/25 py-12 relative z-10 text-xs text-muted-foreground">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center p-1.5 bg-indigo-600 rounded-lg text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <span className="font-extrabold text-sm tracking-tight text-foreground">
              PixelMind <span className="text-muted-foreground font-semibold">Recruit</span>
            </span>
          </div>

          <p className="text-center">
            &copy; 2026 PixelMind Recruit AI. Created as a Technical assessment for Software Developer role in Hyderabad, India.
          </p>

          <div className="flex gap-4">
            <a href="https://github.com" className="hover:text-foreground transition-colors" target="_blank" rel="noopener noreferrer">
              <Globe className="h-4 w-4" />
            </a>
            <a href="mailto:thejuskadavath@gmail.com" className="hover:text-foreground transition-colors">
              <Mail className="h-4 w-4" />
            </a>
          </div>
        </div>
      </footer>

      {/* Auth Modal Trigger */}
      <AuthModal isOpen={authModalOpen} onClose={() => setAuthModalOpen(false)} defaultMode={authMode} />
    </div>
  );
}
