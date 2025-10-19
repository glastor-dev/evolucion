import path from "path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true,
    modules: {
      localsConvention: 'camelCase',
      scopeBehaviour: 'local'
    }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
    dedupe: ['react', 'react-dom', 'react-router-dom'],
    preserveSymlinks: true
  },
  server: {
    port: 5174,
    strictPort: true,
    host: true,
    fs: {
      strict: false,
      allow: ['..', '.']
    },
    watch: {
      usePolling: true
    }
  },
  
  build: {
    sourcemap: true,
    target: 'es2020',
    cssMinify: true
  },
  
  optimizeDeps: {
    include: [
      'react', 
      'react-dom', 
      'react-router-dom',
      'lucide-react',
      'framer-motion',
      'clsx',
      'tailwind-merge',
      '@radix-ui/react-dialog',
      '@radix-ui/react-slot',
      'sonner',
      'i18next',
      'react-i18next',
      'react-helmet-async',
      'zustand',
      'zustand/middleware'
    ],
    force: true
  }
});
