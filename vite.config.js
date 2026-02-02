import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/mockapi': {
        target: 'https://6935e745fa8e704dafbf386c.mockapi.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/mockapi/, ''),
      },
      '/settingsapi': {
        target: 'https://670ed5b73e7151861655eaa3.mockapi.io',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/settingsapi/, ''),
      },
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './src/tests/setupTests.js',
    css: true,
  },
})
