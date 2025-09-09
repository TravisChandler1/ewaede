'use client';

import { useState } from 'react';
import { X, Calendar, Clock, Users, Link as LinkIcon, Lock, Play } from 'lucide-react';

interface LiveSessionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartSession: (sessionData: SessionData) => void;
}

export interface SessionData {
  title: string;
  description: string;
  meetingLink: string;
  password: string;
  level: string;
  startTime: string;
  duration: number;
}

export default function LiveSessionModal({ isOpen, onClose, onStartSession }: LiveSessionModalProps) {
  const [sessionData, setSessionData] = useState<SessionData>({
    title: '',
    description: '',
    meetingLink: '',
    password: '',
    level: '',
    startTime: '',
    duration: 60,
  });

  const [errors, setErrors] = useState<Partial<SessionData>>({});

  const validateForm = (): boolean => {
    const newErrors: Partial<SessionData> = {};

    if (!sessionData.title.trim()) newErrors.title = 'Title is required';
    if (!sessionData.meetingLink.trim()) newErrors.meetingLink = 'Meeting link is required';
    if (!sessionData.level) newErrors.level = 'Learning level is required';
    if (!sessionData.startTime) newErrors.startTime = 'Start time is required';

    // Validate meeting link format
    const urlPattern = /^https?:\/\/.+/;
    if (sessionData.meetingLink && !urlPattern.test(sessionData.meetingLink)) {
      newErrors.meetingLink = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      onStartSession(sessionData);
      // Reset form
      setSessionData({
        title: '',
        description: '',
        meetingLink: '',
        password: '',
        level: '',
        startTime: '',
        duration: 60,
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setSessionData({
      title: '',
      description: '',
      meetingLink: '',
      password: '',
      level: '',
      startTime: '',
      duration: 60,
    });
    setErrors({});
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#2a2a2a]">
          <div className="flex items-center">
            <Play className="h-6 w-6 text-[#4f46e5] mr-3" />
            <h2 className="text-xl font-semibold text-white">Start Live Session</h2>
          </div>
          <button
            onClick={handleClose}
            className="text-[#a1a1aa] hover:text-white transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Session Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-white mb-1 flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Session Title *
            </label>
            <input
              id="title"
              type="text"
              value={sessionData.title}
              onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              placeholder="e.g., Yoruba Grammar Session"
              required
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
              Description
            </label>
            <textarea
              id="description"
              value={sessionData.description}
              onChange={(e) => setSessionData({ ...sessionData, description: e.target.value })}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              placeholder="Brief description of the session content..."
              rows={3}
            />
          </div>

          {/* Meeting Link */}
          <div>
            <label htmlFor="meetingLink" className="block text-sm font-medium text-white mb-1 flex items-center">
              <LinkIcon className="h-4 w-4 mr-2" />
              Meeting Link *
            </label>
            <input
              id="meetingLink"
              type="url"
              value={sessionData.meetingLink}
              onChange={(e) => setSessionData({ ...sessionData, meetingLink: e.target.value })}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              placeholder="https://zoom.us/j/..."
              required
            />
            {errors.meetingLink && <p className="text-red-400 text-sm mt-1">{errors.meetingLink}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-white mb-1 flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Meeting Password (Optional)
            </label>
            <input
              id="password"
              type="text"
              value={sessionData.password}
              onChange={(e) => setSessionData({ ...sessionData, password: e.target.value })}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              placeholder="Enter meeting password if required"
            />
          </div>

          {/* Learning Level */}
          <div>
            <label htmlFor="level" className="block text-sm font-medium text-white mb-1 flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Learning Level *
            </label>
            <select
              id="level"
              value={sessionData.level}
              onChange={(e) => setSessionData({ ...sessionData, level: e.target.value })}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              required
            >
              <option value="">Select learning level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all">All Levels</option>
            </select>
            {errors.level && <p className="text-red-400 text-sm mt-1">{errors.level}</p>}
          </div>

          {/* Start Time */}
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-white mb-1 flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Start Time *
            </label>
            <input
              id="startTime"
              type="datetime-local"
              value={sessionData.startTime}
              onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              required
            />
            {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
          </div>

          {/* Duration */}
          <div>
            <label htmlFor="duration" className="block text-sm font-medium text-white mb-1 flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Duration (minutes)
            </label>
            <select
              id="duration"
              value={sessionData.duration.toString()}
              onChange={(e) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
              className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 border border-[#374151] rounded-md shadow-sm text-sm font-medium text-[#a1a1aa] bg-[#0f0f0f] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Live Session
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}