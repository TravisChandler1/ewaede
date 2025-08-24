import { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import useUser from '@/utils/useUser';
import { 
  UserCheck, 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  FileText,
  Award,
  BookOpen,
  Users
} from 'lucide-react';

export default function TeacherApplicationPage() {
  const { data: user, loading: userLoading } = useUser();
  const [formData, setFormData] = useState({
    qualifications: '',
    experience_years: '',
    teaching_subjects: [],
    cv_url: '',
    cover_letter: ''
  });
  const [errors, setErrors] = useState({});

  // Check existing application
  const { data: existingApplication, loading: applicationLoading } = useQuery({
    queryKey: ['teacherApplication'],
    queryFn: async () => {
      const response = await fetch('/api/teacher-application');
      if (response.status === 404) return null;
      if (!response.ok) throw new Error('Failed to fetch application');
      return response.json();
    },
    enabled: !!user
  });

  const submitApplication = useMutation({
    mutationFn: async (data) => {
      const response = await fetch('/api/teacher-application', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to submit application');
      }
      return response.json();
    },
    onSuccess: () => {
      // Redirect to success page or show success message
      window.location.href = '/dashboard';
    },
    onError: (error) => {
      setErrors({ submit: error.message });
    }
  });

  useEffect(() => {
    if (!userLoading && !user) {
      window.location.href = '/account/signin';
    }
  }, [user, userLoading]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors = {};
    if (!formData.qualifications.trim()) newErrors.qualifications = 'Qualifications are required';
    if (!formData.experience_years || formData.experience_years < 0) newErrors.experience_years = 'Valid experience years required';
    if (formData.teaching_subjects.length === 0) newErrors.teaching_subjects = 'At least one teaching subject is required';
    if (!formData.cover_letter.trim()) newErrors.cover_letter = 'Cover letter is required';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    submitApplication.mutate(formData);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubjectChange = (subject) => {
    setFormData(prev => ({
      ...prev,
      teaching_subjects: prev.teaching_subjects.includes(subject)
        ? prev.teaching_subjects.filter(s => s !== subject)
        : [...prev.teaching_subjects, subject]
    }));
  };

  if (userLoading || applicationLoading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  // Show existing application status
  if (existingApplication?.application) {
    const app = existingApplication.application;
    return (
      <div className="min-h-screen bg-[#0f172a] py-12 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8">
            <div className="text-center mb-8">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                app.status === 'approved' ? 'bg-green-500' :
                app.status === 'rejected' ? 'bg-red-500' :
                app.status === 'under_review' ? 'bg-blue-500' :
                'bg-yellow-500'
              }`}>
                {app.status === 'approved' ? <CheckCircle className="w-8 h-8 text-white" /> :
                 app.status === 'rejected' ? <AlertCircle className="w-8 h-8 text-white" /> :
                 <Clock className="w-8 h-8 text-white" />}
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Teacher Application Status</h1>
              <p className={`text-lg font-medium ${
                app.status === 'approved' ? 'text-green-400' :
                app.status === 'rejected' ? 'text-red-400' :
                app.status === 'under_review' ? 'text-blue-400' :
                'text-yellow-400'
              }`}>
                {app.status === 'approved' ? 'Approved' :
                 app.status === 'rejected' ? 'Rejected' :
                 app.status === 'under_review' ? 'Under Review' :
                 'Pending Review'}
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Application Details</h3>
                <div className="bg-[#334155] rounded-lg p-4 space-y-3">
                  <div>
                    <span className="text-[#cbd5e1] text-sm">Applied:</span>
                    <span className="text-white ml-2">{new Date(app.applied_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-[#cbd5e1] text-sm">Experience:</span>
                    <span className="text-white ml-2">{app.experience_years} years</span>
                  </div>
                  <div>
                    <span className="text-[#cbd5e1] text-sm">Subjects:</span>
                    <span className="text-white ml-2">{app.teaching_subjects?.join(', ')}</span>
                  </div>
                  {app.reviewed_at && (
                    <div>
                      <span className="text-[#cbd5e1] text-sm">Reviewed:</span>
                      <span className="text-white ml-2">{new Date(app.reviewed_at).toLocaleDateString()}</span>
                      {app.reviewer_name && (
                        <span className="text-[#cbd5e1] ml-2">by {app.reviewer_name}</span>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {app.status === 'rejected' && app.rejection_reason && (
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Rejection Reason</h3>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
                    <p className="text-red-400">{app.rejection_reason}</p>
                  </div>
                </div>
              )}

              {app.status === 'approved' && (
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-green-400">
                    Congratulations! Your teacher application has been approved. You can now access teacher features in your dashboard.
                  </p>
                </div>
              )}

              <div className="text-center">
                <a
                  href="/dashboard"
                  className="bg-[#06b6d4] text-white px-6 py-3 rounded-lg hover:bg-[#0891b2] transition-colors"
                >
                  Go to Dashboard
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const subjectOptions = [
    'Yoruba Language Basics',
    'Yoruba Grammar',
    'Yoruba Literature',
    'Yoruba Culture & History',
    'Yoruba Poetry',
    'Business Yoruba',
    'Yoruba for Children',
    'Advanced Yoruba',
    'Yoruba Pronunciation',
    'Yoruba Writing'
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] py-12 px-6">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#10b981] rounded-full flex items-center justify-center mx-auto mb-4">
            <UserCheck className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Apply to Become a Teacher</h1>
          <p className="text-[#cbd5e1] text-lg">
            Join our community of Yoruba language educators and help others learn
          </p>
        </div>

        <div className="bg-[#1e293b] border border-[#334155] rounded-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                <Award className="w-4 h-4 inline mr-2" />
                Qualifications *
              </label>
              <textarea
                name="qualifications"
                value={formData.qualifications}
                onChange={handleChange}
                rows={4}
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                placeholder="Describe your educational background, certifications, and relevant qualifications..."
              />
              {errors.qualifications && <p className="text-red-400 text-sm mt-1">{errors.qualifications}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                <Clock className="w-4 h-4 inline mr-2" />
                Years of Teaching Experience *
              </label>
              <input
                type="number"
                name="experience_years"
                value={formData.experience_years}
                onChange={handleChange}
                min="0"
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                placeholder="0"
              />
              {errors.experience_years && <p className="text-red-400 text-sm mt-1">{errors.experience_years}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                <BookOpen className="w-4 h-4 inline mr-2" />
                Teaching Subjects * (Select all that apply)
              </label>
              <div className="grid grid-cols-2 gap-3">
                {subjectOptions.map((subject) => (
                  <label key={subject} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.teaching_subjects.includes(subject)}
                      onChange={() => handleSubjectChange(subject)}
                      className="w-4 h-4 text-[#10b981] bg-[#334155] border-[#475569] rounded focus:ring-[#10b981]"
                    />
                    <span className="ml-2 text-[#cbd5e1] text-sm">{subject}</span>
                  </label>
                ))}
              </div>
              {errors.teaching_subjects && <p className="text-red-400 text-sm mt-1">{errors.teaching_subjects}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                <Upload className="w-4 h-4 inline mr-2" />
                CV/Resume URL (Optional)
              </label>
              <input
                type="url"
                name="cv_url"
                value={formData.cv_url}
                onChange={handleChange}
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                placeholder="https://example.com/your-cv.pdf"
              />
              <p className="text-[#94a3b8] text-xs mt-1">
                Upload your CV to a cloud service and paste the public link here
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#cbd5e1] mb-2">
                <FileText className="w-4 h-4 inline mr-2" />
                Cover Letter *
              </label>
              <textarea
                name="cover_letter"
                value={formData.cover_letter}
                onChange={handleChange}
                rows={6}
                className="w-full bg-[#334155] border border-[#475569] rounded-lg px-3 py-2 text-white placeholder-[#94a3b8] focus:outline-none focus:ring-2 focus:ring-[#10b981]"
                placeholder="Tell us why you want to teach Yoruba, your teaching philosophy, and what makes you a great educator..."
              />
              {errors.cover_letter && <p className="text-red-400 text-sm mt-1">{errors.cover_letter}</p>}
            </div>

            {errors.submit && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                <p className="text-red-400 text-sm">{errors.submit}</p>
              </div>
            )}

            <div className="flex gap-4">
              <a
                href="/dashboard"
                className="flex-1 bg-[#334155] text-white py-3 rounded-lg hover:bg-[#475569] transition-colors text-center"
              >
                Cancel
              </a>
              <button
                type="submit"
                disabled={submitApplication.isPending}
                className="flex-1 bg-[#10b981] text-white py-3 rounded-lg hover:bg-[#059669] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitApplication.isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Users className="w-4 h-4" />
                    Submit Application
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}