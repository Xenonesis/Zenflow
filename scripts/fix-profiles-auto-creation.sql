-- Fix for profile auto-creation during signup
-- Run this script in the Supabase SQL Editor to fix issues with the profile creation trigger

-- First make sure the profiles table exists with proper structure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        RAISE NOTICE 'Creating profiles table...';
        
        -- Create the profiles table
        CREATE TABLE public.profiles (
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
        
        -- Enable Row Level Security
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
    ELSE
        RAISE NOTICE 'Profiles table already exists';
    END IF;
END
$$;

-- Create or replace policies to ensure they're correct
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

-- Re-create the policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  FOR ALL USING (auth.role() = 'service_role');

-- Fix the auto-profile creation function and trigger
-- First drop existing if present
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;

-- Create improved function with better error handling
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
DECLARE
  profile_id UUID;
BEGIN
  -- Generate a new UUID for the profile if needed
  profile_id := NEW.id;
  
  -- Insert with more comprehensive error handling
  BEGIN
    INSERT INTO public.profiles (id, user_id, created_at, updated_at, preferences)
    VALUES (
      profile_id, 
      NEW.id, 
      CURRENT_TIMESTAMP, 
      CURRENT_TIMESTAMP,
      '{}'::jsonb
    );
    -- Log success
    RAISE NOTICE 'Profile created successfully for user %', NEW.id;
  EXCEPTION 
    WHEN unique_violation THEN
      -- If profile already exists, log and continue
      RAISE NOTICE 'Profile already exists for user %', NEW.id;
    WHEN foreign_key_violation THEN
      -- If there's a foreign key violation
      RAISE NOTICE 'Foreign key violation creating profile for user %', NEW.id;
    WHEN OTHERS THEN
      -- For other errors, log but don't abort the user creation
      RAISE WARNING 'Error creating profile for user %: %', NEW.id, SQLERRM;
  END;
  
  -- Always return the NEW record to allow the user creation to proceed
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop any existing trigger
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;

-- Create the trigger with a different name to avoid conflicts
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- Grant necessary permissions
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- Create profiles for any existing users who don't have one
INSERT INTO public.profiles (id, user_id, created_at, updated_at, preferences)
SELECT 
  id, 
  id, 
  CURRENT_TIMESTAMP, 
  CURRENT_TIMESTAMP,
  '{}'::jsonb
FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);

-- Report completion
DO $$
BEGIN
  RAISE NOTICE 'Profile creation fix completed successfully';
END
$$; 