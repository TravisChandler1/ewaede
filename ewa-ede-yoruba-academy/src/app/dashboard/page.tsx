import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect('/auth/signin');
  }

  // Redirect based on user role
  if (session.user.role === 'TEACHER') {
    redirect('/dashboard/teacher');
  } else {
    // Default to student dashboard for all other roles
    redirect('/dashboard/student');
  }
}
