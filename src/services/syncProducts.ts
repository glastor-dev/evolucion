import { Product } from './productSchema';

// Mapa para mantener el stock actualizado en memoria
let stockMap = new Map<string, number>();

// Función para actualizar el stock de un producto
export const updateProductStock = (productId: string, quantity: number): boolean => {
  stockMap.set(productId, quantity);
  return true;
};

// Función para obtener el stock actual de un producto
export const getProductStock = (productId: string): number => {
  return stockMap.get(productId) ?? 22; // Stock por defecto si no existe
};

// Función para sincronizar el stock desde products.json
export const syncProductsStock = async (): Promise<void> => {
  try {
    // Cargar productos del JSON
    const response = await fetch('/products.json');
    const products: Product[] = await response.json();
    
    // Sincronizar el stock de cada producto
    products.forEach(product => {
      const productId = String(product.id);
      const stockQuantity = product.stockQuantity ?? 22;
      
      // Actualizar el stock directamente en el mapa
      stockMap.set(productId, stockQuantity);
    });
    
    console.log('Stock sincronizado correctamente desde products.json');
  } catch (error) {
    console.error('Error al sincronizar el stock:', error);
  }
};

// Función para iniciar la sincronización automática
export const startAutoSync = (intervalMs: number = 5000): () => void => {
  // Realizar la sincronización inicial
  syncProductsStock();
  
  // Configurar la sincronización periódica
  const intervalId = setInterval(syncProductsStock, intervalMs);
  
  // Retornar función para detener la sincronización
  return () => clearInterval(intervalId);
};