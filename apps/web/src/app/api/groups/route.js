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
    const type = searchParams.get('type') || 'joined'; // 'joined', 'available', 'created'

    if (type === 'joined') {
      // Get groups the user has joined
      const groups = await sql`
        SELECT 
          sg.*,
          gm.role as membership_role,
          gm.joined_at,
          COUNT(gm2.user_id) as member_count,
          up.full_name as creator_name
        FROM study_groups sg
        JOIN group_memberships gm ON sg.id = gm.group_id
        LEFT JOIN group_memberships gm2 ON sg.id = gm2.group_id
        LEFT JOIN user_profiles up ON sg.creator_id = up.user_id
        WHERE gm.user_id = ${userId}
        GROUP BY sg.id, gm.role, gm.joined_at, up.full_name
        ORDER BY gm.joined_at DESC
      `;
      return Response.json({ groups });
    } else if (type === 'available') {
      // Get available groups to join
      const groups = await sql`
        SELECT 
          sg.*,
          COUNT(gm.user_id) as member_count,
          up.full_name as creator_name,
          CASE WHEN gm2.user_id IS NOT NULL THEN true ELSE false END as is_member
        FROM study_groups sg
        LEFT JOIN group_memberships gm ON sg.id = gm.group_id
        LEFT JOIN user_profiles up ON sg.creator_id = up.user_id
        LEFT JOIN group_memberships gm2 ON sg.id = gm2.group_id AND gm2.user_id = ${userId}
        WHERE sg.is_public = true
        GROUP BY sg.id, up.full_name, gm2.user_id
        ORDER BY sg.created_at DESC
        LIMIT 20
      `;
      return Response.json({ groups });
    } else if (type === 'created') {
      // Get groups created by the user
      const groups = await sql`
        SELECT 
          sg.*,
          COUNT(gm.user_id) as member_count
        FROM study_groups sg
        LEFT JOIN group_memberships gm ON sg.id = gm.group_id
        WHERE sg.creator_id = ${userId}
        GROUP BY sg.id
        ORDER BY sg.created_at DESC
      `;
      return Response.json({ groups });
    }

    return Response.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Groups fetch error:', error);
    return Response.json({ error: 'Failed to fetch groups' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { name, description, learning_level, is_public = true, max_members = 50 } = await request.json();

    if (!name || !description) {
      return Response.json({ error: 'Name and description are required' }, { status: 400 });
    }

    // Create the group
    const [group] = await sql`
      INSERT INTO study_groups (
        name, description, creator_id, learning_level, is_public, max_members, created_at
      ) VALUES (
        ${name}, ${description}, ${userId}, ${learning_level}, ${is_public}, ${max_members}, NOW()
      )
      RETURNING *
    `;

    // Add creator as admin member
    await sql`
      INSERT INTO group_memberships (group_id, user_id, role, joined_at)
      VALUES (${group.id}, ${userId}, 'admin', NOW())
    `;

    return Response.json({ group }, { status: 201 });
  } catch (error) {
    console.error('Group creation error:', error);
    return Response.json({ error: 'Failed to create group' }, { status: 500 });
  }
}