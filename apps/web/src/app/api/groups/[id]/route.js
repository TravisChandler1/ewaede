import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const groupId = params.id;

    // Get group details with member info
    const [group] = await sql`
      SELECT 
        sg.*,
        up.full_name as creator_name,
        COUNT(gm.user_id) as member_count,
        CASE WHEN gm2.user_id IS NOT NULL THEN gm2.role ELSE null END as user_role
      FROM study_groups sg
      LEFT JOIN user_profiles up ON sg.creator_id = up.user_id
      LEFT JOIN group_memberships gm ON sg.id = gm.group_id
      LEFT JOIN group_memberships gm2 ON sg.id = gm2.group_id AND gm2.user_id = ${userId}
      WHERE sg.id = ${groupId}
      GROUP BY sg.id, up.full_name, gm2.role
    `;

    if (!group) {
      return Response.json({ error: 'Group not found' }, { status: 404 });
    }

    // Get group members
    const members = await sql`
      SELECT 
        gm.*,
        up.full_name,
        up.learning_level,
        up.avatar_url
      FROM group_memberships gm
      JOIN user_profiles up ON gm.user_id = up.user_id
      WHERE gm.group_id = ${groupId}
      ORDER BY 
        CASE gm.role 
          WHEN 'admin' THEN 1 
          WHEN 'moderator' THEN 2 
          ELSE 3 
        END,
        gm.joined_at ASC
    `;

    // Get recent discussions/messages
    const discussions = await sql`
      SELECT 
        gd.*,
        up.full_name as author_name,
        up.avatar_url as author_avatar
      FROM group_discussions gd
      JOIN user_profiles up ON gd.user_id = up.user_id
      WHERE gd.group_id = ${groupId}
      ORDER BY gd.created_at DESC
      LIMIT 10
    `;

    return Response.json({ 
      group: { ...group, members, discussions }
    });
  } catch (error) {
    console.error('Group fetch error:', error);
    return Response.json({ error: 'Failed to fetch group' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const groupId = params.id;
    const { action } = await request.json();

    if (action === 'join') {
      // Check if group exists and is public
      const [group] = await sql`
        SELECT * FROM study_groups 
        WHERE id = ${groupId} AND (is_public = true OR creator_id = ${userId})
      `;

      if (!group) {
        return Response.json({ error: 'Group not found or not accessible' }, { status: 404 });
      }

      // Check if already a member
      const [existingMember] = await sql`
        SELECT * FROM group_memberships 
        WHERE group_id = ${groupId} AND user_id = ${userId}
      `;

      if (existingMember) {
        return Response.json({ error: 'Already a member of this group' }, { status: 400 });
      }

      // Check member limit
      const [memberCount] = await sql`
        SELECT COUNT(*) as count FROM group_memberships WHERE group_id = ${groupId}
      `;

      if (memberCount.count >= group.max_members) {
        return Response.json({ error: 'Group is full' }, { status: 400 });
      }

      // Join the group
      await sql`
        INSERT INTO group_memberships (group_id, user_id, role, joined_at)
        VALUES (${groupId}, ${userId}, 'member', NOW())
      `;

      return Response.json({ message: 'Successfully joined group' });
    } else if (action === 'leave') {
      // Leave the group
      const result = await sql`
        DELETE FROM group_memberships 
        WHERE group_id = ${groupId} AND user_id = ${userId}
      `;

      if (result.count === 0) {
        return Response.json({ error: 'Not a member of this group' }, { status: 400 });
      }

      return Response.json({ message: 'Successfully left group' });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Group action error:', error);
    return Response.json({ error: 'Failed to perform action' }, { status: 500 });
  }
}