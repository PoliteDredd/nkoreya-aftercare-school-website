-- Add inquiries table and admin functionality
-- Run this in your Supabase SQL Editor

-- Create inquiries table
CREATE TABLE public.inquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  parent_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  child_name TEXT NOT NULL,
  grade_applying TEXT NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'responded', 'closed')),
  admin_response TEXT,
  responded_by UUID REFERENCES auth.users(id),
  responded_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.inquiries ENABLE ROW LEVEL SECURITY;

-- RLS Policies for inquiries
CREATE POLICY "Anyone can create inquiries" ON public.inquiries
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "Admins can view all inquiries" ON public.inquiries
  FOR SELECT USING (public.is_admin_or_principal(auth.uid()));

CREATE POLICY "Admins can update all inquiries" ON public.inquiries
  FOR UPDATE USING (public.is_admin_or_principal(auth.uid()));

-- Add updated_at trigger
CREATE TRIGGER update_inquiries_updated_at
  BEFORE UPDATE ON public.inquiries
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for inquiries
ALTER PUBLICATION supabase_realtime ADD TABLE public.inquiries;

-- Create some test inquiries
INSERT INTO public.inquiries (parent_name, email, phone, child_name, grade_applying, message, status)
VALUES 
  ('John Smith', 'john.smith@email.com', '+27123456789', 'Emma Smith', 'Grade 1', 'I would like to know more about your curriculum and extracurricular activities.', 'new'),
  ('Sarah Johnson', 'sarah.johnson@email.com', '+27123456790', 'Michael Johnson', 'Kindergarten', 'What are the school hours and do you provide after-school care?', 'new'),
  ('David Williams', 'david.williams@email.com', '+27123456791', 'Sophia Williams', 'Grade 2', 'My daughter has special learning needs. Do you have support programs?', 'in_progress');

-- Verify the table was created
SELECT 
  'Inquiries Table Created' as status,
  COUNT(*) as sample_inquiries
FROM public.inquiries;