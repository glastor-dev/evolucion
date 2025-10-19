# Archivos archivados: Services Pages

Este directorio contiene versiones antiguas o alternativas de páginas de Servicios que ya no se utilizan en la app actual.

Estado actual:

- La aplicación solo enruta a `HomePage` y el bloque de servicios activo es `src/components/ServicesSection_Cinematic.tsx` (renderizado en `HomePage`).
- Ninguna de las páginas `src/pages/Services*.tsx` estaba enlazada por el router.

Motivo del archivo:

- Mantener el proyecto limpio, ligero y fácil de mantener.
- Conservar referencias y ejemplos por si se necesitan más adelante.

Cómo restaurar/usar alguna de estas páginas:

- Mover el archivo deseado desde `src/pages/_archive/services/` de vuelta a `src/pages/`.
- Añadir una nueva ruta en `src/AppRouter.tsx` que apunte a esa página, por ejemplo:
  - `<Route path="/services" element={<ServicesSimple />} />`
- O importar el componente en una página existente para pruebas puntuales.

Notas técnicas:

- `tsconfig.json` fue actualizado para excluir `src/pages/_archive/**` del chequeo de TypeScript.
- Si desea compilar estos archivos nuevamente, quite esa ruta del `exclude` en `tsconfig.json`.
