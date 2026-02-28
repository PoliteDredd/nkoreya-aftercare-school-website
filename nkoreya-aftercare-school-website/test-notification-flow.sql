-- Complete test of the notification flow
-- This simulates what happens when an admin changes an application status

-- Step 1: Create a test parent user (if one doesn't exist)
-- You can skip this if you already have parent users
/*
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES (
    gen_random_uuid(),
    'testparent@example.com',
    crypt('password123', gen_salt('bf')),
    NOW(),
    NOW(),
    NOW()
);
*/

-- Step 2: Find or create a test application
DO $$
DECLARE
    parent_user_id UUID;
    test_app_id UUID;
    admin_user_id UUID;
BEGIN
    -- Get a parent user (not admin)
    SELECT u.id INTO parent_user_id
    FROM auth.users u
    LEFT JOIN user_roles ur ON u.id = ur.user_id
    WHERE ur.role IS NULL OR ur.role = 'applicant'
    LIMIT 1;
    
    -- Get admin user
    SELECT u.id INTO admin_user_id
    FROM auth.users u
    JOIN user_roles ur ON u.id = ur.user_id
    WHERE ur.role = 'admin'
    LIMIT 1;
    
    IF parent_user_id IS NOT NULL THEN
        -- Create a test application if none exists
        INSERT INTO applications (
            user_id,
            student_first_name,
            student_last_name,
            student_date_of_birth,
            applying_for_grade,
            parent_first_name,
            parent_last_name,
            parent_email,
            parent_phone,
            parent_relationship,
            address,
            city,
            emergency_contact_1_name,
            emergency_contact_1_phone,
            emergency_contact_1_relationship,
            status
        ) VALUES (
            parent_user_id,
            'Test',
            'Student',
            '2018-01-01',
            'kindergarten',
            'Test',
            'Parent',
            (SELECT email FROM auth.users WHERE id = parent_user_id),
            '+1234567890',
            'parent',
            '123 Test Street',
            'Test City',
            'Emergency Contact',
            '+1234567891',
            'grandparent',
            'submitted'
        )
        ON CONFLICT DO NOTHING
        RETURNING id INTO test_app_id;
        
        -- Get the application ID if it already existed
        IF test_app_id IS NULL THEN
            SELECT id INTO test_app_id
            FROM applications
            WHERE user_id = parent_user_id
            LIMIT 1;
        END IF;
        
        -- Simulate admin approving the application
        UPDATE applications
        SET 
            status = 'approved',
            status_message = 'Congratulations! Your application has been approved.',
            reviewed_by = admin_user_id,
            reviewed_at = NOW()
        WHERE id = test_app_id;
        
        -- Create the notification (this is what the app does)
        INSERT INTO notifications (user_id, title, message, type, application_id)
        VALUES (
            parent_user_id,
            'Congratulations! Application Approved',
            'We are pleased to inform you that Test Student''s application has been approved. Welcome to Bright Future Primary School!',
            'status_change',
            test_app_id
        );
        
        RAISE NOTICE 'Test flow completed:';
        RAISE NOTICE '- Parent user: %', parent_user_id;
        RAISE NOTICE '- Application: %', test_app_id;
        RAISE NOTICE '- Admin user: %', admin_user_id;
        
    ELSE
        RAISE NOTICE 'No suitable parent user found. Please create a parent user first.';
    END IF;
END $$;

-- Step 3: Verify the notification was created and can be accessed
SELECT 
    'Final Verification' as step,
    u.email as parent_email,
    a.student_first_name || ' ' || a.student_last_name as student_name,
    a.status as application_status,
    n.title as notification_title,
    n.message as notification_message,
    n.created_at as notification_time
FROM notifications n
JOIN auth.users u ON n.user_id = u.id
JOIN applications a ON n.application_id = a.id
WHERE n.type = 'status_change'
ORDER BY n.created_at DESC
LIMIT 5;