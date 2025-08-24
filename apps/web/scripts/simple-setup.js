import { Client } from 'pg';
import { config } from 'dotenv';

config();

async function simpleSetup() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    // Create essential tables for authentication
    console.log('📋 Creating essential tables...');

    // 1. User Profiles table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_profiles (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        role VARCHAR(50) DEFAULT 'student' CHECK (role IN ('student', 'teacher', 'admin')),
        learning_level VARCHAR(50) DEFAULT 'beginner' CHECK (learning_level IN ('beginner', 'intermediate', 'advanced')),
        avatar_url TEXT,
        bio TEXT,
        date_of_birth DATE,
        location VARCHAR(255),
        phone VARCHAR(20),
        preferred_language VARCHAR(10) DEFAULT 'en',
        timezone VARCHAR(50) DEFAULT 'UTC',
        is_active BOOLEAN DEFAULT true,
        email_verified BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created user_profiles table');

    // 2. Teacher Applications table
    await client.query(`
      CREATE TABLE IF NOT EXISTS teacher_applications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) UNIQUE NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL,
        qualifications TEXT NOT NULL,
        experience_years INTEGER NOT NULL,
        teaching_subjects TEXT[] NOT NULL,
        cover_letter TEXT NOT NULL,
        status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'under_review', 'approved', 'rejected')),
        rejection_reason TEXT,
        applied_at TIMESTAMP DEFAULT NOW(),
        reviewed_at TIMESTAMP,
        reviewed_by VARCHAR(255)
      );
    `);
    console.log('✅ Created teacher_applications table');

    // 3. Courses table
    await client.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
        duration_weeks INTEGER DEFAULT 4,
        total_lessons INTEGER DEFAULT 0,
        thumbnail_url TEXT,
        is_active BOOLEAN DEFAULT true,
        created_by VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created courses table');

    // 4. Study Groups table
    await client.query(`
      CREATE TABLE IF NOT EXISTS study_groups (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        creator_id VARCHAR(255) NOT NULL,
        learning_level VARCHAR(50) DEFAULT 'beginner' CHECK (learning_level IN ('beginner', 'intermediate', 'advanced')),
        is_public BOOLEAN DEFAULT true,
        max_members INTEGER DEFAULT 50,
        current_members INTEGER DEFAULT 0,
        group_image_url TEXT,
        meeting_schedule VARCHAR(255),
        meeting_link TEXT,
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created study_groups table');

    // 5. Group Memberships table
    await client.query(`
      CREATE TABLE IF NOT EXISTS group_memberships (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
        user_id VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
        joined_at TIMESTAMP DEFAULT NOW(),
        is_active BOOLEAN DEFAULT true,
        UNIQUE(group_id, user_id)
      );
    `);
    console.log('✅ Created group_memberships table');

    // 6. User Progress table
    await client.query(`
      CREATE TABLE IF NOT EXISTS user_progress (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        progress_percentage DECIMAL(5,2) DEFAULT 0.00,
        completed_lessons INTEGER DEFAULT 0,
        total_lessons INTEGER DEFAULT 0,
        last_accessed TIMESTAMP DEFAULT NOW(),
        completed_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        UNIQUE(user_id, course_id)
      );
    `);
    console.log('✅ Created user_progress table');

    // Enable Row Level Security
    console.log('🔐 Enabling Row Level Security...');
    
    await client.query('ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;');
    await client.query('ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;');
    await client.query('ALTER TABLE courses ENABLE ROW LEVEL SECURITY;');
    await client.query('ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;');
    await client.query('ALTER TABLE group_memberships ENABLE ROW LEVEL SECURITY;');
    await client.query('ALTER TABLE user_progress ENABLE ROW LEVEL SECURITY;');
    
    console.log('✅ Enabled RLS on all tables');

    // Create basic RLS policies
    console.log('📋 Creating basic RLS policies...');
    
    // User profiles - users can only see their own profile
    await client.query(`
      CREATE POLICY "Users can view own profile" ON user_profiles
      FOR SELECT USING (auth.uid()::text = user_id);
    `);
    
    await client.query(`
      CREATE POLICY "Users can update own profile" ON user_profiles
      FOR UPDATE USING (auth.uid()::text = user_id);
    `);
    
    await client.query(`
      CREATE POLICY "Users can insert own profile" ON user_profiles
      FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    `);

    // Teacher applications - users can see their own applications
    await client.query(`
      CREATE POLICY "Users can view own applications" ON teacher_applications
      FOR SELECT USING (auth.uid()::text = user_id);
    `);
    
    await client.query(`
      CREATE POLICY "Users can create applications" ON teacher_applications
      FOR INSERT WITH CHECK (auth.uid()::text = user_id);
    `);

    // Courses - everyone can view active courses
    await client.query(`
      CREATE POLICY "Everyone can view active courses" ON courses
      FOR SELECT USING (is_active = true);
    `);

    // Study groups - everyone can view public groups
    await client.query(`
      CREATE POLICY "Everyone can view public groups" ON study_groups
      FOR SELECT USING (is_public = true AND is_active = true);
    `);

    console.log('✅ Created basic RLS policies');

    console.log('🎉 Essential database setup completed successfully!');
    console.log('📝 Next steps:');
    console.log('1. Test authentication in your app');
    console.log('2. Add more tables as needed');
    console.log('3. Configure additional RLS policies');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the setup
simpleSetup();
