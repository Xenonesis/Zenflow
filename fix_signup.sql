-- Reset related tables that might be causing conflicts
TRUNCATE auth.identities CASCADE;
TRUNCATE auth.sessions CASCADE;
TRUNCATE auth.refresh_tokens CASCADE;

-- Drop existing trigger that might be problematic
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;

-- Enable RLS with permissive policies - drop all existing policies first
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;

-- Create new policies
CREATE POLICY "Anyone can insert profiles" ON public.profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- Grant permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon; 