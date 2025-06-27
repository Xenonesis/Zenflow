# How to Fix the "Database error saving new user" Issue

This guide explains how to solve the persistent signup error in the Mindful Wellbeing Dashboard.

## The Issue

When new users attempt to sign up, they encounter a 500 Internal Server Error with the message:
```
AuthApiError: Database error saving new user
```

This happens because Supabase's automatic profile creation trigger is not working correctly.

## Solution 1: Client-Side Fix (Latest Improvements)

The latest version of the application includes a robust client-side fix in `src/lib/supabase.ts` that:

1. Creates the user account normally 
2. If the database error occurs, tries an alternative signup approach with minimal options
3. Then manually creates a profile record using upsert operations
4. Includes retry logic with exponential backoff to handle temporary issues
5. Uses comprehensive error handling to ensure the signup succeeds even if there are database issues

This solution should work automatically with no additional steps required.

## Solution 2: Improved SignUp Form

The signup form now has built-in resilience:

1. Automatically retries failed signups up to 2 times with a delay
2. Provides a clear error message if problems persist
3. Includes a direct "Apply Database Fix" button that takes the user to the admin page to run the fix

## Solution 3: Admin Dashboard Fix

If users are still experiencing issues:

1. Log in with an existing admin account
2. Navigate to the Admin Dashboard at `/admin`
3. Click the "Apply Direct Fix (Bypass Triggers)" button
4. This will:
   - Remove potentially problematic database triggers
   - Set permissive Row Level Security policies
   - Ensure all users have corresponding profiles

You can also access this fix directly via `/admin?action=fix_profiles` which will automatically run the fix.

## Solution 4: Manual Database Fix

If all other solutions fail, you can directly fix the database:

1. Log in to the Supabase dashboard
2. Go to the SQL Editor
3. Run this SQL script:

```sql
-- Drop problematic triggers
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;

-- Create permissive RLS policies
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
CREATE POLICY "Anyone can insert profiles" 
  ON public.profiles 
  FOR INSERT WITH CHECK (true);

-- Grant full permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- Fix any missing profiles
INSERT INTO public.profiles (user_id)
SELECT id FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);
```

## Verification

After applying any of these fixes:
1. Try creating a new test user account
2. If signup succeeds, the issue is fixed
3. You can check that a profile was created by querying the `profiles` table

## Troubleshooting

If you're still encountering issues:

1. Clear browser cache and localStorage
2. Try using a private/incognito window
3. Check the browser console for detailed error messages
4. Review your Supabase project settings to ensure email confirmations are properly configured
5. Check the Supabase logs for any additional error details

If issues persist, please contact support for further assistance. 