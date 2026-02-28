-- Script to create an admin user
-- Run this in your Supabase SQL Editor

-- First, you need to sign up a user through the normal auth flow, then run this:
-- Replace 'your-admin-email@example.com' with the actual email you want to use

-- 1. Find the user ID for your admin email
-- SELECT id, email FROM auth.users WHERE email = 'your-admin-email@example.com';

-- 2. Insert admin role (replace the UUID with the actual user ID from step 1)
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'admin');

-- Example (replace with actual values):
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('12345678-1234-1234-1234-123456789012', 'admin');

-- To create a principal user instead:
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('your-user-id-here', 'principal');