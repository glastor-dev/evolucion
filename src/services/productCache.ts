import { Product } from "./productSchema";

// Configuración del cache
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutos
const MAX_CACHE_SIZE = 100; // Máximo número de productos en cache

interface CacheEntry {
  data: Product[];
  timestamp: number;
  hits: number;
}

class ProductCache {
  private cache: Map<string, CacheEntry> = new Map();
  private accessOrder: string[] = [];

  /**
   * Obtiene datos del cache si son válidos
   */
  get(key: string): Product[] | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Verificar si el cache expiró
    if (Date.now() - entry.timestamp > CACHE_DURATION) {
      this.cache.delete(key);
      this.accessOrder = this.accessOrder.filter(k => k !== key);
      return null;
    }

    // Actualizar contador de hits y orden de acceso
    entry.hits++;
    this.updateAccessOrder(key);

    return entry.data;
  }

  /**
   * Almacena datos en el cache
   */
  set(key: string, data: Product[]): void {
    // Limpiar cache si excede el tamaño máximo (LRU)
    if (this.cache.size >= MAX_CACHE_SIZE) {
      this.evictLRU();
    }

    const entry: CacheEntry = {
      data: [...data], // Copia profunda para evitar mutaciones
      timestamp: Date.now(),
      hits: 0
    };

    this.cache.set(key, entry);
    this.updateAccessOrder(key);
  }

  /**
   * Invalida una entrada específica del cache
   */
  invalidate(key: string): void {
    this.cache.delete(key);
    this.accessOrder = this.accessOrder.filter(k => k !== key);
  }

  /**
   * Invalida todo el cache
   */
  invalidateAll(): void {
    this.cache.clear();
    this.accessOrder = [];
  }

  /**
   * Obtiene estadísticas del cache
   */
  getStats(): { size: number; totalHits: number; hitRate: number } {
    const totalHits = Array.from(this.cache.values()).reduce((sum, entry) => sum + entry.hits, 0);
    const totalRequests = this.accessOrder.length;

    return {
      size: this.cache.size,
      totalHits,
      hitRate: totalRequests > 0 ? (totalHits / totalRequests) * 100 : 0
    };
  }

  /**
   * Actualiza el orden de acceso (para LRU)
   */
  private updateAccessOrder(key: string): void {
    // Remover de la posición actual
    this.accessOrder = this.accessOrder.filter(k => k !== key);
    // Agregar al final (más recientemente usado)
    this.accessOrder.push(key);
  }

  /**
   * Elimina la entrada menos recientemente usada
   */
  private evictLRU(): void {
    if (this.accessOrder.length > 0) {
      const lruKey = this.accessOrder.shift()!;
      this.cache.delete(lruKey);
    }
  }
}

// Instancia global del cache
const productCache = new ProductCache();

// Funciones de utilidad para cache
export const getCachedProducts = (key: string): Product[] | null => {
  return productCache.get(key);
};

export const setCachedProducts = (key: string, data: Product[]): void => {
  productCache.set(key, data);
};

export const invalidateProductCache = (key?: string): void => {
  if (key) {
    productCache.invalidate(key);
  } else {
    productCache.invalidateAll();
  }
};

export const getCacheStats = () => {
  return productCache.getStats();
};

// Funciones específicas para cache de chunks
export const getCachedProductsChunk = (page: number, limit: number): Product[] | null => {
  const key = CACHE_KEYS.PRODUCTS_CHUNK(page, limit);
  return productCache.get(key);
};

export const setCachedProductsChunk = (page: number, limit: number, data: Product[]): void => {
  const key = CACHE_KEYS.PRODUCTS_CHUNK(page, limit);
  productCache.set(key, data);
};

export const getCachedFilteredProductsChunk = (
  filters: any,
  page: number,
  limit: number
): Product[] | null => {
  const key = CACHE_KEYS.FILTERED_PRODUCTS_CHUNK(filters, page, limit);
  return productCache.get(key);
};

export const setCachedFilteredProductsChunk = (
  filters: any,
  page: number,
  limit: number,
  data: Product[]
): void => {
  const key = CACHE_KEYS.FILTERED_PRODUCTS_CHUNK(filters, page, limit);
  productCache.set(key, data);
};

// Keys de cache comunes
export const CACHE_KEYS = {
  ALL_PRODUCTS: 'all_products',
  PRODUCT_BY_ID: (id: string) => `product_${id}`,
  PRODUCTS_BY_CATEGORY: (category: string) => `category_${category}`,
  SEARCH_RESULTS: (query: string) => `search_${query}`,
  PRODUCTS_CHUNK: (page: number, limit: number) => `products_chunk_${page}_${limit}`,
  FILTERED_PRODUCTS_CHUNK: (filters: any, page: number, limit: number) =>
    `filtered_products_${JSON.stringify(filters)}_${page}_${limit}`,
} as const;