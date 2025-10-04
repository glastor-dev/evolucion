# React Query + Strapi - Guía de Implementación

## 🚀 Configuración Completada

React Query ha sido instalado y configurado exitosamente para trabajar con Strapi. Esta implementación proporciona:

- ✅ Caché inteligente de datos
- ✅ Sincronización automática
- ✅ Estados de carga optimizados
- ✅ Manejo de errores robusto
- ✅ Actualizaciones optimistas
- ✅ DevTools para desarrollo

## 📦 Dependencias Instaladas

```json
{
  "@tanstack/react-query": "^5.x.x",
  "@tanstack/react-query-devtools": "^5.x.x",
  "axios": "^1.x.x"
}
```

## 🏗️ Estructura de Archivos

```
src/
├── lib/
│   └── react-query.ts          # Configuración centralizada
├── providers/
│   └── QueryProvider.tsx       # Provider de React Query
├── hooks/
│   └── useProducts.ts          # Hooks optimizados con React Query
├── services/
│   └── api.ts                  # Servicio API para Strapi
└── main.tsx                    # Configuración del provider
```

## 🔧 Configuración

### 1. QueryClient Configurado

```typescript
// src/lib/react-query.ts
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,     // 5 minutos
      gcTime: 10 * 60 * 1000,       // 10 minutos
      retry: (failureCount, error) => {
        // No reintentar errores 4xx
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: true,
      refetchOnReconnect: true,
    }
  }
});
```

### 2. Provider Integrado

```typescript
// src/main.tsx
import { QueryProvider } from './providers/QueryProvider';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryProvider>
      <ThemeProvider>
        <App />
      </ThemeProvider>
    </QueryProvider>
  </React.StrictMode>
);
```

## 🎯 Hooks Disponibles

### useProducts
```typescript
const { 
  products, 
  isLoading, 
  error, 
  pagination, 
  refetch 
} = useProducts({
  page: 1,
  pageSize: 12,
  category: 'electronics',
  featured: true,
  search: 'laptop'
});
```

### useProduct
```typescript
const { 
  product, 
  isLoading, 
  error, 
  refetch 
} = useProduct('product-id');
```

### useFeaturedProducts
```typescript
const { 
  products, 
  isLoading, 
  error 
} = useFeaturedProducts();
```

### useProductSearch
```typescript
const { 
  products, 
  isLoading, 
  error 
} = useProductSearch('search-term', enabled);
```

### useCategories
```typescript
const { 
  categories, 
  isLoading, 
  error 
} = useCategories();
```

## 🔑 Claves de Query

```typescript
// Productos
productKeys.all()                    // ['products']
productKeys.lists()                  // ['products', 'list']
productKeys.list(params)             // ['products', 'list', params]
productKeys.detail(id)               // ['products', 'detail', id]
productKeys.featured()               // ['products', 'featured']
productKeys.search(query)            // ['products', 'search', query]

// Categorías
categoryKeys.all()                   // ['categories']
categoryKeys.lists()                 // ['categories', 'list']
```

## 🛠️ Utilidades Disponibles

```typescript
import { queryUtils } from '../lib/react-query';

// Invalidar queries
queryUtils.invalidateProducts();
queryUtils.invalidateCategories();
queryUtils.invalidateProduct('product-id');

// Gestión de caché
queryUtils.clearProductsCache();
queryUtils.prefetchProduct('product-id');
queryUtils.getProductFromCache('product-id');
queryUtils.setProductInCache('product-id', data);
```

## 📊 Configuraciones por Tipo

```typescript
// Listas de productos (frecuente)
staleTime: 3 minutos
gcTime: 5 minutos

// Producto individual (menos frecuente)
staleTime: 10 minutos
gcTime: 15 minutos

// Búsquedas (volátil)
staleTime: 2 minutos
gcTime: 5 minutos

// Categorías (muy estable)
staleTime: 15 minutos
gcTime: 30 minutos
```

## 🔄 Integración con Strapi

### Estructura de Respuesta Esperada

```typescript
interface ApiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}
```

### Endpoints Configurados

```typescript
// Productos
GET /api/products?populate=images,category&page=1&pageSize=12
GET /api/products/:id?populate=images,category
GET /api/products?filters[featured][$eq]=true
GET /api/products?filters[$or][0][name][$containsi]=query

// Categorías
GET /api/categories?populate=image
```

## 🎨 DevTools

En desarrollo, las DevTools de React Query están disponibles:
- Visualización de queries en tiempo real
- Estado de caché
- Invalidaciones y refetches
- Métricas de rendimiento

## 🚦 Estados de Carga

```typescript
// Estados disponibles
isLoading    // Primera carga
isFetching   // Cualquier fetch (incluye refetch)
isError      // Error en la query
isSuccess    // Query exitosa
error        // Objeto de error
```

## 🔧 Manejo de Errores

```typescript
import { handleStrapiError } from '../lib/react-query';

// En componentes
if (isError) {
  const errorInfo = handleStrapiError(error);
  console.log(errorInfo.message, errorInfo.status);
}
```

## 🌐 Variables de Entorno

Una vez que Strapi esté funcionando, configura:

```env
# .env
VITE_API_URL=http://localhost:1337/api
VITE_STRAPI_TOKEN=tu-token-de-strapi
```

## 📝 Próximos Pasos

1. **Completar instalación de Strapi** (en progreso)
2. **Configurar modelos de datos** en Strapi
3. **Migrar datos existentes** usando el script preparado
4. **Actualizar variables de entorno**
5. **Probar integración completa**

## 🔍 Verificación

Para verificar que React Query está funcionando:

1. Abre las DevTools del navegador
2. Ve a la pestaña "React Query"
3. Observa las queries en tiempo real
4. Verifica el caché y los estados

## 💡 Beneficios Implementados

- **Caché Inteligente**: Los datos se almacenan automáticamente
- **Sincronización**: Refetch automático en focus/reconnect
- **Optimización**: Menos requests redundantes
- **UX Mejorada**: Estados de carga consistentes
- **Desarrollo**: DevTools para debugging
- **Escalabilidad**: Configuración modular y extensible

## 🚀 ¡Listo para Usar!

React Query está completamente configurado y listo para trabajar con Strapi. La aplicación actual funciona con datos mock, y una vez que Strapi esté configurado, la transición será automática.