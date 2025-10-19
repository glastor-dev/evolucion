import { useState, useEffect, useCallback } from 'react';
import { Product } from '../services/productSchema';
import { getProductsChunk, getFilteredProductsChunk } from '../services/localProducts';

interface UseLazyProductsOptions {
  limit?: number;
  filters?: {
    search?: string;
    category?: string;
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
    inStock?: boolean;
  };
}

interface UseLazyProductsReturn {
  products: Product[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  total: number;
  loadMore: () => void;
  refresh: () => void;
  reset: () => void;
}

/**
 * Hook personalizado para lazy loading de productos
 * Soporta paginación infinita y filtros
 */
export const useLazyProducts = (options: UseLazyProductsOptions = {}): UseLazyProductsReturn => {
  const { limit = 12, filters } = options;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [total, setTotal] = useState(0);

  // Función para cargar productos
  const loadProducts = useCallback(async (pageNum: number, append: boolean = false) => {
    setLoading(true);
    setError(null);

    try {
      const result = filters
        ? await getFilteredProductsChunk(filters, pageNum, limit)
        : await getProductsChunk(pageNum, limit);

      if (result.error) {
        setError(result.error);
      } else {
        setProducts(prev =>
          append ? [...prev, ...result.products] : result.products
        );
        setHasMore(result.hasMore);
        setTotal(result.total);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }, [filters, limit]);

  // Cargar más productos
  const loadMore = useCallback(() => {
    if (!loading && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadProducts(nextPage, true);
    }
  }, [loading, hasMore, page, loadProducts]);

  // Refrescar (recargar desde el inicio)
  const refresh = useCallback(() => {
    setPage(1);
    loadProducts(1, false);
  }, [loadProducts]);

  // Reset completo
  const reset = useCallback(() => {
    setProducts([]);
    setPage(1);
    setHasMore(true);
    setTotal(0);
    setError(null);
    loadProducts(1, false);
  }, [loadProducts]);

  // Efecto inicial y cuando cambian los filtros
  useEffect(() => {
    reset();
  }, [filters]); // Dependencia en filters para recargar cuando cambien

  return {
    products,
    loading,
    error,
    hasMore,
    total,
    loadMore,
    refresh,
    reset
  };
};