-- Simplify policies to allow authenticated users to submit applications
-- Run this in Supabase SQL Editor

-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can create own applications" ON public.applications;

-- Create a simpler policy that allows any authenticated user to insert
CREATE POLICY "Authenticated users can create applications" ON public.applications
  FOR INSERT 
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Also ensure the SELECT policy works
DROP POLICY IF EXISTS "Users can view own applications" ON public.applications;
CREATE POLICY "Users can view own applications" ON public.applications
  FOR SELECT 
  TO authenticated
  USING (auth.uid() = user_id);

-- Verify policies are active
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'applications';
