-- Complete Database Setup for Mindful Wellbeing Dashboard
-- This script creates all necessary tables and relationships

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

-- Create RLS policies for profiles
CREATE POLICY "Users can view their own profile" 
  ON public.profiles 
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles 
  FOR UPDATE USING (auth.uid() = user_id);

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

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for new user registration
CREATE OR REPLACE TRIGGER on_auth_user_created
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

-- Create triggers for updated_at timestamps
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