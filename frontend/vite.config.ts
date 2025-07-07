// ✅ vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss()
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // Shortcut `@/` for `src/`
    },
  },

  server: {
    proxy: {
      '/rag': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rag/, '/oracle/ask'),
      },
      '/images': {
        target: 'http://localhost:8004',
        changeOrigin: true,
      },
    },
  },
});