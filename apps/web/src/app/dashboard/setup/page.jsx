import { useState, useEffect } from 'react';
import useUser from '@/utils/useUser';

export default function ProfileSetupPage() {
  const { data: user, loading: userLoading } = useUser();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = '/account/signin';
      return;
    }

    // Check if user already has a profile
    if (user) {
      checkExistingProfile();
    }
  }, [user, userLoading]);

  const checkExistingProfile = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        if (data.profile) {
          // User already has a profile, redirect to dashboard
          window.location.href = '/dashboard';
          return;
        }
      }
    } catch (error) {
      console.error('Error checking profile:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      // Get stored profile data from localStorage
      const pendingProfile = localStorage.getItem('pendingProfile');
      if (!pendingProfile) {
        setError('Profile data not found. Please sign up again.');
        setLoading(false);
        return;
      }

      const profileData = JSON.parse(pendingProfile);

      const response = await fetch('/api/user/profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData)
      });

      if (response.ok) {
        // Clear the temporary data
        localStorage.removeItem('pendingProfile');
        setSuccess(true);
        
        // Redirect to dashboard after a short delay
        setTimeout(() => {
          window.location.href = '/dashboard';
        }, 2000);
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to setup profile');
      }
    } catch (error) {
      console.error('Setup error:', error);
      setError('Failed to setup profile. Please try again.');
    }

    setLoading(false);
  };

  if (userLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to signin
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
        <div className="text-center">
          <div className="w-20 h-20 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-3xl">✓</span>
          </div>
          <h1 className="text-3xl font-bold text-white mb-4">Welcome to Ewa Ede Yoruba Academy!</h1>
          <p className="text-[#cbd5e1] text-lg mb-6">Your profile has been successfully created.</p>
          <p className="text-[#cbd5e1]">Redirecting to your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] flex items-center justify-center">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Complete Your Setup</h1>
          </div>
          
          <p className="text-[#cbd5e1] mb-8">
            Welcome {user.email}! Let's finish setting up your Yoruba learning profile.
          </p>

          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
              {error}
            </div>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full px-6 py-4 bg-gradient-to-r from-[#10b981] to-[#06b6d4] hover:from-[#059669] hover:to-[#0891b2] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Setting up...' : 'Complete Setup'}
          </button>

          <a 
            href="/account/signup"
            className="block mt-4 text-[#06b6d4] hover:text-[#0891b2] transition-colors text-sm"
          >
            Go back to signup
          </a>
        </div>
      </div>
    </div>
  );
}