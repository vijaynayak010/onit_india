import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

const DEFAULT_LAMBDA =
  'https://wcnwjjyw3er242onl66k4ljnei0xqykl.lambda-url.ap-south-1.on.aws'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    host: true,
    port: 5173,
    strictPort: true,
    proxy: {
      '/api-onitindia': {
        target: DEFAULT_LAMBDA,
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/api-onitindia/, ''),
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
      '/auth0': {
        target: 'https://dev-jdesmpayywayutew.us.auth0.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/auth0/, '')
      },
    },
  },
})
