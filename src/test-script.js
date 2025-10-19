console.log('Aplicación cargada correctamente');
console.log('URL actual:', window.location.href);
console.log('User Agent:', navigator.userAgent);

// Verificar si React está disponible
if (typeof React !== 'undefined') {
  console.log('React está disponible');
} else {
  console.error('React no está disponible');
}

// Verificar si el DOM está listo
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM completamente cargado');
});