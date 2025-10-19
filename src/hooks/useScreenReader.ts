import { useCallback, useRef, useEffect } from 'react';

interface ScreenReaderOptions {
  politeness?: 'polite' | 'assertive';
  atomic?: boolean;
  relevant?: 'additions' | 'removals' | 'text' | 'all';
}

export const useScreenReader = () => {
  const liveRegionRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    // Crear región live si no existe
    if (!liveRegionRef.current) {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.setAttribute('aria-relevant', 'additions text');
      liveRegion.style.position = 'absolute';
      liveRegion.style.left = '-10000px';
      liveRegion.style.width = '1px';
      liveRegion.style.height = '1px';
      liveRegion.style.overflow = 'hidden';
      liveRegion.id = 'screen-reader-announcements';
      
      document.body.appendChild(liveRegion);
      liveRegionRef.current = liveRegion;
    }

    return () => {
      if (liveRegionRef.current && document.body.contains(liveRegionRef.current)) {
        document.body.removeChild(liveRegionRef.current);
      }
    };
  }, []);

  const announce = useCallback((
    message: string, 
    options: ScreenReaderOptions = {}
  ) => {
    const { 
      politeness = 'polite', 
      atomic = true, 
      relevant = 'additions text' 
    } = options;

    if (!liveRegionRef.current) return;

    // Actualizar atributos si es necesario
    liveRegionRef.current.setAttribute('aria-live', politeness);
    liveRegionRef.current.setAttribute('aria-atomic', atomic.toString());
    liveRegionRef.current.setAttribute('aria-relevant', relevant);

    // Limpiar contenido anterior
    liveRegionRef.current.textContent = '';

    // Usar setTimeout para asegurar que el lector de pantalla detecte el cambio
    setTimeout(() => {
      if (liveRegionRef.current) {
        liveRegionRef.current.textContent = message;
      }
    }, 100);
  }, []);

  const announcePolite = useCallback((message: string) => {
    announce(message, { politeness: 'polite' });
  }, [announce]);

  const announceAssertive = useCallback((message: string) => {
    announce(message, { politeness: 'assertive' });
  }, [announce]);

  const announceStatus = useCallback((message: string) => {
    announce(message, { 
      politeness: 'polite', 
      atomic: true, 
      relevant: 'all' 
    });
  }, [announce]);

  const announceError = useCallback((message: string) => {
    announce(`Error: ${message}`, { 
      politeness: 'assertive', 
      atomic: true 
    });
  }, [announce]);

  const announceSuccess = useCallback((message: string) => {
    announce(`Éxito: ${message}`, { 
      politeness: 'polite', 
      atomic: true 
    });
  }, [announce]);

  const announceLoading = useCallback((message: string = 'Cargando contenido') => {
    announce(message, { 
      politeness: 'polite', 
      atomic: false 
    });
  }, [announce]);

  const announceLoadingComplete = useCallback((message: string = 'Contenido cargado') => {
    announce(message, { 
      politeness: 'polite', 
      atomic: true 
    });
  }, [announce]);

  return {
    announce,
    announcePolite,
    announceAssertive,
    announceStatus,
    announceError,
    announceSuccess,
    announceLoading,
    announceLoadingComplete
  };
};