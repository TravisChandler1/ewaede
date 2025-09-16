'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
import {
  BookOpen,
  Clock,
  Award,
  BarChart2,
  Calendar,
  ChevronRight,
  Bell,
  Search,
  LogOut,
  MessageSquare,
  Home,
  User,
  Users,
  Play
} from 'lucide-react';
import { Loading } from '@/components/ui/loading';
import { CourseCard } from '@/components/dashboard/CourseCard';
import NotificationCenter from '@/components/student/NotificationCenter';
import StudentMessageModal from '@/components/student/StudentMessageModal';
import DashboardBottomTabs from '@/components/student/DashboardBottomTabs';

// Define interfaces for our data types
interface StatItem {
  name: string;
  value: string;
  icon: React.ReactNode;
  change: string;
}

interface Course {
  id: string;
  title: string;
  description?: string;
  instructor: {
    name: string;
    email?: string;
  };
  progress: number;
  nextLesson?: string;
  thumbnail?: string;
  level: string;
  duration: number;
  _count: {
    enrollments: number;
  };
  key?: string;
}

interface StatsResponse {
  activeCourses: number;
  hoursThisWeek: number;
  currentStreak: number;
  overallProgress: number;
  totalLessons: number;
  completedLessons: number;
  enrolledCourses: number;
}

interface CourseResponse {
  id: string;
  title: string;
  description?: string;
  thumbnail?: string | null;
  level: string;
  duration: number;
  instructor?: {
    name: string;
    email?: string;
  } | null;
  progress: number;
  nextLesson?: string;
  _count: {
    enrollments: number;
  };
}

interface Stats {
  activeCourses: number;
  hoursThisWeek: number;
  currentStreak: number;
  overallProgress: number;
}

interface Activity {
  id: number;
  text: string;
  time: string;
}

