import React from 'react';
import { useAuth } from '@/lib/auth-context';

// This is a placeholder component
// It will be shown when the real UserButton can't be rendered
const FallbackUserButton = () => {
  return (
    <div className="h-8 w-8 rounded-full bg-gray-300 flex items-center justify-center">
      <span className="text-xs">U</span>
    </div>
  );
};

export const UserButtonWrapper = () => {
  // Check if we're inside an AuthProvider context
  let authContextAvailable = true;
  try {
    // Just testing if we can access the auth context
    useAuth();
  } catch (error) {
    console.error("Auth context not available:", error);
    authContextAvailable = false;
  }

  if (!authContextAvailable) {
    return <FallbackUserButton />;
  }

  // Only import and render the actual UserButton if auth context is available
  // This should prevent the error from occurring
  try {
    // Dynamic import to ensure it only happens if auth context is available
    const UserButton = React.lazy(() => import('./UserButton').then(module => ({ 
      default: module.UserButton || module.default
    })));

    return (
      <React.Suspense fallback={<FallbackUserButton />}>
        <UserButton />
      </React.Suspense>
    );
  } catch (error) {
    console.error("Error loading UserButton:", error);
    return <FallbackUserButton />;
  }
}; 