import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // This "resolve, alias" are only required in app build time,
  // so it isn't required to be included in "nginx.conf" file.
  // Same logic applies to "tsconfig.json", "tsconfig.node.json",
  // "tailwind.config.js", "postcss.config.js", etc files.
  // Those files are all only required in build-time.
  // In run-time, Those files are not needed at all — we can safely
  // exclude them from the final Docker image or deploy artifact.
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
