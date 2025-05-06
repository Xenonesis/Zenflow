-- Complete Database Setup for Mindful Wellbeing Dashboard (Updated)
-- This script creates all necessary tables and relationships
-- With DROP POLICY statements to prevent conflicts

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create or update profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT,
  age INTEGER,
  blood_group TEXT,
  height DECIMAL,
  weight DECIMAL,
  gender TEXT,
  preferences JSONB DEFAULT '{}'::JSONB,
  streak_count INTEGER DEFAULT 0,
  last_streak_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anyone policy is critical for signup flow
CREATE POLICY "Anyone can insert profiles" 
  ON public.profiles 
  FOR INSERT WITH CHECK (true);

-- Service role policy for admin operations
CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  FOR ALL USING (auth.role() = 'service_role');

-- Create mood_entries table for mood tracking
CREATE TABLE IF NOT EXISTS public.mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score >= 1 AND mood_score <= 10),
  mood_label TEXT CHECK (mood_label IN ('terrible', 'bad', 'poor', 'neutral', 'good', 'great', 'excellent')),
  factors TEXT[],
  notes TEXT,
  recorded_at TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for mood_entries
ALTER TABLE public.mood_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users can insert their own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users can update their own mood entries" ON public.mood_entries;
DROP POLICY IF EXISTS "Users can delete their own mood entries" ON public.mood_entries;

-- Create RLS policies for mood_entries
CREATE POLICY "Users can view their own mood entries" 
  ON public.mood_entries 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own mood entries" 
  ON public.mood_entries 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own mood entries" 
  ON public.mood_entries 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own mood entries" 
  ON public.mood_entries 
  FOR DELETE USING (auth.uid() = user_id);

-- Create self_care_activities table
CREATE TABLE IF NOT EXISTS public.self_care_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('meditation', 'sleep', 'reflection', 'exercise', 'reading', 'custom')),
  description TEXT,
  duration INTEGER, -- in minutes
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for self_care_activities
ALTER TABLE public.self_care_activities ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own self-care activities" ON public.self_care_activities;
DROP POLICY IF EXISTS "Users can insert their own self-care activities" ON public.self_care_activities;
DROP POLICY IF EXISTS "Users can update their own self-care activities" ON public.self_care_activities;
DROP POLICY IF EXISTS "Users can delete their own self-care activities" ON public.self_care_activities;

-- Create RLS policies for self_care_activities
CREATE POLICY "Users can view their own self-care activities" 
  ON public.self_care_activities 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own self-care activities" 
  ON public.self_care_activities 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own self-care activities" 
  ON public.self_care_activities 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own self-care activities" 
  ON public.self_care_activities 
  FOR DELETE USING (auth.uid() = user_id);

-- Create meditation_sessions table
CREATE TABLE IF NOT EXISTS public.meditation_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  guided BOOLEAN DEFAULT FALSE,
  audio_url TEXT,
  completed BOOLEAN DEFAULT FALSE,
  start_time TIMESTAMP WITH TIME ZONE,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for meditation_sessions
ALTER TABLE public.meditation_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own meditation sessions" ON public.meditation_sessions;
DROP POLICY IF EXISTS "Users can insert their own meditation sessions" ON public.meditation_sessions;
DROP POLICY IF EXISTS "Users can update their own meditation sessions" ON public.meditation_sessions;
DROP POLICY IF EXISTS "Users can delete their own meditation sessions" ON public.meditation_sessions;

