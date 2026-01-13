/**
 * Emoji rendering and initialization
 */
import type { EmojiData } from './types.js'
import { Selectors, Events } from './types.js'
import { getEmojiContainer, removeElement, setContainerHTML, dispatchCustomEvent } from './dom.js'

/**
 * Create a single emoji DOM element
 */
function createEmojiElement(emoji: string, keywords: string): HTMLLIElement {
  const li = document.createElement('li')
  li.className = 'result emoji-wrapper js-emoji'
  li.title = keywords
  
  const div = document.createElement('div')
  div.className = 'js-emoji-char native-emoji'
  div.dataset.emoji = emoji
  div.textContent = emoji
  
  li.appendChild(div)
  return li
}

/**
 * Render emojis in batches to prevent UI blocking
 * Uses requestAnimationFrame for smooth, non-blocking rendering
 */
export function renderEmojis(emojiData: EmojiData): void {
  const container = getEmojiContainer()
  if (!container) return

  const entries = Object.entries(emojiData)
  const BATCH_SIZE = 100 // Render 100 emojis per frame for optimal performance
  let currentIndex = 0

  // Clear container once at the start
  container.innerHTML = ''

  // Capture container in closure to satisfy TypeScript
  const containerElement = container

  function renderBatch(): void {
    const fragment = document.createDocumentFragment()
    const end = Math.min(currentIndex + BATCH_SIZE, entries.length)
    
    // Create elements for this batch
    for (let i = currentIndex; i < end; i++) {
      const [emoji, keywords] = entries[i]!
      fragment.appendChild(createEmojiElement(emoji, keywords))
    }
    
    // Single DOM append per batch (causes only one reflow)
    containerElement.appendChild(fragment)
    currentIndex = end

    // Continue rendering if there are more emojis
    if (currentIndex < entries.length) {
      requestAnimationFrame(renderBatch)
    } else {
      // All emojis rendered
      dispatchCustomEvent(Events.emojiReady)
    }
  }

  // Start the rendering process
  requestAnimationFrame(renderBatch)
}

/**
 * Initialize the emoji display
 */
export function initializeEmojis(emojiData: EmojiData): void {
  renderEmojis(emojiData)
  removeElement(Selectors.loading)
}
