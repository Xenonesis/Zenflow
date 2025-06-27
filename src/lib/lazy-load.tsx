import React, { Suspense, lazy, ComponentType } from 'react';
import { Spinner } from '@/components/ui/spinner';

/**
 * Default loading component shown while lazy-loaded components are loading
 */
export const DefaultLoadingFallback = () => (
  <div className="flex h-screen w-full items-center justify-center bg-background">
    <div className="text-center">
      <Spinner size="lg" className="mb-2" />
      <p className="text-sm text-muted-foreground">Loading page...</p>
    </div>
  </div>
);

/**
 * Custom error boundary for lazy loaded components
 */
class LazyErrorBoundary extends React.Component<
  { children: React.ReactNode, fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode, fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error in lazy-loaded component:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }

    return this.props.children;
  }
}

/**
 * Default error component shown when lazy-loaded components fail to load
 */
export const DefaultErrorFallback = () => (
  <div className="flex h-screen w-full flex-col items-center justify-center bg-background p-4">
    <div className="w-full max-w-md rounded-lg border border-destructive/20 bg-destructive/10 p-6 text-center">
      <h2 className="mb-2 text-xl font-semibold text-destructive">Failed to load page</h2>
      <p className="mb-4 text-sm text-destructive/80">
        There was an error loading this page. Please try refreshing your browser.
      </p>
      <button
        onClick={() => window.location.reload()}
        className="rounded bg-primary px-4 py-2 text-sm text-primary-foreground hover:bg-primary/90"
      >
        Refresh page
      </button>
    </div>
  </div>
);

/**
 * Options for lazy loading components
 */
interface LazyLoadOptions {
  /** Component to show while loading the lazy component */
  loadingComponent?: React.ReactNode;
  /** Component to show if loading the lazy component fails */
  errorComponent?: React.ReactNode;
  /** Whether to preload the component when the page loads */
  preload?: boolean;
}

/**
 * Creates a lazy-loaded component with loading and error states
 * @param factory Factory function that imports the component
 * @param options Configuration options
 * @returns Lazy-loaded component
 */
export function lazyLoad<T extends ComponentType<any>>(
  factory: () => Promise<{ default: T }>,
  options: LazyLoadOptions = {}
) {
  const {
    loadingComponent = <DefaultLoadingFallback />,
    errorComponent = <DefaultErrorFallback />,
    preload = false,
  } = options;

  const LazyComponent = lazy(factory);

  // Preload the component if specified
  if (preload) {
    factory().catch(err => {
      console.warn('Error preloading component:', err);
    });
  }

  return (props: React.ComponentProps<T>) => (
    <LazyErrorBoundary fallback={errorComponent}>
      <Suspense fallback={loadingComponent}>
        <LazyComponent {...props} />
      </Suspense>
    </LazyErrorBoundary>
  );
} 