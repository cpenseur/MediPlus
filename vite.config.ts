import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
    proxy: {
      // Proxy for SEA-LION API
      "/api/sea-lion": {
        target: "https://api.sea-lion.ai/v1",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/sea-lion/, ""),
      },
    },
  },
  plugins: [
    react(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
