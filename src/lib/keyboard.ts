/**
 * Keyboard shortcuts and navigation
 */
import { getSearchInput } from './dom.js'

/**
 * Focus and select all text in the search input
 */
function focusSearchInput(): void {
  const searchInput = getSearchInput()
  if (!searchInput) return

  if (searchInput.value.length > 0) {
    searchInput.selectionStart = 0
    searchInput.selectionEnd = searchInput.value.length
  }
  searchInput.focus()
}

/**
 * Handle keyboard shortcuts
 */
function handleKeydown(event: KeyboardEvent): void {
  const searchInput = getSearchInput()
  if (!searchInput) return

  // Don't interfere if search input is already focused
  if (document.activeElement === searchInput) return

  // Don't interfere with special keys or modifier keys
  if (event.ctrlKey || event.metaKey || event.altKey) return

  // Check if the pressed key is a single alphabetical letter
  if (event.key.length === 1 && /^[a-zA-Z]$/.test(event.key)) {
    // Focus the search input and let the letter be typed naturally
    // Don't prevent default - we want the letter to appear in the input
    searchInput.focus()
  }
}

/**
 * Initialize keyboard shortcuts
 */
export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', handleKeydown)
}
