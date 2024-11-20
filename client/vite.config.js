import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig(({ command }) => ({
  plugins: [react()],
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-router-dom', 'react-dom', 'axios'],
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000,
    cors: true,
    proxy: {
      '/api': {
        target: command === 'serve' 
          ? 'http://localhost:5000' 
          : 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  // Add base URL configuration for production
  base: '/',
  // Optimize deps
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', 'axios'],
  },
  // Add preview configuration
  preview: {
    port: 3000,
    cors: true,
  }
}))