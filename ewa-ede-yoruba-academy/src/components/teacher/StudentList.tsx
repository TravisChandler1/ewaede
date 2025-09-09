'use client';

import { useState, useEffect } from 'react';
import { Users, Mail, MessageSquare, Search } from 'lucide-react';

interface Student {
  id: string;
  name: string;
  email: string;
  level: string;
}

interface StudentListProps {
  onMessageStudent: (student: Student) => void;
}

export default function StudentList({ onMessageStudent }: StudentListProps) {
  const [students, setStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadStudents();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      const filtered = students.filter(student =>
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.level.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredStudents(filtered);
    } else {
      setFilteredStudents(students);
    }
  }, [searchTerm, students]);

  const loadStudents = async () => {
    try {
      const response = await fetch('/api/students');
      if (response.ok) {
        const data = await response.json();
        setStudents(data.students || []);
        setFilteredStudents(data.students || []);
      }
    } catch (error) {
      console.error('Error loading students:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const getLevelColor = (level: string) => {
    switch (level.toLowerCase()) {
      case 'novice':
        return 'bg-red-900/30 text-red-400';
      case 'beginner':
        return 'bg-orange-900/30 text-orange-400';
      case 'intermediate':
        return 'bg-yellow-900/30 text-yellow-400';
      case 'advanced':
        return 'bg-green-900/30 text-green-400';
      case 'fluent':
        return 'bg-blue-900/30 text-blue-400';
      default:
        return 'bg-gray-900/30 text-gray-400';
    }
  };

  if (isLoading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#4f46e5] mx-auto mb-4"></div>
        <p className="text-[#a1a1aa]">Loading students...</p>
      </div>
    );
  }

  return (
    <div className="divide-y divide-[#2a2a2a]">
      {/* Search Bar */}
      <div className="p-4 border-b border-[#2a2a2a]">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-[#6b7280]" />
          </div>
          <input
            type="text"
            placeholder="Search students by name, email, or level..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-[#374151] rounded-md bg-[#0f0f0f] text-white placeholder-[#6b7280] focus:outline-none focus:ring-[#4f46e5] focus:border-[#4f46e5]"
          />
        </div>
      </div>

      {filteredStudents.length === 0 ? (
        <div className="p-8 text-center">
          <Users className="h-12 w-12 text-[#a1a1aa] mx-auto mb-4" />
          <p className="text-[#a1a1aa]">No students found</p>
          {searchTerm && (
            <p className="text-sm text-[#6b7280] mt-1">Try adjusting your search terms</p>
          )}
        </div>
      ) : (
        filteredStudents.map((student) => (
          <div key={student.id} className="p-4 hover:bg-[#2a2a2a]/50 transition-colors duration-150">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 rounded-full bg-[#4f46e5] flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {student.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-medium">{student.name}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <Mail className="h-4 w-4 text-[#a1a1aa]" />
                    <span className="text-[#a1a1aa] text-sm">{student.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getLevelColor(student.level)}`}>
                      {student.level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => onMessageStudent(student)}
                  className="flex items-center space-x-2 px-3 py-2 bg-[#4f46e5] text-white rounded-lg hover:bg-[#4338ca] transition-colors"
                >
                  <MessageSquare className="h-4 w-4" />
                  <span className="text-sm">Message</span>
                </button>
              </div>
            </div>
          </div>
        ))
      )}

      {/* Summary */}
      <div className="p-4 bg-[#1a1a1a] border-t border-[#2a2a2a]">
        <div className="flex items-center justify-between text-sm text-[#a1a1aa]">
          <span>Showing {filteredStudents.length} of {students.length} students</span>
          <div className="flex items-center space-x-4">
            <span>Levels: Novice, Beginner, Intermediate, Advanced, Fluent</span>
          </div>
        </div>
      </div>
    </div>
  );
}