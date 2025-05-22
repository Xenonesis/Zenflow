import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { AuthProvider, useAuth } from "@/lib/auth-context";
import { ErrorBoundary } from "@/components/error/ErrorBoundary";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { lazyLoad } from "@/lib/lazy-load";
import queryClient from "@/lib/query-client";
import { initNotifications } from "@/services/notifications";
import { prefetchService } from "@/services/prefetch.service";

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

// Custom Loader Component
const CustomLoader = () => {
  return (
    <div className="relative flex items-center justify-center h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-slate-900 dark:to-slate-800 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-600/40 via-teal-500/20 to-transparent opacity-90 dark:from-indigo-700/30 dark:via-teal-600/15"></div>
      <div className="absolute inset-0 bg-grid-white/10 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.7))]"></div>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 bg-white/30 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: Math.random() * 0.5 + 0.5
            }}
            animate={{
              y: [0, -window.innerHeight],
              opacity: [0, 1, 0],
              transition: {
                duration: Math.random() * 8 + 4,
                repeat: Infinity,
                delay: Math.random() * 4,
                ease: "linear"
              }
            }}
          />
        ))}
      </div>
      <motion.div
        className="absolute top-20 left-20 h-16 w-16 bg-gradient-to-br from-indigo-400/50 to-teal-300/50 rounded-full blur-xl"
        animate={{
          y: [-10, 10, -10],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div
        className="absolute bottom-20 right-20 h-20 w-20 bg-gradient-to-br from-purple-400/50 to-pink-300/50 rounded-full blur-xl"
        animate={{
          y: [-10, 10, -10],
          transition: { duration: 3, repeat: Infinity, ease: "easeInOut" }
        }}
      />
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative text-center bg-white/20 dark:bg-indigo-900/50 p-8 rounded-2xl shadow-2xl border border-white/30 dark:border-indigo-700/50 backdrop-blur-md max-w-md w-full"
      >
        <div className="absolute top-0 right-0 h-32 w-32 bg-gradient-to-br from-indigo-500/30 to-teal-400/30 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <div className="absolute bottom-0 left-0 h-32 w-32 bg-gradient-to-br from-purple-500/30 to-pink-400/30 rounded-full blur-3xl animate-pulse opacity-70"></div>
        <motion.div
          className="h-16 w-16 mx-auto mb-6 bg-gradient-to-r from-indigo-600 to-teal-500 rounded-full flex items-center justify-center"
          animate={{
            scale: [1, 1.1, 1],
            transition: { duration: 1.5, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Sparkles className="h-8 w-8 text-white animate-pulse" />
        </motion.div>
        <h2 className="text-2xl font-semibold text-slate-800 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient">
          Preparing Your ZenFlow Experience
        </h2>
        <p className="text-slate-600 dark:text-slate-200 mb-6">
          Loading your personalized dashboard...
        </p>
        <div className="relative h-2 w-full bg-white/20 dark:bg-indigo-900/50 rounded-full overflow-hidden">
          <motion.div
            className="absolute h-full bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        </div>
      </motion.div>
    </div>
  );
};

// Protected route component that uses our Supabase auth
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, session, isLoading, isAuthenticated, refreshSession } = useAuth();
  const location = useLocation();
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated && !isRefreshing) {
      setIsRefreshing(true);
      refreshSession().then((success) => {
        if (!success) {
          console.warn('Failed to refresh session, redirecting to signin');
        }
        setIsRefreshing(false);
      }).catch((error) => {
        console.error('Session refresh error:', error);
        setIsRefreshing(false);
      });
    }
  }, [isLoading, isAuthenticated, refreshSession, isRefreshing]);

  if (isLoading || isRefreshing) {
    return <CustomLoader />;
  }
  
  if (!isAuthenticated || !user || !session) {
    return <Navigate to="/signin" state={{ from: location }} replace />;
  }
  
  return (
    <ErrorBoundary fallback={
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-white/20 dark:bg-indigo-900/50 border border-white/30 dark:border-indigo-700/50 rounded-2xl p-6 max-w-md w-full backdrop-blur-md">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient">
            Something went wrong
          </h2>
          <p className="text-slate-600 dark:text-slate-200 mb-4">
            There was an error loading this page. This could be due to a temporary issue.
          </p>
          <div className="flex space-x-4">
            <button
              onClick={() => window.location.reload()}
              className="relative bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-3 px-6 rounded-xl text-sm font-semibold overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-teal-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Reload Page</span>
            </button>
            <button
              onClick={() => window.location.href = '/test'}
              className="relative border-white/40 bg-white/20 dark:bg-indigo-900/50 text-white dark:text-indigo-100 py-3 px-6 rounded-xl text-sm font-semibold overflow-hidden group shadow-md backdrop-blur-md hover:shadow-lg transition-all duration-300"
            >
              <span className="absolute inset-0 bg-white/30 dark:bg-indigo-800/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              <span className="relative">Go to Test Page</span>
            </button>
          </div>
        </div>
      </div>
    }>
      {children}
    </ErrorBoundary>
  );
};

