-- Ewa Ede Database Schema
-- This file contains all the necessary tables for the Yoruba learning platform

-- Users table (handled by auth system)
-- user_profiles table for extended user information
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

-- Courses table
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

-- User progress tracking
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

-- Study Groups
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

-- Group memberships
CREATE TABLE IF NOT EXISTS group_memberships (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'member' CHECK (role IN ('admin', 'moderator', 'member')),
    joined_at TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(group_id, user_id)
);

-- Group discussions
CREATE TABLE IF NOT EXISTS group_discussions (
    id SERIAL PRIMARY KEY,
    group_id INTEGER REFERENCES study_groups(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    parent_id INTEGER REFERENCES group_discussions(id) ON DELETE CASCADE,
    is_pinned BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Live Sessions
CREATE TABLE IF NOT EXISTS live_sessions (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    teacher_id VARCHAR(255) NOT NULL,
    scheduled_date TIMESTAMP NOT NULL,
    duration_minutes INTEGER DEFAULT 60,
    max_participants INTEGER DEFAULT 100,
    current_participants INTEGER DEFAULT 0,
    learning_level VARCHAR(50) DEFAULT 'beginner' CHECK (learning_level IN ('beginner', 'intermediate', 'advanced')),
    session_type VARCHAR(50) DEFAULT 'live' CHECK (session_type IN ('live', 'recorded', 'hybrid')),
    meeting_url TEXT,
    recording_url TEXT,
    status VARCHAR(50) DEFAULT 'scheduled' CHECK (status IN ('scheduled', 'live', 'completed', 'cancelled')),
    started_at TIMESTAMP,
    ended_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Session registrations
CREATE TABLE IF NOT EXISTS session_registrations (
    id SERIAL PRIMARY KEY,
    session_id INTEGER REFERENCES live_sessions(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    registered_at TIMESTAMP DEFAULT NOW(),
    attended BOOLEAN DEFAULT false,
    attended_at TIMESTAMP,
    feedback_rating INTEGER CHECK (feedback_rating >= 1 AND feedback_rating <= 5),
    feedback_comment TEXT,
    UNIQUE(session_id, user_id)
);

-- Book Clubs
CREATE TABLE IF NOT EXISTS book_clubs (
    id SERIAL PRIMARY KEY,
    book_title VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    description TEXT,
    total_chapters INTEGER NOT NULL,
    current_chapter INTEGER DEFAULT 1,
    creator_id VARCHAR(255) NOT NULL,
    reading_schedule VARCHAR(50) DEFAULT 'weekly' CHECK (reading_schedule IN ('daily', 'weekly', 'biweekly', 'monthly')),
    discussion_day VARCHAR(20) DEFAULT 'sunday',
    learning_level VARCHAR(50) DEFAULT 'beginner' CHECK (learning_level IN ('beginner', 'intermediate', 'advanced')),
    max_members INTEGER DEFAULT 30,
    current_members INTEGER DEFAULT 0,
    book_cover_url TEXT,
    is_active BOOLEAN DEFAULT true,
    next_discussion TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Book club memberships
CREATE TABLE IF NOT EXISTS book_club_memberships (
    id SERIAL PRIMARY KEY,
    book_club_id INTEGER REFERENCES book_clubs(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    progress_chapter INTEGER DEFAULT 1,
    joined_at TIMESTAMP DEFAULT NOW(),
    last_updated TIMESTAMP DEFAULT NOW(),
    is_active BOOLEAN DEFAULT true,
    UNIQUE(book_club_id, user_id)
);

-- Book club discussions
CREATE TABLE IF NOT EXISTS book_club_discussions (
    id SERIAL PRIMARY KEY,
    book_club_id INTEGER REFERENCES book_clubs(id) ON DELETE CASCADE,
    user_id VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    chapter_number INTEGER,
    parent_id INTEGER REFERENCES book_club_discussions(id) ON DELETE CASCADE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Library Resources
CREATE TABLE IF NOT EXISTS library_resources (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type VARCHAR(50) NOT NULL CHECK (type IN ('book', 'audio', 'video', 'document', 'interactive')),
    level VARCHAR(50) DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
    category VARCHAR(100),
    file_url TEXT,
    thumbnail_url TEXT,
    duration_minutes INTEGER,
    file_size_mb DECIMAL(10,2),
    rating DECIMAL(3,2) DEFAULT 0.00,
    downloads_count INTEGER DEFAULT 0,
    views_count INTEGER DEFAULT 0,
    is_free BOOLEAN DEFAULT true,
    price DECIMAL(10,2) DEFAULT 0.00,
    is_active BOOLEAN DEFAULT true,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User resource access/downloads
CREATE TABLE IF NOT EXISTS user_resource_access (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    resource_id INTEGER REFERENCES library_resources(id) ON DELETE CASCADE,
    access_type VARCHAR(50) DEFAULT 'view' CHECK (access_type IN ('view', 'download', 'purchase')),
    accessed_at TIMESTAMP DEFAULT NOW(),
    completed BOOLEAN DEFAULT false,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    review TEXT,
    UNIQUE(user_id, resource_id, access_type)
);

-- Lessons (for courses)
CREATE TABLE IF NOT EXISTS lessons (
    id SERIAL PRIMARY KEY,
    course_id INTEGER REFERENCES courses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    lesson_order INTEGER NOT NULL,
    duration_minutes INTEGER DEFAULT 30,
    video_url TEXT,
    audio_url TEXT,
    transcript TEXT,
    is_free BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User lesson progress
CREATE TABLE IF NOT EXISTS user_lesson_progress (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    lesson_id INTEGER REFERENCES lessons(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT false,
    progress_percentage DECIMAL(5,2) DEFAULT 0.00,
    time_spent_minutes INTEGER DEFAULT 0,
    completed_at TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, lesson_id)
);

-- Notifications
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'success', 'warning', 'error')),
    category VARCHAR(100),
    is_read BOOLEAN DEFAULT false,
    action_url TEXT,
    expires_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT NOW()
);

-- System settings
CREATE TABLE IF NOT EXISTS system_settings (
    id SERIAL PRIMARY KEY,
    key VARCHAR(255) UNIQUE NOT NULL,
    value TEXT,
    description TEXT,
    is_public BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_profiles_role ON user_profiles(role);
CREATE INDEX IF NOT EXISTS idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_course_id ON user_progress(course_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_group_id ON group_memberships(group_id);
CREATE INDEX IF NOT EXISTS idx_group_memberships_user_id ON group_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_session_registrations_session_id ON session_registrations(session_id);
CREATE INDEX IF NOT EXISTS idx_session_registrations_user_id ON session_registrations(user_id);
CREATE INDEX IF NOT EXISTS idx_book_club_memberships_club_id ON book_club_memberships(book_club_id);
CREATE INDEX IF NOT EXISTS idx_book_club_memberships_user_id ON book_club_memberships(user_id);
CREATE INDEX IF NOT EXISTS idx_library_resources_type ON library_resources(type);
CREATE INDEX IF NOT EXISTS idx_library_resources_level ON library_resources(level);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

-- Triggers to update timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply update triggers to relevant tables
CREATE TRIGGER update_user_profiles_updated_at BEFORE UPDATE ON user_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_courses_updated_at BEFORE UPDATE ON courses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_progress_updated_at BEFORE UPDATE ON user_progress FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_study_groups_updated_at BEFORE UPDATE ON study_groups FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_live_sessions_updated_at BEFORE UPDATE ON live_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_book_clubs_updated_at BEFORE UPDATE ON book_clubs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_library_resources_updated_at BEFORE UPDATE ON library_resources FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_lessons_updated_at BEFORE UPDATE ON lessons FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_system_settings_updated_at BEFORE UPDATE ON system_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();