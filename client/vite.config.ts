import { defineConfig } from "vite";

import vue from "@vitejs/plugin-vue";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(),
  {
    name: "configure-response-headers",
    configureServer: (server) => {
      server.middlewares.use((_req, res, next) => {
        res.setHeader("Cross-Origin-Embedder-Policy", "require-corp")
        res.setHeader("Cross-Origin-Opener-Policy", "same-origin")
        next()
      }
      )
    },
  },
  ],
  server: {
    proxy: {
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
    fs: {
      allow: [".."],
    },
  },
});
