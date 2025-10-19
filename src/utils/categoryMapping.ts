// Mapeo de categorías con sus URLs y metadatos
export interface CategoryInfo {
  name: string;
  slug: string;
  url: string;
  parent?: string;
  description?: string;
}

// Mapeo completo de categorías
export const CATEGORY_MAPPING: Record<string, CategoryInfo> = {
  // Categorías principales
  "Taladros": {
    name: "Taladros",
    slug: "taladros",
    url: "/tienda?categories=Taladros",
    description: "Taladros eléctricos y inalámbricos"
  },
  "Sierras": {
    name: "Sierras",
    slug: "sierras", 
    url: "/tienda?categories=Sierras",
    description: "Sierras circulares, caladoras y más"
  },
  "Martillos": {
    name: "Martillos",
    slug: "martillos",
    url: "/tienda?categories=Martillos", 
    description: "Martillos perforadores y demoledores"
  },
  "Amoladoras": {
    name: "Amoladoras",
    slug: "amoladoras",
    url: "/tienda?categories=Amoladoras",
    description: "Amoladoras angulares y rectas"
  },
  "Lijadoras": {
    name: "Lijadoras", 
    slug: "lijadoras",
    url: "/tienda?categories=Lijadoras",
    description: "Lijadoras orbitales y de banda"
  },
  "Atornilladores": {
    name: "Atornilladores",
    slug: "atornilladores", 
    url: "/tienda?categories=Atornilladores",
    description: "Atornilladores eléctricos e inalámbricos"
  },
  "Fresadoras": {
    name: "Fresadoras",
    slug: "fresadoras",
    url: "/tienda?categories=Fresadoras",
    description: "Fresadoras de mano y de mesa"
  },
  "Ingletadoras": {
    name: "Ingletadoras", 
    slug: "ingletadoras",
    url: "/tienda?categories=Ingletadoras",
    description: "Ingletadoras telescópicas y compuestas"
  },
  "Cepillos": {
    name: "Cepillos",
    slug: "cepillos",
    url: "/tienda?categories=Cepillos", 
    description: "Cepillos eléctricos para madera"
  },
  "Pistolas": {
    name: "Pistolas",
    slug: "pistolas",
    url: "/tienda?categories=Pistolas",
    description: "Pistolas de calor y de clavos"
  },
  "Multiherramientas": {
    name: "Multiherramientas",
    slug: "multiherramientas", 
    url: "/tienda?categories=Multiherramientas",
    description: "Herramientas oscilantes multifunción"
  },
  "Soldadores": {
    name: "Soldadores",
    slug: "soldadores",
    url: "/tienda?categories=Soldadores",
    description: "Soldadores eléctricos y estaciones"
  },
  "Aspiradoras": {
    name: "Aspiradoras",
    slug: "aspiradoras", 
    url: "/tienda?categories=Aspiradoras",
    description: "Aspiradoras industriales y de taller"
  },
  "Compresores": {
    name: "Compresores",
    slug: "compresores",
    url: "/tienda?categories=Compresores",
    description: "Compresores de aire portátiles"
  },
  "Generadores": {
    name: "Generadores",
    slug: "generadores",
    url: "/tienda?categories=Generadores", 
    description: "Generadores eléctricos portátiles"
  },
  "Medición": {
    name: "Medición",
    slug: "medicion",
    url: "/tienda?categories=Medición",
    description: "Instrumentos de medición y nivel"
  },
  "Accesorios": {
    name: "Accesorios",
    slug: "accesorios",
    url: "/tienda?categories=Accesorios",
    description: "Accesorios y repuestos"
  },
  "Baterías": {
    name: "Baterías",
    slug: "baterias", 
    url: "/tienda?categories=Baterías",
    description: "Baterías y cargadores"
  }
};

// Función para obtener información de categoría
export const getCategoryInfo = (categoryName: string): CategoryInfo | null => {
  return CATEGORY_MAPPING[categoryName] || null;
};

// Función para generar breadcrumbs dinámicos
export const generateDynamicBreadcrumbs = (
  productName: string,
  categoryName?: string,
  currentPath?: string
) => {
  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Tienda", url: "/tienda" }
  ];

  // Agregar categoría si existe
  if (categoryName) {
    const categoryInfo = getCategoryInfo(categoryName);
    if (categoryInfo) {
      breadcrumbs.push({
        name: categoryInfo.name,
        url: categoryInfo.url
      });
    }
  }

  // Agregar producto actual
  breadcrumbs.push({
    name: productName,
    url: currentPath || window.location.pathname
  });

  return breadcrumbs;
};

// Función para generar breadcrumbs para páginas de categoría
export const generateCategoryBreadcrumbs = (categoryName: string) => {
  const breadcrumbs = [
    { name: "Inicio", url: "/" },
    { name: "Tienda", url: "/tienda" }
  ];

  const categoryInfo = getCategoryInfo(categoryName);
  if (categoryInfo) {
    breadcrumbs.push({
      name: categoryInfo.name,
      url: categoryInfo.url
    });
  }

  return breadcrumbs;
};

// Función para normalizar nombres de categoría
export const normalizeCategoryName = (category: string): string => {
  // Manejar variaciones comunes
  const normalizations: Record<string, string> = {
    "taladro": "Taladros",
    "sierra": "Sierras", 
    "martillo": "Martillos",
    "amoladora": "Amoladoras",
    "lijadora": "Lijadoras",
    "atornillador": "Atornilladores",
    "fresadora": "Fresadoras",
    "ingletadora": "Ingletadoras",
    "cepillo": "Cepillos",
    "pistola": "Pistolas",
    "multiherramienta": "Multiherramientas",
    "soldador": "Soldadores",
    "aspiradora": "Aspiradoras",
    "compresor": "Compresores",
    "generador": "Generadores",
    "medicion": "Medición",
    "accesorio": "Accesorios",
    "bateria": "Baterías"
  };

  const normalized = normalizations[category.toLowerCase()];
  return normalized || category;
};