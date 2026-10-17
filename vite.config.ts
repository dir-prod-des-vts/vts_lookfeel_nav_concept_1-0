import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

// https://vite.dev/config/
export default defineConfig({
  base: '/vts_lookfeel_nav_concept_1-0/',
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
        'button-showcase': path.resolve(__dirname, 'button-showcase.html'),
        'datepicker-showcase': path.resolve(__dirname, 'datepicker-showcase.html'),
        'components-showcase': path.resolve(__dirname, 'components-showcase.html'),
      },
    },
  },
  server: {
    port: parseInt(process.env.PORT ?? '5174'),
    proxy: {
      '/logo-proxy': {
        target: 'https://logo.clearbit.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/logo-proxy/, ''),
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
