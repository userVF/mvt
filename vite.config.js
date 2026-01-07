import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command, mode }) => {

  const env  = loadEnv(mode, process.cwd(), '')

  const config = {    
    base: env.VITE_STATIC_ORIGIN,
    plugins: [
      vue(),
    ],
    build: {
      chunkSizeWarningLimit: 2000,
      cssCodeSplit: false,
      emptyOutDir: true,
    },
  }

  config['build']['rollupOptions'] = {
    input: {
      index: './html/index.html',
    },
    output: {
      manualChunks: () => '',
    }
  }

  return config
  
})

