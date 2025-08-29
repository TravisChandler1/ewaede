import { BookOpen } from 'lucide-react';
import Link from 'next/link';

interface CourseCardProps {
  id: string;
  title: string;
  instructor: string | { name: string; email?: string };
  progress: number;
  nextLesson?: string;
  time?: string;
  level?: string;
  duration?: number;
  _count?: {
    enrollments: number;
  };
}

export function CourseCard({ 
  id, 
  title, 
  instructor, 
  progress, 
  nextLesson, 
  time, 
  level, 
  duration, 
  _count 
}: CourseCardProps) {
  const instructorName = typeof instructor === 'string' ? instructor : instructor?.name || 'Unknown Instructor';
  
  return (
    <div className="p-6 hover:bg-gray-50 transition-colors duration-150 rounded-lg border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-indigo-600" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-gray-900">{title}</h4>
              <p className="mt-1 text-sm text-gray-500">With {instructorName}</p>
              {level && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800 mt-1">
                  {level}
                </span>
              )}
            </div>
          </div>
          
          <p className="mt-3 text-sm text-gray-700">
            Next: <span className="text-indigo-600 font-medium">{nextLesson}</span>
          </p>
          
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-gray-700">Progress</span>
              <span className="text-gray-500">{progress}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 mb-3">
              <div 
                className="bg-indigo-600 h-2.5 rounded-full transition-all duration-500 ease-in-out" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            
            {nextLesson && (
              <p className="text-sm text-gray-700 mb-3">
                Next: <span className="text-indigo-600 font-medium">{nextLesson}</span>
              </p>
            )}
          </div>
          
          <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-2">
              {time && <span>⏱️ {time}</span>}
              {duration && <span>• {duration} weeks</span>}
              {_count?.enrollments !== undefined && (
                <span>• 👥 {_count.enrollments}</span>
              )}
            </div>
            <Link 
              href={`/courses/${id}`} 
              className="text-indigo-600 hover:text-indigo-800 font-medium flex items-center"
            >
              Continue <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
