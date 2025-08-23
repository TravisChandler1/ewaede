import { useState } from "react";
import { useNavigate } from "react-router";
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
    teachingPreference: 'group',
    // Teacher-specific fields
    qualifications: '',
    experienceYears: 0,
    teachingSubjects: [],
    coverLetter: ''
  });

  const { signUp } = useAuth();
  const navigate = useNavigate();

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
      // Create the account using the new auth system
      const result = await signUp({
        email: formData.email,
        password: formData.password,
        name: formData.fullName,
        role: formData.role,
        // Teacher-specific data
        qualifications: formData.qualifications,
        experience_years: formData.experienceYears,
        teaching_subjects: formData.teachingSubjects,
        cover_letter: formData.coverLetter
      });

      if (result.success) {
        // Store the profile data temporarily in localStorage
        localStorage.setItem('pendingProfile', JSON.stringify({
          fullName: formData.fullName,
          role: formData.role,
          learningLevel: formData.role === 'student' ? formData.learningLevel : null,
          teachingPreference: formData.role === 'student' ? formData.teachingPreference : null
        }));

        // Redirect based on role
        if (formData.role === 'teacher') {
          navigate('/account/pending-approval');
        } else {
          navigate('/dashboard/setup');
        }
      } else {
        setError(result.error || "Sign-up failed. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
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
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                    Qualifications *
                  </label>
                  <textarea
                    required
                    name="qualifications"
                    value={formData.qualifications}
                    onChange={handleInputChange}
                    placeholder="Describe your qualifications, certifications, and educational background..."
                    rows={3}
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                    Years of Teaching Experience *
                  </label>
                  <input
                    required
                    name="experienceYears"
                    type="number"
                    min="0"
                    max="50"
                    value={formData.experienceYears}
                    onChange={handleInputChange}
                    placeholder="Number of years"
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                    Teaching Subjects *
                  </label>
                  <div className="space-y-2">
                    {['Yoruba Grammar', 'Yoruba Conversation', 'Yoruba Culture', 'Yoruba Literature', 'Yoruba History', 'Yoruba Music'].map((subject) => (
                      <label key={subject} className="flex items-center gap-3 p-3 rounded-lg bg-[#334155] border border-[#475569] hover:border-[#10b981] cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.teachingSubjects.includes(subject)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setFormData(prev => ({
                                ...prev,
                                teachingSubjects: [...prev.teachingSubjects, subject]
                              }));
                            } else {
                              setFormData(prev => ({
                                ...prev,
                                teachingSubjects: prev.teachingSubjects.filter(s => s !== subject)
                              }));
                            }
                          }}
                          className="w-4 h-4 text-[#10b981] bg-[#334155] border-[#475569] rounded focus:ring-[#10b981] focus:ring-2"
                        />
                        <span className="text-[#cbd5e1]">{subject}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                    Cover Letter *
                  </label>
                  <textarea
                    required
                    name="coverLetter"
                    value={formData.coverLetter}
                    onChange={handleInputChange}
                    placeholder="Tell us about your teaching philosophy, why you want to teach Yoruba, and what makes you a great teacher..."
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg bg-[#334155] border border-[#475569] text-white placeholder-[#94a3b8] focus:outline-none focus:border-[#10b981] focus:ring-1 focus:ring-[#10b981]"
                  />
                </div>

                <div className="bg-[#334155] border border-[#475569] rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-white mb-2">📋 Application Process</h3>
                  <ul className="space-y-1 text-xs text-[#cbd5e1]">
                    <li>• Your application will be reviewed by our admin team</li>
                    <li>• You'll receive an email notification once reviewed</li>
                    <li>• Approved teachers can access the full dashboard</li>
                    <li>• This process typically takes 1-3 business days</li>
                  </ul>
                </div>
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