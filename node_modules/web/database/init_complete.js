import sql from '../src/app/api/utils/sql.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initializeCompleteDatabase() {
  try {
    console.log('🚀 Initializing Complete Ewa Ede Database...');

    // Read and execute main schema
    console.log('📋 Creating main database schema...');
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    await sql.unsafe(schema);
    console.log('✅ Main schema created successfully');

    // Read and execute admin schema
    console.log('🔧 Creating admin features schema...');
    const adminSchemaPath = path.join(__dirname, 'admin_schema.sql');
    const adminSchema = fs.readFileSync(adminSchemaPath, 'utf8');
    await sql.unsafe(adminSchema);
    console.log('✅ Admin schema created successfully');

    // Read and execute main sample data
    console.log('📊 Inserting main sample data...');
    const sampleDataPath = path.join(__dirname, 'sample_data.sql');
    const sampleData = fs.readFileSync(sampleDataPath, 'utf8');
    await sql.unsafe(sampleData);
    console.log('✅ Main sample data inserted successfully');

    // Read and execute admin sample data
    console.log('👨‍💼 Inserting admin sample data...');
    const adminSampleDataPath = path.join(__dirname, 'admin_sample_data.sql');
    const adminSampleData = fs.readFileSync(adminSampleDataPath, 'utf8');
    await sql.unsafe(adminSampleData);
    console.log('✅ Admin sample data inserted successfully');

    // Read and execute Supabase-specific setup
    console.log('🚀 Setting up Supabase optimizations...');
    const supabaseSetupPath = path.join(__dirname, 'supabase_setup.sql');
    const supabaseSetup = fs.readFileSync(supabaseSetupPath, 'utf8');
    await sql.unsafe(supabaseSetup);
    console.log('✅ Supabase setup completed successfully');

    // Create default admin user
    console.log('👑 Creating default admin user...');
    const adminUserId = 'admin_default';
    await sql`
      INSERT INTO user_profiles (
        user_id, full_name, email, role, is_active, created_at
      ) VALUES (
        ${adminUserId}, 'System Administrator', 'admin@ewaede.com', 'admin', true, NOW()
      )
      ON CONFLICT (user_id) DO UPDATE SET
        role = 'admin',
        is_active = true,
        updated_at = NOW()
    `;
    console.log('✅ Default admin user created');

    console.log('🎉 Complete database initialization finished!');
    
    // Test the connection and show statistics
    const [stats] = await sql.transaction([
      sql`SELECT COUNT(*) as count FROM user_profiles`,
      sql`SELECT COUNT(*) as count FROM courses`,
      sql`SELECT COUNT(*) as count FROM teacher_applications`,
      sql`SELECT COUNT(*) as count FROM live_sessions`,
      sql`SELECT COUNT(*) as count FROM study_groups`,
      sql`SELECT COUNT(*) as count FROM book_clubs`,
      sql`SELECT COUNT(*) as count FROM library_resources`
    ]);

    console.log('\n📈 Database Statistics:');
    console.log(`👥 Users: ${stats[0][0].count}`);
    console.log(`📚 Courses: ${stats[1][0].count}`);
    console.log(`🎓 Teacher Applications: ${stats[2][0].count}`);
    console.log(`🎥 Live Sessions: ${stats[3][0].count}`);
    console.log(`👨‍👩‍👧‍👦 Study Groups: ${stats[4][0].count}`);
    console.log(`📖 Book Clubs: ${stats[5][0].count}`);
    console.log(`📚 Library Resources: ${stats[6][0].count}`);

    console.log('\n🔑 Admin Access:');
    console.log('Email: admin@ewaede.com');
    console.log('Role: admin');
    console.log('Access: /admin');

    console.log('\n🎯 Next Steps:');
    console.log('1. Start the development server: npm run dev');
    console.log('2. Visit http://localhost:3000');
    console.log('3. Sign up as a student or apply as a teacher');
    console.log('4. Access admin panel at /admin (requires admin role)');
    
  } catch (error) {
    console.error('❌ Complete database initialization failed:', error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  initializeCompleteDatabase()
    .then(() => {
      console.log('\n✨ Database is ready for Ewa Ede platform!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Database initialization failed:', error);
      process.exit(1);
    });
}

export default initializeCompleteDatabase;