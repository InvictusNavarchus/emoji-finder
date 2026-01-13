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
  }
})



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

fetch(url).then(data => data.json()).then((json: Record<string, string>) => {
  let html = ''
  for (const emoji in json) {
    html += `<li class="result emoji-wrapper js-emoji" title="${json[emoji]}">
      <div class="js-emoji-char native-emoji" data-emoji="${emoji}" >${emoji}</div></li>`
  }
  if (container) container.innerHTML = html
  const loading = document.querySelector('.loading')
  if (loading) loading.remove()
  document.dispatchEvent(new CustomEvent('emoji:ready'))
})
