// Configuración de Vite para el proyecto DataTrain Corp
import { defineConfig } from 'vite';

export default defineConfig({
  // Redirigir peticiones /api al servidor backend en el puerto 3000
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
});
