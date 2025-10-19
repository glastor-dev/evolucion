import { Product, safeValidateProduct } from "@/services/productSchema";

/**
 * Normaliza un producto desde la API a la estructura esperada por la UI
 * Elimina la necesidad de usar 'any' types y proporciona validación
 */
export const normalizeProduct = (rawProduct: unknown): Product | null => {
  const validation = safeValidateProduct(rawProduct);
  
  if (!validation.success) {
    console.warn("Error validating product:", validation.error);
    return null;
  }

  const product = validation.data;

  // Normalización adicional para campos específicos de la UI
  return {
    ...product,
    // Asegurar que siempre hay una imagen
    image: product.image || "/placeholder-product.svg",
    // Normalizar array de imágenes
    images: product.images?.length ? product.images : 
            product.imageGallery?.length ? product.imageGallery :
            product.image ? [product.image] : ["/placeholder-product.svg"],
    // Asegurar valores por defecto para campos opcionales
    features: product.features || [],
    specifications: product.specifications || {},
    inStock: product.inStock !== false, // Manejo explícito de undefined
  };
};

/**
 * Calcula información de descuento para un producto
 */
export const calculateDiscount = (product: Product) => {
  const hasDiscount = typeof product.originalPrice === "number" && 
                     product.originalPrice > product.price;
  
  const discountPct = hasDiscount 
    ? Math.round(((product.originalPrice! - product.price) / product.originalPrice!) * 100)
    : 0;

  return { hasDiscount, discountPct };
};

/**
 * Genera el badge de envío basado en el estado del producto
 */
export const getShippingBadge = (product: Product) => {
  const days = product.shippingTimeDays;
  
  if (!product.inStock) {
    return { 
      cls: "bg-amber-50 text-amber-700", 
      text: "Reposición en camino" 
    };
  }
  
  if (typeof days !== "number") {
    return { 
      cls: "bg-green-50 text-green-700", 
      text: "Entrega: 24–72 horas" 
    };
  }
  
  if (days <= 2) {
    return { 
      cls: "bg-green-50 text-green-700", 
      text: "Entrega: 24–72 horas" 
    };
  }
  
  if (days <= 5) {
    return { 
      cls: "bg-amber-50 text-amber-700", 
      text: `Entrega: ${days} días` 
    };
  }
  
  return { 
    cls: "bg-red-50 text-red-700", 
    text: `Entrega: ${days} días` 
  };
};

/**
 * Genera características por defecto cuando no están disponibles
 */
export const getDefaultFeatures = () => [
  {
    icon: "Zap",
    color: "text-yellow-500",
    title: "Potencia",
    description: "Entrega la potencia de los neumáticos."
  },
  {
    icon: "Gauge", 
    color: "text-blue-500",
    title: "Velocidad",
    description: "Interruptor selector de 2 modos permite al operador seleccionar clavado secuencial o al contacto."
  },
  {
    icon: "Target",
    color: "text-emerald-500", 
    title: "Precisión",
    description: "Clava clavos con cabezal recortado en madera de ingeniería densa con potencia y facilidad."
  },
  {
    icon: "Battery",
    color: "text-teal-500",
    title: "Eficiencia", 
    description: "Clava hasta 1,000 clavos para estructuras en una sola carga."
  }
];

/**
 * Filtra productos recomendados basado en categoría y complementa con productos populares si es necesario
 */
export const getRecommendedProducts = (
  allProducts: Product[], 
  currentProduct: Product, 
  limit: number = 5
) => {
  // Filtrar productos de la misma categoría (excluyendo el producto actual)
  const sameCategory = allProducts
    .filter(p => p.id !== currentProduct.id && p.category === currentProduct.category);

  // Si tenemos suficientes productos de la misma categoría
  if (sameCategory.length >= limit) {
    return sameCategory
      .slice(0, limit)
      .map(p => ({
        id: p.id,
        name: p.name,
        image: p.image || "/placeholder-product.svg",
        price: p.price,
        category: p.category,
        brand: p.brand
      }));
  }

  // Si necesitamos más productos, agregar de otras categorías populares
  const remainingNeeded = limit - sameCategory.length;
  const otherProducts = allProducts
    .filter(p => 
      p.id !== currentProduct.id && 
      p.category !== currentProduct.category &&
      p.rating && p.rating >= 4.0 // Solo productos bien valorados
    )
    .slice(0, remainingNeeded);

  // Combinar productos de la misma categoría con otros populares
  return [...sameCategory, ...otherProducts]
    .map(p => ({
      id: p.id,
      name: p.name,
      image: p.image || "/placeholder-product.svg",
      price: p.price,
      category: p.category,
      brand: p.brand
    }));
};

/**
 * Genera la URL de compartir para redes sociales
 */
export const generateShareUrls = (product: Product, baseUrl: string) => {
  const shareUrl = `${baseUrl}/tienda/${product.id}`;
  const shareText = `${product.name} - ${product.brand || 'Glastor'}`;
  
  return {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`
  };
};