// Prefetch util para rutas y datos de productos
// Usa imports dinámicos para precargar componentes y caché simple en memoria

type RouteKey = 'home' | 'shop' | 'detail';

const routeImporters: Record<RouteKey, () => Promise<any>> = {
  home: () => import('../pages/HomePage'),
  shop: () => import('../pages/ShopPage'),
  detail: () => import('../pages/ProductDetailModern'),
};

const componentCache = new Map<RouteKey, Promise<any>>();
const productCache = new Map<string, Promise<any>>();

export function prefetchRoute(key: RouteKey): Promise<any> {
  if (!routeImporters[key]) return Promise.resolve();
  if (!componentCache.has(key)) {
    componentCache.set(key, routeImporters[key]());
  }
  return componentCache.get(key)!;
}

export function prefetchProduct(id: string): Promise<any> {
  if (!productCache.has(id)) {
    const p = import('../services/localProducts').then(mod => mod.getProductById(id));
    productCache.set(id, p);
  }
  return productCache.get(id)!;
}

export function clearPrefetchCache() {
  componentCache.clear();
  productCache.clear();
}