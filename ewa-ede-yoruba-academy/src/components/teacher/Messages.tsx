'use client';

import { useState, useEffect } from 'react';
import { Send, MessageSquare, User, Clock } from 'lucide-react';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  content: string;
  isRead: boolean;
  createdAt: string;
}

interface Student {
  id: string;
  name: string;
  email: string;
}

interface CourseData {
  id: string;
  title: string;
  enrolledStudents?: Student[];
}

interface MessagesProps {
  onClose?: () => void;
}

export default function Messages({ onClose }: MessagesProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'inbox' | 'compose'>('inbox');

  useEffect(() => {
    loadMessages();
    loadStudents();
  }, []);

  const loadMessages = async () => {
    try {
      const response = await fetch('/api/teacher/messages?limit=20');
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const loadStudents = async () => {
    try {
      // Get students from enrolled courses
      const response = await fetch('/api/teacher/courses');
      if (response.ok) {
        const data = await response.json();
        // Extract unique students from all courses
        const studentMap = new Map<string, Student>();
        data.courses?.forEach((_course: CourseData) => {
          // This would need to be implemented in the API to get enrolled students
          // For now, we'll use a placeholder
        });
        setStudents(Array.from(studentMap.values()));
      }
    } catch (error) {
      console.error('Error loading students:', error);
    }
  };

  const sendMessage = async () => {
    if (!selectedStudent || !newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/teacher/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: selectedStudent,
          content: newMessage,
        }),
      });

      if (response.ok) {
        setNewMessage('');
        setSelectedStudent('');
        setActiveTab('inbox');
        loadMessages();
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const markAsRead = async (messageId: string) => {
    try {
      await fetch(`/api/teacher/messages/${messageId}/read`, {
        method: 'POST',
      });
      setMessages(messages.map(msg =>
        msg.id === messageId ? { ...msg, isRead: true } : msg
      ));
    } catch (error) {
      console.error('Error marking message as read:', error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Messages</h3>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white"
            >
              ×
            </button>
          </div>

          {/* Tabs */}
          <div className="flex space-x-1 mb-6 bg-[#0f0f0f] p-1 rounded-lg">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'inbox'
                  ? 'bg-[#4f46e5] text-white'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Inbox ({messages.filter(m => !m.isRead).length})
            </button>
            <button
              onClick={() => setActiveTab('compose')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-all ${
                activeTab === 'compose'
                  ? 'bg-[#4f46e5] text-white'
                  : 'text-[#a1a1aa] hover:text-white'
              }`}
            >
              Compose
            </button>
          </div>

          {activeTab === 'inbox' && (
            <div className="space-y-4">
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <MessageSquare className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                  <p className="text-[#a1a1aa]">No messages yet</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`p-4 rounded-lg border transition-all ${
                      message.isRead
                        ? 'bg-[#0f0f0f] border-[#2a2a2a]'
                        : 'bg-[#4f46e5]/5 border-[#4f46e5]/30'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <User className="h-4 w-4 text-[#a1a1aa]" />
                          <span className="text-sm font-medium text-white">
                            {message.senderName}
                          </span>
                          {!message.isRead && (
                            <span className="inline-block w-2 h-2 bg-[#4f46e5] rounded-full"></span>
                          )}
                        </div>
                        <p className="text-[#a1a1aa] text-sm mb-2">{message.content}</p>
                        <div className="flex items-center text-xs text-[#6b7280]">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(message.createdAt).toLocaleString()}
                        </div>
                      </div>
                      {!message.isRead && (
                        <button
                          onClick={() => markAsRead(message.id)}
                          className="text-[#4f46e5] hover:text-[#4338ca] text-sm"
                        >
                          Mark as read
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'compose' && (
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Select Student
                </label>
                <select
                  value={selectedStudent}
                  onChange={(e) => setSelectedStudent(e.target.value)}
                  className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                >
                  <option value="">Choose a student...</option>
                  {students.map((student) => (
                    <option key={student.id} value={student.id}>
                      {student.name} ({student.email})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Message
                </label>
                <textarea
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  rows={6}
                  className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  placeholder="Type your message here..."
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setActiveTab('inbox')}
                  className="px-4 py-2 border border-[#374151] rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a]"
                >
                  Cancel
                </button>
                <button
                  onClick={sendMessage}
                  disabled={!selectedStudent || !newMessage.trim() || isLoading}
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
          )}
        </div>
      </div>
    </div>
  );
}