-- Script to fix RLS policies for notifications if they're not working
-- Run this ONLY if the check script shows issues

-- 1. Drop existing notification policies (if they exist)
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

-- 2. Recreate the notification policies with better definitions
CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT 
  USING (public.is_admin_or_principal(auth.uid()));

CREATE POLICY "System can create notifications" ON public.notifications
  FOR INSERT 
  WITH CHECK (TRUE);

-- 3. Ensure RLS is enabled
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 4. Test the policies by creating a test notification
-- (This will only work if you run it as an admin user)
DO $$
DECLARE
    test_user_id UUID;
    test_app_id UUID;
BEGIN
    -- Get a user who has applications
    SELECT DISTINCT a.user_id INTO test_user_id
    FROM applications a
    JOIN auth.users u ON a.user_id = u.id
    LIMIT 1;
    
    SELECT id INTO test_app_id
    FROM applications
    WHERE user_id = test_user_id
    LIMIT 1;
    
    IF test_user_id IS NOT NULL THEN
        -- Create a test notification
        INSERT INTO notifications (user_id, title, message, type, application_id)
        VALUES (
            test_user_id,
            'RLS Test Notification',
            'This notification was created to test RLS policies.',
            'status_change',
            test_app_id
        );
        
        RAISE NOTICE 'Test notification created for user %', test_user_id;
    ELSE
        RAISE NOTICE 'No suitable user found for testing';
    END IF;
END $$;

-- 5. Verify the test notification was created and can be seen
SELECT 
    'Verification' as test,
    n.title,
    n.message,
    u.email as recipient_email,
    n.created_at
FROM notifications n
JOIN auth.users u ON n.user_id = u.id
WHERE n.title = 'RLS Test Notification'
ORDER BY n.created_at DESC
LIMIT 1;