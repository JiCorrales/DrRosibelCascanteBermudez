import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Base path para deploy.
// - Dev local:        VITE_BASE no seteado → '/'
// - GitHub Pages:     VITE_BASE='/DrRosibelCascanteBermudez/' (lo inyecta el workflow)
// - Dominio propio:   VITE_BASE='/' (o no setearlo)
const base = process.env.VITE_BASE || '/';

export default defineConfig({
  base,
  plugins: [react()],
  server: {
    host: '127.0.0.1',
    port: 5173,
    strictPort: true,
    open: false,
  },
  preview: {
    host: '127.0.0.1',
    port: 4173,
    strictPort: true,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/tests/setup.js'],
    include: ['src/**/*.test.{js,jsx}'],
    css: true,
  },
});
