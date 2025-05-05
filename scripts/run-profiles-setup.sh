#!/bin/bash

# Script to run the profiles table setup SQL migration
# Requires the Supabase CLI to be installed and authenticated

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI is not installed."
    echo "Please install it first: https://supabase.com/docs/reference/cli/installing-and-updating"
    exit 1
fi

# Path to the SQL file
SQL_FILE="./create-profiles-table.sql"

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "Error: SQL file not found at $SQL_FILE"
    exit 1
fi

echo "Running profiles table setup migration..."

# Run the SQL file against the connected Supabase project
supabase db execute --file "$SQL_FILE"

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Migration completed successfully!"
    echo "The profiles table has been created and configured."
    
    # Check if the profiles table exists by querying it
    echo "Verifying profiles table exists..."
    VERIFY_RESULT=$(supabase db execute --cmd "SELECT COUNT(*) FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'profiles'")
    
    if [[ "$VERIFY_RESULT" == *"1"* ]]; then
        echo "✅ Profiles table verified!"
        
        # Create profiles for existing users if needed
        echo "Creating profiles for any existing users without profiles..."
        supabase db execute --cmd "INSERT INTO public.profiles (user_id) SELECT id FROM auth.users u WHERE NOT EXISTS (SELECT 1 FROM public.profiles p WHERE p.user_id = u.id);"
        echo "Setup complete!"
    else
        echo "❌ WARNING: Table verification failed. The SQL might have had errors."
        echo "Please check the Supabase SQL logs for more details."
    fi
else
    echo "Error: Migration failed."
    echo "Please check the error messages above."
fi 