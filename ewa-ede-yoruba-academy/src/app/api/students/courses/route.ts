import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

interface UserProgress {
  completed: boolean;
}

interface Lesson {
  id: string;
  title: string;
  userProgress: UserProgress[];
}

interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
}

interface Instructor {
  name: string;
  email?: string;
}

interface Course {
  id: string;
  title: string;
  thumbnail?: string | null;
  instructor?: Instructor | null;
  teacher?: Instructor | null;
  modules: Module[];
  level?: string;
  duration?: number;
  _count?: {
    enrollments: number;
  };
}

interface Enrollment {
  course: Course;
}

interface NextLesson {
  title: string;
  moduleTitle: string;
}

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to view your courses' },
        { status: 401 }
      );
    }

    const enrollments = await prisma.enrollment.findMany({
      where: { userId: user.id },
      include: {
        course: {
          include: {
            instructor: {
              select: {
                name: true,
                email: true,
              },
            },
            modules: {
              include: {
                lessons: {
                  include: {
                    userProgress: {
                      where: { userId: user.id },
                    },
                  },
                },
              },
            },
          },
        },
      },
    }) as unknown as Enrollment[];

    // Transform the data to match the expected format
    const courses = enrollments.map((enrollment) => {
      const course = enrollment.course;
      
      // Calculate progress
      const totalLessons = course.modules.reduce(
        (sum, module) => sum + module.lessons.length, 
        0
      );
      
      const completedLessons = course.modules.reduce((sum, module) => {
        return (
          sum +
          module.lessons.filter(lesson => 
            lesson.userProgress.some(up => up.completed)
          ).length
        );
      }, 0);
      
      const progress = totalLessons > 0 
        ? Math.round((completedLessons / totalLessons) * 100) 
        : 0;

      // Get next lesson
      let nextLesson: NextLesson | null = null;
      for (const courseModule of course.modules) {
        const incompleteLesson = courseModule.lessons.find(
          lesson => !lesson.userProgress.some(up => up.completed)
        );

        if (incompleteLesson) {
          nextLesson = {
            title: incompleteLesson.title,
            moduleTitle: courseModule.title,
          };
          break;
        }
      }
      
      // Get the instructor (fallback to teacher if instructor doesn't exist)
      const instructor = course.instructor || course.teacher || { name: 'Unknown Instructor' };
      
      return {
        id: course.id,
        title: course.title,
        instructor,
        progress,
        nextLesson: nextLesson?.title,
        time: course.duration ? `${course.duration} weeks` : undefined,
        level: course.level,
        duration: course.duration,
        thumbnail: course.thumbnail,
        _count: {
          enrollments: course._count?.enrollments || 0,
        },
      };
    });

    return NextResponse.json({ courses });
  } catch (error) {
    console.error('Error fetching enrolled courses:', error);
    return NextResponse.json(
      { error: 'Failed to fetch enrolled courses' },
      { status: 500 }
    );
  }
}
