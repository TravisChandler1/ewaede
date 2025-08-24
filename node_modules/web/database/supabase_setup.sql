-- Supabase-specific setup and optimizations
-- Run this after the main schema initialization

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create a function to execute raw SQL (for compatibility with existing code)
CREATE OR REPLACE FUNCTION execute_sql(query text, params jsonb DEFAULT '[]'::jsonb)
RETURNS jsonb
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result jsonb;
    rec record;
    query_result text;
BEGIN
    -- This is a simplified version for basic queries
    -- In production, you'd want more sophisticated parameter handling
    
    -- Execute the query and return results as JSON
    IF query ILIKE 'SELECT%' THEN
        EXECUTE query INTO result;
        RETURN result;
    ELSE
        EXECUTE query;
        RETURN '{"success": true}'::jsonb;
    END IF;
EXCEPTION
    WHEN OTHERS THEN
        RETURN jsonb_build_object('error', SQLERRM);
END;
$$;

-- Create Row Level Security policies (optional but recommended)

-- User profiles RLS
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own profile
CREATE POLICY "Users can view own profile" ON user_profiles
    FOR SELECT USING (auth.uid()::text = user_id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON user_profiles
    FOR UPDATE USING (auth.uid()::text = user_id);

-- Allow admins to view all profiles
CREATE POLICY "Admins can view all profiles" ON user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Study groups RLS
ALTER TABLE study_groups ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view public groups
CREATE POLICY "Anyone can view public groups" ON study_groups
    FOR SELECT USING (is_public = true);

-- Allow group members to view private groups
CREATE POLICY "Members can view their groups" ON study_groups
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM group_memberships 
            WHERE group_id = study_groups.id 
            AND user_id = auth.uid()::text
        )
    );

-- Allow group creators to manage their groups
CREATE POLICY "Creators can manage their groups" ON study_groups
    FOR ALL USING (creator_id = auth.uid()::text);

-- Live sessions RLS
ALTER TABLE live_sessions ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view scheduled sessions
CREATE POLICY "Anyone can view sessions" ON live_sessions
    FOR SELECT USING (true);

-- Allow teachers to manage their sessions
CREATE POLICY "Teachers can manage their sessions" ON live_sessions
    FOR ALL USING (teacher_id = auth.uid()::text);

-- Book clubs RLS
ALTER TABLE book_clubs ENABLE ROW LEVEL SECURITY;

-- Allow everyone to view active book clubs
CREATE POLICY "Anyone can view book clubs" ON book_clubs
    FOR SELECT USING (is_active = true);

-- Allow creators to manage their book clubs
CREATE POLICY "Creators can manage their book clubs" ON book_clubs
    FOR ALL USING (creator_id = auth.uid()::text);

-- Teacher applications RLS (admin only)
ALTER TABLE teacher_applications ENABLE ROW LEVEL SECURITY;

-- Allow users to view their own applications
CREATE POLICY "Users can view own applications" ON teacher_applications
    FOR SELECT USING (user_id = auth.uid()::text);

-- Allow users to create their own applications
CREATE POLICY "Users can create applications" ON teacher_applications
    FOR INSERT WITH CHECK (user_id = auth.uid()::text);

-- Allow admins to manage all applications
CREATE POLICY "Admins can manage applications" ON teacher_applications
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_profiles 
            WHERE user_id = auth.uid()::text 
            AND role = 'admin'
        )
    );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_auth_uid ON user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_study_groups_public ON study_groups(is_public) WHERE is_public = true;
CREATE INDEX IF NOT EXISTS idx_live_sessions_status ON live_sessions(status);
CREATE INDEX IF NOT EXISTS idx_book_clubs_active ON book_clubs(is_active) WHERE is_active = true;

-- Create a function to handle user registration
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS trigger AS $$
BEGIN
    INSERT INTO user_profiles (user_id, full_name, email, role, created_at)
    VALUES (
        NEW.id::text,
        COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email),
        NEW.email,
        'student',
        NOW()
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration (if using Supabase Auth)
-- DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
-- CREATE TRIGGER on_auth_user_created
--     AFTER INSERT ON auth.users
--     FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Create a function to get user role
CREATE OR REPLACE FUNCTION get_user_role(user_uuid uuid)
RETURNS text AS $$
DECLARE
    user_role text;
