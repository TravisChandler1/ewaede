-- Sample data for admin features
-- This file contains sample data for admin functionality

-- Sample teacher applications
INSERT INTO teacher_applications (user_id, full_name, email, qualifications, experience_years, teaching_subjects, cover_letter, status, applied_at) VALUES
('user_teacher_1', 'Adebayo Ogundimu', 'adebayo@example.com', 'Masters in Yoruba Studies, University of Ibadan. Certified Language Teacher.', 5, ARRAY['Yoruba Language Basics', 'Yoruba Grammar', 'Yoruba Culture & History'], 'I am passionate about teaching Yoruba language and preserving our cultural heritage. With 5 years of experience, I have helped over 200 students learn Yoruba effectively.', 'pending', NOW() - INTERVAL '2 days'),
('user_teacher_2', 'Folake Adeyemi', 'folake@example.com', 'PhD in African Languages, University of Lagos. 10+ years teaching experience.', 10, ARRAY['Yoruba Literature', 'Advanced Yoruba', 'Yoruba Poetry'], 'As a native Yoruba speaker with extensive academic background, I bring both traditional knowledge and modern teaching methods to help students master the language.', 'approved', NOW() - INTERVAL '5 days'),
('user_teacher_3', 'Kunle Babatunde', 'kunle@example.com', 'Bachelor in Education (Yoruba), Obafemi Awolowo University. TESOL Certified.', 3, ARRAY['Business Yoruba', 'Yoruba for Children', 'Yoruba Pronunciation'], 'I specialize in making Yoruba learning fun and practical for modern learners. My interactive teaching style has proven successful with students of all ages.', 'under_review', NOW() - INTERVAL '1 day'),
('user_teacher_4', 'Bisi Olatunji', 'bisi@example.com', 'Masters in Linguistics, University of Ilorin. Native Yoruba speaker.', 7, ARRAY['Yoruba Grammar', 'Yoruba Culture & History', 'Traditional Yoruba'], 'With deep roots in Yoruba tradition and modern linguistic training, I offer a comprehensive approach to learning Yoruba that connects students to their heritage.', 'rejected', NOW() - INTERVAL '7 days');

-- Sample audit logs
INSERT INTO audit_logs (user_id, action, resource_type, resource_id, new_values, created_at) VALUES
('admin_1', 'approve_teacher_application', 'teacher_application', '2', '{"status": "approved", "reviewed_by": "admin_1"}', NOW() - INTERVAL '5 days'),
('admin_1', 'create_user', 'user_profile', 'user_5', '{"role": "student", "full_name": "Test User"}', NOW() - INTERVAL '3 days'),
('admin_1', 'update_user', 'user_profile', 'user_3', '{"role": "teacher"}', NOW() - INTERVAL '2 days'),
('admin_1', 'reject_teacher_application', 'teacher_application', '4', '{"status": "rejected", "rejection_reason": "Insufficient qualifications"}', NOW() - INTERVAL '7 days');

-- Sample content reports
INSERT INTO content_reports (reporter_id, reported_content_type, reported_content_id, reason, description, status, created_at) VALUES
('user_1', 'group_discussion', 1, 'Inappropriate content', 'User posted offensive language in the discussion', 'pending', NOW() - INTERVAL '1 day'),
('user_2', 'book_club_discussion', 2, 'Spam', 'User is posting promotional content repeatedly', 'reviewed', NOW() - INTERVAL '3 days'),
('user_3', 'group_discussion', 3, 'Off-topic', 'Discussion is not related to Yoruba learning', 'resolved', NOW() - INTERVAL '5 days');

-- Sample announcements
INSERT INTO announcements (title, content, type, target_audience, is_active, priority, created_by, created_at) VALUES
('Welcome to Ewa Ede Platform!', 'We are excited to have you join our Yoruba learning community. Explore courses, join study groups, and connect with fellow learners.', 'success', 'all', true, 1, 'admin_1', NOW() - INTERVAL '10 days'),
('New Feature: Live Sessions', 'We have launched live interactive sessions with certified Yoruba teachers. Register for upcoming sessions in your dashboard.', 'info', 'students', true, 2, 'admin_1', NOW() - INTERVAL '7 days'),
('Teacher Application Process Updated', 'We have streamlined the teacher application process. New requirements and guidelines are now available.', 'info', 'teachers', true, 1, 'admin_1', NOW() - INTERVAL '5 days'),
('Scheduled Maintenance', 'The platform will undergo maintenance on Sunday, 2AM - 4AM UTC. Some features may be temporarily unavailable.', 'warning', 'all', true, 3, 'admin_1', NOW() + INTERVAL '2 days');

