"use client";

import React, { useState, useEffect } from 'react';
import { GeminiService } from '@/services/geminiService';
import { ResumeStorage, StoredResume } from '@/services/resumeStorage';
import { useToast } from '@/context/ToastContext';
import { 
  FileUp, FileText, Loader2, CheckCircle2, ChevronRight, 
  AlertTriangle, Play, HelpCircle, X, Trash2, ArrowUpRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

export const AnalyzerPanel: React.FC = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [activeResume, setActiveResume] = useState<StoredResume | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  // Custom manual input/paste text option
  const [pastedText, setPastedText] = useState('');
  const [showPasteArea, setShowPasteArea] = useState(false);

  // Selected tab in report
  const [activeReportTab, setActiveReportTab] = useState<'summary' | 'skills' | 'strengths' | 'suggestions'>('summary');

  useEffect(() => {
    const list = ResumeStorage.getResumes();
    setResumes(list);
    if (list.length > 0) {
      setActiveResume(list[0]);
    }
  }, []);

  const triggerConfetti = () => {
    confetti({
      particleCount: 80,
      spread: 60,
      origin: { y: 0.6 }
    });
  };

  const handleUpload = async (fileName: string, fileSize: string, textContent: string) => {
    if (!textContent.trim()) {
      toast("Parsing Failed", "Resume content could not be read or is empty.", "error");
      return;
    }

    setLoading(true);
    setLoadingStep("Extracting credentials and mapping text...");
    await new Promise(r => setTimeout(r, 600));

    setLoadingStep("Invoking Google Gemini AI Analysis...");
    try {
      const report = await GeminiService.analyzeResume(textContent);
      
      setLoadingStep("Structuring ATS metadata and charts...");
      await new Promise(r => setTimeout(r, 400));
      
      const newResume = ResumeStorage.saveResume(fileName, fileSize, textContent, report);
      setResumes(ResumeStorage.getResumes());
      setActiveResume(newResume);
      
      toast("Analysis Complete!", `ATS compatibility calculated for ${fileName}`, "success");
      
      if (report.atsScore >= 80) {
        triggerConfetti();
      }
    } catch (err: any) {
      console.error(err);
      toast("AI Scan Error", "Could not complete resume analysis.", "error");
    } finally {
      setLoading(false);
      setLoadingStep('');
    }
  };

  // Handler for custom local text files
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      const sizeKB = `${Math.round(file.size / 1024)} KB`;
      await handleUpload(file.name, sizeKB, text || file.name);
    };
    reader.readAsText(file);
  };

  // Preload a mock resume instantly for testing
  const injectSampleResume = async () => {
    const sampleText = `Alex Mercer\nSenior Full-Stack Engineer\nalex@pixelmind.ai\nSUMMARY\n6+ years experienced software developer specializing in TypeScript, React, Next.js, and Node.js. Experience building cloud architectures on AWS.\nEXPERIENCE\nLead Frontend Engineer at Vercel Corp. Optimized Next.js loading speeds by 42%.\nSenior Engineer at DevSync Systems. Integrated AWS Lambda microservices.`;
    await handleUpload("sample_developer_resume.pdf", "18 KB", sampleText);
  };

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    ResumeStorage.deleteResume(id);
    const updated = ResumeStorage.getResumes();
    setResumes(updated);
    if (activeResume?.id === id) {
      setActiveResume(updated.length > 0 ? updated[0] : null);
    }
    toast("Resume Deleted", "File metadata removed from workspace database.", "info");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      
      {/* Left Column: Upload panel and History */}
      <div className="space-y-6 xl:col-span-1">
        
        {/* File Dropzone card */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow relative overflow-hidden">
          <h3 className="font-bold text-sm mb-1">Upload Resume</h3>
          <p className="text-[10px] text-muted-foreground mb-4">Select PDF or TXT resume to grade candidate ATS score.</p>
          
          <div className="border border-dashed border-border/80 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-background/25 hover:bg-muted/10 transition-colors relative group">
            <input 
              type="file" 
              accept=".txt,.pdf" 
              onChange={handleFileChange}
              className="absolute inset-0 opacity-0 cursor-pointer" 
              disabled={loading}
            />
            <FileUp className="h-8 w-8 text-muted-foreground group-hover:text-indigo-400 group-hover:scale-110 transition-all mb-3" />
            <span className="text-xs font-bold text-foreground">Click to upload file</span>
            <span className="text-[10px] text-muted-foreground mt-1">PDF or TXT up to 5MB</span>
          </div>

          <div className="flex flex-col gap-2 mt-4">
            <button
              onClick={injectSampleResume}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-2 border border-indigo-500/20 hover:bg-indigo-500/10 text-indigo-400 font-bold text-xs rounded-xl cursor-pointer transition-all disabled:opacity-50"
            >
              <CheckCircle2 className="h-4 w-4" />
              Preload Developer Sample
            </button>
            
            <button
              onClick={() => setShowPasteArea(!showPasteArea)}
              className="w-full py-1.5 hover:bg-muted font-semibold text-[10px] text-muted-foreground rounded-lg transition-colors cursor-pointer"
            >
              {showPasteArea ? "Hide Paste Area" : "Paste Raw Text Instead"}
            </button>
          </div>

          {showPasteArea && (
            <div className="mt-4 space-y-2 animate-[fadeIn_0.15s_ease-out]">
              <textarea
                placeholder="Paste plain resume text here..."
                rows={5}
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-border bg-background outline-none text-xs focus:ring-1 focus:ring-indigo-500"
              />
              <button
                onClick={() => {
                  handleUpload("pasted_resume.txt", "Custom Text", pastedText);
                  setPastedText('');
                  setShowPasteArea(false);
                }}
                className="w-full py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Scan Raw Text
              </button>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow">
          <h3 className="font-bold text-sm mb-3">Previous Scans</h3>
          {resumes.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground font-semibold">
              No previous scans in logs.
            </div>
          ) : (
            <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
              {resumes.map((res) => (
                <div
                  key={res.id}
                  onClick={() => setActiveResume(res)}
                  className={`flex items-center justify-between p-2.5 rounded-xl border cursor-pointer transition-all ${
                    activeResume?.id === res.id
                      ? 'border-indigo-500/40 bg-indigo-500/5'
                      : 'border-border/50 bg-background/30 hover:bg-muted/30'
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <FileText className={`h-4.5 w-4.5 shrink-0 ${activeResume?.id === res.id ? 'text-indigo-400' : 'text-muted-foreground'}`} />
                    <div className="min-w-0">
                      <h4 className="text-xs font-bold truncate max-w-[120px]">{res.fileName}</h4>
                      <p className="text-[9px] text-muted-foreground mt-0.5">{res.uploadedAt}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold">{res.analysis?.atsScore}%</span>
                    <button
                      onClick={(e) => handleDelete(res.id, e)}
                      className="p-1 hover:bg-red-500/10 hover:text-red-400 rounded-lg text-muted-foreground transition-colors cursor-pointer"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: AI Report display */}
      <div className="xl:col-span-2 space-y-6">
        
        {loading ? (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            <h4 className="font-bold text-sm text-foreground">Processing Resume</h4>
            <p className="text-xs text-muted-foreground animate-pulse max-w-sm">{loadingStep}</p>
          </div>
        ) : activeResume?.analysis ? (
          <div className="p-6 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-6 animate-[fadeIn_0.2s_ease-out]">
            
            {/* Header: Score and file details */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 pb-6 border-b border-border/40">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-2xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="font-extrabold text-base tracking-tight truncate max-w-[250px]">{activeResume.fileName}</h3>
                  <p className="text-xs text-muted-foreground">Scanned on {activeResume.uploadedAt} • {activeResume.fileSize}</p>
                </div>
              </div>

              {/* Gauge */}
              <div className="flex items-center gap-4 bg-background/40 border border-border/50 px-4 py-2.5 rounded-xl">
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
                      strokeDashoffset={138.2 - (138.2 * activeResume.analysis.atsScore) / 100}
                      className={(activeResume.analysis.atsScore || 0) >= 80 ? 'text-emerald-500' : 'text-amber-500'}
                    />
                  </svg>
                  <span className="absolute text-sm font-black">{activeResume.analysis.atsScore}</span>
                </div>
                <div>
                  <div className="text-xs font-bold">ATS Score</div>
                  <div className="text-[10px] text-muted-foreground uppercase font-bold mt-0.5">
                    {activeResume.analysis.atsScore >= 80 ? 'Optimized' : 'Needs Review'}
                  </div>
                </div>
              </div>
            </div>

            {/* Content Tabs */}
            <div className="flex border-b border-border">
              {[
                { id: 'summary', label: 'Summary' },
                { id: 'skills', label: 'Missing Skills' },
                { id: 'strengths', label: 'Pros & Cons' },
                { id: 'suggestions', label: 'Improvement Steps' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveReportTab(tab.id as any)}
                  className={`px-4 py-2 text-xs font-bold border-b-2 cursor-pointer transition-all ${
                    activeReportTab === tab.id
                      ? 'border-indigo-500 text-indigo-400'
                      : 'border-transparent text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab content */}
            <div className="min-h-[200px] text-sm leading-relaxed text-foreground/90">
              
              {activeReportTab === 'summary' && (
                <div className="space-y-4">
                  <div className="p-4 rounded-xl bg-background/45 border border-border text-xs leading-relaxed">
                    {activeResume.analysis.summary}
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-muted-foreground mb-2">Industry Readiness Index</h4>
                    <div className="w-full h-3 bg-muted rounded-full overflow-hidden border border-border/30 relative">
                      <div 
                        className="h-full bg-gradient-to-r from-indigo-500 to-indigo-600 transition-all duration-500"
                        style={{ width: `${activeResume.analysis.industryReadiness || 75}%` }}
                      />
                      <span className="absolute right-2 top-0.5 text-[8px] font-black text-white">{activeResume.analysis.industryReadiness || 75}%</span>
                    </div>
                  </div>
                </div>
              )}

              {activeReportTab === 'skills' && (
                <div className="space-y-4">
                  <p className="text-xs text-muted-foreground">The following keywords are missing from your resume and should be integrated to clear parsing limits:</p>
                  <div className="flex flex-wrap gap-2">
                    {activeResume.analysis.missingSkills?.map((skill, i) => (
                      <span key={i} className="flex items-center gap-1 text-xs px-3 py-1 rounded-full border border-red-500/10 bg-red-500/5 text-red-400 font-semibold">
                        <AlertTriangle className="h-3 w-3 shrink-0" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {activeReportTab === 'strengths' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-emerald-400">Identified Strengths</h4>
                    <ul className="space-y-2">
                      {activeResume.analysis.strengths?.map((str, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{str}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-red-400">Identified Weaknesses</h4>
                    <ul className="space-y-2">
                      {activeResume.analysis.weaknesses?.map((weak, i) => (
                        <li key={i} className="flex items-start gap-2 text-xs">
                          <AlertTriangle className="h-4 w-4 text-red-400 shrink-0 mt-0.5" />
                          <span>{weak}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {activeReportTab === 'suggestions' && (
                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-indigo-400 mb-3">Suggested Edits</h4>
                  <div className="space-y-3">
                    {activeResume.analysis.improvementSuggestions?.map((sug, i) => (
                      <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-background/30 border border-border/40 text-xs">
                        <div className="h-5 w-5 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center font-bold shrink-0">
                          {i + 1}
                        </div>
                        <p className="leading-relaxed">{sug}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          </div>
        ) : (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <HelpCircle className="h-10 w-10 text-muted-foreground" />
            <h4 className="font-bold text-sm">No Active Analysis</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Upload a resume PDF on the left or select a previous report in logs to see Gemini feedback cards.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default AnalyzerPanel;
