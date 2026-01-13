/**
 * Type definitions for the emoji finder application
 */

/** Emoji data structure: emoji character -> keywords string */
export type EmojiData = Record<string, string>

/** DOM element selectors used throughout the app */
export const Selectors = {
  searchInput: '.speedy-filter',
  emojiContainer: '.emojis-container',
  loading: '.loading',
  noResults: '.no-results',
  keyword: '.keyword',
  result: '.result',
  emoji: '.js-emoji',
  emojiChar: '.js-emoji-char',
  clearSearch: '.js-clear-search',
  group: '.group',
  activeLinks: '.active[href^="#"]',
} as const

/** Custom events dispatched by the application */
export const Events = {
  emojiReady: 'emoji:ready',
} as const
