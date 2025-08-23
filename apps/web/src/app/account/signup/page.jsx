import { useState } from "react";
import useAuth from "@/utils/useAuth";

function SignUpPage() {
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    fullName: '',
    role: 'student',
    learningLevel: 'novice',
    teachingPreference: 'group'
  });

  const { signUpWithCredentials } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!formData.email || !formData.password || !formData.fullName) {
      setError("Please fill in all required fields");
      setLoading(false);
      return;
    }

    try {
      // First create the account
      await signUpWithCredentials({
        email: formData.email,
        password: formData.password,
        callbackUrl: "/dashboard/setup",
        redirect: false,
      });

      // Store the profile data temporarily in localStorage
      localStorage.setItem('pendingProfile', JSON.stringify({
        fullName: formData.fullName,
        role: formData.role,
        learningLevel: formData.role === 'student' ? formData.learningLevel : null,
        teachingPreference: formData.role === 'student' ? formData.teachingPreference : null
      }));

      // Redirect to setup page
      window.location.href = '/dashboard/setup';
    } catch (err) {
      const errorMessages = {
        OAuthSignin: "Couldn't start sign-up. Please try again or use a different method.",
        OAuthCallback: "Sign-up failed after redirecting. Please try again.",
        OAuthCreateAccount: "Couldn't create an account with this sign-up option. Try another one.",
        EmailCreateAccount: "This email can't be used. It may already be registered.",
        Callback: "Something went wrong during sign-up. Please try again.",
        OAuthAccountNotLinked: "This account is linked to a different sign-in method. Try using that instead.",
        CredentialsSignin: "Invalid email or password. If you already have an account, try signing in instead.",
        AccessDenied: "You don't have permission to sign up.",
        Configuration: "Sign-up isn't working right now. Please try again later.",
        Verification: "Your sign-up link has expired. Request a new one.",
      };

      setError(errorMessages[err.message] || "Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  const learningLevels = [
    { value: 'novice', label: 'Novice - Perfect for absolute beginners', price: '$29' },
    { value: 'beginner', label: 'Beginner - Build conversational skills', price: '$49' },
    { value: 'advanced', label: 'Advanced - Master complex grammar', price: '$79' },
    { value: 'pro', label: 'Pro - Achieve fluency & cultural mastery', price: '$129' }
  ];

  return (
    <div 
      className="min-h-screen flex items-center justify-center px-6"
      style={{
        backgroundImage: 'url(https://images.unsplash.com/photo-1481627834876-b7833e8f5570?auto=format&fit=crop&w=2000&q=80)',
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="absolute inset-0 bg-[#0f172a]/85"></div>
      
      <form
        noValidate
        onSubmit={onSubmit}
        className="relative w-full max-w-2xl bg-[#1e293b]/95 backdrop-blur-sm border border-[#334155] rounded-2xl p-8 shadow-2xl"
      >
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] flex items-center justify-center">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Join Ewa Ede Yoruba Academy</h1>
          </div>
          <p className="text-[#cbd5e1]">Start your Yoruba learning journey today</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column - Basic Info */}
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Full Name *
              </label>
              <input
                required
                name="fullName"
                type="text"
                value={formData.fullName}
                onChange={handleInputChange}
                placeholder="Enter your full name"
                className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Email Address *
              </label>
              <input
                required
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                Password *
              </label>
              <input
                required
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Create a password"
                className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#06b6d4] focus:ring-1 focus:ring-[#06b6d4]"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                I want to join as a *
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.role === 'student'
                      ? 'bg-[#06b6d4] border-[#06b6d4] text-white'
                      : 'bg-[#334155] border-[#475569] text-[#cbd5e1] hover:border-[#06b6d4]'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">🎓</div>
                    <div className="font-semibold">Student</div>
                    <div className="text-sm opacity-75">Learn Yoruba</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, role: 'teacher' }))}
                  className={`p-4 rounded-lg border transition-all ${
                    formData.role === 'teacher'
                      ? 'bg-[#10b981] border-[#10b981] text-white'
                      : 'bg-[#334155] border-[#475569] text-[#cbd5e1] hover:border-[#10b981]'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-2xl mb-2">👨‍🏫</div>
                    <div className="font-semibold">Teacher</div>
                    <div className="text-sm opacity-75">Teach Yoruba</div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Role-specific Options */}
          <div className="space-y-6">
            {formData.role === 'student' && (
              <>
                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                    Learning Level *
                  </label>
                  <div className="space-y-2">
                    {learningLevels.map((level) => (
                      <button
                        key={level.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, learningLevel: level.value }))}
                        className={`w-full p-3 rounded-lg border text-left transition-all ${
                          formData.learningLevel === level.value
                            ? 'bg-[#06b6d4] border-[#06b6d4] text-white'
                            : 'bg-[#334155] border-[#475569] text-[#cbd5e1] hover:border-[#06b6d4]'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <div>
                            <div className="font-semibold">{level.label}</div>
                          </div>
                          <div className="font-bold">{level.price}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                    Teaching Preference *
                  </label>
                  <div className="grid grid-cols-1 gap-3">
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, teachingPreference: 'group' }))}
                      className={`p-4 rounded-lg border transition-all ${
                        formData.teachingPreference === 'group'
                          ? 'bg-[#8b5cf6] border-[#8b5cf6] text-white'
                          : 'bg-[#334155] border-[#475569] text-[#cbd5e1] hover:border-[#8b5cf6]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">👥</div>
                        <div className="font-semibold">Group Learning</div>
                        <div className="text-sm opacity-75">Learn with peers</div>
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormData(prev => ({ ...prev, teachingPreference: 'individual' }))}
                      className={`p-4 rounded-lg border transition-all ${
                        formData.teachingPreference === 'individual'
                          ? 'bg-[#f59e0b] border-[#f59e0b] text-white'
                          : 'bg-[#334155] border-[#475569] text-[#cbd5e1] hover:border-[#f59e0b]'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-2xl mb-2">👤</div>
                        <div className="font-semibold">Individual Learning</div>
                        <div className="text-sm opacity-75">One-on-one sessions</div>
                      </div>
                    </button>
                  </div>
                </div>
              </>
            )}

            {formData.role === 'teacher' && (
              <div className="bg-[#334155] border border-[#475569] rounded-lg p-6">
                <h3 className="text-lg font-semibold text-white mb-4">Teacher Benefits</h3>
                <ul className="space-y-2 text-[#cbd5e1]">
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                    Comprehensive teacher dashboard
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                    Student progress monitoring
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                    Live session management
                  </li>
                  <li className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-[#10b981] rounded-full"></div>
                    Analytics and reporting
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mt-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-8 px-6 py-4 bg-gradient-to-r from-[#10b981] to-[#06b6d4] hover:from-[#059669] hover:to-[#0891b2] text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Creating Account..." : "Create Account"}
        </button>

        <p className="text-center text-sm text-[#cbd5e1] mt-6">
          Already have an account?{" "}
          <a
            href={`/account/signin${
              typeof window !== "undefined" ? window.location.search : ""
            }`}
            className="text-[#06b6d4] hover:text-[#0891b2] transition-colors"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}

export default SignUpPage;