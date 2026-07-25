"use client";

import React, { useState, useEffect } from 'react';
import { ResumeStorage, StoredResume } from '@/services/resumeStorage';
import { GeminiService } from '@/services/geminiService';
import { useToast } from '@/context/ToastContext';
import { 
  Sparkles, FileText, Loader2, Copy, Download, 
  ArrowLeft, Check, RefreshCw
} from 'lucide-react';

export const CoverLetterPanel: React.FC = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  
  // Inputs
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [tone, setTone] = useState('Professional');

  // Outputs
  const [loading, setLoading] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const list = ResumeStorage.getResumes();
    setResumes(list);
    if (list.length > 0) {
      setSelectedResumeId(list[0].id);
    }
  }, []);

  const handleGenerate = async () => {
    const activeResume = resumes.find(r => r.id === selectedResumeId);
    if (!activeResume) {
      toast("Select Resume First", "Please upload or select a resume to reference.", "error");
      return;
    }
    if (!jobTitle.trim() || !company.trim()) {
      toast("Form Incomplete", "Please specify the Job Title and Company Name.", "error");
      return;
    }

    setLoading(true);
    setCopied(false);
    try {
      const result = await GeminiService.generateCoverLetter(
        activeResume.text,
        jobTitle,
        company,
        tone
      );
      setCoverLetter(result.content);
      toast("Cover Letter Generated!", `Draft created with a ${tone} tone.`, "success");
    } catch (err) {
      toast("Generation Failed", "Could not compile cover letter.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(coverLetter);
    setCopied(true);
    toast("Copied to Clipboard", "Text content ready to paste.", "success");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([coverLetter], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${company.toLowerCase().replace(/[^a-z0-9]/g, '_')}_cover_letter.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    toast("Downloaded File", "Cover letter file saved to downloads.", "success");
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      
      {/* Settings Form Column */}
      <div className="xl:col-span-1 space-y-6">
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
          <h3 className="font-bold text-sm">Document Options</h3>
          
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Reference Resume
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
                  <option key={r.id} value={r.id}>{r.fileName}</option>
                ))}
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Job Title
            </label>
            <input
              type="text"
              placeholder="e.g. Senior Frontend Developer"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background outline-none text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Company Name
            </label>
            <input
              type="text"
              placeholder="e.g. Stripe"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="w-full p-2.5 rounded-xl border border-border bg-background outline-none text-xs focus:ring-1 focus:ring-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-1.5">
              Letter Tone
            </label>
            <div className="flex gap-2">
              {['Professional', 'Bold', 'Creative'].map(t => (
                <button
                  key={t}
                  onClick={() => setTone(t)}
                  className={`flex-1 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    tone === t
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                      : 'border-border bg-background hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <button
            onClick={handleGenerate}
            disabled={loading || resumes.length === 0}
            className="w-full flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                Generate Cover Letter
                <Sparkles className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Editor/Response Column */}
      <div className="xl:col-span-2 space-y-6">
        {loading ? (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            <h4 className="font-bold text-sm">Drafting Custom Content</h4>
            <p className="text-xs text-muted-foreground">Integrating qualifications with company profile context...</p>
          </div>
        ) : coverLetter ? (
          <div className="p-6 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4 animate-[fadeIn_0.2s_ease-out]">
            <div className="flex items-center justify-between border-b border-border/40 pb-4">
              <div>
                <h3 className="font-bold text-sm">Draft Content</h3>
                <p className="text-[10px] text-muted-foreground">Edit matching paragraphs as needed.</p>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold cursor-pointer transition-all text-muted-foreground hover:text-foreground"
                >
                  {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border hover:bg-muted text-xs font-semibold cursor-pointer transition-all text-muted-foreground hover:text-foreground"
                >
                  <Download className="h-3.5 w-3.5" />
                  Download
                </button>
              </div>
            </div>

            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={14}
              className="w-full p-4 rounded-xl border border-border bg-background/50 outline-none text-xs focus:ring-1 focus:ring-indigo-500 leading-relaxed font-mono"
            />
          </div>
        ) : (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <FileText className="h-10 w-10 text-muted-foreground" />
            <h4 className="font-bold text-sm">Cover Letter Editor</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Fill in the job requirements and click generate to review an AI draft built around your experience credentials.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default CoverLetterPanel;
