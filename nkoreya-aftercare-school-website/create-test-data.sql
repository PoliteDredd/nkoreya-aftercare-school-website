-- Create test applications for the admin to review
-- Run this AFTER creating the admin user and adding the admin role

-- First, let's create a test parent user (or use the admin user as parent for testing)
-- We'll use the admin user as the parent for simplicity

-- Get the admin user ID
DO $$
DECLARE
    admin_user_id UUID;
BEGIN
    -- Get the admin user ID
    SELECT id INTO admin_user_id FROM auth.users WHERE email = 'admin@school.com';
    
    -- Create test applications
    INSERT INTO public.applications (
        user_id,
        student_first_name,
        student_last_name,
        student_date_of_birth,
        student_gender,
        applying_for_grade,
        parent_first_name,
        parent_last_name,
        parent_email,
        parent_phone,
        parent_relationship,
        address,
        city,
        postal_code,
        emergency_contact_1_name,
        emergency_contact_1_phone,
        emergency_contact_1_relationship,
        status
    ) VALUES 
    -- Application 1 - Submitted (needs review)
    (
        admin_user_id,
        'Emma',
        'Johnson',
        '2018-05-15',
        'female',
        'kindergarten',
        'Sarah',
        'Johnson',
        'sarah.johnson@email.com',
        '+27123456789',
        'mother',
        '123 Main Street',
        'Nkoreya Tutoring',
        '1431',
        'John Johnson',
        '+27123456790',
        'father',
        'submitted'
    ),
    -- Application 2 - Under Review
    (
        admin_user_id,
        'Michael',
        'Smith',
        '2017-08-22',
        'male',
        'grade_1',
        'Lisa',
        'Smith',
        'lisa.smith@email.com',
        '+27123456791',
        'mother',
        '456 Oak Avenue',
        'Nkoreya Tutoring',
        '1431',
        'David Smith',
        '+27123456792',
        'father',
        'under_review'
    ),
    -- Application 3 - Submitted (needs action)
    (
        admin_user_id,
        'Sophia',
        'Williams',
        '2016-12-10',
        'female',
        'grade_2',
        'Jennifer',
        'Williams',
        'jennifer.williams@email.com',
        '+27123456793',
        'mother',
        '789 Pine Road',
        'Nkoreya Tutoring',
        '1431',
        'Robert Williams',
        '+27123456794',
        'father',
        'submitted'
    );
    
    RAISE NOTICE 'Test applications created successfully!';
END $$;