-- Create RLS policies for meditation_sessions
CREATE POLICY "Users can view their own meditation sessions" 
  ON public.meditation_sessions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meditation sessions" 
  ON public.meditation_sessions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meditation sessions" 
  ON public.meditation_sessions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meditation sessions" 
  ON public.meditation_sessions 
  FOR DELETE USING (auth.uid() = user_id);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS public.journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  tags TEXT[],
  mood_id UUID REFERENCES public.mood_entries(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for journal_entries
ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can insert their own journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can update their own journal entries" ON public.journal_entries;
DROP POLICY IF EXISTS "Users can delete their own journal entries" ON public.journal_entries;

-- Create RLS policies for journal_entries
CREATE POLICY "Users can view their own journal entries" 
  ON public.journal_entries 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own journal entries" 
  ON public.journal_entries 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own journal entries" 
  ON public.journal_entries 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own journal entries" 
  ON public.journal_entries 
  FOR DELETE USING (auth.uid() = user_id);

-- Create exercise_sessions table
CREATE TABLE IF NOT EXISTS public.exercise_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  calories_burned INTEGER,
  intensity TEXT CHECK (intensity IN ('low', 'medium', 'high')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for exercise_sessions
ALTER TABLE public.exercise_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own exercise sessions" ON public.exercise_sessions;
DROP POLICY IF EXISTS "Users can insert their own exercise sessions" ON public.exercise_sessions;
DROP POLICY IF EXISTS "Users can update their own exercise sessions" ON public.exercise_sessions;
DROP POLICY IF EXISTS "Users can delete their own exercise sessions" ON public.exercise_sessions;

-- Create RLS policies for exercise_sessions
CREATE POLICY "Users can view their own exercise sessions" 
  ON public.exercise_sessions 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own exercise sessions" 
  ON public.exercise_sessions 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own exercise sessions" 
  ON public.exercise_sessions 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own exercise sessions" 
  ON public.exercise_sessions 
  FOR DELETE USING (auth.uid() = user_id);

-- Create sleep_logs table
CREATE TABLE IF NOT EXISTS public.sleep_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  duration INTEGER NOT NULL, -- in minutes
  quality INTEGER CHECK (quality >= 1 AND quality <= 10),
  sleep_interruptions INTEGER DEFAULT 0,
  dream_notes TEXT,
  factors_affecting_sleep TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for sleep_logs
ALTER TABLE public.sleep_logs ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own sleep logs" ON public.sleep_logs;
DROP POLICY IF EXISTS "Users can insert their own sleep logs" ON public.sleep_logs;
DROP POLICY IF EXISTS "Users can update their own sleep logs" ON public.sleep_logs;
DROP POLICY IF EXISTS "Users can delete their own sleep logs" ON public.sleep_logs;

-- Create RLS policies for sleep_logs
CREATE POLICY "Users can view their own sleep logs" 
  ON public.sleep_logs 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own sleep logs" 
  ON public.sleep_logs 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sleep logs" 
  ON public.sleep_logs 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sleep logs" 
  ON public.sleep_logs 
  FOR DELETE USING (auth.uid() = user_id);

-- Create daily_tasks table
CREATE TABLE IF NOT EXISTS public.daily_tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  due_date DATE,
  is_completed BOOLEAN DEFAULT FALSE,
  priority TEXT CHECK (priority IN ('low', 'medium', 'high')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for daily_tasks
ALTER TABLE public.daily_tasks ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own daily tasks" ON public.daily_tasks;
DROP POLICY IF EXISTS "Users can insert their own daily tasks" ON public.daily_tasks;
DROP POLICY IF EXISTS "Users can update their own daily tasks" ON public.daily_tasks;
DROP POLICY IF EXISTS "Users can delete their own daily tasks" ON public.daily_tasks;

-- Create RLS policies for daily_tasks
CREATE POLICY "Users can view their own daily tasks" 
  ON public.daily_tasks 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own daily tasks" 
  ON public.daily_tasks 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own daily tasks" 
  ON public.daily_tasks 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own daily tasks" 
  ON public.daily_tasks 
  FOR DELETE USING (auth.uid() = user_id);

-- Create wellness_trends table for storing analytics data
CREATE TABLE IF NOT EXISTS public.wellness_trends (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood_average DECIMAL,
  meditation_minutes INTEGER DEFAULT 0,
  exercise_minutes INTEGER DEFAULT 0,
  sleep_hours DECIMAL DEFAULT 0,
  journal_entries_count INTEGER DEFAULT 0,
  self_care_minutes INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for wellness_trends
ALTER TABLE public.wellness_trends ENABLE ROW LEVEL SECURITY;

-- Drop existing policies before creating new ones
DROP POLICY IF EXISTS "Users can view their own wellness trends" ON public.wellness_trends;
DROP POLICY IF EXISTS "Users can insert their own wellness trends" ON public.wellness_trends;
DROP POLICY IF EXISTS "Users can update their own wellness trends" ON public.wellness_trends;

-- Create RLS policies for wellness_trends
CREATE POLICY "Users can view their own wellness trends" 
  ON public.wellness_trends 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own wellness trends" 
  ON public.wellness_trends 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own wellness trends" 
  ON public.wellness_trends 
  FOR UPDATE USING (auth.uid() = user_id);

-- Special handling for health_activities table if it exists
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'health_activities') THEN
    -- Drop existing policies for health_activities
    DROP POLICY IF EXISTS "Users can view their own health activities" ON public.health_activities;
    DROP POLICY IF EXISTS "Users can insert their own health activities" ON public.health_activities;
    DROP POLICY IF EXISTS "Users can update their own health activities" ON public.health_activities;
    DROP POLICY IF EXISTS "Users can delete their own health activities" ON public.health_activities;
    
    -- Recreate policies for health_activities
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
  END IF;
END
$$;

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Drop existing trigger before creating new one
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create function to update timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at timestamps (drop first if they exist)
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS update_self_care_activities_updated_at ON public.self_care_activities;
DROP TRIGGER IF EXISTS update_meditation_sessions_updated_at ON public.meditation_sessions;
DROP TRIGGER IF EXISTS update_journal_entries_updated_at ON public.journal_entries;
DROP TRIGGER IF EXISTS update_exercise_sessions_updated_at ON public.exercise_sessions;
DROP TRIGGER IF EXISTS update_sleep_logs_updated_at ON public.sleep_logs;
DROP TRIGGER IF EXISTS update_daily_tasks_updated_at ON public.daily_tasks;
DROP TRIGGER IF EXISTS update_wellness_trends_updated_at ON public.wellness_trends;

CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_self_care_activities_updated_at
BEFORE UPDATE ON public.self_care_activities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_meditation_sessions_updated_at
BEFORE UPDATE ON public.meditation_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_journal_entries_updated_at
BEFORE UPDATE ON public.journal_entries
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_exercise_sessions_updated_at
BEFORE UPDATE ON public.exercise_sessions
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_sleep_logs_updated_at
BEFORE UPDATE ON public.sleep_logs
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_tasks_updated_at
BEFORE UPDATE ON public.daily_tasks
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_wellness_trends_updated_at
BEFORE UPDATE ON public.wellness_trends
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_user_id ON public.profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON public.mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_recorded_at ON public.mood_entries(recorded_at);
CREATE INDEX IF NOT EXISTS idx_self_care_activities_user_id ON public.self_care_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_self_care_activities_start_time ON public.self_care_activities(start_time);
CREATE INDEX IF NOT EXISTS idx_meditation_sessions_user_id ON public.meditation_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON public.journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_exercise_sessions_user_id ON public.exercise_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id ON public.sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_user_id ON public.daily_tasks(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_tasks_due_date ON public.daily_tasks(due_date);
CREATE INDEX IF NOT EXISTS idx_wellness_trends_user_id ON public.wellness_trends(user_id);
CREATE INDEX IF NOT EXISTS idx_wellness_trends_date ON public.wellness_trends(date);

-- Clean Setup SQL for Authentication and User Profiles that handles existing objects

-- Drop existing policies first to avoid conflicts
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Anyone can insert profiles" ON public.profiles;
DROP POLICY IF EXISTS "Service role can manage all profiles" ON public.profiles;

-- Drop existing triggers and functions to avoid conflicts
DROP TRIGGER IF EXISTS update_profiles_updated_at ON public.profiles;
DROP TRIGGER IF EXISTS create_profile_on_signup ON auth.users;
DROP FUNCTION IF EXISTS update_profile_updated_at() CASCADE;
DROP FUNCTION IF EXISTS public.create_profile_for_new_user() CASCADE;

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create or update profiles table
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT FROM pg_tables WHERE schemaname = 'public' AND tablename = 'profiles') THEN
    CREATE TABLE public.profiles (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
      full_name TEXT,
      avatar_url TEXT,
      age INTEGER,
      blood_group TEXT CHECK (blood_group IS NULL OR blood_group IN ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-')),
      height DECIMAL,
      weight DECIMAL,
      gender TEXT CHECK (gender IS NULL OR gender IN ('male', 'female', 'other', 'prefer_not_to_say')),
      preferences JSONB DEFAULT '{}'::jsonb,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
    );
  ELSE
    -- Table already exists, ensure all columns are present
    -- Add missing columns if necessary without changing existing data
    DO $ALTER$ 
    BEGIN
      -- Check and add each column if it doesn't exist
      IF NOT EXISTS (SELECT FROM pg_attribute WHERE attrelid = 'public.profiles'::regclass AND attname = 'preferences') THEN
        ALTER TABLE public.profiles ADD COLUMN preferences JSONB DEFAULT '{}'::jsonb;
      END IF;
      -- Add other column checks as needed
    END $ALTER$;
  END IF;
END $$;

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for secure access
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles 
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Anyone policy is critical for signup flow
CREATE POLICY "Anyone can insert profiles" 
  ON public.profiles 
  FOR INSERT WITH CHECK (true);

-- Service role policy for admin operations
CREATE POLICY "Service role can manage all profiles" 
  ON public.profiles 
  FOR ALL USING (auth.role() = 'service_role');

-- Auto-update function for updated_at
CREATE OR REPLACE FUNCTION update_profile_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update timestamp
CREATE TRIGGER update_profiles_updated_at
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION update_profile_updated_at();

-- Robust profile creation trigger
CREATE OR REPLACE FUNCTION public.create_profile_for_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Ultra-simple insert with minimal fields and error handling
  BEGIN
    INSERT INTO public.profiles (user_id) 
    VALUES (NEW.id);
  EXCEPTION 
    WHEN unique_violation THEN
      NULL; -- Silently do nothing on conflict
    WHEN OTHERS THEN
      NULL; -- Ignore all errors
  END;
  
  -- Always return NEW to continue with user creation
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create the profile creation trigger
CREATE TRIGGER create_profile_on_signup
AFTER INSERT ON auth.users
FOR EACH ROW
EXECUTE FUNCTION public.create_profile_for_new_user();

-- Grant appropriate permissions
GRANT ALL ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
GRANT ALL ON public.profiles TO anon;

-- Add indexes for better performance if they don't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_user_id') THEN
    CREATE INDEX idx_profiles_user_id ON public.profiles(user_id);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_profiles_preferences') THEN
    CREATE INDEX idx_profiles_preferences ON public.profiles USING GIN (preferences);
  END IF;
END $$;

-- Fix any existing users without profiles
INSERT INTO public.profiles (user_id)
SELECT id FROM auth.users u
WHERE NOT EXISTS (
  SELECT 1 FROM public.profiles p WHERE p.user_id = u.id
);

-- Report completion
DO $$
BEGIN
  RAISE NOTICE 'Profile setup completed successfully';
END $$; 