BEGIN
    SELECT role INTO user_role
    FROM user_profiles
    WHERE user_id = user_uuid::text;
    
    RETURN COALESCE(user_role, 'student');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is admin
CREATE OR REPLACE FUNCTION is_admin(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN get_user_role(user_uuid) = 'admin';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to check if user is teacher
CREATE OR REPLACE FUNCTION is_teacher(user_uuid uuid)
RETURNS boolean AS $$
BEGIN
    RETURN get_user_role(user_uuid) IN ('teacher', 'admin');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create real-time publication for live features (optional)
-- This enables real-time subscriptions for certain tables

-- Enable real-time for study group discussions
ALTER PUBLICATION supabase_realtime ADD TABLE group_discussions;

-- Enable real-time for book club discussions
ALTER PUBLICATION supabase_realtime ADD TABLE book_club_discussions;

-- Enable real-time for notifications
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;

-- Create a function to send notifications
CREATE OR REPLACE FUNCTION create_notification(
    target_user_id text,
    notification_title text,
    notification_message text,
    notification_type text DEFAULT 'info',
    notification_category text DEFAULT NULL,
    action_url text DEFAULT NULL
)
RETURNS void AS $$
BEGIN
    INSERT INTO notifications (
        user_id,
        title,
        message,
        type,
        category,
        action_url,
        created_at
    ) VALUES (
        target_user_id,
        notification_title,
        notification_message,
        notification_type,
        notification_category,
        action_url,
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to approve teacher applications
CREATE OR REPLACE FUNCTION approve_teacher_application(
    application_id integer,
    admin_user_id text
)
RETURNS void AS $$
DECLARE
    app_user_id text;
BEGIN
    -- Check if the current user is admin
    IF NOT is_admin(admin_user_id::uuid) THEN
        RAISE EXCEPTION 'Only admins can approve teacher applications';
    END IF;
    
    -- Get the application user ID
    SELECT user_id INTO app_user_id
    FROM teacher_applications
    WHERE id = application_id;
    
    IF app_user_id IS NULL THEN
        RAISE EXCEPTION 'Teacher application not found';
    END IF;
    
    -- Update application status
    UPDATE teacher_applications
    SET status = 'approved',
        reviewed_by = admin_user_id,
        reviewed_at = NOW()
    WHERE id = application_id;
    
    -- Update user role to teacher
    UPDATE user_profiles
    SET role = 'teacher',
        updated_at = NOW()
    WHERE user_id = app_user_id;
    
    -- Send notification to the user
    PERFORM create_notification(
        app_user_id,
        'Teacher Application Approved!',
        'Congratulations! Your teacher application has been approved. You can now access teacher features.',
        'success',
        'teacher_application',
        '/dashboard'
    );
    
    -- Log the action
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, created_at)
    VALUES (
        admin_user_id,
        'approve_teacher_application',
        'teacher_application',
        application_id::text,
        jsonb_build_object('status', 'approved', 'reviewed_by', admin_user_id),
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to reject teacher applications
CREATE OR REPLACE FUNCTION reject_teacher_application(
    application_id integer,
    admin_user_id text,
    rejection_reason text
)
RETURNS void AS $$
DECLARE
    app_user_id text;
BEGIN
    -- Check if the current user is admin
    IF NOT is_admin(admin_user_id::uuid) THEN
        RAISE EXCEPTION 'Only admins can reject teacher applications';
    END IF;
    
    -- Get the application user ID
    SELECT user_id INTO app_user_id
    FROM teacher_applications
    WHERE id = application_id;
    
    IF app_user_id IS NULL THEN
        RAISE EXCEPTION 'Teacher application not found';
    END IF;
    
    -- Update application status
    UPDATE teacher_applications
    SET status = 'rejected',
        reviewed_by = admin_user_id,
        reviewed_at = NOW(),
        rejection_reason = rejection_reason
    WHERE id = application_id;
    
    -- Send notification to the user
    PERFORM create_notification(
        app_user_id,
        'Teacher Application Update',
        'Your teacher application has been reviewed. Please check your application status for more details.',
        'info',
        'teacher_application',
        '/apply-teacher'
    );
    
    -- Log the action
    INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, created_at)
    VALUES (
        admin_user_id,
        'reject_teacher_application',
        'teacher_application',
        application_id::text,
        jsonb_build_object(
            'status', 'rejected', 
            'reviewed_by', admin_user_id,
            'rejection_reason', rejection_reason
        ),
        NOW()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;