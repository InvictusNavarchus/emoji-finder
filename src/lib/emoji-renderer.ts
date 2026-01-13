/**
 * Emoji rendering and initialization
 * 
 * In production builds, emojis are pre-rendered at compile-time.
 * This module handles the fallback for development mode.
 */
import type { EmojiData } from './types.js'
import { Selectors, Events } from './types.js'
import { getEmojiContainer, removeElement, setContainerHTML, dispatchCustomEvent } from './dom.js'

/**
 * Generate HTML for a single emoji item
 */
function createEmojiHTML(emoji: string, keywords: string): string {
  return `<li class="result emoji-wrapper js-emoji" title="${keywords}">
    <div class="js-emoji-char native-emoji" data-emoji="${emoji}">${emoji}</div>
  </li>`
}

/**
 * Render all emojis to the container (fallback for dev mode)
 */
export function renderEmojis(emojiData: EmojiData): void {
  const container = getEmojiContainer()
  if (!container) return

  const html = Object.entries(emojiData)
    .map(([emoji, keywords]) => createEmojiHTML(emoji, keywords))
    .join('')

  setContainerHTML(container, html)
}

/**
 * Initialize the emoji display
 * Skips rendering if emojis are already pre-rendered at build time
 */
export function initializeEmojis(emojiData: EmojiData): void {
  const container = getEmojiContainer()
  
  // Check if emojis are already pre-rendered (compile-time injection)
  const isPreRendered = container?.children.length ?? 0 > 0
  
  if (!isPreRendered) {
    // Fallback: render at runtime (development mode)
    renderEmojis(emojiData)
  }
  
  removeElement(Selectors.loading)
  dispatchCustomEvent(Events.emojiReady)
}

