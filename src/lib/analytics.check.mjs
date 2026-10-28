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
    compilerOptions: {
      module: ts.ModuleKind.CommonJS,
      target: ts.ScriptTarget.ES2020,
      ...(filename.endsWith('.tsx') ? { jsx: ts.JsxEmit.ReactJSX } : {}),
    },
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

browser.location = new URL('https://www.arvonmaaritys.fi/yritys/private-company?fid=1234567-8')
analytics.trackPageView()
analytics.trackBuyBoxView(7900)
analytics.trackBuyBoxView(7900)
analytics.trackCheckoutFailure('http_rejection')
analytics.trackCheckoutFailure('missing_checkout_url')
analytics.trackCheckoutFailure('network_exception')
analytics.trackCheckoutFailure('raw exception: buyer@example.com')
const measurementEvents = calls().filter(entry => entry[0] === 'event')
assert.equal(measurementEvents.filter(entry => entry[1] === 'view_item').length, 1, 'BuyBox visibility is deduped per page')
const viewItem = measurementEvents.find(entry => entry[1] === 'view_item')[2]
assert.equal(viewItem.value, 79)
assert.equal(viewItem.currency, 'EUR')
assert.deepEqual(Array.from(viewItem.items, item => item.item_id), ['ai_valuation_report'])
const checkoutErrors = measurementEvents.filter(entry => entry[1] === 'checkout_error')
assert.deepEqual(Array.from(checkoutErrors, entry => entry[2].failure_type), ['http_rejection', 'missing_checkout_url', 'network_exception'])
assert.ok(checkoutErrors.every(entry => Object.keys(entry[2]).every(key => ['failure_type', 'page_location', 'page_title', 'page_referrer', 'send_to'].includes(key))))
assert.ok(!/private-company|1234567-8|buyer@example|SECRET|raw exception|\?/.test(JSON.stringify(calls())), 'view and checkout error events contain only sanitized context and fixed fields')
const eventCountBeforePrivatePage = calls().filter(entry => entry[0] === 'event').length
browser.location = new URL('https://www.arvonmaaritys.fi/raportti?session_id=SECRET')
analytics.trackCheckoutFailure('network_exception')
analytics.trackBuyBoxView(7900)
assert.equal(calls().filter(entry => entry[0] === 'event').length, eventCountBeforePrivatePage, 'private report pages emit no checkout or BuyBox telemetry')
browser.location = new URL('https://www.arvonmaaritys.fi/yritys/another-private-company')
analytics.trackPageView()
analytics.trackBuyBoxView(7900)
assert.equal(calls().filter(entry => entry[0] === 'event' && entry[1] === 'view_item').length, 2, 'a new public page gets its own BuyBox view')

