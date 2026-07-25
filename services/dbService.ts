import { supabase, isSupabaseConfigured } from '../lib/supabaseClient';
import { ResumeStorage, StoredResume } from './resumeStorage';
import { ResumeAnalysis } from '../types';

export class DbService {
  /**
   * Fetch all resumes for the active user
   */
  static async getResumes(userId: string): Promise<StoredResume[]> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        
        return (data || []).map(r => ({
          id: r.id,
          fileName: r.file_name,
          fileSize: 'Uploaded PDF',
          uploadedAt: new Date(r.created_at).toLocaleDateString(),
          text: r.file_url, // For mock simplicity we map url here or details
          analysis: r.analysis as ResumeAnalysis
        }));
      } catch (err) {
        console.error('Supabase query failed, falling back to local storage:', err);
        return ResumeStorage.getResumes();
      }
    }
    
    return ResumeStorage.getResumes();
  }

  /**
   * Save a new resume and its analysis report
   */
  static async saveResume(
    userId: string, 
    fileName: string, 
    fileSize: string, 
    text: string, 
    analysis?: ResumeAnalysis
  ): Promise<StoredResume> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('resumes')
          .insert({
            user_id: userId,
            file_name: fileName,
            file_url: text.substring(0, 100), // In production we upload file to Supabase storage and save URL
            ats_score: analysis?.atsScore || 0,
            analysis: analysis
          })
          .select()
          .single();

        if (error) throw error;

        return {
          id: data.id,
          fileName: data.file_name,
          fileSize,
          uploadedAt: new Date(data.created_at).toLocaleDateString(),
          text: text,
          analysis: analysis
        };
      } catch (err) {
        console.error('Supabase insert failed, falling back to local storage:', err);
        return ResumeStorage.saveResume(fileName, fileSize, text, analysis);
      }
    }

    return ResumeStorage.saveResume(fileName, fileSize, text, analysis);
  }

  /**
   * Delete a resume record
   */
  static async deleteResume(userId: string, resumeId: string): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { error } = await supabase
          .from('resumes')
          .delete()
          .eq('id', resumeId)
          .eq('user_id', userId);

        if (error) throw error;
        return;
      } catch (err) {
        console.error('Supabase delete failed, falling back to local storage:', err);
        ResumeStorage.deleteResume(resumeId);
        return;
      }
    }

    ResumeStorage.deleteResume(resumeId);
  }
}

export default DbService;
