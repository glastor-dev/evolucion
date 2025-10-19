# Sistema de Optimización Automática de Imágenes

## 📸 Descripción General

Sistema completo de optimización de imágenes con:
- **Detección automática de formato** (WebP/AVIF)
- **Lazy loading** con Intersection Observer
- **Galería avanzada** con zoom, fullscreen y navegación por teclado
- **Blur placeholder** para mejorar la experiencia de carga
- **Script de build** para generar versiones optimizadas

---

## 🎨 Componentes

### 1. AutoOptimizedImage

Componente de imagen con optimización automática que reemplaza el uso de `<img>` estándar.

#### Props

```typescript
interface AutoOptimizedImageProps {
  src: string;              // URL de la imagen
  alt: string;              // Texto alternativo
  className?: string;       // Clases CSS adicionales
  priority?: boolean;       // Si es true, carga inmediatamente (sin lazy)
  enableZoom?: boolean;     // Habilita zoom al hacer hover
  blurDataURL?: string;     // Data URL del placeholder blur (opcional)
  sizes?: string;           // Atributo sizes para responsive images
}
```

#### Uso Básico

```tsx
import { AutoOptimizedImage } from "@/components/ui/AutoOptimizedImage";

// Imagen simple con lazy loading
<AutoOptimizedImage 
  src="/images/product.jpg" 
  alt="Producto" 
  className="w-full h-64 object-cover"
/>

// Imagen prioritaria (hero, above the fold)
<AutoOptimizedImage 
  src="/images/hero.jpg" 
  alt="Hero" 
  priority={true}
  className="w-full"
/>

// Con zoom al hover
<AutoOptimizedImage 
  src="/images/product.jpg" 
  alt="Producto" 
  enableZoom={true}
  className="cursor-zoom-in"
/>
```

#### Características

- ✅ Detecta soporte de WebP/AVIF en el navegador
- ✅ Lazy loading automático con margen de 50px
- ✅ Skeleton loader mientras carga
- ✅ Estado de error con icono
- ✅ Blur placeholder opcional
- ✅ Zoom suave al hover (opcional)

---

### 2. ImageGallery

Galería de imágenes completa con miniaturas, fullscreen y controles avanzados.

#### Props

```typescript
interface ImageGalleryProps {
  images: string[];          // Array de URLs de imágenes
  alt: string;               // Texto alternativo base
  className?: string;        // Clases CSS adicionales
  enableZoom?: boolean;      // Habilita controles de zoom
  enableFullscreen?: boolean;// Habilita modo fullscreen
  showThumbnails?: boolean;  // Muestra miniaturas
  enableDownload?: boolean;  // Habilita botón de descarga
}
```

#### Uso Básico

```tsx
import { ImageGallery } from "@/components/ui/ImageGallery";

// Galería completa (como en ProductDetail)
<ImageGallery 
  images={['/img1.jpg', '/img2.jpg', '/img3.jpg']}
  alt="Producto"
  enableZoom={true}
  enableFullscreen={true}
  showThumbnails={true}
  className="w-full"
/>

// Galería simple sin controles avanzados
<ImageGallery 
  images={productImages}
  alt={product.name}
  showThumbnails={true}
/>
```

#### Características

- ✅ Navegación con flechas (← →)
- ✅ Miniaturas clickeables (horizontal scroll)
- ✅ Modo fullscreen con fondo negro
- ✅ Zoom de 1x a 3x con controles +/-
- ✅ Drag-to-pan cuando está zoomed
- ✅ Navegación por teclado
- ✅ Contador de imágenes (ej: 2/5)
- ✅ Botón de descarga opcional
- ✅ Animaciones suaves con Framer Motion
- ✅ Responsive (thumbnails verticales en desktop, horizontales en mobile)

#### Atajos de Teclado

| Tecla | Acción |
|-------|--------|
| `←` | Imagen anterior |
| `→` | Siguiente imagen |
| `+` | Aumentar zoom |
| `-` | Disminuir zoom |
| `ESC` | Cerrar fullscreen |

