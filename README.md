# Zenflow - Mental Wellbeing Dashboard

![Version](https://img.shields.io/badge/version-2.1-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![React](https://img.shields.io/badge/React-18.3.1-61dafb)
![Vite](https://img.shields.io/badge/Vite-5.4.1-646cff)

Zenflow is a comprehensive mental wellbeing tracking application built with React, Vite, and Supabase. It helps users monitor various aspects of their mental health and wellbeing including mood, sleep, exercise, meditation, journaling, and self-care activities.

## 🌟 Features

### Core Features
- **Personalized Dashboard**: A comprehensive overview of all your wellbeing metrics in one place
- **User Authentication**: Secure login/signup via Supabase Auth with email verification
- **Profile Management**: Customize your profile and preferences

### Health Tracking
- **Mood Tracking**: Log daily mood with ratings and influencing factors
- **Sleep Logging**: Track sleep duration, quality, and influencing factors
- **Exercise Tracking**: Record workouts with duration, intensity, and other metrics
- **Meditation Log**: Monitor meditation sessions and feelings afterward
- **Journaling**: Record thoughts and reflections with rich text formatting
- **Self-Care Activities**: Log various self-care practices and set reminders

### Advanced Features
- **Health Activities Calendar**: Schedule and track health-related activities
- **Wellness Trends**: Visualize data trends over time with interactive charts
- **AI Insights**: Get personalized insights based on your health data patterns
- **Responsive Design**: Optimized for both desktop and mobile devices
- **Dark/Light Mode**: Choose your preferred theme for comfortable viewing

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18.3.1 with TypeScript
- **Build Tool**: Vite 5.4.1
- **Routing**: React Router DOM 6.26.2
- **UI Components**: 
  - Shadcn UI (powered by Radix UI)
  - Tailwind CSS 3.4.11
  - Framer Motion for animations
- **State Management**: React Hooks and Context API
- **Form Handling**: React Hook Form with Zod validation

### Backend
- **Database**: PostgreSQL (via Supabase)
- **Authentication**: Supabase Auth
- **API**: Supabase JS Client 2.49.4
- **Data Fetching**: TanStack Query 5.75.2

### Data Visualization
- **Charts**: Recharts 2.12.7
- **Date Handling**: date-fns 3.6.0
- **Calendar**: React Day Picker 8.10.1

## 📋 Prerequisites

- Node.js (v16 or higher)
- NPM or Yarn or Bun
- Supabase account
- Modern web browser

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/zenflow.git
cd zenflow
```

### 2. Install Dependencies

```bash
# Using npm
npm install

# Using yarn
yarn

# Using bun
bun install
```

### 3. Supabase Setup

#### Create a Supabase Project
1. Go to [Supabase](https://supabase.com/) and sign up/login
2. Create a new project
3. Note your Supabase URL and anon key from the project API settings

#### Database Setup
Zenflow requires several database tables. You can set these up in one of two ways:

**Option 1: Using the Web Interface**
1. Navigate to the SQL Editor in your Supabase dashboard
2. Copy and paste the SQL scripts from the following files:
   - `DATABASE_SETUP.md`
   - `SETUP_INSTRUCTIONS.md` (for health activities calendar)
3. Execute the queries to create all required tables and set up permissions

**Option 2: Using the CLI Tool**
```bash
npm run run-sql
# or
npm run create-health-table
```

### 4. Environment Configuration

Create a `.env` file in the project root:

```
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### 5. Run the Development Server

```bash
npm run dev
```

This will start the development server at http://localhost:5173 (default Vite port)

## 📊 Database Schema

Zenflow uses several tables to store user data:

### Profiles Table
- User profile information
- Automatically created when a user signs up
- Stores preferences and personal information

### Health Metrics Table
- Stores various health data points
- Supports multiple metric types (weight, sleep, etc.)
- Includes timestamps for trend analysis

### Workouts Table
- Records exercise sessions
- Tracks duration, intensity, calories burned
- Supports various workout types

### Mood Entries Table
- Tracks mood scores and factors
- Includes notes for context
- Time-stamped for trend analysis

### Health Activities Table
- Schedules health-related activities
- Supports recurring events
- Includes reminders functionality

## 🔒 Security Features

- **Row Level Security**: All database tables are protected by RLS policies
- **User Isolation**: Users can only access their own data
- **Secure Authentication**: Email-based authentication with password recovery
- **Environment Variables**: Sensitive configuration stored in environment variables

## 🧪 Testing

For database connection testing, you can run:

```bash
npm run test-db
```

## 📱 Responsive Design

Zenflow is built with a mobile-first approach and works well on:
- Desktop browsers
- Tablets
- Mobile phones
- Different screen orientations

## 🚀 Deployment

### Building for Production

```bash
npm run build
```

This will generate optimized static files in the `dist` directory.

### Hosting Options

- **Netlify/Vercel**: Easy deployment with continuous integration
- **GitHub Pages**: Free hosting for static sites
- **Firebase Hosting**: Google's hosting platform with additional features
- **AWS/GCP/Azure**: Enterprise-grade cloud hosting

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m "Add some amazing feature"`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👏 Acknowledgments

- Shadcn UI for the beautiful component library
- Supabase for the powerful backend infrastructure
- Vite team for the lightning-fast build tool
- The React team for the amazing framework
- All open source contributors whose libraries make this project possible
