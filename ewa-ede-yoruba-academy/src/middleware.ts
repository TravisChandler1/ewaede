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

  console.log('Middleware - pathname:', pathname);

  // Skip middleware for public paths, API routes, and static files
  const isPublicPath = publicPaths.has(pathname) ||
                       Array.from(publicPaths).some(path =>
                         path !== '/' && pathname.startsWith(path)
                       );

  if (isPublicPath ||
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api/') ||
      pathname.includes('.')) {
    console.log('Middleware - skipping for public path');
    return NextResponse.next();
  }

  // Check for NextAuth session token
  const token = req.cookies.get('next-auth.session-token') ||
                req.cookies.get('__Secure-next-auth.session-token');

  const isAuth = !!token;
  console.log('Middleware - token found:', !!token, 'isAuth:', isAuth);

  // Handle auth routes
  if (authRoutes.has(pathname)) {
    if (isAuth) {
      // Redirect authenticated users away from auth pages to dashboard
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }
    return NextResponse.next();
  }

  // Handle dashboard routes
  if (pathname === '/' || pathname.startsWith('/dashboard')) {
    console.log('Middleware - handling dashboard route, isAuth:', isAuth);
    if (!isAuth) {
      console.log('Middleware - not authenticated, redirecting to signin');
      return NextResponse.redirect(new URL('/auth/signin', nextUrl));
    }

    // Redirect root to dashboard
    if (pathname === '/') {
      console.log('Middleware - redirecting root to dashboard');
      return NextResponse.redirect(new URL('/dashboard', nextUrl));
    }

    console.log('Middleware - allowing access to dashboard');
    return NextResponse.next();
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', nextUrl));
    }

    // For now, allow access to admin routes if authenticated
    // Role-based access can be handled in the admin components themselves
    return NextResponse.next();
  }

  // For all other routes, allow access but require authentication
  if (!isAuth) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl));
  }

  return NextResponse.next();
}

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
  runtime: 'nodejs', // Use Node.js runtime instead of Edge Runtime
};
