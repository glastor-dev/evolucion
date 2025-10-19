import { useCallback, useRef, useState, useEffect } from 'react';

interface SwipeGestureOptions {
  onSwipeLeft?: () => void;
  onSwipeRight?: () => void;
  onSwipeUp?: () => void;
  onSwipeDown?: () => void;
  threshold?: number;
  preventDefaultTouchmove?: boolean;
  enableVelocity?: boolean;
  velocityThreshold?: number;
}

interface TouchPoint {
  x: number;
  y: number;
  time: number;
}

export const useSwipeGestures = (options: SwipeGestureOptions = {}) => {
  const {
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown,
    threshold = 50,
    preventDefaultTouchmove = false,
    enableVelocity = true,
    velocityThreshold = 0.3
  } = options;

  const touchStartRef = useRef<TouchPoint | null>(null);
  const touchEndRef = useRef<TouchPoint | null>(null);
  const [isSwipeActive, setIsSwipeActive] = useState(false);

  const calculateDistance = useCallback((start: TouchPoint, end: TouchPoint) => {
    return {
      x: end.x - start.x,
      y: end.y - start.y,
      distance: Math.sqrt(Math.pow(end.x - start.x, 2) + Math.pow(end.y - start.y, 2)),
      time: end.time - start.time
    };
  }, []);

  const calculateVelocity = useCallback((distance: number, time: number) => {
    return time > 0 ? Math.abs(distance) / time : 0;
  }, []);

  const handleTouchStart = useCallback((e: TouchEvent) => {
    const touch = e.touches[0];
    touchStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };
    setIsSwipeActive(true);
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (preventDefaultTouchmove && touchStartRef.current) {
      e.preventDefault();
    }
  }, [preventDefaultTouchmove]);

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStartRef.current) return;

    const touch = e.changedTouches[0];
    touchEndRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      time: Date.now()
    };

    const { x: deltaX, y: deltaY, time: deltaTime } = calculateDistance(
      touchStartRef.current,
      touchEndRef.current
    );

    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    // Verificar si el movimiento supera el umbral
    if (Math.max(absX, absY) < threshold) {
      setIsSwipeActive(false);
      return;
    }

    // Calcular velocidad si está habilitada
    let isValidVelocity = true;
    if (enableVelocity) {
      const velocity = calculateVelocity(Math.max(absX, absY), deltaTime);
      isValidVelocity = velocity >= velocityThreshold;
    }

    if (!isValidVelocity) {
      setIsSwipeActive(false);
      return;
    }

    // Determinar dirección del swipe
    if (absX > absY) {
      // Swipe horizontal
      if (deltaX > 0) {
        onSwipeRight?.();
      } else {
        onSwipeLeft?.();
      }
    } else {
      // Swipe vertical
      if (deltaY > 0) {
        onSwipeDown?.();
      } else {
        onSwipeUp?.();
      }
    }

    setIsSwipeActive(false);
    touchStartRef.current = null;
    touchEndRef.current = null;
  }, [
    calculateDistance,
    calculateVelocity,
    threshold,
    enableVelocity,
    velocityThreshold,
    onSwipeLeft,
    onSwipeRight,
    onSwipeUp,
    onSwipeDown
  ]);

  const bindSwipeEvents = useCallback((element: HTMLElement | null) => {
    if (!element) return;

    element.addEventListener('touchstart', handleTouchStart, { passive: false });
    element.addEventListener('touchmove', handleTouchMove, { passive: false });
    element.addEventListener('touchend', handleTouchEnd, { passive: false });

    return () => {
      element.removeEventListener('touchstart', handleTouchStart);
      element.removeEventListener('touchmove', handleTouchMove);
      element.removeEventListener('touchend', handleTouchEnd);
    };
  }, [handleTouchStart, handleTouchMove, handleTouchEnd]);

  // Hook para usar con ref
  const swipeRef = useCallback((element: HTMLElement | null) => {
    return bindSwipeEvents(element);
  }, [bindSwipeEvents]);

  return {
    swipeRef,
    bindSwipeEvents,
    isSwipeActive,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd
  };
};

// Hook específico para galerías de imágenes
export const useImageGallerySwipe = (
  currentIndex: number,
  totalImages: number,
  onNext: () => void,
  onPrevious: () => void,
  options: Omit<SwipeGestureOptions, 'onSwipeLeft' | 'onSwipeRight'> = {}
) => {
  return useSwipeGestures({
    ...options,
    onSwipeLeft: onNext,
    onSwipeRight: onPrevious,
    threshold: 30, // Umbral más bajo para galerías
    velocityThreshold: 0.2 // Velocidad más baja para mejor UX
  });
};

// Hook para sticky CTA móvil
export const useStickyCTASwipe = (
  onSwipeUp?: () => void,
  onSwipeDown?: () => void,
  options: Omit<SwipeGestureOptions, 'onSwipeUp' | 'onSwipeDown'> = {}
) => {
  return useSwipeGestures({
    ...options,
    onSwipeUp,
    onSwipeDown,
    threshold: 40,
    velocityThreshold: 0.4
  });
};