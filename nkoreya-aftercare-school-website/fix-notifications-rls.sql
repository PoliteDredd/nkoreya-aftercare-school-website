-- Fix notifications RLS so parents can read their own notifications
-- Run this in Supabase SQL Editor

DROP POLICY IF EXISTS "Users can view own notifications" ON public.notifications;
DROP POLICY IF EXISTS "Users can update own notifications" ON public.notifications;
DROP POLICY IF EXISTS "System can create notifications" ON public.notifications;

CREATE POLICY "Users can view own notifications" ON public.notifications
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update own notifications" ON public.notifications
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Authenticated can create notifications" ON public.notifications
  FOR INSERT TO authenticated
  WITH CHECK (TRUE);
