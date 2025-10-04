# 🚀 Guía Rápida: Completar Instalación de Strapi

## Estado Actual
La instalación de Strapi está en progreso pero necesita interacción manual.

## Pasos Inmediatos

### 1. Completar Instalación Automática
En la terminal que está ejecutando la instalación:
- Usa las flechas para seleccionar **"Skip"**
- Presiona Enter
- Espera a que termine la instalación

### 2. Si la Instalación Falla
Ejecuta el script de configuración manual:
```bash
cd C:\Users\Andres\Desktop\evolucion-react\glastor
node strapi-config/manual-setup.js C:\Users\Andres\Desktop\evolucion-react
```

### 3. Iniciar Strapi
```bash
cd C:\Users\Andres\Desktop\evolucion-react\glastor-backend
npm install
npm run develop
```

### 4. Configurar Admin (Primera vez)
1. Abre http://localhost:1337/admin
2. Crea cuenta de administrador:
   - Email: admin@glastor.com
   - Password: (segura)
   - Nombre: Glastor Admin

### 5. Crear Modelos de Datos
Sigue la guía en: `strapi-config/strapi-setup.md`

### 6. Migrar Datos
```bash
# Desde el directorio glastor
STRAPI_TOKEN=tu_token_aqui node scripts/migrate-to-strapi.js migrate
```

## Archivos Preparados ✅

### Scripts y Configuración:
- ✅ `scripts/migrate-to-strapi.js` - Script de migración de datos
- ✅ `strapi-config/strapi-setup.md` - Guía completa de configuración
- ✅ `strapi-config/manual-setup.js` - Configuración manual alternativa
- ✅ `strapi-config/product-model.json` - Modelo de productos
- ✅ `strapi-config/category-model.json` - Modelo de categorías
- ✅ `strapi-config/components.json` - Componentes reutilizables

### Servicios API:
- ✅ `src/services/api.ts` - Servicio de API
- ✅ `src/hooks/useProducts.ts` - Hooks para productos
- ✅ `src/components/DynamicProductGrid.tsx` - Grid dinámico
- ✅ `src/providers/QueryProvider.tsx` - Provider de React Query

## Datos de Prueba Incluidos

El script de migración incluye:
- **3 Categorías**: Vidrios Templados, Espejos, Vidrios Laminados
- **3 Productos**: Con especificaciones completas, precios, stock, etc.

## Variables de Entorno

Actualiza tu `.env` con:
```env
VITE_API_URL=http://localhost:1337/api
VITE_STRAPI_URL=http://localhost:1337
VITE_STRAPI_TOKEN=tu_token_de_strapi
```

## Verificación

Una vez configurado, verifica:
1. http://localhost:1337/admin - Panel de administración
2. http://localhost:1337/api/products - API de productos
3. http://localhost:5173 - Tu aplicación React

## Soporte

Si encuentras problemas:
1. Revisa los logs de la terminal
2. Consulta `strapi-config/strapi-setup.md` para detalles
3. Usa el script manual si la instalación automática falla

---

**¡Todo está preparado para que Strapi funcione perfectamente con tu aplicación Glastor!** 🎉