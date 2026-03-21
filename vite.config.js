import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Configuration Vite pour React
export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin'], // ✅ Vite traite ces fichiers comme des assets // Ligne ajoutée
  plugins: [react()]
  ,
  server: {
    proxy: {
      // Proxy local API calls to the MAMP server to avoid CORS in dev
      // Any request starting with /sae4_api will be forwarded to localhost:8888
      '/sae4_api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false
      }
    }
  }
})
