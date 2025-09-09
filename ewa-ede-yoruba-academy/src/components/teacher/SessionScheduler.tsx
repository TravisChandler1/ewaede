'use client';

import { useState, useEffect } from 'react';
import { Save, X } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  enrolledStudents: number;
}

interface Session {
  id: string;
  title: string;
  courseTitle: string;
  startTime: string;
  endTime: string;
  attendees: number;
  maxAttendees: number;
  status: 'completed' | 'scheduled' | 'ongoing' | 'cancelled';
  meetingUrl?: string;
  description?: string;
}

interface SessionFormData {
  title: string;
  description: string;
  courseId: string;
  startTime: string;
  endTime: string;
  maxAttendees: number;
  meetingUrl: string;
  isRecurring: boolean;
  recurringPattern: 'daily' | 'weekly' | 'monthly';
}

interface SessionSchedulerProps {
  onSessionCreated?: (session: Session) => void;
  onClose?: () => void;
}

export default function SessionScheduler({ onSessionCreated, onClose }: SessionSchedulerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<SessionFormData>({
    title: '',
    description: '',
    courseId: '',
    startTime: '',
    endTime: '',
    maxAttendees: 20,
    meetingUrl: '',
    isRecurring: false,
    recurringPattern: 'weekly',
  });

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      const response = await fetch('/api/teacher/courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data.courses || []);
      }
    } catch (error) {
      console.error('Error loading courses:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const generateMeetingUrl = () => {
    // Generate Google Meet URL
    const meetingId = Math.random().toString(36).substring(2, 15).toUpperCase();
    const url = `https://meet.google.com/${meetingId}`;
    setFormData(prev => ({ ...prev, meetingUrl: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.courseId || !formData.startTime || !formData.endTime) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/teacher/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to create session');
      }

      const newSession = await response.json();

      if (onSessionCreated) {
        onSessionCreated(newSession);
      }

      if (onClose) {
        onClose();
      }

      // Reset form
      setFormData({
        title: '',
        description: '',
        courseId: '',
        startTime: '',
        endTime: '',
        maxAttendees: 20,
        meetingUrl: '',
        isRecurring: false,
        recurringPattern: 'weekly',
      });

    } catch (error) {
      console.error('Error creating session:', error);
      alert(error instanceof Error ? error.message : 'Failed to create session');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-black bg-opacity-50 backdrop-blur-sm"
          onClick={onClose}
          style={{
            zIndex: -1,
            background: 'rgba(0, 0, 0, 0.5)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)'
          }}
        ></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a]/95 border border-[#2a2a2a] shadow-xl rounded-lg backdrop-blur-md">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Schedule New Session</h3>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#a1a1aa] uppercase tracking-wide">Basic Information</h4>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-white mb-1">
                  Session Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  placeholder="e.g., Introduction to Yoruba Alphabet"
                  required
                />
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-white mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  placeholder="Describe what students will learn in this session..."
                />
              </div>

              <div>
                <label htmlFor="courseId" className="block text-sm font-medium text-white mb-1">
                  Course *
                </label>
                <select
                  id="courseId"
                  name="courseId"
                  value={formData.courseId}
                  onChange={handleInputChange}
                  className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  required
                >
                  <option value="">Select a course</option>
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>
                      {course.title} ({course.enrolledStudents} students)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Schedule */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#a1a1aa] uppercase tracking-wide">Schedule</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="startTime" className="block text-sm font-medium text-white mb-1">
                    Start Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="startTime"
                    name="startTime"
                    value={formData.startTime}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="endTime" className="block text-sm font-medium text-white mb-1">
                    End Time *
                  </label>
                  <input
                    type="datetime-local"
                    id="endTime"
                    name="endTime"
                    value={formData.endTime}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="isRecurring"
                  name="isRecurring"
                  checked={formData.isRecurring}
                  onChange={handleInputChange}
                  className="h-4 w-4 text-[#4f46e5] focus:ring-[#4f46e5] border-[#374151] rounded bg-[#0f0f0f]"
                />
                <label htmlFor="isRecurring" className="ml-2 block text-sm text-white">
                  Make this a recurring session
                </label>
              </div>

              {formData.isRecurring && (
                <div>
                  <label htmlFor="recurringPattern" className="block text-sm font-medium text-white mb-1">
                    Recurring Pattern
                  </label>
                  <select
                    id="recurringPattern"
                    name="recurringPattern"
                    value={formData.recurringPattern}
                    onChange={handleInputChange}
                    className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>
              )}
            </div>

            {/* Meeting Details */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[#a1a1aa] uppercase tracking-wide">Meeting Details</h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="maxAttendees" className="block text-sm font-medium text-white mb-1">
                    Maximum Attendees
                  </label>
                  <input
                    type="number"
                    id="maxAttendees"
                    name="maxAttendees"
                    value={formData.maxAttendees}
                    onChange={handleInputChange}
                    min="1"
                    max="100"
                    className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#0f0f0f] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                  />
                </div>

                <div>
                  <label htmlFor="meetingUrl" className="block text-sm font-medium text-white mb-1">
                    Meeting URL
                  </label>
                  <div className="flex">
                    <input
                      type="url"
                      id="meetingUrl"
                      name="meetingUrl"
                      value={formData.meetingUrl}
                      onChange={handleInputChange}
                      className="flex-1 px-3 py-2 border border-[#374151] rounded-l-md shadow-sm bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      placeholder="https://meet.google.com/abc-defg-hij"
                    />
                    <button
                      type="button"
                      onClick={generateMeetingUrl}
                      className="px-3 py-2 border border-l-0 border-[#374151] bg-[#2a2a2a] text-[#a1a1aa] rounded-r-md hover:bg-[#374151] hover:text-white transition-colors"
                    >
                      Generate
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-end space-x-3 pt-6 border-t border-[#2a2a2a]">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-[#374151] rounded-md shadow-sm text-sm font-medium text-[#a1a1aa] bg-[#0f0f0f] hover:bg-[#2a2a2a] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Session
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}