-- Sample platform statistics (cached)
INSERT INTO platform_stats (stat_key, stat_value, calculated_at) VALUES
('daily_active_users', '{"count": 245, "date": "2024-01-15"}', NOW()),
('weekly_signups', '{"count": 67, "week": "2024-W03"}', NOW()),
('popular_courses', '{"courses": [{"id": 1, "title": "Yoruba for Beginners", "enrollments": 156}, {"id": 2, "title": "Intermediate Yoruba Grammar", "enrollments": 89}]}', NOW()),
('session_attendance', '{"total_sessions": 45, "average_attendance": 23.5, "month": "2024-01"}', NOW());

-- Sample course categories
INSERT INTO course_categories (name, description, icon, color, is_active, sort_order) VALUES
('Beginner Courses', 'Perfect for those just starting their Yoruba journey', 'BookOpen', '#06b6d4', true, 1),
('Grammar & Structure', 'Master the rules and structure of Yoruba language', 'FileText', '#10b981', true, 2),
('Culture & History', 'Learn about Yoruba culture, traditions, and history', 'Globe', '#8b5cf6', true, 3),
('Literature & Poetry', 'Explore Yoruba literature and traditional poetry', 'Feather', '#f59e0b', true, 4),
('Business Yoruba', 'Professional Yoruba for workplace and business', 'Briefcase', '#dc2626', true, 5),
('Children\'s Yoruba', 'Fun and engaging Yoruba lessons for kids', 'Heart', '#ec4899', true, 6);

-- Sample feature flags
INSERT INTO feature_flags (flag_key, flag_name, description, is_enabled, target_audience, rollout_percentage, created_by) VALUES
('live_sessions_beta', 'Live Sessions Beta', 'Enable beta access to live interactive sessions', true, 'teachers', 100, 'admin_1'),
('mobile_app_promotion', 'Mobile App Promotion', 'Show mobile app download prompts', false, 'all', 0, 'admin_1'),
('advanced_analytics', 'Advanced Analytics', 'Enable detailed analytics for teachers', true, 'teachers', 50, 'admin_1'),
('group_video_calls', 'Group Video Calls', 'Enable video calling in study groups', false, 'students', 0, 'admin_1'),
('ai_pronunciation_check', 'AI Pronunciation Check', 'AI-powered pronunciation feedback', false, 'all', 10, 'admin_1');

-- Sample payments (basic structure)
INSERT INTO payments (user_id, amount, currency, payment_method, status, description, created_at) VALUES
('user_1', 29.99, 'USD', 'credit_card', 'completed', 'Premium subscription - Monthly', NOW() - INTERVAL '5 days'),
('user_2', 99.99, 'USD', 'paypal', 'completed', 'Premium subscription - Yearly', NOW() - INTERVAL '10 days'),
('user_3', 19.99, 'USD', 'credit_card', 'completed', 'Advanced Yoruba Course', NOW() - INTERVAL '3 days'),
('user_4', 49.99, 'USD', 'bank_transfer', 'pending', 'Teacher Certification Program', NOW() - INTERVAL '1 day');

-- Sample subscriptions
INSERT INTO subscriptions (user_id, plan_name, status, starts_at, ends_at, auto_renew, created_at) VALUES
('user_1', 'Premium Monthly', 'active', NOW() - INTERVAL '5 days', NOW() + INTERVAL '25 days', true, NOW() - INTERVAL '5 days'),
('user_2', 'Premium Yearly', 'active', NOW() - INTERVAL '10 days', NOW() + INTERVAL '355 days', true, NOW() - INTERVAL '10 days'),
('user_5', 'Basic Monthly', 'cancelled', NOW() - INTERVAL '30 days', NOW() - INTERVAL '1 day', false, NOW() - INTERVAL '30 days');

-- Update some existing courses with categories and pricing
UPDATE courses SET category_id = 1, is_featured = true, price = 0.00 WHERE title = 'Yoruba for Beginners';
UPDATE courses SET category_id = 2, is_featured = false, price = 19.99 WHERE title = 'Intermediate Yoruba Grammar';
UPDATE courses SET category_id = 4, is_featured = true, price = 29.99 WHERE title = 'Advanced Yoruba Literature';
UPDATE courses SET category_id = 3, is_featured = false, price = 15.99 WHERE title = 'Yoruba Culture and Traditions';
UPDATE courses SET category_id = 5, is_featured = false, price = 39.99 WHERE title = 'Business Yoruba';

-- Add some user activity tracking
INSERT INTO user_activity (user_id, activity_type, activity_data, created_at) VALUES
('user_1', 'login', '{"ip": "192.168.1.1", "device": "desktop"}', NOW() - INTERVAL '1 hour'),
('user_1', 'course_access', '{"course_id": 1, "lesson_id": 3}', NOW() - INTERVAL '30 minutes'),
('user_2', 'session_join', '{"session_id": 1}', NOW() - INTERVAL '2 hours'),
('user_3', 'group_create', '{"group_id": 1, "group_name": "Yoruba Beginners Circle"}', NOW() - INTERVAL '1 day'),
('user_4', 'teacher_application', '{"application_id": 1}', NOW() - INTERVAL '2 days');