-- Step 1: Find the user ID for the admin user
SELECT id, email, created_at FROM auth.users WHERE email = 'admin@school.com';

-- Step 2: Copy the UUID from above and replace it in the INSERT below
-- INSERT INTO public.user_roles (user_id, role) 
-- VALUES ('PASTE-THE-UUID-HERE', 'admin');

-- Step 3: Verify the admin role was added correctly
SELECT 
    u.email,
    u.id as user_id,
    ur.role,
    ur.created_at as role_created_at
FROM auth.users u
JOIN public.user_roles ur ON u.id = ur.user_id
WHERE u.email = 'admin@school.com';

-- Step 4: Test the admin functions work
SELECT public.has_role(
    (SELECT id FROM auth.users WHERE email = 'admin@school.com'), 
    'admin'::public.app_role
) as is_admin;

SELECT public.is_admin_or_principal(
    (SELECT id FROM auth.users WHERE email = 'admin@school.com')
) as has_admin_access;