import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '127.0.0.1',//本机的ip地址
    proxy: {
        '/api': {
            target: 'http://127.0.0.1:7001',//后端服务器
            changeOrigin: true,
            rewrite: (path) => path.replace(/^\/api/, ''),
          },
    }
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        // nested: resolve(__dirname, 'nested/index.html'),
      },
    },
  },
})