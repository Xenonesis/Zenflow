# Supabase Setup Guide

This guide will help you set up the Supabase database for the Mindful Wellbeing Dashboard application.

## Prerequisites

- Supabase account and a project created at [https://supabase.com](https://supabase.com)
- Your Supabase project URL and API keys

## Database Setup

To set up the database:

1. Log in to the Supabase dashboard
2. Navigate to your project
3. Go to the SQL Editor
4. Copy the contents of the `scripts/init-supabase.sql` file and paste it into the SQL Editor
5. Execute the SQL script

This will create the following tables:

- `profiles`: For user profile information
- `health_metrics`: For storing various health metrics
- `workouts`: For tracking workout sessions
- `mood_entries`: For tracking mood and mental wellbeing

## Authentication Setup

The application uses Supabase Authentication. It's already set up out of the box, but you may want to configure the following:

1. Go to Authentication > Settings
2. Ensure Email Auth is enabled
3. Configure the Site URL to match your production URL
4. Customize email templates if needed

## Environment Variables

Add the following environment variables to your project:

```
VITE_SUPABASE_URL=https://ztrtdfkkwmhdeszjuwrp.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cnRkZmtrd21oZGVzemp1d3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTY5MjEsImV4cCI6MjA2MTk3MjkyMX0.6Z3gLkgDUhPoW1hVBQ0zeTdzwirz090otyjeAMjvfb8
```

## Row Level Security (RLS)

The SQL script sets up Row Level Security (RLS) policies to ensure that users can only:

- View and modify their own profile data
- Create, read, update, and delete their own health metrics
- Create, read, update, and delete their own workout records
- Create, read, update, and delete their own mood entries

## Database Schema

### Profiles Table

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `full_name`: Text
- `avatar_url`: Text
- `preferences`: JSONB
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Health Metrics Table

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `metric_type`: Text (e.g., 'weight', 'steps', 'sleep', etc.)
- `value`: Decimal
- `unit`: Text
- `notes`: Text
- `recorded_at`: Timestamp
- `created_at`: Timestamp

### Workouts Table

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `name`: Text
- `workout_type`: Text
- `duration`: Integer (minutes)
- `calories_burned`: Integer
- `intensity`: Text ('low', 'medium', 'high')
- `notes`: Text
- `recorded_at`: Timestamp
- `created_at`: Timestamp

### Mood Entries Table

- `id`: UUID (Primary Key)
- `user_id`: UUID (Foreign Key to auth.users)
- `mood_score`: Integer (1-10)
- `mood_label`: Text
- `factors`: Text Array
- `notes`: Text
- `recorded_at`: Timestamp
- `created_at`: Timestamp

## Automatic Profile Creation

The database is set up with a trigger that automatically creates a profile entry when a new user signs up. This ensures that each user has a profile record ready to be updated.

## Indexes

The database has indexes set up on frequently queried columns to ensure good performance:

- User IDs in all tables
- Recording timestamps in all tables
- Metric types in the health metrics table 