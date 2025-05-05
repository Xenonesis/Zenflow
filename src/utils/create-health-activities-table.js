// Create the health_activities table via Supabase API

import { createClient } from '@supabase/supabase-js';

// Use the same connection details from supabase.ts
const supabaseUrl = 'https://ztrtdfkkwmhdeszjuwrp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cnRkZmtrd21oZGVzemp1d3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTY5MjEsImV4cCI6MjA2MTk3MjkyMX0.6Z3gLkgDUhPoW1hVBQ0zeTdzwirz090otyjeAMjvfb8';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

// This will only create the table if you have admin privileges,
// which is unlikely with the anon key. This is for demonstration purposes.
async function createTable() {
  console.log('Attempting to create health_activities table...');
  
  try {
    const { data, error } = await supabase
      .from('health_activities')
      .insert([
        {
          title: 'Test Activity',
          activity_type: 'custom',
          start_time: new Date().toISOString(),
          all_day: false,
          recurring: false,
          reminder_sent: false
        }
      ])
      .select();
    
    if (error) {
      console.error('Error creating health_activities table or inserting data:', error.message);
      console.error('Error details:', error);
    } else if (!data) {
      console.error('No data returned, table might not exist');
    } else {
      console.log('Successfully created or accessed health_activities table');
      console.log('Sample data:', data);
      return true;
    }
  } catch (err) {
    console.error('Exception while creating health_activities table:', err);
  }

  // If we reach here, there was an error
  console.log('\n====================================================');
  console.log('IMPORTANT: The health_activities table does not exist in your Supabase database.');
  console.log('You need to run the SQL script to create the table.');
  console.log('1. Go to your Supabase project at https://supabase.com');
  console.log('2. Open the SQL Editor');
  console.log('3. Copy and paste the contents of scripts/add-health-activities-table.sql');
  console.log('4. Run the SQL script');
  console.log('====================================================\n');
  
  return false;
}

// Run the table creation
createTable()
  .then(result => {
    console.log('Table creation process completed with result:', result);
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Error in table creation process:', error);
    process.exit(1);
  }); 