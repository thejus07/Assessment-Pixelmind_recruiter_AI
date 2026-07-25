"use client";

import React, { useState, useEffect } from 'react';
import { ResumeStorage, StoredResume } from '@/services/resumeStorage';
import { GeminiService } from '@/services/geminiService';
import { useToast } from '@/context/ToastContext';
import { 
  Briefcase, FileText, Loader2, CheckCircle2, 
  AlertTriangle, ArrowRight, ShieldCheck, HelpCircle
} from 'lucide-react';

export const MatcherPanel: React.FC = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Results
  const [loading, setLoading] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  useEffect(() => {
    const list = ResumeStorage.getResumes();
    setResumes(list);
    if (list.length > 0) {
      setSelectedResumeId(list[0].id);
    }
  }, []);

  const handleMatch = async () => {
    const activeResume = resumes.find(r => r.id === selectedResumeId);
    if (!activeResume) {
      toast("Select Resume First", "Please select or upload a resume to match.", "error");
      return;
    }
    if (!jobDescription.trim()) {
      toast("Missing Job Description", "Please paste a job description text to match against.", "error");
      return;
    }

    setLoading(true);
    try {
      const result = await GeminiService.matchJob(activeResume.text, jobDescription);
      setMatchResult(result);
      toast("Matching Complete!", `Job match score calculated: ${result.matchScore}%`, "success");
    } catch (err) {
      toast("Job Match Error", "Could not analyze compatibility.", "error");
    } finally {
      setLoading(false);
    }
  };

  const preloadSampleJob = () => {
    const sample = `Position: Senior Full-Stack Developer
Company: Stripe Inc.
Location: Remote / Hyderabad

We are looking for a Senior Developer to build and optimize checkout pages.
Requirements:
- Strong mastery of TypeScript and React hooks architecture.
- 5+ years building backend systems using Node.js or Python/FastAPI.
- Familiarity with PostgreSQL, Redis caching, and building APIs.
- Experience with Docker containers and AWS deployment config.
- Excellent unit testing habits and CI/CD automation pipelines.`;
    setJobDescription(sample);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      
      {/* Inputs Column */}
      <div className="xl:col-span-1 space-y-6">
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
          <h3 className="font-bold text-sm">Match Preferences</h3>
          
          {/* Resume Selector */}
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Select Resume
            </label>
            {resumes.length === 0 ? (
              <div className="text-xs text-red-400 border border-red-500/20 bg-red-500/5 p-3 rounded-xl font-semibold">
                No resumes found. Please upload a resume first.
              </div>
            ) : (
              <select
                value={selectedResumeId}
                onChange={(e) => setSelectedResumeId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background text-xs outline-none focus:ring-1 focus:ring-indigo-500"
              >
                {resumes.map(r => (
                  <option key={r.id} value={r.id}>{r.fileName} (ATS: {r.analysis?.atsScore}%)</option>
                ))}
              </select>
            )}
          </div>

          {/* Job Description paste area */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Paste Job Description
              </label>
              <button
                onClick={preloadSampleJob}
                className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
              >
                Preload Stripe Role
              </button>
            </div>
            <textarea
              placeholder="Paste responsibilities, tools, and technical requirements here..."
              rows={8}
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="w-full p-3 rounded-xl border border-border bg-background outline-none text-xs focus:ring-1 focus:ring-indigo-500 font-sans"
            />
          </div>

          <button
            onClick={handleMatch}
            disabled={loading || resumes.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Analyze Compatibility
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Results Column */}
      <div className="xl:col-span-2 space-y-6">
        {loading ? (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            <h4 className="font-bold text-sm">Evaluating Technical Gaps</h4>
            <p className="text-xs text-muted-foreground">Comparing resume semantics with job guidelines...</p>
          </div>
        ) : matchResult ? (
          <div className="p-6 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Header compatibility stats */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-500/10 text-purple-400 rounded-2xl">
                  <Briefcase className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight">Job Match Audit</h3>
                  <p className="text-xs text-muted-foreground">Resume vs Paste Description</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-background/40 border border-border/50 px-4 py-2 rounded-xl">
                {/* Match gauge */}
                <div className="relative w-14 h-14 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="28" cy="28" r="22" stroke="currentColor" strokeWidth="4" fill="transparent" className="text-muted/15" />
                    <circle 
                      cx="28" 
                      cy="28" 
                      r="22" 
                      stroke="currentColor" 
                      strokeWidth="4" 
                      fill="transparent" 
                      strokeDasharray={138.2}
                      strokeDashoffset={138.2 - (138.2 * matchResult.matchScore) / 100}
                      className={matchResult.matchScore >= 85 ? 'text-emerald-500' : 'text-amber-500'}
                    />
                  </svg>
                  <span className="absolute text-sm font-black">{matchResult.matchScore}%</span>
                </div>
                <div>
                  <div className="text-xs font-bold">Match Level</div>
                  <span className={`inline-block mt-0.5 text-[8px] font-black uppercase px-2 py-0.5 rounded-md ${
                    matchResult.interviewLikelihood === 'High' ? 'text-emerald-400 bg-emerald-500/10 border border-emerald-500/10' :
                    matchResult.interviewLikelihood === 'Medium' ? 'text-amber-400 bg-amber-500/10 border border-amber-500/10' :
                    'text-red-400 bg-red-500/10 border border-red-500/10'
                  }`}>
                    {matchResult.interviewLikelihood} Callback Odds
                  </span>
                </div>
              </div>
            </div>

            {/* Missing Keywords & Gap */}
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
                  <AlertTriangle className="h-4 w-4 text-amber-500" />
                  Missing Job Keywords
                </h4>
                {matchResult.missingKeywords?.length === 0 ? (
                  <div className="text-xs text-emerald-400 border border-emerald-500/15 bg-emerald-500/5 p-3 rounded-xl font-semibold flex items-center gap-1.5">
                    <ShieldCheck className="h-4 w-4" /> All job requirements matched! Excellent resume alignment.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {matchResult.missingKeywords?.map((keyword: string, i: number) => (
                      <span key={i} className="text-xs px-2.5 py-1 rounded-lg border border-red-500/15 bg-red-500/5 text-red-400 font-mono font-bold">
                        {keyword}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action items */}
              <div className="pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-3">
                  Tailoring Recommendations
                </h4>
                <div className="space-y-2.5">
                  {matchResult.suggestions?.map((sug: string, i: number) => (
                    <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background/40 border border-border/40 text-xs">
                      <div className="p-1.5 bg-indigo-500/10 text-indigo-400 rounded-lg shrink-0">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                      </div>
                      <p className="leading-relaxed">{sug}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <HelpCircle className="h-10 w-10 text-muted-foreground" />
            <h4 className="font-bold text-sm">Waiting for Comparison</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Select an analyzed profile and paste your target job requirements on the left, then click analyze to check alignment.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default MatcherPanel;
