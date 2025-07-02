import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

/**
 * Vite Configuration for Lumen Frontend
 *
 * 🔧 Features:
 * - React plugin support
 * - Development-time proxy for RAG agent and image API
 * - Project-wide alias for `@` → `src/`
 */

export default defineConfig({
  plugins: [
    react(),
  ],

  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'), // 💡 Allow `@/` to mean `src/`
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
