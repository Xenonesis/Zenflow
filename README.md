# Mental Wellbeing Dashboard

A comprehensive mental wellbeing tracking application that helps users monitor various aspects of their mental health and wellbeing including mood, sleep, exercise, meditation, journaling, and self-care activities.

## Features

- **User Authentication**: Secure login/signup via Supabase Auth
- **Mood Tracking**: Log daily mood with ratings and factors
- **Sleep Logging**: Track sleep duration, quality, and influencing factors
- **Exercise Tracking**: Record workouts with duration, intensity, and other metrics
- **Meditation Log**: Monitor meditation sessions and feelings
- **Journaling**: Record thoughts and reflections
- **Self-Care Activities**: Log various self-care practices
- **Wellness Trends**: Visualize data trends over time with interactive charts
- **Responsive Design**: Works on desktop and mobile devices

## Tech Stack

- **Frontend**: Next.js, React, TypeScript
- **UI Components**: Shadcn UI, Tailwind CSS
- **State Management**: React Hooks
- **Database & Auth**: Supabase
- **Charts**: Recharts
- **Form Handling**: React Hook Form, Zod

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn
- Supabase account

### Supabase Setup

1. Create a new project on [Supabase](https://supabase.com/)
2. Once your project is created, go to the project settings to find your API keys
3. Create the required database tables using the SQL script provided in `src/lib/db-setup.sql`
4. Optional: Add sample data using `src/lib/seed-data.sql` (don't forget to replace 'your-user-id-here' with your actual user ID)

#### Database Schema Setup

Execute the SQL script provided in `src/lib/db-setup.sql` in the Supabase SQL Editor to create all necessary tables:

1. Go to your Supabase project
2. Navigate to the SQL Editor
3. Copy and paste the contents of `src/lib/db-setup.sql`
4. Run the query to create all tables and set up permissions

### Environment Setup

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/mental-wellbeing-dashboard.git
   cd mental-wellbeing-dashboard
   ```

2. Install dependencies:
   ```
   npm install
   # or
   yarn
   ```

3. Create a `.env.local` file in the root directory with your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

4. Start the development server:
   ```
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Adding Test Data

After setting up the database tables, you can insert test data using the SQL script in `src/lib/seed-data.sql`:

1. Go to the Supabase SQL Editor
2. Replace 'your-user-id-here' in the script with your actual user ID from Supabase auth
3. Run the script to insert sample data across all tables

## User Guide

### Dashboard

The main dashboard provides an overview of all your wellbeing metrics with separate cards for each aspect:

- **Mood Tracker**: Shows your recent mood entries
- **Sleep Log**: Displays recent sleep quality and patterns
- **Exercise Log**: Lists your recent physical activities
- **Meditation Log**: Shows meditation sessions
- **Journal Log**: Lists recent journal entries
- **Self-Care Log**: Shows self-care activities
- **Wellness Trends**: Visualizes data over time

### Adding Entries

Each card includes an "Add" button that opens a form dialog to add a new entry:

1. Click the "+" button on the respective card
2. Fill in the details in the form
3. Click "Save" to record your entry
4. The dashboard will automatically update with your new data

## Troubleshooting

### Database Connection Issues

If you encounter 404 errors when fetching data, check that:

1. Your Supabase URL and anon key are correct in `.env.local`
2. All required database tables have been created
3. You're logged in with a valid user account
4. Row-level security policies are properly set up

### Chart Rendering Issues

If charts aren't displaying correctly:

1. Ensure you have data in the respective tables
2. Check browser console for errors
3. Verify that your user ID matches the data in the database

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Shadcn UI for the beautiful component library
- Supabase for the backend infrastructure
- The Next.js team for the amazing framework
