import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const applicationId = params.id;

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${userId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Get teacher application details
    const [application] = await sql`
      SELECT 
        ta.*,
        up.full_name,
        up.email,
        up.avatar_url,
        reviewer.full_name as reviewer_name
      FROM teacher_applications ta
      LEFT JOIN user_profiles up ON ta.user_id = up.user_id
      LEFT JOIN user_profiles reviewer ON ta.reviewed_by = reviewer.user_id
      WHERE ta.id = ${applicationId}
    `;

    if (!application) {
      return Response.json({ error: 'Application not found' }, { status: 404 });
    }

    return Response.json({ application });

  } catch (error) {
    console.error('Teacher application fetch error:', error);
    return Response.json({ error: 'Failed to fetch application' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const applicationId = params.id;
    const { action, reason } = await request.json();

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${userId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Get the application
    const [application] = await sql`
      SELECT * FROM teacher_applications WHERE id = ${applicationId}
    `;

    if (!application) {
      return Response.json({ error: 'Application not found' }, { status: 404 });
    }

    if (action === 'approve') {
      // Update application status
      await sql`
        UPDATE teacher_applications 
        SET 
          status = 'approved',
          reviewed_by = ${userId},
          reviewed_at = NOW()
        WHERE id = ${applicationId}
      `;

      // Update user role to teacher
      await sql`
        UPDATE user_profiles 
        SET role = 'teacher'
        WHERE user_id = ${application.user_id}
      `;

      // Log the action
      await sql`
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values)
        VALUES (${userId}, 'approve_teacher_application', 'teacher_application', ${applicationId}, ${{
          status: 'approved',
          reviewed_by: userId
        }})
      `;

      return Response.json({ message: 'Teacher application approved successfully' });

    } else if (action === 'reject') {
      // Update application status
      await sql`
        UPDATE teacher_applications 
        SET 
          status = 'rejected',
          reviewed_by = ${userId},
          reviewed_at = NOW(),
          rejection_reason = ${reason || 'Application does not meet requirements'}
        WHERE id = ${applicationId}
      `;

      // Log the action
      await sql`
        INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values)
        VALUES (${userId}, 'reject_teacher_application', 'teacher_application', ${applicationId}, ${{
          status: 'rejected',
          reviewed_by: userId,
          rejection_reason: reason
        }})
      `;

      return Response.json({ message: 'Teacher application rejected' });

    } else if (action === 'under_review') {
      // Update application status
      await sql`
        UPDATE teacher_applications 
        SET 
          status = 'under_review',
          reviewed_by = ${userId},
          reviewed_at = NOW()
        WHERE id = ${applicationId}
      `;

      return Response.json({ message: 'Application marked as under review' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('Teacher application update error:', error);
    return Response.json({ error: 'Failed to update application' }, { status: 500 });
  }
}