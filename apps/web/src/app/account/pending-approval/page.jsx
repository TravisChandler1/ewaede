import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
import { Clock, CheckCircle, XCircle, Mail, ArrowLeft } from "lucide-react";

function PendingApprovalPage() {
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          navigate('/account/signin');
          return;
        }

        const { data, error } = await supabase
          .from('teacher_applications')
          .select('*')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching application:', error);
        } else {
          setApplication(data);
        }
      } catch (error) {
        console.error('Error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [navigate]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06b6d4] mx-auto mb-4"></div>
          <p className="text-[#cbd5e1]">Loading your application...</p>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0f172a]">
        <div className="text-center">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Application Not Found</h2>
          <p className="text-[#cbd5e1] mb-6">We couldn't find your teacher application.</p>
          <button
            onClick={() => navigate('/account/signup')}
            className="px-6 py-3 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2] transition-colors"
          >
            Apply Again
          </button>
        </div>
      </div>
    );
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-6 w-6 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-6 w-6 text-red-500" />;
      case 'under_review':
        return <Clock className="h-6 w-6 text-blue-500" />;
      default:
        return <Clock className="h-6 w-6 text-gray-500" />;
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending':
        return 'Pending Review';
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'under_review':
        return 'Under Review';
      default:
        return 'Unknown Status';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20';
      case 'approved':
        return 'text-green-500 bg-green-500/10 border-green-500/20';
      case 'rejected':
        return 'text-red-500 bg-red-500/10 border-red-500/20';
      case 'under_review':
        return 'text-blue-500 bg-blue-500/10 border-blue-500/20';
      default:
        return 'text-gray-500 bg-gray-500/10 border-gray-500/20';
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-6">
      <div className="w-full max-w-2xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-gradient-to-r from-[#10b981] to-[#06b6d4] flex items-center justify-center">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <h1 className="text-3xl font-bold text-white">Teacher Application</h1>
          </div>
          <p className="text-[#cbd5e1]">Your application is being reviewed</p>
        </div>

        {/* Application Status Card */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-2xl p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-white">Application Status</h2>
            <div className={`flex items-center gap-2 px-4 py-2 rounded-lg border ${getStatusColor(application.status)}`}>
              {getStatusIcon(application.status)}
              <span className="font-medium">{getStatusText(application.status)}</span>
            </div>
          </div>

          {/* Application Details */}
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Full Name</h3>
              <p className="text-white">{application.full_name}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Email</h3>
              <p className="text-white">{application.email}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Experience</h3>
              <p className="text-white">{application.experience_years} years</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Teaching Subjects</h3>
              <div className="flex flex-wrap gap-2">
                {application.teaching_subjects?.map((subject, index) => (
                  <span key={index} className="px-3 py-1 bg-[#334155] text-[#cbd5e1] rounded-full text-sm">
                    {subject}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Applied On</h3>
              <p className="text-white">{new Date(application.applied_at).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Status-specific messages */}
          {application.status === 'pending' && (
            <div className="mt-6 p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-yellow-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-yellow-400 mb-1">Application Submitted</h4>
                  <p className="text-sm text-yellow-300">
                    Thank you for your application! Our admin team will review your qualifications and get back to you within 1-3 business days.
                  </p>
                </div>
              </div>
            </div>
          )}

          {application.status === 'under_review' && (
            <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-blue-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-400 mb-1">Under Review</h4>
                  <p className="text-sm text-blue-300">
                    Your application is currently being reviewed by our team. We'll notify you as soon as a decision is made.
                  </p>
                </div>
              </div>
            </div>
          )}

          {application.status === 'approved' && (
            <div className="mt-6 p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-400 mb-1">Application Approved!</h4>
                  <p className="text-sm text-green-300 mb-3">
                    Congratulations! Your teacher application has been approved. You can now access your teacher dashboard.
                  </p>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                  >
                    Go to Dashboard
                  </button>
                </div>
              </div>
            </div>
          )}

          {application.status === 'rejected' && (
            <div className="mt-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <div className="flex items-start gap-3">
                <XCircle className="h-5 w-5 text-red-500 mt-0.5" />
                <div>
                  <h4 className="font-medium text-red-400 mb-1">Application Rejected</h4>
                  <p className="text-sm text-red-300 mb-2">
                    {application.rejection_reason || 'Your application was not approved at this time.'}
                  </p>
                  <button
                    onClick={() => navigate('/account/signup')}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Apply Again
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4">
          <button
            onClick={() => navigate('/')}
            className="flex items-center justify-center gap-2 px-6 py-3 bg-[#334155] text-[#cbd5e1] rounded-lg hover:bg-[#475569] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </button>
          <button
            onClick={handleSignOut}
            className="px-6 py-3 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c] transition-colors"
          >
            Sign Out
          </button>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center gap-2 text-[#94a3b8] mb-2">
            <Mail className="h-4 w-4" />
            <span className="text-sm">Questions? Contact us at support@ewaede.com</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PendingApprovalPage;
