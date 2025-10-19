/* Verifica que React Router esté fijado en v6 y que overrides estén presentes */
const fs = require('fs');

function readJson(path) {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

const errors = [];

// 1) Revisar package.json
const pkg = readJson('package.json');
const deps = pkg.dependencies || {};
const overrides = pkg.overrides || {};

const rrdDep = deps['react-router-dom'];
if (!rrdDep) errors.push('react-router-dom no está en dependencies');
if (/^[\^~]/.test(rrdDep || '')) errors.push('react-router-dom usa ^ o ~, debe ser versión exacta (sin prefijos)');

const rrOverride = overrides['react-router'];
const rrdOverride = overrides['react-router-dom'];
if (!rrOverride) errors.push('override de react-router faltante en package.json');
if (!rrdOverride) errors.push('override de react-router-dom faltante en package.json');
if (rrdOverride && rrdDep && rrdOverride !== rrdDep) errors.push('override react-router-dom no coincide con dependencies');

// 2) Revisar package-lock.json instalado
let lock;
if (fs.existsSync('package-lock.json')) {
  try {
    lock = readJson('package-lock.json');
  } catch (e) {
    errors.push('No se pudo leer package-lock.json: ' + e.message);
  }
}

function lockVer(name) {
  if (!lock || !lock.packages) return null;
  const key = `node_modules/${name}`;
  const entry = lock.packages[key];
  return entry && entry.version ? entry.version : null;
}

const vDom = lockVer('react-router-dom');
const vCore = lockVer('react-router');
if (vDom && !vDom.startsWith('6.')) errors.push(`react-router-dom instalado ${vDom} no es 6.x`);
if (vCore && !vCore.startsWith('6.')) errors.push(`react-router instalado ${vCore} no es 6.x`);

if (errors.length) {
  console.error('Router Doctor: FAIL');
  for (const e of errors) console.error(' - ' + e);
  process.exit(1);
} else {
  console.log('Router Doctor: OK (React Router v6)');
}
