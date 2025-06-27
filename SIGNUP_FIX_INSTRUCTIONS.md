# How to Fix the Signup Error

The error you're experiencing is:
```
Database error saving new user
```

This is a known issue with the Supabase project configuration. Here are two ways to fix it:

## Option 1: Use the built-in fix tool

1. Navigate to `/setup?action=fix_profiles` in your application
2. The automatic fix will run and repair the database configuration
3. Try signing up again after this is complete

## Option 2: Apply the fix manually in Supabase

1. Log into your Supabase dashboard: https://supabase.com/dashboard
2. Select your project: "ztrtdfkkwmhdeszjuwrp"
3. Go to the SQL Editor
4. Run the following SQL commands:

```sql
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
```

**Note:** The first option is safer and recommended. The second option will reset all active sessions, which means all users will need to log in again.

## Technical Explanation

The issue occurs because:

1. When users sign up, Supabase tries to create a user record in the `auth.users` table
2. After that, it should create a corresponding record in the `profiles` table
3. There's a database trigger or RLS policy blocking this process
4. The fix removes the problematic trigger and sets appropriate permissions

After applying the fix, profile creation will be handled on the client side in your application code. 