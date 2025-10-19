import { useState, useCallback, useRef } from 'react';

export interface ErrorState {
  type: 'network' | 'not_found' | 'validation' | 'server' | 'unknown';
  message: string;
  code?: string | number;
  retryable: boolean;
  timestamp: number;
}

interface UseErrorHandlerOptions {
  maxRetries?: number;
  retryDelay?: number;
  onError?: (error: ErrorState) => void;
}

export const useErrorHandler = (options: UseErrorHandlerOptions = {}) => {
  const { maxRetries = 3, retryDelay = 1000, onError } = options;
  const [error, setError] = useState<ErrorState | null>(null);
  const [isRetrying, setIsRetrying] = useState(false);
  const retryCountRef = useRef(0);
  const retryTimeoutRef = useRef<NodeJS.Timeout>();

  const classifyError = useCallback((error: any): ErrorState => {
    const timestamp = Date.now();
    
    // Error de red
    if (error?.name === 'NetworkError' || error?.code === 'NETWORK_ERROR') {
      return {
        type: 'network',
        message: 'Error de conexión. Verifica tu conexión a internet.',
        retryable: true,
        timestamp
      };
    }
    
    // Error 404 - Producto no encontrado
    if (error?.status === 404 || error?.message?.includes('not found')) {
      return {
        type: 'not_found',
        message: 'El producto solicitado no existe o ha sido eliminado.',
        retryable: false,
        timestamp
      };
    }
    
    // Error de validación
    if (error?.name === 'ValidationError' || error?.status === 400) {
      return {
        type: 'validation',
        message: 'Los datos del producto no son válidos.',
        code: error?.code,
        retryable: false,
        timestamp
      };
    }
    
    // Error del servidor
    if (error?.status >= 500) {
      return {
        type: 'server',
        message: 'Error interno del servidor. Inténtalo de nuevo más tarde.',
        code: error?.status,
        retryable: true,
        timestamp
      };
    }
    
    // Error desconocido
    return {
      type: 'unknown',
      message: error?.message || 'Ha ocurrido un error inesperado.',
      retryable: true,
      timestamp
    };
  }, []);

  const handleError = useCallback((error: any) => {
    const errorState = classifyError(error);
    setError(errorState);
    onError?.(errorState);
  }, [classifyError, onError]);

  const retry = useCallback(async (retryFn: () => Promise<void>) => {
    if (!error?.retryable || retryCountRef.current >= maxRetries) {
      return;
    }

    setIsRetrying(true);
    retryCountRef.current += 1;

    try {
      // Esperar antes de reintentar
      await new Promise(resolve => {
        retryTimeoutRef.current = setTimeout(resolve, retryDelay * retryCountRef.current);
      });

      await retryFn();
      
      // Si el reintento es exitoso, limpiar el error
      setError(null);
      retryCountRef.current = 0;
    } catch (retryError) {
      handleError(retryError);
    } finally {
      setIsRetrying(false);
    }
  }, [error, maxRetries, retryDelay, handleError]);

  const clearError = useCallback(() => {
    setError(null);
    retryCountRef.current = 0;
    if (retryTimeoutRef.current) {
      clearTimeout(retryTimeoutRef.current);
    }
  }, []);

  const canRetry = error?.retryable && retryCountRef.current < maxRetries;

  return {
    error,
    isRetrying,
    canRetry,
    retryCount: retryCountRef.current,
    maxRetries,
    handleError,
    retry,
    clearError
  };
};