import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${userId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Get platform statistics
    const [stats] = await sql.transaction([
      // Total users
      sql`SELECT COUNT(*) as total_users FROM user_profiles`,
      
      // Users by role
      sql`
        SELECT 
          role,
          COUNT(*) as count
        FROM user_profiles 
        GROUP BY role
      `,
      
      // New users this month
      sql`
        SELECT COUNT(*) as new_users_this_month 
        FROM user_profiles 
        WHERE created_at >= DATE_TRUNC('month', CURRENT_DATE)
      `,
      
      // Teacher applications
      sql`
        SELECT 
          status,
          COUNT(*) as count
        FROM teacher_applications 
        GROUP BY status
      `,
      
      // Course statistics
      sql`
        SELECT 
          COUNT(*) as total_courses,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_courses
        FROM courses
      `,
      
      // Session statistics
      sql`
        SELECT 
          COUNT(*) as total_sessions,
          COUNT(CASE WHEN status = 'live' THEN 1 END) as live_sessions,
          COUNT(CASE WHEN status = 'scheduled' THEN 1 END) as scheduled_sessions
        FROM live_sessions
      `,
      
      // Payment statistics (if payments table exists)
      sql`
        SELECT 
          COALESCE(SUM(amount), 0) as total_revenue,
          COALESCE(SUM(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN amount ELSE 0 END), 0) as monthly_revenue
        FROM payments 
        WHERE status = 'completed'
      `,
      
      // Content reports
      sql`
        SELECT 
          status,
          COUNT(*) as count
        FROM content_reports 
        GROUP BY status
      `
    ]);

    // Get recent users
    const recentUsers = await sql`
      SELECT 
        user_id,
        full_name,
        email,
        role,
        created_at,
        is_active
      FROM user_profiles 
      ORDER BY created_at DESC 
      LIMIT 10
    `;

    // Get teacher applications
    const teacherApplications = await sql`
      SELECT 
        ta.*,
        up.full_name,
        up.email
      FROM teacher_applications ta
      LEFT JOIN user_profiles up ON ta.user_id = up.user_id
      ORDER BY ta.applied_at DESC
      LIMIT 20
    `;

    // Get all users for user management
    const users = await sql`
      SELECT 
        user_id,
        full_name,
        email,
        role,
        is_active,
        created_at,
        learning_level
      FROM user_profiles 
      ORDER BY created_at DESC
      LIMIT 100
    `;

    // Process statistics
    const usersByRole = stats[1].reduce((acc, item) => {
      acc[item.role] = parseInt(item.count);
      return acc;
    }, {});

    const teacherAppsByStatus = stats[3].reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

    const reportsByStatus = stats[7].reduce((acc, item) => {
      acc[item.status] = parseInt(item.count);
      return acc;
    }, {});

    const platformStats = {
      totalUsers: parseInt(stats[0][0].total_users),
      newUsersThisMonth: parseInt(stats[2][0].new_users_this_month),
      activeTeachers: usersByRole.teacher || 0,
      totalStudents: usersByRole.student || 0,
      totalAdmins: usersByRole.admin || 0,
      pendingTeachers: teacherAppsByStatus.pending || 0,
      approvedTeachers: teacherAppsByStatus.approved || 0,
      rejectedTeachers: teacherAppsByStatus.rejected || 0,
      totalCourses: parseInt(stats[4][0].total_courses),
      activeCourses: parseInt(stats[4][0].active_courses),
      totalSessions: parseInt(stats[5][0].total_sessions),
      liveSessions: parseInt(stats[5][0].live_sessions),
      scheduledSessions: parseInt(stats[5][0].scheduled_sessions),
      totalRevenue: parseFloat(stats[6][0].total_revenue),
      monthlyRevenue: parseFloat(stats[6][0].monthly_revenue),
      pendingReports: reportsByStatus.pending || 0,
      resolvedReports: reportsByStatus.resolved || 0,
      pendingCourses: 0 // Placeholder for course approval system
    };

    return Response.json({
      stats: platformStats,
      recentUsers,
      teacherApplications,
      users
    });

  } catch (error) {
    console.error('Admin dashboard error:', error);
    return Response.json({ error: 'Failed to fetch admin data' }, { status: 500 });
  }
}