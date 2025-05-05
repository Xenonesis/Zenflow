// This is an ES module file for testing database access

import { createClient } from '@supabase/supabase-js';

// Use the same connection details from supabase.ts
const supabaseUrl = 'https://ztrtdfkkwmhdeszjuwrp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cnRkZmtrd21oZGVzemp1d3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTY5MjEsImV4cCI6MjA2MTk3MjkyMX0.6Z3gLkgDUhPoW1hVBQ0zeTdzwirz090otyjeAMjvfb8';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testHealthActivitiesTable() {
  console.log('Testing health_activities table connection...');
  
  try {
    // Check if the health_activities table exists by attempting to query it
    const { data, error } = await supabase
      .from('health_activities')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Error accessing health_activities table:', error.message);
      console.error('Error details:', error);
      return false;
    }
    
    console.log('Successfully accessed health_activities table');
    console.log('Sample data:', data);
    return true;
  } catch (err) {
    console.error('Error testing health_activities table:', err);
    return false;
  }
}

// Run the test
testHealthActivitiesTable()
  .then(result => {
    console.log('Test completed with result:', result);
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
  }); 