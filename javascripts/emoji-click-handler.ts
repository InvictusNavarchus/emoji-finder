/**
 * Emoji click handling - copy emoji to clipboard on click
 */
import { Selectors } from './types.js'
import { copyToClipboard } from './clipboard.js'
import { showCopiedNotification } from './notifications.js'

/**
 * Extract emoji character from a click event target
 */
function getEmojiFromEvent(event: MouseEvent): string | null {
  const emojiElement = (event.target as HTMLElement)?.closest(Selectors.emoji)
  if (!emojiElement) return null

  const charElement = emojiElement.querySelector(Selectors.emojiChar) as HTMLElement | null
  if (!charElement) return null

  return charElement.getAttribute('data-emoji') ?? charElement.textContent ?? null
}

/**
 * Handle click on an emoji - copy to clipboard and show notification
 */
async function handleEmojiClick(event: MouseEvent): Promise<void> {
  const emoji = getEmojiFromEvent(event)
  if (!emoji) return

  const success = await copyToClipboard(emoji)
  if (success) {
    showCopiedNotification(emoji)
  }
}

/**
 * Initialize emoji click handling
 */
export function initEmojiClickHandler(): void {
  document.addEventListener('click', handleEmojiClick)
}
