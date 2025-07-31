import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ command, mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  
  // Determine backend URL - auto-detect IP if not specified
  const getBackendURL = () => {
    if (env.VITE_API_BASE_URL) {
      return env.VITE_API_BASE_URL.replace('/api/v1', '')
    }
    
    // Auto-detect server IP from environment - VM private IP preferred
    const serverIP = env.SERVER_IP || env.VM_PRIVATE_IP || env.VM_PUBLIC_IP || 'localhost'
    const backendPort = env.BACKEND_PORT || '3001'
    return `http://${serverIP}:${backendPort}`
  }

  return {
    plugins: [react()],
    server: {
      port: parseInt(env.FRONTEND_PORT) || 5174,
      host: '0.0.0.0', // Allow external access
      strictPort: true,
      // Serve static homepage at root
      middlewareMode: false,
      proxy: {
        '/api': {
          target: getBackendURL(),
          changeOrigin: true,
          secure: false
        },
      }
    },
    // Configura la homepage statica
    publicDir: 'public',
    build: {
      outDir: 'dist',
      sourcemap: true,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            mui: ['@mui/material', '@mui/icons-material'],
            charts: ['chart.js', 'react-chartjs-2', 'd3']
          }
        }
      }
    },
    define: {
      __APP_VERSION__: JSON.stringify(process.env.npm_package_version)
    }
  }
})