// Core auth types
export type UserRole = 'STUDENT' | 'TEACHER' | 'ADMIN' | 'PENDING_TEACHER';

export interface AuthUser {
  id: string;
  email?: string | null;
  name?: string | null;
  role: UserRole;
  image?: string | null;
}

export interface AuthError extends Error {
  status?: number;
}

// Extend Next.js types
declare module 'next/server' {
  interface NextRequest {
    auth?: {
      user?: AuthUser | null;
    };
  }
}

// Extend NextAuth types
declare module 'next-auth' {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface User extends Omit<AuthUser, 'id'> {}
  
  interface Session {
    user: AuthUser;
  }
}

// Extend NextAuth JWT types
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    role: UserRole;
  }
}
