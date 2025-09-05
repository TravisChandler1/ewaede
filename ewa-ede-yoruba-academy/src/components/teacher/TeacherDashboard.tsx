'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Calendar,
  Clock,
  Users,
  BookOpen,
  Plus,
  Video,
  MessageSquare,
  BarChart3,
  Settings,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search,
  Edit,
  Trash2,
  Eye,
  Send,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  StopCircle
} from 'lucide-react';
import SessionScheduler from './SessionScheduler';
import type { AuthUser } from '@/auth.config';

interface TeacherStats {
  totalStudents: number;
  activeCourses: number;
  upcomingSessions: number;
  totalSessions: number;
  averageRating: number;
  monthlyRevenue: number;
}

interface Session {
  id: string;
  title: string;
  courseTitle: string;
  startTime: string;
  endTime: string;
  attendees: number;
  maxAttendees: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
}

interface Course {
  id: string;
  title: string;
  enrolledStudents: number;
  completionRate: number;
  lastActivity: string;
}

export default function TeacherDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  const [stats, setStats] = useState<TeacherStats>({
    totalStudents: 0,
    activeCourses: 0,
    upcomingSessions: 0,
    totalSessions: 0,
    averageRating: 0,
    monthlyRevenue: 0,
  });

  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user || session.user.role !== 'TEACHER') {
      router.push('/auth/signin');
      return;
    }

    loadDashboardData();
    setIsLoading(false);
  }, [session, status, router]);

  const loadDashboardData = async () => {
    try {
      // Load teacher statistics
      const statsResponse = await fetch('/api/teacher/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load upcoming sessions
      const sessionsResponse = await fetch('/api/teacher/sessions?status=upcoming&limit=5');
      if (sessionsResponse.ok) {
        const sessionsData = await sessionsResponse.json();
        setUpcomingSessions(sessionsData.sessions || []);
      }

      // Load courses
      const coursesResponse = await fetch('/api/teacher/courses');
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData.courses || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const statsCards = [
    {
      name: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: <Users className="h-6 w-6 text-blue-500" />,
      change: 'Across all courses',
    },
    {
      name: 'Active Courses',
      value: stats.activeCourses.toString(),
      icon: <BookOpen className="h-6 w-6 text-green-500" />,
      change: 'Currently teaching',
    },
    {
      name: 'Upcoming Sessions',
      value: stats.upcomingSessions.toString(),
      icon: <Calendar className="h-6 w-6 text-purple-500" />,
      change: 'This week',
    },
    {
      name: 'Average Rating',
      value: stats.averageRating.toFixed(1),
      icon: <BarChart3 className="h-6 w-6 text-yellow-500" />,
      change: 'Student feedback',
    },
  ];

  if (isLoading || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4f46e5]"></div>
      </div>
    );
  }

  if (!session?.user || session.user.role !== 'TEACHER') {
    return null;
  }

  return (
    <div className="min-h-full bg-[#0f0f0f]">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-3 flex items-center justify-between">
        <button
          type="button"
          className="text-[#a1a1aa] hover:text-white"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>

        <h1 className="text-xl font-bold text-white">Teacher Dashboard</h1>

        <div className="flex items-center space-x-4">
          <button type="button" className="text-[#a1a1aa] hover:text-white">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-[#1a1a1a] border-r border-[#2a2a2a]">
            <div className="flex items-center justify-between h-16 px-4 border-b border-[#2a2a2a]">
              <h2 className="text-xl font-semibold text-white">Menu</h2>
              <button
                type="button"
                className="text-[#a1a1aa] hover:text-white"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Sidebar content */}
            <nav className="mt-8 px-4">
              <div className="space-y-2">
                {[
                  { name: 'Overview', icon: BarChart3, id: 'overview' },
                  { name: 'My Courses', icon: BookOpen, id: 'courses' },
                  { name: 'Sessions', icon: Calendar, id: 'sessions' },
                  { name: 'Students', icon: Users, id: 'students' },
                  { name: 'Messages', icon: MessageSquare, id: 'messages' },
                  { name: 'Settings', icon: Settings, id: 'settings' },
                ].map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setSidebarOpen(false);
                    }}
                    className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                      activeTab === item.id
                        ? 'bg-[#4f46e5] text-white'
                        : 'text-[#a1a1aa] hover:bg-[#2a2a2a] hover:text-white'
                    }`}
                  >
                    <item.icon className="h-5 w-5 mr-3" />
                    {item.name}
                  </button>
                ))}
              </div>
            </nav>
          </div>
        </div>
      )}

      {/* Desktop sidebar */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:w-64 lg:block">
        <div className="flex flex-col h-full bg-[#1a1a1a] border-r border-[#2a2a2a]">
          <div className="flex items-center h-16 px-6 border-b border-[#2a2a2a]">
            <h1 className="text-xl font-bold text-white">Teacher Portal</h1>
          </div>

          <nav className="flex-1 mt-8 px-4">
            <div className="space-y-2">
              {[
                { name: 'Overview', icon: BarChart3, id: 'overview' },
                { name: 'My Courses', icon: BookOpen, id: 'courses' },
                { name: 'Sessions', icon: Calendar, id: 'sessions' },
                { name: 'Students', icon: Users, id: 'students' },
                { name: 'Messages', icon: MessageSquare, id: 'messages' },
                { name: 'Settings', icon: Settings, id: 'settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-[#4f46e5] text-white'
                      : 'text-[#a1a1aa] hover:bg-[#2a2a2a] hover:text-white'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </button>
              ))}
            </div>
          </nav>
        </div>
      </div>

      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
          {/* Header */}
          <div className="pb-6 border-b border-[#2a2a2a]">
            <h1 className="text-2xl font-bold text-white">
              Welcome back, {session?.user?.name?.split(' ')[0] || 'Teacher'}! 👋
            </h1>
            <p className="mt-2 text-[#a1a1aa]">
              Manage your courses, schedule sessions, and connect with students.
            </p>
          </div>

          {/* Stats Grid */}
          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsCards.map((stat) => (
              <div key={stat.name} className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg shadow-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-[#a1a1aa]">{stat.name}</p>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-white">{stat.value}</p>
                      {stat.change && (
                        <span className="ml-2 text-sm text-[#10b981]">{stat.change}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-[#2a2a2a]">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column */}
            <div className="lg:col-span-2 space-y-6">
              {/* Upcoming Sessions */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a] flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Upcoming Sessions</h3>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20">
                    <Plus className="h-4 w-4 mr-1" />
                    Schedule New
                  </button>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => (
                      <div key={session.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start">
                            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                              <Video className="h-5 w-5 text-[#4f46e5]" />
                            </div>
                            <div className="ml-4">
                              <p className="text-sm font-medium text-white">{session.title}</p>
                              <p className="text-sm text-[#a1a1aa]">{session.courseTitle}</p>
                              <div className="flex items-center mt-1 text-sm text-[#a1a1aa]">
                                <Clock className="h-4 w-4 mr-1" />
                                <span>{new Date(session.startTime).toLocaleString()}</span>
                              </div>
                              <div className="flex items-center mt-1">
                                <Users className="h-4 w-4 mr-1 text-[#a1a1aa]" />
                                <span className="text-sm text-[#a1a1aa]">
                                  {session.attendees}/{session.maxAttendees} attendees
                                </span>
                                <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  session.status === 'scheduled' ? 'bg-blue-900/30 text-blue-400' :
                                  session.status === 'ongoing' ? 'bg-green-900/30 text-green-400' :
                                  'bg-gray-900/30 text-gray-400'
                                }`}>
                                  {session.status}
                                </span>
                              </div>
                            </div>
                          </div>
                          <button className="text-[#4f46e5] hover:text-[#4338ca]">
                            <ChevronRight className="h-5 w-5" />
                          </button>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                      <p className="text-[#a1a1aa]">No upcoming sessions</p>
                      <p className="text-sm text-[#6b7280] mt-1">Schedule your first session to get started!</p>
                      <button className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#4f46e5] hover:bg-[#4338ca]">
                        <Plus className="h-4 w-4 mr-2" />
                        Schedule Session
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* My Courses */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a] flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">My Courses</h3>
                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20">
                    <Plus className="h-4 w-4 mr-1" />
                    Create Course
                  </button>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {courses.map((course) => (
                    <div key={course.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h4 className="text-sm font-medium text-white">{course.title}</h4>
                          <div className="flex items-center mt-1 text-sm text-[#a1a1aa]">
                            <Users className="h-4 w-4 mr-1" />
                            <span>{course.enrolledStudents} students</span>
                            <span className="mx-2">•</span>
                            <span>{course.completionRate}% completion</span>
                          </div>
                          <p className="text-xs text-[#6b7280] mt-1">
                            Last activity: {course.lastActivity}
                          </p>
                        </div>
                        <button className="text-[#4f46e5] hover:text-[#4338ca]">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                  <h3 className="text-lg font-medium text-white">Quick Actions</h3>
                </div>
                <div className="p-4 space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    <Video className="h-4 w-4 mr-2" />
                    Start Live Session
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-[#374151] rounded-lg shadow-sm text-sm font-medium text-white bg-[#2a2a2a] hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Students
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-[#4f46e5]/30 rounded-lg shadow-sm text-sm font-medium text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </button>
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                  <h3 className="text-lg font-medium text-white">Recent Messages</h3>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {/* Placeholder for messages */}
                  <div className="p-4 text-center">
                    <MessageSquare className="h-8 w-8 text-[#a1a1aa] mx-auto mb-2" />
                    <p className="text-[#a1a1aa] text-sm">No recent messages</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}