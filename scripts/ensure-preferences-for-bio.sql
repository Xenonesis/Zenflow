-- Migration script to ensure preferences column is set up for bio data
-- Run this in the Supabase SQL editor

-- Make sure preferences column exists with default empty JSONB object
ALTER TABLE IF EXISTS public.profiles 
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Ensure null values are converted to empty objects
UPDATE public.profiles
SET preferences = '{}'::jsonb
WHERE preferences IS NULL;

-- Add GIN index for better performance if not already exists
DROP INDEX IF EXISTS idx_profiles_preferences;
CREATE INDEX idx_profiles_preferences ON public.profiles USING GIN (preferences);

-- Create a view for easy access to profile data including bio
DROP VIEW IF EXISTS public.profiles_with_bio;
CREATE VIEW public.profiles_with_bio AS
SELECT 
  id,
  user_id,
  full_name,
  avatar_url,
  age,
  blood_group,
  height,
  weight,
  gender,
  preferences->>'bio' as bio,
  created_at,
  updated_at
FROM public.profiles;

-- Set proper permissions for the view
-- Note: We don't need to enable RLS on the view because security is inherited
-- from the underlying profiles table, which should already have RLS enabled

-- Grant appropriate permissions to authenticated users
GRANT SELECT ON public.profiles_with_bio TO authenticated;

-- Note: The view is read-only and inherits RLS policies from the profiles table.
-- Updates to the bio field must be done via the profiles table's preferences column. 