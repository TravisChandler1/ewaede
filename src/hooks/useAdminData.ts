import { useState, useEffect } from 'react';

export interface PendingTeacher {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  createdAt: string;
  teacherProfile?: {
    bio?: string;
    expertise: string[];
    experience?: number;
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  status: 'ACTIVE' | 'APPROVED' | 'PENDING' | 'REJECTED';
  joinedAt: string;
  lastActive: string;
}

export interface AdminStats {
  pendingApplications: number;
  approvedThisMonth: number;
  rejectedThisMonth: number;
  activeTeachers: number;
  totalUsers: number;
  activeSessions: number;
  completionRate: number;
  monthlyRevenue: number;
}

export interface MonthlyData {
  month: string;
  students: number;
  teachers: number;
  revenue: number;
}

export interface AdminData {
  stats: AdminStats;
  pendingTeachers: PendingTeacher[];
  allUsers: User[];
  monthlyData: MonthlyData[];
}

// Mock admin data - in a real app, this would come from an API
const mockAdminData: AdminData = {
  stats: {
    pendingApplications: 3,
    approvedThisMonth: 8,
    rejectedThisMonth: 2,
    activeTeachers: 24,
    totalUsers: 156,
    activeSessions: 89,
    completionRate: 78,
    monthlyRevenue: 12450,
  },
  pendingTeachers: [
    {
      id: '1',
      firstName: 'Adunni',
      lastName: 'Olatunji',
      email: 'adunni.olatunji@email.com',
      createdAt: '2024-01-15T10:30:00Z',
      teacherProfile: {
        bio: 'Native Yoruba speaker with 10 years of teaching experience. Specialized in grammar and cultural context.',
        expertise: ['Grammar', 'Cultural Context', 'Pronunciation'],
        experience: 10,
      },
    },
    {
      id: '2',
      firstName: 'Babatunde',
      lastName: 'Adebayo',
      email: 'babatunde.adebayo@email.com',
      createdAt: '2024-01-14T14:20:00Z',
      teacherProfile: {
        bio: 'PhD in Yoruba Literature with focus on modern teaching methodologies.',
        expertise: ['Literature', 'Advanced Grammar', 'Writing'],
        experience: 8,
      },
    },
    {
      id: '3',
      firstName: 'Folake',
      lastName: 'Adesanya',
      email: 'folake.adesanya@email.com',
      createdAt: '2024-01-13T09:15:00Z',
      teacherProfile: {
        bio: 'Cultural historian and language enthusiast. Passionate about preserving Yoruba traditions.',
        expertise: ['Cultural History', 'Proverbs', 'Traditional Stories'],
        experience: 12,
      },
    },
  ],
  allUsers: [
    {
      id: '1',
      firstName: 'Adebayo',
      lastName: 'Johnson',
      email: 'adebayo.johnson@email.com',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinedAt: '2024-01-10',
      lastActive: '2024-01-15',
    },
    {
      id: '2',
      firstName: 'Folake',
      lastName: 'Adebisi',
      email: 'folake.adebisi@email.com',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinedAt: '2024-01-08',
      lastActive: '2024-01-14',
    },
    {
      id: '3',
      firstName: 'Adunni',
      lastName: 'Olatunji',
      email: 'adunni.olatunji@email.com',
      role: 'TEACHER',
      status: 'APPROVED',
      joinedAt: '2023-12-15',
      lastActive: '2024-01-15',
    },
    {
      id: '4',
      firstName: 'Babatunde',
      lastName: 'Adebayo',
      email: 'babatunde.adebayo@email.com',
      role: 'TEACHER',
      status: 'PENDING',
      joinedAt: '2024-01-14',
      lastActive: '2024-01-14',
    },
    {
      id: '5',
      firstName: 'Kemi',
      lastName: 'Ogundimu',
      email: 'kemi.ogundimu@email.com',
      role: 'STUDENT',
      status: 'ACTIVE',
      joinedAt: '2024-01-12',
      lastActive: '2024-01-15',
    },
  ],
  monthlyData: [
    { month: 'Jan', students: 45, teachers: 8, revenue: 8500 },
    { month: 'Feb', students: 52, teachers: 9, revenue: 9200 },
    { month: 'Mar', students: 61, teachers: 11, revenue: 10800 },
    { month: 'Apr', students: 68, teachers: 12, revenue: 11500 },
    { month: 'May', students: 74, teachers: 14, revenue: 12450 },
  ],
};

export const useAdminData = () => {
  const [adminData, setAdminData] = useState<AdminData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchData = async () => {
      setLoading(true);
      // In a real app, this would be an actual API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setAdminData(mockAdminData);
      setLoading(false);
    };

    fetchData();
  }, []);

  const approveTeacher = (teacherId: string) => {
    if (!adminData) return;

    setAdminData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        pendingTeachers: prev.pendingTeachers.filter(teacher => teacher.id !== teacherId),
        stats: {
          ...prev.stats,
          pendingApplications: prev.stats.pendingApplications - 1,
          approvedThisMonth: prev.stats.approvedThisMonth + 1,
          activeTeachers: prev.stats.activeTeachers + 1,
        },
        allUsers: prev.allUsers.map(user => 
          user.id === teacherId ? { ...user, status: 'APPROVED' as const } : user
        ),
      };
    });
  };

  const rejectTeacher = (teacherId: string, reason: string) => {
    if (!adminData) return;

    setAdminData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        pendingTeachers: prev.pendingTeachers.filter(teacher => teacher.id !== teacherId),
        stats: {
          ...prev.stats,
          pendingApplications: prev.stats.pendingApplications - 1,
          rejectedThisMonth: prev.stats.rejectedThisMonth + 1,
        },
        allUsers: prev.allUsers.map(user => 
          user.id === teacherId ? { ...user, status: 'REJECTED' as const } : user
        ),
      };
    });
  };

  const deleteUser = (userId: string) => {
    if (!adminData) return;

    setAdminData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        allUsers: prev.allUsers.filter(user => user.id !== userId),
        stats: {
          ...prev.stats,
          totalUsers: prev.stats.totalUsers - 1,
        },
      };
    });
  };

  const updateUserStatus = (userId: string, status: User['status']) => {
    if (!adminData) return;

    setAdminData(prev => {
      if (!prev) return prev;
      
      return {
        ...prev,
        allUsers: prev.allUsers.map(user => 
          user.id === userId ? { ...user, status } : user
        ),
      };
    });
  };

  return {
    adminData,
    loading,
    approveTeacher,
    rejectTeacher,
    deleteUser,
    updateUserStatus,
  };
};