let activeObservers = []
class MockIntersectionObserver {
  constructor(callback, options) { this.callback = callback; this.options = options; this.targets = []; this.disconnected = false; activeObservers.push(this) }
  observe(target) { this.targets.push(target) }
  disconnect() { this.disconnected = true }
  fire(target, intersectionRatio, isIntersecting = true) {
    this.callback([{ target, isIntersecting, intersectionRatio }], this)
  }
}
const observerWindow = { location: new URL('https://www.arvonmaaritys.fi/yritys/observer-test'), innerWidth: 390, innerHeight: 800 }
const observerDocument = { referrer: '', head: { appendChild() {} }, createElement: () => ({}) }
const observerAnalytics = load('lib/analytics.ts', {
  window: observerWindow, document: observerDocument, IntersectionObserver: MockIntersectionObserver,
})
const observedElement = { getBoundingClientRect: () => ({ left: 0, right: 390, top: 0, bottom: 400, width: 390, height: 400 }) }
observerAnalytics.trackPageView()
let observedViews = 0
const stopFirstObserver = observerAnalytics.observeBuyBoxVisibility(observedElement, () => {
  observedViews++
  observerAnalytics.trackBuyBoxView(7900)
})
const firstObserver = activeObservers.at(-1)
assert.deepEqual(Array.from(firstObserver.options.threshold), [0, 0.2])
firstObserver.fire(observedElement, 0.19)
assert.equal(observedViews, 0, 'less than 20% visible does not count')
stopFirstObserver()
assert.equal(firstObserver.disconnected, true, 'effect cleanup disconnects an unreported observer')
const stopStrictReplayObserver = observerAnalytics.observeBuyBoxVisibility(observedElement, () => {
  observedViews++
  observerAnalytics.trackBuyBoxView(7900)
})
const strictReplayObserver = activeObservers.at(-1)
strictReplayObserver.fire(observedElement, 0.2)
strictReplayObserver.fire(observedElement, 0.8)
assert.equal(observedViews, 1, 'a StrictMode setup-cleanup-setup replay observes once')
assert.equal(strictReplayObserver.disconnected, true, 'a reported observer disconnects')
stopStrictReplayObserver()
const stopRemountObserver = observerAnalytics.observeBuyBoxVisibility(observedElement, () => {
  observedViews++
  observerAnalytics.trackBuyBoxView(7900)
})
const remountObserver = activeObservers.at(-1)
remountObserver.fire(observedElement, 0.5)
assert.equal(observedViews, 2, 'a remounted card can observe again')
assert.equal(observerWindow.dataLayer.map(entry => Array.from(entry)).filter(entry => entry[0] === 'event' && entry[1] === 'view_item').length, 1, 'remount on the same page does not duplicate GA view_item')
stopRemountObserver()
const stopUnmountedObserver = observerAnalytics.observeBuyBoxVisibility(observedElement, () => { observedViews++ })
const unmountedObserver = activeObservers.at(-1)
stopUnmountedObserver()
unmountedObserver.fire(observedElement, 0.9)
assert.equal(observedViews, 2, 'an unmounted observer cannot report later intersections')

const fallbackListeners = new Map()
const fallbackWindow = {
  location: new URL('https://www.arvonmaaritys.fi/yritys/fallback-test'), innerWidth: 390, innerHeight: 800,
  addEventListener(type, listener) { const list = fallbackListeners.get(type) ?? []; list.push(listener); fallbackListeners.set(type, list) },
  removeEventListener(type, listener) { fallbackListeners.set(type, (fallbackListeners.get(type) ?? []).filter(item => item !== listener)) },
}
const fallbackAnalytics = load('lib/analytics.ts', { window: fallbackWindow, document: observerDocument })
let fallbackViews = 0
let fallbackRect = { left: 0, right: 390, top: 810, bottom: 1210, width: 390, height: 400 }
const fallbackElement = { getBoundingClientRect: () => fallbackRect }
const stopFallback = fallbackAnalytics.observeBuyBoxVisibility(fallbackElement, () => { fallbackViews++ })
assert.equal(fallbackViews, 0, 'fallback does not count an off-screen card')
fallbackRect = { ...fallbackRect, top: 700, bottom: 1100 }
fallbackListeners.get('scroll')[0]()
assert.equal(fallbackViews, 1, 'fallback detects a card after scrolling into view')
assert.equal(fallbackListeners.get('scroll').length, 0)
assert.equal(fallbackListeners.get('resize').length, 0)
stopFallback()
const lateFallbackWindow = {
  ...fallbackWindow,
  location: new URL('https://www.arvonmaaritys.fi/yritys/late-mount'),
  addEventListener() {}, removeEventListener() {},
}
const lateFallbackAnalytics = load('lib/analytics.ts', { window: lateFallbackWindow, document: observerDocument })
let lateMountViews = 0
lateFallbackAnalytics.observeBuyBoxVisibility({ getBoundingClientRect: () => ({ left: 0, right: 390, top: 100, bottom: 500, width: 390, height: 400 }) }, () => { lateMountViews++ })
assert.equal(lateMountViews, 1, 'fallback checks immediately when the card mounts already in view')

