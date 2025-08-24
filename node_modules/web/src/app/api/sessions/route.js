import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') || 'available'; // 'available', 'registered', 'created'
    const status = searchParams.get('status'); // 'scheduled', 'live', 'completed'

    // Get user profile to check role
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${userId}
    `;

    if (type === 'available') {
      // Get available sessions to register for
      let query = sql`
        SELECT 
          ls.*,
          up.full_name as teacher_name,
          COUNT(sr.user_id) as registered_count,
          CASE WHEN sr2.user_id IS NOT NULL THEN true ELSE false END as is_registered
        FROM live_sessions ls
        JOIN user_profiles up ON ls.teacher_id = up.user_id
        LEFT JOIN session_registrations sr ON ls.id = sr.session_id
        LEFT JOIN session_registrations sr2 ON ls.id = sr2.session_id AND sr2.user_id = ${userId}
        WHERE ls.scheduled_date > NOW()
      `;

      if (status) {
        query = sql`${query} AND ls.status = ${status}`;
      }

      query = sql`${query}
        GROUP BY ls.id, up.full_name, sr2.user_id
        ORDER BY ls.scheduled_date ASC
        LIMIT 20
      `;

      const sessions = await query;
      return Response.json({ sessions });
    } else if (type === 'registered') {
      // Get sessions the user has registered for
      let query = sql`
        SELECT 
          ls.*,
          up.full_name as teacher_name,
          sr.registered_at,
          sr.attended,
          COUNT(sr2.user_id) as registered_count
        FROM live_sessions ls
        JOIN session_registrations sr ON ls.id = sr.session_id
        JOIN user_profiles up ON ls.teacher_id = up.user_id
        LEFT JOIN session_registrations sr2 ON ls.id = sr2.session_id
        WHERE sr.user_id = ${userId}
      `;

      if (status) {
        query = sql`${query} AND ls.status = ${status}`;
      }

      query = sql`${query}
        GROUP BY ls.id, up.full_name, sr.registered_at, sr.attended
        ORDER BY ls.scheduled_date DESC
      `;

      const sessions = await query;
      return Response.json({ sessions });
    } else if (type === 'created' && userProfile.role === 'teacher') {
      // Get sessions created by the teacher
      let query = sql`
        SELECT 
          ls.*,
          COUNT(sr.user_id) as registered_count
        FROM live_sessions ls
        LEFT JOIN session_registrations sr ON ls.id = sr.session_id
        WHERE ls.teacher_id = ${userId}
      `;

      if (status) {
        query = sql`${query} AND ls.status = ${status}`;
      }

      query = sql`${query}
        GROUP BY ls.id
        ORDER BY ls.scheduled_date DESC
      `;

      const sessions = await query;
      return Response.json({ sessions });
    }

    return Response.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Sessions fetch error:', error);
    return Response.json({ error: 'Failed to fetch sessions' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    
    // Check if user is a teacher
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${userId}
    `;

    if (userProfile.role !== 'teacher') {
      return Response.json({ error: 'Only teachers can create sessions' }, { status: 403 });
    }

    const { 
      title, 
      description, 
      scheduled_date, 
      duration_minutes = 60, 
      max_participants = 100,
      learning_level,
      session_type = 'live',
      meeting_url
    } = await request.json();

    if (!title || !description || !scheduled_date) {
      return Response.json({ error: 'Title, description, and scheduled date are required' }, { status: 400 });
    }

    // Create the session
    const [newSession] = await sql`
      INSERT INTO live_sessions (
        title, description, teacher_id, scheduled_date, duration_minutes,
        max_participants, learning_level, session_type, meeting_url,
        status, created_at
      ) VALUES (
        ${title}, ${description}, ${userId}, ${scheduled_date}, ${duration_minutes},
        ${max_participants}, ${learning_level}, ${session_type}, ${meeting_url},
        'scheduled', NOW()
      )
      RETURNING *
    `;

    return Response.json({ session: newSession }, { status: 201 });
  } catch (error) {
    console.error('Session creation error:', error);
    return Response.json({ error: 'Failed to create session' }, { status: 500 });
  }
}