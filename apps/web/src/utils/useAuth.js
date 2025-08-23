import { useCallback, useState, useEffect, createContext, useContext } from 'react';
import { supabase } from '../lib/supabase';

// Supabase auth context
const AuthContext = createContext({
  user: null,
  signIn: () => {},
  signUp: () => {},
  signOut: () => {},
  loading: false,
  error: null
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user ?? null);
      } catch (error) {
        console.error('Error getting initial session:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const signIn = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Check if user profile exists in database
        const { data: profile, error: profileError } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', data.user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') {
          console.warn('Profile fetch error:', profileError);
        }

        // If user is a teacher, check if they're approved
        if (profile && profile.role === 'teacher') {
          const { data: application, error: appError } = await supabase
            .from('teacher_applications')
            .select('status, rejection_reason')
            .eq('user_id', data.user.id)
            .single();

          if (appError && appError.code !== 'PGRST116') {
            console.warn('Teacher application fetch error:', appError);
          }

          if (application) {
            if (application.status === 'pending') {
              setError('Your teacher application is still under review. Please wait for admin approval.');
              await supabase.auth.signOut(); // Sign them out
              return { success: false, error: 'Your teacher application is still under review. Please wait for admin approval.' };
            } else if (application.status === 'rejected') {
              setError(`Your teacher application was rejected. Reason: ${application.rejection_reason || 'No reason provided'}`);
              await supabase.auth.signOut(); // Sign them out
              return { success: false, error: `Your teacher application was rejected. Reason: ${application.rejection_reason || 'No reason provided'}` };
            } else if (application.status === 'under_review') {
              setError('Your teacher application is currently under review. Please wait for admin decision.');
              await supabase.auth.signOut(); // Sign them out
              return { success: false, error: 'Your teacher application is currently under review. Please wait for admin decision.' };
            }
            // If status is 'approved', continue with sign in
          }
        }

        return { success: true, user: data.user, profile };
      }

      return { success: false, error: 'Sign in failed' };
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signUp = useCallback(async (credentials) => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            full_name: credentials.name,
            role: credentials.role || 'student'
          }
        }
      });

      if (error) {
        setError(error.message);
        return { success: false, error: error.message };
      }

      if (data.user) {
        // Create user profile in database
        const { error: profileError } = await supabase
          .from('user_profiles')
          .insert({
            user_id: data.user.id,
            full_name: credentials.name,
            email: credentials.email,
            role: credentials.role || 'student',
            is_active: credentials.role === 'student', // Only students are active by default
            created_at: new Date().toISOString()
          });

        if (profileError) {
          console.warn('Profile creation error:', profileError);
        }

        // If user selected teacher role, create teacher application
        if (credentials.role === 'teacher') {
          const { error: applicationError } = await supabase
            .from('teacher_applications')
            .insert({
              user_id: data.user.id,
              full_name: credentials.name,
              email: credentials.email,
              qualifications: credentials.qualifications || '',
              experience_years: credentials.experience_years || 0,
              teaching_subjects: credentials.teaching_subjects || [],
              cover_letter: credentials.cover_letter || '',
              status: 'pending',
              applied_at: new Date().toISOString()
            });

          if (applicationError) {
            console.warn('Teacher application creation error:', applicationError);
          }
        }

        return { success: true, user: data.user };
      }

      return { success: false, error: 'Sign up failed' };
    } catch (error) {
      const errorMessage = error.message || 'An unexpected error occurred';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  }, []);

  const signOut = useCallback(async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setError(error.message);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ 
      user, 
      signIn, 
      signUp, 
    signOut,
      loading, 
      error 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default useAuth;