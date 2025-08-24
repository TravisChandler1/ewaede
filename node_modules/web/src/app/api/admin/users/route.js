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
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const search = searchParams.get('search') || '';
    const role = searchParams.get('role') || '';
    const status = searchParams.get('status') || '';

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${userId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    const offset = (page - 1) * limit;

    // Build query conditions
    let whereConditions = [];
    let queryParams = [];

    if (search) {
      whereConditions.push(`(full_name ILIKE $${queryParams.length + 1} OR email ILIKE $${queryParams.length + 1})`);
      queryParams.push(`%${search}%`);
    }

    if (role) {
      whereConditions.push(`role = $${queryParams.length + 1}`);
      queryParams.push(role);
    }

    if (status === 'active') {
      whereConditions.push('is_active = true');
    } else if (status === 'inactive') {
      whereConditions.push('is_active = false');
    }

    const whereClause = whereConditions.length > 0 ? `WHERE ${whereConditions.join(' AND ')}` : '';

    // Get users with pagination
    const users = await sql.unsafe(`
      SELECT 
        user_id,
        full_name,
        email,
        role,
        is_active,
        learning_level,
        created_at,
        updated_at
      FROM user_profiles 
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `, queryParams);

    // Get total count
    const [{ count: totalCount }] = await sql.unsafe(`
      SELECT COUNT(*) as count
      FROM user_profiles 
      ${whereClause}
    `, queryParams);

    return Response.json({
      users,
      pagination: {
        page,
        limit,
        total: parseInt(totalCount),
        pages: Math.ceil(totalCount / limit)
      }
    });

  } catch (error) {
    console.error('Admin users fetch error:', error);
    return Response.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const adminUserId = session.user.id;
    const { full_name, email, role, learning_level, password } = await request.json();

    // Check if user is admin
    const [userProfile] = await sql`
      SELECT role FROM user_profiles WHERE user_id = ${adminUserId}
    `;

    if (!userProfile || userProfile.role !== 'admin') {
      return Response.json({ error: 'Access denied. Admin role required.' }, { status: 403 });
    }

    // Validate required fields
    if (!full_name || !email || !role) {
      return Response.json({ error: 'Full name, email, and role are required' }, { status: 400 });
    }

    // Check if email already exists
    const [existingUser] = await sql`
      SELECT user_id FROM user_profiles WHERE email = ${email}
    `;

    if (existingUser) {
      return Response.json({ error: 'Email already exists' }, { status: 400 });
    }

    // Generate a temporary user ID (in real app, this would be handled by auth system)
    const tempUserId = `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create user profile
    const [newUser] = await sql`
      INSERT INTO user_profiles (
        user_id, full_name, email, role, learning_level, is_active, created_at
      ) VALUES (
        ${tempUserId}, ${full_name}, ${email}, ${role}, ${learning_level || 'beginner'}, true, NOW()
      )
      RETURNING *
    `;

    // Log the action
    await sql`
      INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values)
      VALUES (${adminUserId}, 'create_user', 'user_profile', ${tempUserId}, ${JSON.stringify(newUser)})
    `;

    return Response.json({ user: newUser }, { status: 201 });

  } catch (error) {
    console.error('Admin user creation error:', error);
    return Response.json({ error: 'Failed to create user' }, { status: 500 });
  }
}