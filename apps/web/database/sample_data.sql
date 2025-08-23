-- Sample data for Ewa Ede platform
-- This file contains sample data to populate the database for testing

-- Sample courses
INSERT INTO courses (title, description, level, duration_weeks, total_lessons, is_active, created_at) VALUES
('Yoruba for Beginners', 'Learn the basics of Yoruba language including greetings, numbers, and common phrases', 'beginner', 8, 24, true, NOW()),
('Intermediate Yoruba Grammar', 'Dive deeper into Yoruba grammar, sentence structure, and verb conjugations', 'intermediate', 12, 36, true, NOW()),
('Advanced Yoruba Literature', 'Explore classical and modern Yoruba literature, poetry, and storytelling', 'advanced', 16, 48, true, NOW()),
('Yoruba Culture and Traditions', 'Understanding Yoruba culture, festivals, and traditional practices', 'beginner', 6, 18, true, NOW()),
('Business Yoruba', 'Professional Yoruba for business communications and formal settings', 'intermediate', 10, 30, true, NOW());

-- Sample lessons for the first course
INSERT INTO lessons (course_id, title, description, lesson_order, duration_minutes, is_free, is_active) VALUES
(1, 'Introduction to Yoruba', 'Welcome to Yoruba language learning journey', 1, 30, true, true),
(1, 'Basic Greetings', 'Learn how to greet people in Yoruba', 2, 25, true, true),
(1, 'Numbers 1-20', 'Counting from 1 to 20 in Yoruba', 3, 20, false, true),
(1, 'Family Members', 'Vocabulary for family relationships', 4, 30, false, true),
(1, 'Days of the Week', 'Learn the days of the week in Yoruba', 5, 15, false, true),
(1, 'Common Phrases', 'Essential phrases for daily conversation', 6, 35, false, true);

-- Sample study groups
INSERT INTO study_groups (name, description, creator_id, learning_level, is_public, max_members, meeting_schedule, is_active) VALUES
('Yoruba Beginners Circle', 'A supportive group for those just starting their Yoruba journey', 'user_1', 'beginner', true, 25, 'Every Sunday 3PM UTC', true),
('Advanced Yoruba Speakers', 'For fluent speakers looking to perfect their skills', 'user_2', 'advanced', true, 15, 'Wednesdays 7PM UTC', true),
('Yoruba Culture Enthusiasts', 'Discussing Yoruba culture, traditions, and history', 'user_3', 'intermediate', true, 30, 'Bi-weekly Saturdays', true),
('Lagos Yoruba Learners', 'Local group for Yoruba learners in Lagos', 'user_4', 'beginner', true, 20, 'Weekends', true),
('Yoruba Poetry Club', 'Exploring traditional and modern Yoruba poetry', 'user_5', 'advanced', true, 12, 'Monthly meetings', true);

-- Sample live sessions
INSERT INTO live_sessions (title, description, teacher_id, scheduled_date, duration_minutes, max_participants, learning_level, status) VALUES
('Introduction to Yoruba Pronunciation', 'Learn proper Yoruba pronunciation and tonal patterns', 'teacher_1', NOW() + INTERVAL '2 days', 60, 50, 'beginner', 'scheduled'),
('Yoruba Grammar Deep Dive', 'Advanced grammar concepts and sentence construction', 'teacher_2', NOW() + INTERVAL '5 days', 90, 30, 'intermediate', 'scheduled'),
('Yoruba Storytelling Workshop', 'Traditional Yoruba storytelling techniques and practice', 'teacher_3', NOW() + INTERVAL '1 week', 120, 25, 'advanced', 'scheduled'),
('Business Yoruba Essentials', 'Professional Yoruba for workplace communication', 'teacher_1', NOW() + INTERVAL '10 days', 75, 40, 'intermediate', 'scheduled'),
('Yoruba Cultural Immersion', 'Understanding Yoruba culture through language', 'teacher_4', NOW() + INTERVAL '2 weeks', 90, 35, 'beginner', 'scheduled');

