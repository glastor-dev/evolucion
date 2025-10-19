import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
} from 'lucide-react';
import { AutoOptimizedImage } from './AutoOptimizedImage';
import { cn } from '@/lib/utils';
import { useImageGallerySwipe } from '@/hooks/useSwipeGestures';

interface ImageGalleryProps {
  images: string[];
  alt?: string;
  className?: string;
  thumbnailClassName?: string;
  aspectRatio?: string;
  initialIndex?: number;
  showThumbnails?: boolean;
  enableZoom?: boolean;
  enableFullscreen?: boolean;
  enableDownload?: boolean;
  lazyLoadingStrategy?: 'progressive' | 'immediate' | 'viewport';
  preloadCount?: number;
}

// Hook para lazy loading progresivo
const useProgressiveLazyLoading = (
  images: string[], 
  currentIndex: number, 
  strategy: 'progressive' | 'immediate' | 'viewport' = 'progressive',
  preloadCount: number = 2
) => {
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const [loadingImages, setLoadingImages] = useState<Set<number>>(new Set());
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Función para cargar una imagen
  const loadImage = useCallback((index: number) => {
    if (loadedImages.has(index) || loadingImages.has(index)) return;

    setLoadingImages(prev => new Set(prev).add(index));

    const img = new Image();
    img.onload = () => {
      setLoadedImages(prev => new Set(prev).add(index));
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    };
    img.onerror = () => {
      setLoadingImages(prev => {
        const newSet = new Set(prev);
        newSet.delete(index);
        return newSet;
      });
    };
    img.src = images[index];
  }, [images, loadedImages, loadingImages]);

  // Estrategia progresiva: cargar imagen actual + adyacentes
  useEffect(() => {
    if (strategy === 'progressive') {
      // Cargar imagen actual
      loadImage(currentIndex);
      
      // Cargar imágenes adyacentes
      for (let i = 1; i <= preloadCount; i++) {
        const nextIndex = (currentIndex + i) % images.length;
        const prevIndex = (currentIndex - i + images.length) % images.length;
        
        setTimeout(() => loadImage(nextIndex), i * 100);
        if (i <= Math.floor(preloadCount / 2)) {
          setTimeout(() => loadImage(prevIndex), i * 150);
        }
      }
    }
  }, [currentIndex, strategy, preloadCount, loadImage, images.length]);

  // Estrategia inmediata: cargar todas las imágenes
  useEffect(() => {
    if (strategy === 'immediate') {
      images.forEach((_, index) => {
        setTimeout(() => loadImage(index), index * 50);
      });
    }
  }, [strategy, images, loadImage]);

  return {
    loadedImages,
    loadingImages,
    loadImage,
    isImageLoaded: (index: number) => loadedImages.has(index),
    isImageLoading: (index: number) => loadingImages.has(index),
  };
};

