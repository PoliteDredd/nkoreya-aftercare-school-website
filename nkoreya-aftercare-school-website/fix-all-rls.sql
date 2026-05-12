-- Fix ALL RLS permission errors
-- Run this in Supabase SQL Editor

-- 1. NOTIFICATIONS - allow authenticated users to read/update their own
DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;
DROP POLICY IF EXISTS "Authenticated can create notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can create notifications" ON public.notifications
  FOR INSERT TO authenticated WITH CHECK (TRUE);

-- Admins can also view all notifications
CREATE POLICY "Admins can view all notifications" ON public.notifications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

-- 2. APPLICATION_NOTES - allow admins to read/write
DROP POLICY IF EXISTS "Admins can view notes" ON public.application_notes;
DROP POLICY IF EXISTS "Admins can create notes" ON public.application_notes;

CREATE POLICY "Admins can view notes" ON public.application_notes
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

CREATE POLICY "Admins can create notes" ON public.application_notes
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text = 'admin'
    )
  );

-- 3. APPLICATION_DOCUMENTS - allow admins to read
DROP POLICY IF EXISTS "Admins can view all documents" ON public.application_documents;

CREATE POLICY "Admins can view all documents" ON public.application_documents
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

-- 4. APPLICATIONS - allow admins to update
DROP POLICY IF EXISTS "Admins can update all applications" ON public.applications;
DROP POLICY IF EXISTS "Admins can view all applications" ON public.applications;

CREATE POLICY "Admins can view all applications" ON public.applications
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

CREATE POLICY "Admins can update all applications" ON public.applications
  FOR UPDATE TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text = 'admin'
    )
  );

-- 5. APPLICATION_STATUS_HISTORY - allow admins
DROP POLICY IF EXISTS "Admins can insert status history" ON public.application_status_history;
DROP POLICY IF EXISTS "Admins can view all status history" ON public.application_status_history;

CREATE POLICY "Admins can view all status history" ON public.application_status_history
  FOR SELECT TO authenticated USING (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

CREATE POLICY "Admins can insert status history" ON public.application_status_history
  FOR INSERT TO authenticated WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text = 'admin'
    )
  );