// Redirect authenticated users to dashboard for public routes except landing page
const PublicRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <CustomLoader />;
  }

  // Allow landing page to render for all users, authenticated or not
  if (location.pathname === '/' || location.pathname === '') {
    console.log('PublicRoute: Rendering landing page for path /');
    return <>{children}</>;
  }

  // Redirect authenticated users to dashboard for other public routes
  if (isAuthenticated) {
    console.log('PublicRoute: User is authenticated, redirecting to /dashboard for path', location.pathname);
    return <Navigate to="/dashboard" replace />;
  }

  console.log('PublicRoute: User is not authenticated, rendering children for path', location.pathname);
  return <>{children}</>;
};

// Separate component for service initialization
const ServiceInitializer = () => {
  const { user, session, isAuthenticated, refreshSession } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user && session) {
      console.log('ServiceInitializer: Initializing services for authenticated user');
      initNotifications();
      prefetchService.prefetchUserData(user.id).catch(err => {
        console.warn('Prefetch error (non-critical):', err);
      });

      const refreshInterval = setInterval(async () => {
        if (session) {
          try {
            const expiresAt = new Date(session.expires_at * 1000);
            const now = new Date();
            const timeUntilExpiry = expiresAt.getTime() - now.getTime();
            if (timeUntilExpiry < 5 * 60 * 1000) {
              console.log('Token nearing expiry, refreshing...');
              const success = await refreshSession();
              if (!success) {
                console.warn('Token refresh failed');
              }
            }
          } catch (error) {
            console.error('Token refresh interval error:', error);
          }
        }
      }, 60 * 1000);

      return () => clearInterval(refreshInterval);
    }
  }, [user, session, isAuthenticated, refreshSession]);

  return null;
};

// App component with proper nesting of providers
const App = () => {
  return (
    <ErrorBoundary fallback={
      <div className="flex flex-col items-center justify-center h-screen p-4">
        <div className="bg-white/20 dark:bg-indigo-900/50 border border-white/30 dark:border-indigo-700/50 rounded-2xl p-6 max-w-md w-full backdrop-blur-md">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-teal-500 to-purple-600 bg-300% animate-gradient">
            Application Error
          </h2>
          <p className="text-slate-600 dark:text-slate-200 mb-4">
            An unexpected error occurred. Please try reloading the page or contact support.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="relative bg-gradient-to-r from-indigo-600 to-teal-500 text-white py-3 px-6 rounded-xl text-sm font-semibold overflow-hidden group shadow-md hover:shadow-lg transition-all duration-300"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-indigo-700 via-teal-600 to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
            <span className="relative">Reload Page</span>
          </button>
        </div>
      </div>
    }>
      <QueryClientProvider client={queryClient}>
        <ThemeProvider>
          <BrowserRouter>
            <AuthProvider>
              <ServiceInitializer />
              <TooltipProvider>
                <Toaster />
                <Sonner position="bottom-right" closeButton theme="light" />
                <Routes>
                  <Route path="/" element={
                    <PublicRoute>
                      <Landing />
                    </PublicRoute>
                  } />
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
                  <Route path="/setup" element={
                    <ProtectedRoute>
                      <SetupPage />
                    </ProtectedRoute>
                  } />
                  <Route path="/test" element={
                    <ProtectedRoute>
                      <TestPage />
                    </ProtectedRoute>
                  } />
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