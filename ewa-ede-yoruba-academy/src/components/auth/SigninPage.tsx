"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BookOpen } from "lucide-react";

export default function SigninPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!email || !password) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    try {
      console.log('Attempting sign in for:', email);

      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      console.log('Sign in result:', result);

      if (result?.error) {
        console.error('Sign in error:', result.error);
        setError("Invalid email or password. Please try again.");
      } else if (result?.ok) {
        console.log('Sign in successful, redirecting to dashboard');
        // Get user role from session to determine redirect destination
        console.log('Fetching session data...');
        const sessionResponse = await fetch('/api/auth/session');
        console.log('Session response status:', sessionResponse.status);

        if (!sessionResponse.ok) {
          console.error('Failed to fetch session:', sessionResponse.status, sessionResponse.statusText);
          setError('Failed to retrieve session. Please try again.');
          return;
        }

        const sessionData = await sessionResponse.json();
        console.log('Session data received:', sessionData);

        if (sessionData?.user?.role) {
          const role = sessionData.user.role.toLowerCase();
          console.log('User role found:', role);
          if (role === 'admin') {
            console.log('Redirecting to admin dashboard');
            router.push('/admin/dashboard');
          } else if (role === 'teacher') {
            console.log('Redirecting to teacher dashboard');
            router.push('/dashboard/teacher');
          } else {
            console.log('Redirecting to student dashboard');
            router.push('/dashboard/student');
          }
        } else {
          console.log('No role found in session, redirecting to generic dashboard');
          router.push('/dashboard');
        }
      } else {
        console.log('Sign in result:', result);
        setError("An unexpected error occurred. Please try again.");
      }
    } catch (err) {
      console.error('Sign in exception:', err);
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      {/* Background Pattern */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=2000&q=80')",
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen size={32} className="text-[#4f46e5] mr-2" />
              <h1 className="font-inter font-bold text-2xl text-white">Ẹwà Èdè Yorùbá Academy</h1>
            </div>
            <p className="text-[#a1a1aa] font-inter">Welcome back to your learning journey</p>
          </div>

          <form onSubmit={onSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                placeholder="Enter your password"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 text-[#ef4444] text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6b7280] text-sm">
              Don&apos;t have an account?{" "}
              <a href="/auth/register" className="text-[#4f46e5] hover:text-[#4338ca] transition-colors">
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}