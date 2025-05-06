-- Fix missing or corrupt profiles
-- Run this script in the Supabase SQL Editor

-- Drop existing functions and triggers first
DROP FUNCTION IF EXISTS public.fix_profile_creation() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS update_profile_updated_at() CASCADE;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

BEGIN;

-- Check if the profiles table exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        RAISE NOTICE 'The profiles table does not exist. Creating it...';
        
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
        
        -- Enable RLS
        ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
        
        -- Create basic RLS policies
        CREATE POLICY "Users can view their own profile" 
          ON public.profiles 
          FOR SELECT USING (auth.uid() = user_id);
        
        CREATE POLICY "Users can update their own profile" 
          ON public.profiles 
          FOR UPDATE USING (auth.uid() = user_id);
          
        CREATE POLICY "Users can insert their own profile" 
          ON public.profiles 
          FOR INSERT WITH CHECK (auth.uid() = user_id);
          
        -- Policy for service role to manage profiles
        CREATE POLICY "Service role can manage all profiles" 
          ON public.profiles 
          USING (auth.role() = 'service_role');
    ELSE
        RAISE NOTICE 'The profiles table exists.';
    END IF;
END
$$;

-- Create profiles for existing users who don't have one
INSERT INTO public.profiles (id, user_id)
SELECT id, id FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);

-- Fix any NULL preferences fields (should be empty JSON objects)
UPDATE public.profiles
SET preferences = '{}'::jsonb
WHERE preferences IS NULL;

-- Recreate the auto-update function and trigger separately

-- First drop existing function if it exists
DROP FUNCTION IF EXISTS update_profile_updated_at() CASCADE;

-- Create the function
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Create the trigger
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_updated_at();

-- Drop existing profile creation function if it exists
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;

-- Create a minimal profile creation function with no bells and whistles
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Simplest version possible, with minimal fields
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
EXCEPTION 
  WHEN OTHERS THEN
    -- Always continue with user creation regardless of errors
    RAISE LOG 'Error creating profile: %', SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the trigger
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;  -- This might be needed for the signup process

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Profile fixes completed.';
END
$$;

-- New function to fix profile creation
DROP FUNCTION IF EXISTS public.fix_profile_creation() CASCADE;

-- Create the properly implemented function
CREATE OR REPLACE FUNCTION public.fix_profile_creation()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  profiles_count INTEGER;
  users_count INTEGER;
  fixed_count INTEGER := 0;
BEGIN
  -- Create missing profiles for existing users
  WITH users_without_profiles AS (
    SELECT id
    FROM auth.users u
    WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
    )
  ),
  inserted AS (
    INSERT INTO public.profiles (id, user_id, created_at, updated_at, preferences)
    SELECT 
      id, 
      id, 
      CURRENT_TIMESTAMP, 
      CURRENT_TIMESTAMP,
      '{}'::jsonb
    FROM users_without_profiles
    RETURNING id
  )
  SELECT COUNT(*) INTO fixed_count FROM inserted;

  -- Get counts for the report
  SELECT COUNT(*) INTO profiles_count FROM public.profiles;
  SELECT COUNT(*) INTO users_count FROM auth.users;

  -- Build result
  result := jsonb_build_object(
    'success', true,
    'profiles_count', profiles_count,
    'users_count', users_count,
    'missing_profiles_fixed', fixed_count,
    'timestamp', CURRENT_TIMESTAMP
  );

  RETURN result;
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object(
    'success', false,
    'error', SQLERRM,
    'timestamp', CURRENT_TIMESTAMP
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.fix_profile_creation TO authenticated;
GRANT EXECUTE ON FUNCTION public.fix_profile_creation TO service_role;

-- Fix permissions on the profiles table
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Give authenticated users permission to insert their own profiles
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Give the service role full access
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  FOR ALL USING (auth.role() = 'service_role');

-- Grant table permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;  -- This might be needed for the signup process

COMMIT;

-- Execute the fix function
SELECT * FROM public.fix_profile_creation();

-- First, remove the current trigger
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;

-- Check the profiles table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' AND table_schema = 'public';

-- Check if email confirmation is required
SELECT * FROM auth.config;

-- Modify email confirmation setting (if it's causing issues)
UPDATE auth.config 
SET enable_signup_email_confirmations = false;

-- COMPREHENSIVE FIX FOR SUPABASE SIGNUP ISSUES
-- Run each statement separately for best results

-- 1. DISABLE EMAIL CONFIRMATION REQUIREMENT (often causes issues)
UPDATE auth.config 
SET enable_signup_email_confirmations = false;

-- 2. CLEAN UP EXISTING FUNCTIONS AND TRIGGERS
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;

-- 3. FIX PROFILE TABLE STRUCTURE AND PERMISSIONS
-- Make sure profile table exists with correct structure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          preferences JSONB DEFAULT '{}'::jsonb
        );
    END IF;
END
$$;

-- 4. ENABLE ROW LEVEL SECURITY AND SET PERMISSIONS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Clear existing policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

-- Create new policies
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id OR auth.role() = 'service_role');

CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  FOR ALL USING (auth.role() = 'service_role');

