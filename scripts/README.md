# Database Migration Scripts

This directory contains SQL scripts to update the database schema.

## Update Profiles Table

The `update-profiles-table.sql` script adds the following fields to the user profile:

- `age` (integer)
- `blood_group` (text with constraint)
- `height` (decimal)
- `weight` (decimal)
- `gender` (text with constraint)

### How to Run the Migration

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Open the `update-profiles-table.sql` file from this directory
4. Copy the contents of the script
5. Paste the contents into a new SQL query in the Supabase SQL Editor
6. Run the query

### Verification

After running the migration, you can verify the changes by running:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'profiles' 
ORDER BY column_name;
```

This will list all columns in the profiles table with their data types.

## Set Up Storage for Profile Images

The `migrations/create-storage-bucket.sql` script creates a storage bucket for profile images and sets up the necessary policies for:

- Public read access to all profile images
- Authenticated user upload access to their own folder
- Update and delete permissions for users' own files

### How to Run the Storage Setup

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Open the `migrations/create-storage-bucket.sql` file from this directory
4. Copy the contents of the script
5. Paste the contents into a new SQL query in the Supabase SQL Editor
6. Run the query

### Verification

After running the migration, you can verify the storage bucket was created:

1. Go to the Storage section in your Supabase dashboard
2. You should see an 'avatars' bucket in the list
3. Check that the bucket has public access enabled
4. Check the policies tab to ensure the correct policies are applied 