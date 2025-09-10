'use client';

import { useState, useEffect } from 'react';
import { User, MessageSquare, Search, X } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  courseTitle?: string;
  level?: string;
  lastMessage?: string;
  lastMessageTime?: string;
}

interface StudentSelectorProps {
  onStudentSelect: (student: Student) => void;
  onClose: () => void;
}

export default function StudentSelector({ onStudentSelect, onClose }: StudentSelectorProps) {
   const [students, setStudents] = useState<Student[]>([]);
   const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
   const [searchTerm, setSearchTerm] = useState('');
   const [isLoading, setIsLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const loadStudents = async () => {
    try {
      setError(null);
      // Get all students with STUDENT role from the database
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        setFilteredStudents(data.students || []);
      } else {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error || `Failed to load students (${response.status})`;
        setError(errorMessage);
        console.error('Failed to load students:', response.statusText);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to load students';
      setError(errorMessage);
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStudentClick = (student: Student) => {
    onStudentSelect(student);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity bg-black bg-opacity-75" onClick={onClose}></div>

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">Select Student to Message</h3>
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
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-[#374151] rounded-md bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
              />
            </div>
          </div>

          {/* Students List */}
          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5]"></div>
                <span className="ml-2 text-[#a1a1aa]">Loading students...</span>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <X className="h-12 w-12 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 font-medium">Error loading students</p>
                <p className="text-sm text-[#6b7280] mt-1">{error}</p>
                <button
                  onClick={loadStudents}
                  className="mt-4 px-4 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] transition-colors"
                >
                  Try Again
                </button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
                <p className="text-[#a1a1aa]">No students found</p>
                {searchTerm && (
                  <p className="text-sm text-[#6b7280] mt-1">Try adjusting your search terms</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    onClick={() => handleStudentClick(student)}
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
                          {student.name}
                        </p>
                        <p className="text-sm text-[#a1a1aa] truncate">
                          {student.email}
                        </p>
                        {student.courseTitle && (
                          <p className="text-xs text-[#6b7280] truncate">
                            Course: {student.courseTitle}
                          </p>
                        )}
                        {student.level && (
                          <p className="text-xs text-[#10b981] truncate">
                            Level: {student.level}
                          </p>
                        )}
                        {student.lastMessage && (
                          <p className="text-xs text-[#a1a1aa] truncate mt-1">
                            Last: {student.lastMessage}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {student.lastMessageTime && (
                        <span className="text-xs text-[#6b7280]">
                          {new Date(student.lastMessageTime).toLocaleDateString()}
                        </span>
                      )}
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
              <span>{filteredStudents.length} student{filteredStudents.length !== 1 ? 's' : ''} found</span>
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