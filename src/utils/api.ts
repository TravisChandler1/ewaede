import { supabase } from './supabase';

// API configuration and utilities
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER';
  learningLevel?: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO';
  teachingType?: 'INDIVIDUAL' | 'GROUP';
}

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'STUDENT' | 'TEACHER' | 'ADMIN';
  avatar?: string;
  teacherStatus?: 'PENDING' | 'APPROVED' | 'REJECTED';
  learningLevel?: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO';
  teachingType?: 'INDIVIDUAL' | 'GROUP';
  createdAt: string;
  updatedAt: string;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthHeaders(): Promise<HeadersInit> {
    const { data: { session } } = await supabase.auth.getSession();
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };

    if (session?.access_token) {
      headers.Authorization = `Bearer ${session.access_token}`;
    }

    return headers;
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const url = `${this.baseURL}${endpoint}`;
    const headers = await this.getAuthHeaders();

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...headers,
          ...options.headers,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.message || 'An error occurred',
        };
      }

      return {
        success: true,
        data: data.data || data,
        message: data.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Use Supabase for token management
  setToken(token: string) {
    // Token is managed by Supabase
  }

  clearToken() {
    // Token is managed by Supabase
  }

  // Authentication endpoints
  async login(credentials: LoginCredentials): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  }

  async signup(userData: SignUpData): Promise<ApiResponse<{ user: User; token: string }>> {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  async logout(): Promise<ApiResponse<void>> {
    try {
      await this.request('/auth/logout', {
        method: 'POST',
      });
      this.clearToken();
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to logout' 
      };
    }
  }

  async getCurrentUser(): Promise<ApiResponse<User>> {
    return this.request('/auth/me');
  }

  // Student endpoints
  async getStudentDashboard(): Promise<ApiResponse<any>> {
    return this.request('/student/dashboard');
  }

  async getStudentProgress(): Promise<ApiResponse<any>> {
    return this.request('/student/progress');
  }

  async updateStudentProgress(lessonId: string): Promise<ApiResponse<any>> {
    return this.request('/student/progress', {
      method: 'POST',
      body: JSON.stringify({ lessonId }),
    });
  }

  async getStudentGroups(): Promise<ApiResponse<any>> {
    return this.request('/student/groups');
  }

  async joinGroup(groupId: string): Promise<ApiResponse<any>> {
    return this.request(`/student/groups/${groupId}/join`, {
      method: 'POST',
    });
  }

  async leaveGroup(groupId: string): Promise<ApiResponse<any>> {
    return this.request(`/student/groups/${groupId}/leave`, {
      method: 'DELETE',
    });
  }

  async getStudentSessions(): Promise<ApiResponse<any>> {
    return this.request('/student/sessions');
  }

  async joinSession(sessionId: string): Promise<ApiResponse<any>> {
    return this.request(`/student/sessions/${sessionId}/join`, {
      method: 'POST',
    });
  }

  async getELibraryResources(): Promise<ApiResponse<any>> {
    return this.request('/elibrary/resources');
  }

  async getBookClubs(): Promise<ApiResponse<any>> {
    return this.request('/bookclubs');
  }

  async joinBookClub(bookClubId: string): Promise<ApiResponse<any>> {
    return this.request(`/bookclubs/${bookClubId}/join`, {
      method: 'POST',
    });
  }

  // Teacher endpoints
  async getTeacherDashboard(): Promise<ApiResponse<any>> {
    return this.request('/teacher/dashboard');
  }

  async getTeacherGroups(): Promise<ApiResponse<any>> {
    return this.request('/teacher/groups');
  }

  async createGroup(groupData: any): Promise<ApiResponse<any>> {
    return this.request('/teacher/groups', {
      method: 'POST',
      body: JSON.stringify(groupData),
    });
  }

  async updateGroup(groupId: string, groupData: any): Promise<ApiResponse<any>> {
    return this.request(`/teacher/groups/${groupId}`, {
      method: 'PUT',
      body: JSON.stringify(groupData),
    });
  }

  async deleteGroup(groupId: string): Promise<ApiResponse<any>> {
    return this.request(`/teacher/groups/${groupId}`, {
      method: 'DELETE',
    });
  }

  async getTeacherSessions(): Promise<ApiResponse<any>> {
    return this.request('/teacher/sessions');
  }

  async createSession(sessionData: any): Promise<ApiResponse<any>> {
    return this.request('/teacher/sessions', {
      method: 'POST',
      body: JSON.stringify(sessionData),
    });
  }

  async updateSession(sessionId: string, sessionData: any): Promise<ApiResponse<any>> {
    return this.request(`/teacher/sessions/${sessionId}`, {
      method: 'PUT',
      body: JSON.stringify(sessionData),
    });
  }

  async deleteSession(sessionId: string): Promise<ApiResponse<any>> {
    return this.request(`/teacher/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  async getTeacherStudents(): Promise<ApiResponse<any>> {
    return this.request('/teacher/students');
  }

  // Admin endpoints
  async getAdminDashboard(): Promise<ApiResponse<any>> {
    return this.request('/admin/dashboard');
  }

  async getPendingTeachers(): Promise<ApiResponse<any>> {
    return this.request('/admin/teachers/pending');
  }

  async approveTeacher(teacherId: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/teachers/${teacherId}/approve`, {
      method: 'POST',
    });
  }

  async rejectTeacher(teacherId: string, reason?: string): Promise<ApiResponse<any>> {
    return this.request(`/admin/teachers/${teacherId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    });
  }

  async getAllUsers(): Promise<ApiResponse<any>> {
    return this.request('/admin/users');
  }

  async getAllGroups(): Promise<ApiResponse<any>> {
    return this.request('/admin/groups');
  }

  async getAllSessions(): Promise<ApiResponse<any>> {
    return this.request('/admin/sessions');
  }

  // Newsletter subscription
  async subscribeNewsletter(email: string): Promise<ApiResponse<any>> {
    return this.request('/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  }
}

export const apiClient = new ApiClient(API_BASE_URL);
export default apiClient;