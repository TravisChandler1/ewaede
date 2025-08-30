import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import prisma from '@/lib/prisma';
import { Users, BookOpen, CheckCircle, Clock } from 'lucide-react';
import { auth } from '@/auth';

interface ApprovalLog {
  id: string;
  createdAt: Date;
  user: {
    name: string | null;
    email: string;
  } | null;
}

export default async function AdminDashboard() {
  const session = await auth();
  const user = session?.user;
  
  if (!user || user.role !== 'ADMIN') {
    return <div>Unauthorized</div>;
  }

  // Fetch dashboard statistics
  const [
    pendingTeachersCount,
    totalStudentsCount,
    totalCoursesCount,
    recentApprovals
  ] = await Promise.all([
    prisma.user.count({
      where: { role: 'PENDING_TEACHER' }
    }),
    prisma.user.count({
      where: { role: 'STUDENT' }
    }),
    prisma.course.count(),
    prisma.adminAuditLog.findMany({
      where: {
        action: 'TEACHER_APPROVED',
      },
      orderBy: { createdAt: 'desc' },
      take: 5,
      include: {
        user: {
          select: { name: true, email: true }
        }
      }
    })
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-600">Welcome back, {user.name || 'Admin'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Teachers</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingTeachersCount}</div>
            <p className="text-xs text-muted-foreground">
              {pendingTeachersCount === 1 ? 'Teacher' : 'Teachers'} waiting for approval
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalStudentsCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalStudentsCount === 1 ? 'Student' : 'Students'} enrolled
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCoursesCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalCoursesCount === 1 ? 'Course' : 'Courses'} available
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Recent Approvals</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentApprovals.length}</div>
            <p className="text-xs text-muted-foreground">
              Recent teacher approvals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          {recentApprovals.length > 0 ? (
            <div className="space-y-4">
              {recentApprovals.map((approval: ApprovalLog) => (
                <div key={approval.id} className="flex items-center justify-between">
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {approval.user?.name || 'Unknown User'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {approval.user?.email}
                    </p>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {new Date(approval.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">
              No recent activity to display.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
