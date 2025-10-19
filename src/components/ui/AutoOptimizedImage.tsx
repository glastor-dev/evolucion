import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, ImageOff } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AutoOptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
  quality?: number;
  sizes?: string;
  onLoad?: () => void;
  onError?: () => void;
  blurDataURL?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  aspectRatio?: string;
  enableZoom?: boolean;
  showSkeleton?: boolean;
}

// Detectar soporte de formatos modernos
const supportsWebP = () => {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0;
};

const supportsAVIF = () => {
  if (typeof window === 'undefined') return false;
  const canvas = document.createElement('canvas');
  return canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0;
};

// Generar srcset para diferentes tamaños
const generateSrcSet = (src: string, widths: number[] = [320, 640, 768, 1024, 1280, 1920]) => {
  // Si es URL externa, retornar tal cual
  if (src.startsWith('http')) {
    return widths.map(w => `${src} ${w}w`).join(', ');
  }
  
  // Para imágenes locales, agregar parámetros de tamaño
  return widths.map(w => `${src}?w=${w} ${w}w`).join(', ');
};

// Convertir URL a formato optimizado
const optimizeImageUrl = (src: string, format: 'webp' | 'avif' | 'original' = 'original') => {
  if (!src || src.startsWith('data:')) return src;
  
  // ⚠️ NO optimizar URLs externas - usar tal cual
  if (src.startsWith('http://') || src.startsWith('https://')) {
    return src;
  }
  
  // Para imágenes locales, cambiar extensión
  if (format === 'webp') {
    return src.replace(/\.(jpe?g|png)$/i, '.webp');
  }
  if (format === 'avif') {
    return src.replace(/\.(jpe?g|png)$/i, '.avif');
  }
  
  return src;
};

