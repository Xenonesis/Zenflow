# Database Setup for Mindful Wellbeing Dashboard

This document explains the database schema and setup for the Mindful Wellbeing Dashboard application.

## Overview

The application uses Supabase as the backend database service. Supabase provides:
- PostgreSQL database
- Authentication and authorization
- Row-level security
- Realtime subscriptions

## Database Schema

The database schema consists of the following tables:

### 1. profiles
Stores user profile information:
- Basic user info (name, avatar, email)
- Health metrics (height, weight)
- Preferences and settings
- Streak tracking

### 2. mood_entries
Tracks user mood data:
- Mood score (1-10)
- Mood label (terrible, bad, poor, neutral, good, great, excellent)
- Factors affecting mood
- Notes

### 3. self_care_activities
Records self-care activities:
- Activity type (meditation, sleep, reflection, exercise, reading)
- Duration
- Start and end times
- Notes

### 4. meditation_sessions
Stores meditation session data:
- Duration
- Type (guided or not)
- Audio reference
- Start and end times

### 5. journal_entries
Manages journal entries:
- Title and content
- Tags
- Associated mood entry
- Creation and update timestamps

### 6. exercise_sessions
Tracks workout and exercise data:
- Exercise type
- Duration
- Calories burned
- Intensity level

### 7. sleep_logs
Records sleep patterns:
- Sleep duration
- Sleep quality
- Sleep interruptions
- Dream notes
- Factors affecting sleep

### 8. daily_tasks
Manages daily tasks and to-dos:
- Task title and description
- Due date
- Completion status
- Priority level

### 9. wellness_trends
Aggregates wellness data for trends and analytics:
- Daily mood averages
- Meditation minutes
- Exercise minutes
- Sleep hours
- Journal activity
- Self-care minutes

## Setting Up the Database

### Prerequisites
1. Create a Supabase account at [https://supabase.com](https://supabase.com)
2. Create a new project

### Setup Steps

1. **Initialize the Database**
   
   Run the SQL script in the Supabase SQL Editor:
   ```
   Navigate to your Supabase project > SQL Editor > New query
   Copy and paste the content of scripts/complete-db-setup.sql
   Click 'Run'
   ```

2. **Configure Environment Variables**
   
   Add the following to your `.env` file:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

3. **Test the Connection**
   
   Run the test script to ensure your connection works:
   ```
   npm run test:db
   ```

## Security

The database is configured with Row Level Security (RLS) to ensure:

- Users can only access their own data
- All tables have appropriate INSERT, SELECT, UPDATE, and DELETE policies
- User data is isolated and protected

## Database Services

The application interacts with the database through the `DatabaseService` class, which provides methods for:

- Retrieving user profiles
- Tracking mood data
- Managing self-care activities
- Recording meditation sessions
- Creating journal entries
- Logging exercise activities
- Tracking sleep patterns
- Managing daily tasks
- Analyzing wellness trends

## Data Types

TypeScript type definitions for all database tables are available in `src/types/database.types.ts`.

## Maintenance and Optimization

The database includes:
- Appropriate indexes for frequently queried columns
- Constraints to maintain data integrity
- Triggers for automatic timestamps and profile creation
- Functions for transaction management 