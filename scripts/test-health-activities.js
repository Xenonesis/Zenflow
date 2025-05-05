// Import the test function
import { testHealthActivitiesTable } from '../src/test-db.js';

// Run the test and handle the result
testHealthActivitiesTable()
  .then(result => {
    console.log('Test completed with result:', result);
    process.exit(result ? 0 : 1);
  })
  .catch(error => {
    console.error('Test failed with error:', error);
    process.exit(1);
  }); 