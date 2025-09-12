'use client';

import { useState, Suspense } from 'react';
import { signIn } from 'next-auth/react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import PasswordInput from '@/components/ui/PasswordInput';

// Helper function to get role-based dashboard URL
const getDashboardUrl = (role?: string): string => {
  if (!role) return '/dashboard';

  switch (role.toUpperCase()) {
    case 'STUDENT':
      return '/dashboard/student';
    case 'TEACHER':
    case 'PENDING_TEACHER':
      return '/dashboard/teacher';
    case 'ADMIN':
      return '/admin/dashboard';
    default:
      return '/dashboard';
  }
};

function SignInFormContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailError, setEmailError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard';

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);

    if (value && !validateEmail(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      // Get user role first to determine redirect URL
      const userCheckResponse = await fetch('/api/auth/check-user', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      if (!userCheckResponse.ok) {
        const errorData = await userCheckResponse.json();
        setError(errorData.error || 'Invalid email or password');
        setIsLoading(false);
        return;
      }

      const userData = await userCheckResponse.json();

      // Determine redirect URL based on role
      const dashboardUrl = getDashboardUrl(userData.role);

      // Use NextAuth's built-in redirect functionality
      const result = await signIn('credentials', {
        email,
        password,
        callbackUrl: dashboardUrl,
        redirect: false, // Don't redirect automatically
      });

      // Handle the result manually
      if (result?.error) {
        setError(result.error);
        setIsLoading(false);
      } else {
        // Manually redirect to the dashboard
        window.location.href = dashboardUrl;
      }

    } catch {
      setError('An error occurred during sign in');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white">Sign In</h2>
            <p className="text-[#a1a1aa] mt-2">
              Welcome back to Ẹwà Èdè Yorùbá Academy
            </p>
          </div>

          {(error || emailError) && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 mb-6">
              <p className="text-[#ef4444] text-sm">{error || emailError}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
                required
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                placeholder="Enter your email"
                value={email}
                onChange={handleEmailChange}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-[#4f46e5] focus:ring-[#4f46e5] border-[#374151] rounded bg-[#0f0f0f]"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-[#a1a1aa]">
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a href="#" className="font-medium text-[#4f46e5] hover:text-[#4338ca]">
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full px-4 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6b7280] text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/auth/register" className="text-[#4f46e5] hover:text-[#4338ca] transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function SignInForm() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInFormContent />
    </Suspense>
  );
}