function findElement(node, type) {
  if (!node || typeof node !== 'object') return null
  if (node.type === type) return node
  const children = node.props?.children
  for (const child of Array.isArray(children) ? children : [children]) {
    const found = findElement(child, type)
    if (found) return found
  }
  return null
}

function renderBuyBoxScenario({ analyticsApi, fetchImpl, location }) {
  const state = []
  const refs = []
  const effects = []
  const observedElements = []
  let stateIndex = 0
  let refIndex = 0
  const react = {
    useState(initial) {
      const index = stateIndex++
      if (!(index in state)) state[index] = initial
      return [state[index], value => { state[index] = value }]
    },
    useRef(initial) {
      const index = refIndex++
      if (!(index in refs)) refs[index] = { current: initial }
      return refs[index]
    },
    useEffect(effect) { effects.push(effect) },
  }
  const makeElement = (type, props) => ({ type, props: props ?? {} })
  const window = { location }
  const componentAnalytics = {
    ...analyticsApi,
    observeBuyBoxVisibility(element) {
      observedElements.push(element)
      return () => {}
    },
  }
  const loaded = load('components/BuyBox.tsx', { window, fetch: fetchImpl }, {
    react,
    'react/jsx-runtime': { jsx: makeElement, jsxs: makeElement, Fragment: Symbol('Fragment') },
    '@/lib/pricing': { quote: () => ({ total: 7900 }), eur: value => `${value} EUR` },
    '@/lib/companies': { companyDisplayName: ({ name }) => name },
    '@/lib/analytics': componentAnalytics,
  }, new Map())
  const tree = loaded.BuyBox({ companyId: 'private-company-id', companyName: 'PRIVATE COMPANY', businessId: '1234567-8', fid: 321 })
  const card = { getBoundingClientRect: () => ({ left: 0, right: 390, top: 0, bottom: 500, width: 390, height: 500 }) }
  tree.props.ref.current = card
  const form = findElement(tree, 'form')
  const cleanups = effects.map(effect => effect()).filter(value => typeof value === 'function')
  return { state, card, form, cleanups, observedElements, window }
}

async function runBuyBoxFailure({ response, fetchError, badAnalytics = false }) {
  const scenarioLocation = new URL('https://www.arvonmaaritys.fi/yritys/private-company-id?fid=SECRET')
  const assignedUrls = []
  scenarioLocation.assign = url => assignedUrls.push(url)
  const scenarioBrowser = { location: scenarioLocation }
  const scenarioDocument = { referrer: 'https://www.arvonmaaritys.fi/kassa/valmis?session_id=SECRET', head: { appendChild() {} }, createElement: () => ({}) }
  const scenarioAnalytics = load('lib/analytics.ts', { window: scenarioBrowser, document: scenarioDocument })
  const failureTypes = []
  const trackFailure = scenarioAnalytics.trackCheckoutFailure
  scenarioAnalytics.trackCheckoutFailure = failureType => {
    failureTypes.push(failureType)
    trackFailure(failureType)
    throw Error('raw analytics failure PRIVATE buyer@example.com')
  }
  if (badAnalytics) {
    scenarioAnalytics.trackBeginCheckout = () => { throw Error('raw analytics exception SECRET') }
    scenarioAnalytics.getCheckoutAnalyticsIdentity = async () => { throw Error('raw callback exception buyer@example.com') }
  } else {
    scenarioAnalytics.getCheckoutAnalyticsIdentity = async () => undefined
  }
  let fetchCalls = 0
  const scenario = renderBuyBoxScenario({
    analyticsApi: scenarioAnalytics,
    fetchImpl: async () => {
      fetchCalls++
      if (fetchError) throw fetchError
      return response
    },
    location: scenarioLocation,
  })
  assert.equal(scenario.form.type, 'form')
  assert.equal(scenario.observedElements.length, 1)
  assert.equal(scenario.observedElements[0], scenario.card, 'the order card itself is observed')
  await scenario.form.props.onSubmit({ preventDefault() {} })
  const gaCalls = scenarioBrowser.dataLayer.map(entry => Array.from(entry))
  return { ...scenario, failureTypes, fetchCalls, gaCalls, assignedUrls }
}

