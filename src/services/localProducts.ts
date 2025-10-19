// Datos de productos locales simulados (estáticos)
import { Product } from "./productSchema";
import { startAutoSync, getProductStock, updateProductStock } from './syncProducts';
export type { Product };

// Interfaces para respuestas de API
export interface ProductsResponse {
  products: Product[];
  error?: string | null;
}

export interface ProductResponse {
  product?: Product | null;
  error?: string | null;
}

// Iniciar la sincronización automática cuando se importe el módulo
const stopSync = startAutoSync(5000); // Sincronizar cada 5 segundos

// Función para cargar productos del JSON público
export const fetchJsonProducts = async (): Promise<Product[]> => {
  try {
    const jsonUrl = '/products.json';
    console.log('🔄 Iniciando carga de productos desde:', jsonUrl);
    console.log('🌐 URL completa:', window.location.origin + jsonUrl);
    console.log('🌐 Headers de la solicitud:', {
      'Accept': 'application/json',
      'Cache-Control': 'no-cache'
    });
    
    const response = await fetch(jsonUrl, {
      headers: {
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      }
    });
    
    console.log('📡 Estado de la respuesta:', response.status, response.statusText);
    console.log('📡 Headers de la respuesta:', Object.fromEntries(response.headers.entries()));
    console.log('📡 Tipo de contenido:', response.headers.get('content-type'));
    
    if (!response.ok) {
      console.error('❌ Error HTTP:', response.status, response.statusText);
      console.error('❌ Headers de error:', Object.fromEntries(response.headers.entries()));
      const errorText = await response.text();
      console.error('❌ Cuerpo del error:', errorText);
      throw new Error(`Error HTTP: ${response.status} ${response.statusText}\nCuerpo: ${errorText}`);
    }
    
    const responseText = await response.text();
    console.log('📦 Longitud del texto recibido:', responseText.length);
    console.log('📦 Primeros 200 caracteres:', responseText.slice(0, 200));
    console.log('📦 Últimos 200 caracteres:', responseText.slice(-200));
    
    let data;
    try {
      data = JSON.parse(responseText);
      console.log('📦 JSON parseado correctamente');
    } catch (parseError) {
      console.error('❌ Error al parsear JSON:', parseError);
      console.error('❌ Texto que causó el error:', responseText);
      throw new Error(`Error al parsear JSON: ${parseError instanceof Error ? parseError.message : 'Error desconocido'}`);
    }
    
    console.log('📦 Tipo de datos recibidos:', typeof data);
    console.log('📦 Es un array?', Array.isArray(data));
    console.log('📦 Longitud de datos:', data?.length);
    if (Array.isArray(data) && data.length > 0) {
      console.log('📦 Estructura del primer elemento:', Object.keys(data[0]));
      console.log('📦 Muestra del primer elemento:', JSON.stringify(data[0], null, 2));
    }
    
    if (!Array.isArray(data)) {
      console.error('❌ Datos no válidos:', typeof data, data);
      throw new Error('El archivo products.json no contiene un array de productos');
    }
    
    console.log('📦 Productos cargados del JSON:', data.length);
    
    const mappedProducts = data.map((product: any) => {
      try {
        // Transformar imageGallery manteniendo la estructura completa
        const transformedGallery = product.imageGallery?.map((img: any) => {
          if (typeof img === 'string') {
            return { url: img, alt: product.name || 'Imagen del producto' };
          }
          return {
            url: img.url,
            alt: img.alt || product.name || 'Imagen del producto'
          };
        }) || [];

        // Asegurarse de que el ID sea string y que inStock tenga un valor por defecto
        const transformedProduct = {
          ...product,
          id: String(product.id),
          imageGallery: transformedGallery,
          inStock: product.inStock ?? true, // Si no está definido, asumimos que está en stock
          stockQuantity: product.stockQuantity ?? getProductStock(String(product.id)) // Usar el stock del mapa
        };
        
        console.log(`✅ Producto ${product.id} transformado correctamente`);
        return transformedProduct;
      } catch (error) {
        console.error(`❌ Error al transformar producto:`, product, error);
        throw error;
      }
    });
    
    console.log('✅ Total de productos transformados:', mappedProducts.length);
    if (mappedProducts.length === 0) {
      throw new Error('No se encontraron productos en el archivo JSON');
    }
    
    console.log('🔍 Muestra del primer producto transformado:', mappedProducts[0]);
    return mappedProducts;
  } catch (error) {
    console.error('❌ Error al cargar productos:', error);
    console.error('❌ Stack trace:', error instanceof Error ? error.stack : 'No stack trace available');
    throw error; // Re-lanzar el error para que sea manejado por getAllProducts
  }
};

// Función para obtener todos los productos
export const getAllProducts = async (): Promise<ProductsResponse> => {
  console.log('localProducts - getAllProducts - start');
  
  try {
    // Cargar productos del JSON dinámicamente
    const products = await fetchJsonProducts();
    console.log('localProducts - getAllProducts - products loaded:', products.length);
    console.log('localProducts - getAllProducts - first 3 products:', products.slice(0, 3));
    
    if (!products || products.length === 0) {
      throw new Error('No se pudieron cargar los productos');
    }
    
    return { products, error: null };
  } catch (error) {
    console.error('Error en getAllProducts:', error);
    return { products: [], error: 'Error al cargar productos' };
  }
};

// Re-exportar las funciones de stock
export { updateProductStock, getProductStock };

// Función para obtener un producto por ID
export const getProductById = async (id: string | number): Promise<Product | null> => {
  console.log('localProducts - getProductById - id:', id);
  
  try {
    const allProducts = await getAllProducts();
    console.log('localProducts - getProductById - allProducts:', allProducts);

    if (allProducts.error) {
      console.error('Error al obtener productos:', allProducts.error);
      return null;
    }

    const product = allProducts.products.find(p => String(p.id) === String(id));
    console.log('localProducts - getProductById - found product:', product);

    if (!product) {
      console.log('localProducts - getProductById - producto no encontrado');
      return null;
    }

    // Asegurarse de que el ID sea string y que inStock tenga un valor por defecto
    return {
      ...product,
      id: String(product.id),
      inStock: product.inStock ?? true,
      stockQuantity: product.stockQuantity ?? getProductStock(String(product.id))
    };
  } catch (error) {
    console.error('Error en getProductById:', error);
    return null;
  }
};

// Función para obtener el título del producto
export const getProductTitle = (p: Product): string => {
  if (p.brand && p.brand.trim() !== "") {
    return `${p.name} - ${p.brand}`;
  }
  return p.name || "Producto sin nombre";
};

// Función para detener la sincronización (exportada para casos de prueba o limpieza)
export const stopProductSync = () => stopSync();
