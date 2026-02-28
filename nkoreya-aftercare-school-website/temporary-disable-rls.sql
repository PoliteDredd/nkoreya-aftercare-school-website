-- TEMPORARY: Disable RLS for testing admin functionality
-- ⚠️ WARNING: This removes security! Only use for testing, then re-enable!

-- Disable RLS on applications table temporarily
ALTER TABLE public.applications DISABLE ROW LEVEL SECURITY;

-- Disable RLS on related tables
ALTER TABLE public.application_status_history DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_notes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications DISABLE ROW LEVEL SECURITY;

-- ✅ After testing, RE-ENABLE security with this:
-- ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.application_status_history ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.application_notes ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;