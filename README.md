# PixelMind Recruit AI

PixelMind Recruit AI is a premium, production-ready SaaS platform built for software developers to optimize their profiles and for recruiters to source and rank candidates using AI.

Designed with a sleek, developer-focused aesthetic inspired by Vercel and Stripe, the app features glassmorphism, responsive visual charts, fluid animations, and robust TypeScript routing.

---

## 🌟 Core Features

1. **AI Resume Analyzer**: Upload PDF or TXT resumes. Extract text and invoke Google Gemini AI to calculate an ATS compatibility score, audit strengths and weaknesses, isolate missing skills, and suggest concrete formatting fixes.
2. **AI Job Matcher**: Paste a job description to calculate job alignment odds, detect missing technical keywords, and isolate critical skill gaps.
3. **AI Cover Letter Generator**: Generate highly customized cover letters tailored to your profile. Tone modifiers allow selecting between *Professional*, *Bold*, or *Creative* modes.
4. **Interactive Interview Prep**: Practice job-specific mock interview sessions across Technical, HR, Behavioral, and Coding categories. Includes model responses and a custom AI answer grader.
5. **AI Career Coach**: Chat with an AI mentor. Select prompt pills for AWS prep roadmaps, standout project recommendations, and CV updates.
6. **Recruiter Bulk Sorter**: Drop multiple applicant resumes in parallel to rank and filter candidates on a custom, sortable grid layout with detailed profile slides.
7. **Analytics Dashboard**: Monitor total uploaded resumes, average ATS trends, matching statistics, and readiness indicators using custom SVG widgets.
8. **Settings & Profile**: Save your own custom Google Gemini API Key, toggle Light/Dark themes, adjust mock billing plans, and edit biography credentials.

---

## ⚡ Setup & Installation

### 1. Zero-Config Run (Demo Mode)
This application includes a **Demo Mode fallback**. If you do not have Clerk, Supabase, or Google Gemini credentials, you can run the app immediately out-of-the-box:
* Simulated authentication will mock Google and Email sign-ins.
* Simulated AI engines will scan text inputs for key terms and return realistic ratings, skill lists, cover letters, and interview questions.
* Stored resumes and chats will persist in browser `localStorage`.

### 2. Live API Mode
To activate real Google Gemini API queries:
1. Navigate to the **Settings** panel inside the dashboard.
2. Paste your **Google Gemini API Key** and save.
3. The indicator badge in the top bar will instantly transition from **DEMO MODE** to **LIVE API**.

Alternatively, create an `.env.local` file at the root:
```env
NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key_here
```

### 3. Running Locally
```bash
# Install dependencies
npm install

# Run verification tests
npm test

# Launch dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application.

---

## 📁 Folder Structure

```
c:\Users\theju\Desktop\Assessment\
├── app/                  # App router entries, layout, and global configurations
├── components/           # UI elements & custom modules
│   ├── dashboard/        # Feature panel components (Analyzer, Matcher, Recruiter, etc.)
│   └── shared/           # Navbars, footers, and Clerk Mock Auth Modal
├── context/              # React Context Providers (AuthContext, ToastContext)
├── hooks/                # Custom React hook utilities
├── lib/                  # Initializations and API connectors
├── public/               # SVG grids, mock icons, and static assets
├── scripts/              # Integration smoke tests
├── services/             # API services and mock data definitions
│   ├── geminiService.ts  # Handles Gemini API & rule-based mock fallbacks
│   ├── mockData.ts       # Mock datasets for offline operations
│   └── resumeStorage.ts  # LocalStorage resume cache utilities
├── types/                # TypeScript Interfaces
└── .github/workflows/    # CI/CD deployment pipelines (Vercel automatic hooks)
```

---

## 🚀 CI/CD & Deployments

This project is configured with a automated GitHub Actions workflow inside [deploy.yml](file:///.github/workflows/deploy.yml).

### Pipeline Steps:
1. **Lint Audit**: Verifies code styling standards using `npm run lint`.
2. **Execute Tests**: Runs structural integrity smoke tests using `npm test`.
3. **Build Target**: Compiles the Next.js production output bundle (`npm run build`).
4. **Deploy**: Automatically deploys compiled assets to Vercel production on every push to the `main` or `master` branches.

### Production Env Keys (Vercel):
Configure the following secrets in your GitHub Repository settings (`Settings > Secrets and variables > Actions`):
* `VERCEL_TOKEN`: Vercel Personal Access Token.
* `VERCEL_ORG_ID`: Vercel account Org ID.
* `VERCEL_PROJECT_ID`: Vercel project ID.
* `NEXT_PUBLIC_GEMINI_API_KEY`: Production Gemini API key (optional).
