import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ZoomIn, ZoomOut, RotateCw, Move, X, Maximize2 } from 'lucide-react';
import { Button } from './button';

interface AdvancedImageZoomProps {
  src: string;
  alt: string;
  className?: string;
  enableMagnifier?: boolean;
  enableFullscreen?: boolean;
  enableRotation?: boolean;
  magnifierSize?: number;
  zoomLevel?: number;
}

export const AdvancedImageZoom: React.FC<AdvancedImageZoomProps> = ({
  src,
  alt,
  className = '',
  enableMagnifier = true,
  enableFullscreen = true,
  enableRotation = false,
  magnifierSize = 150,
  zoomLevel = 2
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPos, setMagnifierPos] = useState({ x: 0, y: 0 });

  const imageRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Magnifier functionality
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!enableMagnifier || !imageRef.current) return;

    const rect = imageRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setMagnifierPos({ x, y });
  }, [enableMagnifier]);

  const handleMouseEnter = useCallback(() => {
    if (enableMagnifier && !isZoomed) {
      setShowMagnifier(true);
    }
  }, [enableMagnifier, isZoomed]);

  const handleMouseLeave = useCallback(() => {
    setShowMagnifier(false);
  }, []);

  // Zoom functionality
  const handleZoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.5, 4));
  }, []);

  const handleZoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.5, 0.5));
  }, []);

  const handleZoomToggle = useCallback(() => {
    setIsZoomed(prev => !prev);
    if (!isZoomed) {
      setScale(zoomLevel);
    } else {
      setScale(1);
      setPosition({ x: 0, y: 0 });
    }
  }, [isZoomed, zoomLevel]);

  // Rotation functionality
  const handleRotate = useCallback(() => {
    setRotation(prev => (prev + 90) % 360);
  }, []);

  // Drag functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (isZoomed && scale > 1) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [isZoomed, scale, position]);

  const handleMouseMoveZoom = useCallback((e: React.MouseEvent) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Fullscreen functionality
  const handleFullscreen = useCallback(() => {
    setIsFullscreen(true);
    setIsZoomed(true);
    setScale(zoomLevel);
  }, [zoomLevel]);

  const handleCloseFullscreen = useCallback(() => {
    setIsFullscreen(false);
    setIsZoomed(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setRotation(0);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isFullscreen) return;

      switch (e.key) {
        case 'Escape':
          handleCloseFullscreen();
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
          if (enableRotation) {
            handleRotate();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          setPosition(prev => ({ ...prev, x: prev.x + 20 }));
          break;
        case 'ArrowRight':
          e.preventDefault();
          setPosition(prev => ({ ...prev, x: prev.x - 20 }));
          break;
        case 'ArrowUp':
          e.preventDefault();
          setPosition(prev => ({ ...prev, y: prev.y + 20 }));
          break;
        case 'ArrowDown':
          e.preventDefault();
          setPosition(prev => ({ ...prev, y: prev.y - 20 }));
          break;
      }
    };

    if (isFullscreen) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [isFullscreen, enableRotation, handleZoomIn, handleZoomOut, handleRotate, handleCloseFullscreen]);

  const imageStyle = {
    transform: `scale(${scale}) rotate(${rotation}deg) translate(${position.x}px, ${position.y}px)`,
    cursor: isZoomed && scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in',
    transition: isDragging ? 'none' : 'transform 0.3s ease'
  };

  const magnifierStyle = {
    position: 'absolute' as const,
    left: magnifierPos.x - magnifierSize / 2,
    top: magnifierPos.y - magnifierSize / 2,
    width: magnifierSize,
    height: magnifierSize,
    border: '2px solid #fff',
    borderRadius: '50%',
    boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
    backgroundImage: `url(${src})`,
    backgroundSize: `${imageRef.current?.naturalWidth || 0 * zoomLevel}px ${imageRef.current?.naturalHeight || 0 * zoomLevel}px`,
    backgroundPosition: `-${magnifierPos.x * zoomLevel - magnifierSize / 2}px -${magnifierPos.y * zoomLevel - magnifierSize / 2}px`,
    pointerEvents: 'none' as const,
    zIndex: 1000
  };

  return (
    <>
      {/* Main Image Container */}
      <div 
        ref={containerRef}
        className={`relative overflow-hidden ${className}`}
        onMouseMove={handleMouseMove}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="w-full h-full object-contain"
          style={imageStyle}
          onClick={handleZoomToggle}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMoveZoom}
          onMouseUp={handleMouseUp}
          draggable={false}
        />

        {/* Magnifier */}
        {showMagnifier && enableMagnifier && (
          <div style={magnifierStyle} />
        )}

        {/* Controls */}
        <div className="absolute top-2 right-2 flex gap-1">
          <Button
            size="sm"
            variant="secondary"
            onClick={handleZoomToggle}
            aria-label={isZoomed ? "Reducir zoom" : "Ampliar imagen"}
          >
            {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
          </Button>
          
          {enableRotation && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleRotate}
              aria-label="Rotar imagen"
            >
              <RotateCw className="w-4 h-4" />
            </Button>
          )}
          
          {enableFullscreen && (
            <Button
              size="sm"
              variant="secondary"
              onClick={handleFullscreen}
              aria-label="Ver en pantalla completa"
            >
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>

        {/* Zoom Controls (when zoomed) */}
        {isZoomed && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            <Button
              size="sm"
              variant="secondary"
              onClick={handleZoomOut}
              disabled={scale <= 0.5}
              aria-label="Reducir zoom"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>
            <Button
              size="sm"
              variant="secondary"
              onClick={handleZoomIn}
              disabled={scale >= 4}
              aria-label="Aumentar zoom"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center">
          <div className="relative w-full h-full flex items-center justify-center">
            <img
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              style={imageStyle}
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMoveZoom}
              onMouseUp={handleMouseUp}
              draggable={false}
            />

            {/* Fullscreen Controls */}
            <div className="absolute top-4 right-4 flex gap-2">
              {enableRotation && (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={handleRotate}
                  aria-label="Rotar imagen"
                >
                  <RotateCw className="w-4 h-4" />
                </Button>
              )}
              <Button
                size="sm"
                variant="secondary"
                onClick={handleCloseFullscreen}
                aria-label="Cerrar pantalla completa"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Fullscreen Zoom Controls */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              <Button
                size="sm"
                variant="secondary"
                onClick={handleZoomOut}
                disabled={scale <= 0.5}
                aria-label="Reducir zoom"
              >
                <ZoomOut className="w-4 h-4" />
              </Button>
              <span className="px-3 py-1 bg-black bg-opacity-50 text-white rounded text-sm">
                {Math.round(scale * 100)}%
              </span>
              <Button
                size="sm"
                variant="secondary"
                onClick={handleZoomIn}
                disabled={scale >= 4}
                aria-label="Aumentar zoom"
              >
                <ZoomIn className="w-4 h-4" />
              </Button>
            </div>

            {/* Instructions */}
            <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-50 p-2 rounded">
              <div>Esc: Cerrar</div>
              <div>+/-: Zoom</div>
              <div>Flechas: Mover</div>
              {enableRotation && <div>R: Rotar</div>}
            </div>
          </div>
        </div>
      )}
    </>
  );
};