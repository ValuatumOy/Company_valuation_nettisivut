/**
 * Self-check for the Stripe metadata round trip: `node src/lib/userInputMetadata.check.ts`
 * (Node 24 runs TypeScript directly.) The bug this guards against lost a paying
 * customer's text at exactly 500 characters, so the 501st is the case to keep.
 */
import assert from 'node:assert/strict'
import { readUserInput, userInputMetadata, USER_INPUT_MAX } from './userInputMetadata.ts'

const roundTrip = (s: string) => readUserInput(userInputMetadata(s))

// The regression: one character past a single metadata value.
const long = 'a'.repeat(501)
assert.equal(roundTrip(long), long)
assert.equal(Object.keys(userInputMetadata(long)).length, 2)

// The full textarea limit fits.
const max = 'x'.repeat(USER_INPUT_MAX)
assert.equal(roundTrip(max), max)

// Short text still travels in the single legacy key, so old sessions read back.
const short = 'Yhtiöstä siirretään ilmailuliiketoiminta pois ennen kauppaa.'
assert.deepEqual(userInputMetadata(short), { userInput: short })
assert.equal(readUserInput({ userInput: short }), short)

// Empty in, empty out — no stray keys on a session without a description.
assert.deepEqual(userInputMetadata(''), {})
assert.equal(readUserInput({}), '')
assert.equal(readUserInput(null), '')

// No metadata value may exceed Stripe's own 500-character cap.
for (const value of Object.values(userInputMetadata(max))) {
  assert.ok(Array.from(value).length <= 500, 'chunk over Stripe limit')
}

// Multi-byte characters must not split across chunks.
const emoji = '💶'.repeat(600)
assert.equal(roundTrip(emoji), emoji)

console.log('userInputMetadata: ok')
