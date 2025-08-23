import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { 
      qualifications, 
      experience_years, 
      teaching_subjects, 
      cv_url, 
      cover_letter 
    } = await request.json();

    // Get user profile
    const [userProfile] = await sql`
      SELECT * FROM user_profiles WHERE user_id = ${userId}
    `;

    if (!userProfile) {
      return Response.json({ error: 'User profile not found' }, { status: 404 });
    }

    // Check if user already has a pending or approved application
    const [existingApplication] = await sql`
      SELECT * FROM teacher_applications 
      WHERE user_id = ${userId} AND status IN ('pending', 'approved', 'under_review')
    `;

    if (existingApplication) {
      return Response.json({ 
        error: 'You already have a teacher application in progress' 
      }, { status: 400 });
    }

    // Validate required fields
    if (!qualifications || !experience_years || !teaching_subjects || !cover_letter) {
      return Response.json({ 
        error: 'All fields are required: qualifications, experience_years, teaching_subjects, cover_letter' 
      }, { status: 400 });
    }

    // Create teacher application
    const [application] = await sql`
      INSERT INTO teacher_applications (
        user_id,
        full_name,
        email,
        qualifications,
        experience_years,
        teaching_subjects,
        cv_url,
        cover_letter,
        status,
        applied_at
      ) VALUES (
        ${userId},
        ${userProfile.full_name},
        ${userProfile.email},
        ${qualifications},
        ${experience_years},
        ${Array.isArray(teaching_subjects) ? teaching_subjects : [teaching_subjects]},
        ${cv_url || null},
        ${cover_letter},
        'pending',
        NOW()
      )
      RETURNING *
    `;

    // Log the application
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values)
      VALUES (${userId}, 'submit_teacher_application', 'teacher_application', ${application.id}, ${JSON.stringify(application)})
    `;

    return Response.json({ 
      message: 'Teacher application submitted successfully',
      application 
    }, { status: 201 });

  } catch (error) {
    console.error('Teacher application error:', error);
    return Response.json({ error: 'Failed to submit teacher application' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;

    // Get user's teacher application
    const [application] = await sql`
      SELECT 
        ta.*,
        reviewer.full_name as reviewer_name
      FROM teacher_applications ta
      LEFT JOIN user_profiles reviewer ON ta.reviewed_by = reviewer.user_id
      WHERE ta.user_id = ${userId}
      ORDER BY ta.applied_at DESC
      LIMIT 1
    `;

    if (!application) {
      return Response.json({ error: 'No teacher application found' }, { status: 404 });
    }

    return Response.json({ application });

  } catch (error) {
    console.error('Teacher application fetch error:', error);
    return Response.json({ error: 'Failed to fetch teacher application' }, { status: 500 });
  }
}