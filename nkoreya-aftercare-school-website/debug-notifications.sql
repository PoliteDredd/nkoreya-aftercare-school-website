-- Debug script to check notification system
-- Run this in your Supabase SQL Editor

-- 1. Check if we have applications and their owners
SELECT 
    'Applications' as table_name,
    a.id,
    a.student_first_name || ' ' || a.student_last_name as student_name,
    a.status,
    a.user_id,
    u.email as parent_email
FROM applications a
JOIN auth.users u ON a.user_id = u.id
ORDER BY a.created_at DESC;

-- 2. Check existing notifications
SELECT 
    'Notifications' as table_name,
    n.id,
    n.title,
    n.message,
    n.type,
    n.read,
    n.user_id,
    u.email as recipient_email,
    n.created_at
FROM notifications n
JOIN auth.users u ON n.user_id = u.id
ORDER BY n.created_at DESC;

-- 3. Check if RLS is blocking notifications
SELECT 
    'RLS Policies' as info,
    schemaname, 
    tablename, 
    policyname, 
    permissive, 
    cmd, 
    qual 
FROM pg_policies 
WHERE tablename = 'notifications';

-- 4. Test creating a notification manually
-- (This will help us see if the issue is with creation or viewing)
DO $$
DECLARE
    test_user_id UUID;
    test_app_id UUID;
BEGIN
    -- Get a user and application for testing
    SELECT u.id INTO test_user_id 
    FROM auth.users u 
    JOIN applications a ON u.id = a.user_id 
    LIMIT 1;
    
    SELECT id INTO test_app_id 
    FROM applications 
    WHERE user_id = test_user_id 
    LIMIT 1;
    
    IF test_user_id IS NOT NULL AND test_app_id IS NOT NULL THEN
        -- Create a test notification
        INSERT INTO notifications (user_id, title, message, type, application_id)
        VALUES (
            test_user_id,
            'Test Notification - ' || NOW()::text,
            'This is a test notification created by the debug script.',
            'status_change',
            test_app_id
        );
        
        RAISE NOTICE 'Test notification created for user % and application %', test_user_id, test_app_id;
    ELSE
        RAISE NOTICE 'No user or application found for testing';
    END IF;
END $$;

-- 5. Check the test notification was created
SELECT 
    'Test Result' as info,
    n.title,
    n.message,
    u.email as recipient,
    n.created_at
FROM notifications n
JOIN auth.users u ON n.user_id = u.id
WHERE n.title LIKE 'Test Notification%'
ORDER BY n.created_at DESC
LIMIT 1;