-- Create tables for mental wellbeing dashboard

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table for mood entries
CREATE TABLE IF NOT EXISTS mood_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  mood_score INTEGER NOT NULL CHECK (mood_score BETWEEN 1 AND 10),
  mood_label TEXT CHECK (mood_label IN ('terrible', 'bad', 'poor', 'neutral', 'good', 'great', 'excellent')),
  notes TEXT,
  factors TEXT[],
  recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for self-care activities
CREATE TABLE IF NOT EXISTS self_care_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('meditation', 'sleep', 'reflection', 'exercise', 'reading', 'custom')),
  description TEXT,
  duration INTEGER,
  start_time TIMESTAMP WITH TIME ZONE DEFAULT now(),
  end_time TIMESTAMP WITH TIME ZONE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for meditation sessions
CREATE TABLE IF NOT EXISTS meditations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  meditation_type TEXT NOT NULL CHECK (meditation_type IN ('mindfulness', 'focused', 'loving-kindness', 'body-scan', 'guided', 'transcendental', 'custom')),
  duration INTEGER NOT NULL,
  notes TEXT,
  feeling_before TEXT,
  feeling_after TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for journal entries
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  entry_type TEXT NOT NULL CHECK (entry_type IN ('gratitude', 'reflection', 'goals', 'emotion', 'morning', 'evening', 'custom')),
  content TEXT NOT NULL,
  mood TEXT,
  tags TEXT[],
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for exercise logs
CREATE TABLE IF NOT EXISTS exercises (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  exercise_type TEXT NOT NULL,
  duration INTEGER NOT NULL,
  intensity TEXT NOT NULL CHECK (intensity IN ('low', 'moderate', 'high')),
  calories_burned INTEGER,
  distance DECIMAL,
  notes TEXT,
  completed_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Table for sleep logs
CREATE TABLE IF NOT EXISTS sleep_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL,
  sleep_date DATE NOT NULL,
  duration_hours DECIMAL NOT NULL,
  bed_time TEXT NOT NULL,
  wake_time TEXT NOT NULL,
  quality_rating INTEGER NOT NULL CHECK (quality_rating BETWEEN 1 AND 10),
  factors TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_mood_entries_user_id ON mood_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_mood_entries_recorded_at ON mood_entries(recorded_at);

CREATE INDEX IF NOT EXISTS idx_self_care_activities_user_id ON self_care_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_self_care_activities_start_time ON self_care_activities(start_time);

CREATE INDEX IF NOT EXISTS idx_meditations_user_id ON meditations(user_id);
CREATE INDEX IF NOT EXISTS idx_meditations_completed_at ON meditations(completed_at);

CREATE INDEX IF NOT EXISTS idx_journal_entries_user_id ON journal_entries(user_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_created_at ON journal_entries(created_at);

CREATE INDEX IF NOT EXISTS idx_exercises_user_id ON exercises(user_id);
CREATE INDEX IF NOT EXISTS idx_exercises_completed_at ON exercises(completed_at);

CREATE INDEX IF NOT EXISTS idx_sleep_logs_user_id ON sleep_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_sleep_logs_sleep_date ON sleep_logs(sleep_date);

-- Add Row Level Security (RLS) policies
-- Enable RLS on all tables
ALTER TABLE mood_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE self_care_activities ENABLE ROW LEVEL SECURITY;
ALTER TABLE meditations ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE sleep_logs ENABLE ROW LEVEL SECURITY;

-- Create policies
-- Users can only see and modify their own data
-- Note: PostgreSQL doesn't support IF NOT EXISTS for policies directly
-- We'll use DO blocks to check if policies exist before creating them

DO $$
BEGIN
    -- Check if the policy exists before creating it
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mood_entries' AND policyname = 'Users can view their own mood entries'
    ) THEN
        CREATE POLICY "Users can view their own mood entries" 
        ON mood_entries FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mood_entries' AND policyname = 'Users can insert their own mood entries'
    ) THEN
        CREATE POLICY "Users can insert their own mood entries" 
        ON mood_entries FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mood_entries' AND policyname = 'Users can update their own mood entries'
    ) THEN
        CREATE POLICY "Users can update their own mood entries" 
        ON mood_entries FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'mood_entries' AND policyname = 'Users can delete their own mood entries'
    ) THEN
        CREATE POLICY "Users can delete their own mood entries" 
        ON mood_entries FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;

    -- Self-care activities policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'self_care_activities' AND policyname = 'Users can view their own self-care activities'
    ) THEN
        CREATE POLICY "Users can view their own self-care activities" 
        ON self_care_activities FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'self_care_activities' AND policyname = 'Users can insert their own self-care activities'
    ) THEN
        CREATE POLICY "Users can insert their own self-care activities" 
        ON self_care_activities FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'self_care_activities' AND policyname = 'Users can update their own self-care activities'
    ) THEN
        CREATE POLICY "Users can update their own self-care activities" 
        ON self_care_activities FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'self_care_activities' AND policyname = 'Users can delete their own self-care activities'
    ) THEN
        CREATE POLICY "Users can delete their own self-care activities" 
        ON self_care_activities FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;

    -- Meditations policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meditations' AND policyname = 'Users can view their own meditation sessions'
    ) THEN
        CREATE POLICY "Users can view their own meditation sessions" 
        ON meditations FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meditations' AND policyname = 'Users can insert their own meditation sessions'
    ) THEN
        CREATE POLICY "Users can insert their own meditation sessions" 
        ON meditations FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meditations' AND policyname = 'Users can update their own meditation sessions'
    ) THEN
        CREATE POLICY "Users can update their own meditation sessions" 
        ON meditations FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'meditations' AND policyname = 'Users can delete their own meditation sessions'
    ) THEN
        CREATE POLICY "Users can delete their own meditation sessions" 
        ON meditations FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;

    -- Journal entries policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'journal_entries' AND policyname = 'Users can view their own journal entries'
    ) THEN
        CREATE POLICY "Users can view their own journal entries" 
        ON journal_entries FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'journal_entries' AND policyname = 'Users can insert their own journal entries'
    ) THEN
        CREATE POLICY "Users can insert their own journal entries" 
        ON journal_entries FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'journal_entries' AND policyname = 'Users can update their own journal entries'
    ) THEN
        CREATE POLICY "Users can update their own journal entries" 
        ON journal_entries FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'journal_entries' AND policyname = 'Users can delete their own journal entries'
    ) THEN
        CREATE POLICY "Users can delete their own journal entries" 
        ON journal_entries FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;

    -- Exercises policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'exercises' AND policyname = 'Users can view their own exercise logs'
    ) THEN
        CREATE POLICY "Users can view their own exercise logs" 
        ON exercises FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'exercises' AND policyname = 'Users can insert their own exercise logs'
    ) THEN
        CREATE POLICY "Users can insert their own exercise logs" 
        ON exercises FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'exercises' AND policyname = 'Users can update their own exercise logs'
    ) THEN
        CREATE POLICY "Users can update their own exercise logs" 
        ON exercises FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'exercises' AND policyname = 'Users can delete their own exercise logs'
    ) THEN
        CREATE POLICY "Users can delete their own exercise logs" 
        ON exercises FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;

    -- Sleep logs policies
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sleep_logs' AND policyname = 'Users can view their own sleep logs'
    ) THEN
        CREATE POLICY "Users can view their own sleep logs" 
        ON sleep_logs FOR SELECT 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sleep_logs' AND policyname = 'Users can insert their own sleep logs'
    ) THEN
        CREATE POLICY "Users can insert their own sleep logs" 
        ON sleep_logs FOR INSERT 
        WITH CHECK (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sleep_logs' AND policyname = 'Users can update their own sleep logs'
    ) THEN
        CREATE POLICY "Users can update their own sleep logs" 
        ON sleep_logs FOR UPDATE 
        USING (auth.uid() = user_id);
    END IF;

    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'sleep_logs' AND policyname = 'Users can delete their own sleep logs'
    ) THEN
        CREATE POLICY "Users can delete their own sleep logs" 
        ON sleep_logs FOR DELETE 
        USING (auth.uid() = user_id);
    END IF;
END
$$; 