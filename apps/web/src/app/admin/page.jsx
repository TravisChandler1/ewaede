import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useUser from '@/utils/useUser';
import { 
  Users, 
  UserCheck, 
  BookOpen, 
  Video, 
  MessageSquare,
  TrendingUp,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  Edit,
  Trash2,
  Plus,
  Search,
  Filter,
  Download,
  Upload,
  Bell,
  BarChart3,
  PieChart,
  Activity,
  DollarSign,
  Calendar,
  Flag,
  Menu,
  X,
  LogOut
} from 'lucide-react';

export default function AdminDashboard() {
  const { data: user, loading: userLoading } = useUser();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const queryClient = useQueryClient();

  // Fetch admin dashboard data
  const { data: adminData, loading: adminLoading, error } = useQuery({
    queryKey: ['adminData'],
    queryFn: async () => {
      const response = await fetch('/api/admin/dashboard');
      if (!response.ok) {
        throw new Error('Failed to fetch admin data');
      }
      return response.json();
    },
    enabled: !!user,
    staleTime: 1000 * 60 * 2, // 2 minutes
  });

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = '/account/signin';
    } else if (user && user.role !== 'admin') {
      window.location.href = '/dashboard';
    }
  }, [user, userLoading]);

  if (userLoading || adminLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">Loading admin dashboard...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-xl mb-4">Error loading admin dashboard</div>
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

  if (!user || !adminData) {
    return null;
  }

  const sidebarItems = [
    { id: 'overview', icon: <BarChart3 className="w-5 h-5" />, label: 'Overview' },
    { id: 'users', icon: <Users className="w-5 h-5" />, label: 'User Management' },
    { id: 'teachers', icon: <UserCheck className="w-5 h-5" />, label: 'Teacher Approvals' },
    { id: 'content', icon: <BookOpen className="w-5 h-5" />, label: 'Content Management' },
    { id: 'sessions', icon: <Video className="w-5 h-5" />, label: 'Sessions' },
    { id: 'reports', icon: <AlertTriangle className="w-5 h-5" />, label: 'Reports & Moderation' },
    { id: 'analytics', icon: <TrendingUp className="w-5 h-5" />, label: 'Analytics' },
    { id: 'payments', icon: <DollarSign className="w-5 h-5" />, label: 'Payments' },
    { id: 'announcements', icon: <Bell className="w-5 h-5" />, label: 'Announcements' },
    { id: 'settings', icon: <Settings className="w-5 h-5" />, label: 'System Settings' },
  ];

  // Overview Tab Component
  const OverviewTab = () => (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-[#dc2626] to-[#f59e0b] rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Admin Dashboard</h1>
        <p className="text-lg opacity-90">
          Welcome back, {user.name}! Manage your Yoruba learning platform.
        </p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#06b6d4] rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Total Users</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {adminData.stats?.totalUsers || 0}
          </div>
          <p className="text-[#cbd5e1] text-sm">
            +{adminData.stats?.newUsersThisMonth || 0} this month
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#10b981] rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Active Teachers</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {adminData.stats?.activeTeachers || 0}
          </div>
          <p className="text-[#cbd5e1] text-sm">
            {adminData.stats?.pendingTeachers || 0} pending approval
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#8b5cf6] rounded-lg flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Total Courses</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            {adminData.stats?.totalCourses || 0}
          </div>
          <p className="text-[#cbd5e1] text-sm">
            {adminData.stats?.activeCourses || 0} active
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-[#f59e0b] rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-white">Revenue</h3>
          </div>
          <div className="text-3xl font-bold text-white mb-2">
            ${adminData.stats?.totalRevenue || 0}
          </div>
          <p className="text-[#cbd5e1] text-sm">
            ${adminData.stats?.monthlyRevenue || 0} this month
          </p>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Recent User Registrations</h3>
          <div className="space-y-4">
            {adminData.recentUsers?.slice(0, 5).map((user, index) => (
              <div key={index} className="flex items-center gap-3 p-3 bg-[#334155] rounded-lg">
                <div className="w-10 h-10 bg-[#06b6d4] rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold">
                    {user.full_name?.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="text-white font-medium">{user.full_name}</p>
                  <p className="text-[#cbd5e1] text-sm">{user.email}</p>
                </div>
                <span className={`px-2 py-1 rounded text-xs font-medium ${
                  user.role === 'teacher' ? 'bg-[#10b981] text-white' : 'bg-[#06b6d4] text-white'
                }`}>
                  {user.role}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-6">Pending Actions</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-[#334155] rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-400" />
                <span className="text-white">Teacher Applications</span>
              </div>
              <span className="bg-yellow-500 text-white px-2 py-1 rounded text-sm font-medium">
                {adminData.stats?.pendingTeachers || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#334155] rounded-lg">
              <div className="flex items-center gap-3">
                <Flag className="w-5 h-5 text-red-400" />
                <span className="text-white">Content Reports</span>
              </div>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-medium">
                {adminData.stats?.pendingReports || 0}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-[#334155] rounded-lg">
              <div className="flex items-center gap-3">
                <BookOpen className="w-5 h-5 text-blue-400" />
                <span className="text-white">Course Reviews</span>
              </div>
              <span className="bg-blue-500 text-white px-2 py-1 rounded text-sm font-medium">
                {adminData.stats?.pendingCourses || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Teacher Approvals Tab
  const TeacherApprovalsTab = () => {
    const [applications, setApplications] = useState(adminData.teacherApplications || []);
    const [selectedApplication, setSelectedApplication] = useState(null);

    const approveMutation = useMutation({
      mutationFn: async ({ applicationId, action, reason }) => {
        const response = await fetch(`/api/admin/teacher-applications/${applicationId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, reason })
        });
        if (!response.ok) throw new Error('Failed to update application');
        return response.json();
      },
      onSuccess: () => {
        queryClient.invalidateQueries(['adminData']);
        setSelectedApplication(null);
      }
    });

    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-white">Teacher Applications</h2>
          <div className="flex gap-3">
            <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filter
            </button>
            <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6">
          {applications.map((application) => (
            <div key={application.id} className="bg-[#1e293b] border border-[#334155] rounded-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-[#06b6d4] rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold">
                      {application.full_name?.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{application.full_name}</h3>
                    <p className="text-[#cbd5e1]">{application.email}</p>
                  </div>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  application.status === 'pending' ? 'bg-yellow-500 text-white' :
                  application.status === 'approved' ? 'bg-green-500 text-white' :
                  application.status === 'rejected' ? 'bg-red-500 text-white' :
                  'bg-blue-500 text-white'
                }`}>
                  {application.status}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <p className="text-[#cbd5e1] text-sm">Experience</p>
                  <p className="text-white font-medium">{application.experience_years} years</p>
                </div>
                <div>
                  <p className="text-[#cbd5e1] text-sm">Subjects</p>
                  <p className="text-white font-medium">
                    {application.teaching_subjects?.join(', ') || 'Not specified'}
                  </p>
                </div>
                <div>
                  <p className="text-[#cbd5e1] text-sm">Applied</p>
                  <p className="text-white font-medium">
                    {new Date(application.applied_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <p className="text-[#cbd5e1] mb-4 line-clamp-2">{application.cover_letter}</p>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedApplication(application)}
                  className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <Eye className="w-4 h-4" />
                  View Details
                </button>
                {application.status === 'pending' && (
                  <>
                    <button
                      onClick={() => approveMutation.mutate({ 
                        applicationId: application.id, 
                        action: 'approve' 
                      })}
                      className="bg-[#10b981] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4" />
                      Approve
                    </button>
                    <button
                      onClick={() => approveMutation.mutate({ 
                        applicationId: application.id, 
                        action: 'reject',
                        reason: 'Application does not meet requirements'
                      })}
                      className="bg-[#dc2626] text-white px-4 py-2 rounded-lg flex items-center gap-2"
                    >
                      <XCircle className="w-4 h-4" />
                      Reject
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // User Management Tab
  const UserManagementTab = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">User Management</h2>
        <div className="flex gap-3">
          <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Search className="w-4 h-4" />
            Search Users
          </button>
          <button className="bg-[#334155] text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add User
          </button>
        </div>
      </div>

      <div className="bg-[#1e293b] border border-[#334155] rounded-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-[#334155]">
              <tr>
                <th className="text-left p-4 text-white font-semibold">User</th>
                <th className="text-left p-4 text-white font-semibold">Role</th>
                <th className="text-left p-4 text-white font-semibold">Status</th>
                <th className="text-left p-4 text-white font-semibold">Joined</th>
                <th className="text-left p-4 text-white font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {adminData.users?.map((user, index) => (
                <tr key={index} className="border-t border-[#334155]">
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-[#06b6d4] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">
                          {user.full_name?.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-white font-medium">{user.full_name}</p>
                        <p className="text-[#cbd5e1] text-sm">{user.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.role === 'admin' ? 'bg-red-500 text-white' :
                      user.role === 'teacher' ? 'bg-green-500 text-white' :
                      'bg-blue-500 text-white'
                    }`}>
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      user.is_active ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                    }`}>
                      {user.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4 text-[#cbd5e1]">
                    {new Date(user.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button className="text-[#06b6d4] hover:text-white">
                        <Edit className="w-4 h-4" />
                      </button>
                      <button className="text-red-400 hover:text-white">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return <OverviewTab />;
      case 'teachers': return <TeacherApprovalsTab />;
      case 'users': return <UserManagementTab />;
      case 'content': return <div className="text-white">Content Management coming soon...</div>;
      case 'sessions': return <div className="text-white">Session Management coming soon...</div>;
      case 'reports': return <div className="text-white">Reports & Moderation coming soon...</div>;
      case 'analytics': return <div className="text-white">Analytics coming soon...</div>;
      case 'payments': return <div className="text-white">Payment Management coming soon...</div>;
      case 'announcements': return <div className="text-white">Announcements coming soon...</div>;
      case 'settings': return <div className="text-white">System Settings coming soon...</div>;
      default: return <OverviewTab />;
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a]">
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
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-[#dc2626] to-[#f59e0b] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Admin Panel</h2>
              <p className="text-sm text-[#cbd5e1]">Ewa Ede</p>
            </div>
          </div>

          <nav className="space-y-2">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#dc2626] text-white' 
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
              {sidebarItems.find(item => item.id === activeTab)?.label || 'Admin Dashboard'}
            </h1>
            
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-white">{user.name}</p>
                <p className="text-xs text-[#cbd5e1]">Administrator</p>
              </div>
              <div className="w-10 h-10 bg-[#dc2626] rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-white" />
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