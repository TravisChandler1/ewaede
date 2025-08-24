-- Additional Admin Features Schema
-- This extends the main schema with admin-specific tables

-- Teacher approval system
CREATE TABLE IF NOT EXISTS teacher_applications (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    qualifications TEXT,
    experience_years INTEGER,
    teaching_subjects TEXT[],
    cv_url TEXT,
    cover_letter TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'under_review')),
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    rejection_reason TEXT,
    applied_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- System audit logs
CREATE TABLE IF NOT EXISTS audit_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255),
    action VARCHAR(255) NOT NULL,
    resource_type VARCHAR(100),
    resource_id VARCHAR(255),
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Content moderation
CREATE TABLE IF NOT EXISTS content_reports (
    id SERIAL PRIMARY KEY,
    reporter_id VARCHAR(255) NOT NULL,
    reported_content_type VARCHAR(100) NOT NULL, -- 'group_discussion', 'book_club_discussion', etc.
    reported_content_id INTEGER NOT NULL,
    reason VARCHAR(255) NOT NULL,
    description TEXT,
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'resolved', 'dismissed')),
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    action_taken VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW()
);

-- System announcements
CREATE TABLE IF NOT EXISTS announcements (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    type VARCHAR(50) DEFAULT 'info' CHECK (type IN ('info', 'warning', 'success', 'error')),
    target_audience VARCHAR(50) DEFAULT 'all' CHECK (target_audience IN ('all', 'students', 'teachers', 'admins')),
    is_active BOOLEAN DEFAULT true,
    priority INTEGER DEFAULT 1,
    expires_at TIMESTAMP,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Platform statistics (for caching)
CREATE TABLE IF NOT EXISTS platform_stats (
    id SERIAL PRIMARY KEY,
    stat_key VARCHAR(255) UNIQUE NOT NULL,
    stat_value JSONB NOT NULL,
    calculated_at TIMESTAMP DEFAULT NOW(),
    expires_at TIMESTAMP
);

-- User activity tracking
CREATE TABLE IF NOT EXISTS user_activity (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    activity_type VARCHAR(100) NOT NULL,
    activity_data JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Course management
CREATE TABLE IF NOT EXISTS course_categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    icon VARCHAR(100),
    color VARCHAR(7), -- hex color
    is_active BOOLEAN DEFAULT true,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Add foreign key to courses table for categories
ALTER TABLE courses ADD COLUMN IF NOT EXISTS category_id INTEGER REFERENCES course_categories(id);
ALTER TABLE courses ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS price DECIMAL(10,2) DEFAULT 0.00;
ALTER TABLE courses ADD COLUMN IF NOT EXISTS enrollment_count INTEGER DEFAULT 0;

-- Payment tracking (basic)
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    amount DECIMAL(10,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(50),
    payment_provider VARCHAR(50),
    provider_transaction_id VARCHAR(255),
    status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    description TEXT,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE IF NOT EXISTS subscriptions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(255) NOT NULL,
    plan_name VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired', 'suspended')),
    starts_at TIMESTAMP NOT NULL,
    ends_at TIMESTAMP,
    auto_renew BOOLEAN DEFAULT true,
    payment_id INTEGER REFERENCES payments(id),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Feature flags
CREATE TABLE IF NOT EXISTS feature_flags (
    id SERIAL PRIMARY KEY,
    flag_key VARCHAR(255) UNIQUE NOT NULL,
    flag_name VARCHAR(255) NOT NULL,
    description TEXT,
    is_enabled BOOLEAN DEFAULT false,
    target_audience VARCHAR(50) DEFAULT 'all',
    rollout_percentage INTEGER DEFAULT 100,
    created_by VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_teacher_applications_status ON teacher_applications(status);
CREATE INDEX IF NOT EXISTS idx_teacher_applications_user_id ON teacher_applications(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_content_reports_status ON content_reports(status);
CREATE INDEX IF NOT EXISTS idx_announcements_active ON announcements(is_active);
CREATE INDEX IF NOT EXISTS idx_announcements_target ON announcements(target_audience);
CREATE INDEX IF NOT EXISTS idx_user_activity_user_id ON user_activity(user_id);
CREATE INDEX IF NOT EXISTS idx_user_activity_created_at ON user_activity(created_at);
CREATE INDEX IF NOT EXISTS idx_payments_user_id ON payments(user_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);

-- Update triggers for admin tables
CREATE TRIGGER update_teacher_applications_updated_at BEFORE UPDATE ON teacher_applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_announcements_updated_at BEFORE UPDATE ON announcements FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_payments_updated_at BEFORE UPDATE ON payments FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_feature_flags_updated_at BEFORE UPDATE ON feature_flags FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();