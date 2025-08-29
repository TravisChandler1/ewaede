import { auth } from '@/auth';
import type { UserRole } from '../auth.config';

export async function getCurrentUser() {
  const session = await auth();
  return session?.user;
}

export async function requireAdmin() {
  const session = await auth();
  const user = session?.user;
  
  if (!user || user.role !== 'ADMIN') {
    throw new Error('Unauthorized: Admin access required');
  }
  
  return user;
}

export async function requireTeacher() {
  const session = await auth();
  const user = session?.user;
  
  if (!user || (user.role !== 'TEACHER' && user.role !== 'ADMIN')) {
    throw new Error('Unauthorized: Teacher access required');
  }
  
  return user;
}

export async function requireAuth(requiredRole?: UserRole) {
  const session = await auth();
  const user = session?.user;
  
  if (!user) {
    throw new Error('Authentication required');
  }
  
  if (requiredRole && user.role !== requiredRole) {
    throw new Error(`Unauthorized: ${requiredRole} role required`);
  }
  
  return user;
}
