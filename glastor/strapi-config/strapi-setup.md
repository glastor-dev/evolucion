# Configuración de Strapi para Glastor

## 1. Instalación y Configuración Inicial

### Después de que Strapi se instale correctamente:

```bash
cd glastor-backend
npm run develop
```

Esto abrirá Strapi en `http://localhost:1337/admin`

## 2. Configuración del Panel de Administración

1. **Crear cuenta de administrador:**
   - Email: admin@glastor.com
   - Password: (usar una contraseña segura)
   - Nombre: Glastor Admin

## 3. Crear Modelos de Datos (Content Types)

### 3.1 Modelo Category

1. Ir a Content-Type Builder
2. Crear nuevo Collection Type: `Category`
3. Agregar campos:

```json
{
  "name": "Text (required)",
  "description": "Rich Text",
  "slug": "UID (required, target field: name)",
  "image": "Media (Single media)",
  "sortOrder": "Number (integer, default: 0)",
  "isActive": "Boolean (default: true)",
  "seoTitle": "Text",
  "seoDescription": "Text (long text)",
  "parentCategory": "Relation (Category has one Category)",
  "subcategories": "Relation (Category has many Categories)",
  "products": "Relation (Category has many Products)"
}
```

### 3.2 Modelo Product

1. Crear nuevo Collection Type: `Product`
2. Agregar campos:

```json
{
  "name": "Text (required)",
  "description": "Rich Text (required)",
  "price": "Number (decimal, required)",
  "discountPrice": "Number (decimal)",
  "slug": "UID (required, target field: name)",
  "images": "Media (Multiple media)",
  "stock": "Number (integer, default: 0)",
  "featured": "Boolean (default: false)",
  "tags": "JSON",
  "sku": "Text (unique)",
  "weight": "Number (decimal)",
  "seoTitle": "Text",
  "seoDescription": "Text (long text)",
  "isActive": "Boolean (default: true)",
  "category": "Relation (Product belongs to Category)"
}
```

### 3.3 Componentes

1. **Crear componente `product.specifications`:**
```json
{
  "material": "Text",
  "color": "JSON",
  "brand": "Text",
  "model": "Text",
  "warranty": "Text",
  "origin": "Text",
  "additionalSpecs": "JSON"
}
```

2. **Crear componente `product.dimensions`:**
```json
{
  "length": "Number (decimal)",
  "width": "Number (decimal)",
  "height": "Number (decimal)",
  "unit": "Enumeration (cm, m, mm, in, ft)"
}
```

3. **Agregar componentes al modelo Product:**
   - `specifications`: Component (product.specifications, repeatable: false)
   - `dimensions`: Component (product.dimensions, repeatable: false)

## 4. Configurar Permisos

### 4.1 Permisos Públicos (Public role)
- **Category**: find, findOne
- **Product**: find, findOne

### 4.2 Crear API Token
1. Ir a Settings > API Tokens
2. Crear nuevo token:
   - Name: "Frontend Token"
   - Description: "Token para el frontend de Glastor"
   - Token duration: Unlimited
   - Token type: Read-only

## 5. Configurar CORS

En `glastor-backend/config/middlewares.js`:

```javascript
module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:5173', 'http://localhost:3000', 'https://glastor.com']
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];
```

## 6. Variables de Entorno

Crear archivo `.env` en el directorio raíz del proyecto React:

```env
# API Configuration
VITE_API_URL=http://localhost:1337/api
VITE_API_TOKEN=tu_token_aqui
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=tu_token_aqui
VITE_NODE_ENV=development
VITE_UPLOAD_URL=http://localhost:1337
```

## 7. Migración de Datos

Después de configurar todo:

```bash
# Instalar dependencias para el script
npm install node-fetch

# Configurar token y ejecutar migración
STRAPI_TOKEN=tu_token_aqui node scripts/migrate-to-strapi.js migrate
```

## 8. Verificación

### 8.1 Endpoints disponibles:
- `GET /api/categories` - Listar categorías
- `GET /api/categories/:id` - Obtener categoría específica
- `GET /api/products` - Listar productos
- `GET /api/products/:id` - Obtener producto específico

### 8.2 Parámetros de consulta:
- `populate=*` - Incluir relaciones
- `filters[featured][$eq]=true` - Filtrar productos destacados
- `filters[category][slug][$eq]=vidrios-templados` - Filtrar por categoría
- `pagination[page]=1&pagination[pageSize]=10` - Paginación
- `sort=price:asc` - Ordenamiento

### 8.3 Ejemplo de petición:
```javascript
fetch('http://localhost:1337/api/products?populate=*&filters[featured][$eq]=true', {
  headers: {
    'Authorization': 'Bearer tu_token_aqui'
  }
})
```

## 9. Integración con React

Una vez que Strapi esté funcionando, actualizar el archivo `.env` con el token real y los componentes comenzarán a usar la API automáticamente.

## 10. Comandos Útiles

```bash
# Desarrollo
npm run develop

# Producción
npm run build
npm run start

# Limpiar cache
npm run strapi build --clean
```

## Notas Importantes

1. **Backup**: Siempre hacer backup de la base de datos antes de migraciones
2. **Seguridad**: Cambiar credenciales por defecto en producción
3. **Performance**: Configurar cache y CDN para imágenes en producción
4. **Monitoreo**: Implementar logs y monitoreo en producción