export const ImageGallery: React.FC<ImageGalleryProps> = ({
  images,
  alt = 'Product image',
  className,
  thumbnailClassName,
  aspectRatio = '1/1',
  initialIndex = 0,
  showThumbnails = true,
  enableZoom = true,
  enableFullscreen = true,
  enableDownload = false,
  lazyLoadingStrategy = 'progressive',
  preloadCount = 3,
}) => {
  // Validar y sanitizar el array de imágenes
  const validImages = Array.isArray(images) && images.length > 0 
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : ['/placeholder-product.svg'];

  const [currentIndex, setCurrentIndex] = useState(Math.min(initialIndex, validImages.length - 1));
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });

  // Hook de lazy loading progresivo
  const { 
    loadedImages, 
    loadingImages, 
    isImageLoaded, 
    isImageLoading,
    loadImage 
  } = useProgressiveLazyLoading(validImages, currentIndex, lazyLoadingStrategy, preloadCount);

  // Navegación
  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % validImages.length);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [validImages.length]);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + validImages.length) % validImages.length);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, [validImages.length]);

  const goToIndex = useCallback((index: number) => {
    setCurrentIndex(index);
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  }, []);

  // Gestos de swipe para móvil
  const { swipeRef, isSwipeActive } = useImageGallerySwipe(
    currentIndex,
    validImages.length,
    goToNext,
    goToPrevious,
    {
      threshold: 30,
      enableVelocity: true,
      velocityThreshold: 0.2
    }
  );

  // Zoom
  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.5, 1));
    if (zoomLevel <= 1.5) {
      setImagePosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setZoomLevel(1);
    setImagePosition({ x: 0, y: 0 });
  };

  // Fullscreen
  const toggleFullscreen = () => {
    setIsFullscreen((prev) => !prev);
    resetZoom();
  };

  // Download
  const handleDownload = async () => {
    const image = validImages[currentIndex];
    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `image-${currentIndex + 1}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case 'ArrowLeft':
          goToPrevious();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'Escape':
          setIsFullscreen(false);
          break;
        case '+':
        case '=':
          handleZoomIn();
          break;
        case '-':
          handleZoomOut();
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, goToNext, goToPrevious]);

  // Drag to pan when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    setImagePosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Prevent body scroll when fullscreen
  useEffect(() => {
    if (isFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isFullscreen]);

  const currentImage = validImages[currentIndex];

  // Componente de imagen con lazy loading
  const LazyImage: React.FC<{
    src: string;
    alt: string;
    index: number;
    className?: string;
    aspectRatio?: string;
    enableZoom?: boolean;
    showSkeleton?: boolean;
  }> = ({ src, alt, index, className, aspectRatio, enableZoom, showSkeleton = true }) => {
    const isLoaded = isImageLoaded(index);
    const isLoading = isImageLoading(index);

    if (!isLoaded && !isLoading) {
      // Trigger loading when component mounts
      useEffect(() => {
        loadImage(index);
      }, [index]);

      return showSkeleton ? (
        <div className={cn("animate-pulse bg-slate-200 rounded-lg flex items-center justify-center", className)}>
          <div className="text-slate-400 text-sm">Cargando...</div>
        </div>
      ) : (
        <div className={cn("bg-slate-100 rounded-lg", className)} />
      );
    }

    if (isLoading) {
      return (
        <div className={cn("relative", className)}>
          <div className="absolute inset-0 animate-pulse bg-slate-200 rounded-lg flex items-center justify-center z-10">
            <div className="text-slate-400 text-sm">Cargando...</div>
          </div>
          <AutoOptimizedImage
            src={src}
            alt={alt}
            aspectRatio={aspectRatio}
            enableZoom={enableZoom}
            className="rounded-lg opacity-0"
          />
        </div>
      );
    }

    return (
      <AutoOptimizedImage
        src={src}
        alt={alt}
        aspectRatio={aspectRatio}
        enableZoom={enableZoom}
        className={cn("rounded-lg transition-opacity duration-300", className)}
      />
    );
  };

  return (
    <>
      {/* Main Gallery */}
      <div className={cn('space-y-4', className)}>
        {/* Main Image */}
        <motion.div 
          className="relative group"
          ref={(el) => {
            if (el && validImages.length > 1) {
              swipeRef(el);
            }
          }}
          drag={validImages.length > 1 ? "x" : false}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onPan={(event, info: PanInfo) => {
            if (validImages.length <= 1) return;
            
            const threshold = 100;
            if (Math.abs(info.offset.x) > threshold) {
              if (info.offset.x > 0) {
                goToPrevious();
              } else {
                goToNext();
              }
            }
          }}
          whileDrag={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <LazyImage
            src={currentImage}
            alt={`${alt} ${currentIndex + 1}`}
            index={currentIndex}
            aspectRatio={aspectRatio}
            enableZoom={enableZoom && !isFullscreen}
            className={cn(
              "w-full transition-transform duration-200",
              isSwipeActive && "cursor-grabbing",
              validImages.length > 1 && "cursor-grab"
            )}
          />

          {/* Loading indicator for main image */}
          {isImageLoading(currentIndex) && (
            <div className="absolute top-4 left-4 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full flex items-center gap-2">
              <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              Cargando imagen...
            </div>
          )}

          {/* Navigation Arrows */}
          {validImages.length > 1 && (
            <>
              <button
                onClick={goToPrevious}
                className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={goToNext}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Next image"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Action Buttons */}
          <div className="absolute top-2 right-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {enableFullscreen && (
              <button
                onClick={toggleFullscreen}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm"
                aria-label="Fullscreen"
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            )}
            {enableDownload && (
              <button
                onClick={handleDownload}
                className="p-2 bg-black/50 hover:bg-black/70 text-white rounded-lg backdrop-blur-sm"
                aria-label="Download"
              >
                <Download className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Image Counter */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-sm px-3 py-1 rounded-full">
            {currentIndex + 1} / {validImages.length}
          </div>

          {/* Loading Progress Indicator */}
          {lazyLoadingStrategy === 'progressive' && (
            <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">
              {loadedImages.size}/{validImages.length} cargadas
            </div>
          )}

          {/* Indicador de swipe para móvil */}
          {validImages.length > 1 && (
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full md:hidden">
              Desliza para navegar
            </div>
          )}
        </motion.div>

        {/* Thumbnails */}
        {showThumbnails && validImages.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToIndex(index)}
                className={cn(
                  'relative flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all',
                  index === currentIndex
                    ? 'border-primary ring-2 ring-primary/20'
                    : 'border-transparent hover:border-primary/50',
                  thumbnailClassName
                )}
              >
                <LazyImage
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  index={index}
                  aspectRatio="1/1"
                  className="w-full h-full"
                  showSkeleton={false}
                />
                
                {/* Loading indicator for thumbnails */}
                {isImageLoading(index) && (
                  <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                    <div className="w-4 h-4 border border-white border-t-transparent rounded-full animate-spin"></div>
                  </div>
                )}
                
                {index === currentIndex && (
                  <div className="absolute inset-0 bg-primary/10" />
                )}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {isFullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black"
          >
            {/* Close Button */}
            <button
              onClick={toggleFullscreen}
              className="absolute top-4 right-4 z-10 p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm"
              aria-label="Close fullscreen"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Zoom Controls */}
            <div className="absolute top-4 left-4 z-10 flex gap-2">
              <button
                onClick={handleZoomOut}
                disabled={zoomLevel <= 1}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm disabled:opacity-50"
                aria-label="Zoom out"
              >
                <ZoomOut className="w-5 h-5" />
              </button>
              <div className="px-3 py-2 bg-white/10 text-white rounded-lg backdrop-blur-sm text-sm font-medium">
                {Math.round(zoomLevel * 100)}%
              </div>
              <button
                onClick={handleZoomIn}
                disabled={zoomLevel >= 3}
                className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-lg backdrop-blur-sm disabled:opacity-50"
                aria-label="Zoom in"
              >
                <ZoomIn className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={goToPrevious}
                  className="absolute left-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
                  aria-label="Previous image"
                >
                  <ChevronLeft className="w-8 h-8" />
                </button>
                <button
                  onClick={goToNext}
                  className="absolute right-4 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/20 text-white rounded-full backdrop-blur-sm"
                  aria-label="Next image"
                >
                  <ChevronRight className="w-8 h-8" />
                </button>
              </>
            )}

            {/* Image Container */}
            <div
              className="absolute inset-0 flex items-center justify-center overflow-hidden"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              style={{ cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <motion.img
                src={currentImage}
                alt={`${alt} ${currentIndex + 1}`}
                className="max-w-full max-h-full object-contain"
                style={{
                  scale: zoomLevel,
                  x: imagePosition.x,
                  y: imagePosition.y,
                }}
                drag={zoomLevel > 1}
                dragConstraints={{
                  left: -200 * zoomLevel,
                  right: 200 * zoomLevel,
                  top: -200 * zoomLevel,
                  bottom: 200 * zoomLevel,
                }}
              />
            </div>

            {/* Counter */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur-sm text-white px-4 py-2 rounded-full">
              {currentIndex + 1} / {validImages.length}
            </div>

            {/* Keyboard Hints */}
            <div className="absolute bottom-4 right-4 bg-white/10 backdrop-blur-sm text-white text-xs px-3 py-2 rounded-lg">
              <div className="flex flex-col gap-1">
                <div>← → Navegar</div>
                <div>+ − Zoom</div>
                <div>ESC Cerrar</div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
