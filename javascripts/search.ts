const filter = document.querySelector('.speedy-filter') as HTMLInputElement

function searchHash() {
  if (window.location.hash.length) {
    filter.value = window.location.hash.substr(1)
    search(filter.value)
  } else {
    search()
  }
}
document.addEventListener('emoji:ready', searchHash)

function search (keyword?: string) {
  keyword = typeof keyword === 'undefined' ? '' : keyword
  const keywordEl = document.querySelector('.keyword')
  if (keywordEl) keywordEl.textContent = keyword
  keyword = keyword.trim()

  if ((window as any).speedyKeyword !== keyword) {
    (window as any).speedyKeyword = keyword
    for (const result of document.querySelectorAll('.result') as NodeListOf<HTMLElement>) {
      result.hidden = keyword.length > 0 ? (result.getAttribute('title')?.toLowerCase().indexOf(keyword.toLowerCase()) ?? -1) < 0 : false
    }
  }
  setRelatedDOMVisibility(keyword)
}

function setRelatedDOMVisibility (keyword: string) {
  const foundSomething = !!document.querySelector('.result:not([hidden])')
  const noResults = document.querySelector('.no-results') as HTMLElement | null
  if (noResults) noResults.hidden = foundSomething
}

function updateHashWithInputValue() {
  window.location.hash = filter.value.replace(' ', '_')
}

filter.addEventListener('input', updateHashWithInputValue)

document.addEventListener('click', (event: MouseEvent) => {
  const target = event.target as HTMLElement
  if (target?.classList.contains('group')) {
    filter.value = (target as HTMLAnchorElement).href.substr(1)
    search(filter.value)
  } else if (target?.classList.contains('js-clear-search')) {
    filter.value = ''
  }
})

window.onhashchange = function () {
  searchHash()
  for (const link of document.querySelectorAll('.active[href^="#"]') as NodeListOf<HTMLElement>) {
    link.classList.remove('active')
  }
  const active = document.querySelector(`[href='#${window.location.hash}']`)
  if (active) active.classList.add('active')
}
