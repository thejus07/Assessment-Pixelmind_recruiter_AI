import { ResumeAnalysis } from '../types';
import { mockResumeAnalysis } from './mockData';

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
      // Seed with a default resume for testing
      const seeded: StoredResume = {
        id: 'seed-1',
        fileName: 'alex_mercer_resume_2026.pdf',
        fileSize: '142 KB',
        uploadedAt: new Date(Date.now() - 3600000 * 24 * 2).toLocaleDateString(),
        text: `Alex Mercer\nalex.mercer@pixelmind.ai\nSenior Full-Stack Engineer\nSkills: TypeScript, React, Next.js, Node.js, AWS, TailwindCSS, Supabase\nExperience:\nLead Frontend Engineer at Vercel Partner Corp (2023 - Present)\nSenior Software Engineer at DevSync Systems (2020 - 2023)\nEducation: B.Tech in CSE at Hyderabad Institute of Technology`,
        analysis: mockResumeAnalysis
      };
      localStorage.setItem(this.KEY, JSON.stringify([seeded]));
      return [seeded];
    }
    return JSON.parse(data);
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
    return newResume;
  }

  static updateAnalysis(id: string, analysis: ResumeAnalysis) {
    const resumes = this.getResumes();
    const idx = resumes.findIndex(r => r.id === id);
    if (idx !== -1) {
      resumes[idx].analysis = analysis;
      localStorage.setItem(this.KEY, JSON.stringify(resumes));
    }
  }

  static deleteResume(id: string) {
    const resumes = this.getResumes();
    const filtered = resumes.filter(r => r.id !== id);
    localStorage.setItem(this.KEY, JSON.stringify(filtered));
  }
}
