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
  User
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
        return;
      }
      const data = await response.json();
      setLiveSessions(data.live || []);
      setScheduledSessions(data.scheduled || []);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setLiveSessions([]);
      setScheduledSessions([]);
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
            <h2 className="text-lg font-medium text-[#4f46e5]">Welcome back, {session?.user?.name || 'Student'}!</h2>
            <h1 className="text-2xl font-bold text-white">Student Dashboard</h1>
            <p className="text-[#a1a1aa] mt-1">Track your progress and continue learning Yoruba.</p>
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
              onClick={() => signOut({ callbackUrl: '/auth/signin' })}
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
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                            <Calendar className="h-5 w-5 text-[#4f46e5]" />
                          </div>
                          <div className="ml-4">
                            <p className="text-sm font-medium text-white">{session.title}</p>
                            <p className="text-sm text-[#a1a1aa]">{new Date(session.startTime).toLocaleString()}</p>
                            <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30">
                              {session.level}
                            </span>
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
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#ef4444] flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-sm font-medium text-white">{session.title}</h4>
                                  <p className="text-sm text-[#a1a1aa]">{session.courseTitle}</p>
                                  <p className="text-sm text-[#a1a1aa]">Instructor: {session.instructorName}</p>
                                  <p className="text-sm text-[#a1a1aa]">Duration: {session.duration} minutes</p>
                                  <div className="flex items-center mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#ef4444]/20 text-[#ef4444] border border-[#ef4444]/30">
                                      LIVE NOW
                                    </span>
                                    <span className="ml-2 text-xs text-[#a1a1aa]">
                                      {session.currentAttendees}/{session.maxAttendees} attendees
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                {session.meetingUrl && (
                                  <button className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-[#ef4444] hover:bg-[#dc2626]">
                                    Join Live
                                  </button>
                                )}
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
                              <div className="flex items-start">
                                <div className="flex-shrink-0 h-12 w-12 rounded-full bg-[#4f46e5] flex items-center justify-center">
                                  <Calendar className="h-6 w-6 text-white" />
                                </div>
                                <div className="ml-4">
                                  <h4 className="text-sm font-medium text-white">{session.title}</h4>
                                  <p className="text-sm text-[#a1a1aa]">{session.courseTitle}</p>
                                  <p className="text-sm text-[#a1a1aa]">Instructor: {session.instructorName}</p>
                                  <p className="text-sm text-[#a1a1aa]">Starts: {new Date(session.startTime).toLocaleString()}</p>
                                  <p className="text-sm text-[#a1a1aa]">Duration: {session.duration} minutes</p>
                                  <div className="flex items-center mt-2">
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30">
                                      {session.level}
                                    </span>
                                    <span className="ml-2 text-xs text-[#a1a1aa]">
                                      {session.currentAttendees}/{session.maxAttendees} enrolled
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <div className="ml-4">
                                <button className="inline-flex items-center px-3 py-1.5 border border-[#4f46e5]/30 text-xs font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20">
                                  Set Reminder
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
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-[#4f46e5]" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-white">{session.title}</p>
                          <p className="text-sm text-[#a1a1aa]">{new Date(session.startTime).toLocaleString()}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30 mt-1">
                            {session.level}
                          </span>
                        </div>
                        <button className="ml-auto text-[#4f46e5] hover:text-[#4338ca]">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
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
    </div>
  );
}
