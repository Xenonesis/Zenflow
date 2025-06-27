// This script runs SQL commands against Supabase

import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';

// Use the same connection details from supabase.ts
const supabaseUrl = 'https://ztrtdfkkwmhdeszjuwrp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp0cnRkZmtrd21oZGVzemp1d3JwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYzOTY5MjEsImV4cCI6MjA2MTk3MjkyMX0.6Z3gLkgDUhPoW1hVBQ0zeTdzwirz090otyjeAMjvfb8';

// Create a Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function runSql(sqlFilePath) {
  try {
    console.log(`Reading SQL file: ${sqlFilePath}`);
    // Read the SQL file
    const sql = fs.readFileSync(sqlFilePath, 'utf8');
    
    // Split the SQL into individual statements (basic approach)
    const statements = sql.split(';').filter(stmt => stmt.trim() !== '');
    
    console.log(`Found ${statements.length} SQL statements to execute`);
    
    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const stmt = statements[i];
      console.log(`Executing statement ${i + 1}/${statements.length}`);
      console.log(`Statement: ${stmt.trim().substring(0, 100)}...`);
      
      // Execute the statement
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      
      if (error) {
        console.error(`Error executing statement ${i + 1}:`, error.message);
        console.error('Error details:', error);
      } else {
        console.log(`Statement ${i + 1} executed successfully`);
      }
    }
    
    console.log('SQL execution completed');
  } catch (err) {
    console.error('Error running SQL:', err);
  }
}

// Get the SQL file path from command line arguments
const sqlFilePath = process.argv[2];

if (!sqlFilePath) {
  console.error('Please provide the path to the SQL file as an argument');
  process.exit(1);
}

// Run the SQL file
runSql(sqlFilePath)
  .then(() => {
    console.log('SQL execution process completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error in SQL execution process:', error);
    process.exit(1);
  }); 