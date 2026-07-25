import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

const isProtectedRoute = createRouteMatcher([
  '/dashboard(.*)',
]);

// Safely initialize clerk middleware or bypass if keys are missing
const hasClerkKeys = !!process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY && !!process.env.CLERK_SECRET_KEY;

const clerk = hasClerkKeys 
  ? clerkMiddleware(async (auth, req) => {
      if (isProtectedRoute(req)) {
        await auth.protect();
      }
    })
  : null;

export async function proxy(req: any, event: any) {
  if (clerk) {
    try {
      const res = await clerk(req, event);
      return res;
    } catch (err: any) {
      console.error("Clerk Middleware Error:", err);
      return new Response(`Clerk Middleware Crash: ${err.message}\n${err.stack}`, { status: 500 });
    }
  }
  // If Clerk is not configured, allow requests to proceed (Demo mode fallback)
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Skip static files and Next.js internals
    '/((?!_next|[^?]*\\.[\\w]+$|_next/image|favicon.ico).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};
