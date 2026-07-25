import { ResumeAnalysis } from '../types';
import { mockResumeAnalysis } from './mockData';
import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';

export interface StoredResume {
  id: string;
  fileName: string;
  fileSize: string;
  uploadedAt: string;
  text: string;
  analysis?: ResumeAnalysis;
}

export class ResumeStorage {
  private static KEY = 'recruitai_stored_resumes';

  static getResumes(): StoredResume[] {
    if (typeof window === 'undefined') return [];
    const data = localStorage.getItem(this.KEY);
    if (!data) {
      const seeded: StoredResume = {
        id: 'seed-1',
        fileName: 'alex_mercer_resume_2026.pdf',
        fileSize: '142 KB',
        uploadedAt: new Date(Date.now() - 3600000 * 24 * 2).toLocaleDateString(),
        text: `Alex Mercer\nalex.mercer@pixelmind.ai\nSenior Full-Stack Engineer\nSkills: TypeScript, React, Next.js, Node.js, AWS, TailwindCSS, Supabase\nExperience:\nLead Frontend Engineer at Vercel Partner Corp (2023 - Present)\nSenior Software Engineer at DevSync Systems (2020 - 2023)\nEducation: B.Tech in CSE at Hyderabad Institute of Technology`,
        analysis: mockResumeAnalysis
      };
      localStorage.setItem(this.KEY, JSON.stringify([seeded]));
      
      // Sync seeded resume to database in background
      this.syncToSupabase(seeded);
      
      return [seeded];
    }

    const list = JSON.parse(data);
    // Background sync check for all resumes
    this.syncAllToSupabase(list);

    return list;
  }

  static saveResume(fileName: string, fileSize: string, text: string, analysis?: ResumeAnalysis): StoredResume {
    const resumes = this.getResumes();
    const newResume: StoredResume = {
      id: Math.random().toString(36).substring(2, 9),
      fileName,
      fileSize,
      uploadedAt: new Date().toLocaleDateString(),
      text,
      analysis
    };
    resumes.unshift(newResume);
    localStorage.setItem(this.KEY, JSON.stringify(resumes));

    // Async sync to Supabase database
    this.syncToSupabase(newResume);

    return newResume;
  }

  static updateAnalysis(id: string, analysis: ResumeAnalysis) {
    const resumes = this.getResumes();
    const idx = resumes.findIndex(r => r.id === id);
    if (idx !== -1) {
      resumes[idx].analysis = analysis;
      localStorage.setItem(this.KEY, JSON.stringify(resumes));
      
      // Async sync update to Supabase
      this.syncToSupabase(resumes[idx]);
    }
  }

  static deleteResume(id: string) {
    const resumes = this.getResumes();
    const filtered = resumes.filter(r => r.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(filtered));

    // Async delete from Supabase database
    this.deleteFromSupabase(id);
  }

  /**
   * Background helper to sync a single resume record to Supabase
   */
  private static async syncToSupabase(resume: StoredResume) {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      const email = typeof window !== 'undefined' 
        ? (JSON.parse(localStorage.getItem('recruitai_user') || '{}').email || 'guest@pixelmind.ai')
        : 'guest@pixelmind.ai';

      // Insert or Update the record using upsert
      const { error } = await supabase.from('resumes').upsert({
        id: resume.id.includes('-') ? undefined : undefined, // Avoid formatting mismatches
        user_id: email, // Maps to email profiles
        file_name: resume.fileName,
        file_url: resume.text.substring(0, 200),
        ats_score: resume.analysis?.atsScore || 0,
        analysis: resume.analysis
      }, { onConflict: 'file_name' });

      if (error) throw error;
      console.log(`Synced resume ${resume.fileName} to Supabase successfully.`);
    } catch (err) {
      console.warn('Background Supabase sync deferred:', err);
    }
  }

  /**
   * Background helper to sync all resumes in batch
   */
  private static async syncAllToSupabase(resumes: StoredResume[]) {
    if (!isSupabaseConfigured || !supabase) return;
    resumes.forEach(r => this.syncToSupabase(r));
  }

  /**
   * Background helper to delete a resume from Supabase
   */
  private static async deleteFromSupabase(id: string) {
    if (!isSupabaseConfigured || !supabase) return;

    try {
      const { error } = await supabase
        .from('resumes')
        .delete()
        .eq('id', id);

      if (error) throw error;
      console.log(`Deleted resume ${id} from Supabase.`);
    } catch (err) {
      console.warn('Background Supabase delete failed:', err);
    }
  }
}
