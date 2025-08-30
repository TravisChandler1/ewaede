import { redirect } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import DashboardSidebar from '@/components/dashboard/DashboardSidebar';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardSidebar user={user} />
      <div className="pt-16 md:pt-0">
        <main className="min-h-[calc(100vh-4rem)]">
          <div className="px-4 py-6 sm:px-6 lg:px-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
