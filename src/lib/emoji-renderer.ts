/**
 * Emoji rendering and initialization
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
 * Render all emojis to the container
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
 */
export function initializeEmojis(emojiData: EmojiData): void {
  renderEmojis(emojiData)
  removeElement(Selectors.loading)
  dispatchCustomEvent(Events.emojiReady)
}
