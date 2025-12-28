import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src')
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        // automatically load variables, colors, and mixins in all components
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/colors" as *;
          @use "@/styles/mixins" as *;
        `
      }
    }
  },
  server: {
    port: 8080
  }
})
