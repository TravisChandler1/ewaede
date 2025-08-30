import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  // Redirect based on user role
  if (user.role === 'TEACHER' || user.role === 'ADMIN') {
    redirect('/dashboard/teacher');
  } else {
    // Default to student dashboard for all other roles
    redirect('/dashboard/student');
  }
}
