import { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import { Users, Clock, ArrowRight } from 'lucide-react';

interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail?: string;
  duration: number;
  level: string;
  price: number;
  instructor?: {
    name: string;
  };
  teacher?: {
    name: string;
  };
  _count?: {
    enrollments: number;
  };
}

export const metadata: Metadata = {
  title: 'Browse Courses - Ẹwà Èdè Yorùbá Academy',
  description: 'Explore our collection of Yoruba language courses',
};

export const revalidate = 60; // Revalidate every 60 seconds

async function getCourses() {
  try {
    // Use relative URL for internal API calls during SSR
    const apiUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/courses`
      : process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/courses`
      : 'http://localhost:3000/api/courses';
      
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error('Failed to fetch courses');
    }

    return res.json();
  } catch (error) {
    // Return empty array if fetch fails (e.g., during build time)
    console.warn('Failed to fetch courses:', error);
    return [];
  }
}

export default async function CoursesPage() {
  const courses = await getCourses();

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Explore Our Courses
          </h1>
          <p className="text-xl text-gray-600">
            Start your journey to mastering the Yoruba language today
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.map((course: Course) => (
            <div
              key={course.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
            >
              <div className="h-48 bg-gray-200 relative">
                {course.thumbnail && (
                  <Image
                    src={course.thumbnail}
                    alt={course.title}
                    fill
                    className="object-cover"
                  />
                )}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                  <h3 className="text-xl font-bold text-white">{course.title}</h3>
                  <p className="text-gray-200 text-sm mt-1">
                    {course.instructor?.name || course.teacher?.name}
                  </p>
                </div>
              </div>
              
              <div className="p-6">
                <p className="text-gray-600 mb-4 line-clamp-3">
                  {course.description}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course._count?.enrollments || 0} students</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration} weeks</span>
                  </div>
                  <div className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                    {course.level}
                  </div>
                </div>
                
                <div className="flex items-center justify-between mt-6">
                  <span className="text-2xl font-bold text-gray-900">
                    ${course.price?.toFixed(2) || 'Free'}
                  </span>
                  <Link
                    href={`/courses/${course.id}`}
                    className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
                  >
                    View Details
                    <ArrowRight className="w-4 h-4 ml-1" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
