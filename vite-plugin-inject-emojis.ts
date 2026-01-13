/**
 * Vite plugin: Injects pre-rendered emoji HTML at build time
 * 
 * This plugin reads the pre-generated emoji HTML and injects it into index.html
 * during the build process, eliminating the need for runtime rendering.
 */

import { readFile } from 'node:fs/promises'
import { resolve } from 'node:path'
import type { Plugin } from 'vite'

const EMOJI_HTML_PATH = resolve(import.meta.dirname, 'src/data/emoji-html.html')
const INJECTION_MARKER = '<ul class="emojis-container">'

export function injectEmojisPlugin(): Plugin {
  return {
    name: 'inject-emojis',
    
    async transformIndexHtml(html: string) {
      try {
        const emojiHTML = await readFile(EMOJI_HTML_PATH, 'utf-8')
        
        // Inject the pre-rendered HTML into the emoji container
        return html.replace(
          INJECTION_MARKER,
          `${INJECTION_MARKER}\n      ${emojiHTML}`
        )
      } catch (error) {
        // During development, the HTML file might not exist yet
        console.warn('⚠ Pre-rendered emoji HTML not found. Run `bun run prebuild` first.')
        return html
      }
    }
  }
}
