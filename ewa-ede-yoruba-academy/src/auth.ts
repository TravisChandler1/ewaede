import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { PrismaClient } from '@prisma/client';
import { authConfig, type UserRole } from './auth.config';

// Create a new Prisma client instance for NextAuth
const prisma = new PrismaClient();

// Re-export UserRole for consistency
export type { UserRole };

const authHandlers = NextAuth({
  ...authConfig,
  providers: [
    CredentialsProvider({
      id: 'credentials',
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        try {
          // Validate credentials exist and are strings
          if (!credentials || typeof credentials.email !== 'string' || typeof credentials.password !== 'string') {
            console.error('Auth error: Invalid or missing credentials');
            throw new Error('Email and password are required');
          }

          const email = credentials.email;
          const password = credentials.password;

          console.log('Auth attempt for email:', email);

          // Check if database connection is available
          if (!process.env.DATABASE_URL) {
            console.error('Auth error: DATABASE_URL not configured');
            throw new Error('Database connection not configured');
          }

          // Find user in database
          const user = await prisma.user.findUnique({
            where: { email },
            include: {
              studentProfile: true,
              teacherProfile: true,
            },
          });

          if (!user) {
            console.error('Auth error: User not found for email:', email);
            throw new Error('Invalid email or password');
          }

          if (!user.password) {
            console.error('Auth error: User has no password:', user.id);
            throw new Error('Invalid email or password');
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            console.error('Auth error: Invalid password for user:', user.id);
            throw new Error('Invalid email or password');
          }

          console.log('Auth success for user:', user.id, user.role);

          // Return user object for NextAuth
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role as UserRole,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);

          // If it's a database connection error, provide a more specific message
          if (error instanceof Error && error.message.includes('connect')) {
            throw new Error('Database connection failed. Please try again later.');
          }

          throw error;
        }
      },
    }),
  ],
  callbacks: {
    ...authConfig.callbacks,
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
        session.user.role = token.role as UserRole;
      }
      return session;
    },
  },
  session: {
    strategy: 'jwt' as const,
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },
  pages: authConfig.pages,
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only',
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
