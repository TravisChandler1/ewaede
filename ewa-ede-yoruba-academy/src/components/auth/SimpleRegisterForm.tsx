'use client';

import { useState } from 'react';
import Link from 'next/link';
import { BookOpen, CheckCircle } from 'lucide-react';

export default function SimpleRegisterForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'STUDENT',
    level: 'NOVICE'
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Basic validation
    if (!formData.name || !formData.email || !formData.password) {
      setErrors({ form: 'Name, email, and password are required' });
      setLoading(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setErrors({ form: 'Please enter a valid email address' });
      setLoading(false);
      return;
    }

    if (formData.password.length < 8) {
      setErrors({ form: 'Password must be at least 8 characters long' });
      setLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ form: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role: formData.role,
          level: formData.level
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Registration failed');
      }

      setSuccess(true);

      // Auto-redirect after 2 seconds
      setTimeout(() => {
        const role = formData.role.toLowerCase();
        if (role === 'admin') {
          window.location.href = '/admin/dashboard';
        } else if (role === 'teacher') {
          window.location.href = '/dashboard/teacher';
        } else {
          window.location.href = '/dashboard/student';
        }
      }, 2000);
    } catch (err) {
      setErrors({ form: err instanceof Error ? err.message : 'Registration failed' });
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl max-w-md w-full text-center">
          <div className="flex items-center justify-center mb-4">
            <CheckCircle size={32} className="text-[#4f46e5] mr-2" />
            <h1 className="font-bold text-2xl text-white">Success!</h1>
          </div>
          <p className="text-[#a1a1aa] mb-6">Your account has been created successfully.</p>
          <Link
            href="/auth/signin"
            className="inline-block px-6 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors"
          >
            Sign In Now
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f0f] flex items-center justify-center p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <BookOpen size={32} className="text-[#4f46e5] mr-2" />
            <h1 className="font-bold text-2xl text-white">Create Account</h1>
          </div>
          <p className="text-[#a1a1aa]">Join Ẹwà Èdè Yorùbá Academy</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">Full Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
              placeholder="Enter your full name"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">Password</label>
            <input
              type="password"
              value={formData.password}
              onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
              placeholder="Enter your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">Confirm Password</label>
            <input
              type="password"
              value={formData.confirmPassword}
              onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
              placeholder="Confirm your password"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#d1d5db] mb-2">I am a</label>
            <select
              value={formData.role}
              onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white focus:border-[#4f46e5] focus:outline-none transition-colors"
            >
              <option value="STUDENT">Student</option>
              <option value="TEACHER">Teacher</option>
            </select>
          </div>

          {formData.role === 'STUDENT' && (
            <div>
              <label className="block text-sm font-medium text-[#d1d5db] mb-2">Learning Level</label>
              <select
                value={formData.level}
                onChange={(e) => setFormData(prev => ({ ...prev, level: e.target.value }))}
                className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white focus:border-[#4f46e5] focus:outline-none transition-colors"
              >
                <option value="NOVICE">Novice (Beginner)</option>
                <option value="BEGINNER">Beginner</option>
                <option value="INTERMEDIATE">Intermediate</option>
                <option value="ADVANCED">Advanced</option>
                <option value="PRO">Pro (Expert)</option>
              </select>
            </div>
          )}

          {errors.form && (
            <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 text-[#ef4444] text-sm">
              {errors.form}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full px-4 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-[#6b7280] text-sm">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-[#4f46e5] hover:text-[#4338ca] transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}