"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { BookOpen, User, GraduationCap } from "lucide-react";

export default function SignupPage() {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "",
    learningLevel: "",
    teachingType: ""
  });

  const { signUpWithCredentials } = useAuth();

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step === 1) {
      if (!formData.email || !formData.password || !formData.name) {
        setError("Please fill in all fields");
        return;
      }
    } else if (step === 2) {
      if (!formData.role) {
        setError("Please select your role");
        return;
      }
    }
    setError(null);
    setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.role === 'student' && (!formData.learningLevel || !formData.teachingType)) {
      setError("Please complete your learning preferences");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Store form data in localStorage temporarily for the profile creation
      localStorage.setItem('signupData', JSON.stringify(formData));

      await signUpWithCredentials({
        email: formData.email,
        password: formData.password,
        name: formData.name,
        role: formData.role,
        redirect: true,
      });
    } catch {
      setError("Something went wrong. Please try again.");
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

      <div className="relative z-10 w-full max-w-lg">
        <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-xl p-8 shadow-2xl">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <BookOpen size={32} className="text-[#4f46e5] mr-2" />
              <h1 className="font-inter font-bold text-2xl text-white">Ewa Ede Yoruba Academy</h1>
            </div>
            <p className="text-[#a1a1aa] font-inter">Join our community of Yoruba learners</p>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-medium text-sm ${
                  num <= step
                    ? 'bg-[#4f46e5] text-white'
                    : 'bg-[#2a2a2a] text-[#6b7280]'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-8 h-0.5 mx-2 ${
                    num < step ? 'bg-[#4f46e5]' : 'bg-[#2a2a2a]'
                  }`} />
                )}
              </div>
            ))}
          </div>

          <form onSubmit={step === 3 ? handleSubmit : (e) => { e.preventDefault(); handleNext(); }}>
            {/* Step 1: Basic Information */}
            {step === 1 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Basic Information</h2>

                <div>
                  <label className="block text-sm font-medium text-[#d1d5db] mb-2">Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                    placeholder="Enter your full name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#d1d5db] mb-2">Email</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                    placeholder="Enter your email"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#d1d5db] mb-2">Password</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="w-full px-4 py-3 bg-[#0f0f0f] border border-[#374151] rounded-lg text-white placeholder-[#6b7280] focus:border-[#4f46e5] focus:outline-none transition-colors"
                    placeholder="Create a password"
                  />
                </div>
              </div>
            )}

            {/* Step 2: Role Selection */}
            {step === 2 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">Choose Your Role</h2>

                <div className="grid grid-cols-1 gap-4">
                  <div
                    onClick={() => handleInputChange('role', 'student')}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      formData.role === 'student'
                        ? 'border-[#4f46e5] bg-[#4f46e5]/10'
                        : 'border-[#374151] hover:border-[#4b5563]'
                    }`}
                  >
                    <div className="flex items-center">
                      <User className="w-8 h-8 text-[#4f46e5] mr-4" />
                      <div>
                        <h3 className="font-semibold text-white">Student</h3>
                        <p className="text-sm text-[#a1a1aa]">Learn Yoruba language at your own pace</p>
                      </div>
                    </div>
                  </div>

                  <div
                    onClick={() => handleInputChange('role', 'teacher')}
                    className={`p-6 border rounded-lg cursor-pointer transition-all ${
                      formData.role === 'teacher'
                        ? 'border-[#4f46e5] bg-[#4f46e5]/10'
                        : 'border-[#374151] hover:border-[#4b5563]'
                    }`}
                  >
                    <div className="flex items-center">
                      <GraduationCap className="w-8 h-8 text-[#4f46e5] mr-4" />
                      <div>
                        <h3 className="font-semibold text-white">Teacher</h3>
                        <p className="text-sm text-[#a1a1aa]">Share your knowledge and teach others</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Step 3: Learning Preferences (for students only) */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-white mb-4">
                  {formData.role === 'student' ? 'Learning Preferences' : 'Almost Done!'}
                </h2>

                {formData.role === 'student' ? (
                  <>
                    <div>
                      <label className="block text-sm font-medium text-[#d1d5db] mb-3">Learning Level</label>
                      <div className="grid grid-cols-2 gap-3">
                        {[
                          { value: 'novice', label: 'Novice', price: '$29/mo' },
                          { value: 'beginner', label: 'Beginner', price: '$39/mo' },
                          { value: 'advanced', label: 'Advanced', price: '$49/mo' },
                          { value: 'pro', label: 'Pro', price: '$59/mo' }
                        ].map((level) => (
                          <div
                            key={level.value}
                            onClick={() => handleInputChange('learningLevel', level.value)}
                            className={`p-4 border rounded-lg cursor-pointer transition-all ${
                              formData.learningLevel === level.value
                                ? 'border-[#4f46e5] bg-[#4f46e5]/10'
                                : 'border-[#374151] hover:border-[#4b5563]'
                            }`}
                          >
                            <div className="text-center">
                              <p className="font-semibold text-white">{level.label}</p>
                              <p className="text-sm text-[#4f46e5]">{level.price}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#d1d5db] mb-3">Teaching Style</label>
                      <div className="grid grid-cols-2 gap-3">
                        <div
                          onClick={() => handleInputChange('teachingType', 'individual')}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.teachingType === 'individual'
                              ? 'border-[#4f46e5] bg-[#4f46e5]/10'
                              : 'border-[#374151] hover:border-[#4b5563]'
                          }`}
                        >
                          <div className="text-center">
                            <p className="font-semibold text-white">Individual</p>
                            <p className="text-sm text-[#a1a1aa]">One-on-one</p>
                          </div>
                        </div>
                        <div
                          onClick={() => handleInputChange('teachingType', 'group')}
                          className={`p-4 border rounded-lg cursor-pointer transition-all ${
                            formData.teachingType === 'group'
                              ? 'border-[#4f46e5] bg-[#4f46e5]/10'
                              : 'border-[#374151] hover:border-[#4b5563]'
                          }`}
                        >
                          <div className="text-center">
                            <p className="font-semibold text-white">Group</p>
                            <p className="text-sm text-[#a1a1aa]">Class setting</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <div className="text-center py-8">
                    <GraduationCap className="w-16 h-16 text-[#4f46e5] mx-auto mb-4" />
                    <p className="text-[#a1a1aa]">Ready to start your teaching journey?</p>
                  </div>
                )}
              </div>
            )}

            {error && (
              <div className="bg-[#ef4444]/10 border border-[#ef4444]/20 rounded-lg p-3 text-[#ef4444] text-sm mt-4">
                {error}
              </div>
            )}

            <div className="flex justify-between mt-8">
              {step > 1 && (
                <button
                  type="button"
                  onClick={() => setStep(step - 1)}
                  className="px-6 py-3 border border-[#374151] text-[#d1d5db] rounded-lg hover:border-[#4b5563] transition-colors"
                >
                  Back
                </button>
              )}

              <button
                type="submit"
                disabled={loading}
                className="ml-auto px-8 py-3 bg-[#4f46e5] hover:bg-[#4338ca] text-white rounded-lg font-medium transition-colors disabled:opacity-50"
              >
                {loading ? "Creating Account..." : step === 3 ? "Create Account" : "Next"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-[#6b7280] text-sm">
              Already have an account?{" "}
              <a href="/auth/signin" className="text-[#4f46e5] hover:text-[#4338ca] transition-colors">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}