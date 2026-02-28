-- Setup script to create a real admin user
-- Run this in your Supabase SQL Editor

-- Step 1: First, you need to sign up a user through the normal auth flow
-- Go to your app at /auth and create an account with email: admin@school.com

-- Step 2: After signing up, find the user ID and insert admin role
-- Replace 'admin@school.com' with the email you used

-- Find the user ID (run this first to get the UUID)
SELECT id, email FROM auth.users WHERE email = 'admin@school.com';

-- Step 3: Copy the UUID from above and replace it below
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('PASTE-USER-UUID-HERE', 'admin');

-- Example (replace with your actual UUID):
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('12345678-1234-1234-1234-123456789012', 'admin');

-- Step 4: Verify the admin role was created
-- SELECT ur.role, u.email 
-- FROM public.user_roles ur 
-- JOIN auth.users u ON ur.user_id = u.id 
-- WHERE u.email = 'admin@school.com';