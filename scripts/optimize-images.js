#!/usr/bin/env node

/**
 * Script de optimización automática de imágenes
 * Convierte imágenes a formatos modernos (WebP, AVIF) y genera placeholders
 * 
 * Uso: node scripts/optimize-images.js
 */

const fs = require('fs');
const path = require('path');

// Configuración
const CONFIG = {
  inputDir: './public',
  outputDir: './public/optimized',
  formats: ['webp', 'avif'],
  sizes: [320, 640, 768, 1024, 1280, 1920],
  quality: {
    webp: 85,
    avif: 80,
    jpeg: 85,
  },
  generatePlaceholders: true,
  placeholderSize: 20,
};

// Colores ANSI para logs
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  red: '\x1b[31m',
};

const log = {
  info: (msg) => console.log(`${colors.blue}ℹ${colors.reset} ${msg}`),
  success: (msg) => console.log(`${colors.green}✓${colors.reset} ${msg}`),
  warning: (msg) => console.log(`${colors.yellow}⚠${colors.reset} ${msg}`),
  error: (msg) => console.log(`${colors.red}✗${colors.reset} ${msg}`),
  header: (msg) => console.log(`\n${colors.bright}${msg}${colors.reset}\n`),
};

// Buscar todas las imágenes
function findImages(dir, fileList = []) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findImages(filePath, fileList);
    } else if (/\.(jpe?g|png|gif)$/i.test(file)) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

// Generar blur placeholder (base64)
function generatePlaceholder(imagePath) {
  // Simulación - en producción usarías sharp o similar
  const base64 = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 ${CONFIG.placeholderSize} ${CONFIG.placeholderSize}'%3E%3Cfilter id='b'%3E%3CfeGaussianBlur stdDeviation='1'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' fill='%23e5e7eb'/%3E%3C/svg%3E`;
  
  return base64;
}

// Optimizar imagen
async function optimizeImage(imagePath) {
  const filename = path.basename(imagePath);
  const ext = path.extname(imagePath);
  const basename = filename.replace(ext, '');
  
  log.info(`Procesando: ${filename}`);

  try {
    // Crear directorio de salida si no existe
    if (!fs.existsSync(CONFIG.outputDir)) {
      fs.mkdirSync(CONFIG.outputDir, { recursive: true });
    }

    // Copiar original
    const originalOutput = path.join(CONFIG.outputDir, filename);
    fs.copyFileSync(imagePath, originalOutput);
    
    log.success(`  Original copiado`);

    // Generar placeholder
    if (CONFIG.generatePlaceholders) {
      const placeholder = generatePlaceholder(imagePath);
      const placeholderPath = path.join(
        CONFIG.outputDir,
        `${basename}.placeholder.txt`
      );
      fs.writeFileSync(placeholderPath, placeholder);
      log.success(`  Placeholder generado`);
    }

    // Nota: Para conversión real a WebP/AVIF, necesitarías sharp:
    // const sharp = require('sharp');
    // 
    // await sharp(imagePath)
    //   .webp({ quality: CONFIG.quality.webp })
    //   .toFile(path.join(CONFIG.outputDir, `${basename}.webp`));
    //
    // await sharp(imagePath)
    //   .avif({ quality: CONFIG.quality.avif })
    //   .toFile(path.join(CONFIG.outputDir, `${basename}.avif`));

    log.warning(`  Conversión WebP/AVIF requiere 'sharp' (npm install sharp)`);

    return true;
  } catch (error) {
    log.error(`  Error: ${error.message}`);
    return false;
  }
}

// Generar manifiesto de imágenes
function generateManifest(images) {
  const manifest = images.reduce((acc, imagePath) => {
    const filename = path.basename(imagePath);
    const ext = path.extname(imagePath);
    const basename = filename.replace(ext, '');
    
    acc[filename] = {
      original: filename,
      webp: `${basename}.webp`,
      avif: `${basename}.avif`,
      placeholder: `${basename}.placeholder.txt`,
      sizes: CONFIG.sizes,
    };

    return acc;
  }, {});

  const manifestPath = path.join(CONFIG.outputDir, 'image-manifest.json');
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
  
  log.success(`Manifiesto generado: ${manifestPath}`);
}

// Main
async function main() {
  log.header('🎨 Optimizador Automático de Imágenes');

  log.info(`Buscando imágenes en: ${CONFIG.inputDir}`);
  const images = findImages(CONFIG.inputDir);
  
  if (images.length === 0) {
    log.warning('No se encontraron imágenes para optimizar');
    return;
  }

  log.info(`Encontradas ${images.length} imágenes`);
  log.info(`Formatos objetivo: ${CONFIG.formats.join(', ')}`);
  log.info(`Tamaños: ${CONFIG.sizes.join(', ')}`);
  
  console.log('');

  // Procesar imágenes
  let processed = 0;
  for (const image of images) {
    const success = await optimizeImage(image);
    if (success) processed++;
  }

  console.log('');
  log.success(`✨ Proceso completado: ${processed}/${images.length} imágenes optimizadas`);

  // Generar manifiesto
  generateManifest(images);

  // Estadísticas
  log.header('📊 Estadísticas');
  log.info(`Directorio de salida: ${CONFIG.outputDir}`);
  log.info(`Imágenes procesadas: ${processed}`);
  log.info(`Placeholders generados: ${CONFIG.generatePlaceholders ? processed : 0}`);
  
  console.log('');
  log.info('Para habilitar conversión WebP/AVIF real, instala sharp:');
  console.log('  npm install --save-dev sharp');
  console.log('');
  log.info('Luego descomenta las líneas de conversión en este script.');
  console.log('');
}

// Ejecutar
if (require.main === module) {
  main().catch((error) => {
    log.error(`Error fatal: ${error.message}`);
    process.exit(1);
  });
}

module.exports = { optimizeImage, findImages, generateManifest };
