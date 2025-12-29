import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import path from "path";
import { fileURLToPath } from "url";
import { imageToWebpPlugin } from 'vite-plugin-image-to-webp';

// Convert import.meta.url to __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig({
  plugins: [
    vue(),
    imageToWebpPlugin({
      imageFormats: ["jpg", "jpeg", "png"],
      webpQuality: { quality: 80 },
      destinationFolder: "dist",
    }),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "@/styles/variables" as *;
          @use "@/styles/colors" as *;
          @use "@/styles/mixins" as *;
        `,
      },
    },
  },
  server: {
    port: 8080,
  },
});
