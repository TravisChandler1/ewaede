import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const profile = await sql`
      SELECT 
        up.*,
        au.email,
        au.name
      FROM user_profiles up
      JOIN auth_users au ON up.user_id = au.id
      WHERE up.user_id = ${session.user.id}
    `;

    if (profile.length === 0) {
      return Response.json({ profile: null }, { status: 200 });
    }

    return Response.json({ profile: profile[0] }, { status: 200 });
  } catch (error) {
    console.error('Get profile error:', error);
    return Response.json({ error: 'Failed to get profile' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { fullName, role, learningLevel, teachingPreference, phoneNumber, bio } = await request.json();

    if (!fullName || !role) {
      return Response.json({ error: 'Full name and role are required' }, { status: 400 });
    }

    // Check if profile already exists
    const existingProfile = await sql`
      SELECT id FROM user_profiles WHERE user_id = ${session.user.id}
    `;

    if (existingProfile.length > 0) {
      // Update existing profile
      await sql`
        UPDATE user_profiles 
        SET 
          full_name = ${fullName},
          role = ${role},
          learning_level = ${learningLevel},
          teaching_preference = ${teachingPreference},
          phone_number = ${phoneNumber},
          bio = ${bio},
          updated_at = NOW()
        WHERE user_id = ${session.user.id}
      `;
    } else {
      // Create new profile
      await sql`
        INSERT INTO user_profiles (
          user_id, full_name, role, learning_level, teaching_preference, phone_number, bio
        ) VALUES (
          ${session.user.id}, ${fullName}, ${role}, ${learningLevel}, ${teachingPreference}, ${phoneNumber}, ${bio}
        )
      `;
    }

    // Also update user name in auth_users if needed
    if (fullName !== session.user.name) {
      await sql`
        UPDATE auth_users SET name = ${fullName} WHERE id = ${session.user.id}
      `;
    }

    return Response.json({ message: 'Profile updated successfully' }, { status: 200 });
  } catch (error) {
    console.error('Update profile error:', error);
    return Response.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}