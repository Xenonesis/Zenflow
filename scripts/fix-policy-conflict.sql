-- Fix policy conflict for health_activities table
-- This script resolves the error: "policy "Users can view their own health activities" for table "health_activities" already exists"

-- Drop existing policies if they exist (will silently continue if policies don't exist)
DROP POLICY IF EXISTS "Users can view their own health activities" ON public.health_activities;
DROP POLICY IF EXISTS "Users can insert their own health activities" ON public.health_activities;
DROP POLICY IF EXISTS "Users can update their own health activities" ON public.health_activities;
DROP POLICY IF EXISTS "Users can delete their own health activities" ON public.health_activities;

-- Check if the health_activities table exists before attempting to create policies
DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'health_activities') THEN
    -- Recreate policies with consistent names
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