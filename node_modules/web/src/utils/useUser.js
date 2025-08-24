import * as React from 'react';
import { useAuth } from './useAuth';
import { supabase } from '../lib/supabase';

const useUser = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = React.useState(null);
  const [profileLoading, setProfileLoading] = React.useState(false);

  const fetchProfile = React.useCallback(async () => {
    if (!user) {
      setProfile(null);
      return;
    }

    setProfileLoading(true);
    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.warn('Profile fetch error:', error);
      }

      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setProfileLoading(false);
    }
  }, [user]);

  React.useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const refetch = React.useCallback(() => {
    fetchProfile();
  }, [fetchProfile]);

  return { 
    user, 
    data: profile || user, 
    profile,
    loading: loading || profileLoading,
    refetch
  };
};

export { useUser }

export default useUser;