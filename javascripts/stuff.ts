import { emojiData } from './emoji-data.js'

const searchField = document.querySelector('.input-search') as HTMLInputElement | null
const container = document.querySelector('.emojis-container') as HTMLElement | null

document.addEventListener('click', async function (evt: MouseEvent) {
  const emoji = (evt.target as HTMLElement)?.closest('.js-emoji')
  if (emoji) {
    const node = emoji.querySelector('.js-emoji-char') as HTMLElement
    const emojiChar = node.getAttribute('data-emoji') || node.textContent || ''
    
    try {
      await navigator.clipboard.writeText(emojiChar)
      alertCopied(emojiChar)
    } catch (err) {
      console.error('Failed to copy emoji:', err)
    }
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

// Use pre-fetched emoji data instead of runtime fetch
let html = ''
for (const emoji in emojiData) {
  html += `<li class="result emoji-wrapper js-emoji" title="${emojiData[emoji]}">
    <div class="js-emoji-char native-emoji" data-emoji="${emoji}" >${emoji}</div></li>`
}
if (container) container.innerHTML = html
const loading = document.querySelector('.loading')
if (loading) loading.remove()
document.dispatchEvent(new CustomEvent('emoji:ready'))

