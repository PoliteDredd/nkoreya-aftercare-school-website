-- Fix storage policies so admins can view and download documents
-- Run this in Supabase SQL Editor

-- Drop ALL existing storage policies for this bucket
DO $$
DECLARE
  pol RECORD;
BEGIN
  FOR pol IN 
    SELECT policyname FROM pg_policies 
    WHERE tablename = 'objects' AND schemaname = 'storage'
  LOOP
    EXECUTE 'DROP POLICY IF EXISTS "' || pol.policyname || '" ON storage.objects';
  END LOOP;
END $$;

-- Allow authenticated users to upload to their own folder
CREATE POLICY "Users can upload own documents" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (
    bucket_id = 'application-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow users to view/download their own documents
CREATE POLICY "Users can view own documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'application-documents' AND
    auth.uid()::text = (storage.foldername(name))[1]
  );

-- Allow admins to view and download ALL documents
CREATE POLICY "Admins can view all documents" ON storage.objects
  FOR SELECT TO authenticated
  USING (
    bucket_id = 'application-documents' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text IN ('admin', 'principal')
    )
  );

-- Allow admins to delete documents
CREATE POLICY "Admins can delete documents" ON storage.objects
  FOR DELETE TO authenticated
  USING (
    bucket_id = 'application-documents' AND
    EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = auth.uid() AND role::text = 'admin'
    )
  );
