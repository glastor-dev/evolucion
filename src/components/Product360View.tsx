import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { RotateCw, Play, Pause, RotateCcw, Maximize2, Minimize2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Product360ViewProps {
  images: string[];
  productName: string;
  className?: string;
  autoRotate?: boolean;
  rotationSpeed?: number;
  onImageLoad?: (index: number) => void;
  onRotationStart?: () => void;
  onRotationStop?: () => void;
}

export const Product360View: React.FC<Product360ViewProps> = ({
  images,
  productName,
  className,
  autoRotate = false,
  rotationSpeed = 100,
  onImageLoad,
  onRotationStart,
  onRotationStop
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isRotating, setIsRotating] = useState(autoRotate);
  const [isDragging, setIsDragging] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [imagesLoaded, setImagesLoaded] = useState<boolean[]>(new Array(images.length).fill(false));
  
  const containerRef = useRef<HTMLDivElement>(null);
  const rotationIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const dragStartXRef = useRef<number>(0);
  const lastImageIndexRef = useRef<number>(0);

  // Preload images
  useEffect(() => {
    images.forEach((src, index) => {
      const img = new Image();
      img.onload = () => {
        setImagesLoaded(prev => {
          const newLoaded = [...prev];
          newLoaded[index] = true;
          return newLoaded;
        });
        onImageLoad?.(index);
      };
      img.src = src;
    });
  }, [images, onImageLoad]);

  // Auto rotation
  useEffect(() => {
    if (isRotating && !isDragging) {
      rotationIntervalRef.current = setInterval(() => {
        setCurrentImageIndex(prev => (prev + 1) % images.length);
      }, rotationSpeed);
      onRotationStart?.();
    } else {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
        rotationIntervalRef.current = null;
      }
      onRotationStop?.();
    }

    return () => {
      if (rotationIntervalRef.current) {
        clearInterval(rotationIntervalRef.current);
      }
    };
  }, [isRotating, isDragging, images.length, rotationSpeed, onRotationStart, onRotationStop]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.clientX;
    lastImageIndexRef.current = currentImageIndex;
    e.preventDefault();
  }, [currentImageIndex]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartXRef.current;
    const sensitivity = 5; // Pixels per image
    const imageChange = Math.floor(deltaX / sensitivity);
    
    let newIndex = (lastImageIndexRef.current + imageChange) % images.length;
    if (newIndex < 0) newIndex = images.length + newIndex;
    
    setCurrentImageIndex(newIndex);
  }, [isDragging, images.length]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    setIsDragging(true);
    dragStartXRef.current = e.touches[0].clientX;
    lastImageIndexRef.current = currentImageIndex;
  }, [currentImageIndex]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging) return;

    const deltaX = e.touches[0].clientX - dragStartXRef.current;
    const sensitivity = 3;
    const imageChange = Math.floor(deltaX / sensitivity);
    
    let newIndex = (lastImageIndexRef.current + imageChange) % images.length;
    if (newIndex < 0) newIndex = images.length + newIndex;
    
    setCurrentImageIndex(newIndex);
  }, [isDragging, images.length]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  const toggleRotation = useCallback(() => {
    setIsRotating(prev => !prev);
  }, []);

  const rotateClockwise = useCallback(() => {
    setCurrentImageIndex(prev => (prev + 1) % images.length);
  }, [images.length]);

  const rotateCounterClockwise = useCallback(() => {
    setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
  }, [images.length]);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(prev => !prev);
  }, []);

  const allImagesLoaded = imagesLoaded.every(loaded => loaded);
  const loadedPercentage = Math.round((imagesLoaded.filter(loaded => loaded).length / images.length) * 100);

  if (images.length === 0) {
    return (
      <Card className={cn("p-8 text-center", className)}>
        <p className="text-muted-foreground">No hay imágenes disponibles para la vista 360°</p>
      </Card>
    );
  }

  return (
    <div className={cn("relative", className)}>
      <Card className={cn(
        "relative overflow-hidden transition-all duration-300",
        isFullscreen && "fixed inset-0 z-50 rounded-none"
      )}>
        {/* Loading indicator */}
        {!allImagesLoaded && (
          <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4" />
              <p className="text-sm text-muted-foreground">Cargando vista 360°...</p>
              <Badge variant="outline" className="mt-2">
                {loadedPercentage}%
              </Badge>
            </div>
          </div>
        )}

        {/* 360° Image Container */}
        <div
          ref={containerRef}
          className={cn(
            "relative bg-background select-none cursor-grab",
            isDragging && "cursor-grabbing",
            isFullscreen ? "h-screen" : "aspect-square"
          )}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          role="img"
          aria-label={`Vista 360° de ${productName}, imagen ${currentImageIndex + 1} de ${images.length}`}
          tabIndex={0}
          onKeyDown={(e) => {
            switch (e.key) {
              case 'ArrowLeft':
                e.preventDefault();
                rotateCounterClockwise();
                break;
              case 'ArrowRight':
                e.preventDefault();
                rotateClockwise();
                break;
              case ' ':
                e.preventDefault();
                toggleRotation();
                break;
              case 'f':
              case 'F':
                e.preventDefault();
                toggleFullscreen();
                break;
            }
          }}
        >
          <img
            src={images[currentImageIndex]}
            alt={`${productName} - Vista ${currentImageIndex + 1}`}
            className="w-full h-full object-contain transition-opacity duration-150"
            draggable={false}
          />

          {/* Rotation indicator */}
          {isRotating && (
            <div className="absolute top-4 left-4">
              <Badge variant="secondary" className="flex items-center gap-1">
                <RotateCw className="w-3 h-3 animate-spin" />
                Rotando
              </Badge>
            </div>
          )}

          {/* Image counter */}
          <div className="absolute top-4 right-4">
            <Badge variant="outline">
              {currentImageIndex + 1} / {images.length}
            </Badge>
          </div>

          {/* Instructions */}
          <div className="absolute bottom-4 left-4 right-4">
            <Badge variant="secondary" className="w-full justify-center text-xs">
              Arrastra para rotar • Flechas para navegar • Espacio para auto-rotar
            </Badge>
          </div>
        </div>

        {/* Controls */}
        <div className="absolute bottom-4 right-4 flex gap-2">
          <Button
            size="sm"
            variant="secondary"
            onClick={rotateCounterClockwise}
            aria-label="Rotar hacia la izquierda"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleRotation}
            aria-label={isRotating ? "Pausar rotación" : "Iniciar rotación"}
          >
            {isRotating ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={rotateClockwise}
            aria-label="Rotar hacia la derecha"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleFullscreen}
            aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
        </div>
      </Card>

      {/* Fullscreen overlay */}
      {isFullscreen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40"
          onClick={toggleFullscreen}
        />
      )}
    </div>
  );
};