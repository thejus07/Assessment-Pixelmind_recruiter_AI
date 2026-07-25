export interface UserProfile {
  name: string;
  email: string;
  avatarUrl?: string;
  title: string;
  bio: string;
  skills: string[];
  experience: {
    company: string;
    role: string;
    duration: string;
    description: string;
  }[];
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  certifications: string[];
  projects: {
    title: string;
    description: string;
    techStack: string[];
    link?: string;
  }[];
}

export interface ResumeAnalysis {
  atsScore: number;
  summary: string;
  strengths: string[];
  weaknesses: string[];
  missingSkills: string[];
  improvementSuggestions: string[];
  industryReadiness: number; // 0 to 100
}

export interface JobMatchResult {
  matchScore: number;
  skillGap: string[];
  missingKeywords: string[];
  suggestions: string[];
  interviewLikelihood: 'High' | 'Medium' | 'Low';
}

export interface CoverLetterResult {
  jobTitle: string;
  company: string;
  tone: string;
  content: string;
}

export interface InterviewQuestion {
  id: string;
  category: 'Technical' | 'HR' | 'Behavioral' | 'Coding';
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question: string;
  modelAnswer: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Candidate {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  matchScore: number;
  experienceYears: number;
  strengths: string[];
  missingSkills: string[];
  summary: string;
}

export interface DashboardStats {
  totalResumes: number;
  averageAtsScore: number;
  jobsApplied: number;
  interviewProbability: number; // percentage
}
