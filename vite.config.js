import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Configuración de Vite para proyecto React
// Los archivos en static/ se sirven desde la raíz (/)
export default defineConfig({
  plugins: [react()],
  publicDir: 'static',
  server: {
    port: 1573,
    host: true, // Permite acceso desde la red local
    strictPort: true, // Falla si el puerto está ocupado en lugar de usar otro
    proxy: {
      '/api': {
        target: 'https://siga-backend-production.up.railway.app',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('proxyReq', (proxyReq, req, _res) => {
            proxyReq.removeHeader('Origin');
          });
        }
      },
    },
  },
  // Exponer variables de entorno con prefijo VITE_
  // Las variables se pueden acceder con import.meta.env.VITE_GEMINI_API_KEY
});

