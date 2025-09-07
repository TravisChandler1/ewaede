'use client';

import { useState, useEffect } from 'react';
import { User, MessageSquare, Search, X } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  email: string;
  courseTitle?: string;
  bio?: string;
  specialization?: string[];
}

interface TeacherSelectorProps {
  onTeacherSelect: (teacher: Teacher) => void;
  onClose: () => void;
}

export default function TeacherSelector({ onTeacherSelect, onClose }: TeacherSelectorProps) {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [filteredTeachers, setFilteredTeachers] = useState<Teacher[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadTeachers();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = teachers.filter(teacher =>
        teacher.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        teacher.courseTitle?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredTeachers(filtered);
    } else {
      setFilteredTeachers(teachers);
    }
  }, [searchTerm, teachers]);

  const loadTeachers = async () => {
    try {
      const response = await fetch('/api/student/teachers');
      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers || []);
        setFilteredTeachers(data.teachers || []);
      }
    } catch (error) {
      console.error('Error loading teachers:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleTeacherClick = (teacher: Teacher) => {
    onTeacherSelect(teacher);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Select Teacher to Message</h3>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-[#6b7280]" />
              </div>
              <input
                type="text"
                placeholder="Search teachers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-[#374151] rounded-md bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              />
            </div>
          </div>

          {/* Teachers List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5]"></div>
                <span className="ml-2 text-[#a1a1aa]">Loading teachers...</span>
              </div>
            ) : filteredTeachers.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                <p className="text-[#a1a1aa]">No teachers found</p>
                {searchTerm && (
                  <p className="text-sm text-[#6b7280] mt-1">Try adjusting your search terms</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredTeachers.map((teacher) => (
                  <div
                    key={teacher.id}
                    onClick={() => handleTeacherClick(teacher)}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#2a2a2a] hover:border-[#4f46e5] hover:bg-[#4f46e5]/5 transition-all cursor-pointer"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-full bg-[#4f46e5] flex items-center justify-center">
                          <User className="h-5 w-5 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-white truncate">
                          {teacher.name}
                        </p>
                        <p className="text-sm text-[#a1a1aa] truncate">
                          {teacher.email}
                        </p>
                        {teacher.courseTitle && (
                          <p className="text-xs text-[#6b7280] truncate">
                            Course: {teacher.courseTitle}
                          </p>
                        )}
                        {teacher.bio && (
                          <p className="text-xs text-[#a1a1aa] truncate mt-1">
                            {teacher.bio}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <MessageSquare className="h-4 w-4 text-[#4f46e5]" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
            <div className="flex justify-between items-center text-sm text-[#a1a1aa]">
              <span>{filteredTeachers.length} teacher{filteredTeachers.length !== 1 ? 's' : ''} found</span>
              <button
                onClick={onClose}
                className="px-4 py-2 border border-[#374151] rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a] transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}