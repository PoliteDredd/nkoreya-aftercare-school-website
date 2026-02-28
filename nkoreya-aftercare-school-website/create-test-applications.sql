-- Script to create test applications for testing the admin portal
-- Run this in your Supabase SQL Editor

-- First, create a test parent user (you can skip this if you already have users)
-- You'll need to sign up through the normal flow first, then get the user ID

-- Example test applications (replace user_id with actual user IDs from auth.users)
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
-- Application 1 - Submitted
(
  '00000000-0000-0000-0000-000000000001', -- Replace with actual user ID
  'Emma',
  'Johnson',
  '2018-05-15',
  'female',
  'kindergarten',
  'Sarah',
  'Johnson',
  'sarah.johnson@email.com',
  '+1234567890',
  'mother',
  '123 Main Street',
  'Nkoreya Tutoring',
  '1431',
  'John Johnson',
  '+1234567891',
  'father',
  'submitted'
),
-- Application 2 - Under Review
(
  '00000000-0000-0000-0000-000000000002', -- Replace with actual user ID
  'Michael',
  'Smith',
  '2017-08-22',
  'male',
  'grade_1',
  'Lisa',
  'Smith',
  'lisa.smith@email.com',
  '+1234567892',
  'mother',
  '456 Oak Avenue',
  'Nkoreya Tutoring',
  '1431',
  'David Smith',
  '+1234567893',
  'father',
  'under_review'
),
-- Application 3 - Needs Review
(
  '00000000-0000-0000-0000-000000000003', -- Replace with actual user ID
  'Sophia',
  'Williams',
  '2016-12-10',
  'female',
  'grade_2',
  'Jennifer',
  'Williams',
  'jennifer.williams@email.com',
  '+1234567894',
  'mother',
  '789 Pine Road',
  'Nkoreya Tutoring',
  '1431',
  'Robert Williams',
  '+1234567895',
  'father',
  'submitted'
);

-- Note: You'll need to replace the user_id values with actual UUIDs from your auth.users table
-- To get actual user IDs, run: SELECT id, email FROM auth.users;