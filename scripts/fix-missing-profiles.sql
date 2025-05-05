-- Fix missing or corrupt profiles
-- Run this script in the Supabase SQL Editor

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
    ELSE
        RAISE NOTICE 'The profiles table exists.';
    END IF;
END
$$;

-- Create profiles for existing users who don't have one
INSERT INTO public.profiles (user_id)
SELECT id FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);

-- Fix any NULL preferences fields (should be empty JSON objects)
UPDATE public.profiles
SET preferences = '{}'::jsonb
WHERE preferences IS NULL;

-- Create the auto-update function and trigger separately

-- First create the function
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $func$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Then check if trigger exists and create it if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_trigger
        WHERE tgname = 'update_profiles_updated_at'
    ) THEN
        RAISE NOTICE 'Creating updated_at trigger...';
        
        -- Create the trigger
        CREATE TRIGGER update_profiles_updated_at
        BEFORE UPDATE ON public.profiles
        FOR EACH ROW
        EXECUTE FUNCTION update_profile_updated_at();
    END IF;
END
$$;

-- Create the auto-profile-creation function separately
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $func$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$func$ LANGUAGE plpgsql;

-- Then check if trigger exists and create it if needed
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_trigger
        WHERE tgname = 'create_profile_on_signup'
    ) THEN
        RAISE NOTICE 'Creating auto-profile creation trigger...';
        
        -- Create the trigger
        CREATE TRIGGER create_profile_on_signup
        AFTER INSERT ON auth.users
        FOR EACH ROW
        EXECUTE FUNCTION public.create_profile_for_new_user();
    END IF;
END
$$;

-- Fix permissions
GRANT ALL ON public.profiles TO authenticated;

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'Profile fixes completed.';
END
$$; 