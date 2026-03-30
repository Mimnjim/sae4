// import { defineConfig } from 'vite'
// import react from '@vitejs/plugin-react'
// import path from 'path'

// // Configuration Vite pour React
// export default defineConfig({
//   plugins: [react()],
//   assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin'], // ✅ Vite traite ces fichiers comme des assets // Ligne ajoutée
//   plugins: [react()]
//   ,
//   server: {
//     proxy: {
//       // Proxy local API calls to the MAMP server to avoid CORS in dev
//       // Any request starting with /sae4_api will be forwarded to localhost:8888
//       '/sae4_api': {
//         target: 'http://localhost:8888',
//         changeOrigin: true,
//         secure: false
//       }
//     }
//   }
// })


import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import fs from 'fs'
import { execSync } from 'child_process'
 
export default defineConfig({
  plugins: [
    react(),
    // Plugin custom pour copier le dossier game/ dans dist/ après le build
    {
      name: 'copy-game-folder',
      apply: 'build',
      enforce: 'post',
      writeBundle() {
        const sourceDir = path.resolve(__dirname, 'game')
        const destDir = path.resolve(__dirname, 'dist/game')
        
        // Créer le dossier destination s'il n'existe pas
        if (!fs.existsSync(destDir)) {
          fs.mkdirSync(destDir, { recursive: true })
        }
        
        // Copier tous les fichiers du dossier game/ vers dist/game/
        fs.cpSync(sourceDir, destDir, { recursive: true })
        console.log('✓ Dossier game/ copié dans dist/game/')
      }
    }
  ],
  assetsInclude: ['**/*.gltf', '**/*.glb', '**/*.bin'],
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom'),
    },
  },
  server: {
    proxy: {
      '/sae4_api': {
        target: 'http://localhost:8888',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
 
