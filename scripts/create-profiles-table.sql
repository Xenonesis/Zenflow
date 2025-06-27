-- Complete setup script for profiles table with bio support
-- Run this in the Supabase SQL editor

-- Create the profiles table if it doesn't exist
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  age INTEGER,
  blood_group TEXT CHECK (blood_group IS NULL OR blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
  height DECIMAL,
  weight DECIMAL,
  gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
  preferences JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable Row Level Security on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create auto-update function for updated_at column
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to auto-update updated_at column
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_updated_at();

-- Create trigger to create a profile automatically when a new user signs up
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add the trigger to auth.users
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- Add GIN index for preferences JSONB column
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

-- Grant appropriate permissions to authenticated users
GRANT SELECT ON public.profiles_with_bio TO authenticated;
GRANT ALL ON public.profiles TO authenticated;

-- Optional: Insert a test profile for development purposes
-- Uncomment this section if you want to create a test profile
/*
INSERT INTO public.profiles (user_id, full_name, preferences)
VALUES 
  ('your-user-id-here', 'Test User', '{"bio": "This is a test bio for development"}'::jsonb)
ON CONFLICT (user_id) 
DO UPDATE SET 
  full_name = EXCLUDED.full_name,
  preferences = EXCLUDED.preferences;
*/ 