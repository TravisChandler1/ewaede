'use client';

import { useState } from 'react';
import { X, Calendar, Clock, Users, Link as LinkIcon, Lock, Play } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select } from '../ui/select';
import { Textarea } from '../ui/textarea';

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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-[#1a1a1a] border border-[#2a2a2a] rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
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
            <Label htmlFor="title" className="text-white flex items-center">
              <Play className="h-4 w-4 mr-2" />
              Session Title *
            </Label>
            <Input
              id="title"
              type="text"
              value={sessionData.title}
              onChange={(e) => setSessionData({ ...sessionData, title: e.target.value })}
              className="mt-1 bg-[#0f0f0f] border-[#374151] text-white focus:border-[#4f46e5]"
              placeholder="e.g., Yoruba Grammar Session"
            />
            {errors.title && <p className="text-red-400 text-sm mt-1">{errors.title}</p>}
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={sessionData.description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setSessionData({ ...sessionData, description: e.target.value })}
              className="mt-1 bg-[#0f0f0f] border-[#374151] text-white focus:border-[#4f46e5]"
              placeholder="Brief description of the session content..."
              rows={3}
            />
          </div>

          {/* Meeting Link */}
          <div>
            <Label htmlFor="meetingLink" className="text-white flex items-center">
              <LinkIcon className="h-4 w-4 mr-2" />
              Meeting Link *
            </Label>
            <Input
              id="meetingLink"
              type="url"
              value={sessionData.meetingLink}
              onChange={(e) => setSessionData({ ...sessionData, meetingLink: e.target.value })}
              className="mt-1 bg-[#0f0f0f] border-[#374151] text-white focus:border-[#4f46e5]"
              placeholder="https://zoom.us/j/..."
            />
            {errors.meetingLink && <p className="text-red-400 text-sm mt-1">{errors.meetingLink}</p>}
          </div>

          {/* Password */}
          <div>
            <Label htmlFor="password" className="text-white flex items-center">
              <Lock className="h-4 w-4 mr-2" />
              Meeting Password (Optional)
            </Label>
            <Input
              id="password"
              type="text"
              value={sessionData.password}
              onChange={(e) => setSessionData({ ...sessionData, password: e.target.value })}
              className="mt-1 bg-[#0f0f0f] border-[#374151] text-white focus:border-[#4f46e5]"
              placeholder="Enter meeting password if required"
            />
          </div>

          {/* Learning Level */}
          <div>
            <Label htmlFor="level" className="text-white flex items-center">
              <Users className="h-4 w-4 mr-2" />
              Learning Level *
            </Label>
            <Select
              id="level"
              value={sessionData.level}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSessionData({ ...sessionData, level: e.target.value })}
              className="mt-1"
            >
              <option value="">Select learning level</option>
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all">All Levels</option>
            </Select>
            {errors.level && <p className="text-red-400 text-sm mt-1">{errors.level}</p>}
          </div>

          {/* Start Time */}
          <div>
            <Label htmlFor="startTime" className="text-white flex items-center">
              <Calendar className="h-4 w-4 mr-2" />
              Start Time *
            </Label>
            <Input
              id="startTime"
              type="datetime-local"
              value={sessionData.startTime}
              onChange={(e) => setSessionData({ ...sessionData, startTime: e.target.value })}
              className="mt-1 bg-[#0f0f0f] border-[#374151] text-white focus:border-[#4f46e5]"
            />
            {errors.startTime && <p className="text-red-400 text-sm mt-1">{errors.startTime}</p>}
          </div>

          {/* Duration */}
          <div>
            <Label htmlFor="duration" className="text-white flex items-center">
              <Clock className="h-4 w-4 mr-2" />
              Duration (minutes)
            </Label>
            <Select
              id="duration"
              value={sessionData.duration.toString()}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setSessionData({ ...sessionData, duration: parseInt(e.target.value) })}
              className="mt-1"
            >
              <option value="30">30 minutes</option>
              <option value="60">1 hour</option>
              <option value="90">1.5 hours</option>
              <option value="120">2 hours</option>
            </Select>
          </div>

          {/* Actions */}
          <div className="flex justify-end space-x-3 pt-4 border-t border-[#2a2a2a]">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              className="border-[#374151] text-[#a1a1aa] hover:bg-[#2a2a2a]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-[#4f46e5] hover:bg-[#4338ca] text-white"
            >
              <Play className="h-4 w-4 mr-2" />
              Start Live Session
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}