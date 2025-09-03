import prisma from '@/lib/prisma';
import { Users, BookOpen, CheckCircle, Clock, Calendar } from 'lucide-react';
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

  // Fetch comprehensive dashboard statistics
  const [
    pendingTeachersCount,
    totalStudentsCount,
    totalCoursesCount,
    totalTeachersCount,
    activeEnrollmentsCount,
    recentApprovals,
    recentUserRegistrations,
    systemStats
  ] = await Promise.all([
    // Pending teachers awaiting approval
    prisma.user.count({
      where: { role: 'PENDING_TEACHER' }
    }),

    // Total students
    prisma.user.count({
      where: { role: 'STUDENT' }
    }),

    // Total courses
    prisma.course.count(),

    // Total approved teachers
    prisma.user.count({
      where: { role: 'TEACHER' }
    }),

    // Active enrollments
    prisma.enrollment.count({
      where: { status: 'ACTIVE' }
    }),

    // Recent teacher approvals
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
    }),

    // Recent user registrations (last 7 days)
    prisma.user.findMany({
      where: {
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
        }
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' },
      take: 5
    }),

    // System statistics
    Promise.all([
      prisma.session.count({ where: { startTime: { gte: new Date() } } }), // Upcoming sessions
      prisma.assignmentSubmission.count({ where: { gradedAt: null } }), // Ungraded submissions
      prisma.bookClub.count(), // Total book clubs
      prisma.message.count() // Total messages
    ])
  ]);

  // Destructure system stats
  const [upcomingSessions, ungradedSubmissions, totalBookClubs, totalMessages] = systemStats;

  return (
    <div className="space-y-6 bg-[#0f0f0f] min-h-screen p-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Admin Dashboard</h1>
        <p className="text-[#a1a1aa]">Welcome back, {user.name || 'Admin'}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Pending Teachers</h3>
            <Clock className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{pendingTeachersCount}</div>
            <p className="text-xs text-[#a1a1aa]">
              Awaiting approval
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Total Students</h3>
            <Users className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{totalStudentsCount}</div>
            <p className="text-xs text-[#a1a1aa]">
              Active learners
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Total Courses</h3>
            <BookOpen className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{totalCoursesCount}</div>
            <p className="text-xs text-[#a1a1aa]">
              Available courses
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Active Enrollments</h3>
            <CheckCircle className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{activeEnrollmentsCount}</div>
            <p className="text-xs text-[#a1a1aa]">
              Current enrollments
            </p>
          </div>
        </div>
      </div>

      {/* Additional Stats Row */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Approved Teachers</h3>
            <Users className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{totalTeachersCount}</div>
            <p className="text-xs text-[#a1a1aa]">
              Active instructors
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Upcoming Sessions</h3>
            <Calendar className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{upcomingSessions}</div>
            <p className="text-xs text-[#a1a1aa]">
              Scheduled classes
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Ungraded Work</h3>
            <BookOpen className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{ungradedSubmissions}</div>
            <p className="text-xs text-[#a1a1aa]">
              Pending grading
            </p>
          </div>
        </div>

        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium text-[#a1a1aa]">Book Clubs</h3>
            <Users className="h-4 w-4 text-[#a1a1aa]" />
          </div>
          <div className="pt-2">
            <div className="text-2xl font-bold text-white">{totalBookClubs}</div>
            <p className="text-xs text-[#a1a1aa]">
              Active communities
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
        <div className="p-6 border-b border-[#2a2a2a]">
          <h3 className="text-lg font-medium text-white">Recent Activity</h3>
        </div>
        <div className="p-6">
          {recentApprovals.length > 0 || recentUserRegistrations.length > 0 ? (
            <div className="space-y-4">
              {/* Recent Teacher Approvals */}
              {recentApprovals.map((approval: ApprovalLog) => (
                <div key={`approval-${approval.id}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-[#10b981]/20 flex items-center justify-center">
                      <CheckCircle className="h-4 w-4 text-[#10b981]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        Teacher Approved: {approval.user?.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-[#a1a1aa]">
                        {approval.user?.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-[#a1a1aa]">
                    {new Date(approval.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}

              {/* Recent User Registrations */}
              {recentUserRegistrations.map((user) => (
                <div key={`registration-${user.id}`} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="h-8 w-8 rounded-full bg-[#4f46e5]/20 flex items-center justify-center">
                      <Users className="h-4 w-4 text-[#4f46e5]" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none text-white">
                        New {user.role.toLowerCase()}: {user.name || 'Unknown User'}
                      </p>
                      <p className="text-sm text-[#a1a1aa]">
                        {user.email}
                      </p>
                    </div>
                  </div>
                  <div className="text-sm text-[#a1a1aa]">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <Users className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
              <p className="text-[#a1a1aa]">No recent activity</p>
              <p className="text-sm text-[#6b7280] mt-1">Activity will appear here as users register and get approved!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
