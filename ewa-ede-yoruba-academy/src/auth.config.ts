import type { NextAuthConfig } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { Session, User } from 'next-auth';

// Export UserRole from here to avoid circular dependencies
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PENDING_TEACHER';

export interface AuthToken extends JWT {
  id: string;
  role: UserRole;
}

export interface AuthUser extends User {
  id: string;
  role: UserRole;
}

export interface AuthSession extends Session {
  user: AuthUser;
}

interface AuthConfig extends NextAuthConfig {
  pages: {
    signIn: string;
    error: string;
  };
  callbacks: {
    jwt: (params: { token: AuthToken; user?: AuthUser }) => Promise<AuthToken>;
    session: (params: { session: AuthSession; token: AuthToken }) => Promise<AuthSession>;
    authorized: (params: {
      auth: { user: AuthUser | null } | null;
      request: { nextUrl: URL }
    }) => boolean | Response;
    redirect: (params: { url: string; baseUrl: string }) => string;
  };
  session: {
    strategy: 'jwt';
  };
  providers: NextAuthConfig['providers'];
}

export const authConfig: AuthConfig = {
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  callbacks: {
    async jwt({ token, user }: { token: AuthToken; user?: AuthUser }) {
      if (user) {
        token.id = user.id;
        token.role = user.role as UserRole;
      }
      return token;
    },
    async session({ session, token }: { session: AuthSession; token: AuthToken }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
      }
      return session;
    },
    authorized({ auth, request }: { auth: { user: AuthUser | null } | null; request: { nextUrl: URL } }) {
      const isLoggedIn = !!auth?.user;
      const { pathname } = request.nextUrl;
      
      // Public routes that don't require authentication
      const publicRoutes = ['/auth/signin', '/auth/register', '/auth/error'];
      if (publicRoutes.includes(pathname)) return true;

      // Protected routes
      if (pathname.startsWith('/admin')) {
        return isLoggedIn && auth.user?.role?.toUpperCase() === 'ADMIN';
      }

      if (pathname.startsWith('/teacher')) {
        const userRole = auth?.user?.role?.toUpperCase();
        return isLoggedIn && (userRole === 'TEACHER' || userRole === 'ADMIN');
      }

      if (pathname.startsWith('/dashboard')) {
        return isLoggedIn;
      }
      
      return true;
    },
    redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      // Ensure baseUrl is HTTPS in production
      const secureBaseUrl = baseUrl.replace('http://', 'https://');

      // If the URL is relative, prepend the secure base URL
      if (url.startsWith('/')) return `${secureBaseUrl}${url}`;

      // If the URL is already absolute, return it as is
      if (url.startsWith(secureBaseUrl)) return url;

      // Default to secure base URL
      return secureBaseUrl;
    },
  },
  session: {
    strategy: 'jwt',
  },
  providers: [], // Will be added in auth.ts
};
