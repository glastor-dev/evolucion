import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Maximize, X, Move } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { AutoOptimizedImage } from '@/components/ui/AutoOptimizedImage';

interface AdvancedImageZoomProps {
  images: string[];
  alt: string;
  onImageLoad?: () => void;
  onZoomChange?: (zoomLevel: number) => void;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export const AdvancedImageZoom: React.FC<AdvancedImageZoomProps> = ({
  images,
  alt,
  onImageLoad,
  onZoomChange,
  onFullscreenToggle
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [imagePosition, setImagePosition] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });

  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  const currentImage = images[currentImageIndex] || images[0];

  const handleZoomIn = useCallback(() => {
    const newZoom = Math.min(zoomLevel * 1.5, 5);
    setZoomLevel(newZoom);
    onZoomChange?.(newZoom);
  }, [zoomLevel, onZoomChange]);

  const handleZoomOut = useCallback(() => {
    const newZoom = Math.max(zoomLevel / 1.5, 0.5);
    setZoomLevel(newZoom);
    onZoomChange?.(newZoom);
  }, [zoomLevel, onZoomChange]);

  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  const toggleFullscreen = useCallback(() => {
    const newFullscreen = !isFullscreen;
    setIsFullscreen(newFullscreen);
    onFullscreenToggle?.(newFullscreen);
    
    if (newFullscreen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setZoomLevel(1);
      setImagePosition({ x: 0, y: 0 });
    }
  }, [isFullscreen, onFullscreenToggle]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (zoomLevel > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - imagePosition.x, y: e.clientY - imagePosition.y });
    }
  }, [zoomLevel, imagePosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isDragging && zoomLevel > 1) {
      setImagePosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }

    // Magnifier logic
    if (containerRef.current && imageRef.current && !isDragging) {
      const rect = containerRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setMagnifierPosition({ x, y });
    }
  }, [isDragging, dragStart, zoomLevel]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isFullscreen) return;

    switch (e.key) {
      case 'Escape':
        toggleFullscreen();
        break;
      case '+':
      case '=':
        e.preventDefault();
        handleZoomIn();
        break;
      case '-':
        e.preventDefault();
        handleZoomOut();
        break;
      case 'r':
      case 'R':
        e.preventDefault();
        handleRotate();
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (images.length > 1) {
          setCurrentImageIndex(prev => (prev - 1 + images.length) % images.length);
        }
        break;
      case 'ArrowRight':
        e.preventDefault();
        if (images.length > 1) {
          setCurrentImageIndex(prev => (prev + 1) % images.length);
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (zoomLevel > 1) {
          setImagePosition(prev => ({ ...prev, y: prev.y + 50 }));
        }
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (zoomLevel > 1) {
          setImagePosition(prev => ({ ...prev, y: prev.y - 50 }));
        }
        break;
    }
  }, [isFullscreen, toggleFullscreen, handleZoomIn, handleZoomOut, handleRotate, images.length, zoomLevel]);

  useEffect(() => {
    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen, handleKeyDown]);

  useEffect(() => {
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  const imageStyle = {
    transform: `scale(${zoomLevel}) rotate(${rotation}deg) translate(${imagePosition.x / zoomLevel}px, ${imagePosition.y / zoomLevel}px)`,
    cursor: zoomLevel > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
    transition: isDragging ? 'none' : 'transform 0.3s ease'
  };

  return (
    <>
      <div
        ref={containerRef}
        className="relative group bg-gray-50 rounded-lg overflow-hidden"
        onMouseEnter={() => setShowMagnifier(true)}
        onMouseLeave={() => setShowMagnifier(false)}
        onMouseMove={handleMouseMove}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
      >
        <AutoOptimizedImage
          ref={imageRef}
          src={currentImage}
          alt={alt}
          className="w-full h-auto select-none"
          style={imageStyle}
          onLoad={onImageLoad}
          draggable={false}
        />

        {/* Controls */}
        <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomIn}
            disabled={zoomLevel >= 5}
            aria-label="Acercar imagen"
          >
            <ZoomIn className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomOut}
            disabled={zoomLevel <= 0.5}
            aria-label="Alejar imagen"
          >
            <ZoomOut className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={handleRotate}
            aria-label="Rotar imagen"
          >
            <RotateCw className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            onClick={toggleFullscreen}
            aria-label="Pantalla completa"
          >
            <Maximize className="w-4 h-4" />
          </Button>
        </div>

        {/* Image navigation */}
        {images.length > 1 && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
            {images.map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentImageIndex ? 'bg-white' : 'bg-white/50'
                }`}
                onClick={() => setCurrentImageIndex(index)}
                aria-label={`Ver imagen ${index + 1}`}
              />
            ))}
          </div>
        )}

        {/* Magnifier */}
        {showMagnifier && zoomLevel === 1 && (
          <div
            className="absolute pointer-events-none border-2 border-white rounded-full shadow-lg"
            style={{
              width: '100px',
              height: '100px',
              left: magnifierPosition.x - 50,
              top: magnifierPosition.y - 50,
              backgroundImage: `url(${currentImage})`,
              backgroundSize: '400%',
              backgroundPosition: `${-magnifierPosition.x * 4 + 50}px ${-magnifierPosition.y * 4 + 50}px`,
              backgroundRepeat: 'no-repeat'
            }}
          />
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
          <Button
            className="absolute top-4 right-4 z-10"
            variant="secondary"
            size="sm"
            onClick={toggleFullscreen}
            aria-label="Cerrar pantalla completa"
          >
            <X className="w-4 h-4" />
          </Button>

          <div className="relative w-full h-full flex items-center justify-center p-4">
            <AutoOptimizedImage
              src={currentImage}
              alt={alt}
              className="max-w-full max-h-full object-contain select-none"
              style={imageStyle}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              draggable={false}
            />

            {/* Fullscreen Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2 bg-black/50 rounded-lg p-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleZoomOut}
                disabled={zoomLevel <= 0.5}
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleZoomIn}
                disabled={zoomLevel >= 5}
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleRotate}
              >
                <RotateCw className="w-4 h-4" />
              </Button>
              {zoomLevel > 1 && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => {
                    setZoomLevel(1);
                    setImagePosition({ x: 0, y: 0 });
                  }}
                >
                  <Move className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};