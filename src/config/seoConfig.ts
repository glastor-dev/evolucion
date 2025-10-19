// Configuración de SEO para diferentes páginas del sitio
export interface SEOPageConfig {
  title: string;
  description: string;
  keywords: string;
  image?: string;
  type?: string;
  canonical?: string;
  noindex?: boolean;
}

export const seoConfig: Record<string, SEOPageConfig> = {
  // Página principal
  home: {
    title: "Glastor - Herramientas Profesionales Makita | Equipos de Construcción y Jardinería",
    description:
      "Descubre la mejor selección de herramientas profesionales Makita en Glastor. Taladros, sierras, lijadoras y equipos de jardinería con la máxima calidad y potencia. Envío gratis en pedidos superiores a $50.",
    keywords:
      "Makita, herramientas profesionales, taladros, sierras, lijadoras, jardinería, construcción, equipos eléctricos, batería, inalámbricos, Colombia, Glastor",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
  },

  // Catálogo de productos
  catalog: {
    title: "Catálogo de Herramientas Makita | Glastor",
    description:
      "Explora nuestro catálogo completo de herramientas profesionales Makita. Encuentra taladros, sierras, lijadoras, equipos de jardinería y más. Calidad garantizada y envío gratis.",
    keywords:
      "catálogo Makita, herramientas profesionales, taladros Makita, sierras Makita, lijadoras, equipos jardinería, herramientas construcción",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
  },

  // Página de producto individual
  product: {
    title: "Herramienta Profesional Makita | Glastor",
    description:
      "Herramienta profesional Makita de alta calidad. Potencia, durabilidad y precisión para profesionales. Garantía oficial y envío gratis en pedidos superiores a $50.",
    keywords:
      "Makita, herramienta profesional, calidad, garantía, envío gratis, construcción, jardinería",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "product",
  },

  // Página de contacto
  contact: {
    title: "Contacto | Glastor - Herramientas Profesionales Makita",
    description:
      "Contáctanos para consultas sobre herramientas profesionales Makita. Atención personalizada, asesoría técnica y soporte post-venta. Estamos aquí para ayudarte.",
    keywords:
      "contacto Glastor, soporte Makita, asesoría técnica, atención al cliente, herramientas profesionales",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
  },

  // Página sobre nosotros
  about: {
    title: "Sobre Nosotros | Glastor - Distribuidores Oficiales Makita",
    description:
      "Conoce la historia de Glastor, distribuidores oficiales de herramientas profesionales Makita en Colombia. Más de 10 años de experiencia y compromiso con la calidad.",
    keywords:
      "Glastor historia, distribuidor oficial Makita, experiencia, calidad, Colombia, herramientas profesionales",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
  },

  // Página de servicios
  services: {
    title: "Servicios Profesionales | Glastor - Desarrollo y Consultoría",
    description:
      "Servicios profesionales de desarrollo de software, inteligencia artificial y e-commerce. Transformamos ideas en realidades digitales con tecnología de vanguardia.",
    keywords:
      "servicios desarrollo, inteligencia artificial, e-commerce, consultoría técnica, software personalizado, Glastor",
    image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200&h=630&fit=crop",
    type: "website",
  },

  // Blog/Noticias
  blog: {
    title: "Blog | Glastor - Consejos y Noticias sobre Herramientas Makita",
    description:
      "Mantente actualizado con los últimos consejos, noticias y novedades sobre herramientas profesionales Makita. Guías de uso, mantenimiento y más.",
    keywords:
      "blog Makita, consejos herramientas, noticias construcción, guías uso, mantenimiento herramientas, Glastor",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
  },

  // Página de búsqueda
  search: {
    title: "Búsqueda de Herramientas | Glastor",
    description:
      "Encuentra la herramienta Makita perfecta para tu proyecto. Busca por categoría, modelo o especificaciones técnicas en nuestro catálogo completo.",
    keywords: "buscar herramientas Makita, catálogo búsqueda, herramientas por categoría, Glastor",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
    noindex: true, // No indexar páginas de búsqueda
  },

  // Carrito de compras
  cart: {
    title: "Carrito de Compras | Glastor",
    description:
      "Revisa tu carrito de compras con herramientas profesionales Makita. Finaliza tu pedido y disfruta de envío gratis en compras superiores a $50.",
    keywords: "carrito compras, checkout, herramientas Makita, envío gratis, Glastor",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
    noindex: true, // No indexar páginas de carrito
  },

  // Página de error 404
  notFound: {
    title: "Página No Encontrada | Glastor",
    description:
      "La página que buscas no existe. Explora nuestro catálogo de herramientas profesionales Makita o regresa a la página principal.",
    keywords: "error 404, página no encontrada, Glastor, herramientas Makita",
    image: "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "website",
    noindex: true, // No indexar páginas de error
  },
};

// Función helper para obtener configuración SEO por página
export const getSEOConfig = (page: string): SEOPageConfig => {
  return seoConfig[page] || seoConfig.home;
};

// Configuración de meta tags específicas para productos
import { formatCurrency } from "@/lib/format";

export const getProductSEO = (product: {
  name: string;
  description: string;
  price: number;
  image: string;
  images?: string[];
  category: string;
  brand?: string;
}): SEOPageConfig => {
  const coverImage = product.images?.[0] ?? product.image;
  return {
    title: `${product.name} | Glastor - Herramientas Profesionales Makita`,
    description: `${product.description} Precio: ${formatCurrency(product.price)}. Envío gratis en pedidos superiores a $50. Garantía oficial Makita.`,
    keywords: `${product.name}, ${product.category}, ${product.brand || "Makita"}, herramientas profesionales, Glastor, precio, garantía`,
    image: coverImage,
    type: "product",
  };
};

// Configuración de meta tags para artículos de blog
export const getBlogSEO = (article: {
  title: string;
  description: string;
  image?: string;
  publishedDate: string;
  author: string;
  tags: string[];
}): SEOPageConfig => {
  return {
    title: `${article.title} | Blog Glastor`,
    description: article.description,
    keywords: `${article.tags.join(", ")}, blog Glastor, herramientas Makita, consejos`,
    image:
      article.image ||
      "https://cdn.makitatools.com/apps/wms/home/images/product/hero-august-gwt11z.webp",
    type: "article",
  };
};
