# Profiles Table Setup for ZenFlow

This document explains how to set up the profiles table required for the ZenFlow app, including the bio field functionality.

## Problem

The error `relation "public.profiles" does not exist` indicates that the profiles table hasn't been created in your Supabase database. This is a fundamental table required by the application.

## Solution

The `create-profiles-table.sql` script creates:

1. The base profiles table with all required columns
2. Row Level Security (RLS) policies for proper data protection
3. Automatic triggers for updating timestamps and creating profiles for new users
4. The bio functionality through the preferences JSONB column
5. A view for easily accessing profile data with the bio field

## How to Run the Setup Script

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the `create-profiles-table.sql` file 
4. Paste the contents into a new SQL query in the Supabase SQL Editor
5. Run the query

## What the Script Does

The script:

- Creates the profiles table with all necessary columns (if it doesn't exist)
- Sets up appropriate data constraints for fields like blood_group and gender
- Enables Row Level Security (RLS) for proper data protection
- Creates policies to ensure users can only access their own profiles
- Adds a trigger to automatically update the `updated_at` timestamp
- Creates a trigger to automatically create a profile when a new user signs up
- Sets up the preferences column for storing the bio and other user preferences
- Creates a convenience view for easily accessing profile data with the bio field
- Grants necessary permissions to authenticated users

## Verification

After running the script, you can verify the table was created by running:

```sql
SELECT * FROM public.profiles LIMIT 10;
```

You should also check if the automatic profile creation works by creating a new user and then checking if a corresponding profile was created.

## Using the Bio Field

Once the profiles table is set up, the bio functionality will work automatically through the Settings page in the application. The bio data is stored in the `preferences.bio` field in the database.

## Troubleshooting

If you encounter any errors:

1. **Permission issues**: Make sure your database user has the proper permissions
2. **Syntax errors**: The script is written for PostgreSQL as used by Supabase, other databases may need syntax adjustments
3. **Existing objects**: If some objects already exist, you might see warnings which can generally be ignored

## For Existing Users

If you already have users in your auth.users table but no profiles, you'll need to create profiles for them. You can do this by running:

```sql
INSERT INTO public.profiles (user_id)
SELECT id FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);
```

This will create profiles for any existing users who don't already have one. 