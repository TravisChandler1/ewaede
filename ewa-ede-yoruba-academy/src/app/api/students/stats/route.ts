import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'You must be signed in to view your stats' },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    // Get active enrollments
    const enrollments = await prisma.enrollment.findMany({
      where: {
        userId,
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
                      where: { userId },
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
    let completedLessons = 0;
    let totalCourseProgress = 0;
    let minutesThisWeek = 0; // Placeholder for time tracking

    enrollments.forEach((enrollment) => {
      const course = enrollment.course;
      let courseLessons = 0;
      let courseCompleted = 0;

      course.modules.forEach((module) => {
        module.lessons.forEach((lesson) => {
          courseLessons++;
          if (lesson.userProgress.some((up) => up.completed)) {
            courseCompleted++;
          }
        });
      });

      totalLessons += courseLessons;
      completedLessons += courseCompleted;
      
      if (courseLessons > 0) {
        totalCourseProgress += (courseCompleted / courseLessons) * 100;
      }
    });

    // Get current streak (simplified - would need actual tracking)
    const currentStreak = await getCurrentStreak(userId);
    
    // Calculate overall progress
    const activeCourses = enrollments.length;
    const overallProgress = activeCourses > 0 
      ? Math.round(totalCourseProgress / activeCourses) 
      : 0;

    // Get time spent this week (placeholder - would need actual tracking)
    const weeklyActivity = await prisma.userActivity.aggregate({
      where: {
        userId,
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
