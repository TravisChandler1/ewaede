'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  BookOpen,
  Clock,
  Award,
  BarChart2,
  Calendar,
  ChevronRight,
  Menu,
  X,
  Bell,
  Search
} from 'lucide-react';
import { getCurrentUser } from '@/lib/auth-utils';
import { Loading } from '@/components/ui/loading';
import { CourseCard } from '@/components/dashboard/CourseCard';

interface AuthUser {
  id: string;
  name?: string | null;
  email?: string | null;
  role: string;
}

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
  id: number;
  title: string;
  time: string;
  type: string;
}

export default function StudentDashboard() {
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [courses, setCourses] = useState<Course[]>([]);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<Stats>({
    activeCourses: 0,
    hoursThisWeek: 0,
    currentStreak: 0,
    overallProgress: 0,
  });

  const fetchEnrolledCourses = async () => {
    try {
      const response = await fetch('/api/students/courses');
      if (!response.ok) {
        throw new Error('Failed to fetch enrolled courses');
      }
      const data: CourseResponse[] = await response.json();
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
    const checkAuth = async () => {
      try {
        const currentUser = await getCurrentUser();
        if (!currentUser) {
          router.push('/auth/signin');
          return;
        }
        setUser(currentUser);
        await Promise.all([fetchEnrolledCourses(), fetchDashboardStats()]);
      } catch (error) {
        console.error('Authentication error:', error);
        router.push('/auth/signin');
      } finally {
        setIsLoading(false);
      }
    };
    
    checkAuth();
  }, [router]);

  const statsList: StatItem[] = [
    { 
      name: 'Active Courses', 
      value: stats?.activeCourses?.toString() || '0',
      icon: <BookOpen className="h-6 w-6 text-blue-500" />,
      change: '+2 from last month',
    },
    { 
      name: 'Hours This Week', 
      value: stats?.hoursThisWeek?.toString() || '0',
      icon: <Clock className="h-6 w-6 text-green-500" />,
      change: '+3 from last week',
    },
    { 
      name: 'Current Streak', 
      value: stats?.currentStreak?.toString() || '0',
      icon: <Award className="h-6 w-6 text-yellow-500" />,
      change: '2 day streak',
    },
    { 
      name: 'Overall Progress', 
      value: `${stats?.overallProgress || 0}%`,
      icon: <BarChart2 className="h-6 w-6 text-purple-500" />,
      change: '+5% this week',
    }
  ];

  const recentActivities: Activity[] = [
    { id: 1, text: 'Completed lesson: Greetings in Yoruba', time: '2h ago' },
    { id: 2, text: 'Earned badge: Fast Learner', time: '1d ago' },
    { id: 3, text: 'Started new course: Intermediate Yoruba', time: '2d ago' },
    { id: 4, text: 'Posted in Book Club: Chapter 3 Discussion', time: '3d ago' },
    { id: 5, text: 'Completed quiz: Basic Phrases with 90% score', time: '4d ago' },
  ];

  const upcomingSessions: Session[] = [
    {
      id: 1,
      title: 'Yoruba Conversation Practice',
      time: 'Tomorrow, 3:00 PM - 4:00 PM',
      type: 'Group Session',
    },
    {
      id: 2,
      title: 'Book Club Discussion',
      time: 'Friday, 5:00 PM - 6:00 PM',
      type: 'Book Club',
    },
  ];
  
  if (isLoading) {
    return <Loading />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-full">
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
        <button 
          type="button"
          className="text-gray-500 hover:text-gray-600"
          onClick={() => setSidebarOpen(true)}
        >
          <span className="sr-only">Open sidebar</span>
          <Menu className="h-6 w-6" />
        </button>
        
        <h1 className="text-xl font-bold text-gray-900">Ewa Ede</h1>
        
        <div className="flex items-center space-x-4">
          <button type="button" className="text-gray-500 hover:text-gray-600">
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
          </button>
          
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Search"
            />
          </div>
        </div>
      </div>

      {/* Mobile sidebar */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-gray-600 bg-opacity-75" onClick={() => setSidebarOpen(false)}></div>
          <div className="fixed inset-y-0 left-0 max-w-xs w-full bg-white">
            <div className="flex items-center justify-between h-16 px-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Menu</h2>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-600"
                onClick={() => setSidebarOpen(false)}
              >
                <span className="sr-only">Close sidebar</span>
                <X className="h-6 w-6" />
              </button>
            </div>
            {/* Sidebar content here */}
          </div>
        </div>
      )}

      <div className="lg:pl-64 pt-16 lg:pt-0">
        <main className="py-6 px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pb-6 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user?.name?.split(' ')[0] || 'Student'}! 👋</h1>
          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {statsList.map((stat) => (
              <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
                      {stat.change && (
                        <span className="ml-2 text-sm text-green-600">{stat.change}</span>
                      )}
                    </div>
                  </div>
                  <div className="p-2 rounded-full bg-gray-100">
                    {stat.icon}
                  </div>
                </div>
              </div>
            ))}
          </div>
              </div>
          {/* Main Content */}
          <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Courses Section */}
            <div className="lg:col-span-2 space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Continue Learning</h2>
                <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                  View all
                </button>
              </div>
              
              <div className="space-y-4">
                {courses.map((course) => (
                  <CourseCard key={course.id} {...course} />
                ))}
              </div>

              {/* Upcoming Sessions */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      View all
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{session.title}</p>
                          <p className="text-sm text-gray-500">{session.time}</p>
                          <span className="mt-1 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {session.type}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent Activity */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
                    <button className="text-sm font-medium text-indigo-600 hover:text-indigo-800">
                      View all
                    </button>
                  </div>
                </div>
                <div className="divide-y divide-gray-200">
                  {recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Award className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{activity.text}</p>
                          <p className="text-sm text-gray-500">{activity.time}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-6">
              {/* Upcoming Sessions */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Upcoming Sessions</h3>
                </div>
                <div className="divide-y divide-gray-200">
                  {upcomingSessions.map((session) => (
                    <div key={session.id} className="p-4 hover:bg-gray-50 transition-colors duration-150">
                      <div className="flex items-start">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                          <Calendar className="h-5 w-5 text-indigo-600" />
                        </div>
                        <div className="ml-4">
                          <p className="text-sm font-medium text-gray-900">{session.title}</p>
                          <p className="text-sm text-gray-500">{session.time}</p>
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                            {session.type}
                          </span>
                        </div>
                        <button className="ml-auto text-indigo-600 hover:text-indigo-900">
                          <ChevronRight className="h-5 w-5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white shadow overflow-hidden rounded-lg">
                <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                  <h3 className="text-lg font-medium text-gray-900">Quick Actions</h3>
                </div>
                <div className="p-4 space-y-3">
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Join Live Session
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    Browse Courses
                  </button>
                  <button className="w-full flex items-center justify-center px-4 py-2.5 border border-transparent rounded-md shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200">
                    View Progress
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