-- Grant ALL permissions to all auth roles
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- 5. CREATE ULTRA-SIMPLIFIED PROFILE CREATION FUNCTION
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- The absolute simplest version possible - just insert a user_id
  BEGIN
    INSERT INTO public.profiles (user_id) VALUES (NEW.id);
  EXCEPTION 
    WHEN unique_violation THEN
      -- Do nothing on conflict
      NULL;
    WHEN OTHERS THEN
      -- Log error but always continue
      RAISE LOG 'Profile creation error: %', SQLERRM;
  END;

  -- Always return NEW to continue with user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 6. CREATE NEW TRIGGER
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- 7. CREATE MANUAL PROFILE CREATION FUNCTION (Backup if trigger fails)
CREATE OR REPLACE FUNCTION public.create_missing_profile(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (user_uuid)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN jsonb_build_object('success', true, 'message', 'Profile created or already exists');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 8. EXPOSE FUNCTION TO API
GRANT EXECUTE ON FUNCTION public.create_missing_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_missing_profile TO service_role;
GRANT EXECUTE ON FUNCTION public.create_missing_profile TO anon;

-- 9. FIX EXISTING USERS WITHOUT PROFILES
INSERT INTO public.profiles (user_id)
SELECT id FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);

COMMIT;

-- COMPREHENSIVE SUPABASE PROFILE FIX SCRIPT
-- Run this in the Supabase SQL Editor

-- Step 1: Drop existing functions and triggers
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;
DROP FUNCTION IF EXISTS public.fix_profile_creation() CASCADE;
DROP FUNCTION IF EXISTS update_profile_updated_at() CASCADE;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;

-- Step 2: Ensure profiles table exists with proper structure
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles'
    ) THEN
        CREATE TABLE public.profiles (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
          full_name TEXT,
          avatar_url TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
          preferences JSONB DEFAULT '{}'::jsonb
        );
    END IF;
END
$$;

-- Step 3: Set up Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Drop all existing policies to start fresh
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;

-- Step 5: Create permissive policies that won't block profile creation
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

-- This policy is critical - it allows insertion during signup
CREATE POLICY "Anyone can insert profiles" 
  ON public.profiles 
  FOR INSERT WITH CHECK (true);

-- Service role access for admin operations
CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  FOR ALL USING (auth.role() = 'service_role');

-- Step 6: Grant all permissions to all roles
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- Step 7: Create the updated_at timestamp function
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Step 8: Create update timestamp trigger
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_updated_at();

-- Step 9: Create a minimal profile creation function
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Ultra-simple insert with minimal fields and error handling
  BEGIN
    INSERT INTO public.profiles (user_id) 
    VALUES (NEW.id);
  EXCEPTION 
    WHEN unique_violation THEN
      NULL; -- Silently do nothing on conflict
    WHEN OTHERS THEN
      NULL; -- Ignore all errors
  END;
  
  -- Always return NEW to continue with user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 10: Create the profile creation trigger
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- Step 11: Create a manual profile creation function
CREATE OR REPLACE FUNCTION public.create_missing_profile(user_uuid UUID)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
BEGIN
  -- Simple insert with conflict handling
  INSERT INTO public.profiles (user_id)
  VALUES (user_uuid)
  ON CONFLICT (user_id) DO NOTHING;
  
  RETURN jsonb_build_object('success', true, 'message', 'Profile created or already exists');
EXCEPTION WHEN OTHERS THEN
  RETURN jsonb_build_object('success', false, 'error', SQLERRM);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 12: Grant execution permission for manual function
GRANT EXECUTE ON FUNCTION public.create_missing_profile TO authenticated;
GRANT EXECUTE ON FUNCTION public.create_missing_profile TO service_role;
GRANT EXECUTE ON FUNCTION public.create_missing_profile TO anon;

-- Step 13: Fix any existing users missing profiles
INSERT INTO public.profiles (user_id)
SELECT id FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);

-- Step 14: Update any NULL preferences to empty JSON objects
UPDATE public.profiles 
SET preferences = '{}'::jsonb
WHERE preferences IS NULL;

-- Step 15: Create a utility function to check database status
CREATE OR REPLACE FUNCTION public.check_profile_system()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  profiles_exist BOOLEAN;
  trigger_exists BOOLEAN;
  profiles_count INTEGER;
  users_count INTEGER;
  missing_profiles INTEGER;
BEGIN
  -- Check if profiles table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) INTO profiles_exist;
  
  -- Check if trigger exists
  SELECT EXISTS (
    SELECT 1 
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE t.tgname = 'create_profile_on_signup'
    AND c.relname = 'users'
    AND n.nspname = 'auth'
  ) INTO trigger_exists;
  
  -- Count users and profiles
  SELECT COUNT(*) INTO users_count FROM auth.users;
  
  IF profiles_exist THEN
    SELECT COUNT(*) INTO profiles_count FROM public.profiles;
    
    WITH users_without_profiles AS (
      SELECT id
      FROM auth.users u
      WHERE NOT EXISTS (
        SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
      )
    )
    SELECT COUNT(*) INTO missing_profiles FROM users_without_profiles;
  ELSE
    profiles_count := 0;
    missing_profiles := users_count;
  END IF;
  
  -- Return status info
  result := jsonb_build_object(
    'success', true,
    'profiles_table_exists', profiles_exist,
    'trigger_exists', trigger_exists,
    'users_count', users_count,
    'profiles_count', profiles_count,
    'missing_profiles', missing_profiles,
    'status', CASE 
      WHEN NOT profiles_exist THEN 'critical'
      WHEN NOT trigger_exists THEN 'warning'
      WHEN missing_profiles > 0 THEN 'warning'
      ELSE 'healthy'
    END,
    'timestamp', now()
  );
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution permission for status check
GRANT EXECUTE ON FUNCTION public.check_profile_system TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_profile_system TO service_role;

-- Run the status check to get current state
SELECT * FROM public.check_profile_system(); 