-- Sample data for testing the mental wellbeing dashboard
-- Replace 'your-user-id-here' with your actual user ID from Supabase auth

-- Sample mood entries for the past 14 days
INSERT INTO mood_entries (user_id, mood_score, mood_label, notes, factors, recorded_at)
VALUES
  ('your-user-id-here', 8, 'good', 'Felt productive today', ARRAY['good sleep', 'exercise'], NOW() - INTERVAL '1 day'),
  ('your-user-id-here', 6, 'neutral', 'Average day, nothing special', ARRAY['work stress'], NOW() - INTERVAL '2 days'),
  ('your-user-id-here', 9, 'great', 'Had a great time with friends', ARRAY['social activity', 'good food'], NOW() - INTERVAL '3 days'),
  ('your-user-id-here', 4, 'poor', 'Feeling tired and unmotivated', ARRAY['poor sleep', 'work deadline'], NOW() - INTERVAL '4 days'),
  ('your-user-id-here', 7, 'good', 'Completed a challenging project', ARRAY['accomplishment'], NOW() - INTERVAL '5 days'),
  ('your-user-id-here', 5, 'neutral', 'Just an ordinary day', NULL, NOW() - INTERVAL '6 days'),
  ('your-user-id-here', 8, 'good', 'Went for a long walk in nature', ARRAY['exercise', 'nature'], NOW() - INTERVAL '7 days'),
  ('your-user-id-here', 3, 'bad', 'Argument with colleague', ARRAY['conflict', 'work stress'], NOW() - INTERVAL '8 days'),
  ('your-user-id-here', 6, 'neutral', 'Busy day, managed to stay on track', ARRAY['busy schedule'], NOW() - INTERVAL '9 days'),
  ('your-user-id-here', 8, 'good', 'Meditated in the morning, felt focused all day', ARRAY['meditation', 'good sleep'], NOW() - INTERVAL '10 days'),
  ('your-user-id-here', 7, 'good', 'Family dinner, relaxing evening', ARRAY['family time', 'good food'], NOW() - INTERVAL '11 days'),
  ('your-user-id-here', 5, 'neutral', 'Nothing special to report', NULL, NOW() - INTERVAL '12 days'),
  ('your-user-id-here', 9, 'great', 'Promoted at work!', ARRAY['accomplishment', 'recognition'], NOW() - INTERVAL '13 days'),
  ('your-user-id-here', 6, 'neutral', 'Regular day at work', ARRAY['routine'], NOW() - INTERVAL '14 days');

-- Sample self-care activities
INSERT INTO self_care_activities (user_id, title, activity_type, description, duration, start_time, end_time, notes)
VALUES
  ('your-user-id-here', 'Morning Meditation', 'meditation', 'Mindfulness meditation', 15, NOW() - INTERVAL '1 day', NOW() - INTERVAL '1 day' + INTERVAL '15 minutes', 'Felt very calm afterward'),
  ('your-user-id-here', 'Reading Fiction', 'reading', 'Read a chapter of my new novel', 30, NOW() - INTERVAL '2 days', NOW() - INTERVAL '2 days' + INTERVAL '30 minutes', 'Enjoyable escape'),
  ('your-user-id-here', 'Yoga Session', 'exercise', 'Gentle yoga flow', 45, NOW() - INTERVAL '3 days', NOW() - INTERVAL '3 days' + INTERVAL '45 minutes', 'Stretched out tension'),
  ('your-user-id-here', 'Journaling', 'reflection', 'Wrote about my goals for the month', 20, NOW() - INTERVAL '4 days', NOW() - INTERVAL '4 days' + INTERVAL '20 minutes', 'Gained clarity'),
  ('your-user-id-here', 'Early Bedtime', 'sleep', 'Went to bed early', 480, NOW() - INTERVAL '5 days', NOW() - INTERVAL '5 days' + INTERVAL '8 hours', 'Woke up refreshed');

-- Sample meditation sessions
INSERT INTO meditations (user_id, title, meditation_type, duration, notes, feeling_before, feeling_after, completed_at)
VALUES
  ('your-user-id-here', 'Morning Mindfulness', 'mindfulness', 10, 'Focused on breath', 'Anxious', 'Calm', NOW() - INTERVAL '1 day'),
  ('your-user-id-here', 'Loving-Kindness Practice', 'loving-kindness', 15, 'Sending good wishes to others', 'Neutral', 'Compassionate', NOW() - INTERVAL '3 days'),
  ('your-user-id-here', 'Body Scan', 'body-scan', 20, 'Progressively relaxed each body part', 'Tense', 'Relaxed', NOW() - INTERVAL '5 days'),
  ('your-user-id-here', 'Guided Visualization', 'guided', 30, 'Imagined peaceful place', 'Stressed', 'Peaceful', NOW() - INTERVAL '7 days'),
  ('your-user-id-here', 'Mindful Walking', 'mindfulness', 15, 'Walked slowly and mindfully', 'Distracted', 'Focused', NOW() - INTERVAL '9 days');

