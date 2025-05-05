# Setup Instructions for Health Activities Calendar

## Database Setup

The application requires a `health_activities` table to store scheduled activities. Follow these steps to set up the table:

1. Go to your [Supabase project dashboard](https://app.supabase.io/)
2. Navigate to the SQL Editor
3. Create a new query
4. Copy the following SQL code:

```sql
-- Create health_activities table
CREATE TABLE IF NOT EXISTS public.health_activities (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  activity_type TEXT NOT NULL CHECK (activity_type IN ('workout', 'meditation', 'medication', 'doctor_appointment', 'therapy_session', 'water_intake', 'sleep', 'custom')),
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE,
  all_day BOOLEAN DEFAULT FALSE,
  recurring BOOLEAN DEFAULT FALSE,
  recurrence_pattern TEXT, -- JSON string with recurrence details
  reminder_time TIMESTAMP WITH TIME ZONE,
  reminder_sent BOOLEAN DEFAULT FALSE,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Enable RLS for health_activities
ALTER TABLE public.health_activities ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for health_activities
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_health_activities_user_id ON public.health_activities(user_id);
CREATE INDEX IF NOT EXISTS idx_health_activities_start_time ON public.health_activities(start_time);
CREATE INDEX IF NOT EXISTS idx_health_activities_activity_type ON public.health_activities(activity_type);
CREATE INDEX IF NOT EXISTS idx_health_activities_reminder_time ON public.health_activities(reminder_time);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = now();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to update updated_at on record change
CREATE TRIGGER update_health_activities_updated_at
BEFORE UPDATE ON public.health_activities
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

5. Click "Run" to execute the SQL and create the table
6. Verify that the table was created by checking the database tables in your Supabase project

## Running the Application

After setting up the database table, you can run the application:

```
npm run dev
```

The application should now be functioning correctly with the health activities calendar feature.

## Troubleshooting

If you encounter issues:

1. Check that you have successfully created the `health_activities` table
2. Verify that the RLS policies are properly set up
3. Make sure you're using the correct Supabase credentials in your environment
4. Clear your browser cache and reload the application

For database connection testing, you can run:

```
npm run test-db
```

This will check if the application can connect to the `health_activities` table. 