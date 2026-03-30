import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  // base: '/my-blog/',
  base: '/', // 生产环境使用根路径，开发环境自动适配
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500 // 提高警告阈值
  },
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 你的真实后端地址
        changeOrigin: true, // 开启代理，允许跨域
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})