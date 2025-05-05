#!/bin/bash

# Script to run the bio field setup SQL migration
# Requires the Supabase CLI to be installed and authenticated

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI is not installed."
    echo "Please install it first: https://supabase.com/docs/reference/cli/installing-and-updating"
    exit 1
fi

# Path to the SQL file
SQL_FILE="./ensure-preferences-for-bio.sql"

# Check if the SQL file exists
if [ ! -f "$SQL_FILE" ]; then
    echo "Error: SQL file not found at $SQL_FILE"
    exit 1
fi

echo "Running bio field setup migration..."

# Run the SQL file against the connected Supabase project
supabase db execute --file "$SQL_FILE"

# Check if the command was successful
if [ $? -eq 0 ]; then
    echo "Migration completed successfully!"
    echo "You can now use the bio field in your application."
else
    echo "Error: Migration failed."
    echo "Please check the error messages above."
fi 