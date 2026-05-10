-- Fix RLS policies so admins can access notes and documents
-- Run this in Supabase SQL Editor

-- Allow admins to read application_notes
DROP POLICY IF EXISTS "Admins can view notes" ON public.application_notes;
CREATE POLICY "Admins can view notes" ON public.application_notes
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

-- Allow admins to insert application_notes
DROP POLICY IF EXISTS "Admins can create notes" ON public.application_notes;
CREATE POLICY "Admins can create notes" ON public.application_notes
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text = 'admin'
    )
  );

-- Allow admins to read application_documents
DROP POLICY IF EXISTS "Admins can view all documents" ON public.application_documents;
CREATE POLICY "Admins can view all documents" ON public.application_documents
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

-- Allow admins to update applications
DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;
CREATE POLICY "Admins can update all applications" ON public.applications
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text = 'admin'
    )
  );

-- Allow admins to insert status history
DROP POLICY IF EXISTS "Admins can insert status history" ON public.application_status_history;
CREATE POLICY "Admins can insert status history" ON public.application_status_history
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text = 'admin'
    )
  );
