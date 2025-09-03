import { requireTeacher } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

export default async function TeacherDashboard() {
  const user = await requireTeacher();

  // Fetch real data from database
  const [
    totalStudents,
    activeCourses,
    upcomingSessionsCount,
    pendingAssignmentsCount,
    upcomingSessions,
    recentStudents
  ] = await Promise.all([
    // Total students across all teacher's courses
    prisma.enrollment.count({
      where: {
        course: {
          instructorId: user.id
        }
      }
    }),

    // Active courses taught by this teacher
    prisma.course.count({
      where: {
        instructorId: user.id,
        isPublished: true
      }
    }),

    // Upcoming sessions count
    prisma.session.count({
      where: {
        teacherId: user.id,
        startTime: {
          gte: new Date()
        }
      }
    }),

    // Pending assignments to grade
    prisma.assignmentSubmission.count({
      where: {
        assignment: {
          lesson: {
            module: {
              course: {
                instructorId: user.id
              }
            }
          }
        },
        gradedAt: null
      }
    }),

    // Upcoming sessions
    prisma.session.findMany({
      where: {
        teacherId: user.id,
        startTime: {
          gte: new Date()
        }
      },
      include: {
        course: true,
        _count: {
          select: { attendees: true }
        }
      },
      orderBy: {
        startTime: 'asc'
      },
      take: 3
    }),

    // Recent students
    prisma.enrollment.findMany({
      where: {
        course: {
          instructorId: user.id
        }
      },
      include: {
        user: {
          select: {
            name: true,
            email: true
          }
        }
      },
      orderBy: {
        enrolledAt: 'desc'
      },
      take: 4
    })
  ]);

  // Format the data for display
  const stats = [
    {
      name: 'Total Students',
      value: totalStudents.toString(),
      change: 'Across all courses',
      changeType: 'neutral' as const
    },
    {
      name: 'Active Courses',
      value: activeCourses.toString(),
      change: 'Currently teaching',
      changeType: 'neutral' as const
    },
    {
      name: 'Upcoming Sessions',
      value: upcomingSessionsCount.toString(),
      change: 'Scheduled classes',
      changeType: 'neutral' as const
    },
    {
      name: 'Pending Assignments',
      value: pendingAssignmentsCount.toString(),
      change: 'Need grading',
      changeType: 'neutral' as const
    },
  ];

  // Format upcoming sessions
  const formattedSessions = upcomingSessions.map(session => ({
    id: session.id,
    title: session.title,
    date: session.startTime.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric'
    }),
    time: `${session.startTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })} - ${session.endTime.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    })}`,
    students: session._count.attendees
  }));

  // Format recent students
  const formattedStudents = recentStudents.map(enrollment => ({
    id: enrollment.id,
    name: enrollment.user.name || 'Unknown Student',
    email: enrollment.user.email,
    joined: enrollment.enrolledAt.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    })
  }));

  return (
    <div className="space-y-6 bg-[#0f0f0f] min-h-screen p-6">
      <div>
        <h1 className="text-3xl font-bold text-white">Welcome, {user.name?.split(' ')[0] || 'Teacher'}!</h1>
        <p className="text-[#a1a1aa]">
          Here's an overview of your teaching activities.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h3 className="text-sm font-medium text-[#a1a1aa]">
                {stat.name}
              </h3>
              <div className="h-4 w-4 text-[#a1a1aa]">
                <span className="text-[#4f46e5]">📊</span>
              </div>
            </div>
            <div className="pt-2">
              <div className="text-2xl font-bold text-white">{stat.value}</div>
              <p className="text-xs text-[#a1a1aa]">
                {stat.change}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        {/* Upcoming Sessions */}
        <div className="col-span-4 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="p-6 border-b border-[#2a2a2a]">
            <h3 className="text-lg font-medium text-white">Upcoming Sessions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {formattedSessions.length > 0 ? (
                formattedSessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-white">{session.title}</h3>
                      <p className="text-sm text-[#a1a1aa]">
                        {session.date} · {session.time}
                      </p>
                      <p className="text-sm text-[#a1a1aa]">
                        {session.students} students registered
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="px-3 py-1 text-sm bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca]">
                        Start
                      </button>
                      <button className="px-3 py-1 text-sm border border-[#374151] text-white rounded-md hover:bg-[#374151]">
                        Details
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#a1a1aa]">No upcoming sessions scheduled</p>
                  <p className="text-sm text-[#6b7280] mt-1">Schedule your first class to get started!</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Recent Students */}
        <div className="col-span-3 bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
          <div className="p-6 border-b border-[#2a2a2a]">
            <h3 className="text-lg font-medium text-white">Recent Students</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {formattedStudents.length > 0 ? (
                formattedStudents.map((student) => (
                  <div key={student.id} className="flex items-center">
                    <div className="h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                      <span className="text-sm font-medium text-white">
                        {student.name.split(' ').map((n: string) => n[0]).join('').toUpperCase()}
                      </span>
                    </div>
                    <div className="ml-4 space-y-1">
                      <p className="text-sm font-medium leading-none text-white">{student.name}</p>
                      <p className="text-sm text-[#a1a1aa]">{student.email}</p>
                    </div>
                    <div className="ml-auto text-sm text-[#a1a1aa]">
                      {student.joined}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-[#a1a1aa]">No students enrolled yet</p>
                  <p className="text-sm text-[#6b7280] mt-1">Students will appear here once they enroll in your courses!</p>
                </div>
              )}
              {formattedStudents.length > 0 && (
                <button className="text-sm text-[#4f46e5] hover:text-[#4338ca] w-full text-left">
                  View all students
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Pending Assignments */}
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
        <div className="p-6 border-b border-[#2a2a2a]">
          <h3 className="text-lg font-medium text-white">Pending Assignments to Grade</h3>
        </div>
        <div className="p-6">
          {pendingAssignmentsCount > 0 ? (
            <div className="space-y-4">
              {/* We'll show a summary since we don't have detailed assignment data yet */}
              <div className="text-center py-8">
                <p className="text-white font-medium">{pendingAssignmentsCount} assignments pending</p>
                <p className="text-sm text-[#a1a1aa] mt-1">Click below to start grading</p>
                <button className="mt-4 px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca]">
                  View Assignments
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-[#a1a1aa]">No pending assignments</p>
              <p className="text-sm text-[#6b7280] mt-1">All caught up! 🎉</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}