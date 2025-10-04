import { QueryClient } from '@tanstack/react-query';

// Configuración del QueryClient optimizada para Strapi
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // Tiempo que los datos se consideran "frescos" (no se refetch automáticamente)
      staleTime: 5 * 60 * 1000, // 5 minutos
      
      // Tiempo que los datos permanecen en caché después de no ser utilizados
      gcTime: 10 * 60 * 1000, // 10 minutos (antes era cacheTime)
      
      // Reintentos en caso de error
      retry: (failureCount, error: any) => {
        // No reintentar errores 4xx (errores del cliente)
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Reintentar hasta 3 veces para otros errores
        return failureCount < 3;
      },
      
      // Configuraciones de refetch
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
      refetchOnMount: true,
      refetchInterval: false, // No refetch automático por tiempo
    },
    mutations: {
      // Reintentos para mutaciones
      retry: (failureCount, error: any) => {
        // No reintentar errores 4xx para mutaciones
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        // Solo 1 reintento para mutaciones
        return failureCount < 1;
      },
    },
  },
});

// Utilidades para invalidación de queries
export const queryUtils = {
  // Invalidar todas las queries de productos
  invalidateProducts: () => {
    queryClient.invalidateQueries({ queryKey: ['products'] });
  },
  
  // Invalidar todas las queries de categorías
  invalidateCategories: () => {
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  },
  
  // Invalidar query específica de producto
  invalidateProduct: (id: string) => {
    queryClient.invalidateQueries({ queryKey: ['products', 'detail', id] });
  },
  
  // Limpiar caché de productos
  clearProductsCache: () => {
    queryClient.removeQueries({ queryKey: ['products'] });
  },
  
  // Prefetch de producto (útil para hover o navegación predictiva)
  prefetchProduct: (id: string) => {
    return queryClient.prefetchQuery({
      queryKey: ['products', 'detail', id],
      queryFn: () => import('../services/api').then(({ apiService }) => apiService.getProduct(id)),
      staleTime: 10 * 60 * 1000,
    });
  },
  
  // Obtener datos de producto desde caché (sin hacer request)
  getProductFromCache: (id: string) => {
    return queryClient.getQueryData(['products', 'detail', id]);
  },
  
  // Establecer datos de producto en caché
  setProductInCache: (id: string, data: any) => {
    queryClient.setQueryData(['products', 'detail', id], data);
  },
};

// Configuraciones específicas para diferentes tipos de queries
export const queryConfigs = {
  // Configuración para listas de productos (más frecuente)
  productList: {
    staleTime: 3 * 60 * 1000, // 3 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  },
  
  // Configuración para producto individual (menos frecuente)
  productDetail: {
    staleTime: 10 * 60 * 1000, // 10 minutos
    gcTime: 15 * 60 * 1000, // 15 minutos
  },
  
  // Configuración para búsquedas (muy volátil)
  search: {
    staleTime: 2 * 60 * 1000, // 2 minutos
    gcTime: 5 * 60 * 1000, // 5 minutos
  },
  
  // Configuración para categorías (muy estable)
  categories: {
    staleTime: 15 * 60 * 1000, // 15 minutos
    gcTime: 30 * 60 * 1000, // 30 minutos
  },
  
  // Configuración para datos del usuario (sensible)
  user: {
    staleTime: 1 * 60 * 1000, // 1 minuto
    gcTime: 5 * 60 * 1000, // 5 minutos
  },
};

// Tipos de error comunes de Strapi
export const strapiErrorTypes = {
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  VALIDATION_ERROR: 400,
  SERVER_ERROR: 500,
};

// Helper para manejar errores de Strapi
export const handleStrapiError = (error: any) => {
  if (error?.response?.data?.error) {
    const strapiError = error.response.data.error;
    return {
      message: strapiError.message || 'Error desconocido',
      status: strapiError.status || error.response.status,
      details: strapiError.details || null,
    };
  }
  
  return {
    message: error.message || 'Error de conexión',
    status: error.status || 500,
    details: null,
  };
};