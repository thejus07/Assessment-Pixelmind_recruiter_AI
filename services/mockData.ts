import { UserProfile, ResumeAnalysis, JobMatchResult, InterviewQuestion, Candidate } from '../types';

export const mockProfile: UserProfile = {
  name: "Alex Mercer",
  email: "alex.mercer@pixelmind.ai",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80",
  title: "Senior Full-Stack Engineer",
  bio: "Passionate software engineering leader with 6+ years of experience designing and deploying high-scale TypeScript & React systems. Focused on crafting premium user experiences and robust distributed systems.",
  skills: [
    "TypeScript", "React", "Next.js", "Node.js", "Tailwind CSS", 
    "PostgreSQL", "Supabase", "Docker", "AWS", "CI/CD", "RESTful APIs", "GraphQL"
  ],
  experience: [
    {
      company: "Vercel Partner Corp",
      role: "Lead Frontend Engineer",
      duration: "2023 - Present",
      description: "Led development of a high-performance Next.js dashboard. Optimized site loading speed by 42% through lazy loading, image compression, and edge caching."
    },
    {
      company: "DevSync Systems",
      role: "Senior Software Engineer",
      duration: "2020 - 2023",
      description: "Designed scalable Node.js microservices. Integrated AWS Lambda functions, reducing infrastructure costs by 28% while maintaining a 99.99% uptime SLA."
    }
  ],
  education: [
    {
      institution: "Hyderabad Institute of Technology",
      degree: "B.Tech in Computer Science & Engineering",
      year: "2016 - 2020"
    }
  ],
  certifications: [
    "AWS Certified Solutions Architect",
    "MongoDB Certified Developer Associate"
  ],
  projects: [
    {
      title: "Antigravity Cloud Core",
      description: "An agentic automation framework for developers that orchestrates cloud deployment configs directly from developer intents.",
      techStack: ["Next.js", "TypeScript", "FastAPI", "Docker", "AWS"],
      link: "https://github.com/alexmercer/antigravity"
    },
    {
      title: "Vivid UI Toolkit",
      description: "A gorgeous, hardware-accelerated component library containing responsive web animations and high-performance WebGL wrappers.",
      techStack: ["React", "WebGL", "Framer Motion", "Tailwind CSS"],
      link: "https://github.com/alexmercer/vividui"
    }
  ]
};

export const mockResumeAnalysis: ResumeAnalysis = {
  atsScore: 84,
  summary: "Highly competent Senior Engineer profile showing strong mastery of TypeScript, modern frontend frameworks (Next.js/React), and cloud deployments. The resume is exceptionally clean and results-oriented, though it could benefit from additional quantitative metrics in the older experience blocks.",
  strengths: [
    "Strong core mastery of TypeScript and React hooks architecture.",
    "Proven experience building scalable Next.js systems with performance optimization.",
    "Comprehensive cloud background with AWS and infrastructure setups."
  ],
  weaknesses: [
    "Lacks numerical KPIs in the early career experience section.",
    "Limited visible exposure to Python/AI orchestration toolchains.",
    "No explicit mention of Kubernetes or container orchestration tools beyond Docker."
  ],
  missingSkills: [
    "Kubernetes",
    "FastAPI",
    "Python",
    "Redis Caching",
    "GraphQL Federation"
  ],
  improvementSuggestions: [
    "Add metric-driven metrics like 'increased conversion by 18%' in the DevSync experience block.",
    "Include Python or AI integration keywords to align with modern AI engineering demands.",
    "Mention caching mechanisms explicitly, e.g., how Redis was utilized to minimize db lookups."
  ],
  industryReadiness: 90
};

export const mockJobMatchResult: JobMatchResult = {
  matchScore: 88,
  skillGap: ["Python", "FastAPI", "Redis Caching"],
  missingKeywords: ["AI Agents", "LLM Orchestration", "Redis", "Vector Databases"],
  suggestions: [
    "Highlight your project 'Antigravity Cloud Core' prominently and clarify its FastAPI/Agent capabilities.",
    "Include 'Redis' in the skills grid since they mention high-throughput real-time APIs.",
    "Explicitly state your experience with AI models or prompts if you have any."
  ],
  interviewLikelihood: "High"
};

