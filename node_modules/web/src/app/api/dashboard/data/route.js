import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user profile
    const profile = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `;

    if (profile.length === 0) {
      return Response.json({ error: 'Profile not found' }, { status: 404 });
    }

    const userProfile = profile[0];

    if (userProfile.role === 'student') {
      // Student dashboard data
      const [progress, groups, bookClubs, sessions, libraryResources] = await sql.transaction([
        sql`
          SELECT 
            up.*,
            c.title as course_title,
            c.level,
            c.duration_weeks
          FROM user_progress up
          JOIN courses c ON up.course_id = c.id
          WHERE up.user_id = ${userId}
          ORDER BY up.last_accessed DESC
        `,
        sql`
          SELECT 
            sg.*,
            gm.role as membership_role
          FROM study_groups sg
          JOIN group_memberships gm ON sg.id = gm.group_id
          WHERE gm.user_id = ${userId}
          ORDER BY sg.created_at DESC
        `,
        sql`
          SELECT 
            bc.*,
            bcm.progress_chapter
          FROM book_clubs bc
          JOIN book_club_memberships bcm ON bc.id = bcm.book_club_id
          WHERE bcm.user_id = ${userId}
          ORDER BY bc.created_at DESC
        `,
        sql`
          SELECT 
            ls.*,
            sr.registered_at,
            sr.attended
          FROM live_sessions ls
          JOIN session_registrations sr ON ls.id = sr.session_id
          WHERE sr.user_id = ${userId}
          ORDER BY ls.scheduled_date DESC
          LIMIT 5
        `,
        sql`
          SELECT * FROM library_resources
          WHERE level = ${userProfile.learning_level} OR level IS NULL
          ORDER BY created_at DESC
          LIMIT 6
        `
      ]);

      return Response.json({
        profile: userProfile,
        progress,
        groups,
        bookClubs,
        sessions,
        libraryResources
      });

    } else if (userProfile.role === 'teacher') {
      // Teacher dashboard data
      const [students, sessions, groups, analytics] = await sql.transaction([
        sql`
          SELECT COUNT(DISTINCT up.user_id) as total_students
          FROM user_profiles up
          WHERE up.role = 'student'
        `,
        sql`
          SELECT 
            ls.*,
            COUNT(sr.user_id) as registered_count
          FROM live_sessions ls
          LEFT JOIN session_registrations sr ON ls.id = sr.session_id
          WHERE ls.teacher_id = ${userId}
          GROUP BY ls.id
          ORDER BY ls.scheduled_date DESC
          LIMIT 10
        `,
        sql`
          SELECT 
            sg.*,
            COUNT(gm.user_id) as member_count
          FROM study_groups sg
          LEFT JOIN group_memberships gm ON sg.id = gm.group_id
          WHERE sg.creator_id = ${userId}
          GROUP BY sg.id
          ORDER BY sg.created_at DESC
        `,
        sql`
          SELECT 
            COUNT(DISTINCT sr.user_id) as total_session_attendees,
            COUNT(DISTINCT ls.id) as total_sessions_created
          FROM live_sessions ls
          LEFT JOIN session_registrations sr ON ls.id = sr.session_id
          WHERE ls.teacher_id = ${userId}
        `
      ]);

      return Response.json({
        profile: userProfile,
        students: students[0],
        sessions,
        groups,
        analytics: analytics[0]
      });
    }

    return Response.json({ error: 'Invalid role' }, { status: 400 });
  } catch (error) {
    console.error('Dashboard data error:', error);
    return Response.json({ error: 'Failed to fetch dashboard data' }, { status: 500 });
  }
}