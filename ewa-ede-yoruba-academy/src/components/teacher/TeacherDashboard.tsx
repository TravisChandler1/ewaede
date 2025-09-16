'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession, signOut } from 'next-auth/react';
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
  Bell,
  LogOut,
  Home
} from 'lucide-react';
import SessionScheduler from './SessionScheduler';
import StudentSelector from './StudentSelector';
import StudentList from './StudentList';
import TeacherMessageModal from './TeacherMessageModal';
import BulkMessageModal from './BulkMessageModal';
import ChangePasswordModal from './ChangePasswordModal';
import DeleteAccountModal from './DeleteAccountModal';
import LiveSessionModal, { SessionData } from './LiveSessionModal';

interface Session {
  id: string;
  title: string;
  courseTitle: string;
  startTime: string;
  endTime: string;
  attendees: number;
  maxAttendees: number;
  status: 'completed' | 'scheduled' | 'ongoing' | 'cancelled';
  meetingUrl?: string;
  description?: string;
}

interface TeacherStats {
  totalStudents: number;
  activeCourses: number;
  upcomingSessions: number;
  totalSessions: number;
  averageRating: number;
  monthlyRevenue: number;
}

interface Course {
  id: string;
  title: string;
  enrolledStudents: number;
  completionRate: number;
  lastActivity: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
  courseTitle?: string;
  level?: string;
}


