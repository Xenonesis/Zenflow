import { supabase } from './lib/supabase';

async function testHealthActivitiesTable() {
  console.log('Testing health_activities table connection...');
  
  try {
    // Check if the health_activities table exists
    const { data: tables, error: tableError } = await supabase
      .from('health_activities')
      .select('*')
      .limit(1);
    
    if (tableError) {
      console.error('Error accessing health_activities table:', tableError.message);
      console.error('Error details:', tableError);
      return false;
    }
    
    console.log('Successfully accessed health_activities table');
    console.log('Sample data:', tables);
    return true;
  } catch (err) {
    console.error('Error testing health_activities table:', err);
    return false;
  }
}

// Export the function to make it callable from Vite
export { testHealthActivitiesTable }; 