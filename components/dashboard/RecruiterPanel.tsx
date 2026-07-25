"use client";

import React, { useState } from 'react';
import { mockCandidates } from '@/services/mockData';
import { Candidate } from '@/types';
import { useToast } from '@/context/ToastContext';
import { 
  Users, FileUp, Loader2, ArrowUpDown, Check, 
  AlertTriangle, HelpCircle, Eye, X, CheckCircle2
} from 'lucide-react';

export const RecruiterPanel: React.FC = () => {
  const { toast } = useToast();
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState('');
  
  // Sort state
  const [sortBy, setSortBy] = useState<'score' | 'exp'>('score');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  // Selected candidate for detailed drawer modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);

  const handleBulkUpload = async () => {
    setLoading(true);
    setLoadingStep("Extracting text from 3 resumes in parallel...");
    await new Promise(r => setTimeout(r, 1000));

    setLoadingStep("Comparing candidate skill matrices with AI parameters...");
    await new Promise(r => setTimeout(r, 800));

    setLoadingStep("Generating summary highlights and rankings...");
    await new Promise(r => setTimeout(r, 500));

    setCandidates(mockCandidates);
    toast("Bulk Scanning Finished", "Simulated 3 profiles loaded and ranked successfully.", "success");
    setLoading(false);
  };

  const toggleSort = (field: 'score' | 'exp') => {
    if (sortBy === field) {
      setSortOrder(prev => prev === 'desc' ? 'asc' : 'desc');
    } else {
      setSortBy(field);
      setSortOrder('desc');
    }
  };

  const sortedCandidates = [...candidates].sort((a, b) => {
    const valA = sortBy === 'score' ? a.matchScore : a.experienceYears;
    const valB = sortBy === 'score' ? b.matchScore : b.experienceYears;
    return sortOrder === 'desc' ? valB - valA : valA - valB;
  });

  return (
    <div className="space-y-6">
      
      {/* Top action cards */}
      <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-bold text-sm">Recruiter Candidate Sorter</h3>
          <p className="text-[10px] text-muted-foreground mt-1">Upload multiple resume PDFs to grade and rank them based on technical alignment.</p>
        </div>

        <button
          onClick={handleBulkUpload}
          disabled={loading}
          className="flex items-center justify-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl cursor-pointer shadow disabled:opacity-50 transition-colors shrink-0"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              Drop Multiple Resumes (Mock 3)
              <FileUp className="h-4 w-4" />
            </>
          )}
        </button>
      </div>

      {loading ? (
        <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
          <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
          <h4 className="font-bold text-sm">Processing Bulk Upload</h4>
          <p className="text-xs text-muted-foreground animate-pulse max-w-sm">{loadingStep}</p>
        </div>
      ) : candidates.length > 0 ? (
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border/60 text-muted-foreground font-semibold">
                <th className="py-3 px-2">Applicant</th>
                <th className="py-3 px-2 cursor-pointer hover:text-indigo-400 select-none" onClick={() => toggleSort('score')}>
                  <div className="flex items-center gap-1.5">
                    Match Score
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-2 cursor-pointer hover:text-indigo-400 select-none" onClick={() => toggleSort('exp')}>
                  <div className="flex items-center gap-1.5">
                    Experience
                    <ArrowUpDown className="h-3 w-3" />
                  </div>
                </th>
                <th className="py-3 px-2">Top Strengths</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {sortedCandidates.map((c) => (
                <tr key={c.id} className="border-b border-border/30 hover:bg-muted/10 transition-colors">
                  {/* Name and avatar */}
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatarUrl} alt={c.name} className="w-8 h-8 rounded-full border border-border shrink-0" />
                      <div>
                        <h4 className="font-bold text-foreground">{c.name}</h4>
                        <p className="text-[10px] text-muted-foreground mt-0.5">{c.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Match gauge */}
                  <td className="py-3.5 px-2">
                    <div className="flex items-center gap-2">
                      <div className="w-12 bg-muted rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-full ${
                            c.matchScore >= 90 ? 'bg-emerald-500' :
                            c.matchScore >= 80 ? 'bg-indigo-500' : 'bg-amber-500'
                          }`}
                          style={{ width: `${c.matchScore}%` }}
                        />
                      </div>
                      <span className="font-extrabold">{c.matchScore}%</span>
                    </div>
                  </td>

                  {/* Experience */}
                  <td className="py-3.5 px-2">
                    <span className="px-2 py-0.5 rounded-lg border border-border/80 bg-background font-semibold">
                      {c.experienceYears} Years
                    </span>
                  </td>

                  {/* Top Strengths */}
                  <td className="py-3.5 px-2">
                    <div className="flex flex-wrap gap-1 max-w-[200px] md:max-w-none">
                      {c.strengths.slice(0, 2).map((str, idx) => (
                        <span key={idx} className="text-[9px] font-bold px-2 py-0.5 rounded bg-indigo-500/5 text-indigo-400 border border-indigo-500/10">
                          {str}
                        </span>
                      ))}
                    </div>
                  </td>

                  {/* Action */}
                  <td className="py-3.5 px-2 text-right">
                    <button
                      onClick={() => setSelectedCandidate(c)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-border hover:bg-muted font-bold text-[10px] cursor-pointer transition-colors"
                    >
                      <Eye className="h-3 w-3 text-indigo-400" />
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
          <Users className="h-10 w-10 text-muted-foreground animate-pulse" />
          <h4 className="font-bold text-sm">Recruiter Board Empty</h4>
          <p className="text-xs text-muted-foreground max-w-xs">
            No applicant list currently processed. Click the scan button above to simulate parsing three candidate resumes.
          </p>
        </div>
      )}

      {/* Candidate Profile Details Modal */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 flex items-center justify-end bg-background/50 backdrop-blur-xs animate-[fadeIn_0.1s_ease-out]">
          <div className="absolute inset-0" onClick={() => setSelectedCandidate(null)} />
          
          <div className="relative w-full max-w-md h-full p-6 bg-card border-l border-border shadow-2xl flex flex-col justify-between z-10 animate-[slideLeft_0.2s_ease-out]">
            <style>{`
              @keyframes slideLeft {
                from { transform: translateX(100%); }
                to { transform: translateX(0); }
              }
            `}</style>
            
            <div className="space-y-6 overflow-y-auto pr-1">
              {/* Header */}
              <div className="flex items-center justify-between border-b border-border/40 pb-4">
                <div className="flex items-center gap-2.5">
                  <img src={selectedCandidate.avatarUrl} alt={selectedCandidate.name} className="w-10 h-10 rounded-full border border-border" />
                  <div>
                    <h3 className="font-extrabold text-sm">{selectedCandidate.name}</h3>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{selectedCandidate.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedCandidate(null)}
                  className="p-1 hover:bg-muted text-muted-foreground hover:text-foreground rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4.5 w-4.5" />
                </button>
              </div>

              {/* Match Score Badge */}
              <div className="flex items-center gap-3 bg-indigo-500/5 border border-indigo-500/10 p-3.5 rounded-xl">
                <div className="text-2xl font-black text-indigo-400">{selectedCandidate.matchScore}%</div>
                <div className="text-[10px] leading-relaxed text-muted-foreground">
                  ATS mapping shows candidate profile is in the top bracket for this technical requisition.
                </div>
              </div>

              {/* Summary */}
              <div>
                <h4 className="text-xs font-bold text-foreground mb-2">Candidate Summary</h4>
                <p className="text-xs text-muted-foreground leading-relaxed p-3 rounded-lg border border-border bg-background/50">
                  {selectedCandidate.summary}
                </p>
              </div>

              {/* Strengths */}
              <div>
                <h4 className="text-xs font-bold text-foreground mb-2">Key Strengths</h4>
                <ul className="space-y-2">
                  {selectedCandidate.strengths.map((str, i) => (
                    <li key={i} className="flex items-start gap-2 text-xs">
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{str}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Missing Skills */}
              <div>
                <h4 className="text-xs font-bold text-foreground mb-2">Missing Skills</h4>
                <div className="flex flex-wrap gap-1.5">
                  {selectedCandidate.missingSkills.map((sk, i) => (
                    <span key={i} className="flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded border border-red-500/10 bg-red-500/5 text-red-400">
                      <AlertTriangle className="h-3 w-3" />
                      {sk}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedCandidate(null)}
              className="w-full py-2.5 bg-muted hover:bg-border text-foreground font-bold text-xs rounded-xl cursor-pointer transition-colors mt-4"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default RecruiterPanel;