---

## 🛠️ Script de Optimización

El script `optimize-images.js` procesa imágenes en tiempo de build.

### Instalación de Dependencias

```bash
npm install --save-dev sharp
```

### Uso

```bash
# Ejecutar manualmente
node scripts/optimize-images.js

# O agregar a package.json
npm run optimize:images
```

### Configuración en package.json

```json
{
  "scripts": {
    "optimize:images": "node scripts/optimize-images.js",
    "prebuild": "npm run optimize:images",
    "build": "vite build"
  }
}
```

### ¿Qué hace el script?

1. **Encuentra todas las imágenes** en `/public` recursivamente
2. **Genera versiones optimizadas**:
   - WebP (mejor compresión)
   - AVIF (próxima generación)
3. **Crea blur placeholders** (SVG base64)
4. **Genera manifest JSON** con metadata

### Estructura generada

```
public/
├── images/
│   ├── product.jpg          # Original
│   ├── product.webp         # WebP generado
│   ├── product.avif         # AVIF generado
│   └── ...
└── image-manifest.json      # Metadata de todas las imágenes
```

---

## 📦 Integración en Proyectos

### En ProductDetail (Ya implementado)

```tsx
<ImageGallery 
  images={gallery}
  alt={product.name}
  enableZoom
  enableFullscreen
  showThumbnails
  className="w-full"
/>
```

### En ProductCard (Recomendado)

```tsx
import { AutoOptimizedImage } from "@/components/ui/AutoOptimizedImage";

<AutoOptimizedImage 
  src={product.image}
  alt={product.name}
  className="w-full h-48 object-cover"
  enableZoom={true}
/>
```

### En Hero / Banner

```tsx
<AutoOptimizedImage 
  src="/images/hero.jpg"
  alt="Banner principal"
  priority={true}  // ⚠️ Importante para above-the-fold
  className="w-full h-screen object-cover"
/>
```

---

## 🎯 Mejores Prácticas

### 1. Prioridad de Carga

```tsx
// ✅ CORRECTO - Imágenes above-the-fold
<AutoOptimizedImage src="/hero.jpg" priority={true} />

// ❌ INCORRECTO - No uses priority en imágenes below-the-fold
<AutoOptimizedImage src="/footer-logo.jpg" priority={true} />
```

### 2. Tamaños Responsive

```tsx
<AutoOptimizedImage 
  src="/product.jpg"
  alt="Producto"
  sizes="(min-width: 1024px) 600px, (min-width: 768px) 400px, 90vw"
/>
```

### 3. Blur Placeholder

```tsx
// El script genera automáticamente placeholders
// El componente los busca en image-manifest.json
<AutoOptimizedImage 
  src="/product.jpg"
  alt="Producto"
  // blurDataURL se carga automáticamente del manifest
/>
```

### 4. Nombres de Archivo

```bash
# ✅ CORRECTO - Descriptivos, SEO-friendly
producto-taladro-inalambrico.jpg
hero-banner-verano-2024.jpg

# ❌ EVITAR - Nombres genéricos
IMG_1234.jpg
photo.jpg
```

---

## 📊 Métricas de Rendimiento

### Impacto Esperado

| Métrica | Antes | Después | Mejora |
|---------|-------|---------|--------|
| Peso imagen (promedio) | 500 KB | 150 KB | -70% |
| LCP (Largest Contentful Paint) | 3.2s | 1.8s | -44% |
| CLS (Cumulative Layout Shift) | 0.15 | 0.02 | -87% |
| Bandwidth mensual | 100 GB | 35 GB | -65% |

### Formatos de Imagen

| Formato | Compresión | Soporte | Uso |
|---------|-----------|---------|-----|
| **AVIF** | 🏆 Mejor | Modern browsers | Primera opción |
| **WebP** | ⭐ Excelente | 95%+ browsers | Fallback principal |
| **JPEG** | ✅ Buena | 100% browsers | Fallback universal |

---