-- Sample journal entries
INSERT INTO journal_entries (user_id, title, entry_type, content, mood, tags, created_at)
VALUES
  ('your-user-id-here', 'Today''s Reflection', 'reflection', 'Today was challenging but I managed to stay positive despite the obstacles. I learned that patience is key.', 'positive', ARRAY['growth', 'challenges'], NOW() - INTERVAL '1 day'),
  ('your-user-id-here', 'Gratitude List', 'gratitude', 'I''m grateful for: 1. My health 2. My supportive friends 3. The beautiful weather today', 'grateful', ARRAY['gratitude', 'positive'], NOW() - INTERVAL '3 days'),
  ('your-user-id-here', 'Monthly Goals', 'goals', 'Goals for next month: 1. Meditate daily 2. Read two books 3. Exercise three times a week', 'motivated', ARRAY['goals', 'planning'], NOW() - INTERVAL '5 days'),
  ('your-user-id-here', 'Processing Emotions', 'emotion', 'I felt frustrated at work today. I think it stems from feeling unheard in meetings. I need to work on expressing myself more clearly.', 'reflective', ARRAY['emotions', 'work'], NOW() - INTERVAL '7 days'),
  ('your-user-id-here', 'Evening Thoughts', 'evening', 'Today was productive. I completed all my tasks and had time for self-care. I''m looking forward to tomorrow.', 'satisfied', ARRAY['productivity', 'accomplishment'], NOW() - INTERVAL '9 days');

-- Sample exercise logs
INSERT INTO exercises (user_id, title, exercise_type, duration, intensity, calories_burned, distance, notes, completed_at)
VALUES
  ('your-user-id-here', 'Morning Run', 'running', 30, 'moderate', 300, 3.5, 'Felt energized', NOW() - INTERVAL '1 day'),
  ('your-user-id-here', 'Strength Training', 'weight lifting', 45, 'high', 400, NULL, 'Focused on upper body', NOW() - INTERVAL '3 days'),
  ('your-user-id-here', 'Cycling', 'cycling', 60, 'moderate', 500, 15.0, 'Scenic route through the park', NOW() - INTERVAL '5 days'),
  ('your-user-id-here', 'Yoga', 'yoga', 40, 'low', 150, NULL, 'Gentle flow, focused on flexibility', NOW() - INTERVAL '7 days'),
  ('your-user-id-here', 'HIIT Workout', 'hiit', 20, 'high', 250, NULL, 'Intense but effective', NOW() - INTERVAL '9 days');

-- Sample sleep logs
INSERT INTO sleep_logs (user_id, sleep_date, duration_hours, bed_time, wake_time, quality_rating, factors, notes, created_at)
VALUES
  ('your-user-id-here', CURRENT_DATE - INTERVAL '1 day', 7.5, '23:00', '06:30', 8, ARRAY['cool room', 'read before bed'], 'Woke up refreshed', NOW() - INTERVAL '1 day'),
  ('your-user-id-here', CURRENT_DATE - INTERVAL '2 days', 6.0, '00:00', '06:00', 5, ARRAY['stress', 'late night'], 'Woke up a few times', NOW() - INTERVAL '2 days'),
  ('your-user-id-here', CURRENT_DATE - INTERVAL '3 days', 8.0, '22:30', '06:30', 9, ARRAY['exercise during day', 'no caffeine'], 'Deep sleep throughout', NOW() - INTERVAL '3 days'),
  ('your-user-id-here', CURRENT_DATE - INTERVAL '4 days', 5.5, '01:00', '06:30', 4, ARRAY['work stress', 'noise'], 'Restless night', NOW() - INTERVAL '4 days'),
  ('your-user-id-here', CURRENT_DATE - INTERVAL '5 days', 7.0, '23:30', '06:30', 7, ARRAY['meditation before bed'], 'Decent sleep', NOW() - INTERVAL '5 days'),
  ('your-user-id-here', CURRENT_DATE - INTERVAL '6 days', 8.5, '22:00', '06:30', 9, ARRAY['tired from exercise', 'quiet night'], 'Excellent sleep', NOW() - INTERVAL '6 days'),
  ('your-user-id-here', CURRENT_DATE - INTERVAL '7 days', 6.5, '23:45', '06:15', 6, ARRAY['ate late'], 'Average sleep', NOW() - INTERVAL '7 days');

-- Check if the workout_plans table exists
CREATE TABLE IF NOT EXISTS workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  workout_type TEXT NOT NULL,
  level TEXT NOT NULL,
  duration INTEGER,
  exercises JSONB,
  is_public BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Add RLS policies for workout_plans
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;

-- Policy to allow users to insert their own workout plans
CREATE POLICY insert_own_workout_plan ON workout_plans 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Policy to allow users to view their own workout plans
CREATE POLICY select_own_workout_plan ON workout_plans 
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Policy to allow users to view public workout plans
CREATE POLICY select_public_workout_plan ON workout_plans 
  FOR SELECT 
  USING (is_public = TRUE);

-- Policy to allow users to update their own workout plans
CREATE POLICY update_own_workout_plan ON workout_plans 
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Policy to allow users to delete their own workout plans
CREATE POLICY delete_own_workout_plan ON workout_plans 
  FOR DELETE 
  USING (auth.uid() = user_id); 