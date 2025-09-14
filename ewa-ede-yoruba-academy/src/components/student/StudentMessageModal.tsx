'use client';

import { useState, useEffect, useRef } from 'react';
import { Send, X, User, MoreVertical, Smile, MessageSquare } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  courseTitle: string;
  avatar?: string;
  isOnline?: boolean;
  lastSeen?: string;
}

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName: string;
  timestamp: string;
  isRead: boolean;
  messageType: 'text' | 'image' | 'file';
}

interface FacebookChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedTeacher?: Teacher | null;
}

export default function FacebookChatModal({ isOpen, onClose, selectedTeacher }: FacebookChatModalProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [currentTeacher, setCurrentTeacher] = useState<Teacher | null>(selectedTeacher || null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      loadTeachers();
      if (selectedTeacher) {
        setCurrentTeacher(selectedTeacher);
        loadMessages(selectedTeacher.id);
      }
    }
  }, [isOpen, selectedTeacher]);

  useEffect(() => {
    if (currentTeacher) {
      loadMessages(currentTeacher.id);
    }
  }, [currentTeacher]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const loadTeachers = async () => {
    try {
      const response = await fetch('/api/student/teachers');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
    }
  };

  const loadMessages = async (teacherId: string) => {
    try {
      const response = await fetch(`/api/student/messages?teacherId=${teacherId}`);
      if (response.ok) {
        const data = await response.json();
        setMessages(data.messages || []);
      }
    } catch (error) {
      console.error('Error loading messages:', error);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = async () => {
    if (!currentTeacher || !newMessage.trim()) return;

    const messageData = {
      recipientId: currentTeacher.id,
      content: newMessage.trim(),
      messageType: 'text' as const,
    };

    // Optimistically add message to UI
    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      content: newMessage,
      senderId: 'student', // Current user
      senderName: 'You',
      timestamp: new Date().toISOString(),
      isRead: false,
      messageType: 'text',
    };

    setMessages(prev => [...prev, tempMessage]);
    setNewMessage('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/student/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(messageData),
      });

      if (response.ok) {
        const result = await response.json();
        // Replace temp message with real message
        setMessages(prev =>
          prev.map(msg =>
            msg.id === tempMessage.id
              ? { ...msg, id: result.id, timestamp: result.createdAt }
              : msg
          )
        );
      } else {
        // Remove temp message on error
        setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
        const error = await response.json();
        alert(error.error || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      // Remove temp message on error
      setMessages(prev => prev.filter(msg => msg.id !== tempMessage.id));
      alert('Failed to send message. Please try again.');
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

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();

    if (diff < 60000) return 'Just now';
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m`;
    if (diff < 86400000) return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    return date.toLocaleDateString();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with blur effect */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      ></div>

      {/* Chat Window */}
      <div className="fixed bottom-4 right-4 w-96 h-[600px] bg-[#1a1a1a] border border-[#2a2a2a] rounded-t-xl shadow-2xl flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 bg-[#2a2a2a] border-b border-[#374151]">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <div className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center">
                <User className="h-5 w-5 text-white" />
              </div>
              {currentTeacher?.isOnline && (
                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-[#1a1a1a] rounded-full"></div>
              )}
            </div>
            <div>
              <h3 className="text-white font-medium text-sm">
                {currentTeacher?.name || 'Select a teacher'}
              </h3>
              <p className="text-[#a1a1aa] text-xs">
                {currentTeacher?.isOnline ? 'Active now' : currentTeacher?.lastSeen ? `Last seen ${currentTeacher.lastSeen}` : 'Offline'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <button className="text-[#a1a1aa] hover:text-white p-1">
              <MoreVertical className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white p-1"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Messages Area */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-[#0f0f0f]">
          {currentTeacher ? (
            <>
              {messages.length === 0 ? (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-[#4f46e5]/20 flex items-center justify-center mx-auto mb-4">
                    <User className="h-8 w-8 text-[#4f46e5]" />
                  </div>
                  <p className="text-[#a1a1aa] text-sm mb-2">Start a conversation</p>
                  <p className="text-[#6b7280] text-xs">Send a message to {currentTeacher.name}</p>
                </div>
              ) : (
                messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.senderId === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-sm px-4 py-2 rounded-2xl ${
                        message.senderId === 'student'
                          ? 'bg-[#4f46e5] text-white rounded-br-md'
                          : 'bg-[#2a2a2a] text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm">{message.content}</p>
                      <p className={`text-xs mt-1 ${
                        message.senderId === 'student' ? 'text-blue-200' : 'text-[#a1a1aa]'
                      }`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                  </div>
                ))
              )}
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-[#2a2a2a] px-4 py-2 rounded-2xl rounded-bl-md">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-[#a1a1aa] rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-[#a1a1aa] rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-[#a1a1aa] rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </>
          ) : (
            <div className="text-center py-8">
              <MessageSquare className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
              <p className="text-[#a1a1aa] text-sm mb-2">Select a teacher to start chatting</p>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {teachers.map((teacher) => (
                  <button
                    key={teacher.id}
                    onClick={() => setCurrentTeacher(teacher)}
                    className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-[#2a2a2a] transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full bg-[#4f46e5] flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="text-left">
                      <p className="text-white text-sm font-medium">{teacher.name}</p>
                      <p className="text-[#a1a1aa] text-xs">{teacher.courseTitle}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Message Input */}
        {currentTeacher && (
          <div className="p-4 bg-[#1a1a1a] border-t border-[#2a2a2a]">
            <div className="flex items-center space-x-2">
              <button className="text-[#a1a1aa] hover:text-white p-2">
                <Smile className="h-5 w-5" />
              </button>
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={`Message ${currentTeacher.name}...`}
                  className="w-full px-4 py-2 bg-[#0f0f0f] border border-[#374151] rounded-full text-white placeholder-[#6b7280] focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent"
                  disabled={isLoading}
                />
              </div>
              <button
                onClick={sendMessage}
                disabled={!newMessage.trim() || isLoading}
                className="p-2 bg-[#4f46e5] hover:bg-[#4338ca] rounded-full text-white disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}