interface Session {
  id: string;
  title: string;
  description: string;
  courseTitle: string;
  instructorName: string;
  instructorEmail?: string;
  startTime: string;
  endTime: string;
  duration: number;
  level: string;
  maxAttendees: number;
  currentAttendees: number;
  meetingUrl?: string;
  isLive: boolean;
  status: string;
  category?: string; // Added for UI categorization
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  recipientId: string;
  senderName: string;
  senderEmail: string;
  senderRole: string;
  recipientName?: string;
  recipientEmail?: string;
  recipientRole?: string;
  isRead: boolean;
  createdAt: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMessages, setShowMessages] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
  const [stats, setStats] = useState<Stats>({
    activeCourses: 0,
    hoursThisWeek: 0,
    currentStreak: 0,
    overallProgress: 0,
  });
  const [messages, setMessages] = useState<Message[]>([]);
  const [liveSessions, setLiveSessions] = useState<Session[]>([]);
  const [scheduledSessions, setScheduledSessions] = useState<Session[]>([]);

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/students/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }
      const responseData = await response.json();
      const data: CourseResponse[] = responseData.courses || [];
      setCourses(data.map(course => ({
        id: course.id,
        title: course.title,
        instructor: course.instructor || { name: 'Unknown Instructor' },
        progress: course.progress || 0,
        nextLesson: course.nextLesson,
        thumbnail: course.thumbnail || undefined,
        level: course.level || 'Beginner',
        duration: course.duration || 0,
        _count: {
          enrollments: course._count?.enrollments || 0
        }
      })));
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  const fetchDashboardStats = async () => {
    try {
      const response = await fetch('/api/students/stats');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard stats');
      }
      const data: StatsResponse = await response.json();
      setStats({
        activeCourses: data.activeCourses || 0,
        hoursThisWeek: data.hoursThisWeek || 0,
        currentStreak: data.currentStreak || 0,
        overallProgress: data.overallProgress || 0,
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
      setStats({
        activeCourses: 0,
        hoursThisWeek: 0,
        currentStreak: 0,
        overallProgress: 0,
      });
    }
  };

  useEffect(() => {
    if (status === 'loading') return;

    if (!session?.user) {
      router.push('/auth/signin');
      return;
    }

    const loadData = async () => {
      await Promise.all([
        fetchEnrolledCourses(),
        fetchDashboardStats(),
        fetchRecentActivities(),
        fetchUpcomingSessions(),
        fetchMessages()
      ]);
      setIsLoading(false);
    };

    loadData();
  }, [session, status, router]);

  const statsList: StatItem[] = [
    {
      name: 'Active Courses',
      value: stats?.activeCourses?.toString() || '0',
      icon: <BookOpen className="h-6 w-6 text-[#4f46e5]" />,
      change: 'Currently enrolled',
    },
    {
      name: 'Hours This Week',
      value: Math.round((stats?.hoursThisWeek || 0) * 10) / 10 + 'h',
      icon: <Clock className="h-6 w-6 text-[#10b981]" />,
      change: 'This week',
    },
    {
      name: 'Current Streak',
      value: stats?.currentStreak?.toString() || '0',
      icon: <Award className="h-6 w-6 text-[#f59e0b]" />,
      change: 'Day streak',
    },
    {
      name: 'Overall Progress',
      value: `${stats?.overallProgress || 0}%`,
      icon: <BarChart2 className="h-6 w-6 text-[#4f46e5]" />,
      change: 'Average completion',
    }
  ];

  // Fetch recent activities from database
  const [recentActivities, setRecentActivities] = useState<Activity[]>([]);
  const [upcomingSessions, setUpcomingSessions] = useState<Session[]>([]);

  const fetchRecentActivities = async () => {
    try {
      const response = await fetch('/api/students/activities');
      if (!response.ok) {
        // If API doesn't exist yet, show empty state
        setRecentActivities([]);
        return;
      }
      const data = await response.json();
      setRecentActivities(data.activities || []);
    } catch (error) {
      console.error('Error fetching activities:', error);
      setRecentActivities([]);
    }
  };

  const fetchUpcomingSessions = async () => {
    try {
      const response = await fetch('/api/students/sessions');
      if (!response.ok) {
        // If API doesn't exist yet, show empty state
        setLiveSessions([]);
        setScheduledSessions([]);
        setUpcomingSessions([]);
        return;
      }
      const data = await response.json();
      setLiveSessions(data.live || []);
      setScheduledSessions(data.scheduled || []);
      setUpcomingSessions(data.scheduled || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLiveSessions([]);
      setScheduledSessions([]);
      setUpcomingSessions([]);
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await fetch('/api/student/messages');
      if (!response.ok) {
        setMessages([]);
        return;
      }
      const data = await response.json();
      setMessages(data.messages || []);
    } catch (error) {
      console.error('Error fetching messages:', error);
      setMessages([]);
    }
  };

  if (status === 'loading' || isLoading) {
    return <Loading />;
  }

  if (!session?.user) {
    return null;
  }

  return (
    <div className="min-h-full bg-[#0f0f0f]">
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-medium text-[#4f46e5] font-['Dancing_Script']">
              Welcome back, <span className="text-[#f59e0b]">{(session?.user?.name || 'Student').split(' ')[0]}!</span>
            </h2>
          </div>
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => setActiveTab('overview')}
              className="text-[#a1a1aa] hover:text-white"
              title="Back to Overview"
            >
              <span className="sr-only">Back to Overview</span>
              <Home className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => setShowNotifications(true)}
              className="text-[#a1a1aa] hover:text-white"
            >
              <span className="sr-only">View notifications</span>
              <Bell className="h-6 w-6" />
            </button>
            <button
              type="button"
              onClick={() => setShowSignOutConfirm(true)}
              className="text-[#a1a1aa] hover:text-white"
            >
              <span className="sr-only">Sign out</span>
              <LogOut className="h-6 w-6" />
            </button>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#6b7280]" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-[#374151] rounded-lg leading-5 bg-[#0f0f0f] placeholder-[#6b7280] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] sm:text-sm"
                placeholder="Search courses..."
              />
            </div>
          </div>
        </div>
      </div>


      <div className="pt-0">
        <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsList.map((stat) => (
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
            {/* Courses Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-white">Continue Learning</h2>
                <button className="text-sm font-medium text-[#4f46e5] hover:text-[#4338ca]">
                  View all
                </button>
              </div>

              <div className="space-y-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Upcoming Sessions</h3>
                    <button className="text-sm font-medium text-[#4f46e5] hover:text-[#4338ca]">
                      View all
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {upcomingSessions.length > 0 ? (
                    upcomingSessions.map((session) => (
                      <div key={session.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start flex-1">
                            <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                              <Calendar className="h-6 w-6 text-[#4f46e5]" />
                            </div>
                            <div className="ml-4 flex-1">
                              <h4 className="text-base font-semibold text-white">{session.title}</h4>
                              <p className="text-sm text-[#a1a1aa] mt-1">{session.description}</p>
                              <div className="flex items-center mt-2 space-x-4">
                                <div className="flex items-center text-sm text-[#a1a1aa]">
                                  <Clock className="h-4 w-4 mr-1" />
                                  {new Date(session.startTime).toLocaleString()}
                                </div>
                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30">
                                  {session.level}
                                </span>
                              </div>
                              <div className="flex items-center mt-2 text-sm text-[#a1a1aa]">
                                <User className="h-4 w-4 mr-1" />
                                {session.instructorName}
                                <span className="mx-2">•</span>
                                {session.duration} min
                              </div>
                            </div>
                          </div>
                          <div className="ml-4 flex flex-col space-y-2">
                            {session.isLive && session.meetingUrl && (
                              <a
                                href={session.meetingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#ef4444] hover:bg-[#dc2626] transition-colors"
                              >
                                Join Live
                              </a>
                            )}
                            {!session.isLive && (
                              <button className="inline-flex items-center px-3 py-2 border border-[#4f46e5]/30 text-sm font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 transition-colors">
                                Set Reminder
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Calendar className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                      <p className="text-[#a1a1aa]">No upcoming sessions</p>
                      <p className="text-sm text-[#6b7280] mt-1">Check back later for scheduled classes!</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Sessions Tab */}
              {activeTab === 'sessions' && (
                <div className="space-y-6">
                  {/* Live Sessions */}
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#ef4444]/50 transition-all duration-300">
                    <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#ef4444] rounded-full animate-pulse mr-3"></div>
                        <h3 className="text-lg font-medium text-white">Live Sessions</h3>
                      </div>
                    </div>
                    <div className="divide-y divide-[#2a2a2a]">
                      {liveSessions.length > 0 ? (
                        liveSessions.map((session) => (
                          <div key={session.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start flex-1">
                                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-[#ef4444] flex items-center justify-center relative">
                                  <Calendar className="h-7 w-7 text-white" />
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full animate-ping"></div>
                                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#ef4444] rounded-full"></div>
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center mb-2">
                                    <h4 className="text-lg font-semibold text-white">{session.title}</h4>
                                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
                                      🔴 LIVE NOW
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#a1a1aa] mb-2">{session.description}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#a1a1aa]">
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-2" />
                                      {session.instructorName}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {session.duration} minutes
                                    </div>
                                    <div className="flex items-center">
                                      <BookOpen className="h-4 w-4 mr-2" />
                                      {session.courseTitle}
                                    </div>
                                    <div className="flex items-center">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30">
                                        {session.level}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center mt-3 text-sm text-[#a1a1aa]">
                                    <Users className="h-4 w-4 mr-2" />
                                    {session.currentAttendees}/{session.maxAttendees} attendees
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 flex flex-col space-y-2">
                                {session.meetingUrl && (
                                  <a
                                    href={session.meetingUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center px-4 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-[#ef4444] hover:bg-[#dc2626] transition-colors shadow-lg"
                                  >
                                    <Play className="h-4 w-4 mr-2" />
                                    Join Live Session
                                  </a>
                                )}
                                <button className="inline-flex items-center px-4 py-2 border border-[#ef4444]/30 text-sm font-medium rounded-md text-[#ef4444] bg-[#ef4444]/10 hover:bg-[#ef4444]/20 transition-colors">
                                  <Bell className="h-4 w-4 mr-2" />
                                  Get Notified
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Calendar className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                          <p className="text-[#a1a1aa]">No live sessions at the moment</p>
                          <p className="text-sm text-[#6b7280] mt-1">Check back later for live classes!</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Scheduled Sessions */}
                  <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                    <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                      <div className="flex items-center">
                        <div className="w-3 h-3 bg-[#4f46e5] rounded-full mr-3"></div>
                        <h3 className="text-lg font-medium text-white">Scheduled Sessions</h3>
                      </div>
                    </div>
                    <div className="divide-y divide-[#2a2a2a]">
                      {scheduledSessions.length > 0 ? (
                        scheduledSessions.map((session) => (
                          <div key={session.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                            <div className="flex items-start justify-between">
                              <div className="flex items-start flex-1">
                                <div className="flex-shrink-0 h-14 w-14 rounded-full bg-[#4f46e5] flex items-center justify-center">
                                  <Calendar className="h-7 w-7 text-white" />
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center mb-2">
                                    <h4 className="text-lg font-semibold text-white">{session.title}</h4>
                                    <span className="ml-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30">
                                      Scheduled
                                    </span>
                                  </div>
                                  <p className="text-sm text-[#a1a1aa] mb-2">{session.description}</p>
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-[#a1a1aa]">
                                    <div className="flex items-center">
                                      <User className="h-4 w-4 mr-2" />
                                      {session.instructorName}
                                    </div>
                                    <div className="flex items-center">
                                      <Clock className="h-4 w-4 mr-2" />
                                      {new Date(session.startTime).toLocaleString()}
                                    </div>
                                    <div className="flex items-center">
                                      <BookOpen className="h-4 w-4 mr-2" />
                                      {session.courseTitle}
                                    </div>
                                    <div className="flex items-center">
                                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/30">
                                        {session.level}
                                      </span>
                                    </div>
                                  </div>
                                  <div className="flex items-center justify-between mt-3">
                                    <div className="flex items-center text-sm text-[#a1a1aa]">
                                      <Users className="h-4 w-4 mr-2" />
                                      {session.currentAttendees}/{session.maxAttendees} enrolled
                                    </div>
                                    <div className="text-sm text-[#a1a1aa]">
                                      {session.duration} min
                                    </div>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4 flex flex-col space-y-2">
                                <button className="inline-flex items-center px-4 py-2 border border-[#4f46e5]/30 text-sm font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 transition-colors">
                                  <Bell className="h-4 w-4 mr-2" />
                                  Set Reminder
                                </button>
                                <button className="inline-flex items-center px-4 py-2 border border-[#10b981]/30 text-sm font-medium rounded-md text-[#10b981] bg-[#10b981]/10 hover:bg-[#10b981]/20 transition-colors">
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Add to Calendar
                                </button>
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <div className="p-8 text-center">
                          <Calendar className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                          <p className="text-[#a1a1aa]">No scheduled sessions</p>
                          <p className="text-sm text-[#6b7280] mt-1">Upcoming sessions will appear here!</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Messages Tab */}
              {activeTab === 'messages' && (
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                  <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a] flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Messages from Teachers</h3>
                    <button
                      onClick={() => setShowMessages(true)}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20"
                    >
                      <MessageSquare className="h-4 w-4 mr-1" />
                      New Message
                    </button>
                  </div>
                  <div className="divide-y divide-[#2a2a2a]">
                    {messages.length > 0 ? (
                      messages
                        .filter(message => message.senderRole === 'TEACHER') // Only show teacher messages
                        .map((message) => (
                          <div key={message.id} className={`p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150 ${!message.isRead ? 'bg-[#4f46e5]/5 border-l-4 border-[#4f46e5]' : ''}`}>
                            <div className="flex items-start justify-between">
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#4f46e5] flex items-center justify-center">
                                  <User className="h-5 w-5 text-white" />
                                </div>
                                <div className="ml-4 flex-1">
                                  <div className="flex items-center justify-between">
                                    <h4 className="text-sm font-medium text-white">{message.senderName}</h4>
                                    <span className="text-xs text-[#a1a1aa]">{new Date(message.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p className="text-sm text-[#a1a1aa] mt-1">{message.content}</p>
                                  {!message.isRead && (
                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#4f46e5] text-white mt-2">
                                      New
                                    </span>
                                  )}
                                </div>
                              </div>
                              <div className="ml-4 flex flex-col space-y-2">
                                <button className="inline-flex items-center px-2 py-1 border border-[#4f46e5]/30 text-xs font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20">
                                  Reply
                                </button>
                                {!message.isRead && (
                                  <button className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded-md text-[#a1a1aa] hover:text-white">
                                    Mark Read
                                  </button>
                                )}
                              </div>
                            </div>
                          </div>
                        ))
                    ) : (
                      <div className="p-8 text-center">
                        <MessageSquare className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                        <p className="text-[#a1a1aa]">No messages from teachers yet</p>
                        <p className="text-sm text-[#6b7280] mt-1">Your teachers will send you messages here!</p>
                        <button
                          onClick={() => setShowMessages(true)}
                          className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-[#4f46e5] hover:bg-[#4338ca]"
                        >
                          <MessageSquare className="h-4 w-4 mr-2" />
                          Send First Message
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Recent Activity */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-white">Recent Activity</h3>
                    <button className="text-sm font-medium text-[#4f46e5] hover:text-[#4338ca]">
                      View all
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div key={activity.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                        <div className="flex">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                            <Award className="h-5 w-5 text-[#4f46e5]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-white">{activity.text}</p>
                            <p className="text-sm text-[#a1a1aa]">{activity.time}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-8 text-center">
                      <Award className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                      <p className="text-[#a1a1aa]">No recent activity yet</p>
                      <p className="text-sm text-[#6b7280] mt-1">Start learning to see your progress here!</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                  <h3 className="text-lg font-medium text-white">Upcoming Sessions</h3>
                </div>
                <div className="divide-y divide-[#2a2a2a]">
                  {upcomingSessions.slice(0, 3).map((session) => (
                    <div key={session.id} className="p-3 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start flex-1">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-[#4f46e5]" />
                          </div>
                          <div className="ml-3 flex-1 min-w-0">
                            <p className="text-sm font-medium text-white truncate">{session.title}</p>
                            <p className="text-xs text-[#a1a1aa] mt-1">
                              {new Date(session.startTime).toLocaleDateString()} at {new Date(session.startTime).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </p>
                            <div className="flex items-center mt-2">
                              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30">
                                {session.level}
                              </span>
                              {session.isLive && (
                                <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
                                  LIVE
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <div className="ml-2 flex flex-col items-end space-y-1">
                          {session.isLive && session.meetingUrl ? (
                            <a
                              href={session.meetingUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center px-2 py-1 border border-transparent text-xs font-medium rounded text-white bg-[#ef4444] hover:bg-[#dc2626] transition-colors"
                            >
                              Join
                            </a>
                          ) : (
                            <button className="text-[#4f46e5] hover:text-[#4338ca] p-1">
                              <ChevronRight className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {upcomingSessions.length === 0 && (
                    <div className="p-4 text-center">
                      <Calendar className="h-8 w-8 text-[#a1a1aa] mx-auto mb-2" />
                      <p className="text-xs text-[#a1a1aa]">No upcoming sessions</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] shadow-lg overflow-hidden rounded-lg hover:border-[#4f46e5]/50 transition-all duration-300">
                <div className="px-4 py-5 sm:px-6 border-b border-[#2a2a2a]">
                  <h3 className="text-lg font-medium text-white">Quick Actions</h3>
                </div>
                <div className="p-4 space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    Join Live Session
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-[#374151] rounded-lg shadow-sm text-sm font-medium text-white bg-[#2a2a2a] hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    Browse Courses
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-[#4f46e5]/30 rounded-lg shadow-sm text-sm font-medium text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200">
                    View Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Notification Center */}
      <NotificationCenter
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />

      {/* Student Message Modal */}
      <StudentMessageModal
        isOpen={showMessages}
        onClose={() => setShowMessages(false)}
      />

      {/* Bottom Navigation */}
      <DashboardBottomTabs
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop with blur effect */}
            <div
              className="fixed inset-0 bg-black/60 transition-opacity"
              onClick={() => {
                console.log('Student backdrop clicked, closing modal');
                setShowSignOutConfirm(false);
              }}
            ></div>

            <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg">
              <div className="flex items-center mb-4">
                <LogOut className="h-6 w-6 text-[#f59e0b] mr-3" />
                <h3 className="text-lg font-medium text-white">Sign Out</h3>
              </div>

              <div className="mb-6">
                <p className="text-[#a1a1aa] text-sm">
                  Are you sure you want to sign out? You&apos;ll need to sign in again to access your account.
                </p>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setShowSignOutConfirm(false)}
                  className="px-4 py-2 border border-[#374151] rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a] transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={() => {
                    console.log('Student sign out clicked, calling signOut');
                    signOut({ callbackUrl: '/auth/signin' });
                  }}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#f59e0b] hover:bg-[#d97706] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#f59e0b] transition-colors"
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
