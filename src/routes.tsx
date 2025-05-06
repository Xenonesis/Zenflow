import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import App from './App';
import Dashboard from './pages/Dashboard';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Profile from './pages/Profile';
import NotFound from './pages/NotFound';
import AuthCallback from './pages/AuthCallback';

// Lazy-loaded routes
const Settings = lazy(() => import('./pages/Settings'));
const MoodTracker = lazy(() => import('./pages/MoodTracker'));
const Welcome = lazy(() => import('./pages/Welcome'));
const Admin = lazy(() => import('./pages/Admin'));
const SetupPage = lazy(() => import('./pages/SetupPage'));

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: 'signin',
        element: <SignIn />,
      },
      {
        path: 'signup',
        element: <SignUp />,
      },
      {
        path: 'profile',
        element: <Profile />,
      },
      {
        path: 'settings',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Settings />
          </Suspense>
        ),
      },
      {
        path: 'mood',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <MoodTracker />
          </Suspense>
        ),
      },
      {
        path: 'welcome',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Welcome />
          </Suspense>
        ),
      },
      {
        path: 'admin',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Admin />
          </Suspense>
        ),
      },
      {
        path: 'setup',
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <SetupPage />
          </Suspense>
        ),
      },
      {
        path: 'auth/callback',
        element: <AuthCallback />,
      },
    ],
  },
]);

export function Routes() {
  return <RouterProvider router={router} />;
} 