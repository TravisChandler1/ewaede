import { Client } from 'pg';
import { config } from 'dotenv';

config();

async function createAdvancedFeatures() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('🔌 Connecting to database...');
    await client.connect();
    console.log('✅ Connected to database');

    console.log('🚀 Creating advanced feature tables...');

    // 1. Discussion Forums
    await client.query(`
      CREATE TABLE IF NOT EXISTS discussion_forums (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        category VARCHAR(100) DEFAULT 'general',
        is_active BOOLEAN DEFAULT true,
        is_pinned BOOLEAN DEFAULT false,
        created_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created discussion_forums table');

    // 2. Forum Topics
    await client.query(`
      CREATE TABLE IF NOT EXISTS forum_topics (
        id SERIAL PRIMARY KEY,
        forum_id INTEGER REFERENCES discussion_forums(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        author_id VARCHAR(255) NOT NULL,
        is_pinned BOOLEAN DEFAULT false,
        is_locked BOOLEAN DEFAULT false,
        view_count INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created forum_topics table');

    // 3. Forum Replies
    await client.query(`
      CREATE TABLE IF NOT EXISTS forum_replies (
        id SERIAL PRIMARY KEY,
        topic_id INTEGER REFERENCES forum_topics(id) ON DELETE CASCADE,
        author_id VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        parent_id INTEGER REFERENCES forum_replies(id) ON DELETE CASCADE,
        is_solution BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created forum_replies table');

    // 4. In-App Messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id VARCHAR(255) NOT NULL,
        receiver_id VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        is_read BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created messages table');

    // 5. Group Chat Messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS group_chat_messages (
        id SERIAL PRIMARY KEY,
        group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
        sender_id VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created group_chat_messages table');

    // 6. Live Chat Support
    await client.query(`
      CREATE TABLE IF NOT EXISTS live_chat_sessions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        agent_id VARCHAR(255),
        status VARCHAR(50) DEFAULT 'waiting',
        started_at TIMESTAMP DEFAULT NOW(),
        ended_at TIMESTAMP,
        rating INTEGER CHECK (rating >= 1 AND rating <= 5)
      );
    `);
    console.log('✅ Created live_chat_sessions table');

    // 7. Live Chat Messages
    await client.query(`
      CREATE TABLE IF NOT EXISTS live_chat_messages (
        id SERIAL PRIMARY KEY,
        session_id INTEGER REFERENCES live_chat_sessions(id) ON DELETE CASCADE,
        sender_id VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        message_type VARCHAR(50) DEFAULT 'text',
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created live_chat_messages table');

    // 8. Lessons
    await client.query(`
      CREATE TABLE IF NOT EXISTS lessons (
        id SERIAL PRIMARY KEY,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        content TEXT NOT NULL,
        duration INTEGER DEFAULT 60,
        "order" INTEGER DEFAULT 0,
        is_active BOOLEAN DEFAULT true,
        created_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created lessons table');

    // 9. Lesson Materials
    await client.query(`
      CREATE TABLE IF NOT EXISTS lesson_materials (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        file_url TEXT NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created lesson_materials table');

    // 10. Assignments
    await client.query(`
      CREATE TABLE IF NOT EXISTS assignments (
        id SERIAL PRIMARY KEY,
        lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        due_date TIMESTAMP NOT NULL,
        max_score INTEGER DEFAULT 100,
        is_active BOOLEAN DEFAULT true,
        created_by VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created assignments table');

    // 11. Assignment Submissions
    await client.query(`
      CREATE TABLE IF NOT EXISTS assignment_submissions (
        id SERIAL PRIMARY KEY,
        assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
        student_id VARCHAR(255) NOT NULL,
        content TEXT,
        file_url TEXT,
        submitted_at TIMESTAMP DEFAULT NOW(),
        graded_at TIMESTAMP,
        score INTEGER,
        feedback TEXT,
        graded_by VARCHAR(255),
        UNIQUE(assignment_id, student_id)
      );
    `);
    console.log('✅ Created assignment_submissions table');

    // 12. Grades
    await client.query(`
      CREATE TABLE IF NOT EXISTS grades (
        id SERIAL PRIMARY KEY,
        student_id VARCHAR(255) NOT NULL,
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        assignment_id INTEGER REFERENCES assignments(id) ON DELETE CASCADE,
        score INTEGER NOT NULL,
        max_score INTEGER DEFAULT 100,
        percentage DECIMAL(5,2) NOT NULL,
        grade VARCHAR(10) NOT NULL,
        comments TEXT,
        graded_by VARCHAR(255) NOT NULL,
        graded_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created grades table');

    // 13. Calendar Events
    await client.query(`
      CREATE TABLE IF NOT EXISTS calendar_events (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        event_type VARCHAR(100) DEFAULT 'lesson',
        course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
        group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
        created_by VARCHAR(255) NOT NULL,
        is_all_day BOOLEAN DEFAULT false,
        color VARCHAR(7) DEFAULT '#3b82f6',
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created calendar_events table');

    // 14. Notifications
    await client.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        message TEXT NOT NULL,
        type VARCHAR(50) DEFAULT 'info',
        is_read BOOLEAN DEFAULT false,
        action_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created notifications table');

    // 15. File Uploads
    await client.query(`
      CREATE TABLE IF NOT EXISTS file_uploads (
        id SERIAL PRIMARY KEY,
        file_name VARCHAR(255) NOT NULL,
        original_name VARCHAR(255) NOT NULL,
        file_url TEXT NOT NULL,
        file_type VARCHAR(100) NOT NULL,
        file_size INTEGER NOT NULL,
        uploaded_by VARCHAR(255) NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        is_public BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created file_uploads table');

    // 16. Search History
    await client.query(`
      CREATE TABLE IF NOT EXISTS search_history (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        query TEXT NOT NULL,
        category VARCHAR(100) DEFAULT 'general',
        results_count INTEGER DEFAULT 0,
        searched_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('✅ Created search_history table');

    // Enable Row Level Security
    console.log('🔐 Enabling Row Level Security on new tables...');
    
    const newTables = [
      'discussion_forums', 'forum_topics', 'forum_replies',
      'messages', 'group_chat_messages', 'live_chat_sessions',
      'live_chat_messages', 'lessons', 'lesson_materials',
      'assignments', 'assignment_submissions', 'grades',
      'calendar_events', 'notifications', 'file_uploads', 'search_history'
    ];

    for (const table of newTables) {
      await client.query(`ALTER TABLE ${table} ENABLE ROW LEVEL SECURITY;`);
    }
    
    console.log('✅ Enabled RLS on all new tables');

    console.log('🎉 Advanced features database setup completed successfully!');
    console.log('📝 New features available:');
    console.log('   • Discussion Forums & Messaging');
    console.log('   • Advanced Teacher Tools');
    console.log('   • Grade Management System');
    console.log('   • Calendar & Scheduling');
    console.log('   • File Uploads & Notifications');
    console.log('   • Search Functionality');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

// Run the setup
createAdvancedFeatures();
