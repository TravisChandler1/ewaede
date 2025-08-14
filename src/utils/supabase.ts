import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL!;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Database types (you can generate these with Supabase CLI)
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          password: string;
          firstName: string;
          lastName: string;
          role: 'STUDENT' | 'TEACHER' | 'ADMIN';
          avatar: string | null;
          teacherStatus: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
          learningLevel: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO' | null;
          teachingType: 'INDIVIDUAL' | 'GROUP' | null;
          createdAt: string;
          updatedAt: string;
        };
        Insert: {
          id?: string;
          email: string;
          password: string;
          firstName: string;
          lastName: string;
          role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
          avatar?: string | null;
          teacherStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
          learningLevel?: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO' | null;
          teachingType?: 'INDIVIDUAL' | 'GROUP' | null;
          createdAt?: string;
          updatedAt?: string;
        };
        Update: {
          id?: string;
          email?: string;
          password?: string;
          firstName?: string;
          lastName?: string;
          role?: 'STUDENT' | 'TEACHER' | 'ADMIN';
          avatar?: string | null;
          teacherStatus?: 'PENDING' | 'APPROVED' | 'REJECTED' | null;
          learningLevel?: 'NOVICE' | 'BEGINNER' | 'ADVANCED' | 'PRO' | null;
          teachingType?: 'INDIVIDUAL' | 'GROUP' | null;
          createdAt?: string;
          updatedAt?: string;
        };
      };
      // Add other table types as needed
    };
  };
};

export default supabase;