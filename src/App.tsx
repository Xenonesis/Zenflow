import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { useAuth } from "./lib/auth-context";
import { Spinner } from "./components/ui/spinner";
import { useEffect } from "react";
import { initNotifications } from "@/services/notifications";
import { prefetchService } from "@/services/prefetch.service";
import { lazyLoad } from "@/lib/lazy-load";
import queryClient from "@/lib/query-client";

// Lazy load page components
const Index = lazyLoad(() => import("./pages/Index"), { preload: true });
const About = lazyLoad(() => import("./pages/About"));
const NotFound = lazyLoad(() => import("./pages/NotFound"));
const Calendar = lazyLoad(() => import("./pages/Calendar"));
const History = lazyLoad(() => import("./pages/History"));
const Workouts = lazyLoad(() => import("./pages/Workouts"));
const MentalHealth = lazyLoad(() => import("./pages/MentalHealth"));
const HealthMetrics = lazyLoad(() => import("./pages/HealthMetrics"));
const Settings = lazyLoad(() => import("./pages/Settings"));
const AIInsights = lazyLoad(() => import("./pages/AIInsights"));
const SignInPage = lazyLoad(() => import("./pages/SignInPage"), { preload: true });
const SignUpPage = lazyLoad(() => import("./pages/SignUpPage"));
const ResetPasswordPage = lazyLoad(() => import("./pages/ResetPasswordPage"));
const TestPage = lazyLoad(() => import("./pages/TestPage"));
const DataManager = lazyLoad(() => import("./pages/DataManager"));
const Landing = lazyLoad(() => import("./pages/Landing"), { preload: true });
const SetupPage = lazyLoad(() => import("./pages/SetupPage"));

// Protected route component that uses our Supabase auth
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading, session } = useAuth();
  const location = useLocation();
  
  // Show a loading indicator while auth state is being determined
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="mb-4">Loading authentication...</div>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  // Redirect to signin if user is not authenticated
  if (!user || !session) {
    // Save the attempted URL to redirect back after login
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected content - wrap in error boundary
  return (
    <ErrorBoundary fallback={
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h2 className="text-xl font-semibold text-red-700 mb-4">Something went wrong</h2>
          <p className="text-red-600 mb-4">
            There was an error loading this page. This could be due to a temporary issue.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Reload Page
            </button>
            <button
              onClick={() => window.location.href = '/test'}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Go to Test Page
            </button>
          </div>
        </div>
      </div>
    }>
      {children}
    </ErrorBoundary>
  );
};

// Redirect authenticated users to dashboard if they try to access public routes
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="mb-4">Loading...</div>
          <Spinner size="lg" />
        </div>
      </div>
    );
  }
  
  if (user) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
};

// Separate component for service initialization
const ServiceInitializer = () => {
  const { user } = useAuth();

  // Initialize services when the component mounts if user is logged in
  useEffect(() => {
    if (user) {
      // Initialize notifications
      initNotifications();
      
      // Prefetch user data for faster page loads
      prefetchService.prefetchUserData(user.id).catch(err => {
        console.warn('Prefetch error (non-critical):', err);
      });
    }
  }, [user]);

  return null; // This component doesn't render anything
};

// App component with proper nesting of providers
const App = () => {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <ServiceInitializer />
              <TooltipProvider>
                <Toaster />
                <Sonner position="bottom-right" closeButton theme="light" />
                <Routes>
                  {/* Public landing page - make it the root route */}
                  <Route path="/" element={
                    <PublicRoute>
                      <Landing />
                    </PublicRoute>
                  } />
                  
                  {/* Auth routes */}
                  <Route path="/signin" element={
                    <PublicRoute>
                      <SignInPage />
                    </PublicRoute>
                  } />
                  <Route path="/signup" element={
                    <PublicRoute>
                      <SignUpPage />
                    </PublicRoute>
                  } />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  
                  {/* Setup route for database maintenance */}
                  <Route path="/setup" element={<SetupPage />} />
                  
                  {/* Test route to verify routing */}
                  <Route path="/test" element={
                    <ProtectedRoute>
                      <TestPage />
                    </ProtectedRoute>
                  } />
                  
                  {/* Protected routes */}
                  <Route path="/dashboard" element={
                    <ProtectedRoute>
                      <Index />
                    </ProtectedRoute>
                  } />
                  <Route path="/profile" element={
                    <ProtectedRoute>
                      <Navigate to="/settings" replace />
                    </ProtectedRoute>
                  } />
                  <Route path="/about" element={
                    <ProtectedRoute>
                      <About />
                    </ProtectedRoute>
                  } />
                  <Route path="/calendar" element={
                    <ProtectedRoute>
                      <Calendar />
                    </ProtectedRoute>
                  } />
                  <Route path="/history" element={
                    <ProtectedRoute>
                      <History />
                    </ProtectedRoute>
                  } />
                  <Route path="/workouts" element={
                    <ProtectedRoute>
                      <Workouts />
                    </ProtectedRoute>
                  } />
                  <Route path="/health-metrics" element={
                    <ProtectedRoute>
                      <HealthMetrics />
                    </ProtectedRoute>
                  } />
                  <Route path="/mental-health" element={
                    <ProtectedRoute>
                      <MentalHealth />
                    </ProtectedRoute>
                  } />
                  <Route path="/ai-insights" element={
                    <ProtectedRoute>
                      <AIInsights />
                    </ProtectedRoute>
                  } />
                  <Route path="/settings" element={
                    <ProtectedRoute>
                      <Settings />
                    </ProtectedRoute>
                  } />
                  <Route path="/data-manager" element={
                    <ProtectedRoute>
                      <DataManager />
                    </ProtectedRoute>
                  } />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </AuthProvider>
          </BrowserRouter>
        </ThemeProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
