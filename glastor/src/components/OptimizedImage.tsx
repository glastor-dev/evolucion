import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { cn } from '@/lib/utils';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  onLoad?: () => void;
  onError?: () => void;
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
  loading?: 'lazy' | 'eager';
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  fallbackSrc?: string;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  priority = false,
  onLoad,
  onError,
  placeholder = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzk5YTNhZiIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkNhcmdhbmRvLi4uPC90ZXh0Pjwvc3ZnPg==",
  blurDataURL,
  sizes,
  quality = 75,
  loading = 'lazy',
  objectFit = 'cover',
  fallbackSrc,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [currentSrc, setCurrentSrc] = useState<string>('');
  const [retryCount, setRetryCount] = useState(0);
  const imgRef = useRef<HTMLImageElement>(null);
  
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
    skip: priority, // Skip intersection observer if priority is true
  });

  const shouldLoad = priority || inView;

  // Generate optimized src with quality parameter
  const getOptimizedSrc = useCallback((originalSrc: string, targetQuality: number = quality) => {
    if (originalSrc.includes('?')) {
      return `${originalSrc}&q=${targetQuality}`;
    }
    return `${originalSrc}?q=${targetQuality}`;
  }, [quality]);

  // Handle image loading with retry logic
  const handleLoad = useCallback(() => {
    setLoaded(true);
    setError(false);
    onLoad?.();
  }, [onLoad]);

  const handleError = useCallback(() => {
    if (retryCount < 2 && fallbackSrc) {
      setRetryCount(prev => prev + 1);
      setCurrentSrc(fallbackSrc);
    } else {
      setError(true);
      onError?.();
    }
  }, [retryCount, fallbackSrc, onError]);

  // Set current src when component mounts or src changes
  useEffect(() => {
    if (shouldLoad && src) {
      setCurrentSrc(getOptimizedSrc(src));
    }
  }, [src, shouldLoad, getOptimizedSrc]);

  // Error state component
  if (error) {
    return (
      <div 
        ref={ref}
        className={cn(
          "flex items-center justify-center bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 rounded-lg",
          className
        )}
        style={{ width, height }}
        role="img"
        aria-label={`Error loading image: ${alt}`}
      >
        <div className="flex flex-col items-center gap-2">
          <svg 
            className="w-6 h-6 sm:w-8 sm:h-8" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
            />
          </svg>
          <span className="text-xs text-center">Error al cargar imagen</span>
        </div>
      </div>
    );
  }

  return (
    <div ref={ref} className="relative overflow-hidden rounded-lg">
      {/* Main image */}
      {shouldLoad && currentSrc && (
        <img
          ref={imgRef}
          src={currentSrc}
          alt={alt}
          width={width}
          height={height}
          sizes={sizes}
          className={cn(
            "transition-all duration-500 ease-out",
            loaded ? "opacity-100 scale-100" : "opacity-0 scale-105",
            `object-${objectFit}`,
            className
          )}
          onLoad={handleLoad}
          onError={handleError}
          loading={loading}
          decoding="async"
          style={{
            aspectRatio: width && height ? `${width}/${height}` : undefined,
          }}
        />
      )}
      
      {/* Skeleton loader */}
      {!loaded && !error && (
        <div 
          className={cn(
            "absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200",
            "dark:from-gray-700 dark:via-gray-600 dark:to-gray-700",
            "animate-pulse rounded-lg"
          )}
          style={{ width, height }}
          aria-hidden="true"
        />
      )}
      
      {/* Blur placeholder effect */}
      {!loaded && !error && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className={cn(
            "absolute inset-0 w-full h-full object-cover filter blur-sm scale-110",
            "transition-opacity duration-500 opacity-60 rounded-lg"
          )}
          aria-hidden="true"
        />
      )}

      {/* Loading indicator */}
      {!loaded && !error && shouldLoad && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
};