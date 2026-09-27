import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve , dirname } from "path";
import { fileURLToPath } from "url";



export default defineConfig({
  server: {
    host: true,
    port: 5173,
    allowedHosts: true,
  },
  plugins: [react(), tailwindcss()],
  build: {
    target: 'esnext',
    minify: 'esbuild',
    cssMinify: true,
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react') || id.includes('node_modules/react-dom')) {
            return 'vendor-react';
          }
          if (id.includes('node_modules/gsap') || id.includes('node_modules/@gsap')) {
            return 'vendor-gsap';
          }
          if (id.includes('node_modules/lucide-react')) {
            return 'vendor-icons';
          }
        },
      },
    },
  },

  resolve: {
    alias: {
      '#components': resolve(dirname(fileURLToPath(import.meta.url)), 'src/components'),
      '#constants': resolve(dirname(fileURLToPath(import.meta.url)), 'src/constants'),
      '#store': resolve(dirname(fileURLToPath(import.meta.url)), 'src/store'),
      '#hoc': resolve(dirname(fileURLToPath(import.meta.url)), 'src/hoc'),
      '#windows': resolve(dirname(fileURLToPath(import.meta.url)), 'src/windows'),
    },
  },
})


