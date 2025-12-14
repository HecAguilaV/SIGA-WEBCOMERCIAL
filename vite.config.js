import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite para proyecto React
// Los archivos en static/ se sirven desde la raíz (/)
export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  server: {
    port: 5173,
    host: true, // Permite acceso desde la red local
    strictPort: true, // Falla si el puerto está ocupado en lugar de usar otro
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          // Separar vendor libraries grandes
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom') || id.includes('react-router')) {
              return 'react-vendor';
            }
            // Otras librerías grandes
            if (id.includes('@google/generative-ai') || id.includes('recharts') || id.includes('swagger-ui')) {
              return 'vendor-large';
            }
            return 'vendor';
          }
          // Separar servicios de API
          if (id.includes('/services/api.js') || id.includes('/services/auth.js')) {
            return 'api-services';
          }
          // Separar PerfilPage que es muy grande
          if (id.includes('/pages/PerfilPage.jsx')) {
            return 'perfil-page';
          }
        },
      },
    },
    chunkSizeWarningLimit: 1000, // Aumentar límite temporalmente mientras optimizamos
  },
  // Exponer variables de entorno con prefijo VITE_
  // Las variables se pueden acceder con import.meta.env.VITE_GEMINI_API_KEY
});

