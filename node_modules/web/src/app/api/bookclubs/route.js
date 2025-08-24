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
    const type = searchParams.get('type') || 'available'; // 'available', 'joined', 'created'

    if (type === 'joined') {
      // Get book clubs the user has joined
      const bookClubs = await sql`
        SELECT 
          bc.*,
          bcm.progress_chapter,
          bcm.joined_at,
          COUNT(bcm2.user_id) as member_count,
          up.full_name as creator_name
        FROM book_clubs bc
        JOIN book_club_memberships bcm ON bc.id = bcm.book_club_id
        LEFT JOIN book_club_memberships bcm2 ON bc.id = bcm2.book_club_id
        LEFT JOIN user_profiles up ON bc.creator_id = up.user_id
        WHERE bcm.user_id = ${userId}
        GROUP BY bc.id, bcm.progress_chapter, bcm.joined_at, up.full_name
        ORDER BY bcm.joined_at DESC
      `;
      return Response.json({ bookClubs });
    } else if (type === 'available') {
      // Get available book clubs to join
      const bookClubs = await sql`
        SELECT 
          bc.*,
          COUNT(bcm.user_id) as member_count,
          up.full_name as creator_name,
          CASE WHEN bcm2.user_id IS NOT NULL THEN true ELSE false END as is_member
        FROM book_clubs bc
        LEFT JOIN book_club_memberships bcm ON bc.id = bcm.book_club_id
        LEFT JOIN user_profiles up ON bc.creator_id = up.user_id
        LEFT JOIN book_club_memberships bcm2 ON bc.id = bcm2.book_club_id AND bcm2.user_id = ${userId}
        WHERE bc.is_active = true
        GROUP BY bc.id, up.full_name, bcm2.user_id
        ORDER BY bc.created_at DESC
        LIMIT 20
      `;
      return Response.json({ bookClubs });
    } else if (type === 'created') {
      // Get book clubs created by the user
      const bookClubs = await sql`
        SELECT 
          bc.*,
          COUNT(bcm.user_id) as member_count
        FROM book_clubs bc
        LEFT JOIN book_club_memberships bcm ON bc.id = bcm.book_club_id
        WHERE bc.creator_id = ${userId}
        GROUP BY bc.id
        ORDER BY bc.created_at DESC
      `;
      return Response.json({ bookClubs });
    }

    return Response.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Book clubs fetch error:', error);
    return Response.json({ error: 'Failed to fetch book clubs' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = session.user.id;
    const { 
      book_title, 
      author, 
      description, 
      total_chapters,
      reading_schedule = 'weekly',
      discussion_day = 'sunday',
      learning_level,
      max_members = 30
    } = await request.json();

    if (!book_title || !author || !description || !total_chapters) {
      return Response.json({ error: 'Book title, author, description, and total chapters are required' }, { status: 400 });
    }

    // Create the book club
    const [bookClub] = await sql`
      INSERT INTO book_clubs (
        book_title, author, description, total_chapters, creator_id,
        reading_schedule, discussion_day, learning_level, max_members,
        current_chapter, is_active, created_at
      ) VALUES (
        ${book_title}, ${author}, ${description}, ${total_chapters}, ${userId},
        ${reading_schedule}, ${discussion_day}, ${learning_level}, ${max_members},
        1, true, NOW()
      )
      RETURNING *
    `;

    // Add creator as member
    await sql`
      INSERT INTO book_club_memberships (book_club_id, user_id, progress_chapter, joined_at)
      VALUES (${bookClub.id}, ${userId}, 1, NOW())
    `;

    return Response.json({ bookClub }, { status: 201 });
  } catch (error) {
    console.error('Book club creation error:', error);
    return Response.json({ error: 'Failed to create book club' }, { status: 500 });
  }
}