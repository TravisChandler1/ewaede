import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUserId = session.user.id;
    const targetUserId = params.id;

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${adminUserId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Get user details
    const [user] = await sql`
      SELECT 
        user_id,
        full_name,
        email,
        role,
        is_active,
        learning_level,
        bio,
        avatar_url,
        created_at,
        updated_at
      FROM user_profiles 
      WHERE user_id = ${targetUserId}
    `;

    if (!user) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Get user activity summary
    const [activitySummary] = await sql`
      SELECT 
        COUNT(CASE WHEN activity_type = 'login' THEN 1 END) as login_count,
        COUNT(CASE WHEN activity_type = 'course_access' THEN 1 END) as course_access_count,
        COUNT(CASE WHEN activity_type = 'session_join' THEN 1 END) as session_join_count,
        MAX(created_at) as last_activity
      FROM user_activity 
      WHERE user_id = ${targetUserId}
    `;

    // Get user's courses (if student)
    let courses = [];
    if (user.role === 'student') {
      courses = await sql`
        SELECT 
          up.*,
          c.title as course_title,
          c.level
        FROM user_progress up
        JOIN courses c ON up.course_id = c.id
        WHERE up.user_id = ${targetUserId}
        ORDER BY up.last_accessed DESC
      `;
    }

    // Get user's sessions (if teacher)
    let sessions = [];
    if (user.role === 'teacher') {
      sessions = await sql`
        SELECT 
          id,
          title,
          status,
          scheduled_date,
          duration_minutes
        FROM live_sessions 
        WHERE teacher_id = ${targetUserId}
        ORDER BY scheduled_date DESC
        LIMIT 10
      `;
    }

    return Response.json({
      user,
      activitySummary: activitySummary || {},
      courses,
      sessions
    });

  } catch (error) {
    console.error('Admin user fetch error:', error);
    return Response.json({ error: 'Failed to fetch user' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUserId = session.user.id;
    const targetUserId = params.id;
    const updates = await request.json();

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${adminUserId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Get current user data for audit log
    const [currentUser] = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${targetUserId}
    `;

    if (!currentUser) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Build update query
    const allowedFields = ['full_name', 'email', 'role', 'is_active', 'learning_level', 'bio'];
    const updateFields = [];
    const updateValues = [];

    Object.keys(updates).forEach(key => {
      if (allowedFields.includes(key) && updates[key] !== undefined) {
        updateFields.push(`${key} = $${updateValues.length + 1}`);
        updateValues.push(updates[key]);
      }
    });

    if (updateFields.length === 0) {
      return Response.json({ error: 'No valid fields to update' }, { status: 400 });
    }

    // Add updated_at
    updateFields.push(`updated_at = NOW()`);

    // Update user
    const [updatedUser] = await sql.unsafe(`
      UPDATE user_profiles 
      SET ${updateFields.join(', ')}
      WHERE user_id = $${updateValues.length + 1}
      RETURNING *
    `, [...updateValues, targetUserId]);

    // Log the action
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values, new_values)
      VALUES (${adminUserId}, 'update_user', 'user_profile', ${targetUserId}, ${JSON.stringify(currentUser)}, ${JSON.stringify(updatedUser)})
    `;

    return Response.json({ user: updatedUser });

  } catch (error) {
    console.error('Admin user update error:', error);
    return Response.json({ error: 'Failed to update user' }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUserId = session.user.id;
    const targetUserId = params.id;

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${adminUserId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Prevent admin from deleting themselves
    if (adminUserId === targetUserId) {
      return Response.json({ error: 'Cannot delete your own account' }, { status: 400 });
    }

    // Get user data for audit log
    const [userToDelete] = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${targetUserId}
    `;

    if (!userToDelete) {
      return Response.json({ error: 'User not found' }, { status: 404 });
    }

    // Soft delete - mark as inactive instead of hard delete
    await sql`
      UPDATE user_profiles 
      SET is_active = false, updated_at = NOW()
      WHERE user_id = ${targetUserId}
    `;

    // Log the action
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, old_values)
      VALUES (${adminUserId}, 'deactivate_user', 'user_profile', ${targetUserId}, ${JSON.stringify(userToDelete)})
    `;

    return Response.json({ message: 'User deactivated successfully' });

  } catch (error) {
    console.error('Admin user deletion error:', error);
    return Response.json({ error: 'Failed to deactivate user' }, { status: 500 });
  }
}