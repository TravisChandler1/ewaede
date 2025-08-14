import { useState, useEffect, useCallback } from 'react';
import { apiClient } from '../utils/api';
import { useAuth } from '../contexts/AuthContext';

export interface UserProgress {
  level: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO';
  completedLessons: number;
  totalLessons: number;
  studyHours: number;
  progressPercentage: number;
}

export interface Session {
  id: string;
  title: string;
  description?: string;
  teacher: string;
  teacherId: string;
  time: string;
  scheduledAt: string;
  duration: number;
  type: 'Group Session' | 'Individual Session';
  participants: number;
  maxAttendees?: number;
  status: 'scheduled' | 'ongoing' | 'completed' | 'cancelled';
  level?: 'Beginner' | 'Advanced' | 'Mixed' | 'Novice' | 'Pro';
  meetingUrl?: string;
  groupId?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: number;
  maxMembers: number;
  level: string;
  lastActivity: string;
  progress?: number;
  teacherId: string;
  teacher: string;
  isActive: boolean;
  createdAt: string;
}

export interface Book {
  id: string;
  title: string;
  description?: string;
  author: string;
  progress: number;
  type: 'Audio Book' | 'E-Book';
  fileUrl: string;
  fileType: string;
  category: string;
  level: string;
}

export interface BookClub {
  id: string;
  name: string;
  description?: string;
  currentBook?: string;
  members: number;
  isActive: boolean;
  createdAt: string;
}

export interface StudentData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  learningLevel: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO';
  teachingType: 'INDIVIDUAL' | 'GROUP';
  progress: UserProgress;
  upcomingSessions: Session[];
  myGroups: Group[];
  recentBooks: Book[];
  bookClubs: BookClub[];
  pricingPlan?: {
    level: string;
    name: string;
    monthlyPrice: number;
    features: string[];
  };
}

export interface TeacherData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  teacherStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  profile: {
    bio?: string;
    expertise: string[];
    experience?: number;
    rating: number;
    totalStudents: number;
  };
  totalStudents: number;
  liveSessions: number;
  rating: number;
  teachingHours: number;
  upcomingSessions: Session[];
  myGroups: Group[];
  studentsByLevel: {
    category: string;
    count: number;
    color: string;
    recentActivity: string;
  }[];
  recentFeedback: {
    student: string;
    rating: number;
    comment: string;
    course: string;
    date: string;
  }[];
}

export const useStudentData = () => {
  const [studentData, setStudentData] = useState<StudentData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchStudentData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getStudentDashboard();
      
      if (response.success && response.data) {
        setStudentData(response.data);
      } else {
        setError(response.error || 'Failed to fetch student data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchStudentData();
  }, [fetchStudentData]);

  const updateProgress = async (lessonId: string) => {
    if (!studentData) return { success: false, error: 'No student data available' };

    try {
      const response = await apiClient.updateStudentProgress(lessonId);
      
      if (response.success) {
        // Refresh student data to get updated progress
        await fetchStudentData();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to update progress' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update progress' 
      };
    }
  };

  const joinGroup = async (groupId: string) => {
    try {
      const response = await apiClient.joinGroup(groupId);
      
      if (response.success) {
        // Refresh student data to get updated groups
        await fetchStudentData();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to join group' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to join group' 
      };
    }
  };

  const leaveGroup = async (groupId: string) => {
    try {
      const response = await apiClient.leaveGroup(groupId);
      
      if (response.success) {
        // Refresh student data to get updated groups
        await fetchStudentData();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to leave group' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to leave group' 
      };
    }
  };

  const joinSession = async (sessionId: string) => {
    try {
      const response = await apiClient.joinSession(sessionId);
      
      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to join session' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to join session' 
      };
    }
  };

  const joinBookClub = async (bookClubId: string) => {
    try {
      const response = await apiClient.joinBookClub(bookClubId);
      
      if (response.success) {
        // Refresh student data to get updated book clubs
        await fetchStudentData();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to join book club' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to join book club' 
      };
    }
  };

  return {
    studentData,
    loading,
    error,
    updateProgress,
    joinGroup,
    leaveGroup,
    joinSession,
    joinBookClub,
    refetch: fetchStudentData,
  };
};

export const useTeacherData = () => {
  const [teacherData, setTeacherData] = useState<TeacherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  const fetchTeacherData = useCallback(async () => {
    if (!isAuthenticated || !user) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await apiClient.getTeacherDashboard();
      
      if (response.success && response.data) {
        setTeacherData(response.data);
      } else {
        setError(response.error || 'Failed to fetch teacher data');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user]);

  useEffect(() => {
    fetchTeacherData();
  }, [fetchTeacherData]);

  const createGroup = async (groupData: any) => {
    try {
      const response = await apiClient.createGroup(groupData);
      
      if (response.success) {
        // Refresh teacher data to get updated groups
        await fetchTeacherData();
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to create group' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create group' 
      };
    }
  };

  const createSession = async (sessionData: any) => {
    try {
      const response = await apiClient.createSession(sessionData);
      
      if (response.success) {
        // Refresh teacher data to get updated sessions
        await fetchTeacherData();
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to create session' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to create session' 
      };
    }
  };

  const updateGroup = async (groupId: string, groupData: any) => {
    try {
      const response = await apiClient.updateGroup(groupId, groupData);
      
      if (response.success) {
        // Refresh teacher data to get updated groups
        await fetchTeacherData();
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error || 'Failed to update group' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update group' 
      };
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const response = await apiClient.deleteGroup(groupId);
      
      if (response.success) {
        // Refresh teacher data to get updated groups
        await fetchTeacherData();
        return { success: true };
      } else {
        return { success: false, error: response.error || 'Failed to delete group' };
      }
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to delete group' 
      };
    }
  };

  return {
    teacherData,
    loading,
    error,
    createGroup,
    createSession,
    updateGroup,
    deleteGroup,
    refetch: fetchTeacherData,
  };
};