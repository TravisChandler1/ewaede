import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';

export default async function DashboardPage() {
  console.log('Main dashboard page - checking user...');
  const user = await getCurrentUser();
  console.log('Main dashboard page - user:', user);

  if (!user) {
    console.log('Main dashboard page - no user, redirecting to signin');
    redirect('/auth/signin');
  }

  // Redirect based on user role
  console.log('Main dashboard page - user role:', user.role);
  if (user.role === 'TEACHER' || user.role === 'ADMIN') {
    console.log('Main dashboard page - redirecting to teacher dashboard');
    redirect('/dashboard/teacher');
  } else {
    // Default to student dashboard for all other roles
    console.log('Main dashboard page - redirecting to student dashboard');
    redirect('/dashboard/student');
  }
}
