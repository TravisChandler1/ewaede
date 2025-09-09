import { Metadata } from 'next';
import Image from 'next/image';
import { BookOpen, Users, Clock, Calendar, Play } from 'lucide-react';
import { notFound } from 'next/navigation';
import { getCurrentUser } from '@/lib/auth-utils';
import { EnrollButton } from '@/components/courses/EnrollButton';

interface Enrollment {
  userId: string;
}

interface Lesson {
  id: string;
  title: string;
  duration: number;
}

interface Module {
  id: string;
  title: string;
  lessons?: Lesson[];
}


interface CoursePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const course = await getCourse(params.id);
  return {
    title: `${course?.title || 'Course'} - Ẹwà Èdè Yorùbá Academy`,
    description: course?.description,
  };
}

async function getCourse(id: string) {
  try {
    // Use relative URL for internal API calls during SSR
    const apiUrl = process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}/api/courses/${id}`
      : process.env.NEXT_PUBLIC_APP_URL
      ? `${process.env.NEXT_PUBLIC_APP_URL}/api/courses/${id}`
      : `http://localhost:3000/api/courses/${id}`;
      
    const res = await fetch(apiUrl, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      if (res.status === 404) {
        notFound();
      }
      throw new Error('Failed to fetch course');
    }

    return res.json();
  } catch (error) {
    console.warn('Failed to fetch course:', error);
    // Return a default course structure or re-throw based on error type
    if (error instanceof Error && error.message.includes('Failed to fetch course')) {
      throw error; // Re-throw fetch errors
    }
    // For network errors, return null and let the page handle it
    notFound();
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const user = await getCurrentUser();
  const course = await getCourse(params.id);
  const isEnrolled = user && course.enrollments?.some(
    (e: Enrollment) => e.userId === user.id
  );

  if (!course) {
    notFound();
  }

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Course Header */}
          <div className="relative h-64 bg-gray-200">
            {course.thumbnail && (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-8">
              <div>
                <h1 className="text-3xl font-bold text-white">{course.title}</h1>
                <p className="text-gray-200 mt-2">
                  Instructor: {course.instructor?.name || course.teacher?.name}
                </p>
                <div className="flex items-center mt-4 space-x-4">
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {course.level}
                  </span>
                  <div className="flex items-center text-white text-sm">
                    <Users className="w-4 h-4 mr-1" />
                    <span>{course._count?.enrollments || 0} students</span>
                  </div>
                  <div className="flex items-center text-white text-sm">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{course.duration} weeks</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 p-8">
            {/* Main Content */}
            <div className="lg:col-span-2">
              <h2 className="text-2xl font-bold mb-4">About This Course</h2>
              <div className="prose max-w-none">
                <p className="text-gray-700">{course.description}</p>
              </div>

              {/* Course Content */}
              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Course Content</h2>
                <div className="space-y-2">
                  {course.modules?.map((module: Module) => (
                    <div key={module.id} className="border rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b">
                        <h3 className="font-medium">{module.title}</h3>
                      </div>
                      <div className="divide-y">
                        {module.lessons?.map((lesson: Lesson) => (
                          <div key={lesson.id} className="px-4 py-3 flex items-center justify-between hover:bg-gray-50">
                            <div className="flex items-center">
                              <Play className="w-4 h-4 text-gray-400 mr-3" />
                              <span>{lesson.title}</span>
                            </div>
                            <span className="text-sm text-gray-500">{lesson.duration} min</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <div className="text-3xl font-bold mb-4">
                  {course.price > 0 ? `$${course.price.toFixed(2)}` : 'Free'}
                </div>
                
                <EnrollButton 
                  courseId={course.id} 
                  isEnrolled={!!isEnrolled} 
                  isAuthenticated={!!user}
                  price={course.price}
                />

                <div className="mt-6 space-y-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Calendar className="w-5 h-5 mr-2 text-gray-500" />
                    <span>Duration: {course.duration} weeks</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{course.modules?.length || 0} modules</span>
                  </div>
                  <div className="flex items-center">
                    <Users className="w-5 h-5 mr-2 text-gray-500" />
                    <span>{course._count?.enrollments || 0} students enrolled</span>
                  </div>
                </div>
              </div>

              {course.instructor && (
                <div className="bg-white border rounded-lg p-6">
                  <h3 className="font-medium mb-4">Instructor</h3>
                  <div className="flex items-center">
                    <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-600">
                      {course.instructor.name.charAt(0)}
                    </div>
                    <div className="ml-4">
                      <h4 className="font-medium">{course.instructor.name}</h4>
                      <p className="text-sm text-gray-500">Instructor</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
