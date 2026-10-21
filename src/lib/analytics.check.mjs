// Run: node src/lib/analytics.check.mjs. Every network/payment/backend dependency is mocked.
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import vm from 'node:vm'
import { fileURLToPath } from 'node:url'
import ts from 'typescript'

const requireModule = createRequire(import.meta.url)
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')

function load(file, globals = {}, mocks = {}, cache = new Map()) {
  const filename = path.resolve(root, file)
  if (cache.has(filename)) return cache.get(filename)
  const loadedModule = { exports: {} }
  cache.set(filename, loadedModule.exports)
  const code = ts.transpileModule(readFileSync(filename, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText
  vm.runInNewContext(code, {
    module: loadedModule, exports: loadedModule.exports,
    require: id => {
      if (id in mocks) return mocks[id]
      if (id.startsWith('@/')) return load(`${id.slice(2)}.ts`, globals, mocks, cache)
      if (id.startsWith('.')) return load(path.relative(root, path.resolve(path.dirname(filename), `${id}.ts`)), globals, mocks, cache)
      return requireModule(id)
    },
    URL, URLSearchParams, AbortSignal, setTimeout, clearTimeout,
    console: { error() {}, warn() {} }, process: { env: {} }, ...globals,
  }, { filename })
  return loadedModule.exports
}

const scripts = []
const browser = { location: new URL('https://www.arvonmaaritys.fi/raportti?key=PRIVATE') }
const document = { referrer: 'https://www.arvonmaaritys.fi/kassa/valmis?session_id=SECRET', head: { appendChild: script => scripts.push(script) }, createElement: () => ({}) }
const analytics = load('lib/analytics.ts', { window: browser, document })
analytics.trackPageView()
assert.equal(scripts.length, 0, 'private initial page must not load gtag')

for (const url of ['/raportti', '/raportti/sub', '/testi?key=x', '/kassa/valmis?session_id=x', '/api/search?q=secret', '/?KEY=secret', '/?customerEmail=user@example.com', '/unknown/secret']) {
  assert.equal(analytics.publicAnalyticsPath(new URL(url, 'https://www.arvonmaaritys.fi')), null, url)
}

browser.location = new URL('https://www.arvonmaaritys.fi/?utm_term=PRIVATE#SECRET')
analytics.trackPageView()
analytics.trackPageView()
assert.equal(scripts.length, 1)
assert.equal(scripts[0].referrerPolicy, 'no-referrer')
assert.ok(browser.dataLayer.every(entry => Object.prototype.toString.call(entry) === '[object Arguments]' && !Array.isArray(entry)), 'canonical gtag arguments, not arrays')
const calls = () => browser.dataLayer.map(entry => Array.from(entry))
assert.equal(calls().filter(entry => entry[1] === 'page_view').length, 1, 'StrictMode must not double-count')
assert.equal(calls().find(entry => entry[0] === 'config')[2].send_page_view, false)

browser.location = new URL('https://www.arvonmaaritys.fi/yritys/private-company?fid=123&q=buyer@example.com')
analytics.trackPageView()
analytics.trackCompanySearch(3)
analytics.trackCompanySelection()
analytics.trackBeginCheckout(7900)
const events = calls().filter(entry => entry[0] === 'event')
assert.equal(events.at(-1)[1], 'begin_checkout')
assert.equal(events.at(-1)[2].value, 79)
assert.equal(events.at(-1)[2].page_location, 'https://www.arvonmaaritys.fi/yritys/detail')
assert.equal(events.at(-1)[2].page_referrer, '')
assert.ok(!/PRIVATE|SECRET|buyer@example|private-company|session_id|\?/.test(JSON.stringify(calls())), 'no raw query, title, identifier, private referrer or text in commands')
assert.equal(analytics.analyticsContext(new URL('https://www.arvonmaaritys.fi/'), 'https://search.example/private?email=secret').page_referrer, 'https://search.example')

browser.location = new URL('https://www.arvonmaaritys.fi/kassa/valmis?session_id=SECRET')
const count = browser.dataLayer.length
analytics.trackPageView()
analytics.trackCompanySearch(1)
analytics.trackBeginCheckout(7900)
assert.equal(browser.dataLayer.length, count)
assert.equal(browser['ga-disable-G-K7HYM7Q10C'], true)
browser.location = new URL('https://www.arvonmaaritys.fi/')
analytics.trackPageView()
assert.equal(browser['ga-disable-G-K7HYM7Q10C'], false)
assert.equal(scripts.length, 1)
assert.equal(analytics.analyticsIdentity({ clientId: 'user@example.com' }), undefined)
assert.equal(analytics.analyticsIdentity({ clientId: '123.456', sessionId: 'private' }).sessionId, undefined)
assert.equal(await analytics.getCheckoutAnalyticsIdentity(), undefined, 'blocked GA callbacks must time out without blocking checkout')

const session = {
  id: 'cs_live_ABC123', created: 1800000000, livemode: true, mode: 'payment',
  payment_status: 'paid', currency: 'eur', amount_total: 7900,
  total_details: { amount_tax: 1605 },
  metadata: { product: 'arvonmaaritys_ai_raportti', kind: 'existing', ga_client_id: '123.456', ga_session_id: '1800000000', companyName: 'PRIVATE', userInput: 'SECRET' },
  customer_email: 'buyer@example.com',
}
const requests = []
const serverGlobals = {
  process: { env: { GA_MEASUREMENT_PROTOCOL_API_SECRET: 'mock-secret' } },
  fetch: async (url, options) => { requests.push({ url, options }); return { ok: true } },
}
const purchase = load('lib/purchaseAnalytics.ts', serverGlobals)
const payload = purchase.purchasePayload(session)
assert.equal(payload.client_id, '123.456')
assert.equal(payload.events[0].params.value, 62.95)
assert.equal(payload.events[0].params.tax, 16.05)
assert.equal(payload.events[0].params.session_id, 1800000000)
assert.ok(/^[a-f0-9]{64}$/.test(payload.events[0].params.transaction_id))
assert.equal(purchase.purchasePayload(session).events[0].params.transaction_id, payload.events[0].params.transaction_id, 'stable GA dedupe identity across repeats')
assert.ok(!/PRIVATE|SECRET|buyer@example|cs_live|page_location|page_referrer/.test(JSON.stringify(payload)))
for (const invalid of [
  { payment_status: 'unpaid' }, { payment_status: 'no_payment_required' }, { livemode: false },
  { mode: 'subscription' }, { amount_total: 0 }, { amount_total: null }, { amount_total: -1 },
  { currency: 'usd' }, { id: 'cs_test_ABC' }, { total_details: { amount_tax: 9000 } },
  { metadata: { ...session.metadata, product: 'foreign' } },
  { metadata: { ...session.metadata, kind: 'creditsafe' } },
  { metadata: { ...session.metadata, country: 'SE' } },
]) assert.equal(purchase.purchasePayload({ ...session, ...invalid }), null, JSON.stringify(invalid))

const noIdentity = { ...session, metadata: { product: session.metadata.product, kind: 'existing' } }
const fallback = purchase.purchasePayload(noIdentity)
assert.equal(purchase.purchasePayload(noIdentity).client_id, fallback.client_id)
assert.notEqual(fallback.client_id, payload.client_id)
assert.equal(fallback.events[0].params.session_id, undefined)
assert.equal(await purchase.sendPurchaseAnalytics(session), 'accepted')
assert.equal(requests.length, 1)
assert.equal(requests[0].options.signal.aborted, false)
assert.equal(await load('lib/purchaseAnalytics.ts').sendPurchaseAnalytics(session), 'skipped', 'missing secret never sends')
assert.equal(await purchase.sendPurchaseAnalytics({ ...session, livemode: false }), 'skipped')
assert.equal(requests.length, 1)
assert.equal(await load('lib/purchaseAnalytics.ts', { ...serverGlobals, fetch: async () => { throw Error('network') } }).sendPurchaseAnalytics(session), 'failed')

// Exercise the actual webhook route with mocked Stripe signatures and fulfilment.
let verifiedEvent = { type: 'checkout.session.completed', data: { object: session } }
let fulfilled = 0
let analyticsCalls = 0
const webhook = load('app/api/stripe/webhook/route.ts', {
  process: { env: { STRIPE_WEBHOOK_SECRET: 'mock-signing-secret' } },
}, {
  '@/lib/stripe': { VALUATION_PRODUCT_TAG: session.metadata.product, getStripe: () => ({ webhooks: { constructEvent: (_raw, signature) => {
    if (signature !== 'valid') throw Error('invalid signature')
    return verifiedEvent
  } } }) },
  '@/lib/orders': { postCheckoutGenerate: async () => { fulfilled++; return {} }, postOrder: async () => { fulfilled++; return true } },
  '@/lib/purchaseAnalytics': { sendPurchaseAnalytics: async verified => { analyticsCalls++; return purchase.sendPurchaseAnalytics(verified) } },
})
const webhookRequest = signature => new Request('https://example.com/api/stripe/webhook', { method: 'POST', body: '{}', headers: signature ? { 'stripe-signature': signature } : {} })
assert.equal((await webhook.POST(webhookRequest())).status, 400)
assert.equal((await webhook.POST(webhookRequest('invalid'))).status, 400)
assert.equal(analyticsCalls, 0, 'unverified input never reaches analytics')
verifiedEvent = { type: 'checkout.session.completed', data: { object: { ...session, payment_status: 'unpaid' } } }
await webhook.POST(webhookRequest('valid'))
assert.equal(analyticsCalls, 0)
verifiedEvent = { type: 'checkout.session.async_payment_succeeded', data: { object: { ...session, metadata: { ...session.metadata, businessId: '1234567-8' } } } }
await webhook.POST(webhookRequest('valid'))
assert.equal(fulfilled, 1)
assert.equal(analyticsCalls, 1)
assert.equal(JSON.parse(requests.at(-1).options.body).events[0].params.transaction_id, payload.events[0].params.transaction_id)
await webhook.POST(webhookRequest('valid'))
assert.equal(JSON.parse(requests.at(-1).options.body).events[0].params.transaction_id, payload.events[0].params.transaction_id, 'duplicate verified webhook has same GA dedupe key')

let created
const checkout = load('app/api/checkout/route.ts', {}, {
  '@/lib/stripe': { VALUATION_PRODUCT_TAG: session.metadata.product, siteUrl: () => 'https://example.com', getStripe: () => ({
    prices: { retrieve: async () => ({ id: 'mock-price', active: true }) },
    checkout: { sessions: { create: async input => { created = input; return { url: 'https://checkout.stripe.com/mock' } } } },
  }) },
})
const checkoutRequest = identity => new Request('https://example.com/api/checkout', { method: 'POST', body: JSON.stringify({ kind: 'existing', analytics: identity, customerEmail: 'buyer@example.com' }) })
await checkout.POST(checkoutRequest({ clientId: '123.456', sessionId: '1800000000' }))
assert.equal(created.metadata.ga_client_id, '123.456')
assert.equal(created.metadata.ga_session_id, '1800000000')
await checkout.POST(checkoutRequest({ clientId: 'buyer@example.com', sessionId: 'SECRET' }))
assert.equal(created.metadata.ga_client_id, undefined)
assert.equal(created.metadata.ga_session_id, undefined)
console.log('analytics: privacy, canonical gtag queue, navigation, funnel, payment authority, metadata and dedupe checks passed (all external calls mocked)')
