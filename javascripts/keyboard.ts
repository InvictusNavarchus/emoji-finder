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
  // "/" key focuses the search input
  if (event.key === '/') {
    event.preventDefault()
    focusSearchInput()
  }
}

/**
 * Initialize keyboard shortcuts
 */
export function initKeyboardShortcuts(): void {
  document.addEventListener('keydown', handleKeydown)
}
