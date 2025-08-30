import type { NextAuthConfig } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './prisma';

// Extend the built-in session and user types
declare module 'next-auth' {
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PENDING_TEACHER';
  }

  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role: 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PENDING_TEACHER';
    };
  }
}

export const authConfig: NextAuthConfig = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const user = await prisma.user.findUnique({
          where: { email: String(credentials.email) },
        });

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await bcrypt.compare(
          String(credentials.password),
          user.password
        );

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PENDING_TEACHER';
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  debug: process.env.NODE_ENV === 'development',
};

// Helper function to get the current user's session
export async function getServerSession() {
  const { auth } = await import('@/auth');
  return auth();
}

// Helper function to check if user is authenticated
export async function requireAuth() {
  const session = await getServerSession();
  if (!session) {
    throw new Error('Not authenticated');
  }
  return session;
}

// Helper function to check user role
export async function requireRole(role: 'ADMIN' | 'TEACHER' | 'STUDENT' | 'PENDING_TEACHER') {
  const session = await requireAuth();
  if (session.user.role !== role) {
    throw new Error(`Requires ${role} role`);
  }
  return session;
}
