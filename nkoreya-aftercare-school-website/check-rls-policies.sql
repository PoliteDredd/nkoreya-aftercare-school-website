-- Script to check and verify RLS policies for notifications
-- Run this in your Supabase SQL Editor

-- 1. Check current RLS policies for notifications table
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual
FROM pg_policies 
WHERE tablename = 'notifications'
ORDER BY policyname;

-- 2. Check if RLS is enabled on notifications table
SELECT 
    schemaname,
    tablename,
    rowsecurity
FROM pg_tables 
WHERE tablename = 'notifications';

-- 3. Test if a specific user can see their notifications
-- Replace 'parent@example.com' with an actual parent email
DO $$
DECLARE
    test_user_id UUID;
    notification_count INTEGER;
BEGIN
    -- Get a parent user ID
    SELECT id INTO test_user_id 
    FROM auth.users 
    WHERE email = 'admin@school.com'  -- Change this to a parent email
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Check how many notifications this user should see
        SELECT COUNT(*) INTO notification_count
        FROM notifications 
        WHERE user_id = test_user_id;
        
        RAISE NOTICE 'User % has % notifications', test_user_id, notification_count;
        
        -- Show the notifications for this user
        RAISE NOTICE 'Notifications for user:';
        FOR rec IN 
            SELECT title, message, created_at 
            FROM notifications 
            WHERE user_id = test_user_id 
            ORDER BY created_at DESC 
            LIMIT 5
        LOOP
            RAISE NOTICE '- %: % (created: %)', rec.title, rec.message, rec.created_at;
        END LOOP;
    ELSE
        RAISE NOTICE 'No user found with that email';
    END IF;
END $$;

-- 4. Test the RLS function that should allow users to see their own notifications
SELECT 
    'Testing RLS function' as test,
    auth.uid() as current_user_id,
    public.has_role(auth.uid(), 'admin'::public.app_role) as is_admin;

-- 5. Show all users and their roles for reference
SELECT 
    u.email,
    u.id as user_id,
    ur.role,
    COUNT(n.id) as notification_count
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.notifications n ON u.id = n.user_id
GROUP BY u.email, u.id, ur.role
ORDER BY u.created_at DESC;