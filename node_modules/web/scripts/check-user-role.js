import { Client } from 'pg';
import { config } from 'dotenv';

config();

async function checkUserRole() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Check all users and their roles
    console.log('👥 Checking all users and their roles...');
    
    const { rows } = await client.query(`
      SELECT 
        full_name,
        email,
        role,
        is_active,
        created_at
      FROM user_profiles 
      ORDER BY created_at DESC
    `);

    if (rows.length === 0) {
      console.log('❌ No users found in the database');
      console.log('💡 You need to sign up first to create a user profile');
    } else {
      console.log('📋 Users found:');
      rows.forEach((user, index) => {
        console.log(`${index + 1}. ${user.full_name} (${user.email})`);
        console.log(`   Role: ${user.role} | Active: ${user.is_active}`);
        console.log(`   Created: ${user.created_at}`);
        console.log('');
      });

      // Check for admin users
      const adminUsers = rows.filter(user => user.role === 'admin');
      if (adminUsers.length === 0) {
        console.log('⚠️  No admin users found!');
        console.log('💡 To access admin panel, you need to update a user role to "admin"');
        console.log('');
        console.log('🔧 Run this SQL in Supabase SQL Editor:');
        console.log(`UPDATE user_profiles SET role = 'admin' WHERE email = '${rows[0].email}';`);
      } else {
        console.log('✅ Admin users found:');
        adminUsers.forEach(user => {
          console.log(`   - ${user.full_name} (${user.email})`);
        });
      }
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await client.end();
  }
}

// Run the check
checkUserRole();
