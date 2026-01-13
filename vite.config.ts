import { defineConfig } from 'vite'
import { injectEmojisPlugin } from './vite-plugin-inject-emojis'

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  build: {
    outDir: '../dist',
    emptyOutDir: true,
  },
  plugins: [injectEmojisPlugin()],
})

