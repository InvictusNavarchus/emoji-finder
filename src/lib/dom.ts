/**
 * DOM utilities - single responsibility for DOM access with type safety
 */
import { Selectors } from './types.js'

/** Cached DOM elements for performance */
const elementCache = new Map<string, Element | null>()

/**
 * Query a single element with caching
 */
export function getElement<T extends Element>(selector: string): T | null {
  if (!elementCache.has(selector)) {
    elementCache.set(selector, document.querySelector<T>(selector))
  }
  return elementCache.get(selector) as T | null
}

/**
 * Query multiple elements (no caching as results may change)
 */
export function getElements<T extends Element>(selector: string): NodeListOf<T> {
  return document.querySelectorAll<T>(selector)
}

/**
 * Get the search input element
 */
export function getSearchInput(): HTMLInputElement | null {
  return getElement<HTMLInputElement>(Selectors.searchInput)
}

/**
 * Get the emoji container element
 */
export function getEmojiContainer(): HTMLElement | null {
  return getElement<HTMLElement>(Selectors.emojiContainer)
}

/**
 * Remove an element from the DOM
 */
export function removeElement(selector: string): void {
  getElement(selector)?.remove()
}

/**
 * Set the inner HTML of a container
 */
export function setContainerHTML(container: HTMLElement, html: string): void {
  container.innerHTML = html
}

/**
 * Dispatch a custom event on the document
 */
export function dispatchCustomEvent(eventName: string): void {
  document.dispatchEvent(new CustomEvent(eventName))
}

/**
 * Clear the element cache (useful for testing or dynamic content)
 */
export function clearElementCache(): void {
  elementCache.clear()
}
