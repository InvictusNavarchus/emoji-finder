/**
 * Main entry point - initializes all application modules
 * 
 * This file wires together all the modules, following the composition root pattern.
 * Each module is responsible for a single concern and is initialized here.
 */
import { emojiData } from './emoji-data.js'
import { initializeEmojis } from './emoji-renderer.js'
import { initEmojiClickHandler } from './emoji-click-handler.js'
import { initKeyboardShortcuts } from './keyboard.js'
import { initSearch } from './search.js'

/**
 * Bootstrap the application
 */
function init(): void {
  // Initialize emoji display
  initializeEmojis(emojiData)

  // Initialize interaction handlers
  initEmojiClickHandler()
  initKeyboardShortcuts()
  initSearch()
}

// Start the application
init()
