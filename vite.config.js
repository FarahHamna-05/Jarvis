import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@', replacement: path.resolve(__dirname, 'src') },
      { find: '@designcodeio/threeui/style.css', replacement: path.resolve(__dirname, 'src/shaders/threeui.css') },
      { find: '@designcodeio/threeui', replacement: path.resolve(__dirname, 'src/shaders/index.ts') },
    ],
  },
})
