import react from "@vitejs/plugin-react";
import path from "path";
import { defineConfig } from "vite";
import { createBlockletPlugin } from 'vite-plugin-blocklet';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), createBlockletPlugin(), svgr()],
  server: {
    host: true,
    port: +process.env.PORT || 5173,
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    minify: false,
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
    // 禁止 preload 可以解决 js 的请求没有 referer 的问题
    cssCodeSplit: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    },
  },
});
