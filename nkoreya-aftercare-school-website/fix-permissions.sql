-- Fix permissions for applications table
-- Run this in Supabase SQL Editor

-- First, make sure your current user has the applicant role
-- Replace 'YOUR_EMAIL' with the email you're logged in with
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'applicant'::app_role
FROM auth.users 
WHERE email = 'politedlamini305@gmail.com'
ON CONFLICT (user_id, role) DO NOTHING;

-- Also add profiles for existing users who don't have one
INSERT INTO public.profiles (id, email, full_name)
SELECT id, email, raw_user_meta_data ->> 'full_name'
FROM auth.users
WHERE id NOT IN (SELECT id FROM public.profiles)
ON CONFLICT (id) DO NOTHING;

-- Check if policies are working - run this to see your roles
SELECT u.email, ur.role 
FROM auth.users u
LEFT JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email IN ('admin@school.com', 'politedlamini305@gmail.com');
