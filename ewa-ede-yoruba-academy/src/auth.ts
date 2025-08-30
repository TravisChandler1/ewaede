import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import prisma from './lib/prisma';
import { authConfig, type UserRole } from './auth.config';

// Re-export UserRole for consistency
export type { UserRole };

const authHandlers = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
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
          role: user.role as UserRole,
        };
      },
    }),
  ],
  callbacks: authConfig.callbacks,
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: authConfig.pages,
  debug: process.env.NODE_ENV === 'development',
});

// Export the handlers, auth function, and signIn/signOut functions
export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = authHandlers;

// This is the recommended way to use NextAuth.js with the App Router
export default auth(() => {
  // Handle authentication logic here if needed
  return null;
});
