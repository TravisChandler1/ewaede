import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const publicPaths = new Set([
  '/',
  '/auth/signin',
  '/auth/register',
  '/auth/forgot-password',
  '/auth/unauthorized',
  '/api/auth',
]);

const authRoutes = new Set([
  '/auth/signin',
  '/auth/register',
  '/auth/forgot-password',
]);

export default function middleware(req: NextRequest) {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;

  // Skip middleware for public paths, API routes, and static files
  const isPublicPath = publicPaths.has(pathname) ||
                       Array.from(publicPaths).some(path =>
                         path !== '/' && pathname.startsWith(path)
                       );

  if (isPublicPath ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  // Check for NextAuth session token - try multiple cookie names
  const token = req.cookies.get('next-auth.session-token') ||
                req.cookies.get('__Secure-next-auth.session-token') ||
                req.cookies.get('next-auth.session-token.0') ||
                req.cookies.get('__Secure-next-auth.session-token.0');

  const isAuth = !!token;

  console.log(`Middleware: ${pathname}, isAuth: ${isAuth}, token: ${!!token}`);

  // Handle auth routes - don't redirect authenticated users immediately
  // Let the client-side authentication handle the redirect
  if (authRoutes.has(pathname)) {
    console.log(`Middleware: Auth route ${pathname}, allowing access`);
    return NextResponse.next();
  }

  // Handle dashboard routes
  if (pathname === '/' || pathname.startsWith('/dashboard')) {
    console.log(`Middleware: Dashboard route ${pathname}, isAuth: ${isAuth}`);
    if (!isAuth) {
      console.log(`Middleware: Redirecting to signin from ${pathname}`);
      return NextResponse.redirect(new URL('/auth/signin', nextUrl));
    }

    // Redirect root to dashboard
    if (pathname === '/') {
      console.log(`Middleware: Redirecting root to /dashboard`);
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    console.log(`Middleware: Allowing access to ${pathname}`);
    return NextResponse.next();
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    console.log(`Middleware: Admin route ${pathname}, isAuth: ${isAuth}`);
    if (!isAuth) {
      console.log(`Middleware: Redirecting to signin from ${pathname}`);
      return NextResponse.redirect(new URL('/auth/signin', nextUrl));
    }

    console.log(`Middleware: Allowing access to ${pathname}`);
    return NextResponse.next();
  }

  // For all other routes, allow access but require authentication
  if (!isAuth) {
    console.log(`Middleware: Redirecting to signin from ${pathname}`);
    return NextResponse.redirect(new URL('/auth/signin', nextUrl));
  }

  console.log(`Middleware: Allowing access to ${pathname}`);
  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
  runtime: 'nodejs', // Use Node.js runtime instead of Edge Runtime
};
