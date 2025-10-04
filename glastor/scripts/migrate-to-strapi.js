/**
 * Script de migración para transferir datos existentes a Strapi
 * Ejecutar después de configurar Strapi y crear los modelos
 */

const fs = require('fs');
const path = require('path');

// Configuración de la API de Strapi
const STRAPI_URL = 'http://localhost:1337/api';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN; // Token de API de Strapi

// Datos de ejemplo basados en tu aplicación actual
const sampleProducts = [
  {
    name: "Vidrio Templado Premium",
    description: "Vidrio templado de alta calidad para ventanas y puertas. Resistente a impactos y cambios de temperatura.",
    price: 150000,
    discountPrice: 135000,
    slug: "vidrio-templado-premium",
    specifications: {
      material: "Vidrio templado",
      color: ["Transparente", "Bronce", "Gris"],
      brand: "Glastor",
      warranty: "2 años",
      origin: "Colombia"
    },
    stock: 50,
    featured: true,
    tags: ["vidrio", "templado", "premium", "ventanas"],
    sku: "VT-PREM-001",
    weight: 25.5,
    dimensions: {
      length: 200,
      width: 150,
      height: 0.6,
      unit: "cm"
    },
    seoTitle: "Vidrio Templado Premium - Glastor",
    seoDescription: "Vidrio templado de alta calidad, resistente y duradero. Ideal para ventanas y puertas.",
    isActive: true
  },
  {
    name: "Espejo Decorativo",
    description: "Espejo decorativo con marco elegante, perfecto para baños y habitaciones.",
    price: 80000,
    slug: "espejo-decorativo",
    specifications: {
      material: "Vidrio espejo",
      color: ["Plateado"],
      brand: "Glastor",
      warranty: "1 año",
      origin: "Colombia"
    },
    stock: 30,
    featured: false,
    tags: ["espejo", "decorativo", "baño", "habitación"],
    sku: "ESP-DEC-001",
    weight: 5.2,
    dimensions: {
      length: 60,
      width: 80,
      height: 0.4,
      unit: "cm"
    },
    seoTitle: "Espejo Decorativo - Glastor",
    seoDescription: "Espejo decorativo de alta calidad con marco elegante.",
    isActive: true
  },
  {
    name: "Vidrio Laminado Seguridad",
    description: "Vidrio laminado de seguridad, ideal para fachadas y ventanas de gran tamaño.",
    price: 200000,
    discountPrice: 180000,
    slug: "vidrio-laminado-seguridad",
    specifications: {
      material: "Vidrio laminado",
      color: ["Transparente", "Verde", "Azul"],
      brand: "Glastor",
      warranty: "3 años",
      origin: "Colombia"
    },
    stock: 25,
    featured: true,
    tags: ["vidrio", "laminado", "seguridad", "fachadas"],
    sku: "VL-SEG-001",
    weight: 35.8,
    dimensions: {
      length: 300,
      width: 200,
      height: 1.2,
      unit: "cm"
    },
    seoTitle: "Vidrio Laminado de Seguridad - Glastor",
    seoDescription: "Vidrio laminado de alta seguridad para fachadas y ventanas grandes.",
    isActive: true
  }
];

const sampleCategories = [
  {
    name: "Vidrios Templados",
    description: "Vidrios templados de alta resistencia para diferentes aplicaciones",
    slug: "vidrios-templados",
    sortOrder: 1,
    isActive: true,
    seoTitle: "Vidrios Templados - Glastor",
    seoDescription: "Amplia gama de vidrios templados de alta calidad y resistencia."
  },
  {
    name: "Espejos",
    description: "Espejos decorativos y funcionales para hogar y oficina",
    slug: "espejos",
    sortOrder: 2,
    isActive: true,
    seoTitle: "Espejos - Glastor",
    seoDescription: "Espejos de alta calidad para decoración y uso funcional."
  },
  {
    name: "Vidrios Laminados",
    description: "Vidrios laminados de seguridad para aplicaciones especiales",
    slug: "vidrios-laminados",
    sortOrder: 3,
    isActive: true,
    seoTitle: "Vidrios Laminados - Glastor",
    seoDescription: "Vidrios laminados de seguridad para máxima protección."
  }
];

