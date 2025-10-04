/**
 * Configuración manual de Strapi para Glastor
 * Usar este script si la instalación automática falla
 */

const fs = require('fs');
const path = require('path');

// Estructura de directorios para Strapi
const strapiStructure = {
  'glastor-backend': {
    'package.json': {
      "name": "glastor-backend",
      "private": true,
      "version": "0.1.0",
      "description": "Backend API para Glastor",
      "scripts": {
        "build": "strapi build",
        "develop": "strapi develop",
        "start": "strapi start",
        "strapi": "strapi"
      },
      "dependencies": {
        "@strapi/strapi": "4.25.9",
        "@strapi/plugin-users-permissions": "4.25.9",
        "@strapi/plugin-i18n": "4.25.9",
        "sqlite3": "5.1.6"
      },
      "author": "Glastor Team",
      "strapi": {
        "uuid": "glastor-backend-uuid"
      },
      "engines": {
        "node": ">=18.0.0 <=20.x.x",
        "npm": ">=6.0.0"
      }
    },
    'config': {
      'database.js': `module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: path.join(__dirname, '..', env('DATABASE_FILENAME', '.tmp/data.db')),
    },
    useNullAsDefault: true,
  },
});`,
      'server.js': `module.exports = ({ env }) => ({
  host: env('HOST', '0.0.0.0'),
  port: env.int('PORT', 1337),
  app: {
    keys: env.array('APP_KEYS'),
  },
  webhooks: {
    populateRelations: env.bool('WEBHOOKS_POPULATE_RELATIONS', false),
  },
});`,
      'admin.js': `module.exports = ({ env }) => ({
  auth: {
    secret: env('ADMIN_JWT_SECRET'),
  },
  apiToken: {
    salt: env('API_TOKEN_SALT'),
  },
  transfer: {
    token: {
      salt: env('TRANSFER_TOKEN_SALT'),
    },
  },
  flags: {
    nps: env.bool('FLAG_NPS', true),
    promoteEE: env.bool('FLAG_PROMOTE_EE', true),
  },
});`,
      'middlewares.js': `module.exports = [
  'strapi::errors',
  {
    name: 'strapi::security',
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          'connect-src': ["'self'", 'https:'],
          'img-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          'media-src': ["'self'", 'data:', 'blob:', 'res.cloudinary.com'],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
  {
    name: 'strapi::cors',
    config: {
      enabled: true,
      headers: '*',
      origin: ['http://localhost:5173', 'http://localhost:3000', 'https://glastor.com']
    }
  },
  'strapi::poweredBy',
  'strapi::logger',
  'strapi::query',
  'strapi::body',
  'strapi::session',
  'strapi::favicon',
  'strapi::public',
];`
    },
    'src': {
      'api': {},
      'admin': {
        'app.js': `const config = {
  locales: ['es'],
};

const bootstrap = (app) => {
  console.log(app);
};

export default {
  config,
  bootstrap,
};`
      },
      'extensions': {},
      'index.js': `'use strict';

module.exports = {
  register(/*{ strapi }*/) {},
  bootstrap(/*{ strapi }*/) {},
};`
    },
    '.env': `HOST=0.0.0.0
PORT=1337
APP_KEYS=toBeModified1,toBeModified2
API_TOKEN_SALT=toBeModified
ADMIN_JWT_SECRET=toBeModified
TRANSFER_TOKEN_SALT=toBeModified
JWT_SECRET=toBeModified`
  }
};

// Función para crear estructura de directorios
function createDirectory(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
    console.log(`📁 Directorio creado: ${dirPath}`);
  }
}

// Función para crear archivos
function createFile(filePath, content) {
  const dir = path.dirname(filePath);
  createDirectory(dir);
  
  if (typeof content === 'object') {
    content = JSON.stringify(content, null, 2);
  }
  
  fs.writeFileSync(filePath, content);
  console.log(`📄 Archivo creado: ${filePath}`);
}

// Función principal para crear la estructura
function createStrapiStructure(basePath) {
  console.log('🚀 Creando estructura manual de Strapi...');
  
  function processStructure(structure, currentPath) {
    for (const [name, content] of Object.entries(structure)) {
      const fullPath = path.join(currentPath, name);
      
      if (typeof content === 'object' && !Array.isArray(content) && content !== null) {
        if (name.includes('.')) {
          // Es un archivo
          createFile(fullPath, content);
        } else {
          // Es un directorio
          createDirectory(fullPath);
          processStructure(content, fullPath);
        }
      } else {
        // Es un archivo con contenido string
        createFile(fullPath, content);
      }
    }
  }
  
  processStructure(strapiStructure, basePath);
  console.log('✅ Estructura de Strapi creada exitosamente');
}

// Función para instalar dependencias
function installDependencies(projectPath) {
  console.log('📦 Para instalar dependencias, ejecuta:');
  console.log(`cd ${projectPath}`);
  console.log('npm install');
}

// Función para generar claves secretas
function generateSecrets() {
  const crypto = require('crypto');
  
  const secrets = {
    APP_KEYS: [
      crypto.randomBytes(32).toString('base64'),
      crypto.randomBytes(32).toString('base64')
    ].join(','),
    API_TOKEN_SALT: crypto.randomBytes(32).toString('base64'),
    ADMIN_JWT_SECRET: crypto.randomBytes(32).toString('base64'),
    TRANSFER_TOKEN_SALT: crypto.randomBytes(32).toString('base64'),
    JWT_SECRET: crypto.randomBytes(32).toString('base64')
  };
  
  return secrets;
}

// Función para actualizar archivo .env con claves reales
function updateEnvFile(projectPath) {
  const envPath = path.join(projectPath, '.env');
  const secrets = generateSecrets();
  
  let envContent = `HOST=0.0.0.0
PORT=1337
APP_KEYS=${secrets.APP_KEYS}
API_TOKEN_SALT=${secrets.API_TOKEN_SALT}
ADMIN_JWT_SECRET=${secrets.ADMIN_JWT_SECRET}
TRANSFER_TOKEN_SALT=${secrets.TRANSFER_TOKEN_SALT}
JWT_SECRET=${secrets.JWT_SECRET}`;

  fs.writeFileSync(envPath, envContent);
  console.log('🔐 Archivo .env actualizado con claves secretas');
}

// Función principal
function setupStrapi(basePath = process.cwd()) {
  const projectPath = path.join(basePath, 'glastor-backend');
  
  try {
    createStrapiStructure(basePath);
    updateEnvFile(projectPath);
    
    console.log(`
🎉 Configuración manual de Strapi completada!

Próximos pasos:
1. cd ${projectPath}
2. npm install
3. npm run develop

El panel de administración estará disponible en: http://localhost:1337/admin
    `);
    
    return projectPath;
  } catch (error) {
    console.error('❌ Error durante la configuración:', error);
    throw error;
  }
}

// Exportar funciones para uso externo
module.exports = {
  setupStrapi,
  createStrapiStructure,
  generateSecrets,
  updateEnvFile
};

// Ejecutar si se llama directamente
if (require.main === module) {
  const basePath = process.argv[2] || process.cwd();
  setupStrapi(basePath);
}