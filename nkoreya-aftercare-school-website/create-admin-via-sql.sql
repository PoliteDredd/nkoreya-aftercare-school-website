-- Create admin user via SQL (if dashboard method didn't work)
-- Run this in Supabase SQL Editor

-- Method 1: Using admin functions (requires service role)
SELECT auth.admin_create_user(
  'admin@school.com',
  'admin123456',
  '{"full_name": "School Administrator"}'::jsonb,
  true  -- email_confirm
);

-- Method 2: If above doesn't work, create manually
-- First check if user exists
SELECT id, email FROM auth.users WHERE email = 'admin@school.com';

-- If user exists but can't login, reset password
-- UPDATE auth.users 
-- SET encrypted_password = crypt('admin123456', gen_salt('bf'))
-- WHERE email = 'admin@school.com';

-- Add admin role (replace UUID with actual user ID)
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('USER-UUID-HERE', 'admin')
-- ON CONFLICT (user_id, role) DO NOTHING;