// Función para hacer peticiones a Strapi
async function strapiRequest(endpoint, method = 'GET', data = null) {
  const url = `${STRAPI_URL}${endpoint}`;
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${STRAPI_TOKEN}`
    }
  };

  if (data) {
    options.body = JSON.stringify({ data });
  }

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.error(`Error en petición a ${endpoint}:`, error);
    throw error;
  }
}

// Función para migrar categorías
async function migrateCategories() {
  console.log('🏷️  Migrando categorías...');
  
  for (const category of sampleCategories) {
    try {
      const result = await strapiRequest('/categories', 'POST', category);
      console.log(`✅ Categoría creada: ${category.name}`);
    } catch (error) {
      console.error(`❌ Error creando categoría ${category.name}:`, error.message);
    }
  }
}

// Función para migrar productos
async function migrateProducts() {
  console.log('📦 Migrando productos...');
  
  // Primero obtener las categorías para hacer las relaciones
  const categoriesResponse = await strapiRequest('/categories');
  const categories = categoriesResponse.data;
  
  for (const product of sampleProducts) {
    try {
      // Encontrar la categoría correspondiente
      let categoryId = null;
      if (product.name.includes('Templado')) {
        categoryId = categories.find(cat => cat.attributes.slug === 'vidrios-templados')?.id;
      } else if (product.name.includes('Espejo')) {
        categoryId = categories.find(cat => cat.attributes.slug === 'espejos')?.id;
      } else if (product.name.includes('Laminado')) {
        categoryId = categories.find(cat => cat.attributes.slug === 'vidrios-laminados')?.id;
      }
      
      // Agregar la relación de categoría
      if (categoryId) {
        product.category = categoryId;
      }
      
      const result = await strapiRequest('/products', 'POST', product);
      console.log(`✅ Producto creado: ${product.name}`);
    } catch (error) {
      console.error(`❌ Error creando producto ${product.name}:`, error.message);
    }
  }
}

// Función principal de migración
async function migrate() {
  console.log('🚀 Iniciando migración a Strapi...');
  
  if (!STRAPI_TOKEN) {
    console.error('❌ Error: STRAPI_TOKEN no está configurado');
    console.log('💡 Configura la variable de entorno STRAPI_TOKEN con tu token de API de Strapi');
    process.exit(1);
  }
  
  try {
    // Verificar conexión con Strapi
    await strapiRequest('/categories');
    console.log('✅ Conexión con Strapi establecida');
    
    // Migrar datos
    await migrateCategories();
    await migrateProducts();
    
    console.log('🎉 Migración completada exitosamente!');
  } catch (error) {
    console.error('❌ Error durante la migración:', error.message);
    process.exit(1);
  }
}

// Función para generar datos de prueba adicionales
function generateTestData() {
  console.log('📝 Generando archivo de datos de prueba...');
  
  const testData = {
    categories: sampleCategories,
    products: sampleProducts
  };
  
  fs.writeFileSync(
    path.join(__dirname, 'test-data.json'),
    JSON.stringify(testData, null, 2)
  );
  
  console.log('✅ Archivo test-data.json generado');
}

// Ejecutar según argumentos de línea de comandos
const command = process.argv[2];

switch (command) {
  case 'migrate':
    migrate();
    break;
  case 'generate':
    generateTestData();
    break;
  default:
    console.log(`
🔧 Script de migración a Strapi

Uso:
  node migrate-to-strapi.js migrate   - Migrar datos a Strapi
  node migrate-to-strapi.js generate - Generar archivo de datos de prueba

Antes de ejecutar:
1. Asegúrate de que Strapi esté ejecutándose en http://localhost:1337
2. Configura la variable de entorno STRAPI_TOKEN
3. Crea los modelos Product y Category en Strapi

Ejemplo:
  STRAPI_TOKEN=tu_token_aqui node migrate-to-strapi.js migrate
    `);
}

module.exports = {
  migrate,
  generateTestData,
  sampleProducts,
  sampleCategories
};