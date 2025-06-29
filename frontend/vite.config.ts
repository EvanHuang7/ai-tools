import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    proxy: {
      "/api/node": {
        target: "http://localhost:3000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/node/, ""),
        secure: false,
      },
      "/api/go": {
        target: "http://localhost:8000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/go/, ""),
        secure: false,
      },
      "/api/python": {
        target: "http://localhost:8088",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/python/, ""),
        secure: false,
      },
    },
  },
});
