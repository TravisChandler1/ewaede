import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = params.id;

    // Get session details
    const [sessionData] = await sql`
      SELECT 
        ls.*,
        up.full_name as teacher_name,
        up.avatar_url as teacher_avatar,
        COUNT(sr.user_id) as registered_count,
        CASE WHEN sr2.user_id IS NOT NULL THEN true ELSE false END as is_registered,
        sr2.registered_at,
        sr2.attended
      FROM live_sessions ls
      JOIN user_profiles up ON ls.teacher_id = up.user_id
      LEFT JOIN session_registrations sr ON ls.id = sr.session_id
      LEFT JOIN session_registrations sr2 ON ls.id = sr2.session_id AND sr2.user_id = ${userId}
      WHERE ls.id = ${sessionId}
      GROUP BY ls.id, up.full_name, up.avatar_url, sr2.user_id, sr2.registered_at, sr2.attended
    `;

    if (!sessionData) {
      return Response.json({ error: 'Session not found' }, { status: 404 });
    }

    // Get registered participants (if user is teacher or registered)
    let participants = [];
    if (sessionData.teacher_id === userId || sessionData.is_registered) {
      participants = await sql`
        SELECT 
          sr.*,
          up.full_name,
          up.learning_level,
          up.avatar_url
        FROM session_registrations sr
        JOIN user_profiles up ON sr.user_id = up.user_id
        WHERE sr.session_id = ${sessionId}
        ORDER BY sr.registered_at ASC
      `;
    }

    return Response.json({ 
      session: { ...sessionData, participants }
    });
  } catch (error) {
    console.error('Session fetch error:', error);
    return Response.json({ error: 'Failed to fetch session' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = params.id;
    const { action } = await request.json();

    if (action === 'register') {
      // Check if session exists and is available
      const [sessionData] = await sql`
        SELECT * FROM live_sessions 
        WHERE id = ${sessionId} AND status = 'scheduled' AND scheduled_date > NOW()
      `;

      if (!sessionData) {
        return Response.json({ error: 'Session not found or not available for registration' }, { status: 404 });
      }

      // Check if already registered
      const [existingRegistration] = await sql`
        SELECT * FROM session_registrations 
        WHERE session_id = ${sessionId} AND user_id = ${userId}
      `;

      if (existingRegistration) {
        return Response.json({ error: 'Already registered for this session' }, { status: 400 });
      }

      // Check participant limit
      const [participantCount] = await sql`
        SELECT COUNT(*) as count FROM session_registrations WHERE session_id = ${sessionId}
      `;

      if (participantCount.count >= sessionData.max_participants) {
        return Response.json({ error: 'Session is full' }, { status: 400 });
      }

      // Register for the session
      await sql`
        INSERT INTO session_registrations (session_id, user_id, registered_at)
        VALUES (${sessionId}, ${userId}, NOW())
      `;

      return Response.json({ message: 'Successfully registered for session' });
    } else if (action === 'unregister') {
      // Unregister from the session
      const result = await sql`
        DELETE FROM session_registrations 
        WHERE session_id = ${sessionId} AND user_id = ${userId}
      `;

      if (result.count === 0) {
        return Response.json({ error: 'Not registered for this session' }, { status: 400 });
      }

      return Response.json({ message: 'Successfully unregistered from session' });
    } else if (action === 'start') {
      // Start the session (teacher only)
      const [sessionData] = await sql`
        SELECT * FROM live_sessions WHERE id = ${sessionId} AND teacher_id = ${userId}
      `;

      if (!sessionData) {
        return Response.json({ error: 'Session not found or unauthorized' }, { status: 404 });
      }

      await sql`
        UPDATE live_sessions 
        SET status = 'live', started_at = NOW()
        WHERE id = ${sessionId}
      `;

      return Response.json({ message: 'Session started successfully' });
    } else if (action === 'end') {
      // End the session (teacher only)
      const [sessionData] = await sql`
        SELECT * FROM live_sessions WHERE id = ${sessionId} AND teacher_id = ${userId}
      `;

      if (!sessionData) {
        return Response.json({ error: 'Session not found or unauthorized' }, { status: 404 });
      }

      await sql`
        UPDATE live_sessions 
        SET status = 'completed', ended_at = NOW()
        WHERE id = ${sessionId}
      `;

      return Response.json({ message: 'Session ended successfully' });
    } else if (action === 'attend') {
      // Mark attendance (for registered users)
      const [registration] = await sql`
        SELECT * FROM session_registrations 
        WHERE session_id = ${sessionId} AND user_id = ${userId}
      `;

      if (!registration) {
        return Response.json({ error: 'Not registered for this session' }, { status: 400 });
      }

      await sql`
        UPDATE session_registrations 
        SET attended = true, attended_at = NOW()
        WHERE session_id = ${sessionId} AND user_id = ${userId}
      `;

      return Response.json({ message: 'Attendance marked successfully' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Session action error:', error);
    return Response.json({ error: 'Failed to perform action' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = params.id;
    
    // Check if user is the teacher who created this session
    const [sessionData] = await sql`
      SELECT * FROM live_sessions WHERE id = ${sessionId} AND teacher_id = ${userId}
    `;

    if (!sessionData) {
      return Response.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    const { 
      title, 
      description, 
      scheduled_date, 
      duration_minutes,
      max_participants,
      learning_level,
      meeting_url
    } = await request.json();

    // Update the session
    const [updatedSession] = await sql`
      UPDATE live_sessions 
      SET 
        title = COALESCE(${title}, title),
        description = COALESCE(${description}, description),
        scheduled_date = COALESCE(${scheduled_date}, scheduled_date),
        duration_minutes = COALESCE(${duration_minutes}, duration_minutes),
        max_participants = COALESCE(${max_participants}, max_participants),
        learning_level = COALESCE(${learning_level}, learning_level),
        meeting_url = COALESCE(${meeting_url}, meeting_url),
        updated_at = NOW()
      WHERE id = ${sessionId}
      RETURNING *
    `;

    return Response.json({ session: updatedSession });
  } catch (error) {
    console.error('Session update error:', error);
    return Response.json({ error: 'Failed to update session' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const sessionId = params.id;
    
    // Check if user is the teacher who created this session
    const [sessionData] = await sql`
      SELECT * FROM live_sessions WHERE id = ${sessionId} AND teacher_id = ${userId}
    `;

    if (!sessionData) {
      return Response.json({ error: 'Session not found or unauthorized' }, { status: 404 });
    }

    // Delete session registrations first
    await sql`DELETE FROM session_registrations WHERE session_id = ${sessionId}`;
    
    // Delete the session
    await sql`DELETE FROM live_sessions WHERE id = ${sessionId}`;

    return Response.json({ message: 'Session deleted successfully' });
  } catch (error) {
    console.error('Session deletion error:', error);
    return Response.json({ error: 'Failed to delete session' }, { status: 500 });
  }
}