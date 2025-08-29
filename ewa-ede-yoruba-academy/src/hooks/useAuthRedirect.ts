import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export const useAuthRedirect = (requiredRole?: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
    } else if (status === 'authenticated' && requiredRole && session?.user.role !== requiredRole) {
      router.push('/dashboard');
    }
  }, [status, router, session, requiredRole]);

  return { session, status };
};
