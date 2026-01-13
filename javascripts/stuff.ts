/* global $, localStorage */
declare const twemoji: any

const searchField = document.querySelector('.input-search') as HTMLInputElement | null
const container = document.querySelector('.emojis-container') as HTMLElement | null
const url = '//unpkg.com/emojilib@^4.0.0'

document.addEventListener('click', function (evt: MouseEvent) {
  const emoji = (evt.target as HTMLElement)?.closest('.js-emoji')
  if (emoji) {
    getSelection()?.removeAllRanges()
    const range = document.createRange()
    const node = emoji.querySelector('.js-emoji-char') as HTMLElement
    range.selectNodeContents(node)
    getSelection()?.addRange(range)
    document.execCommand('copy')
    alertCopied(node.getAttribute('data-emoji') || '')
  } else if ((evt.target as HTMLElement)?.classList.contains('js-twemoji')) {
    prepareTwemoji()
    ;(evt.target as HTMLElement).hidden = true
    const removeBtn = document.querySelector('.js-remove-twemoji') as HTMLElement | null
    if (removeBtn) removeBtn.hidden = false
    localStorage.setItem('twemoji-display', 'true')
  } else if ((evt.target as HTMLElement)?.classList.contains('js-remove-twemoji')) {
    localStorage.setItem('twemoji-display', 'false')
    window.location.reload()
  }
})

function prepareTwemoji () {
  const twemojiScript = document.createElement('script')
  twemojiScript.src = '//twemoji.maxcdn.com/2/twemoji.min.js?2.2.3'
  twemojiScript.onload = function () {
    twemoji.parse(document.body)
    document.body.classList.add('twemojified')
  }
  document.head.append(twemojiScript)
}

function alertCopied (emoji: string) {
  const alert = document.createElement('div')
  alert.classList.add('alert')
  alert.textContent = `Copied ${emoji}`
  document.body.append(alert)
  setTimeout(function() {
    alert.remove()
  }, 1000)
}

document.addEventListener('keydown', (event: KeyboardEvent) => {
  if (event.key === '/' && searchField) {
    if (searchField.value.length) {
      searchField.selectionStart = 0
      searchField.selectionEnd = searchField.value.length
    }
    searchField.focus()
    event.preventDefault()
  }
})

const showingTwemoji = localStorage.getItem('twemoji-display') === 'true'
const removeTwemojiBtn = document.querySelector('.js-remove-twemoji') as HTMLElement | null
const twemojiBtn = document.querySelector('.js-twemoji') as HTMLElement | null
if (removeTwemojiBtn) removeTwemojiBtn.hidden = !showingTwemoji
if (twemojiBtn) twemojiBtn.hidden = showingTwemoji

fetch(url).then(data => data.json()).then((json: Record<string, string>) => {
  let html = ''
  if (showingTwemoji) prepareTwemoji()
  for (const emoji in json) {
    html += `<li class="result emoji-wrapper js-emoji" title="${json[emoji]}">
      <div class="js-emoji-char native-emoji" data-emoji="${emoji}" >${emoji}</div></li>`
  }
  if (container) container.innerHTML = html
  const loading = document.querySelector('.loading')
  if (loading) loading.remove()
  document.dispatchEvent(new CustomEvent('emoji:ready'))
})
