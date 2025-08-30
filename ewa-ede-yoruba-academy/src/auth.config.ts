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
      const publicRoutes = ['/auth/signin', '/auth/signup', '/auth/error'];
      if (publicRoutes.includes(pathname)) return true;

      // Protected routes
      if (pathname.startsWith('/admin')) {
        return isLoggedIn && auth.user?.role === 'ADMIN';
      }
      
      if (pathname.startsWith('/teacher')) {
        return isLoggedIn && (auth.user?.role === 'TEACHER' || auth.user?.role === 'ADMIN');
      }
      
      if (pathname.startsWith('/dashboard')) {
        return isLoggedIn;
      }
      
      return true;
    },
  },
  session: {
    strategy: 'jwt',
  },
  providers: [], // Will be added in auth.ts
};
