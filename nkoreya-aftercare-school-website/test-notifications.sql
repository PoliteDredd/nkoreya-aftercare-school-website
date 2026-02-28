-- Test script to verify notifications are working
-- Run this in your Supabase SQL Editor

-- First, let's check if we have any applications and users
SELECT 
    a.id as application_id,
    a.student_first_name,
    a.student_last_name,
    a.status,
    u.email as parent_email
FROM applications a
JOIN auth.users u ON a.user_id = u.id
LIMIT 5;

-- Check if we have any notifications
SELECT 
    n.id,
    n.title,
    n.message,
    n.type,
    n.read,
    n.created_at,
    u.email as user_email
FROM notifications n
JOIN auth.users u ON n.user_id = u.id
ORDER BY n.created_at DESC
LIMIT 10;

-- If you want to create a test notification manually:
-- (Replace the user_id with an actual user ID from your auth.users table)
/*
INSERT INTO notifications (user_id, title, message, type, application_id)
VALUES (
    (SELECT id FROM auth.users WHERE email = 'admin@school.com' LIMIT 1),
    'Test Notification',
    'This is a test notification to verify the system is working.',
    'status_change',
    (SELECT id FROM applications LIMIT 1)
);
*/

-- Check RLS policies for notifications
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'notifications';