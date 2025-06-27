# Database Troubleshooting Guide

This document provides solutions for common issues that might arise when setting up or working with the database for the Mindful Wellbeing Dashboard.

## Common Error Messages and Solutions

### 1. Policy Already Exists Error

**Error Message:**
```
ERROR: 42710: policy "Users can view their own health activities" for table "health_activities" already exists
```

**Cause:**
This error occurs when you try to create a policy with a name that already exists for a table. This typically happens when:
- Running setup scripts multiple times
- Running different setup scripts that create the same policies
- Trying to recreate policies without dropping the existing ones first

**Solution:**
Run the `fix-policy-conflict.sql` script to drop existing policies before recreating them:

```sql
-- Navigate to SQL Editor in Supabase
-- Run this script to fix policy conflicts:

DROP POLICY IF EXISTS "Users can view their own health activities" ON public.health_activities;
DROP POLICY IF EXISTS "Users can insert their own health activities" ON public.health_activities;
DROP POLICY IF EXISTS "Users can update their own health activities" ON public.health_activities;
DROP POLICY IF EXISTS "Users can delete their own health activities" ON public.health_activities;

-- Then recreate the policies
CREATE POLICY "Users can view their own health activities" 
  ON public.health_activities 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own health activities" 
  ON public.health_activities 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own health activities" 
  ON public.health_activities 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own health activities" 
  ON public.health_activities 
  FOR DELETE USING (auth.uid() = user_id);
```

**Prevention:**
To prevent this issue in the future, always use the `DROP POLICY IF EXISTS` statement before creating a policy. The updated database setup script `complete-db-setup-updated.sql` includes these statements to prevent policy conflicts.

### 2. Table Already Exists Error

**Error Message:**
```
ERROR: 42P07: relation "table_name" already exists
```

**Cause:**
This error occurs when a table creation script is run multiple times without checking if the table already exists.

**Solution:**
Always use `CREATE TABLE IF NOT EXISTS` syntax, which all our setup scripts now use.

### 3. Function or Trigger Already Exists Error

**Error Message:**
```
ERROR: 42723: function "function_name" already exists with same argument types
```

**Cause:**
Attempting to create a function or trigger that already exists.

**Solution:**
Use `CREATE OR REPLACE FUNCTION` for functions and `DROP TRIGGER IF EXISTS` before creating triggers.

## Best Practices for Database Scripts

1. **Always use idempotent scripts** - Scripts should be safely runnable multiple times without causing errors. This means:
   - Using `IF NOT EXISTS` when creating tables
   - Using `DROP ... IF EXISTS` before creating policies, triggers, etc.
   - Using `CREATE OR REPLACE` for functions and procedures

2. **Test scripts in a development environment first** - Before running scripts in production, test them in a development environment to catch any potential issues.

3. **Run scripts in transactions** - Wrap script execution in transactions so that if an error occurs, all changes are rolled back:

```sql
BEGIN;
-- Your SQL statements here
COMMIT;
```

4. **Use the error recovery script** - If you encounter policy conflicts or other issues, use the dedicated error recovery script (`fix-policy-conflict.sql`) to resolve them.

## Using the Updated Database Setup Script

For new setups or to completely reset the database, use the `complete-db-setup-updated.sql` script, which includes:
- Checks for existing objects before creating new ones
- Drops existing policies before creating new ones
- Uses idempotent statements throughout to prevent conflicts

## Continuous Database Improvements

1. **Monitor database performance** - Regularly check query performance and add indexes as needed
2. **Update RLS policies as requirements change** - Ensure security policies are kept up to date
3. **Consider database migrations for schema changes** - As the application evolves, use proper migration strategies
4. **Keep error handling documentation updated** - When new errors are encountered, add them to this troubleshooting guide 