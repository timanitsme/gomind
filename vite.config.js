import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: 'localhost',
    port: 4200,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'http://158.160.138.117:8080',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': 'http://localhost:4200',
        },
      },
    }
  }
})
