import { useEffect, useCallback, useRef } from 'react';

interface KeyboardNavigationOptions {
  onEscape?: () => void;
  onEnter?: () => void;
  onSpace?: () => void;
  onArrowUp?: () => void;
  onArrowDown?: () => void;
  onArrowLeft?: () => void;
  onArrowRight?: () => void;
  onTab?: (event: KeyboardEvent) => void;
  trapFocus?: boolean;
  autoFocus?: boolean;
  disabled?: boolean;
}

export const useKeyboardNavigation = (
  elementRef: React.RefObject<HTMLElement>,
  options: KeyboardNavigationOptions = {}
) => {
  const {
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus = false,
    autoFocus = false,
    disabled = false
  } = options;

  const focusableElementsRef = useRef<HTMLElement[]>([]);

  const getFocusableElements = useCallback((container: HTMLElement): HTMLElement[] => {
    const focusableSelectors = [
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      'a[href]',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    return Array.from(container.querySelectorAll(focusableSelectors)) as HTMLElement[];
  }, []);

  const handleKeyDown = useCallback((event: KeyboardEvent) => {
    if (disabled) return;

    const { key, shiftKey } = event;

    switch (key) {
      case 'Escape':
        if (onEscape) {
          event.preventDefault();
          onEscape();
        }
        break;

      case 'Enter':
        if (onEnter) {
          event.preventDefault();
          onEnter();
        }
        break;

      case ' ':
        if (onSpace) {
          event.preventDefault();
          onSpace();
        }
        break;

      case 'ArrowUp':
        if (onArrowUp) {
          event.preventDefault();
          onArrowUp();
        }
        break;

      case 'ArrowDown':
        if (onArrowDown) {
          event.preventDefault();
          onArrowDown();
        }
        break;

      case 'ArrowLeft':
        if (onArrowLeft) {
          event.preventDefault();
          onArrowLeft();
        }
        break;

      case 'ArrowRight':
        if (onArrowRight) {
          event.preventDefault();
          onArrowRight();
        }
        break;

      case 'Tab':
        if (trapFocus && elementRef.current) {
          const focusableElements = getFocusableElements(elementRef.current);
          focusableElementsRef.current = focusableElements;

          if (focusableElements.length === 0) {
            event.preventDefault();
            return;
          }

          const firstElement = focusableElements[0];
          const lastElement = focusableElements[focusableElements.length - 1];
          const activeElement = document.activeElement as HTMLElement;

          if (shiftKey) {
            // Shift + Tab (navegación hacia atrás)
            if (activeElement === firstElement) {
              event.preventDefault();
              lastElement.focus();
            }
          } else {
            // Tab (navegación hacia adelante)
            if (activeElement === lastElement) {
              event.preventDefault();
              firstElement.focus();
            }
          }
        }

        if (onTab) {
          onTab(event);
        }
        break;
    }
  }, [
    disabled,
    onEscape,
    onEnter,
    onSpace,
    onArrowUp,
    onArrowDown,
    onArrowLeft,
    onArrowRight,
    onTab,
    trapFocus,
    elementRef,
    getFocusableElements
  ]);

  useEffect(() => {
    const element = elementRef.current;
    if (!element || disabled) return;

    // Auto focus si está habilitado
    if (autoFocus) {
      const focusableElements = getFocusableElements(element);
      if (focusableElements.length > 0) {
        focusableElements[0].focus();
      }
    }

    element.addEventListener('keydown', handleKeyDown);

    return () => {
      element.removeEventListener('keydown', handleKeyDown);
    };
  }, [elementRef, disabled, autoFocus, handleKeyDown, getFocusableElements]);

  const focusFirst = useCallback(() => {
    if (!elementRef.current) return;
    const focusableElements = getFocusableElements(elementRef.current);
    if (focusableElements.length > 0) {
      focusableElements[0].focus();
    }
  }, [elementRef, getFocusableElements]);

  const focusLast = useCallback(() => {
    if (!elementRef.current) return;
    const focusableElements = getFocusableElements(elementRef.current);
    if (focusableElements.length > 0) {
      focusableElements[focusableElements.length - 1].focus();
    }
  }, [elementRef, getFocusableElements]);

  const focusNext = useCallback(() => {
    if (!elementRef.current) return;
    const focusableElements = getFocusableElements(elementRef.current);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const nextIndex = (currentIndex + 1) % focusableElements.length;
    focusableElements[nextIndex]?.focus();
  }, [elementRef, getFocusableElements]);

  const focusPrevious = useCallback(() => {
    if (!elementRef.current) return;
    const focusableElements = getFocusableElements(elementRef.current);
    const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
    const previousIndex = currentIndex === 0 ? focusableElements.length - 1 : currentIndex - 1;
    focusableElements[previousIndex]?.focus();
  }, [elementRef, getFocusableElements]);

  return {
    focusFirst,
    focusLast,
    focusNext,
    focusPrevious,
    focusableElements: focusableElementsRef.current
  };
};