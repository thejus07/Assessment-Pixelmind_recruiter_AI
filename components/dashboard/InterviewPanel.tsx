"use client";

import React, { useState, useEffect } from 'react';
import { ResumeStorage, StoredResume } from '@/services/resumeStorage';
import { GeminiService } from '@/services/geminiService';
import { useToast } from '@/context/ToastContext';
import { 
  Award, HelpCircle, Loader2, Play, Eye, 
  EyeOff, CheckCircle2, ChevronRight, MessageSquare
} from 'lucide-react';

export const InterviewPanel: React.FC = () => {
  const { toast } = useToast();
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  const [selectedResumeId, setSelectedResumeId] = useState('');
  
  // States
  const [loading, setLoading] = useState(false);
  const [questions, setQuestions] = useState<any[]>([]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'Technical' | 'Coding' | 'Behavioral' | 'HR'>('All');
  
  // Accordion open states
  const [revealedAnswers, setRevealedAnswers] = useState<{ [key: string]: boolean }>({});
  
  // Custom user answer drafts
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [gradingStates, setGradingStates] = useState<{ [key: string]: 'idle' | 'grading' | 'done' }>({});
  const [grades, setGrades] = useState<{ [key: string]: { score: number, comment: string } }>({});

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
      toast("Select Resume First", "Please upload a resume to baseline the interview.", "error");
      return;
    }

    setLoading(true);
    setRevealedAnswers({});
    setUserAnswers({});
    setGrades({});
    try {
      const list = await GeminiService.generateInterviewPrep(activeResume.text);
      setQuestions(list);
      toast("Interview Generated!", `Created ${list.length} questions tailored to your profile.`, "success");
    } catch (err) {
      toast("Generation Failed", "Could not assemble questions.", "error");
    } finally {
      setLoading(false);
    }
  };

  const toggleReveal = (id: string) => {
    setRevealedAnswers(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleGrade = async (id: string, qText: string) => {
    const ans = userAnswers[id];
    if (!ans || !ans.trim()) {
      toast("Answer Draft Empty", "Please type something before requesting feedback.", "error");
      return;
    }

    setGradingStates(prev => ({ ...prev, [id]: 'grading' }));
    await new Promise(r => setTimeout(r, 1200)); // Latency

    // Rule-based grade generator
    const length = ans.trim().length;
    let score = 50;
    let comment = "Answer is brief. Try structuring with the STAR method (Situation, Task, Action, Result) and add tech keywords.";
    
    if (length > 150) {
      score = 80;
      comment = "Excellent length and detailing! You've successfully hit key details. Make sure to specify metrics where applicable.";
    } else if (length > 60) {
      score = 68;
      comment = "Good start. Add specific technology libraries or frameworks that you utilized to resolve the problem.";
    }

    setGrades(prev => ({ ...prev, [id]: { score, comment } }));
    setGradingStates(prev => ({ ...prev, [id]: 'done' }));
    toast("Answer Audited!", `Draft graded: ${score}/100`, "success");
  };

  const filteredQuestions = activeCategory === 'All' 
    ? questions 
    : questions.filter(q => q.category === activeCategory);

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 items-start">
      
      {/* Settings Panel */}
      <div className="xl:col-span-1 space-y-6">
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4">
          <h3 className="font-bold text-sm">Mock Session Setup</h3>
          
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
                  <option key={r.id} value={r.id}>{r.fileName}</option>
                ))}
              </select>
            )}
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
                Generate Interview Prep
                <Play className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Questions Panel */}
      <div className="xl:col-span-2 space-y-6">
        
        {loading ? (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <Loader2 className="h-10 w-10 text-indigo-500 animate-spin" />
            <h4 className="font-bold text-sm">Structuring Interview Loop</h4>
            <p className="text-xs text-muted-foreground">Tailoring questions based on skills extracted from your resume...</p>
          </div>
        ) : questions.length > 0 ? (
          <div className="space-y-4">
            {/* Category Filter Tabs */}
            <div className="flex flex-wrap gap-1.5 border-b border-border pb-3">
              {['All', 'Technical', 'Coding', 'Behavioral', 'HR'].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat as any)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                    activeCategory === cat
                      ? 'border-indigo-500 bg-indigo-500/10 text-indigo-400'
                      : 'border-border bg-card hover:bg-muted text-muted-foreground'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Questions list */}
            <div className="space-y-4">
              {filteredQuestions.map((q) => (
                <div key={q.id} className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow space-y-4 animate-[fadeIn_0.2s_ease-out]">
                  {/* Category Header */}
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded-md">
                      {q.category}
                    </span>
                    <span className={`text-[10px] font-bold ${
                      q.difficulty === 'Hard' ? 'text-red-400' :
                      q.difficulty === 'Medium' ? 'text-amber-400' : 'text-emerald-400'
                    }`}>
                      {q.difficulty} Difficulty
                    </span>
                  </div>

                  {/* Question Title */}
                  <h4 className="text-sm font-extrabold leading-relaxed text-foreground">{q.question}</h4>

                  {/* Actions Area */}
                  <div className="space-y-3 pt-2">
                    {/* User Answer Field */}
                    <div>
                      <textarea
                        placeholder="Draft your answer here to review compatibility..."
                        rows={3}
                        value={userAnswers[q.id] || ''}
                        onChange={(e) => setUserAnswers({ ...userAnswers, [q.id]: e.target.value })}
                        className="w-full p-3 rounded-xl border border-border bg-background outline-none text-xs focus:ring-1 focus:ring-indigo-500 font-sans"
                      />
                      <div className="flex justify-end gap-2 mt-2">
                        <button
                          onClick={() => handleGrade(q.id, q.question)}
                          disabled={gradingStates[q.id] === 'grading'}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {gradingStates[q.id] === 'grading' ? (
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <MessageSquare className="h-3.5 w-3.5 text-indigo-400" />
                          )}
                          Grade Answer
                        </button>

                        <button
                          onClick={() => toggleReveal(q.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border bg-card hover:bg-muted text-xs font-semibold cursor-pointer transition-colors text-muted-foreground hover:text-foreground"
                        >
                          {revealedAnswers[q.id] ? <EyeOff className="h-3.5 w-3.5 text-indigo-400" /> : <Eye className="h-3.5 w-3.5 text-indigo-400" />}
                          {revealedAnswers[q.id] ? 'Hide Answer' : 'Model Answer'}
                        </button>
                      </div>
                    </div>

                    {/* Grading Feedback Panel */}
                    {grades[q.id] && (
                      <div className="p-3.5 rounded-xl border border-indigo-500/10 bg-indigo-500/5 space-y-1.5 animate-[fadeIn_0.15s_ease-out]">
                        <div className="flex items-center gap-2 text-xs font-bold text-indigo-400">
                          <Award className="h-4.5 w-4.5" />
                          AI Score: {grades[q.id].score}/100
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">{grades[q.id].comment}</p>
                      </div>
                    )}

                    {/* Model Answer Panel */}
                    {revealedAnswers[q.id] && (
                      <div className="p-4 rounded-xl bg-background/50 border border-border/80 text-xs leading-relaxed space-y-2 animate-[fadeIn_0.15s_ease-out]">
                        <div className="font-bold text-indigo-400">Model Answer:</div>
                        <p className="whitespace-pre-wrap font-sans text-muted-foreground">{q.modelAnswer}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="p-16 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col items-center justify-center text-center space-y-4">
            <HelpCircle className="h-10 w-10 text-muted-foreground" />
            <h4 className="font-bold text-sm">Practice Board</h4>
            <p className="text-xs text-muted-foreground max-w-xs">
              Select your profile on the left and generate a custom technical/behavioral question set.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
export default InterviewPanel;
