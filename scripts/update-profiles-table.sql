-- Migration script to update profiles table with new fields
-- Run this in the Supabase SQL editor

-- Add new columns
ALTER TABLE IF EXISTS public.profiles 
  ADD COLUMN IF NOT EXISTS age INTEGER,
  ADD COLUMN IF NOT EXISTS blood_group TEXT,
  ADD COLUMN IF NOT EXISTS height DECIMAL,
  ADD COLUMN IF NOT EXISTS weight DECIMAL,
  ADD COLUMN IF NOT EXISTS gender TEXT,
  ADD COLUMN IF NOT EXISTS preferences JSONB DEFAULT '{}'::jsonb;

-- Add constraints through separate commands
ALTER TABLE IF EXISTS public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_gender_check;

ALTER TABLE IF EXISTS public.profiles
  ADD CONSTRAINT profiles_gender_check 
  CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say'));

ALTER TABLE IF EXISTS public.profiles 
  DROP CONSTRAINT IF EXISTS profiles_blood_group_check;

ALTER TABLE IF EXISTS public.profiles
  ADD CONSTRAINT profiles_blood_group_check 
  CHECK (blood_group IS NULL OR blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'));

-- Create index for improved querying on preferences
CREATE INDEX IF NOT EXISTS idx_profiles_preferences ON public.profiles USING GIN (preferences);

-- Note: Run this script in the Supabase SQL editor
-- This will add the new fields to the existing profiles table 