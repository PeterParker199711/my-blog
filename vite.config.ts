import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  base: '/my-blog/', // 🚀 确保这行跟你仓库名一致
  plugins: [vue()],
  build: {
    rollupOptions: {
      output: {
        // 🚀 自动拆包，把大型库分开，避免 index.js 过大
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return id.toString().split('node_modules/')[1].split('/')[0].toString();
          }
        }
      }
    },
    chunkSizeWarningLimit: 1500 // 提高警告阈值
  }
})