import { ResumeAnalysis, JobMatchResult, InterviewQuestion, CoverLetterResult } from '../types';
import { mockResumeAnalysis, mockJobMatchResult, mockInterviewQuestions, mockCoachAnswers } from './mockData';

// Helper to check for API keys safely on both client & server
const getGeminiApiKey = (): string | null => {
  if (typeof window !== 'undefined') {
    // Check if user set a custom API key in settings
    const stored = localStorage.getItem('recruitai_gemini_api_key');
    if (stored) return stored;
  }
  return process.env.NEXT_PUBLIC_GEMINI_API_KEY || process.env.GEMINI_API_KEY || null;
};

// Delay helper to simulate network lag for simulated APIs
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export class GeminiService {
  /**
   * Helper to execute prompts via Google Gemini REST API directly.
   * This avoids heavy bundle issues on edge environments and works everywhere.
   */
  private static async callGeminiAPI(prompt: string, jsonMode = false): Promise<string> {
    const apiKey = getGeminiApiKey();
    if (!apiKey) {
      throw new Error("No Gemini API key found");
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: jsonMode ? {
          responseMimeType: "application/json"
        } : undefined
      })
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API error: ${response.status} - ${errText}`);
    }

    const data = await response.json();
    const content = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!content) {
      throw new Error("Invalid response structure from Gemini API");
    }

    return content;
  }

  /**
   * AI Resume Analyzer
   */
  static async analyzeResume(resumeText: string): Promise<ResumeAnalysis> {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      // SMART MOCK: dynamically adjust based on resume content!
      await delay(1500);
      const textLower = resumeText.toLowerCase();
      
      const hasTypeScript = textLower.includes('typescript') || textLower.includes(' ts');
      const hasReact = textLower.includes('react');
      const hasNode = textLower.includes('node');
      const hasCloud = textLower.includes('aws') || textLower.includes('docker') || textLower.includes('cloud');
      
      // Calculate scores dynamically
      let score = 55;
      if (hasTypeScript) score += 10;
      if (hasReact) score += 10;
      if (hasNode) score += 10;
      if (hasCloud) score += 9;
      
      const strengths = [];
      const weaknesses = [];
      const missingSkills = [];
      
      if (hasReact) strengths.push("Strong experience with modern component-driven libraries (React).");
      else weaknesses.push("Missing core experience with React or frontend component libraries.");

      if (hasTypeScript) strengths.push("Excellent utilization of strongly typed codebases (TypeScript).");
      else {
        weaknesses.push("Relies primarily on dynamic JavaScript without strong type checks.");
        missingSkills.push("TypeScript");
      }

      if (hasCloud) strengths.push("Solid foundation in deploying applications to cloud providers.");
      else {
        weaknesses.push("Lacks evidence of cloud containerization and server management.");
        missingSkills.push("AWS/GCP/Azure", "Docker");
      }

      if (!textLower.includes('ats') && !textLower.includes('optimized')) {
        weaknesses.push("Lacks quantitative indicators or KPI improvements for past positions.");
      }

      // Fill in remaining defaults
      if (strengths.length === 0) strengths.push("Good layout consistency and legible font hierarchies.");
      
      const suggestions = [
        "Include more concrete performance measurements (e.g. 'boosted query speed by 30%').",
        "Add key technical tools explicitly under a dedicated Skills grid.",
        "Add links to live portfolio sites or code repos."
      ];

      return {
        atsScore: score,
        summary: `Resume parsed successfully. The candidate shows solid competence in ${hasReact ? 'Frontend development' : 'general engineering'}. ${hasCloud ? 'Cloud principles are well represented.' : 'Suggest adding container deployment skills.'}`,
        strengths,
        weaknesses,
        missingSkills: missingSkills.length > 0 ? missingSkills : ["Kubernetes", "Next.js Performance Tuning"],
        improvementSuggestions: suggestions,
        industryReadiness: Math.min(100, score + 8)
      };
    }

    const prompt = `
      You are an expert ATS (Applicant Tracking System) scanner and professional resume reviewer.
      Analyze the following resume text and provide feedback in JSON format.
      The JSON object must match this schema:
      {
        "atsScore": number (0 to 100),
        "summary": "string (brief overview)",
        "strengths": ["string", "string", ...],
        "weaknesses": ["string", "string", ...],
        "missingSkills": ["string", "string", ...],
        "improvementSuggestions": ["string", "string", ...],
        "industryReadiness": number (0 to 100)
      }
      
      Resume content:
      ---
      ${resumeText}
      ---
      Respond strictly with the valid JSON object. Do not include markdown code block formatting like \`\`\`json.
    `;

    try {
      const responseText = await this.callGeminiAPI(prompt, true);
      return JSON.parse(responseText.trim()) as ResumeAnalysis;
    } catch (error) {
      console.error("Gemini Resume Analysis failed, using fallback:", error);
      return mockResumeAnalysis;
    }
  }

  /**
   * Job Match Analyzer
   */
  static async matchJob(resumeText: string, jobDescription: string): Promise<JobMatchResult> {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      await delay(1200);
      const resLower = resumeText.toLowerCase();
      const jobLower = jobDescription.toLowerCase();

      // Find overlapping words/skills
      const commonSkills = ['react', 'next.js', 'typescript', 'javascript', 'tailwind', 'node', 'express', 'postgresql', 'supabase', 'docker', 'aws', 'git', 'ci/cd', 'python', 'fastapi'];
      
      const missingKeywords: string[] = [];
      const matchedSkills: string[] = [];

      commonSkills.forEach(skill => {
        const isNeeded = jobLower.includes(skill);
        const hasIt = resLower.includes(skill);
        if (isNeeded) {
          if (hasIt) {
            matchedSkills.push(skill.toUpperCase());
          } else {
            missingKeywords.push(skill.toUpperCase());
          }
        }
      });

      const totalNeeded = matchedSkills.length + missingKeywords.length;
      const matchScore = totalNeeded > 0 ? Math.round((matchedSkills.length / totalNeeded) * 100) : 70;

      let likelihood: 'High' | 'Medium' | 'Low' = 'Medium';
      if (matchScore >= 80) likelihood = 'High';
      else if (matchScore < 60) likelihood = 'Low';

      return {
        matchScore,
        skillGap: missingKeywords,
        missingKeywords,
        suggestions: [
          `Tailor your skills block to include keywords: ${missingKeywords.join(', ')}.`,
          "Align your experiences section to highlight matching projects.",
          "Write a customized cover letter focusing on this company's technology stack."
        ],
        interviewLikelihood: likelihood
      };
    }

    const prompt = `
      You are an AI Recruitment engine matching candidate resume details to a specific Job Description.
      Compare the two inputs and provide an analysis in JSON format.
      The JSON object must match this schema:
      {
        "matchScore": number (0 to 100),
        "skillGap": ["string", "string", ...],
        "missingKeywords": ["string", "string", ...],
        "suggestions": ["string", "string", ...],
        "interviewLikelihood": "High" | "Medium" | "Low"
      }

      Candidate Resume:
      ---
      ${resumeText}
      ---

      Job Description:
      ---
      ${jobDescription}
      ---
      Respond strictly with the valid JSON object. Do not include markdown code block formatting like \`\`\`json.
    `;

    try {
      const responseText = await this.callGeminiAPI(prompt, true);
      return JSON.parse(responseText.trim()) as JobMatchResult;
    } catch (error) {
      console.error("Gemini Job Match failed, using fallback:", error);
      return mockJobMatchResult;
    }
  }

  /**
   * Cover Letter Generator
   */
  static async generateCoverLetter(
    resumeText: string,
    jobTitle: string,
    company: string,
    tone: string
  ): Promise<CoverLetterResult> {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      await delay(1500);
      const paragraphs = [
        `Dear Hiring Manager,`,
        `I am writing to express my enthusiastic interest in the ${jobTitle || 'Software Engineer'} role at ${company || 'your esteemed company'}. Given my background in designing high-quality React/Next.js interfaces, building strong TypeScript logic, and configuring automated CI/CD deployments, I am confident that I can make an immediate, positive impact on your product engineering team.`,
        `From my resume, you will find a consistent track record of developing intuitive user experiences paired with reliable services. I pride myself on writing clean, self-documenting code and collaborate closely with designers and product managers to release scalable solutions. Utilizing a ${tone} approach, I'm eager to solve complex problems and push performance boundaries at ${company || 'your organization'}.`,
        `Thank you for your time and consideration. I welcome the opportunity to discuss my experience and projects in greater detail during an interview.`,
        `Sincerely,\nCandidate`
      ];

      return {
        jobTitle: jobTitle || "Software Engineer",
        company: company || "PixelMind client",
        tone,
        content: paragraphs.join('\n\n')
      };
    }

    const prompt = `
      You are an expert career consultant. Write a professional cover letter based on the candidate's resume and a target job.
      Tone: ${tone}
      Target Job Title: ${jobTitle}
      Target Company: ${company}

      Candidate Resume:
      ---
      ${resumeText}
      ---

      Draft a complete, beautifully structured cover letter. Format your response as clean text, using newlines for paragraphs.
    `;

    try {
      const responseText = await this.callGeminiAPI(prompt, false);
      return {
        jobTitle,
        company,
        tone,
        content: responseText.trim()
      };
    } catch (error) {
      console.error("Gemini Cover Letter failed, using fallback:", error);
      return {
        jobTitle,
        company,
        tone,
        content: `Dear Hiring Manager at ${company},\n\nI am writing to apply for the position of ${jobTitle}. Based on my professional resume, I have core capabilities in full-stack web software, testing structures, and deploying cloud infrastructures.\n\nI look forward to contributing to your team.\n\nSincerely,\nCandidate`
      };
    }
  }

  /**
   * Interview Preparation Questions
   */
  static async generateInterviewPrep(resumeText: string): Promise<InterviewQuestion[]> {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      await delay(1200);
      // Filter or customize mock questions a tiny bit
      return mockInterviewQuestions;
    }

    const prompt = `
      You are an elite software engineering interviewer. Generate exactly 4 interview questions tailored to the candidate's skills listed in their resume:
      - 1 Technical question (specific to their technologies, e.g. React/Next.js/Node/DB)
      - 1 Coding question (programming problem with a quick javascript/typescript function solution)
      - 1 Behavioral question (situation-based)
      - 1 HR/Culture question (career goals)
      
      Your response must be in JSON format matching this schema:
      [
        {
          "id": "string (unique code)",
          "category": "Technical" | "Coding" | "Behavioral" | "HR",
          "difficulty": "Easy" | "Medium" | "Hard",
          "question": "string",
          "modelAnswer": "string (a complete, detailed response including code block if necessary)"
        }
      ]

      Candidate Resume:
      ---
      ${resumeText}
      ---
      Respond strictly with the valid JSON array. Do not include markdown code block formatting like \`\`\`json.
    `;

    try {
      const responseText = await this.callGeminiAPI(prompt, true);
      return JSON.parse(responseText.trim()) as InterviewQuestion[];
    } catch (error) {
      console.error("Gemini Interview Prep failed, using fallback:", error);
      return mockInterviewQuestions;
    }
  }

  /**
   * AI Career Coach Chat Assistant
   */
  static async chatWithCoach(message: string, history: { sender: 'user' | 'ai', text: string }[]): Promise<string> {
    const apiKey = getGeminiApiKey();

    if (!apiKey) {
      await delay(800);
      const textLower = message.toLowerCase();
      if (textLower.includes('resume') || textLower.includes('improve')) return mockCoachAnswers.resume;
      if (textLower.includes('aws') || textLower.includes('cloud')) return mockCoachAnswers.aws;
      if (textLower.includes('cert') || textLower.includes('learn')) return mockCoachAnswers.certs;
      if (textLower.includes('project') || textLower.includes('portfolio')) return mockCoachAnswers.projects;
      return mockCoachAnswers.default;
    }

    // Format chat history for Gemini context
    const historyContext = history.map(h => `${h.sender === 'user' ? 'Candidate' : 'AI Coach'}: ${h.text}`).join('\n');
    
    const prompt = `
      You are PixelMind's AI Career Coach, a helpful, encouraging, and experienced mentor helping engineers and candidates secure their dream jobs.
      Answer the user's message thoughtfully. Keep your answer under 3 paragraphs, use clean markdown, bullet points where appropriate, and stay developer-focused.

      Chat History:
      ${historyContext}

      Current User Message: ${message}

      AI Coach Response:
    `;

    try {
      return await this.callGeminiAPI(prompt, false);
    } catch (error) {
      console.error("Gemini Chat failed, using fallback:", error);
      return "I'm having a little trouble connecting to my AI brain, but I'm here to support you! Try asking about certifications, project ideas, or resume updates.";
    }
  }
}
export default GeminiService;
