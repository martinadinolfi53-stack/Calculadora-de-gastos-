import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import pkg from './package.json';

// Rutas relativas: el sitio funciona en GitHub Pages (/<nombre-del-repo>/)
// sin depender de mayúsculas o del nombre exacto del repo.
const base = './';

export default defineConfig({
  base,
  define: {
    __APP_VERSION__: JSON.stringify(pkg.version),
  },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Calculadora de gastos',
        short_name: 'Gastos',
        description: 'Finanzas personales y de negocios, en tu dispositivo.',
        lang: 'es-UY',
        start_url: base,
        scope: base,
        display: 'standalone',
        orientation: 'any',
        background_color: '#eef2fb',
        theme_color: '#eef2fb',
        icons: [
          { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: 'icon-512.png', sizes: '512x512', type: 'image/png' },
          { src: 'icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,svg,png,woff2}'],
        navigateFallback: 'index.html',
      },
    }),
  ],
  test: {
    environment: 'node',
  },
});
