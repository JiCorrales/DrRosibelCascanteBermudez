// Post-build: SPA fallback para GitHub Pages.
//
// GitHub Pages no soporta rewrites server-side, así que cualquier ruta no encontrada
// (ej. /sobre, /admin/login, /servicios/individual) devuelve 404.html.
// Si 404.html = copia exacta de index.html, React Router toma el control y resuelve
// la ruta correcta del lado del cliente.
//
// Limitación conocida: la respuesta HTTP sigue siendo 404 para esas rutas. Para los
// usuarios humanos es invisible; para crawlers/SEO no es ideal. Si llega el momento
// de optimizar SEO se puede migrar a la técnica de redirección de spa-github-pages.

import { copyFileSync, writeFileSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const dist = join(here, '..', 'dist');

if (!existsSync(join(dist, 'index.html'))) {
  console.error('✗ dist/index.html no existe — ¿corrió vite build?');
  process.exit(1);
}

copyFileSync(join(dist, 'index.html'), join(dist, '404.html'));
writeFileSync(join(dist, '.nojekyll'), '');

console.log('✓ dist/404.html escrito (SPA fallback)');
console.log('✓ dist/.nojekyll escrito (deshabilita el procesamiento Jekyll de GitHub Pages)');