export const mockInterviewQuestions: InterviewQuestion[] = [
  {
    id: "q1",
    category: "Technical",
    difficulty: "Hard",
    question: "Explain the difference between Incremental Static Regeneration (ISR) and Server-Side Rendering (SSR) in Next.js, and describe how cache-control headers impact both.",
    modelAnswer: "ISR allows you to update static pages on-demand or on a background timer after they are built, meaning you get the speed of static pages but with fresh data. SSR renders pages on every single request, which is essential for user-specific dynamic data. In Next.js, cache-control headers like `s-maxage` and `stale-while-revalidate` dictate how CDN edges store and revalidate page outputs. ISR internally leverages `stale-while-revalidate` to serve cached files immediately and re-fetch background updates."
  },
  {
    id: "q2",
    category: "Coding",
    difficulty: "Medium",
    question: "Write a React hook `useDebounce` in TypeScript that debounces a generic value with a configurable delay. Explain how cleanups prevent memory leaks.",
    modelAnswer: "```typescript\nimport { useState, useEffect } from 'react';\n\nexport function useDebounce<T>(value: T, delay: number): T {\n  const [debouncedValue, setDebouncedValue] = useState<T>(value);\n\n  useEffect(() => {\n    const handler = setTimeout(() => {\n      setDebouncedValue(value);\n    }, delay);\n\n    return () => {\n      clearTimeout(handler); // Binds the cleanup to cancel timer on dependency updates\n    };\n  }, [value, delay]);\n\n  return debouncedValue;\n}\n```\nThe cleanup function `clearTimeout(handler)` is critical: it cancels the preceding pending timeout every time `value` or `delay` changes. If the component unmounts, it cancels the timer entirely, preventing state updates on an unmounted component (memory leak)."
  },
  {
    id: "q3",
    category: "Behavioral",
    difficulty: "Medium",
    question: "Tell me about a time when you disagreed with a product decision. How did you handle it and what was the outcome?",
    modelAnswer: "I focus on objective data rather than opinion. At DevSync, our PM wanted to launch a feature that would double database queries per load. I set up a mock load test demonstrating this would increase API response times from 150ms to 900ms under standard loads. I presented these charts to the PM alongside a proposed alternative using indexed query batching. They thanked me for showing the performance impact, and we adopted the batched indexing model, keeping response times under 200ms."
  },
  {
    id: "q4",
    category: "HR",
    difficulty: "Easy",
    question: "Why do you want to join PixelMind Recruit AI, and where do you see yourself in three years?",
    modelAnswer: "PixelMind Recruit AI is at the forefront of solving a real recruitment bottleneck by using LLMs to humanize resume analysis. I want to build systems that automate tedious reviews while maintaining highly engaging interfaces. In three years, I want to lead a product engineering pod, driving feature roadmaps from conception to deployment, and mentoring junior engineers in building performant, accessibility-compliant web software."
  }
];

export const mockCandidates: Candidate[] = [
  {
    id: "c1",
    name: "Aarav Sharma",
    email: "aarav.sharma@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=128&h=128&q=80",
    matchScore: 94,
    experienceYears: 5,
    strengths: ["Expert in Next.js App Router", "Strong system design foundations", "Great unit testing habits"],
    missingSkills: ["Kubernetes", "AWS Gateway"],
    summary: "Superb candidate matching 94% of the requirements. Demonstrated excellent coding structure, highly responsive UI capabilities, and clear engineering documentation."
  },
  {
    id: "c2",
    name: "Sneha Reddy",
    email: "sneha.reddy@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=128&h=128&q=80",
    matchScore: 89,
    experienceYears: 4,
    strengths: ["Excellent state management with Redux/Zustand", "Great styling with Tailwind", "API optimization experience"],
    missingSkills: ["Docker", "Supabase"],
    summary: "Solid frontend focus with 89% match. Very strong in building clean interfaces, but requires some support on deployment pipelines and DB integrations."
  },
  {
    id: "c3",
    name: "Rohan Verma",
    email: "rohan.verma@example.com",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=128&h=128&q=80",
    matchScore: 75,
    experienceYears: 3,
    strengths: ["Core JS skills", "Responsive designs", "Git workflow familiarity"],
    missingSkills: ["Next.js", "TypeScript", "CI/CD"],
    summary: "Junior to Mid profile. Very eager to learn and solid React foundations, but lacks professional TypeScript and production App Router experience."
  }
];

export const mockCoachAnswers: { [key: string]: string } = {
  default: "I can help you with resume optimization, job-specific match strategies, certification choices, or preparing coding/system-design interview sessions. Let me know what you'd like to dive into!",
  resume: "To improve your resume:\n1. **Use Action Verbs**: Begin bullet points with strong verbs (e.g., 'Architected', 'Spearheaded', 'Optimized').\n2. **Quantify Impact**: Include numbers (e.g., 'reduced bundle size by 35%', 'managed 4-engineer pod').\n3. **Tailor Keywords**: Match the skill list exactly with the target Job Description to clear ATS parsers.\n\nWould you like me to scan your resume text for quick feedback?",
  aws: "For AWS Cloud developer preparation, I recommend focusing on:\n1. **Serverless Architectures**: AWS Lambda, API Gateway, DynamoDB, and Cognito integrations.\n2. **IAM Security**: Least-privilege policies, service roles, and security groups.\n3. **CI/CD Pipelines**: AWS CodePipeline, CloudFormation, and CDK for infrastructure as code.\n\nRecommended Certification: **AWS Certified Developer – Associate** followed by **Solutions Architect**.",
  certs: "Here are top certifications based on career paths:\n- **Frontend/Full-Stack**: Meta Front-End Developer, Vercel/Next.js certifications (if available), AWS Cloud Practitioner.\n- **Backend/Cloud**: AWS Solutions Architect Associate, Associate Cloud Engineer (Google Cloud).\n- **AI Engineering**: Google Professional Machine Learning Engineer, Microsoft Azure AI Engineer Associate.",
  projects: "Excellent projects to stand out:\n1. **AI Resume Parser SaaS**: A platform using LLMs to scan resumes and suggest live fixes (just like PixelMind Recruit AI!). Use Next.js, Gemini API, and Supabase.\n2. **Collaborative Real-time Canvas**: A board supporting multiple cursors, SVG rendering, and conflict resolution (Yjs/WebSockets).\n3. **DevOps Provisioner CLI**: A CLI tool that spins up AWS/Vercel resources using YAML configs."
};
