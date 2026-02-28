-- Complete Admin Setup Script
-- This creates a proper admin user that will work with RLS policies

-- Step 1: Create admin user with Supabase Auth Admin API
-- You can run this via the Supabase dashboard or API

-- Method 1: Using SQL (requires service role key)
-- This creates a user and bypasses email confirmation
/*
SELECT auth.admin_create_user(
  'admin@school.com',  -- email
  'admin123456',       -- password
  '{"full_name": "School Administrator"}'::jsonb,  -- metadata
  true  -- email_confirm
);
*/

-- Method 2: Manual steps (recommended)
-- 1. Go to your Supabase dashboard
-- 2. Go to Authentication > Users
-- 3. Click "Add user"
-- 4. Email: admin@school.com
-- 5. Password: admin123456
-- 6. Check "Auto Confirm User"
-- 7. Click "Create user"

-- Step 2: After creating the user, get their ID and add admin role
-- First, find the user ID:
SELECT id, email FROM auth.users WHERE email = 'admin@school.com';

-- Step 3: Copy the UUID from above and replace it below
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('REPLACE-WITH-ACTUAL-UUID', 'admin');

-- Step 4: Create some test applications for testing
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
  emergency_contact_1_name,
  emergency_contact_1_phone,
  emergency_contact_1_relationship,
  status
) VALUES 
(
  (SELECT id FROM auth.users WHERE email = 'admin@school.com' LIMIT 1), -- Use admin as test parent
  'Test',
  'Student',
  '2018-01-01',
  'male',
  'kindergarten',
  'Test',
  'Parent',
  'admin@school.com',
  '+1234567890',
  'parent',
  '123 Test Street',
  'Nkoreya Tutoring',
  'Emergency Contact',
  '+1234567891',
  'grandparent',
  'submitted'
);

-- Step 5: Verify everything is set up correctly
SELECT 
  u.email,
  ur.role,
  a.student_first_name,
  a.status
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
LEFT JOIN public.applications a ON u.id = a.user_id
WHERE u.email = 'admin@school.com';