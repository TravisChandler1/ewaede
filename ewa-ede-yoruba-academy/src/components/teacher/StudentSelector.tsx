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
  onStudentSelect?: (student: Student) => void;
  onBulkSelect?: (students: Student[]) => void;
  onClose: () => void;
  bulkMode?: boolean;
}

export default function StudentSelector({ onStudentSelect, onBulkSelect, onClose, bulkMode = false }: StudentSelectorProps) {
    const [students, setStudents] = useState<Student[]>([]);
    const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);

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
    if (bulkMode) {
      setSelectedStudents(prev =>
        prev.find(s => s.id === student.id)
          ? prev.filter(s => s.id !== student.id)
          : [...prev, student]
      );
    } else {
      onStudentSelect?.(student);
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

        <div className="inline-block w-full max-w-2xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-[#1a1a1a] border border-[#2a2a2a] shadow-xl rounded-lg relative z-60">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-medium text-white">
              {bulkMode ? 'Select Students for Bulk Message' : 'Select Student to Message'}
            </h3>
            <button
              onClick={onClose}
              className="text-[#a1a1aa] hover:text-white"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Search Bar */}
          <div className="mb-6 relative z-40">
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
          <div className="border border-[#2a2a2a] rounded-lg bg-[#0f0f0f] overflow-hidden relative z-20">
            <div className="px-4 py-3 border-b border-[#2a2a2a] bg-[#1a1a1a]">
              <h4 className="text-sm font-medium text-white">Select a Student to Message</h4>
              <p className="text-xs text-[#a1a1aa] mt-1">Click on a student to start a conversation</p>
            </div>
            <div className="max-h-96 overflow-y-auto relative z-30">
              {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#4f46e5]"></div>
                <span className="ml-3 text-[#a1a1aa] text-lg">Loading students...</span>
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <X className="h-16 w-16 text-red-500 mx-auto mb-4" />
                <p className="text-red-400 font-medium text-lg">Error loading students</p>
                <p className="text-sm text-[#6b7280] mt-2">{error}</p>
                <button
                  onClick={loadStudents}
                  className="mt-6 px-6 py-3 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] transition-colors font-medium"
                >
                  Try Again
                </button>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="text-center py-12">
                <User className="h-16 w-16 text-[#a1a1aa] mx-auto mb-4" />
                <p className="text-[#a1a1aa] text-lg">No students found</p>
                {searchTerm && (
                  <p className="text-sm text-[#6b7280] mt-2">Try adjusting your search terms</p>
                )}
                {!searchTerm && (
                  <p className="text-sm text-[#6b7280] mt-2">No students are registered in the system yet</p>
                )}
              </div>
            ) : (
              <div className="divide-y divide-[#2a2a2a]">
                {filteredStudents.map((student) => {
                  const isSelected = selectedStudents.some(s => s.id === student.id);
                  return (
                    <div
                      key={student.id}
                      onClick={() => handleStudentClick(student)}
                      className={`flex items-center justify-between p-4 transition-all cursor-pointer group ${
                        isSelected
                          ? 'bg-[#4f46e5]/10 border-l-4 border-[#4f46e5]'
                          : 'hover:bg-[#1a1a1a]'
                      }`}
                    >
                      <div className="flex items-center space-x-4">
                        {bulkMode && (
                          <div className="flex-shrink-0">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}} // Handled by onClick
                              className="w-5 h-5 text-[#4f46e5] bg-[#0f0f0f] border-[#374151] rounded focus:ring-[#4f46e5] focus:ring-2"
                            />
                          </div>
                        )}
                        <div className="flex-shrink-0">
                          <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
                            isSelected ? 'bg-[#4338ca]' : 'bg-[#4f46e5] group-hover:bg-[#4338ca]'
                          }`}>
                            <User className="h-6 w-6 text-white" />
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className={`text-base font-medium transition-colors ${
                            isSelected ? 'text-[#4f46e5]' : 'text-white group-hover:text-[#4f46e5]'
                          }`}>
                            {student.name}
                          </p>
                          <p className="text-sm text-[#a1a1aa]">
                            {student.email}
                          </p>
                          {student.level && (
                            <p className="text-xs text-[#10b981] mt-1">
                              Level: {student.level}
                            </p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MessageSquare className={`h-5 w-5 transition-colors ${
                          isSelected ? 'text-[#4338ca]' : 'text-[#4f46e5] group-hover:text-[#4338ca]'
                        }`} />
                        <span className={`text-sm transition-colors ${
                          isSelected ? 'text-[#a1a1aa]' : 'text-[#6b7280] group-hover:text-[#a1a1aa]'
                        }`}>
                          {bulkMode ? (isSelected ? 'Selected' : 'Select') : 'Message'}
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-6 pt-4 border-t border-[#2a2a2a]">
            <div className="flex justify-between items-center">
              <div className="text-sm text-[#a1a1aa]">
                {bulkMode ? (
                  <>
                    <span className="font-medium text-white">{selectedStudents.length}</span> of <span className="font-medium text-white">{filteredStudents.length}</span> student{filteredStudents.length !== 1 ? 's' : ''} selected
                    {searchTerm && <span className="ml-2">for &quot;{searchTerm}&quot;</span>}
                  </>
                ) : (
                  <>
                    <span className="font-medium text-white">{filteredStudents.length}</span> student{filteredStudents.length !== 1 ? 's' : ''} found
                    {searchTerm && <span className="ml-2">for &quot;{searchTerm}&quot;</span>}
                  </>
                )}
              </div>
              <div className="flex space-x-3">
                {bulkMode && selectedStudents.length > 0 && (
                  <button
                    onClick={() => {
                      if (onBulkSelect) {
                        onBulkSelect(selectedStudents);
                      }
                    }}
                    className="px-6 py-2 bg-[#4f46e5] text-white rounded-md hover:bg-[#4338ca] transition-colors font-medium"
                  >
                    Send Bulk Message ({selectedStudents.length})
                  </button>
                )}
                <button
                  onClick={onClose}
                  className="px-6 py-2 border border-[#374151] rounded-md text-[#a1a1aa] hover:text-white hover:bg-[#2a2a2a] transition-colors font-medium"
                >
                  {bulkMode ? 'Cancel' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}