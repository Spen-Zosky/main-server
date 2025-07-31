import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine environment type (production or test)
  const environmentType = env.ENVIRONMENT_TYPE || 'production'
  const isTestEnv = environmentType === 'test'
  
  // Environment-specific configuration
  const envConfig = {
    production: {
      port: parseInt(env.FRONTEND_PORT) || 5173,
      backendPort: parseInt(env.PORT) || 3000,
      storybookPort: parseInt(env.STORYBOOK_PORT) || 6006
    },
    test: {
      port: parseInt(env.TEST_FRONTEND_PORT) || 5174,
      backendPort: parseInt(env.TEST_PORT) || 3001,
      storybookPort: parseInt(env.TEST_STORYBOOK_PORT) || 6007
    }
  }
  
  const currentConfig = envConfig[environmentType]
  
  // Determine backend URL with environment-aware detection
  const getBackendURL = () => {
    const envBackendUrl = isTestEnv ? env.TEST_BACKEND_URL : env.VITE_API_BASE_URL
    if (envBackendUrl) {
      return envBackendUrl.replace('/api/v1', '')
    }
    
    // Auto-detect server IP from environment
    const serverIP = env.SERVER_IP || env.VM_PRIVATE_IP || env.VM_PUBLIC_IP || 'localhost'
    return `http://${serverIP}:${currentConfig.backendPort}`
  }

  // Cross-environment proxy configuration
  const getCrossEnvProxy = () => {
    const otherConfig = envConfig[isTestEnv ? 'production' : 'test']
    const serverIP = env.SERVER_IP || env.VM_PRIVATE_IP || env.VM_PUBLIC_IP || 'localhost'
    
    return {
      // Current environment API
      '/api': {
        target: getBackendURL(),
        changeOrigin: true,
        secure: false,
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('Proxy error:', err);
          });
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[${environmentType.toUpperCase()}] Proxying ${req.method} ${req.url} to ${options.target}`);
          });
        }
      },
      
      // Cross-environment API access (for debugging and comparison)
      [`/api-${isTestEnv ? 'prod' : 'test'}`]: {
        target: `http://${serverIP}:${otherConfig.backendPort}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          [`^/api-${isTestEnv ? 'prod' : 'test'}`]: '/api'
        },
        configure: (proxy, options) => {
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log(`[CROSS-ENV] Proxying ${req.method} ${req.url} to ${options.target}`);
          });
        }
      },

      // Storybook proxy for cross-environment access
      '/storybook-iframe': {
        target: `http://${env.SERVER_IP || env.VM_PRIVATE_IP || 'localhost'}:${currentConfig.storybookPort}`,
        changeOrigin: true,
        secure: false,
        pathRewrite: {
          '^/storybook-iframe': '/iframe.html'
        }
      }
    }
  }

  return {
    plugins: [react()],
    server: {
      port: currentConfig.port,
      host: '0.0.0.0', // Allow external access
      strictPort: true,
      // Enhanced middleware for dual-environment
      middlewareMode: false,
      proxy: getCrossEnvProxy(),
      // Hot reload configuration
      hmr: {
        port: currentConfig.port + 1000, // HMR on separate port to avoid conflicts
        host: '0.0.0.0'
      },
      // Watch configuration for better hot reload
      watch: {
        usePolling: true,
        interval: 1000
      }
    },
    
    // Environment-specific build configuration
    publicDir: 'public',
    build: {
      outDir: isTestEnv ? 'dist-test' : 'dist',
      sourcemap: command === 'serve' || isTestEnv, // Always sourcemap in test
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            charts: ['chart.js', 'react-chartjs-2', 'd3']
          }
        }
      },
      // Environment-specific optimizations
      minify: isTestEnv ? false : 'esbuild', // Don't minify in test for better debugging
      target: 'esnext'
    },
    
    // Environment variables injection
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
      __ENVIRONMENT_TYPE__: JSON.stringify(environmentType),
      __IS_TEST_ENV__: JSON.stringify(isTestEnv),
      __BACKEND_URL__: JSON.stringify(getBackendURL()),
      __FRONTEND_PORT__: JSON.stringify(currentConfig.port),
      __STORYBOOK_PORT__: JSON.stringify(currentConfig.storybookPort)
    },

    // Enhanced resolve for cross-environment compatibility
    resolve: {
      alias: {
        '@': '/src',
        '@components': '/src/components',
        '@pages': '/src/pages',
        '@services': '/src/services',
        '@utils': '/src/utils',
        '@config': '/src/config'
      }
    },

    // Development optimizations
    optimizeDeps: {
      include: ['react', 'react-dom', '@mui/material', '@mui/icons-material'],
      exclude: isTestEnv ? ['@vite/client'] : []
    }
  }
})