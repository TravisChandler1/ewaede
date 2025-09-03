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
    <div className="p-6 hover:bg-[#2a2a2a]/50 transition-colors duration-150 rounded-lg border border-[#2a2a2a] bg-[#1a1a1a] hover:border-[#4f46e5]/50">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center">
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#2a2a2a] flex items-center justify-center">
              <BookOpen className="h-5 w-5 text-[#4f46e5]" />
            </div>
            <div className="ml-4">
              <h4 className="text-lg font-medium text-white">{title}</h4>
              <p className="mt-1 text-sm text-[#a1a1aa]">With {instructorName}</p>
              {level && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-[#4f46e5]/20 text-[#4f46e5] border border-[#4f46e5]/30 mt-1">
                  {level}
                </span>
              )}
            </div>
          </div>

          <p className="mt-3 text-sm text-[#a1a1aa]">
            Next: <span className="text-[#4f46e5] font-medium">{nextLesson}</span>
          </p>

          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-1">
              <span className="font-medium text-white">Progress</span>
              <span className="text-[#a1a1aa]">{progress}%</span>
            </div>
            <div className="w-full bg-[#2a2a2a] rounded-full h-2.5 mb-3">
              <div
                className="bg-[#4f46e5] h-2.5 rounded-full transition-all duration-500 ease-in-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>

            {nextLesson && (
              <p className="text-sm text-[#a1a1aa] mb-3">
                Next: <span className="text-[#4f46e5] font-medium">{nextLesson}</span>
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-[#a1a1aa]">
            <div className="flex items-center space-x-2">
              {time && <span>⏱️ {time}</span>}
              {duration && <span>• {duration} weeks</span>}
              {_count?.enrollments !== undefined && (
                <span>• 👥 {_count.enrollments}</span>
              )}
            </div>
            <Link
              href={`/courses/${id}`}
              className="text-[#4f46e5] hover:text-[#4338ca] font-medium flex items-center"
            >
              Continue <span className="ml-1">→</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
