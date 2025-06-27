# Bio Field for User Profiles

This document explains how to set up and use the bio field for user profiles in the ZenFlow app.

## About the Bio Field

The bio field allows users to add a personal description to their profile. The bio is stored in the `preferences` JSONB column of the `profiles` table in the database.

## Database Setup

The script `ensure-preferences-for-bio.sql` ensures that:

1. All user profiles have a `preferences` column to store the bio
2. Any null values in the preferences column are converted to empty objects
3. A GIN index is created for faster querying of the preferences column
4. A convenience view `profiles_with_bio` is created to easily access the bio field

### How to Run the Setup Script

1. Log in to your Supabase dashboard
2. Navigate to the SQL Editor
3. Copy the contents of the `ensure-preferences-for-bio.sql` file 
4. Paste the contents into a new SQL query in the Supabase SQL Editor
5. Run the query

### Troubleshooting

If you encounter errors when running the script, they may be related to:

- **Row Level Security (RLS)**: The script no longer attempts to enable RLS on the view directly, as views inherit RLS from their underlying tables.
- **Permissions**: If you encounter permission issues, make sure your database user has the necessary privileges.
- **Syntax compatibility**: If you're not using Supabase or are using a different PostgreSQL version, some syntax may need adjustment.

### Verification

After running the script, you can verify the changes by running:

```sql
SELECT id, user_id, preferences 
FROM profiles 
LIMIT 10;
```

This will show the preferences column for the first 10 profiles.

You can also check if any user has already set a bio:

```sql
SELECT id, user_id, preferences->>'bio' as bio 
FROM profiles 
WHERE preferences->>'bio' IS NOT NULL;
```

To test the view:

```sql
SELECT * FROM profiles_with_bio LIMIT 5;
```

## Using the Bio Field in the Application

The application already has UI elements to display and edit the bio field in the Settings page. When users update their bio, it's saved in the `preferences.bio` path in the database.

### Accessing the Bio in Code

To get the bio from a user profile:

```typescript
const bio = userProfile.preferences?.bio || '';
```

To update the bio:

```typescript
const updates = {
  preferences: {
    ...profile?.preferences,
    bio: newBioValue
  }
};
await userData.updateUserProfile(userId, updates);
```

## Security Notes

- The `profiles_with_bio` view inherits row-level security (RLS) from the underlying `profiles` table
- Access control is maintained by the existing RLS policies on the `profiles` table
- The view is read-only; all updates must be made to the base table

## Additional Notes

- The preferences column is a JSONB type, which means it can store any JSON object
- You can use this same pattern to add other user preferences without altering the database schema
- The `profiles_with_bio` view provides a convenient way to query profiles with the bio field extracted 