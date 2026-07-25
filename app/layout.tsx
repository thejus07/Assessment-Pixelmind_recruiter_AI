import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { ToastProvider } from "@/context/ToastContext";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PixelMind Recruit AI - ATS Optimizer & Candidate Ranker",
  description: "Optimize your resume, match with jobs, generate custom cover letters, and rank candidates with the power of Google Gemini AI.",
  keywords: ["Recruitment", "Resume Scanner", "ATS Optimizer", "AI Cover Letter", "Interview Prep", "Gemini AI"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const hasClerk = process.env.NEXT_PUBLIC_ENABLE_CLERK === 'true' && !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY;

  const content = (
    <AuthProvider>
      <ToastProvider>
        {children}
      </ToastProvider>
    </AuthProvider>
  );

  if (hasClerk) {
    return (
      <ClerkProvider>
        <html
          lang="en"
          className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
        >
          <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
            {content}
          </body>
        </html>
      </ClerkProvider>
    );
  }

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground transition-colors duration-200">
        {content}
      </body>
    </html>
  );
}

