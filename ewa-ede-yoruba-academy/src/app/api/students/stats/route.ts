import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth-utils';
import prisma from '@/lib/prisma';

interface UserProgress {
  completed: boolean;
}

interface Lesson {
  userProgress: UserProgress[];
}

interface Module {
  lessons: Lesson[];
}

interface Course {
  modules: Module[];
}

interface Enrollment {
  course: Course;
}

export async function GET() {
  try {
    const user = await getCurrentUser();
    
    if (!user) {
      return NextResponse.json(
        { error: 'You must be signed in to view your stats' },
        { status: 401 }
      );
    }

    // Get completed lessons
    const completedLessons = await prisma.lessonCompletion.count({
      where: {
        userId: user.id,
      },
    });

    // Get active enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId: user.id,
        status: 'ACTIVE',
      },
      include: {
        course: {
          include: {
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
    });

    // Calculate stats
    let totalLessons = 0;
    let totalCourseProgress = 0;
    let minutesThisWeek = 0; // Placeholder for time tracking

    enrollments.forEach((enrollment: Enrollment) => {
      const course = enrollment.course;
      let courseLessons = 0;
      let courseCompleted = 0;

      course.modules.forEach((module: Module) => {
        module.lessons.forEach((lesson: Lesson) => {
          courseLessons++;
          if (lesson.userProgress.some((up: UserProgress) => up.completed)) {
            courseCompleted++;
          }
        });
      });

      totalLessons += courseLessons;
      
      if (courseLessons > 0) {
        totalCourseProgress += (courseCompleted / courseLessons) * 100;
      }
    });

    // Get current streak (simplified - would need actual tracking)
    const currentStreak = await getCurrentStreak(user.id);
    
    // Calculate overall progress
    const activeCourses = enrollments.length;
    const overallProgress = activeCourses > 0 
      ? Math.round(totalCourseProgress / activeCourses) 
      : 0;

    // Get time spent this week (placeholder - would need actual tracking)
    const weeklyActivity = await prisma.userActivity.aggregate({
      where: {
        userId: user.id,
        activityType: 'LESSON_COMPLETED',
        createdAt: {
          gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Last 7 days
        },
      },
      _sum: {
        duration: true, // Assuming duration is stored in minutes
      },
    });

    minutesThisWeek = weeklyActivity._sum.duration || 0;

    return NextResponse.json({
      activeCourses,
      hoursThisWeek: minutesThisWeek / 60, // Convert to hours
      currentStreak,
      overallProgress,
      totalLessons,
      completedLessons,
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch student stats' },
      { status: 500 }
    );
  }
}

// Helper function to calculate current streak
async function getCurrentStreak(userId: string): Promise<number> {
  // This is a simplified implementation
  // In a real app, you'd track daily logins or lesson completions
  const lastActivity = await prisma.userActivity.findFirst({
    where: {
      userId,
      activityType: 'LESSON_COMPLETED',
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  if (!lastActivity) return 0;

  // Check if the last activity was yesterday or today
  const lastActivityDate = new Date(lastActivity.createdAt);
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastActivityDate.toDateString() === new Date().toDateString()) {
    // If last activity was today, check previous days
    const previousDay = await prisma.userActivity.findFirst({
      where: {
        userId,
        activityType: 'LESSON_COMPLETED',
        createdAt: {
          lt: new Date(new Date().setHours(0, 0, 0, 0)), // Before today
          gte: new Date(yesterday.setHours(0, 0, 0, 0)), // After or equal to yesterday
        },
      },
    });
    
    return previousDay ? 2 : 1; // Simplified for demo
  } else if (lastActivityDate.toDateString() === yesterday.toDateString()) {
    return 1; // Only yesterday
  }
  
  return 0; // No recent activity
}
