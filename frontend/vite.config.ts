// ✅ vite.config.ts
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),        // React Fast Refresh + JSX support
    tailwindcss(),  // TailwindCSS integration
  ],

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"), // Shortcut: "@/..." = "src/..."
    },
  },

  server: {
    proxy: {
      // 🔑 Auth service (Django/FastAPI)
      "/auth": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },

      // 🔑 Main Lumen API
      "/api": {
        target: "http://localhost:8000",
        changeOrigin: true,
      },

      // 🔑 RAG Agent (Dubin microservice)
      "/rag": {
        target: "http://localhost:8003",
        changeOrigin: true,
        // Rewrite /rag/* → /oracle/ask/* for backend FastAPI route
        rewrite: (p) => p.replace(/^\/rag/, "/oracle/ask"),
      },

      // 🔑 Image API microservice
      "/images": {
        target: "http://localhost:8004",
        changeOrigin: true,
      },
    },
  },
});
