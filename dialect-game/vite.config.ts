/// <reference types="vitest" />
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { visualizer } from 'rollup-plugin-visualizer'

export default defineConfig(({ command, mode }) => {
  // Charger les variables d'environnement
  const env = loadEnv(mode, process.cwd(), '')
  const isAnalyze = env.ANALYZE === 'true'
  const isEnhanced = mode === 'enhanced'

  console.log(`🚀 Vite Config - Mode: ${mode}${isEnhanced ? ' (Enhanced UI)' : ''}`);

  return {
    plugins: [
      react(),
      // Analyzer de bundle conditionnel
      ...(isAnalyze ? [
        visualizer({
          filename: 'dist/bundle-analysis.html',
          open: true,
          gzipSize: true,
          brotliSize: true,
        })
      ] : []),
    ],

    // Point d'entrée conditionnel
    build: {
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          ...(isEnhanced && {
            enhanced: path.resolve(__dirname, 'enhanced.html')
          })
        },
        output: {
          // Code splitting optimisé
          manualChunks: {
            // Vendor libs
            vendor: ['react', 'react-dom'],
            
            // UI Components
            ui: [
              '@radix-ui/react-slot',
              '@radix-ui/react-progress', 
              '@radix-ui/react-tabs',
              'class-variance-authority',
              'tailwind-merge'
            ],
            
            // Icons séparés
            icons: ['lucide-react'],
            
            // Utils
            utils: ['clsx'],
            
            // Enhanced components (mode enhanced uniquement)
            ...(isEnhanced && {
              enhanced: [
                './src/components/ui/enhanced-button',
                './src/components/ui/enhanced-card',
                './src/components/ui/toast',
                './src/components/ui/onboarding'
              ]
            })
          },
          
          // Nommage optimisé
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId ? 
              chunkInfo.facadeModuleId.split('/').pop()?.replace('.tsx', '').replace('.ts', '') : 
              'chunk';
            return `assets/js/[name]-${facadeModuleId}-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name?.split('.') || [];
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext || '')) {
              return `assets/images/[name]-[hash][extname]`;
            }
            if (/css/i.test(ext || '')) {
              return `assets/css/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
        },
      },
      
      // Optimisations de bundle
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: command === 'build' && !isEnhanced, // Garder les logs en mode enhanced
          drop_debugger: true,
          pure_funcs: ['console.debug', 'console.trace'],
        },
        mangle: {
          safari10: true,
        },
      },
      
      // Target moderne pour de meilleures optimisations
      target: 'esnext',
      
      // Source maps conditionnelles
      sourcemap: command === 'serve' || isEnhanced,
    },

    // Configuration du serveur de développement
    server: {
      port: 5174,
      host: true,
      open: isEnhanced ? '/enhanced.html' : true,
      hmr: {
        overlay: true,
      },
    },

    // Preview configuration
    preview: {
      port: 4173,
      host: true,
      open: isEnhanced ? '/enhanced.html' : true,
    },

    // Path aliases
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
        "@/components": path.resolve(__dirname, "./src/components"),
        "@/ui": path.resolve(__dirname, "./src/components/ui"),
        "@/lib": path.resolve(__dirname, "./src/lib"),
        "@/utils": path.resolve(__dirname, "./src/utils"),
        "@/services": path.resolve(__dirname, "./src/services"),
        "@/hooks": path.resolve(__dirname, "./src/hooks"),
      },
    },

    // Optimisations CSS
    css: {
      devSourcemap: true,
      postcss: {
        plugins: [
          // PostCSS plugins seront chargés depuis postcss.config.js
        ],
      },
    },

    // Optimisations des dépendances
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'lucide-react',
        '@radix-ui/react-slot',
        '@radix-ui/react-progress',
        '@radix-ui/react-tabs',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
      ],
      exclude: [
        // Exclure les packages problématiques du pre-bundling
      ],
    },

    // Variables d'environnement
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __BUILD_TIME__: JSON.stringify(new Date().toISOString()),
      __ENHANCED_MODE__: JSON.stringify(isEnhanced),
    },

    // Configuration spécifique à l'environnement
    ...(isEnhanced && {
      // Optimisations spéciales pour le mode enhanced
      esbuild: {
        logOverride: { 'this-is-undefined-in-esm': 'silent' }
      }
    })
  }
})