export const AutoOptimizedImage: React.FC<AutoOptimizedImageProps> = ({
  src,
  alt,
  className,
  width,
  height,
  priority = false,
  quality = 85,
  sizes = '100vw',
  onLoad,
  onError,
  blurDataURL,
  objectFit = 'cover',
  aspectRatio,
  enableZoom = false,
  showSkeleton = true,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Detectar formatos soportados
  const [formatSupport, setFormatSupport] = useState({
    webp: false,
    avif: false,
  });

  useEffect(() => {
    setFormatSupport({
      webp: supportsWebP(),
      avif: supportsAVIF(),
    });
  }, []);

  // Intersection Observer para lazy loading
  useEffect(() => {
    if (priority || isInView) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      {
        rootMargin: '50px', // Cargar 50px antes de que sea visible
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isInView]);

  // Handlers
  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
    onLoad?.();
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
    onError?.();
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!enableZoom || !isZoomed || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setZoomPosition({ x, y });
  };

  // Determinar el mejor formato
  const getOptimalFormat = (): 'avif' | 'webp' | 'original' => {
    if (formatSupport.avif) return 'avif';
    if (formatSupport.webp) return 'webp';
    return 'original';
  };

  // Detectar si es URL externa
  const isExternalUrl = src.startsWith('http://') || src.startsWith('https://');
  
  const optimalFormat = isExternalUrl ? 'original' : getOptimalFormat();
  const optimizedSrc = isExternalUrl ? src : optimizeImageUrl(src, optimalFormat);
  const srcSet = isExternalUrl ? undefined : generateSrcSet(src);

  // Estilos
  const aspectRatioStyle = aspectRatio ? { aspectRatio } : {};
  const objectFitStyle = { objectFit };

  return (
    <div
      ref={containerRef}
      className={cn('relative overflow-hidden bg-muted', className)}
      style={{ ...aspectRatioStyle }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => enableZoom && setIsZoomed(true)}
      onMouseLeave={() => enableZoom && setIsZoomed(false)}
    >
      {/* Skeleton Loader */}
      <AnimatePresence>
        {isLoading && showSkeleton && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-muted animate-pulse flex items-center justify-center"
          >
            <Loader2 className="w-8 h-8 text-muted-foreground animate-spin" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Blur Placeholder */}
      {blurDataURL && isLoading && (
        <div
          className="absolute inset-0 blur-xl scale-110"
          style={{
            backgroundImage: `url(${blurDataURL})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      )}

      {/* Error State */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-muted text-muted-foreground">
          <ImageOff className="w-12 h-12 mb-2 opacity-50" />
          <p className="text-sm">Error al cargar imagen</p>
        </div>
      )}

      {/* Image with Picture element for format selection */}
      {isInView && !hasError && (
        <>
          {isExternalUrl ? (
            // Para URLs externas, usar img simple sin optimización
            <motion.img
              ref={imgRef}
              src={src}
              alt={alt}
              width={width}
              height={height}
              loading={priority ? 'eager' : 'lazy'}
              decoding="async"
              onLoad={handleLoad}
              onError={handleError}
              className={cn(
                'w-full h-full transition-all duration-300',
                isLoading && 'opacity-0 scale-95',
                !isLoading && 'opacity-100 scale-100',
                enableZoom && 'cursor-zoom-in',
                isZoomed && 'cursor-zoom-out scale-150'
              )}
              style={{
                ...objectFitStyle,
                transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
              }}
            />
          ) : (
            // Para URLs locales, usar picture con múltiples formatos
            <picture>
              {/* AVIF - Mejor compresión */}
              {formatSupport.avif && (
                <source
                  type="image/avif"
                  srcSet={generateSrcSet(optimizeImageUrl(src, 'avif'))}
                  sizes={sizes}
                />
              )}

              {/* WebP - Buena compresión, amplio soporte */}
              {formatSupport.webp && (
                <source
                  type="image/webp"
                  srcSet={generateSrcSet(optimizeImageUrl(src, 'webp'))}
                  sizes={sizes}
                />
              )}

              {/* Fallback - JPEG/PNG original */}
              <motion.img
                ref={imgRef}
                src={optimizedSrc}
                srcSet={srcSet}
                sizes={sizes}
                alt={alt}
                width={width}
                height={height}
                loading={priority ? 'eager' : 'lazy'}
                decoding="async"
                onLoad={handleLoad}
                onError={handleError}
                className={cn(
                  'w-full h-full transition-all duration-300',
                  isLoading && 'opacity-0 scale-95',
                  !isLoading && 'opacity-100 scale-100',
                  enableZoom && 'cursor-zoom-in',
                  isZoomed && 'cursor-zoom-out scale-150'
                )}
                style={{
                  ...objectFitStyle,
                  transformOrigin: `${zoomPosition.x}% ${zoomPosition.y}%`,
                }}
              />
            </picture>
          )}
        </>
      )}

      {/* Zoom Indicator */}
      {enableZoom && !isLoading && !hasError && (
        <div className="absolute top-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
          {isZoomed ? 'Click para alejar' : 'Hover para zoom'}
        </div>
      )}
    </div>
  );
};

// HOC para envolver imágenes existentes
export const withImageOptimization = <P extends object>(
  Component: React.ComponentType<P>
) => {
  return (props: P) => {
    // Interceptar props de imagen y optimizar
    return <Component {...props} />;
  };
};

// Hook para precargar imágenes
export const useImagePreload = (urls: string[]) => {
  useEffect(() => {
    urls.forEach((url) => {
      const img = new Image();
      img.src = url;
    });
  }, [urls]);
};

// Utilidad para generar blur placeholder
export const generateBlurDataURL = (src: string): string => {
  // En producción, esto se generaría en build time
  // Por ahora, retornamos un placeholder simple
  return `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Cfilter id='b' color-interpolation-filters='sRGB'%3E%3CfeGaussianBlur stdDeviation='20'/%3E%3C/filter%3E%3Cimage preserveAspectRatio='none' filter='url(%23b)' x='0' y='0' height='100%25' width='100%25' href='${src}'/%3E%3C/svg%3E`;
};
