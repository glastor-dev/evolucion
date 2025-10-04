import { useQuery } from '@tanstack/react-query';
import { apiService } from '../services/api';

// Claves de query para React Query
export const productKeys = {
  all: ['products'] as const,
  lists: () => [...productKeys.all, 'list'] as const,
  list: (params: any) => [...productKeys.lists(), params] as const,
  details: () => [...productKeys.all, 'detail'] as const,
  detail: (id: string) => [...productKeys.details(), id] as const,
  featured: () => [...productKeys.all, 'featured'] as const,
  search: (query: string) => [...productKeys.all, 'search', query] as const,
};

// Hook para obtener todos los productos con React Query
export const useProducts = (params?: {
  page?: number;
  pageSize?: number;
  category?: string;
  featured?: boolean;
  search?: string;
  sort?: string | string[];
  brand?: string;
}) => {
  const query = useQuery({
    queryKey: productKeys.list(params),
    queryFn: () => apiService.getProducts(params),
    staleTime: 5 * 60 * 1000, // 5 minutos
    enabled: true, // Siempre habilitado
  });

  return {
    products: query.data?.data || [],
    pagination: query.data?.meta?.pagination || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
    isFetching: query.isFetching,
  };
};

// Hook para obtener un producto específico con React Query
export const useProduct = (id: string) => {
  const query = useQuery({
    queryKey: productKeys.detail(id),
    queryFn: () => apiService.getProduct(id),
    enabled: !!id, // Solo ejecutar si hay ID
    staleTime: 10 * 60 * 1000, // 10 minutos para productos individuales
  });

  return {
    product: query.data?.data || null,
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Hook para productos destacados con React Query
export const useFeaturedProducts = () => {
  const query = useQuery({
    queryKey: productKeys.featured(),
    queryFn: () => apiService.getFeaturedProducts(),
    staleTime: 10 * 60 * 1000, // 10 minutos para productos destacados
  });

  return {
    products: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Hook para búsqueda de productos con React Query y debounce
export const useProductSearch = (searchQuery: string, enabled: boolean = true) => {
  const query = useQuery({
    queryKey: productKeys.search(searchQuery),
    queryFn: () => apiService.searchProducts(searchQuery),
    enabled: enabled && !!searchQuery.trim(),
    staleTime: 2 * 60 * 1000, // 2 minutos para búsquedas
  });

  return {
    products: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};

// Claves para categorías
export const categoryKeys = {
  all: ['categories'] as const,
  lists: () => [...categoryKeys.all, 'list'] as const,
};

// Hook para categorías con React Query
export const useCategories = () => {
  const query = useQuery({
    queryKey: categoryKeys.lists(),
    queryFn: () => apiService.getCategories(),
    staleTime: 15 * 60 * 1000, // 15 minutos para categorías (cambian poco)
  });

  return {
    categories: query.data?.data || [],
    isLoading: query.isLoading,
    error: query.error?.message || null,
    isError: query.isError,
    refetch: query.refetch,
  };
};