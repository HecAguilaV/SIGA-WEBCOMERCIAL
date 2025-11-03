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
});


