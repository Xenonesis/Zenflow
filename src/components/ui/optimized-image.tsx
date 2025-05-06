import React, { useState, useEffect, ImgHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  /** Fallback image to show when the main image fails to load */
  fallbackSrc?: string;
  /** Whether to lazy load the image */
  lazy?: boolean;
  /** Blur effect while loading */
  blurEffect?: boolean;
}

/**
 * Optimized image component with lazy loading and error handling
 */
export function OptimizedImage({
  src,
  alt,
  className,
  fallbackSrc,
  lazy = true,
  blurEffect = true,
  ...props
}: OptimizedImageProps) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string | undefined>(
    lazy ? undefined : src
  );

  useEffect(() => {
    if (!lazy) return;

    let isMounted = true;
    const img = new Image();
    img.src = src || '';
    
    img.onload = () => {
      if (isMounted) {
        setCurrentSrc(src);
        setLoaded(true);
      }
    };
    
    img.onerror = () => {
      if (isMounted && fallbackSrc) {
        setError(true);
        setCurrentSrc(fallbackSrc);
      } else if (isMounted) {
        setError(true);
      }
    };
    
    return () => {
      isMounted = false;
    };
  }, [src, fallbackSrc, lazy]);

  const handleError = () => {
    setError(true);
    if (fallbackSrc) {
      setCurrentSrc(fallbackSrc);
    }
  };

  const handleLoad = () => {
    setLoaded(true);
  };

  return (
    <div className="relative overflow-hidden">
      {blurEffect && !loaded && !error && (
        <div className={cn(
          "absolute inset-0 bg-gray-200 animate-pulse",
          className
        )} />
      )}
      
      <img
        src={currentSrc || fallbackSrc}
        alt={alt}
        onError={handleError}
        onLoad={handleLoad}
        loading={lazy ? "lazy" : undefined}
        className={cn(
          "transition-opacity duration-300",
          loaded ? "opacity-100" : "opacity-0",
          error && !fallbackSrc && "hidden",
          className
        )}
        {...props}
      />
      
      {error && !fallbackSrc && (
        <div className={cn(
          "flex items-center justify-center bg-gray-100 text-gray-400 text-sm",
          className
        )}>
          Image not available
        </div>
      )}
    </div>
  );
} 