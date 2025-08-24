import { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { X, Video, Clock, Users, Calendar, User, CheckCircle, AlertCircle } from 'lucide-react';

export default function SessionModal({ session, isOpen, onClose }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const queryClient = useQueryClient();

  const registerMutation = useMutation({
    mutationFn: async (action) => {
      const response = await fetch(`/api/sessions/${session.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to perform action');
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['dashboardData']);
      queryClient.invalidateQueries(['sessions']);
      setIsRegistering(false);
    },
    onError: (error) => {
      console.error('Registration error:', error);
      setIsRegistering(false);
    }
  });

  const handleRegister = () => {
    setIsRegistering(true);
    registerMutation.mutate('register');
  };

  const handleUnregister = () => {
    setIsRegistering(true);
    registerMutation.mutate('unregister');
  };

  const handleJoinLive = () => {
    if (session.meeting_url) {
      window.open(session.meeting_url, '_blank');
    }
  };

  if (!isOpen || !session) return null;

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled': return 'text-[#06b6d4]';
      case 'live': return 'text-[#10b981]';
      case 'completed': return 'text-[#cbd5e1]';
      case 'cancelled': return 'text-[#dc2626]';
      default: return 'text-[#cbd5e1]';
    }
  };

  const getStatusBg = (status) => {
    switch (status) {
      case 'scheduled': return 'bg-[#06b6d4]';
      case 'live': return 'bg-[#10b981]';
      case 'completed': return 'bg-[#475569]';
      case 'cancelled': return 'bg-[#dc2626]';
      default: return 'bg-[#475569]';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1e293b] rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-[#06b6d4] rounded-lg flex items-center justify-center">
                <Video className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">{session.title}</h2>
                <p className="text-[#cbd5e1] text-sm">by {session.teacher_name}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-[#cbd5e1] hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="space-y-6">
            {/* Status Badge */}
            <div className="flex items-center gap-2">
              <span className={`px-3 py-1 rounded-full text-sm font-medium text-white ${getStatusBg(session.status)}`}>
                {session.status.charAt(0).toUpperCase() + session.status.slice(1)}
              </span>
              {session.is_registered && (
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-[#10b981] text-white flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" />
                  Registered
                </span>
              )}
            </div>

            {/* Session Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-[#cbd5e1]">
                <Calendar className="w-5 h-5" />
                <div>
                  <p className="text-sm">Date & Time</p>
                  <p className="text-white font-medium">{formatDate(session.scheduled_date)}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#cbd5e1]">
                <Clock className="w-5 h-5" />
                <div>
                  <p className="text-sm">Duration</p>
                  <p className="text-white font-medium">{session.duration_minutes} minutes</p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#cbd5e1]">
                <Users className="w-5 h-5" />
                <div>
                  <p className="text-sm">Participants</p>
                  <p className="text-white font-medium">
                    {session.registered_count || 0} / {session.max_participants}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 text-[#cbd5e1]">
                <User className="w-5 h-5" />
                <div>
                  <p className="text-sm">Level</p>
                  <p className="text-white font-medium capitalize">{session.learning_level}</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2">About this session</h3>
              <p className="text-[#cbd5e1] leading-relaxed">{session.description}</p>
            </div>

            {/* Registration Status */}
            {session.registered_count >= session.max_participants && !session.is_registered && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-400" />
                <p className="text-yellow-400">This session is full. You can join the waitlist.</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                onClick={onClose}
                className="flex-1 bg-[#334155] text-white py-3 rounded-lg hover:bg-[#475569] transition-colors"
              >
                Close
              </button>

              {session.status === 'live' && session.is_registered && (
                <button
                  onClick={handleJoinLive}
                  className="flex-1 bg-[#10b981] text-white py-3 rounded-lg hover:bg-[#059669] transition-colors flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Join Live Session
                </button>
              )}

              {session.status === 'scheduled' && !session.is_registered && (
                <button
                  onClick={handleRegister}
                  disabled={isRegistering || registerMutation.isPending}
                  className="flex-1 bg-[#06b6d4] text-white py-3 rounded-lg hover:bg-[#0891b2] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRegistering || registerMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Registering...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4" />
                      Register for Session
                    </>
                  )}
                </button>
              )}

              {session.status === 'scheduled' && session.is_registered && (
                <button
                  onClick={handleUnregister}
                  disabled={isRegistering || registerMutation.isPending}
                  className="flex-1 bg-[#dc2626] text-white py-3 rounded-lg hover:bg-[#b91c1c] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isRegistering || registerMutation.isPending ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Unregistering...
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4" />
                      Unregister
                    </>
                  )}
                </button>
              )}

              {session.status === 'completed' && session.recording_url && (
                <button
                  onClick={() => window.open(session.recording_url, '_blank')}
                  className="flex-1 bg-[#8b5cf6] text-white py-3 rounded-lg hover:bg-[#7c3aed] transition-colors flex items-center justify-center gap-2"
                >
                  <Video className="w-4 h-4" />
                  Watch Recording
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}