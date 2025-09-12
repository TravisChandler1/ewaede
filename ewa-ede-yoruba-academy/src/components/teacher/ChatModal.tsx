'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, X, User, Clock } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  courseTitle?: string;
  level?: string;
}

interface Message {
  id: string;
  content: string;
  sender: 'teacher' | 'student';
  timestamp: string;
  isRead: boolean;
}

interface ChatModalProps {
  student: Student;
  onClose: () => void;
}

export default function ChatModal({ student, onClose }: ChatModalProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const loadMessages = useCallback(async () => {
    try {
      const response = await fetch(`/api/teacher/messages?limit=50`);
      if (response.ok) {
        const data = await response.json();
        // Filter messages for this specific student
        const studentMessages = data.messages.filter((msg: { senderId: string; recipientId: string | null }) =>
          (msg.senderId === student.id || msg.recipientId === student.id)
        );

        const formattedMessages: Message[] = studentMessages.map((msg: { id: string; content: string; senderId: string; createdAt: string; isRead: boolean }) => ({
          id: msg.id,
          content: msg.content,
          sender: msg.senderId === student.id ? 'student' : 'teacher',
          timestamp: msg.createdAt,
          isRead: msg.isRead,
        }));

        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  }, [student.id]);

  useEffect(() => {
    loadMessages();
  }, [loadMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/teacher/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientId: student.id,
          content: newMessage,
        }),
      });

      if (response.ok) {
        const messageData = await response.json();
        const message: Message = {
          id: messageData.id,
          content: messageData.content,
          sender: 'teacher',
          timestamp: messageData.createdAt,
          isRead: messageData.isRead,
        };

        setMessages(prev => [...prev, message]);
        setNewMessage('');
      }
    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop with blur effect */}
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
          onClick={onClose}
        ></div>

        <div className="w-full max-w-2xl h-[600px] p-0 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-[#2a2a2a]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-medium text-white">{student.name}</h3>
                <p className="text-sm text-[#a1a1aa]">{student.email}</p>
                {student.level && (
                  <p className="text-xs text-[#10b981]">Level: {student.level}</p>
                )}
              </div>
            </div>
            <button onClick={onClose} className="text-[#a1a1aa] hover:text-white">
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === 'teacher'
                      ? 'bg-[#4f46e5] text-white'
                      : 'bg-[#2a2a2a] text-white'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <div className={`flex items-center mt-1 text-xs ${
                    message.sender === 'teacher' ? 'text-blue-200' : 'text-[#a1a1aa]'
                  }`}>
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(message.timestamp).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="p-4 border-t border-[#2a2a2a]">
            <div className="flex space-x-2">
              <textarea
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                rows={1}
                className="flex-1 px-3 py-2 border border-[#374151] rounded-md bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5] resize-none"
              />
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}