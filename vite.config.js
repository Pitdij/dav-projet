import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: 'index.html',
        mobile: 'mobile.html'
      }
    }
  },
  server: {
    port: 3000,
    open: '/mobile.html',
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true
      },
      '/socket.io': {
        target: 'ws://localhost:8080',
        ws: true
      }
    }
  }
});
