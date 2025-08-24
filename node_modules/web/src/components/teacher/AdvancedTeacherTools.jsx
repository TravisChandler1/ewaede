import React, { useState, useEffect } from 'react';
import { BookOpen, Users, BarChart3, Calendar, FileText, Upload, Plus, Edit, Trash2, Eye, Download } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdvancedTeacherTools() {
  const [user, setUser] = useState(null);
  const [courses, setCourses] = useState([]);
  const [lessons, setLessons] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [grades, setGrades] = useState([]);
  const [students, setStudents] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedAssignment, setSelectedAssignment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('lessons');
  const [showNewLessonForm, setShowNewLessonForm] = useState(false);
  const [showNewAssignmentForm, setShowNewAssignmentForm] = useState(false);
  const [showGradeForm, setShowGradeForm] = useState(false);
  const [newLessonData, setNewLessonData] = useState({ title: '', description: '', content: '', duration: 60 });
  const [newAssignmentData, setNewAssignmentData] = useState({ title: '', description: '', dueDate: '', maxScore: 100 });
  const [gradeData, setGradeData] = useState({ score: '', maxScore: 100, grade: '', comments: '' });

  useEffect(() => {
    checkUser();
    loadTeacherData();
  }, []);

  const checkUser = async () => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUser(session.user);
    }
  };

  const loadTeacherData = async () => {
    if (!user) return;

    try {
      // Load teacher's courses
      const { data: coursesData, error: coursesError } = await supabase
        .from('courses')
        .select('*')
        .eq('created_by', user.id);

      if (coursesError) throw coursesError;
      setCourses(coursesData || []);

      if (coursesData && coursesData.length > 0) {
        setSelectedCourse(coursesData[0]);
        await loadCourseData(coursesData[0].id);
      }
    } catch (error) {
      console.error('Error loading teacher data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadCourseData = async (courseId) => {
    try {
      // Load lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from('lessons')
        .select('*')
        .eq('course_id', courseId)
        .order('order', { ascending: true });

      if (lessonsError) throw lessonsError;
      setLessons(lessonsData || []);

      // Load assignments
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .eq('course_id', courseId)
        .order('due_date', { ascending: true });

      if (assignmentsError) throw assignmentsError;
      setAssignments(assignmentsData || []);

      // Load students
      const { data: studentsData, error: studentsError } = await supabase
        .from('user_progress')
        .select(`
          *,
          student:user_profiles(full_name, email, role)
        `)
        .eq('course_id', courseId);

      if (studentsError) throw studentsError;
      setStudents(studentsData || []);

      // Load grades
      const { data: gradesData, error: gradesError } = await supabase
        .from('grades')
        .select('*')
        .eq('course_id', courseId);

      if (gradesError) throw gradesError;
      setGrades(gradesData || []);
    } catch (error) {
      console.error('Error loading course data:', error);
    }
  };

  const handleCourseSelect = async (course) => {
    setSelectedCourse(course);
    await loadCourseData(course.id);
  };

  const handleNewLesson = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !user) return;

    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          course_id: selectedCourse.id,
          title: newLessonData.title,
          description: newLessonData.description,
          content: newLessonData.content,
          duration: parseInt(newLessonData.duration),
          order: lessons.length + 1,
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setNewLessonData({ title: '', description: '', content: '', duration: 60 });
      setShowNewLessonForm(false);
      await loadCourseData(selectedCourse.id);
    } catch (error) {
      console.error('Error creating lesson:', error);
    }
  };

  const handleNewAssignment = async (e) => {
    e.preventDefault();
    if (!selectedCourse || !user) return;

    try {
      const { data, error } = await supabase
        .from('assignments')
        .insert({
          course_id: selectedCourse.id,
          title: newAssignmentData.title,
          description: newAssignmentData.description,
          due_date: newAssignmentData.dueDate,
          max_score: parseInt(newAssignmentData.maxScore),
          created_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setNewAssignmentData({ title: '', description: '', dueDate: '', maxScore: 100 });
      setShowNewAssignmentForm(false);
      await loadCourseData(selectedCourse.id);
    } catch (error) {
      console.error('Error creating assignment:', error);
    }
  };

  const handleGradeSubmission = async (e) => {
    e.preventDefault();
    if (!selectedAssignment || !user) return;

    try {
      const { data, error } = await supabase
        .from('grades')
        .insert({
          student_id: gradeData.studentId,
          course_id: selectedCourse.id,
          assignment_id: selectedAssignment.id,
          score: parseInt(gradeData.score),
          max_score: parseInt(gradeData.maxScore),
          percentage: (parseInt(gradeData.score) / parseInt(gradeData.maxScore)) * 100,
          grade: gradeData.grade,
          comments: gradeData.comments,
          graded_by: user.id
        })
        .select()
        .single();

      if (error) throw error;

      setGradeData({ score: '', maxScore: 100, grade: '', comments: '' });
      setShowGradeForm(false);
      await loadCourseData(selectedCourse.id);
    } catch (error) {
      console.error('Error grading assignment:', error);
    }
    }
  };

  const calculateGrade = (score, maxScore) => {
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return 'A';
    if (percentage >= 80) return 'B';
    if (percentage >= 70) return 'C';
    if (percentage >= 60) return 'D';
    return 'F';
  };

  const getStudentGrade = (studentId, assignmentId) => {
    return grades.find(g => g.student_id === studentId && g.assignment_id === assignmentId);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#06b6d4]"></div>
      </div>
    );
  }

  if (!user || !courses.length) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No Courses Found</h3>
          <p className="text-gray-600">You need to create courses first to access teacher tools</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Teacher Tools</h1>
        <p className="text-gray-600">Manage lessons, assignments, and track student progress</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Course Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Your Courses</h2>
            <div className="space-y-2">
              {courses.map((course) => (
                <button
                  key={course.id}
                  onClick={() => handleCourseSelect(course)}
                  className={`w-full text-left p-3 rounded-lg transition-colors ${
                    selectedCourse?.id === course.id
                      ? 'bg-[#06b6d4] text-white'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  <h3 className="font-medium">{course.title}</h3>
                  <p className="text-sm opacity-80">{course.description}</p>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          {selectedCourse ? (
            <div className="bg-white rounded-lg shadow-md">
              {/* Course Header */}
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">{selectedCourse.title}</h2>
                <p className="text-gray-600 mt-1">{selectedCourse.description}</p>
              </div>

              {/* Tabs */}
              <div className="border-b border-gray-200">
                <nav className="flex space-x-8 px-6">
                  {[
                    { id: 'lessons', label: 'Lessons', icon: BookOpen },
                    { id: 'assignments', label: 'Assignments', icon: FileText },
                    { id: 'grades', label: 'Grades', icon: BarChart3 },
                    { id: 'students', label: 'Students', icon: Users }
                  ].map((tab) => {
                    const Icon = tab.icon;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                          activeTab === tab.id
                            ? 'border-[#06b6d4] text-[#06b6d4]'
                            : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                        }`}
                      >
                        <Icon className="w-4 h-4 inline mr-2" />
                        {tab.label}
                      </button>
                    );
                  })}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {/* Lessons Tab */}
                {activeTab === 'lessons' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Course Lessons</h3>
                      <button
                        onClick={() => setShowNewLessonForm(true)}
                        className="bg-[#06b6d4] hover:bg-[#0891b2] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        New Lesson
                      </button>
                    </div>

                    <div className="space-y-4">
                      {lessons.map((lesson) => (
                        <div key={lesson.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{lesson.title}</h4>
                              <p className="text-gray-600 text-sm">{lesson.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Duration: {lesson.duration} minutes</span>
                                <span>Order: {lesson.order}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Eye className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Assignments Tab */}
                {activeTab === 'assignments' && (
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <h3 className="text-lg font-semibold">Course Assignments</h3>
                      <button
                        onClick={() => setShowNewAssignmentForm(true)}
                        className="bg-[#06b6d4] hover:bg-[#0891b2] text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                        New Assignment
                      </button>
                    </div>

                    <div className="space-y-4">
                      {assignments.map((assignment) => (
                        <div key={assignment.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between">
                            <div>
                              <h4 className="font-semibold text-gray-900">{assignment.title}</h4>
                              <p className="text-gray-600 text-sm">{assignment.description}</p>
                              <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                <span>Due: {new Date(assignment.due_date).toLocaleDateString()}</span>
                                <span>Max Score: {assignment.max_score}</span>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <button 
                                onClick={() => {
                                  setSelectedAssignment(assignment);
                                  setShowGradeForm(true);
                                }}
                                className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded text-sm transition-colors"
                              >
                                Grade
                              </button>
                              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                                <Edit className="w-4 h-4" />
                              </button>
                              <button className="p-2 text-red-400 hover:text-red-600 transition-colors">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Grades Tab */}
                {activeTab === 'grades' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Student Grades</h3>
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Student
                            </th>
                            {assignments.map((assignment) => (
                              <th key={assignment.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {assignment.title}
                              </th>
                            ))}
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Average
                            </th>
                          </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                          {students.map((student) => {
                            const studentGrades = grades.filter(g => g.student_id === student.student.user_id);
                            const average = studentGrades.length > 0 
                              ? studentGrades.reduce((sum, g) => sum + g.percentage, 0) / studentGrades.length
                              : 0;

                            return (
                              <tr key={student.student.user_id}>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div className="text-sm font-medium text-gray-900">
                                    {student.student.full_name}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    {student.student.email}
                                  </div>
                                </td>
                                {assignments.map((assignment) => {
                                  const grade = getStudentGrade(student.student.user_id, assignment.id);
                                  return (
                                    <td key={assignment.id} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                      {grade ? (
                                        <div>
                                          <span className="font-medium">{grade.score}/{grade.max_score}</span>
                                          <div className="text-xs text-gray-500">
                                            {grade.grade} ({grade.percentage.toFixed(1)}%)
                                          </div>
                                        </div>
                                      ) : (
                                        <span className="text-gray-400">-</span>
                                      )}
                                    </td>
                                  );
                                })}
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                  {average.toFixed(1)}%
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Students Tab */}
                {activeTab === 'students' && (
                  <div>
                    <h3 className="text-lg font-semibold mb-6">Enrolled Students</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {students.map((student) => (
                        <div key={student.student.user_id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-[#06b6d4] rounded-full flex items-center justify-center text-white font-semibold">
                              {student.student.full_name.charAt(0)}
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900">{student.student.full_name}</h4>
                              <p className="text-sm text-gray-500">{student.student.email}</p>
                            </div>
                          </div>
                          <div className="text-sm text-gray-600">
                            <p>Progress: {student.progress_percentage || 0}%</p>
                            <p>Last Activity: {student.last_activity ? new Date(student.last_activity).toLocaleDateString() : 'Never'}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-lg shadow-md p-12 text-center">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Course</h3>
              <p className="text-gray-600">Choose a course from the sidebar to manage lessons and assignments</p>
            </div>
          )}
        </div>
      </div>

      {/* New Lesson Modal */}
      {showNewLessonForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold mb-4">Create New Lesson</h3>
            <form onSubmit={handleNewLesson}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newLessonData.title}
                    onChange={(e) => setNewLessonData({ ...newLessonData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Duration (minutes)</label>
                  <input
                    type="number"
                    value={newLessonData.duration}
                    onChange={(e) => setNewLessonData({ ...newLessonData, duration: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                    min="15"
                    max="180"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <input
                  type="text"
                  value={newLessonData.description}
                  onChange={(e) => setNewLessonData({ ...newLessonData, description: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                <textarea
                  value={newLessonData.content}
                  onChange={(e) => setNewLessonData({ ...newLessonData, content: e.target.value })}
                  rows={6}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  required
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewLessonForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2]"
                >
                  Create Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New Assignment Modal */}
      {showNewAssignmentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl mx-4">
            <h3 className="text-xl font-semibold mb-4">Create New Assignment</h3>
            <form onSubmit={handleNewAssignment}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newAssignmentData.title}
                    onChange={(e) => setNewAssignmentData({ ...newAssignmentData, title: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={newAssignmentData.maxScore}
                    onChange={(e) => setNewAssignmentData({ ...newAssignmentData, maxScore: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                    min="1"
                    max="1000"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
                <input
                  type="datetime-local"
                  value={newAssignmentData.dueDate}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, dueDate: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={newAssignmentData.description}
                  onChange={(e) => setNewAssignmentData({ ...newAssignmentData, description: e.target.value })}
                  rows={4}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowNewAssignmentForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2]"
                >
                  Create Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Grade Assignment Modal */}
      {showGradeForm && selectedAssignment && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-semibold mb-4">Grade Assignment: {selectedAssignment.title}</h3>
            <form onSubmit={handleGradeSubmission}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Student</label>
                <select
                  value={gradeData.studentId || ''}
                  onChange={(e) => setGradeData({ ...gradeData, studentId: e.target.value })}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                  required
                >
                  <option value="">Select student...</option>
                  {students.map((student) => (
                    <option key={student.student.user_id} value={student.student.user_id}>
                      {student.student.full_name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Score</label>
                  <input
                    type="number"
                    value={gradeData.score}
                    onChange={(e) => {
                      const score = parseInt(e.target.value);
                      const maxScore = parseInt(gradeData.maxScore);
                      const grade = calculateGrade(score, maxScore);
                      setGradeData({ ...gradeData, score: e.target.value, grade });
                    }}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                    min="0"
                    max={selectedAssignment.max_score}
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Max Score</label>
                  <input
                    type="number"
                    value={gradeData.maxScore}
                    onChange={(e) => setGradeData({ ...gradeData, maxScore: e.target.value })}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                    min="1"
                    required
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Grade</label>
                <input
                  type="text"
                  value={gradeData.grade}
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                  readOnly
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Comments</label>
                <textarea
                  value={gradeData.comments}
                  onChange={(e) => setGradeData({ ...gradeData, comments: e.target.value })}
                  rows={3}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#06b6d4] focus:border-transparent"
                />
              </div>
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setShowGradeForm(false)}
                  className="px-4 py-2 text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#06b6d4] text-white rounded-lg hover:bg-[#0891b2]"
                >
                  Submit Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
