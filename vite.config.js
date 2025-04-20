import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from "vite-plugin-svgr"

// https://vite.dev/config/
export default defineConfig({
  base: '/admin/',
  plugins: [react(), svgr()],
  server: {
    host: '0.0.0.0',
    port: 4200,
    historyApiFallback: true,
    proxy: {
      '/api': {
        target: 'https://www.gwork.press:8443',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        secure: false,
        headers: {
          'Access-Control-Allow-Origin': '*',
        },
      },
    }
  }
})
