// Run: node src/app/api/checkout/route.check.mjs. No network or Stripe calls.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'

const source = ts.transpileModule(readFileSync(new URL('./route.ts', import.meta.url), 'utf8'), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
}).outputText

function checkout(fetchResult, { demo = false } = {}) {
  const events = []
  const loaded = { exports: {} }
  const stripe = {
    prices: { retrieve: async () => { events.push('price'); return { active: true, id: 'price_mock' } } },
    checkout: { sessions: { create: async () => { events.push('session'); return { url: 'https://checkout.example/session' } } } },
  }
  const mocks = {
    crypto: { randomUUID: () => 'demo-nonce' },
    'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
    '@/lib/stripe': { getStripe: () => demo ? null : stripe, siteUrl: () => 'https://site.example', VALUATION_PRODUCT_TAG: 'valuation' },
    '@/lib/userInputMetadata': { userInputMetadata: () => ({}) },
    '@/lib/pricing': { quote: () => ({ total: 7900 }) },
    '@/lib/analytics': { analyticsIdentity: () => undefined },
  }
  vm.runInNewContext(source, {
    module: loaded, exports: loaded.exports,
    require: id => { assert.ok(id in mocks, id); return mocks[id] },
    process: { env: { NEXT_PUBLIC_ORDERS_API: 'https://backend.example/' } },
    URLSearchParams, AbortSignal, console,
    fetch: async (url, options) => {
      events.push('preflight')
      assert.equal(url, 'https://backend.example/api/public/valuation-preflight')
      assert.equal(options.method, 'POST')
      assert.equal(options.cache, 'no-store')
      assert.ok(options.signal instanceof AbortSignal)
      assert.deepEqual(JSON.parse(options.body), { fid: 123, business_id: '1234567-8' })
      return fetchResult()
    },
  })
  return {
    events,
    post: async (body = {}) => loaded.exports.POST(new Request('https://site.example/api/checkout', {
      method: 'POST', body: JSON.stringify({ kind: 'existing', fid: 123, businessId: '1234567-8', ...body }),
    })),
  }
}

const approved = checkout(() => Response.json({ ready: true }))
assert.equal((await approved.post()).status, 200)
assert.deepEqual(approved.events, ['preflight', 'price', 'session'], 'source approval must precede all Stripe work')

for (const outcome of [
  () => Response.json({ detail: 'private source details' }, { status: 409 }),
  () => Response.json({ detail: 'private source details' }, { status: 422 }),
  () => Response.json({ ready: false }),
  () => Response.json({ ready: 'true' }),
  () => Response.json({ ready: true }, { status: 202 }),
  () => Response.json({}),
  () => Response.json(null),
  () => Response.json({ detail: 'private source details' }, { status: 503 }),
  () => Response.json({}, { status: 429 }),
  () => new Response('unavailable', { status: 200 }),
  () => { throw Error('private network details') },
]) {
  const rejected = checkout(outcome)
  const response = await rejected.post()
  assert.ok(response.status >= 400)
  const body = await response.json()
  assert.ok(body.error)
  assert.equal(body.url, undefined)
  assert.ok(!JSON.stringify(body).includes('private'))
  assert.deepEqual(rejected.events, ['preflight'], 'unapproved source cannot create a payment session')
}

for (const body of [{ fid: undefined }, { businessId: '' }]) {
  const missing = checkout(() => { throw Error('must not call backend') })
  assert.equal((await missing.post(body)).status, 409)
  assert.deepEqual(missing.events, [])
}

for (const kind of ['import', 'creditsafe']) {
  const other = checkout(() => { throw Error('must not preflight other kinds') })
  assert.equal((await other.post({ kind })).status, 200)
  assert.deepEqual(other.events, ['price', 'session'])
}

const demo = checkout(() => Response.json({ ready: true }), { demo: true })
assert.equal((await demo.post()).status, 200)
assert.deepEqual(demo.events, ['preflight'])
const rejectedDemo = checkout(() => Response.json({}, { status: 409 }), { demo: true })
assert.equal((await rejectedDemo.post()).status, 409)
assert.deepEqual(rejectedDemo.events, ['preflight'])
console.log('checkout: prepayment source checks passed (all network/payment calls mocked)')
