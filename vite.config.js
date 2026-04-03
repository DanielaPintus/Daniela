import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true,
    allowedHosts: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    chunkSizeWarningLimit: 1200,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('/src/data/recipes.js') || id.includes('/src/data/ingredients.js') || id.includes('/src/data/mealVisuals.js')) {
            return 'nutrition-library';
          }
          if (id.includes('/src/data/exercises.js') || id.includes('/src/data/exerciseMedia.js') || id.includes('/src/data/exerciseVisuals.js')) {
            return 'training-library';
          }
          if (id.includes('/src/image-generation/')) return 'image-engine';
          if (id.includes('/node_modules/react')) return 'react-vendor';
        }
      }
    }
  }
});
