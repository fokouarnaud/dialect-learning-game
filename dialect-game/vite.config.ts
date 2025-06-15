import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    // Bundle analyzer (uniquement en analyse)
    ...(process.env.ANALYZE ? [visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true
    })] : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'es2015',
    minify: 'terser',
    sourcemap: false, // Désactiver en production pour réduire la taille
    rollupOptions: {
      output: {
        // Code splitting optimisé
        manualChunks: (id) => {
          // Vendor chunk pour React et dépendances principales
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('react-dom')) {
              return 'vendor';
            }
            
            // UI chunk pour Radix UI
            if (id.includes('@radix-ui')) {
              return 'ui';
            }
            
            // Utils chunk pour utilitaires CSS
            if (id.includes('clsx') || id.includes('tailwind-merge') || id.includes('class-variance-authority')) {
              return 'utils';
            }
            
            // Chunk pour Lucide icons
            if (id.includes('lucide-react')) {
              return 'icons';
            }
            
            // Autres dépendances dans vendor
            return 'vendor';
          }
          
          // Services APIs dans un chunk séparé
          if (id.includes('/src/services/api/')) {
            return 'services';
          }
          
          // Composants UI dans un chunk séparé
          if (id.includes('/src/components/ui/')) {
            return 'ui-components';
          }
        },
        
        // Nommage optimisé des chunks
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          const extType = assetInfo.name?.split('.').at(1);
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType ?? '')) {
            return `assets/images/[name]-[hash][extname]`;
          }
          if (/woff2?|eot|ttf|otf/i.test(extType ?? '')) {
            return `assets/fonts/[name]-[hash][extname]`;
          }
          return `assets/[ext]/[name]-[hash][extname]`;
        }
      }
    },
    
    // Optimisations Terser pour production
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production', // Supprimer console.log en prod
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'], // Supprimer ces fonctions
        passes: 2 // Double passe pour meilleure compression
      },
      mangle: {
        safari10: true // Compatibilité Safari
      },
      format: {
        comments: false // Supprimer tous les commentaires
      }
    },
    
    // Limites de taille pour warnings
    chunkSizeWarningLimit: 1000, // 1MB warning
    
    // Optimisations CSS
    cssCodeSplit: true,
    cssMinify: true
  },
  
  // Optimisations des dépendances
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react/jsx-runtime'
    ],
    exclude: [
      // Exclure les gros packages pour lazy loading
    ]
  },
  
  // Configuration du serveur de dev
  server: {
    host: true, // Écouter sur toutes les interfaces
    port: 5174,
    strictPort: false
  },
  
  // Preview server config
  preview: {
    port: 4173,
    host: true,
    strictPort: false
  },
  
  // Configuration CSS
  css: {
    devSourcemap: false, // Pas de sourcemap CSS en dev pour performance
    preprocessorOptions: {
      // Optimisations potentielles pour preprocesseurs
    }
  }
})
