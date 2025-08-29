import { NextResponse } from 'next/server';
import { auth } from './auth';
import type { UserRole } from './auth.config';

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

const adminPaths = new Set([
  '/admin',
  '/admin/(.*)',
]);

export default auth(async (req) => {
  const { nextUrl } = req;
  const pathname = nextUrl.pathname;
  const isPublicPath = publicPaths.has(pathname) || 
                      Array.from(publicPaths).some(path => 
                        path !== '/' && pathname.startsWith(path)
                      );
  
  // Skip middleware for public paths, API routes, and static files
  if (isPublicPath || 
      pathname.startsWith('/_next') || 
      pathname.startsWith('/api/') ||
      pathname.includes('.')) {
    return NextResponse.next();
  }

  const session = await auth();
  const isAuth = !!session?.user;
  const userRole = session?.user?.role as UserRole | undefined;

  // Handle auth routes
  if (authRoutes.has(pathname)) {
    if (isAuth) {
      // Redirect authenticated users away from auth pages
      const redirectPath = userRole === 'ADMIN' ? '/admin/dashboard' :
                         userRole === 'TEACHER' ? '/dashboard/teacher' :
                         '/dashboard/student';
      return NextResponse.redirect(new URL(redirectPath, nextUrl));
    }
    return NextResponse.next();
  }

  // Handle dashboard routes
  if (pathname === '/' || pathname.startsWith('/dashboard')) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', nextUrl));
    }
    
    // Redirect root or /dashboard to role-specific dashboard
    if (pathname === '/' || pathname === '/dashboard') {
      const redirectPath = userRole === 'ADMIN' ? '/admin/dashboard' :
                         userRole === 'TEACHER' ? '/dashboard/teacher' :
                         '/dashboard/student';
      return NextResponse.redirect(new URL(redirectPath, nextUrl));
    }
    
    return NextResponse.next();
  }

  // Handle admin routes
  if (pathname.startsWith('/admin')) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/auth/signin', nextUrl));
    }
    
    if (userRole !== 'ADMIN') {
      return NextResponse.redirect(new URL('/auth/unauthorized', nextUrl));
    }
    
    return NextResponse.next();
  }

  // For all other routes, allow access but require authentication
  if (!isAuth) {
    return NextResponse.redirect(new URL('/auth/signin', nextUrl));
  }

  return NextResponse.next();
});

// Configure which paths should be processed by this middleware
export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
};
