import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";
// import path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    // proxy: {
    // "/api": {
    // target: "http://localhost:5000",
    // changeOrigin: true,
    // rewrite: (path) => path.replace(/^\/api/, ""),
    // },
    // },
    fs: {
      allow: ['..']
    }
  },
  optimizeDeps: {
    exclude: ['vue-router']
  },
  plugins: [
    {
      name: "configure-response-headers",
      configureServer: (server) => {
        server.middlewares.use((_req, res, next) => {
          res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
          res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
          next();
        });
      },
    },
    vue(),
  ],
});