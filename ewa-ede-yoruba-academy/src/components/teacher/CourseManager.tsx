'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Users, Plus, Edit, Trash2, Save } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  enrolledStudents: number;
  completionRate: number;
  lastActivity: string;
  createdAt: string;
}

interface CourseFormData {
  title: string;
  description: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  price: number;
}

interface CourseManagerProps {
  onClose?: () => void;
}

export default function CourseManager({ onClose }: CourseManagerProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CourseFormData>({
    title: '',
    description: '',
    level: 'beginner',
    duration: '',
    price: 0,
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
    const numValue = type === 'number' ? parseFloat(value) : value;

    setFormData(prev => ({
      ...prev,
      [name]: numValue,
    }));
  };

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      level: 'beginner',
      duration: '',
      price: 0,
    });
    setEditingCourse(null);
    setShowCreateForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.description) {
      alert('Please fill in all required fields');
      return;
    }

    setIsLoading(true);

    try {
      const url = editingCourse
        ? `/api/teacher/courses/${editingCourse.id}`
        : '/api/teacher/courses';

      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        loadCourses();
        resetForm();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to save course');
      }
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (course: Course) => {
    setFormData({
      title: course.title,
      description: course.description,
      level: 'beginner', // Default, would need to be stored in DB
      duration: '',
      price: 0,
    });
    setEditingCourse(course);
    setShowCreateForm(true);
  };

  const handleDelete = async (courseId: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/teacher/courses/${courseId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        loadCourses();
      } else {
        alert('Failed to delete course');
      }
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-6xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Course Management</h3>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white"
            >
              ×
            </button>
          </div>

          <div className="flex justify-between items-center mb-6">
            <h4 className="text-md font-medium text-white">My Courses</h4>
            <button
              onClick={() => setShowCreateForm(true)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Course
            </button>
          </div>

          {showCreateForm && (
            <div className="mb-6 p-4 bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg">
              <h5 className="text-md font-medium text-white mb-4">
                {editingCourse ? 'Edit Course' : 'Create New Course'}
              </h5>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Course Title *
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#1a1a1a] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      placeholder="e.g., Yoruba for Beginners"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Level
                    </label>
                    <select
                      name="level"
                      value={formData.level}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#1a1a1a] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    >
                      <option value="beginner">Beginner</option>
                      <option value="intermediate">Intermediate</option>
                      <option value="advanced">Advanced</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-white mb-1">
                    Description *
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#1a1a1a] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    placeholder="Describe what students will learn in this course..."
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Duration
                    </label>
                    <input
                      type="text"
                      name="duration"
                      value={formData.duration}
                      onChange={handleInputChange}
                      className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#1a1a1a] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                      placeholder="e.g., 8 weeks"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-white mb-1">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      name="price"
                      value={formData.price}
                      onChange={handleInputChange}
                      min="0"
                      step="0.01"
                      className="block w-full px-3 py-2 border border-[#374151] rounded-md shadow-sm bg-[#1a1a1a] text-white focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 border border-[#374151] rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a]"
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
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="h-4 w-4 mr-2" />
                        {editingCourse ? 'Update Course' : 'Create Course'}
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <div key={course.id} className="bg-[#0f0f0f] border border-[#2a2a2a] rounded-lg p-6 hover:border-[#4f46e5]/30 transition-all">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center">
                    <BookOpen className="h-8 w-8 text-[#4f46e5] mr-3" />
                    <div>
                      <h4 className="text-lg font-semibold text-white">{course.title}</h4>
                      <p className="text-sm text-[#a1a1aa]">{course.description}</p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleEdit(course)}
                      className="text-[#a1a1aa] hover:text-white p-1"
                    >
                      <Edit className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(course.id)}
                      className="text-red-400 hover:text-red-300 p-1"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a1a1aa]">Students:</span>
                    <span className="text-white flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.enrolledStudents}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a1a1aa]">Completion:</span>
                    <span className="text-white">{course.completionRate}%</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-[#a1a1aa]">Last Activity:</span>
                    <span className="text-white">{course.lastActivity}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {courses.length === 0 && !showCreateForm && (
            <div className="text-center py-12">
              <BookOpen className="h-16 w-16 text-[#a1a1aa] mx-auto mb-4" />
              <h4 className="text-lg font-medium text-white mb-2">No courses yet</h4>
              <p className="text-[#a1a1aa] mb-6">Create your first course to get started</p>
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#4f46e5] hover:bg-[#4338ca] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#4f46e5]"
              >
                <Plus className="h-5 w-5 mr-2" />
                Create Your First Course
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}