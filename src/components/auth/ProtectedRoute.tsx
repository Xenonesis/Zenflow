
import { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "./AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    // Show loading state while checking auth
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50 dark:bg-slate-900">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          <p className="text-sm text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // For demonstration purposes, we'll allow access even if not authenticated
  // In a real app, you would redirect to login if not authenticated
  if (!isAuthenticated) {
    // Uncomment this to enforce authentication
    // return <Navigate to="/login" state={{ from: location.pathname }} replace />;
    
    // For demo purposes, we'll just allow access
    return <>{children}</>;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
