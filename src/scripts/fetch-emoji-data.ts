/**
 * Build script: Fetches emoji data and generates build artifacts
 * 
 * Generates:
 * 1. emoji-data.json - For runtime search/filtering
 * 2. emoji-html.html - Pre-rendered HTML for compile-time injection
 * 
 * This eliminates runtime rendering while maintaining full interactivity.
 */

import { resolve } from 'node:path'

const EMOJI_LIB_URL = 'https://unpkg.com/emojilib@^4.0.0'
const DATA_OUTPUT_PATH = resolve(import.meta.dirname, '../data/emoji-data.json')
const HTML_OUTPUT_PATH = resolve(import.meta.dirname, '../data/emoji-html.html')

type RawEmojiData = Record<string, string[] | string>
type ProcessedEmojiData = Record<string, string>

/**
 * Fetch raw emoji data from emojilib
 */
async function fetchRawData(): Promise<RawEmojiData> {
  const response = await fetch(EMOJI_LIB_URL)
  if (!response.ok) {
    throw new Error(`Failed to fetch emoji data: ${response.statusText}`)
  }
  return response.json() as Promise<RawEmojiData>
}

/**
 * Process raw emoji data: convert keyword arrays to space-separated strings
 */
function processEmojiData(rawData: RawEmojiData): ProcessedEmojiData {
  const processed: ProcessedEmojiData = {}

  for (const [emoji, keywords] of Object.entries(rawData)) {
    processed[emoji] = Array.isArray(keywords) ? keywords.join(' ') : keywords
  }

  return processed
}

/**
 * Generate pre-rendered HTML from emoji data
 */
function generateEmojiHTML(emojiData: ProcessedEmojiData): string {
  return Object.entries(emojiData)
    .map(([emoji, keywords]) => 
      `<li class="result emoji-wrapper js-emoji" title="${keywords}">
    <div class="js-emoji-char native-emoji" data-emoji="${emoji}">${emoji}</div>
  </li>`
    )
    .join('\n  ')
}

/**
 * Main function: orchestrates the data fetching and file generation
 */
async function main(): Promise<void> {
  console.log('Fetching emoji data from emojilib...')

  try {
    const rawData = await fetchRawData()
    const processedData = processEmojiData(rawData)
    const html = generateEmojiHTML(processedData)

    // Generate JSON for runtime search/filtering
    await Bun.write(DATA_OUTPUT_PATH, JSON.stringify(processedData, null, 2))
    
    // Generate pre-rendered HTML for build-time injection
    await Bun.write(HTML_OUTPUT_PATH, html)

    const count = Object.keys(processedData).length
    console.log(`✓ Fetched ${count} emojis`)
    console.log(`✓ Generated ${DATA_OUTPUT_PATH}`)
    console.log(`✓ Generated ${HTML_OUTPUT_PATH}`)
  } catch (error) {
    console.error('Error generating emoji data:', error)
    process.exit(1)
  }
}

main()