-- Sample book clubs
INSERT INTO book_clubs (book_title, author, description, total_chapters, creator_id, reading_schedule, discussion_day, learning_level, max_members, next_discussion, is_active) VALUES
('Ogboju Ode Ninu Igbo Irunmale', 'D.O. Fagunwa', 'Classic Yoruba novel about a brave hunter in the forest of spirits', 12, 'user_1', 'weekly', 'sunday', 'intermediate', 20, NOW() + INTERVAL '3 days', true),
('Ireke Onibudo', 'D.O. Fagunwa', 'Another masterpiece by Fagunwa exploring Yoruba folklore', 10, 'user_2', 'biweekly', 'saturday', 'advanced', 15, NOW() + INTERVAL '1 week', true),
('Modern Yoruba Poetry Collection', 'Various Authors', 'Contemporary Yoruba poetry from modern writers', 8, 'user_3', 'weekly', 'friday', 'intermediate', 25, NOW() + INTERVAL '5 days', true),
('Yoruba Proverbs and Wisdom', 'Traditional', 'Collection of traditional Yoruba proverbs with explanations', 15, 'user_4', 'weekly', 'wednesday', 'beginner', 30, NOW() + INTERVAL '2 days', true);

-- Sample library resources
INSERT INTO library_resources (title, description, type, level, category, rating, is_free, is_active) VALUES
('Yoruba Alphabet Song', 'Interactive song to learn Yoruba alphabet', 'audio', 'beginner', 'Pronunciation', 4.8, true, true),
('Basic Yoruba Vocabulary Flashcards', 'Digital flashcards for essential Yoruba words', 'interactive', 'beginner', 'Vocabulary', 4.5, true, true),
('Yoruba Grammar Guide PDF', 'Comprehensive guide to Yoruba grammar rules', 'document', 'intermediate', 'Grammar', 4.7, false, true),
('Yoruba Conversation Practice Videos', 'Video series for conversation practice', 'video', 'intermediate', 'Speaking', 4.6, false, true),
('Traditional Yoruba Music Collection', 'Audio collection of traditional Yoruba songs', 'audio', 'advanced', 'Culture', 4.9, false, true),
('Yoruba Writing Practice Workbook', 'Interactive workbook for writing practice', 'interactive', 'beginner', 'Writing', 4.4, false, true),
('Yoruba History Documentary', 'Educational video about Yoruba history and culture', 'video', 'intermediate', 'Culture', 4.8, true, true),
('Children\'s Yoruba Stories', 'Collection of traditional children\'s stories in Yoruba', 'book', 'beginner', 'Literature', 4.6, true, true);

-- Sample notifications
INSERT INTO notifications (user_id, title, message, type, category, is_read) VALUES
('user_1', 'Welcome to Ewa Ede!', 'Welcome to your Yoruba learning journey. Start with our beginner course!', 'success', 'welcome', false),
('user_1', 'New Study Group Available', 'A new beginner study group has been created. Join now!', 'info', 'groups', false),
('user_2', 'Session Reminder', 'Your registered session "Yoruba Grammar Deep Dive" starts in 1 hour', 'warning', 'sessions', false),
('user_3', 'Book Club Discussion', 'New discussion posted in "Ogboju Ode Ninu Igbo Irunmale" book club', 'info', 'bookclub', true),
('user_4', 'Course Progress', 'Congratulations! You\'ve completed 50% of "Yoruba for Beginners"', 'success', 'progress', false);

-- Sample system settings
INSERT INTO system_settings (key, value, description, is_public) VALUES
('site_name', 'Ewa Ede - Yoruba Academy', 'The name of the platform', true),
('default_language', 'en', 'Default platform language', true),
('max_group_members', '50', 'Maximum members allowed in a study group', false),
('max_session_participants', '100', 'Maximum participants in a live session', false),
('free_trial_days', '7', 'Number of free trial days for new users', false),
('support_email', 'support@ewaede.com', 'Support contact email', true),
('maintenance_mode', 'false', 'Whether the site is in maintenance mode', false);