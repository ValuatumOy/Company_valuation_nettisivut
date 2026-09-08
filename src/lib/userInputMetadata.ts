/**
 * The buyer's background text has to survive a round trip through Stripe.
 *
 * A Stripe metadata VALUE caps at 500 characters, but the textarea accepts
 * 4000 and the backend stores 4000. Writing `userInput.slice(0, 500)` into the
 * session therefore threw the rest away at the moment of payment, silently and
 * mid-word — every purchase with a longer description generated a report the
 * buyer never asked for (2026-09-08, Apogee Oy, and two NoCFO runs before it).
 *
 * So split across numbered keys — userInput, userInput2, ... — and join them
 * back on the fulfilment side. Metadata allows 50 keys; eight chunks cover the
 * full 4000 and leave plenty for the other fields.
 */

export const USER_INPUT_MAX = 4000
const CHUNK = 500
const MAX_CHUNKS = USER_INPUT_MAX / CHUNK

/** Key for chunk `i` (0-based): userInput, userInput2, userInput3, ... */
function chunkKey(i: number): string {
  return i === 0 ? 'userInput' : `userInput${i + 1}`
}

/**
 * Split `text` into the metadata fields a Checkout Session should carry.
 * Splits on code POINTS, so an emoji never breaks in half across two keys.
 */
export function userInputMetadata(text: string): Record<string, string> {
  const chars = Array.from(text ?? '')
  const out: Record<string, string> = {}
  for (let i = 0; i < MAX_CHUNKS; i++) {
    const chunk = chars.slice(i * CHUNK, (i + 1) * CHUNK).join('')
    if (!chunk) break
    out[chunkKey(i)] = chunk
  }
  return out
}

/** Reassemble what userInputMetadata split. Reads the legacy single key too. */
export function readUserInput(metadata: Record<string, string | undefined> | null | undefined): string {
  const m = metadata ?? {}
  let text = ''
  for (let i = 0; i < MAX_CHUNKS; i++) {
    const part = m[chunkKey(i)]
    if (!part) break
    text += part
  }
  return text
}
