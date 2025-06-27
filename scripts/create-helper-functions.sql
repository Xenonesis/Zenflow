-- Helper functions for database maintenance
-- Run in Supabase SQL Editor

-- Function to check if a specific function exists
CREATE OR REPLACE FUNCTION public.check_if_function_exists(
  function_name TEXT
) RETURNS BOOLEAN AS $$
DECLARE
  func_exists BOOLEAN;
BEGIN
  SELECT EXISTS (
    SELECT 1 
    FROM pg_proc p
    JOIN pg_namespace n ON p.pronamespace = n.oid
    WHERE p.proname = function_name
    AND n.nspname = 'public'
  ) INTO func_exists;
  
  RETURN func_exists;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.check_if_function_exists TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_if_function_exists TO service_role;

-- Function to check database status
CREATE OR REPLACE FUNCTION public.check_database_status()
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  profiles_exist BOOLEAN;
  users_count INTEGER;
  profiles_count INTEGER;
  missing_profiles INTEGER;
  trigger_exists BOOLEAN;
BEGIN
  -- Check if profiles table exists
  SELECT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public' 
    AND table_name = 'profiles'
  ) INTO profiles_exist;
  
  -- Get user and profile counts
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
  
  -- Build result object
  result := jsonb_build_object(
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

-- Grant execution permissions
GRANT EXECUTE ON FUNCTION public.check_database_status TO authenticated;
GRANT EXECUTE ON FUNCTION public.check_database_status TO service_role; 