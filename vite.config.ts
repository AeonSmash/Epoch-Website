import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [],
  server: {
    host: '0.0.0.0', // Listen on all interfaces
    port: 5173,
    strictPort: false,
    open: false, // Don't auto-open browser
    cors: true
  },
  resolve: {
    alias: {
      '@': '/src'
    }
  }
});

