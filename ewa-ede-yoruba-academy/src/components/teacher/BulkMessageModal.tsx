'use client';

import { useState } from 'react';
import { Send, X, Users } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
}

interface BulkMessageModalProps {
  isOpen: boolean;
  selectedStudents: Student[];
  onClose: () => void;
  onSend: (message: string, students: Student[]) => Promise<void>;
}

export default function BulkMessageModal({ isOpen, selectedStudents, onClose, onSend }: BulkMessageModalProps) {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);

  const handleSend = async () => {
    if (!message.trim()) return;

    setIsSending(true);
    try {
      await onSend(message.trim(), selectedStudents);
      setMessage('');
      onClose();
    } catch (error) {
      console.error('Error sending bulk message:', error);
      alert('Failed to send bulk message. Please try again.');
    } finally {
      setIsSending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop with blur effect */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg relative z-60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Send Bulk Message</h3>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Selected Students */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Users className="h-5 w-5 text-[#4f46e5]" />
              <span className="text-sm font-medium text-white">
                Sending to {selectedStudents.length} student{selectedStudents.length !== 1 ? 's' : ''}
              </span>
            </div>
            <div className="flex flex-wrap gap-2 max-h-20 overflow-y-auto">
              {selectedStudents.map((student) => (
                <div
                  key={student.id}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30"
                >
                  {student.name}
                </div>
              ))}
            </div>
          </div>

          {/* Message Input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-white mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={6}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              placeholder="Type your message to all selected students..."
            />
          </div>

          {/* Footer */}
          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-[#374151] rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSend}
              disabled={!message.trim() || isSending}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSending ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4 mr-2" />
                  Send to {selectedStudents.length} Student{selectedStudents.length !== 1 ? 's' : ''}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}