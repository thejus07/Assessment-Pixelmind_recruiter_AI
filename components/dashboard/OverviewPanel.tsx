"use client";

import React, { useState, useEffect } from 'react';
import { ResumeStorage, StoredResume } from '@/services/resumeStorage';
import { 
  BarChart3, FileText, CheckCircle2, TrendingUp, Sparkles, 
  ArrowRight, ShieldAlert, Zap, Calendar, Play
} from 'lucide-react';

interface OverviewPanelProps {
  onNavigate: (tab: string) => void;
}

export const OverviewPanel: React.FC<OverviewPanelProps> = ({ onNavigate }) => {
  const [resumes, setResumes] = useState<StoredResume[]>([]);
  
  useEffect(() => {
    setResumes(ResumeStorage.getResumes());
  }, []);

  const totalResumes = resumes.length;
  
  const avgScore = totalResumes > 0 
    ? Math.round(resumes.reduce((acc, curr) => acc + (curr.analysis?.atsScore || 0), 0) / totalResumes) 
    : 0;

  // Render responsive SVG dashboard charts
  return (
    <div className="space-y-6">
      
      {/* Welcome Banner */}
      <div className="p-6 rounded-2xl glass-panel relative overflow-hidden border border-white/10 dark:border-white/5 bg-card/45 shadow-xl">
        <div className="absolute -right-16 -top-16 w-48 h-48 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -right-8 -bottom-16 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl pointer-events-none" />
        
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-500/5 text-indigo-400 text-xs font-semibold mb-3">
            <Sparkles className="h-3.5 w-3.5" />
            AI Sourcing Insights Active
          </div>
          <h2 className="text-2xl font-bold tracking-tight mb-2">Welcome to your Recruit AI Workspace</h2>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Upload your resumes, track matches with job descriptions, and prepare for interviews using Google Gemini. Use the tabs on the left to start auditing files.
          </p>
        </div>
      </div>

      {/* Grid Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: "Total Resumes", value: totalResumes, change: "+12% this week", icon: FileText, color: "text-indigo-400 bg-indigo-500/10" },
          { title: "Average ATS Score", value: `${avgScore}%`, change: avgScore > 75 ? "Optimal Range" : "Needs Optimization", icon: BarChart3, color: "text-emerald-400 bg-emerald-500/10" },
          { title: "Jobs Matched", value: 3, change: "+2 from last week", icon: CheckCircle2, color: "text-purple-400 bg-purple-500/10" },
          { title: "Interview Odds", value: totalResumes > 0 ? "High" : "N/A", change: "Based on 3 matches", icon: TrendingUp, color: "text-amber-400 bg-amber-500/10" }
        ].map((stat, idx) => (
          <div key={idx} className="p-4 rounded-2xl glass-panel bg-card/65 border border-border flex flex-col justify-between shadow">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs text-muted-foreground font-semibold">{stat.title}</span>
              <div className={`p-2 rounded-xl ${stat.color}`}>
                <stat.icon className="h-4.5 w-4.5" />
              </div>
            </div>
            <div>
              <div className="text-2xl font-black tracking-tight">{stat.value}</div>
              <p className="text-[10px] text-muted-foreground font-bold mt-1 uppercase tracking-wider">{stat.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Custom SVG Bar Chart */}
        <div className="lg:col-span-2 p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow">
          <h3 className="font-bold text-sm mb-1">ATS Scores Distribution</h3>
          <p className="text-[10px] text-muted-foreground mb-6">Historical ATS test scores for recent profile audits.</p>
          
          <div className="h-48 flex items-end justify-between gap-4 px-2 pt-6 relative border-b border-border/60">
            {/* Background grid lines */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none text-[8px] text-muted-foreground/35 font-mono">
              <span className="border-t border-dashed border-border/20 w-full pt-1">100%</span>
              <span className="border-t border-dashed border-border/20 w-full pt-1">75%</span>
              <span className="border-t border-dashed border-border/20 w-full pt-1">50%</span>
              <span className="border-t border-dashed border-border/20 w-full pt-1">25%</span>
            </div>

            {resumes.length === 0 ? (
              <div className="absolute inset-0 flex flex-col items-center justify-center text-xs text-muted-foreground font-semibold">
                No resumes uploaded yet.
                <button onClick={() => onNavigate('analyzer')} className="text-indigo-400 hover:underline mt-1 cursor-pointer">
                  Go to Analyzer
                </button>
              </div>
            ) : (
              resumes.slice(0, 5).reverse().map((r, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                  {/* Tooltip */}
                  <div className="absolute bottom-full mb-1 opacity-0 group-hover:opacity-100 transition-opacity bg-indigo-600 text-white text-[9px] px-1.5 py-0.5 rounded font-bold shadow-lg pointer-events-none z-10">
                    {r.analysis?.atsScore}%
                  </div>
                  
                  {/* Bar */}
                  <div 
                    className="w-full max-w-[40px] rounded-t-lg bg-gradient-to-t from-indigo-600/70 to-indigo-500 hover:scale-105 transition-all shadow-md cursor-pointer"
                    style={{ height: `${r.analysis?.atsScore || 30}%` }}
                  />
                  <span className="text-[9px] text-muted-foreground font-semibold mt-2 truncate w-full text-center max-w-[60px]">
                    {r.fileName.replace(/\.pdf|\.txt/g, '')}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Custom Radial Gauge Chart (Skill Overlaps) */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow flex flex-col justify-between">
          <div>
            <h3 className="font-bold text-sm mb-1">Industry Readiness</h3>
            <p className="text-[10px] text-muted-foreground mb-6">Calculated baseline index across core tech segments.</p>
          </div>

          <div className="flex flex-col items-center justify-center relative py-2">
            <svg className="w-32 h-32 transform -rotate-90">
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-muted/10"
              />
              <circle
                cx="64"
                cy="64"
                r="50"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray={314}
                strokeDashoffset={314 - (314 * (avgScore || 70)) / 100}
                className="text-indigo-500 transition-all duration-300"
              />
            </svg>
            <div className="absolute flex flex-col items-center">
              <span className="text-xl font-extrabold">{avgScore || 70}%</span>
              <span className="text-[8px] text-muted-foreground font-bold uppercase tracking-wider">Ready</span>
            </div>
          </div>

          <div className="text-center text-[10px] font-semibold text-muted-foreground border-t border-border/20 pt-3 mt-4">
            {avgScore > 80 ? "Your profile meets top startup specifications." : "Scan resumes to see gaps and recommendations."}
          </div>
        </div>
      </div>

      {/* Quick Actions & Recent Uploads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Actions panel */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow lg:col-span-1 space-y-4">
          <h3 className="font-bold text-sm">Quick Actions</h3>
          <div className="space-y-2">
            {[
              { label: "Analyze New Resume", desc: "Upload and audit a PDF", action: () => onNavigate('analyzer') },
              { label: "Check Job Match", desc: "Compare against job profiles", action: () => onNavigate('matcher') },
              { label: "Generate Cover Letter", desc: "Write tailored letter", action: () => onNavigate('cover-letter') },
              { label: "Practice Interview", desc: "Interactive mock queries", action: () => onNavigate('interview') }
            ].map((btn, idx) => (
              <button
                key={idx}
                onClick={btn.action}
                className="w-full flex items-center justify-between p-3 rounded-xl border border-border hover:bg-muted/50 transition-all text-left cursor-pointer group"
              >
                <div>
                  <h4 className="text-xs font-bold text-foreground group-hover:text-indigo-400 transition-colors">{btn.label}</h4>
                  <p className="text-[10px] text-muted-foreground mt-0.5">{btn.desc}</p>
                </div>
                <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
              </button>
            ))}
          </div>
        </div>

        {/* Recent Resume List */}
        <div className="p-5 rounded-2xl glass-panel bg-card/65 border border-border shadow lg:col-span-2">
          <h3 className="font-bold text-sm mb-3">Recent Audits</h3>
          {resumes.length === 0 ? (
            <div className="py-12 text-center text-xs text-muted-foreground">
              No files analyzed yet. Upload your first PDF to see analytics.
            </div>
          ) : (
            <div className="space-y-3">
              {resumes.slice(0, 3).map((res) => (
                <div key={res.id} className="flex items-center justify-between p-3 rounded-xl bg-background/50 border border-border/50 hover:bg-muted/20 transition-all">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg">
                      <FileText className="h-4 w-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold truncate max-w-[150px] md:max-w-[250px]">{res.fileName}</h4>
                      <p className="text-[10px] text-muted-foreground mt-0.5">Uploaded {res.uploadedAt} • {res.fileSize}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                      (res.analysis?.atsScore || 0) >= 80 ? 'text-emerald-400 bg-emerald-500/5 border border-emerald-500/20' :
                      (res.analysis?.atsScore || 0) >= 60 ? 'text-amber-400 bg-amber-500/5 border border-amber-500/20' :
                      'text-red-400 bg-red-500/5 border border-red-500/20'
                    }`}>
                      {res.analysis?.atsScore || 0}% ATS
                    </span>
                    <button
                      onClick={() => onNavigate('analyzer')}
                      className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                    >
                      View Report
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default OverviewPanel;
