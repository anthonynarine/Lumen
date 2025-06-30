import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * Vite Configuration for Lumen Frontend
 *
 * This config:
 * - Enables React plugin support
 * - Configures a development-time proxy for the RAG agent backend
 * 
 * 📌 Why the proxy?
 * During development, the frontend (localhost:5173) and RAG FastAPI backend (localhost:8003)
 * are on different origins. Browsers block cross-origin requests unless the backend
 * supports CORS — which we’ve now enabled.
 * 
 * However, this proxy simplifies local development by:
 * - Avoiding full URL hardcoding in frontend API calls
 * - Preventing CORS errors even without backend changes
 * - Allowing us to use `/rag` instead of `http://localhost:8003/oracle/ask`
 *
 * In production, API calls should go directly to the real RAG API URL
 * via `VITE_RAG_API_URL` in `.env.production`.
 */
export default defineConfig({
  plugins: [react()],

  server: {
    proxy: {
      /**
       * Proxies all requests starting with `/rag` to the RAG microservice.
       * Internally rewrites `/rag` to `/oracle/ask` on the target backend.
       * Example: POST /rag → http://localhost:8003/oracle/ask
       */
      '/rag': {
        target: 'http://localhost:8003',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/rag/, '/oracle/ask'),
      },

      // 🖼️ Image API Proxy

    },
  },
})
