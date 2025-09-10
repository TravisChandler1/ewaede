'use client';

import { useState, useEffect } from 'react';
import { Send, X, User } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
}

interface StudentMessageModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function StudentMessageModal({ isOpen, onClose }: StudentMessageModalProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingTeachers, setIsLoadingTeachers] = useState(true);

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
    }
  }, [isOpen]);

  const loadTeachers = async () => {
    try {
      const response = await fetch('/api/student/teachers');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setIsLoadingTeachers(false);
    }
  };

  const sendMessage = async () => {
    if (!selectedTeacher || !message.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/student/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedTeacher.id,
          content: message,
        }),
      });

      if (response.ok) {
        alert('Message sent successfully!');
        setMessage('');
        setSelectedTeacher(null);
        onClose();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Send Message to Teacher</h3>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Teacher Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Select Teacher
            </label>
            {isLoadingTeachers ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4f46e5]"></div>
                <span className="ml-2 text-[#a1a1aa]">Loading teachers...</span>
              </div>
            ) : (
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {teachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    onClick={() => setSelectedTeacher(teacher)}
                    className={`flex items-center justify-between p-3 rounded-lg border cursor-pointer transition-all ${
                      selectedTeacher?.id === teacher.id
                        ? 'border-[#4f46e5] bg-[#4f46e5]/10'
                        : 'border-[#2a2a2a] hover:border-[#4f46e5]/50'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#4f46e5] flex items-center justify-center">
                        <User className="h-4 w-4 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white">{teacher.name}</p>
                        <p className="text-xs text-[#a1a1aa]">{teacher.courseTitle}</p>
                      </div>
                    </div>
                    {selectedTeacher?.id === teacher.id && (
                      <div className="w-4 h-4 rounded-full bg-[#4f46e5] flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message here..."
              rows={4}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] resize-none"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-[#374151] rounded-md shadow-sm text-sm font-medium text-[#a1a1aa] bg-[#0f0f0f] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
            >
              Cancel
            </button>
            <button
              onClick={sendMessage}
              disabled={!selectedTeacher || !message.trim() || isLoading}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send Message
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}