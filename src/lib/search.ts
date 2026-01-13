/**
 * Search functionality for filtering emojis
 */
import { Selectors, Events } from './types.js'
import { getSearchInput, getElement, getElements } from './dom.js'

/** Current search keyword - used to avoid redundant filtering */
let currentKeyword = ''

/**
 * Get the search keyword from the URL hash
 */
function getKeywordFromHash(): string {
  const hash = window.location.hash
  return hash.length > 1 ? hash.slice(1).replace(/_/g, ' ') : ''
}

/**
 * Update the URL hash based on the search input value
 */
function updateHashFromInput(): void {
  const searchInput = getSearchInput()
  if (searchInput) {
    window.location.hash = searchInput.value.replace(/ /g, '_')
  }
}

/**
 * Update the keyword display element
 */
function updateKeywordDisplay(keyword: string): void {
  const keywordElement = getElement(Selectors.keyword)
  if (keywordElement) {
    keywordElement.textContent = keyword
  }
}

/**
 * Filter emoji results based on keyword
 */
function filterResults(keyword: string): void {
  const normalizedKeyword = keyword.toLowerCase()
  const results = getElements<HTMLElement>(Selectors.result)

  for (const result of results) {
    const title = result.getAttribute('title')?.toLowerCase() ?? ''
    result.hidden = keyword.length > 0 && !title.includes(normalizedKeyword)
  }
}

/**
 * Update visibility of "no results" message
 */
function updateNoResultsVisibility(): void {
  const hasVisibleResults = !!document.querySelector(`${Selectors.result}:not([hidden])`)
  const noResultsElement = getElement<HTMLElement>(Selectors.noResults)
  
  if (noResultsElement) {
    noResultsElement.hidden = hasVisibleResults
  }
}

/**
 * Update active state of navigation links
 */
function updateActiveLinks(): void {
  const activeLinks = getElements<HTMLElement>(Selectors.activeLinks)
  for (const link of activeLinks) {
    link.classList.remove('active')
  }

  const currentActiveLink = document.querySelector(`[href='${window.location.hash}']`)
  currentActiveLink?.classList.add('active')
}

/**
 * Perform search with the given keyword
 */
export function search(keyword = ''): void {
  const normalizedKeyword = keyword.trim()

  updateKeywordDisplay(normalizedKeyword)

  // Skip if keyword hasn't changed
  if (currentKeyword === normalizedKeyword) return

  currentKeyword = normalizedKeyword
  filterResults(normalizedKeyword)
  updateNoResultsVisibility()
}

/**
 * Search based on current URL hash
 */
export function searchFromHash(): void {
  const keyword = getKeywordFromHash()
  const searchInput = getSearchInput()

  if (searchInput) {
    searchInput.value = keyword
  }

  search(keyword)
  updateActiveLinks()
}

/**
 * Handle click events for search-related actions
 */
function handleSearchClick(event: MouseEvent): void {
  const target = event.target as HTMLElement
  if (!target) return

  const searchInput = getSearchInput()
  if (!searchInput) return

  if (target.classList.contains(Selectors.group.slice(1))) {
    // Clicked a group link
    const href = (target as HTMLAnchorElement).href
    const hashPart = href.substring(href.indexOf('#') + 1)
    searchInput.value = hashPart
    search(hashPart)
  } else if (target.classList.contains(Selectors.clearSearch.slice(1))) {
    // Clicked clear search button
    searchInput.value = ''
  }
}

/**
 * Initialize search functionality
 */
export function initSearch(): void {
  const searchInput = getSearchInput()

  // Listen for input changes
  searchInput?.addEventListener('input', updateHashFromInput)

  // Listen for hash changes
  window.addEventListener('hashchange', searchFromHash)

  // Listen for click events
  document.addEventListener('click', handleSearchClick)

  // Initialize search when emojis are ready
  document.addEventListener(Events.emojiReady, searchFromHash)
}
