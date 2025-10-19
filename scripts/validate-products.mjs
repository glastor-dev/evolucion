#!/usr/bin/env node

/**
 * Script de validación de productos JSON
 * Se ejecuta automáticamente con Husky en pre-commit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Función simple de validación sin dependencias externas
const validateProducts = (data) => {
  if (!Array.isArray(data)) {
    throw new Error('Los productos deben ser un array');
  }

  const errors = [];

  data.forEach((product, index) => {
    // Validaciones básicas
    if (!product.id) {
      errors.push(`Producto ${index}: ID requerido`);
    }
    if (!product.name && !product.sku) {
      errors.push(`Producto ${index}: Nombre o SKU requerido`);
    }
    if (!product.category) {
      errors.push(`Producto ${index}: Categoría requerida`);
    }
    if (typeof product.price !== 'number' && isNaN(parseFloat(product.price))) {
      errors.push(`Producto ${index}: Precio inválido`);
    }
  });

  if (errors.length > 0) {
    throw new Error('Errores de validación:\n' + errors.join('\n'));
  }

  return data;
};

const productsPath = path.join(__dirname, '..', 'src', 'services', 'products.json');

console.log('🔍 Validando archivo de productos JSON...');

try {
  // Leer el archivo JSON
  const productsData = JSON.parse(fs.readFileSync(productsPath, 'utf-8'));

  // Validar con validación básica
  const validatedProducts = validateProducts(productsData);

  console.log(`✅ Validación exitosa: ${validatedProducts.length} productos válidos`);

  // Verificaciones adicionales
  const errors = [];

  // Verificar IDs únicos
  const ids = validatedProducts.map(p => p.id);
  const uniqueIds = new Set(ids);
  if (ids.length !== uniqueIds.size) {
    errors.push('❌ IDs duplicados encontrados');
  }

  // Verificar SKUs únicos (si existen)
  const skus = validatedProducts.map(p => p.sku).filter(Boolean);
  const uniqueSkus = new Set(skus);
  if (skus.length !== uniqueSkus.size) {
    errors.push('❌ SKUs duplicados encontrados');
  }

  // Verificar precios válidos
  const invalidPrices = validatedProducts.filter(p => {
    const price = typeof p.price === 'string' ? parseFloat(p.price) : p.price;
    return isNaN(price) || price <= 0;
  });
  if (invalidPrices.length > 0) {
    errors.push(`❌ ${invalidPrices.length} productos con precios inválidos`);
  }

  // Verificar URLs de imágenes
  const invalidImages = validatedProducts.filter(p => {
    if (!p.image) return false;
    try {
      new URL(p.image);
      return false;
    } catch {
      return true;
    }
  });
  if (invalidImages.length > 0) {
    errors.push(`❌ ${invalidImages.length} productos con URLs de imagen inválidas`);
  }

  if (errors.length > 0) {
    console.error('Errores encontrados:');
    errors.forEach(error => console.error(error));
    process.exit(1);
  }

  console.log('🎉 Archivo de productos completamente válido');
  process.exit(0);

} catch (error) {
  console.error('❌ Error al validar productos JSON:', error.message);
  process.exit(1);
}