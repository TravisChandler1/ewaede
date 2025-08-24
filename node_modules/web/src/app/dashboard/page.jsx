import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '@/utils/useUser';
import CreateGroupModal from '@/components/modals/CreateGroupModal';
import SessionModal from '@/components/modals/SessionModal';
import { 
  BookOpen, 
  Users, 
  MessageCircle, 
  Library, 
  Video, 
  BarChart, 
  Calendar,
  TrendingUp,
  Award,
  Clock,
  UserCheck,
  Menu,
  X,
  LogOut,
  Plus,
  Search,
  Filter,
  Star,
  Play,
  UserPlus,
  Settings,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export default function DashboardPage() {
  const { data: user, loading: userLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [showSessionModal, setShowSessionModal] = useState(false);
  const queryClient = useQueryClient();

  // Fetch dashboard data
  const { data: dashboardData, loading: dashboardLoading, error } = useQuery({
    queryKey: ['dashboardData'],
    queryFn: async () => {
      const response = await fetch('/api/dashboard/data');
      if (!response.ok) {
        throw new Error('Failed to fetch dashboard data');
      }
      return response.json();
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = '/account/signin';
    }
  }, [user, userLoading]);

  if (userLoading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading dashboard</div>
          <button 
            onClick={() => window.location.reload()}
            className="bg-[#06b6d4] text-white px-6 py-2 rounded-lg"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!user || !dashboardData) {
    return null;
  }

  const { profile } = dashboardData;
  const isStudent = profile.role === 'student';
  const isTeacher = profile.role === 'teacher';
  const isAdmin = profile.role === 'admin';

  // Redirect admin to admin dashboard
  useEffect(() => {
    if (isAdmin) {
      window.location.href = '/admin';
    }
  }, [isAdmin]);

  const sidebarItems = isStudent ? [
    { id: 'overview', icon: <BarChart className="w-5 h-5" />, label: 'Overview' },
    { id: 'progress', icon: <BookOpen className="w-5 h-5" />, label: 'My Progress' },
    { id: 'groups', icon: <Users className="w-5 h-5" />, label: 'Study Groups' },
    { id: 'bookclub', icon: <MessageCircle className="w-5 h-5" />, label: 'Book Club' },
    { id: 'library', icon: <Library className="w-5 h-5" />, label: 'E-Library' },
    { id: 'sessions', icon: <Video className="w-5 h-5" />, label: 'Live Sessions' },
  ] : [
    { id: 'overview', icon: <BarChart className="w-5 h-5" />, label: 'Overview' },
    { id: 'students', icon: <UserCheck className="w-5 h-5" />, label: 'My Students' },
    { id: 'sessions', icon: <Video className="w-5 h-5" />, label: 'Live Sessions' },
    { id: 'groups', icon: <Users className="w-5 h-5" />, label: 'Groups' },
    { id: 'analytics', icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics' },
  ];

  // Student Components
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#06b6d4] to-[#10b981] rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Kaabo, {profile.full_name}! 👋</h1>
        <p className="text-lg opacity-90 mb-4">
          Welcome back to your Yoruba learning journey. Level: {profile.learning_level}
        </p>
        {isStudent && (
          <div className="bg-white/10 rounded-lg p-4">
            <p className="text-sm mb-2">Want to share your knowledge and teach others?</p>
            <a
              href="/apply-teacher"
              className="bg-white text-[#06b6d4] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4" />
              Apply to Become a Teacher
            </a>
          </div>
        )}
      </div>

      {/* Progress Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#06b6d4] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Courses Progress</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {dashboardData.progress?.length || 0}
          </div>
          <p className="text-[#cbd5e1]">Active courses</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#10b981] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Study Groups</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {dashboardData.groups?.length || 0}
          </div>
          <p className="text-[#cbd5e1]">Groups joined</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Live Sessions</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {dashboardData.sessions?.length || 0}
          </div>
          <p className="text-[#cbd5e1]">Sessions attended</p>
        </div>
      </div>

      {/* Course Progress */}
      {dashboardData.progress && dashboardData.progress.length > 0 && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Your Learning Progress</h3>
          <div className="space-y-4">
            {dashboardData.progress.map((course, index) => (
              <div key={index} className="bg-[#334155] rounded-lg p-4">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="text-lg font-semibold text-white">{course.course_title}</h4>
                  <span className="text-[#cbd5e1] text-sm">{course.progress_percentage}% complete</span>
                </div>
                <div className="w-full bg-[#475569] rounded-full h-2 mb-2">
                  <div 
                    className="bg-[#06b6d4] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress_percentage}%` }}
                  ></div>
                </div>
                <p className="text-[#cbd5e1] text-sm">
                  {course.completed_lessons} of {course.total_lessons} lessons completed
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const ProgressTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">My Learning Progress</h2>
        <div className="flex gap-3">
          <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {dashboardData.progress && dashboardData.progress.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.progress.map((course, index) => (
            <div key={index} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#06b6d4] rounded-lg flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{course.course_title}</h3>
                  <p className="text-[#cbd5e1] text-sm">Level: {course.level}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#cbd5e1] text-sm">Progress</span>
                  <span className="text-white font-semibold">{course.progress_percentage}%</span>
                </div>
                <div className="w-full bg-[#475569] rounded-full h-3">
                  <div 
                    className="bg-gradient-to-r from-[#06b6d4] to-[#10b981] h-3 rounded-full transition-all duration-300"
                    style={{ width: `${course.progress_percentage}%` }}
                  ></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{course.completed_lessons}</div>
                  <div className="text-[#cbd5e1] text-sm">Completed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-white">{course.total_lessons}</div>
                  <div className="text-[#cbd5e1] text-sm">Total Lessons</div>
                </div>
              </div>

              <button className="w-full bg-[#06b6d4] text-white py-2 rounded-lg hover:bg-[#0891b2] transition-colors">
                Continue Learning
              </button>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <BookOpen className="w-16 h-16 text-[#475569] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No courses yet</h3>
          <p className="text-[#cbd5e1] mb-6">Start your Yoruba learning journey today!</p>
          <button className="bg-[#06b6d4] text-white px-6 py-3 rounded-lg">
            Browse Courses
          </button>
        </div>
      )}
    </div>
  );

  const StudyGroupsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Study Groups</h2>
        <div className="flex gap-3">
          <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Search className="w-4 h-4" />
            Find Groups
          </button>
          <button className="bg-[#10b981] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Create Group
          </button>
        </div>
      </div>

      {dashboardData.groups && dashboardData.groups.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.groups.map((group, index) => (
            <div key={index} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#10b981] rounded-lg flex items-center justify-center">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{group.name}</h3>
                    <p className="text-[#cbd5e1] text-sm">{group.member_count || 0} members</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  group.membership_role === 'admin' ? 'bg-[#f59e0b] text-white' :
                  group.membership_role === 'moderator' ? 'bg-[#8b5cf6] text-white' :
                  'bg-[#06b6d4] text-white'
                }`}>
                  {group.membership_role}
                </span>
              </div>
              
              <p className="text-[#cbd5e1] mb-4 line-clamp-2">{group.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-[#cbd5e1]">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {new Date(group.created_at).toLocaleDateString()}
                  </span>
                </div>
                <button className="bg-[#334155] text-white px-4 py-2 rounded-lg hover:bg-[#475569] transition-colors">
                  View Group
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-[#475569] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No study groups yet</h3>
          <p className="text-[#cbd5e1] mb-6">Join or create a study group to learn with others!</p>
          <div className="flex gap-3 justify-center">
            <button className="bg-[#334155] text-white px-6 py-3 rounded-lg">
              Find Groups
            </button>
            <button className="bg-[#10b981] text-white px-6 py-3 rounded-lg">
              Create Group
            </button>
          </div>
        </div>
      )}
    </div>
  );

  const BookClubTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Book Club</h2>
        <button className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Join Discussion
        </button>
      </div>

      {dashboardData.bookClubs && dashboardData.bookClubs.length > 0 ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {dashboardData.bookClubs.map((club, index) => (
            <div key={index} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white">{club.book_title}</h3>
                  <p className="text-[#cbd5e1] text-sm">by {club.author}</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-[#cbd5e1] text-sm">Reading Progress</span>
                  <span className="text-white font-semibold">Chapter {club.progress_chapter}</span>
                </div>
                <div className="w-full bg-[#475569] rounded-full h-2">
                  <div 
                    className="bg-[#8b5cf6] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(club.progress_chapter / club.total_chapters) * 100}%` }}
                  ></div>
                </div>
              </div>

              <p className="text-[#cbd5e1] mb-4 line-clamp-2">{club.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="text-sm text-[#cbd5e1]">
                  Next discussion: {new Date(club.next_discussion).toLocaleDateString()}
                </div>
                <button className="bg-[#8b5cf6] text-white px-4 py-2 rounded-lg hover:bg-[#7c3aed] transition-colors">
                  Join Discussion
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <MessageCircle className="w-16 h-16 text-[#475569] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No book clubs yet</h3>
          <p className="text-[#cbd5e1] mb-6">Join a book club to discuss Yoruba literature with others!</p>
          <button className="bg-[#8b5cf6] text-white px-6 py-3 rounded-lg">
            Browse Book Clubs
          </button>
        </div>
      )}
    </div>
  );

  const LibraryTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">E-Library</h2>
        <div className="flex gap-3">
          <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search
          </button>
          <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {dashboardData.libraryResources && dashboardData.libraryResources.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {dashboardData.libraryResources.map((resource, index) => (
            <div key={index} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6 hover:bg-[#334155] transition-colors cursor-pointer">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-[#06b6d4] rounded-lg flex items-center justify-center">
                  <Library className="w-5 h-5 text-white" />
                </div>
                <span className="text-xs text-[#cbd5e1] bg-[#475569] px-2 py-1 rounded">
                  {resource.type}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">{resource.title}</h3>
              <p className="text-[#cbd5e1] text-sm mb-4 line-clamp-3">{resource.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-[#cbd5e1] text-sm">{resource.rating || '4.5'}</span>
                </div>
                <button className="bg-[#06b6d4] text-white px-4 py-2 rounded-lg hover:bg-[#0891b2] transition-colors">
                  Access
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Library className="w-16 h-16 text-[#475569] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No resources available</h3>
          <p className="text-[#cbd5e1] mb-6">Check back later for new learning materials!</p>
        </div>
      )}
    </div>
  );

  const SessionsTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Live Sessions</h2>
        <button className="bg-[#06b6d4] text-white px-4 py-2 rounded-lg flex items-center gap-2">
          <Search className="w-4 h-4" />
          Find Sessions
        </button>
      </div>

      {dashboardData.sessions && dashboardData.sessions.length > 0 ? (
        <div className="space-y-4">
          {dashboardData.sessions.map((session, index) => (
            <div key={index} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-[#06b6d4] rounded-lg flex items-center justify-center">
                    <Video className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{session.title}</h3>
                    <p className="text-[#cbd5e1] text-sm">{session.teacher_name}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  session.status === 'scheduled' ? 'bg-[#06b6d4] text-white' :
                  session.status === 'live' ? 'bg-[#10b981] text-white' :
                  session.status === 'completed' ? 'bg-[#475569] text-[#cbd5e1]' :
                  'bg-[#dc2626] text-white'
                }`}>
                  {session.status}
                </span>
              </div>
              
              <p className="text-[#cbd5e1] mb-4">{session.description}</p>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 text-sm text-[#cbd5e1]">
                  <span className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    {new Date(session.scheduled_date).toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    {session.registered_count || 0} registered
                  </span>
                </div>
                <div className="flex gap-2">
                  {session.status === 'live' && (
                    <button className="bg-[#10b981] text-white px-4 py-2 rounded-lg flex items-center gap-2">
                      <Play className="w-4 h-4" />
                      Join Live
                    </button>
                  )}
                  {session.status === 'scheduled' && (
                    <button className="bg-[#06b6d4] text-white px-4 py-2 rounded-lg">
                      Register
                    </button>
                  )}
                  {session.status === 'completed' && (
                    <button className="bg-[#334155] text-white px-4 py-2 rounded-lg">
                      View Recording
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <Video className="w-16 h-16 text-[#475569] mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-white mb-2">No sessions available</h3>
          <p className="text-[#cbd5e1] mb-6">Check back later for upcoming live sessions!</p>
          <button className="bg-[#06b6d4] text-white px-6 py-3 rounded-lg">
            Browse Sessions
          </button>
        </div>
      )}
    </div>
  );

  // Teacher Components
  const TeacherOverview = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#10b981] to-[#06b6d4] rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome, Teacher {profile.full_name}! 👨‍🏫</h1>
        <p className="text-lg opacity-90">
          Manage your students and teaching activities from your dashboard.
        </p>
      </div>

      {/* Teacher Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#06b6d4] rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Students</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {dashboardData.students?.total_students || 0}
          </div>
          <p className="text-[#cbd5e1]">Total students</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#10b981] rounded-lg flex items-center justify-center">
              <Video className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Sessions</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {dashboardData.analytics?.total_sessions_created || 0}
          </div>
          <p className="text-[#cbd5e1]">Sessions created</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Groups</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {dashboardData.groups?.length || 0}
          </div>
          <p className="text-[#cbd5e1]">Groups managed</p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Attendees</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {dashboardData.analytics?.total_session_attendees || 0}
          </div>
          <p className="text-[#cbd5e1]">Session attendees</p>
        </div>
      </div>

      {/* Recent Sessions */}
      {dashboardData.sessions && dashboardData.sessions.length > 0 && (
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent Live Sessions</h3>
          <div className="space-y-4">
            {dashboardData.sessions.slice(0, 5).map((session, index) => (
              <div key={index} className="bg-[#334155] rounded-lg p-4 flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-semibold text-white">{session.title}</h4>
                  <p className="text-[#cbd5e1] text-sm mb-2">{session.description}</p>
                  <div className="flex items-center gap-4 text-sm text-[#cbd5e1]">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(session.scheduled_date).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {session.registered_count || 0} registered
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    session.status === 'scheduled' ? 'bg-[#06b6d4] text-white' :
                    session.status === 'live' ? 'bg-[#10b981] text-white' :
                    session.status === 'completed' ? 'bg-[#475569] text-[#cbd5e1]' :
                    'bg-[#dc2626] text-white'
                  }`}>
                    {session.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderTabContent = () => {
    if (isStudent) {
      switch (activeTab) {
        case 'overview': return <OverviewTab />;
        case 'progress': return <ProgressTab />;
        case 'groups': return <StudyGroupsTab />;
        case 'bookclub': return <BookClubTab />;
        case 'library': return <LibraryTab />;
        case 'sessions': return <SessionsTab />;
        default: return <OverviewTab />;
      }
    } else {
      switch (activeTab) {
        case 'overview': return <TeacherOverview />;
        case 'students': return <div className="text-white">Students management coming soon...</div>;
        case 'sessions': return <SessionsTab />;
        case 'groups': return <StudyGroupsTab />;
        case 'analytics': return <div className="text-white">Analytics coming soon...</div>;
        default: return <TeacherOverview />;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Modals */}
      <CreateGroupModal 
        isOpen={showCreateGroupModal} 
        onClose={() => setShowCreateGroupModal(false)} 
      />
      <SessionModal 
        session={selectedSession}
        isOpen={showSessionModal} 
        onClose={() => {
          setShowSessionModal(false);
          setSelectedSession(null);
        }} 
      />

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-[#1e293b] border-r border-[#334155] transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] flex items-center justify-center">
              <span className="text-lg font-bold text-white">E</span>
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Ewa Ede</h2>
              <p className="text-sm text-[#cbd5e1]">Yoruba Academy</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#06b6d4] text-white' 
                    : 'text-[#cbd5e1] hover:bg-[#334155] hover:text-white'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="absolute bottom-6 left-6 right-6">
            <a
              href="/account/logout"
              className="flex items-center gap-3 px-4 py-3 text-[#cbd5e1] hover:bg-[#334155] hover:text-white rounded-lg transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Top bar */}
        <div className="bg-[#1e293b] border-b border-[#334155] px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 text-[#cbd5e1] hover:text-white"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <h1 className="text-xl font-semibold text-white">
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
            </h1>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{profile.full_name}</p>
                <p className="text-xs text-[#cbd5e1]">{profile.role}</p>
              </div>
              <div className="w-10 h-10 bg-[#06b6d4] rounded-full flex items-center justify-center">
                <span className="text-white font-semibold">
                  {profile.full_name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard content */}
        <div className="p-6">
          {renderTabContent()}
        </div>
      </div>
    </div>
  );
}