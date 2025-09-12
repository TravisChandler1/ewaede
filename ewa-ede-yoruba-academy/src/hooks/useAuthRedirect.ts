import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

// Helper function to get role-based dashboard URL
const getDashboardUrl = (role?: string): string => {
  if (!role) return '/dashboard';

  switch (role.toUpperCase()) {
    case 'STUDENT':
      return '/dashboard/student';
    case 'TEACHER':
    case 'PENDING_TEACHER':
      return '/dashboard/teacher';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

export const useAuthRedirect = (requiredRole?: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && requiredRole && session?.user.role !== requiredRole) {
      // Redirect to user's appropriate dashboard if they don't have the required role
      const dashboardUrl = getDashboardUrl(session.user.role);
      router.push(dashboardUrl);
    }
  }, [status, router, session, requiredRole]);

  return { session, status };
};