const httpFailure = await runBuyBoxFailure({ response: { ok: false, status: 503, json: async () => ({ error: 'Rejected PRIVATE buyer@example.com' }) } })
assert.deepEqual(httpFailure.failureTypes, ['http_rejection'])
assert.equal(httpFailure.state[4], 'Rejected PRIVATE buyer@example.com', 'existing API error remains visible to the buyer')
assert.equal(httpFailure.fetchCalls, 1)
assert.equal(httpFailure.gaCalls.filter(entry => entry[0] === 'event' && entry[1] === 'checkout_error').length, 1)
assert.equal(httpFailure.gaCalls.find(entry => entry[0] === 'event' && entry[1] === 'checkout_error')[2].failure_type, 'http_rejection')
assert.ok(!/PRIVATE|buyer@example|SECRET|private-company-id|\?/.test(JSON.stringify(httpFailure.gaCalls)), 'HTTP error text and company/customer details never reach GA')

const httpWithoutJson = await runBuyBoxFailure({ response: { ok: false, status: 502, json: async () => { throw Error('Private gateway body') } } })
assert.deepEqual(httpWithoutJson.failureTypes, ['http_rejection'], 'an unreadable non-OK response remains a server rejection')
assert.equal(httpWithoutJson.state[4], 'Verkkovirhe. Yritä uudelleen.')

const missingUrl = await runBuyBoxFailure({ response: { ok: true, json: async () => ({ error: 'Private error from server' }) } })
assert.deepEqual(missingUrl.failureTypes, ['missing_checkout_url'])
assert.equal(missingUrl.state[4], 'Private error from server')

const networkFailure = await runBuyBoxFailure({ fetchError: Error('Network failed for PRIVATE company; buyer@example.com'), badAnalytics: true })
assert.deepEqual(networkFailure.failureTypes, ['network_exception'])
assert.equal(networkFailure.state[4], 'Verkkovirhe. Yritä uudelleen.')
assert.equal(networkFailure.fetchCalls, 1, 'checkout proceeds when begin-checkout tracking and identity lookup fail')
assert.ok(!/PRIVATE|buyer@example|SECRET|private-company-id|Network failed|raw analytics/.test(JSON.stringify(networkFailure.gaCalls)), 'network and analytics exception text never reaches GA')

const responseReadFailure = await runBuyBoxFailure({ response: { ok: true, json: async () => { throw Error('Private malformed response') } } })
assert.deepEqual(responseReadFailure.failureTypes, ['response_exception'])
assert.equal(responseReadFailure.state[4], 'Verkkovirhe. Yritä uudelleen.')

const navigationCalls = []
const successLocation = new URL('https://www.arvonmaaritys.fi/yritys/checkout-success')
successLocation.assign = url => navigationCalls.push(url)
const successBrowser = { location: successLocation }
const successAnalytics = load('lib/analytics.ts', {
  window: successBrowser,
  document: { referrer: '', head: { appendChild() {} }, createElement: () => ({}) },
})
successAnalytics.getCheckoutAnalyticsIdentity = async () => undefined
let successFetchCalls = 0
const successScenario = renderBuyBoxScenario({
  analyticsApi: successAnalytics,
  fetchImpl: async () => { successFetchCalls++; return { ok: true, json: async () => ({ url: 'https://checkout.stripe.com/mock' }) } },
  location: successLocation,
})
await successScenario.form.props.onSubmit({ preventDefault() {} })
assert.equal(successFetchCalls, 1)
assert.deepEqual(navigationCalls, ['https://checkout.stripe.com/mock'])
assert.equal(successScenario.state[4], null)

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
  'next/server': { NextResponse: { json: (body, init) => Response.json(body, init) } },
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
