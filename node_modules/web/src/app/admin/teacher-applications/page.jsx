import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { supabase } from "../../../lib/supabase";
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  Eye, 
  Search, 
  Filter,
  RefreshCw,
  User,
  Mail,
  Calendar,
  BookOpen
} from "lucide-react";

function TeacherApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [processingAction, setProcessingAction] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is admin
    const checkAdminAccess = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate('/account/signin');
        return;
      }

      const { data: profile } = await supabase
        .from('user_profiles')
        .select('role')
        .eq('user_id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        navigate('/dashboard');
        return;
      }

      fetchApplications();
    };

    checkAdminAccess();
  }, [navigate]);

  const fetchApplications = async () => {
    try {
      const { data, error } = await supabase
        .from('teacher_applications')
        .select('*')
        .order('applied_at', { ascending: false });

      if (error) {
        console.error('Error fetching applications:', error);
      } else {
        setApplications(data || []);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (applicationId, action, rejectionReason = '') => {
    setProcessingAction(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      const updateData = {
        status: action,
        reviewed_by: user.id,
        reviewed_at: new Date().toISOString()
      };

      if (action === 'rejected' && rejectionReason) {
        updateData.rejection_reason = rejectionReason;
      }

      const { error } = await supabase
        .from('teacher_applications')
        .update(updateData)
        .eq('id', applicationId);

      if (error) {
        console.error('Error updating application:', error);
        alert('Failed to update application');
      } else {
        // If approved, also update user profile to active
        if (action === 'approved') {
          const application = applications.find(app => app.id === applicationId);
          if (application) {
            await supabase
              .from('user_profiles')
              .update({ is_active: true })
              .eq('user_id', application.user_id);
          }
        }
        
        await fetchApplications();
        setShowModal(false);
        setSelectedApplication(null);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred');
    } finally {
      setProcessingAction(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 text-yellow-500" />;
      case 'approved':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />;
      case 'under_review':
        return <Clock className="h-4 w-4 text-blue-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
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

  const filteredApplications = applications.filter(app => {
    const matchesFilter = filter === 'all' || app.status === filter;
    const matchesSearch = app.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         app.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f172a] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06b6d4] mx-auto mb-4"></div>
          <p className="text-[#cbd5e1]">Loading applications...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f172a] p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Teacher Applications</h1>
          <p className="text-[#cbd5e1]">Review and manage teacher applications</p>
        </div>

        {/* Filters and Search */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#94a3b8]" />
                <input
                  type="text"
                  placeholder="Search by name or email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-[#334155] border border-[#475569] text-white rounded-lg focus:outline-none focus:border-[#06b6d4]"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="px-4 py-2 bg-[#334155] border border-[#475569] text-white rounded-lg focus:outline-none focus:border-[#06b6d4]"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="under_review">Under Review</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
              <button
                onClick={fetchApplications}
                className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2] transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Applications List */}
        <div className="bg-[#1e293b] border border-[#334155] rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-[#334155]">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cbd5e1] uppercase tracking-wider">
                    Applicant
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cbd5e1] uppercase tracking-wider">
                    Experience
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cbd5e1] uppercase tracking-wider">
                    Subjects
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cbd5e1] uppercase tracking-wider">
                    Applied
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cbd5e1] uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-[#cbd5e1] uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#334155]">
                {filteredApplications.map((application) => (
                  <tr key={application.id} className="hover:bg-[#334155]/50">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm font-medium text-white">{application.full_name}</div>
                        <div className="text-sm text-[#94a3b8]">{application.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#cbd5e1]">
                      {application.experience_years} years
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {application.teaching_subjects?.slice(0, 2).map((subject, index) => (
                          <span key={index} className="px-2 py-1 bg-[#334155] text-[#cbd5e1] rounded text-xs">
                            {subject}
                          </span>
                        ))}
                        {application.teaching_subjects?.length > 2 && (
                          <span className="px-2 py-1 bg-[#334155] text-[#cbd5e1] rounded text-xs">
                            +{application.teaching_subjects.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#cbd5e1]">
                      {new Date(application.applied_at).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                        {getStatusIcon(application.status)}
                        {application.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => {
                          setSelectedApplication(application);
                          setShowModal(true);
                        }}
                        className="text-[#06b6d4] hover:text-[#0891b2] transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filteredApplications.length === 0 && (
          <div className="text-center py-12">
            <p className="text-[#94a3b8]">No applications found</p>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {showModal && selectedApplication && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-6 z-50">
          <div className="bg-[#1e293b] border border-[#334155] rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-white">Application Details</h2>
                <button
                  onClick={() => {
                    setShowModal(false);
                    setSelectedApplication(null);
                  }}
                  className="text-[#94a3b8] hover:text-white"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Full Name</h3>
                  <p className="text-white">{selectedApplication.full_name}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Email</h3>
                  <p className="text-white">{selectedApplication.email}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Experience</h3>
                  <p className="text-white">{selectedApplication.experience_years} years</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Qualifications</h3>
                  <p className="text-white">{selectedApplication.qualifications}</p>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Teaching Subjects</h3>
                  <div className="flex flex-wrap gap-2">
                    {selectedApplication.teaching_subjects?.map((subject, index) => (
                      <span key={index} className="px-3 py-1 bg-[#334155] text-[#cbd5e1] rounded-full text-sm">
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#94a3b8] mb-1">Cover Letter</h3>
                  <p className="text-white whitespace-pre-wrap">{selectedApplication.cover_letter}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedApplication.status === 'pending' && (
                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => handleAction(selectedApplication.id, 'approved')}
                    disabled={processingAction}
                    className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {processingAction ? 'Processing...' : 'Approve'}
                  </button>
                  <button
                    onClick={() => {
                      const reason = prompt('Please provide a reason for rejection:');
                      if (reason) {
                        handleAction(selectedApplication.id, 'rejected', reason);
                      }
                    }}
                    disabled={processingAction}
                    className="flex-1 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {processingAction ? 'Processing...' : 'Reject'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TeacherApplicationsPage;
