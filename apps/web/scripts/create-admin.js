import { Client } from 'pg';
import { config } from 'dotenv';

config();

async function createAdmin() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Create an admin user
    console.log('👑 Creating admin user...');
    
    const adminEmail = 'admin@ewaede.com';
    const adminName = 'System Administrator';
    
    // Check if admin already exists
    const { rows: existing } = await client.query(`
      SELECT * FROM user_profiles WHERE email = $1
    `, [adminEmail]);

    if (existing.length > 0) {
      console.log('⚠️  Admin user already exists!');
      console.log(`Email: ${existing[0].email}`);
      console.log(`Role: ${existing[0].role}`);
      return;
    }

    // Create admin user
    const { rows } = await client.query(`
      INSERT INTO user_profiles (
        user_id,
        full_name,
        email,
        role,
        is_active,
        email_verified
      ) VALUES (
        $1,
        $2,
        $3,
        $4,
        $5,
        $6
      ) RETURNING *
    `, [
      'admin-user-' + Date.now(), // Generate a unique user ID
      adminName,
      adminEmail,
      'admin',
      true,
      true
    ]);

    console.log('✅ Admin user created successfully!');
    console.log(`Name: ${rows[0].full_name}`);
    console.log(`Email: ${rows[0].email}`);
    console.log(`Role: ${rows[0].role}`);
    console.log('');
    console.log('🔑 Login Credentials:');
    console.log(`Email: ${adminEmail}`);
    console.log('Password: admin123 (you can change this later)');
    console.log('');
    console.log('💡 Note: You still need to create an auth user in Supabase Auth');
    console.log('   Go to Supabase Dashboard → Authentication → Users → Add User');

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

// Run the creation
createAdmin();