export default function TeacherDashboard() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [showSessionScheduler, setShowSessionScheduler] = useState(false);
  const [showStudentSelector, setShowStudentSelector] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [showChatModal, setShowChatModal] = useState(false);
  const [showLiveSessionModal, setShowLiveSessionModal] = useState(false);
  const [showBulkMessageModal, setShowBulkMessageModal] = useState(false);
  const [selectedStudentsForBulk, setSelectedStudentsForBulk] = useState<Student[]>([]);
  const [studentSelectorMode, setStudentSelectorMode] = useState<'single' | 'bulk'>('single');
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showSignOutConfirm, setShowSignOutConfirm] = useState(false);
      const [userProfile, setUserProfile] = useState<{ id: string; name: string; email: string; createdAt: string; teacherProfile?: { bio?: string } } | null>(null);
  const [profileFormData, setProfileFormData] = useState({
    name: '',
    email: '',
    bio: '',
  });

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

  const handleSessionCreated = () => {
    // Refresh the sessions list
    loadDashboardData();
    setShowSessionScheduler(false);
  };

  const handleStudentSelect = (student: Student) => {
    setSelectedStudent(student);
    setShowStudentSelector(false);
    setShowChatModal(true);
  };

  const handleBulkStudentSelect = (students: Student[]) => {
    setSelectedStudentsForBulk(students);
    setShowStudentSelector(false);
    setShowBulkMessageModal(true);
  };

  const handleSendBulkMessage = async (message: string, students: Student[]) => {
    try {
      // Send message to each student
      const promises = students.map(student =>
        fetch('/api/teacher/messages', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            receiverId: student.id,
            content: message,
          }),
        })
      );

      const results = await Promise.all(promises);
      const failures = results.filter(result => !result.ok);

      if (failures.length > 0) {
        throw new Error(`${failures.length} messages failed to send`);
      }

      alert(`Bulk message sent successfully to ${students.length} student${students.length !== 1 ? 's' : ''}!`);
      setShowBulkMessageModal(false);
      setSelectedStudentsForBulk([]);
    } catch (error) {
      console.error('Error sending bulk message:', error);
      throw error;
    }
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileFormData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update profile');
      }

      setUserProfile(data.user);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    }
  };

  const handlePasswordChanged = () => {
    alert('Password changed successfully! Please log in again with your new password.');
    // Sign out the user
    signOut({ callbackUrl: '/auth/signin' });
  };

  const handleAccountDeleted = () => {
    alert('Account deleted successfully.');
    // Sign out the user
    signOut({ callbackUrl: '/auth/signin' });
  };

  const handleStartLiveSession = () => {
    setShowLiveSessionModal(true);
  };

  const handleLiveSessionCreated = async (sessionData: SessionData) => {
    try {
      // Send session data to the backend
      const response = await fetch('/api/teacher/live-sessions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sessionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create live session');
      }

      const result = await response.json();

      // Close the modal
      setShowLiveSessionModal(false);

      // Show success message with notification count
      alert(`Live session "${sessionData.title}" created successfully! ${result.session.notifiedStudents} students have been notified.`);

      // Refresh the sessions list
      loadDashboardData();
    } catch (error) {
      console.error('Error creating live session:', error);
      alert(error instanceof Error ? error.message : 'Failed to create live session. Please try again.');
    }
  };

  const loadDashboardData = async (): Promise<void> => {
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

      // Load user profile
      const profileResponse = await fetch('/api/user/profile');
      if (profileResponse.ok) {
        const profileData = await profileResponse.json();
        setUserProfile(profileData.user);
        setProfileFormData({
          name: profileData.user.name || '',
          email: profileData.user.email || '',
          bio: profileData.user.teacherProfile?.bio || '',
        });
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
      {/* Header */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl md:text-2xl font-medium text-[#4f46e5] font-['Dancing_Script']">
              Welcome back, <span className="text-[#f59e0b]">{(session?.user?.name || 'Teacher').split(' ')[0]}!</span>
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
            <button type="button" className="text-[#a1a1aa] hover:text-white">
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
          </div>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="bg-[#1a1a1a] border-b border-[#2a2a2a] px-4 py-3">
        <nav className="flex items-center">
          <div className="relative flex items-center bg-[#0f0f0f] rounded-lg p-1 overflow-x-auto scrollbar-hide">
            {/* Active tab background indicator */}
            <div
              className="absolute top-1 left-1 h-8 bg-[#4f46e5] rounded-md transition-all duration-300 ease-in-out"
              style={{
                width: `${100 / 6}%`,
                transform: `translateX(${([
                  { id: 'overview', index: 0 },
                  { id: 'courses', index: 1 },
                  { id: 'sessions', index: 2 },
                  { id: 'students', index: 3 },
                  { id: 'messages', index: 4 },
                  { id: 'settings', index: 5 },
                ].find(item => item.id === activeTab)?.index ?? 0) * 100}%)`,
              }}
            />

            <div className="flex items-center min-w-max">
              {[
                { name: 'Overview', icon: BarChart3, id: 'overview' },
                { name: 'Courses', icon: BookOpen, id: 'courses' },
                { name: 'Sessions', icon: Calendar, id: 'sessions' },
                { name: 'Students', icon: Users, id: 'students' },
                { name: 'Messages', icon: MessageSquare, id: 'messages' },
                { name: 'Settings', icon: Settings, id: 'settings' },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`relative z-10 px-4 py-2 text-sm font-medium rounded-md transition-all duration-200 flex items-center whitespace-nowrap ${
                    activeTab === item.id
                      ? 'text-white'
                      : 'text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a]/50'
                  }`}
                >
                  <item.icon className="h-4 w-4 mr-2" />
                  {item.name}
                </button>
              ))}
            </div>
          </div>
        </nav>
      </div>

      {activeTab === 'overview' && (
        <div className="pt-0">
          <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">

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
                    <button
                      onClick={() => setActiveTab('courses')}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20"
                    >
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
                      onClick={handleStartLiveSession}
                      className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200"
                    >
                      <Video className="h-4 w-4 mr-2" />
                      Start Live Session
                    </button>
                    <button
                      onClick={() => setShowStudentSelector(true)}
                      className="w-full flex items-center justify-center px-4 py-2.5 border border-[#374151] rounded-lg shadow-sm text-sm font-medium text-white bg-[#2a2a2a] hover:bg-[#374151] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      Message Students
                    </button>
                    <button
                      onClick={() => setShowSessionScheduler(true)}
                      className="w-full flex items-center justify-center px-4 py-2.5 border border-[#4f46e5]/30 rounded-lg shadow-sm text-sm font-medium text-[#4f46e5] bg-[#4f46e5]/10 hover:bg-[#4f46e5]/20 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] transition-colors duration-200"
                    >
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
      )}

      {/* Tab-specific Content */}
      {activeTab === 'courses' && (
        <div className="pt-0">
          <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">My Courses</h2>
                <p className="text-[#a1a1aa] mt-1">Manage and create your courses</p>
              </div>
              <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca]">
                <Plus className="h-4 w-4 mr-2" />
                Create New Course
              </button>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {courses.map((course) => (
                <div key={course.id} className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/50 transition-all duration-300">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-white">{course.title}</h3>
                      <div className="mt-2 space-y-2">
                        <div className="flex items-center text-sm text-[#a1a1aa]">
                          <Users className="h-4 w-4 mr-2" />
                          <span>{course.enrolledStudents} students enrolled</span>
                        </div>
                        <div className="flex items-center text-sm text-[#a1a1aa]">
                          <BarChart3 className="h-4 w-4 mr-2" />
                          <span>{course.completionRate}% completion rate</span>
                        </div>
                        <div className="flex items-center text-sm text-[#a1a1aa]">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Last activity: {course.lastActivity}</span>
                        </div>
                      </div>
                    </div>
                    <button className="text-[#4f46e5] hover:text-[#4338ca]">
                      <ChevronRight className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="mt-4 flex space-x-2">
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-[#4f46e5] bg-[#4f46e5]/10 rounded-md hover:bg-[#4f46e5]/20">
                      Edit Course
                    </button>
                    <button className="flex-1 px-3 py-2 text-sm font-medium text-white bg-[#2a2a2a] rounded-md hover:bg-[#374151]">
                      View Students
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-12">
                <BookOpen className="h-16 w-16 text-[#a1a1aa] mx-auto mb-4" />
                <h3 className="text-lg font-medium text-white mb-2">No courses yet</h3>
                <p className="text-[#a1a1aa] mb-6">Create your first course to get started</p>
                <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca]">
                  <Plus className="h-4 w-4 mr-2" />
                  Create Your First Course
                </button>
              </div>
            )}
          </main>
        </div>
      )}

      {activeTab === 'sessions' && (
        <div className="pt-0">
          <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Session Management</h2>
                <p className="text-[#a1a1aa] mt-1">Schedule and manage your live sessions</p>
              </div>
              <button
                onClick={() => setShowSessionScheduler(true)}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca]"
              >
                <Plus className="h-4 w-4 mr-2" />
                Schedule Session
              </button>
            </div>

            <div className="grid gap-6">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Upcoming Sessions</h3>
                <div className="space-y-4">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="flex items-center justify-between p-4 bg-[#0f0f0f] rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-[#4f46e5]/20 flex items-center justify-center">
                          <Video className="h-6 w-6 text-[#4f46e5]" />
                        </div>
                        <div>
                          <h4 className="text-white font-medium">{session.title}</h4>
                          <p className="text-[#a1a1aa] text-sm">{session.courseTitle}</p>
                          <div className="flex items-center space-x-4 mt-1 text-sm text-[#a1a1aa]">
                            <span>{new Date(session.startTime).toLocaleString()}</span>
                            <span>{session.attendees}/{session.maxAttendees} attendees</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          session.status === 'scheduled' ? 'bg-blue-900/30 text-blue-400' :
                          session.status === 'ongoing' ? 'bg-green-900/30 text-green-400' :
                          'bg-gray-900/30 text-gray-400'
                        }`}>
                          {session.status}
                        </span>
                        <button className="text-[#4f46e5] hover:text-[#4338ca]">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {upcomingSessions.length === 0 && (
                  <div className="text-center py-8">
                    <Calendar className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                    <p className="text-[#a1a1aa]">No upcoming sessions</p>
                    <p className="text-sm text-[#6b7280] mt-1">Schedule your first session to get started</p>
                  </div>
                )}
              </div>

              <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Session Statistics</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.upcomingSessions}</div>
                    <div className="text-sm text-[#a1a1aa]">Upcoming</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.totalSessions}</div>
                    <div className="text-sm text-[#a1a1aa]">Total Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-white">{stats.averageRating.toFixed(1)}</div>
                    <div className="text-sm text-[#a1a1aa]">Avg Rating</div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {activeTab === 'students' && (
        <div className="pt-0">
          <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white">Student Management</h2>
                <p className="text-[#a1a1aa] mt-1">View and manage all registered students</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => setShowStudentSelector(true)}
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca]"
                >
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Message Students
                </button>
              </div>
            </div>

            <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-[#2a2a2a]">
                <h3 className="text-lg font-semibold text-white">All Registered Students</h3>
                <p className="text-sm text-[#a1a1aa] mt-1">Complete list of students in the system with their learning levels</p>
              </div>

              <StudentList onMessageStudent={handleStudentSelect} />
            </div>

            <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
                <div className="flex items-center">
                  <Users className="h-8 w-8 text-[#4f46e5]" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#a1a1aa]">Total Students</p>
                    <p className="text-2xl font-bold text-white">{stats.totalStudents}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
                <div className="flex items-center">
                  <BookOpen className="h-8 w-8 text-[#10b981]" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#a1a1aa]">Active Courses</p>
                    <p className="text-2xl font-bold text-white">{stats.activeCourses}</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
                <div className="flex items-center">
                  <MessageSquare className="h-8 w-8 text-[#f59e0b]" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#a1a1aa]">Messages Sent</p>
                    <p className="text-2xl font-bold text-white">0</p>
                  </div>
                </div>
              </div>

              <div className="bg-[#1a1a1a] border border-[#2a2a2a] p-6 rounded-lg">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-[#ef4444]" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-[#a1a1aa]">Avg Progress</p>
                    <p className="text-2xl font-bold text-white">0%</p>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {activeTab === 'messages' && (
        <div className="pt-0">
          <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Messages</h2>
              <p className="text-[#a1a1aa] mt-1">Communicate with your students</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Recent Conversations</h3>
                  <div className="space-y-4">
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                      <p className="text-[#a1a1aa]">No conversations yet</p>
                      <p className="text-sm text-[#6b7280] mt-1">Start messaging your students</p>
                    </div>
                  </div>
                </div>

              </div>

              <div className="space-y-6">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        setStudentSelectorMode('single');
                        setShowStudentSelector(true);
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                    >
                      <MessageSquare className="h-4 w-4 mr-2" />
                      New Message
                    </button>
                    <button
                      onClick={() => {
                        setStudentSelectorMode('bulk');
                        setShowStudentSelector(true);
                      }}
                      className="w-full flex items-center justify-center px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#374151] transition-colors"
                    >
                      <Users className="h-4 w-4 mr-2" />
                      Bulk Message
                    </button>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Message Statistics</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Sent Today</span>
                      <span className="text-white">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">This Week</span>
                      <span className="text-white">0</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Total Messages</span>
                      <span className="text-white">0</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {activeTab === 'settings' && (
        <div className="pt-0">
          <main className="py-6 px-4 sm:px-6 lg:px-8 bg-[#0f0f0f]">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Settings</h2>
              <p className="text-[#a1a1aa] mt-1">Manage your account and preferences</p>
            </div>

            <div className="grid gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Profile Settings</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Full Name</label>
                      <input
                        type="text"
                        value={profileFormData.name}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, name: e.target.value }))}
                        className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Email</label>
                      <input
                        type="email"
                        value={profileFormData.email}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, email: e.target.value }))}
                        className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-white mb-1">Bio</label>
                      <textarea
                        rows={3}
                        value={profileFormData.bio}
                        onChange={(e) => setProfileFormData(prev => ({ ...prev, bio: e.target.value }))}
                        className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                        placeholder="Tell students about yourself..."
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Notification Preferences</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-white">Email notifications</span>
                      <input type="checkbox" defaultChecked className="rounded bg-[#0f0f0f] border-[#374151] text-[#4f46e5] focus:ring-[#4f46e5]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">New student enrollments</span>
                      <input type="checkbox" defaultChecked className="rounded bg-[#0f0f0f] border-[#374151] text-[#4f46e5] focus:ring-[#4f46e5]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Session reminders</span>
                      <input type="checkbox" defaultChecked className="rounded bg-[#0f0f0f] border-[#374151] text-[#4f46e5] focus:ring-[#4f46e5]" />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-white">Assignment submissions</span>
                      <input type="checkbox" defaultChecked className="rounded bg-[#0f0f0f] border-[#374151] text-[#4f46e5] focus:ring-[#4f46e5]" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={handleSaveProfile}
                      className="w-full px-4 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                    >
                      Save Changes
                    </button>
                    <button
                      onClick={() => setShowChangePasswordModal(true)}
                      className="w-full px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#374151] transition-colors"
                    >
                      Change Password
                    </button>
                    <button
                      onClick={() => setShowDeleteAccountModal(true)}
                      className="w-full px-4 py-2 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] transition-colors"
                    >
                      Delete Account
                    </button>
                  </div>
                </div>

                <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">Account Information</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Account Type</span>
                      <span className="text-white">Teacher</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Member Since</span>
                      <span className="text-white">
                        {userProfile ? new Date(userProfile.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short'
                        }) : 'Loading...'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Courses Created</span>
                      <span className="text-white">{stats.activeCourses}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-[#a1a1aa]">Total Students</span>
                      <span className="text-white">{stats.totalStudents}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      )}

      {/* Session Scheduler Modal */}
      {showSessionScheduler && (
        <SessionScheduler
          onSessionCreated={handleSessionCreated}
          onClose={() => setShowSessionScheduler(false)}
        />
      )}

      {/* Student Selector Modal */}
      {showStudentSelector && (
        <StudentSelector
          onStudentSelect={studentSelectorMode === 'single' ? handleStudentSelect : undefined}
          onBulkSelect={studentSelectorMode === 'bulk' ? handleBulkStudentSelect : undefined}
          onClose={() => setShowStudentSelector(false)}
          bulkMode={studentSelectorMode === 'bulk'}
        />
      )}

      {/* Teacher Message Modal */}
      {showChatModal && (
        <TeacherMessageModal
          isOpen={showChatModal}
          selectedStudent={selectedStudent}
          onClose={() => {
            setShowChatModal(false);
            setSelectedStudent(null);
          }}
        />
      )}

      {/* Bulk Message Modal */}
      {showBulkMessageModal && (
        <BulkMessageModal
          isOpen={showBulkMessageModal}
          selectedStudents={selectedStudentsForBulk}
          onClose={() => {
            setShowBulkMessageModal(false);
            setSelectedStudentsForBulk([]);
          }}
          onSend={handleSendBulkMessage}
        />
      )}

      {/* Live Session Modal */}
      {showLiveSessionModal && (
        <LiveSessionModal
          isOpen={showLiveSessionModal}
          onClose={() => setShowLiveSessionModal(false)}
          onStartSession={handleLiveSessionCreated}
        />
      )}

      {/* Change Password Modal */}
      {showChangePasswordModal && (
        <ChangePasswordModal
          isOpen={showChangePasswordModal}
          onClose={() => setShowChangePasswordModal(false)}
          onPasswordChanged={handlePasswordChanged}
        />
      )}

      {/* Delete Account Modal */}
      {showDeleteAccountModal && (
        <DeleteAccountModal
          isOpen={showDeleteAccountModal}
          onClose={() => setShowDeleteAccountModal(false)}
          onAccountDeleted={handleAccountDeleted}
        />
      )}

      {/* Sign Out Confirmation Modal */}
      {showSignOutConfirm && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
            {/* Backdrop with blur effect */}
            <div
              className="fixed inset-0 bg-black/60 transition-opacity"
              onClick={() => {
                console.log('Backdrop clicked, closing modal');
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
                    console.log('Sign out clicked, calling signOut');
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
