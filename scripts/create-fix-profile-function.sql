-- Create a secure function to fix profile issues
-- Run this in the Supabase SQL Editor

-- Function to check if a trigger exists
CREATE OR REPLACE FUNCTION public.check_if_trigger_exists(
  trigger_name TEXT,
  table_name TEXT,
  schema_name TEXT DEFAULT 'public'
) RETURNS BOOLEAN AS $$
DECLARE
  trigger_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM pg_trigger t
    JOIN pg_class c ON t.tgrelid = c.oid
    JOIN pg_namespace n ON c.relnamespace = n.oid
    WHERE t.tgname = trigger_name
    AND c.relname = table_name
    AND n.nspname = schema_name
  ) INTO trigger_exists;
  
  RETURN trigger_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant access to the function
GRANT EXECUTE ON FUNCTION public.check_if_trigger_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_if_trigger_exists TO service_role;

-- Function to fix profiles
CREATE OR REPLACE FUNCTION public.fix_profile_creation()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  profiles_exist BOOLEAN;
  trigger_exists BOOLEAN;
  profiles_count INTEGER;
  users_count INTEGER;
  fixed_count INTEGER := 0;
BEGIN
  -- Check if profiles table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) INTO profiles_exist;
  
  -- If profiles table doesn't exist, create it
  IF NOT profiles_exist THEN
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
  END IF;

  -- Create or replace policies
  DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
  DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

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

  -- Fix the profile creation trigger
  -- First, check if it exists
  SELECT public.check_if_trigger_exists(
    'create_profile_on_signup',
    'users',
    'auth'
  ) INTO trigger_exists;
  
  -- Drop existing function and trigger
  DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;
  
  -- Create improved function
  CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
  RETURNS TRIGGER AS $$
  DECLARE
    profile_id UUID;
  BEGIN
    -- Generate a new UUID for the profile if needed
    profile_id := NEW.id;
    
    -- Insert with comprehensive error handling
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
    
    -- Always return NEW to allow user creation to proceed
    RETURN NEW;
  END;
  $$ LANGUAGE plpgsql SECURITY DEFINER;

  -- Create the trigger
  DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
  
  CREATE TRIGGER create_profile_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.create_profile_for_new_user();

  -- Fix permissions
  GRANT ALL ON public.profiles TO authenticated;
  GRANT ALL ON public.profiles TO service_role;
  GRANT ALL ON public.profiles TO anon;

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
    'profiles_table_exists', profiles_exist,
    'trigger_installed', trigger_exists,
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