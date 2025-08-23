import sql from "@/app/api/utils/sql";
import { auth } from "@/auth";

export async function GET(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const bookClubId = params.id;

    // Get book club details
    const [bookClub] = await sql`
      SELECT 
        bc.*,
        up.full_name as creator_name,
        COUNT(bcm.user_id) as member_count,
        CASE WHEN bcm2.user_id IS NOT NULL THEN bcm2.progress_chapter ELSE null END as user_progress
      FROM book_clubs bc
      LEFT JOIN user_profiles up ON bc.creator_id = up.user_id
      LEFT JOIN book_club_memberships bcm ON bc.id = bcm.book_club_id
      LEFT JOIN book_club_memberships bcm2 ON bc.id = bcm2.book_club_id AND bcm2.user_id = ${userId}
      WHERE bc.id = ${bookClubId}
      GROUP BY bc.id, up.full_name, bcm2.progress_chapter
    `;

    if (!bookClub) {
      return Response.json({ error: 'Book club not found' }, { status: 404 });
    }

    // Get book club members
    const members = await sql`
      SELECT 
        bcm.*,
        up.full_name,
        up.learning_level,
        up.avatar_url
      FROM book_club_memberships bcm
      JOIN user_profiles up ON bcm.user_id = up.user_id
      WHERE bcm.book_club_id = ${bookClubId}
      ORDER BY bcm.joined_at ASC
    `;

    // Get recent discussions
    const discussions = await sql`
      SELECT 
        bcd.*,
        up.full_name as author_name,
        up.avatar_url as author_avatar
      FROM book_club_discussions bcd
      JOIN user_profiles up ON bcd.user_id = up.user_id
      WHERE bcd.book_club_id = ${bookClubId}
      ORDER BY bcd.created_at DESC
      LIMIT 10
    `;

    return Response.json({ 
      bookClub: { ...bookClub, members, discussions }
    });
  } catch (error) {
    console.error('Book club fetch error:', error);
    return Response.json({ error: 'Failed to fetch book club' }, { status: 500 });
  }
}

export async function POST(request, { params }) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const bookClubId = params.id;
    const { action, chapter } = await request.json();

    if (action === 'join') {
      // Check if book club exists and is active
      const [bookClub] = await sql`
        SELECT * FROM book_clubs 
        WHERE id = ${bookClubId} AND is_active = true
      `;

      if (!bookClub) {
        return Response.json({ error: 'Book club not found or not active' }, { status: 404 });
      }

      // Check if already a member
      const [existingMember] = await sql`
        SELECT * FROM book_club_memberships 
        WHERE book_club_id = ${bookClubId} AND user_id = ${userId}
      `;

      if (existingMember) {
        return Response.json({ error: 'Already a member of this book club' }, { status: 400 });
      }

      // Check member limit
      const [memberCount] = await sql`
        SELECT COUNT(*) as count FROM book_club_memberships WHERE book_club_id = ${bookClubId}
      `;

      if (memberCount.count >= bookClub.max_members) {
        return Response.json({ error: 'Book club is full' }, { status: 400 });
      }

      // Join the book club
      await sql`
        INSERT INTO book_club_memberships (book_club_id, user_id, progress_chapter, joined_at)
        VALUES (${bookClubId}, ${userId}, ${bookClub.current_chapter}, NOW())
      `;

      return Response.json({ message: 'Successfully joined book club' });
    } else if (action === 'leave') {
      // Leave the book club
      const result = await sql`
        DELETE FROM book_club_memberships 
        WHERE book_club_id = ${bookClubId} AND user_id = ${userId}
      `;

      if (result.count === 0) {
        return Response.json({ error: 'Not a member of this book club' }, { status: 400 });
      }

      return Response.json({ message: 'Successfully left book club' });
    } else if (action === 'update_progress') {
      // Update reading progress
      if (!chapter || chapter < 1) {
        return Response.json({ error: 'Valid chapter number is required' }, { status: 400 });
      }

      const [membership] = await sql`
        SELECT * FROM book_club_memberships 
        WHERE book_club_id = ${bookClubId} AND user_id = ${userId}
      `;

      if (!membership) {
        return Response.json({ error: 'Not a member of this book club' }, { status: 400 });
      }

      await sql`
        UPDATE book_club_memberships 
        SET progress_chapter = ${chapter}, last_updated = NOW()
        WHERE book_club_id = ${bookClubId} AND user_id = ${userId}
      `;

      return Response.json({ message: 'Progress updated successfully' });
    } else if (action === 'post_discussion') {
      const { content, chapter_number } = await request.json();
      
      if (!content) {
        return Response.json({ error: 'Discussion content is required' }, { status: 400 });
      }

      // Check if user is a member
      const [membership] = await sql`
        SELECT * FROM book_club_memberships 
        WHERE book_club_id = ${bookClubId} AND user_id = ${userId}
      `;

      if (!membership) {
        return Response.json({ error: 'Not a member of this book club' }, { status: 400 });
      }

      // Post discussion
      const [discussion] = await sql`
        INSERT INTO book_club_discussions (book_club_id, user_id, content, chapter_number, created_at)
        VALUES (${bookClubId}, ${userId}, ${content}, ${chapter_number}, NOW())
        RETURNING *
      `;

      return Response.json({ discussion }, { status: 201 });
    }

    return Response.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('Book club action error:', error);
    return Response.json({ error: 'Failed to perform action' }, { status: 500 });
  }
}