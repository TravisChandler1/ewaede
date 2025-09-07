'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
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
  Eye,
  CheckCircle,
  AlertCircle,
  Play
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth-utils';
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
  meetingUrl?: string;
  description?: string;
}

interface Course {
  id: string;
  title: string;
  enrolledStudents: number;
  completionRate: number;
  lastActivity: string;
}

interface Notification {
  id: string;
  type: 'session_reminder' | 'student_message' | 'course_update' | 'system';
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
}

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

export default function EnhancedTeacherDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSessionScheduler, setShowSessionScheduler] = useState(false);

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
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser || currentUser.role !== 'TEACHER') {
          router.push('/auth/signin');
          return;
        }
        setUser(currentUser);
        await loadDashboardData();
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [router]);

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

      // Load notifications
      const notificationsResponse = await fetch('/api/teacher/notifications');
      if (notificationsResponse.ok) {
        const notificationsData = await notificationsResponse.json();
        setNotifications(notificationsData.notifications || []);
        setUnreadNotifications(notificationsData.notifications?.filter((n: Notification) => !n.isRead).length || 0);
      }

      // Load messages
      const messagesResponse = await fetch('/api/teacher/messages?limit=5');
      if (messagesResponse.ok) {
        const messagesData = await messagesResponse.json();
        setMessages(messagesData.messages || []);
      }
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
  };

  const handleSessionCreated = (session: Session) => {
    setUpcomingSessions(prev => [session, ...prev]);
    setStats(prev => ({ ...prev, upcomingSessions: prev.upcomingSessions + 1 }));
    setShowSessionScheduler(false);
  };

  const markNotificationAsRead = async (notificationId: string) => {
    try {
      await fetch(`/api/teacher/notifications/${notificationId}/read`, {
        method: 'POST',
      });
      setNotifications(prev =>
        prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
      );
      setUnreadNotifications(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const startLiveSession = async (sessionId: string) => {
    try {
      const response = await fetch(`/api/teacher/sessions/${sessionId}/start`, {
        method: 'POST',
      });

      if (response.ok) {
        setUpcomingSessions(prev =>
          prev.map(s => s.id === sessionId ? { ...s, status: 'ongoing' as const } : s)
        );
        // Open meeting URL in new tab
        const session = upcomingSessions.find(s => s.id === sessionId);
        if (session?.meetingUrl) {
          window.open(session.meetingUrl, '_blank');
        }
      }
    } catch (error) {
      console.error('Error starting session:', error);
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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-[#4f46e5]"></div>
      </div>
    );
  }

  if (!user) {
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
          <button type="button" className="text-[#a1a1aa] hover:text-white relative">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            {unreadNotifications > 0 && (
              <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 rounded-full text-xs flex items-center justify-center text-white">
                {unreadNotifications}
              </span>
            )}
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
                  { name: 'Notifications', icon: Bell, id: 'notifications' },
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
                { name: 'Notifications', icon: Bell, id: 'notifications' },
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
                  {item.id === 'notifications' && unreadNotifications > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                      {unreadNotifications}
                    </span>
                  )}
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
              Welcome back, {user?.name?.split(' ')[0] || 'Teacher'}! 👋
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
                  <button
                    onClick={() => setShowSessionScheduler(true)}
                    className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20"
                  >
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
                          <div className="flex items-center space-x-2">
                            {session.status === 'scheduled' && (
                              <button
                                onClick={() => startLiveSession(session.id)}
                                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                              >
                                <Play className="h-4 w-4 mr-1" />
                                Start
                              </button>
                            )}
                            <button className="text-[#4f46e5] hover:text-[#4338ca]">
                              <Eye className="h-5 w-5" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                      <p className="text-[#a1a1aa]">No upcoming sessions</p>
                      <p className="text-sm text-[#6b7280] mt-1">Schedule your first session to get started!</p>
                      <button
                        onClick={() => setShowSessionScheduler(true)}
                        className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#4f46e5] hover:bg-[#4338ca]"
                      >
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
                  <button
                    onClick={() => setShowSessionScheduler(true)}
                    className="w-full flex items-center justify-center px-4 py-2.5 border border-[#4f46e5]/30 rounded-lg shadow-sm text-sm font-medium text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Schedule Session
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-[#374151] rounded-lg shadow-sm text-sm font-medium text-white bg-[#2a2a2a] hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Message Students
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    <Video className="h-4 w-4 mr-2" />
                    Start Live Session
                  </button>
                </div>
              </div>

              {/* Recent Notifications */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a] flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Notifications</h3>
                  <span className="text-sm text-[#a1a1aa]">{unreadNotifications} unread</span>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {notifications.length > 0 ? (
                    notifications.slice(0, 5).map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150 ${
                          !notification.isRead ? 'border-l-4 border-[#4f46e5]' : ''
                        }`}
                      >
                        <div className="flex items-start">
                          <div className="flex-shrink-0">
                            {notification.type === 'session_reminder' && <Clock className="h-5 w-5 text-blue-500" />}
                            {notification.type === 'student_message' && <MessageSquare className="h-5 w-5 text-green-500" />}
                            {notification.type === 'course_update' && <BookOpen className="h-5 w-5 text-purple-500" />}
                            {notification.type === 'system' && <AlertCircle className="h-5 w-5 text-yellow-500" />}
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-white">{notification.title}</p>
                            <p className="text-sm text-[#a1a1aa] mt-1">{notification.message}</p>
                            <p className="text-xs text-[#6b7280] mt-1">
                              {new Date(notification.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <button
                              onClick={() => markNotificationAsRead(notification.id)}
                              className="text-[#4f46e5] hover:text-[#4338ca] ml-2"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Bell className="h-8 w-8 text-[#a1a1aa] mx-auto mb-2" />
                      <p className="text-[#a1a1aa] text-sm">No notifications</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Messages */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                  <h3 className="text-lg font-medium text-white">Recent Messages</h3>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {messages.length > 0 ? (
                    messages.map((message) => (
                      <div key={message.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-8 w-8 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                            <span className="text-sm font-medium text-white">
                              {message.senderName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-3 flex-1">
                            <p className="text-sm font-medium text-white">{message.senderName}</p>
                            <p className="text-sm text-[#a1a1aa] mt-1">{message.subject}</p>
                            <p className="text-xs text-[#6b7280] mt-1">
                              {new Date(message.createdAt).toLocaleString()}
                            </p>
                          </div>
                          {!message.isRead && (
                            <div className="flex-shrink-0">
                              <div className="h-2 w-2 bg-[#4f46e5] rounded-full"></div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <MessageSquare className="h-8 w-8 text-[#a1a1aa] mx-auto mb-2" />
                      <p className="text-[#a1a1aa] text-sm">No recent messages</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Session Scheduler Modal */}
      {showSessionScheduler && (
        <SessionScheduler
          onSessionCreated={handleSessionCreated}
          onClose={() => setShowSessionScheduler(false)}
        />
      )}
    </div>
  );
}