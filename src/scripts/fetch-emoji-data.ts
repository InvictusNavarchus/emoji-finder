/**
 * Build script: Fetches emoji data from emojilib and generates a JSON file
 * 
 * This script runs during build time (prebuild) to avoid runtime network requests.
 * The generated file is gitignored as it's a build artifact.
 */

import { resolve } from 'node:path'

const EMOJI_LIB_URL = 'https://unpkg.com/emojilib@^4.0.0'
const OUTPUT_PATH = resolve(import.meta.dirname, '../data/emoji-data.json')

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
 * Main function: orchestrates the data fetching and file generation
 */
async function main(): Promise<void> {
  console.log('Fetching emoji data from emojilib...')

  try {
    const rawData = await fetchRawData()
    const processedData = processEmojiData(rawData)

    await Bun.write(OUTPUT_PATH, JSON.stringify(processedData, null, 2))

    console.log(`✓ Fetched ${Object.keys(processedData).length} emojis`)
    console.log(`✓ Generated ${OUTPUT_PATH}`)
  } catch (error) {
    console.error('Error generating emoji data:', error)
    process.exit(1)
  }
}

main()