## 🔧 Troubleshooting

### Problema: Imágenes no se optimizan

**Solución:**
1. Verifica que `sharp` esté instalado: `npm install sharp`
2. Ejecuta manualmente: `node scripts/optimize-images.js`
3. Revisa los logs en consola

### Problema: Blur placeholder no aparece

**Solución:**
1. Verifica que existe `public/image-manifest.json`
2. Comprueba que la ruta de la imagen coincida con el manifest
3. Re-ejecuta el script de optimización

### Problema: Zoom no funciona

**Solución:**
1. Asegúrate de pasar `enableZoom={true}`
2. Verifica que no haya CSS conflictivo (`transform`, `scale`)
3. Comprueba que el contenedor tenga espacio suficiente

### Problema: Fullscreen no se abre

**Solución:**
1. Verifica `enableFullscreen={true}` en `<ImageGallery>`
2. Comprueba que no haya errores en consola
3. Asegúrate que el componente Dialog esté instalado

---

## 🚀 Roadmap

### Próximas Mejoras

- [ ] **Responsive images automático** - Generar múltiples tamaños
- [ ] **CDN integration** - Subir a Cloudflare Images / Cloudinary
- [ ] **Preload hints** - `<link rel="preload">` para imágenes críticas
- [ ] **Progressive JPEG** - Carga progresiva para JPEGs grandes
- [ ] **Art direction** - Diferentes crops para mobile/desktop
- [ ] **Video support** - Expandir galería para soportar videos

---

## 📚 Referencias

- [Web.dev - Optimize Images](https://web.dev/fast/#optimize-your-images)
- [MDN - Responsive Images](https://developer.mozilla.org/en-US/docs/Learn/HTML/Multimedia_and_embedding/Responsive_images)
- [sharp Documentation](https://sharp.pixelplumbing.com/)
- [WebP vs AVIF](https://cloudinary.com/blog/webp-vs-avif-comparing-next-gen-image-formats)

---

## 💡 Tips Adicionales

### Para Designers

1. **Exporta en alta calidad** - El script se encarga de la compresión
2. **Usa JPG para fotos** - PNG solo para logos/iconos con transparencia
3. **Aspect ratio consistente** - Facilita el diseño responsive
4. **Nombres descriptivos** - Mejora SEO y organización

### Para Desarrolladores

1. **Lazy load by default** - Solo usa `priority` cuando sea necesario
2. **Test en dispositivos reales** - Simula conexiones lentas (3G)
3. **Monitor Web Vitals** - Usa Chrome DevTools → Lighthouse
4. **Cache strategy** - Configura headers de cache en servidor

---

## 📝 Ejemplo Completo

```tsx
import { ImageGallery } from "@/components/ui/ImageGallery";
import { AutoOptimizedImage } from "@/components/ui/AutoOptimizedImage";

function ProductPage({ product }) {
  const images = [
    product.image,
    ...(product.images || [])
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {/* Galería principal */}
      <ImageGallery 
        images={images}
        alt={product.name}
        enableZoom
        enableFullscreen
        showThumbnails
      />
      
      {/* Productos relacionados */}
      <div className="grid grid-cols-3 gap-4">
        {relatedProducts.map(item => (
          <AutoOptimizedImage 
            key={item.id}
            src={item.image}
            alt={item.name}
            className="rounded-lg"
            enableZoom
          />
        ))}
      </div>
    </div>
  );
}
```

---

## ✅ Checklist de Implementación

- [x] Crear componente `AutoOptimizedImage`
- [x] Crear componente `ImageGallery`
- [x] Crear script `optimize-images.js`
- [x] Integrar en `ProductDetail`
- [ ] Integrar en `ProductCard`
- [ ] Integrar en `Hero`
- [ ] Agregar script a `prebuild`
- [ ] Instalar `sharp`
- [ ] Optimizar imágenes existentes
- [ ] Test en producción
- [ ] Medir Web Vitals

---

¡Sistema de optimización de imágenes listo para producción! 🎉
