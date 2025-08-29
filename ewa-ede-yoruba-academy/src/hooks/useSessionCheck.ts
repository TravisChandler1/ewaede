'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export const useSessionCheck = (requiredRole?: 'STUDENT' | 'TEACHER' | 'ADMIN') => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    if (requiredRole && session?.user.role !== requiredRole) {
      router.push('/dashboard');
      return;
    }

    setIsLoading(false);
  }, [status, session, requiredRole, router]);

  return { session, isLoading };
};
