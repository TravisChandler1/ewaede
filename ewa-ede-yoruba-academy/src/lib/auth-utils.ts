import { auth } from '@/auth';
import type { UserRole, AuthUser } from '@/auth.config';

// Re-export auth functions for easier imports
export { auth, signIn, signOut } from '@/auth';

export class AuthError extends Error {
  status: number;
  
  constructor(message: string, status: number = 500) {
    super(message);
    this.name = 'AuthError';
    this.status = status;
  }
}

type SessionUser = {
  id: string;
  email?: string | null;
  name?: string | null;
  role: UserRole;
  image?: string | null;
};

export async function getCurrentUser(): Promise<AuthUser | null> {
  const session = await auth();
  const user = session?.user as SessionUser | undefined;
  
  if (!user) {
    return null;
  }
  
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    image: user.image
  };
}

export async function requireAdmin(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user || user.role !== 'ADMIN') {
    throw new AuthError('Unauthorized: Admin access required', 403);
  }
  
  return user;
}

export async function requireTeacher(): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    throw new AuthError('Unauthorized: Teacher access required', 403);
  }
  
  return user;
}

export async function requireAuth(requiredRole?: UserRole): Promise<AuthUser> {
  const user = await getCurrentUser();
  
  if (!user) {
    throw new AuthError('Authentication required', 401);
  }
  
  if (requiredRole && user.role !== requiredRole) {
    throw new AuthError(`Unauthorized: ${requiredRole} role required`, 403);
  }
  
  return user;
}
