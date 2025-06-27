-- Script to create and configure storage bucket for avatars
-- Run this in the Supabase SQL editor

-- Create the avatars bucket if it doesn't exist (using the Supabase storage API in the SQL editor)
-- You may need to run this through the Supabase dashboard Storage UI instead
-- This is SQL-compatible with PostgreSQL/Supabase
DO $$
BEGIN
  -- Check if bucket exists
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'avatars'
  ) THEN
    -- Create bucket (this might need admin privileges)
    INSERT INTO storage.buckets (id, name, public)
    VALUES ('avatars', 'avatars', true);
  ELSE
    -- Update existing bucket to be public
    UPDATE storage.buckets
    SET public = true
    WHERE id = 'avatars';
  END IF;
END $$;

-- Enable Row Level Security for the storage.objects table
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Drop existing policies for avatars bucket if they exist
DROP POLICY IF EXISTS "Avatar images are publicly accessible" ON storage.objects;
DROP POLICY IF EXISTS "Users can upload their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can update their own avatar" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete their own avatar" ON storage.objects;

-- Create policy to allow public read access to all objects in avatars bucket
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'avatars');

-- Create policy for users to upload their own avatar
CREATE POLICY "Users can upload their own avatar"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
  );

-- Create policy for users to update their own avatar
CREATE POLICY "Users can update their own avatar"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
  );

-- Create policy for users to delete their own avatar
CREATE POLICY "Users can delete their own avatar"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'avatars' AND
    auth.uid() IS NOT NULL
  );

-- Note: Run this script in the Supabase SQL editor
-- This will create the storage bucket and set up RLS policies for avatar images 

-- Storage Setup Instructions for Supabase

/*
IMPORTANT: This SQL script shows the structure of the storage setup,
but you'll need to use the Supabase Dashboard to actually create and configure 
the storage bucket as SQL access to storage tables may be restricted.

Follow these steps in the Supabase Dashboard:

1. Go to Storage > Buckets
2. Click "Create Bucket"
3. Set the bucket name to "avatars"
4. Check "Public bucket" to make it publicly accessible
5. Click "Create bucket"

Then set up the following policies in the bucket settings:

FOR SELECT (public read access):
- Policy name: "Avatar images are publicly accessible"
- Target roles: Public (authenticated and anonymous)
- Using expression: true

FOR INSERT (authenticated upload):
- Policy name: "Users can upload their own avatar"
- Target roles: Authenticated users
- Using expression: auth.uid() IS NOT NULL

FOR UPDATE (owner update):
- Policy name: "Users can update their own avatar"
- Target roles: Authenticated users
- Using expression: auth.uid() IS NOT NULL

FOR DELETE (owner delete):
- Policy name: "Users can delete their own avatar"
- Target roles: Authenticated users
- Using expression: auth.uid() IS NOT NULL
*/

-- Policies defined below are FOR REFERENCE ONLY
-- These would be the SQL equivalents of what you should set up in the dashboard

/*
-- Create the avatars bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('avatars', 'avatars', true);

-- Enable Row Level Security
-- ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to all objects in avatars bucket
-- CREATE POLICY "Avatar images are publicly accessible"
--   ON storage.objects
--   FOR SELECT
--   USING (bucket_id = 'avatars');

-- Create policy for users to upload their own avatar
-- CREATE POLICY "Users can upload their own avatar"
--   ON storage.objects
--   FOR INSERT
--   WITH CHECK (
--     bucket_id = 'avatars' AND
--     auth.uid() IS NOT NULL
--   );

-- Create policy for users to update their own avatar
-- CREATE POLICY "Users can update their own avatar"
--   ON storage.objects
--   FOR UPDATE
--   USING (
--     bucket_id = 'avatars' AND
--     auth.uid() IS NOT NULL
--   );

-- Create policy for users to delete their own avatar
-- CREATE POLICY "Users can delete their own avatar"
--   ON storage.objects
--   FOR DELETE
--   USING (
--     bucket_id = 'avatars' AND
--     auth.uid() IS NOT NULL
--   );
*/ 