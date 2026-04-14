import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Allow overriding backend target with env var PSUN_BACKEND
// Por defecto apuntar al servidor remoto de producción para evitar tener que setear la variable cada vez.
const TARGET = process.env.PSUN_BACKEND || 'http://5.161.61.80:30004';

export default defineConfig({
  plugins: [sveltekit()],
  server: {
    proxy: {
      '/backend': {
        target: TARGET,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend/, ''),
        configure: (proxy) => {
          proxy.on('error', (err) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (proxyReq, req) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        }
      }
    }
  }
});