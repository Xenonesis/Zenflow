# Supabase Profile Creation Fix

This document explains the solution to the "Database error saving new user" issue that occurs during signup.

## Problem Description

When a new user tries to sign up, they encounter a 500 Internal Server Error with the message:

```
AuthApiError: Database error saving new user
```

This happens because:

1. When a user signs up through Supabase Auth, it attempts to create a record in the `auth.users` table
2. A database trigger is supposed to automatically create a corresponding record in the `profiles` table
3. This trigger is either missing, misconfigured, or encountering errors during execution

## Solution Components

We've implemented a comprehensive solution with multiple layers of protection:

### 1. Improved Signup Function

The `signUp` function in `src/lib/supabase.ts` has been enhanced to:

- Add retry logic for transient server errors
- Explicitly create the profile record if the automatic trigger fails
- Provide better error handling and reporting

### 2. Database Fix Scripts

We've created SQL scripts that can be run to fix the database configuration:

- `scripts/fix-profiles-auto-creation.sql`: A standalone script that fixes the profile creation trigger
- `scripts/create-fix-profile-function.sql`: Creates a stored function in Supabase that can be called to fix the issues
- `scripts/create-helper-functions.sql`: Adds utility functions to check database status

### 3. Admin Dashboard

An Admin Dashboard has been added at `/admin` with tools to:

- Run the profile creation fix directly from the UI
- View database status information
- Diagnose and fix common issues

## How to Apply the Fix

### Option 1: SQL Editor (Recommended for Initial Setup)

1. Log in to your Supabase dashboard
2. Go to the SQL Editor
3. Run `scripts/create-helper-functions.sql` first
4. Then run `scripts/create-fix-profile-function.sql`
5. Finally, run the fix by calling the function:
   ```sql
   SELECT * FROM public.fix_profile_creation();
   ```

### Option 2: Admin Dashboard

1. Apply Option 1 first to install the necessary functions
2. Log in to the application
3. Navigate to the Admin page (/admin)
4. Use the "Fix Profile Creation" button

### Option 3: Improved Signup Code

The improved signup code in `src/lib/supabase.ts` will automatically attempt to create profiles if the trigger fails, providing a fallback mechanism.

## Verification

To verify the fix was successfully applied:

1. Check if the trigger exists by running:
   ```sql
   SELECT * FROM public.check_database_status();
   ```
2. Try signing up a new test user
3. Verify that no errors occur and a profile record is created

## Additional Notes

- This solution provides a permanent fix to the profile creation issue by enhancing both the client-side code and the database setup
- The implementation is resilient to failures and includes multiple fallback mechanisms
- Database functions are designed with security in mind, using `SECURITY DEFINER` to ensure proper permission handling 