export const GA_ID = 'G-K7HYM7Q10C'
const PUBLIC_ORIGIN = 'https://www.arvonmaaritys.fi'
const PUBLIC_PATHS = new Set([
  '/', '/yritys', '/yritykset', '/laskuri', '/kertoimet', '/blogi',
  '/yrityskauppa', '/sukupolvenvaihdos', '/tietosuoja',
])
const SENSITIVE_PARAMS = new Set([
  'key', 'token', 'access_token', 'api_key', 'session_id', 'email',
  'customeremail', 'userinput',
])

declare global {
  interface Window {
    dataLayer?: IArguments[]
    gtag?: (...args: unknown[]) => void
    'ga-disable-G-K7HYM7Q10C'?: boolean
  }
}

// Dynamic identifiers, queries, fragments and document titles never enter GA.
export function publicAnalyticsPath(url: URL): string | null {
  if (Array.from(url.searchParams.keys()).some(key => SENSITIVE_PARAMS.has(key.toLowerCase()))) return null
  const pathname = url.pathname.replace(/\/$/, '') || '/'
  if (PUBLIC_PATHS.has(pathname)) return pathname
  if (/^\/yritys\/[^/]+$/.test(pathname)) return '/yritys/detail'
  if (/^\/yritykset\/[^/]+$/.test(pathname)) return '/yritykset/profile'
  if (/^\/blogi\/[^/]+$/.test(pathname)) return '/blogi/article'
  return null
}

export function analyticsContext(url: URL, referrer: string) {
  const pathname = publicAnalyticsPath(url)
  if (!pathname) return null
  let pageReferrer = ''
  try {
    const source = new URL(referrer)
    if (source.origin === url.origin) {
      const publicPath = publicAnalyticsPath(source)
      if (publicPath) pageReferrer = `${PUBLIC_ORIGIN}${publicPath}`
    } else if (source.protocol === 'https:' || source.protocol === 'http:') {
      pageReferrer = source.origin
    }
  } catch {}
  return {
    page_location: `${PUBLIC_ORIGIN}${pathname}`,
    page_title: pathname === '/' ? 'Etusivu' : pathname,
    page_referrer: pageReferrer,
  }
}

export function analyticsIdentity(input: unknown): { clientId: string; sessionId?: string } | undefined {
  if (!input || typeof input !== 'object') return undefined
  const { clientId, sessionId } = input as Record<string, unknown>
  if (typeof clientId !== 'string' || !/^\d{1,20}\.\d{1,20}$/.test(clientId)) return undefined
  return {
    clientId,
    ...(typeof sessionId === 'string' && /^\d{1,16}$/.test(sessionId) && Number(sessionId) > 0
      ? { sessionId } : {}),
  }
}

let initialized = false
let lastPage: string | null = null

function initialize(context: NonNullable<ReturnType<typeof analyticsContext>>) {
  if (initialized) return
  initialized = true
  window.dataLayer ??= []
  window.gtag = function gtag() {
    // gtag.js consumes Arguments objects; rest-parameter arrays are ignored.
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments)
  }
  window.gtag('js', new Date())
  window.gtag('set', { ...context, allow_google_signals: false, allow_ad_personalization_signals: false })
  // Disable Enhanced Measurement in GA too: send_page_view:false alone
  // does not disable automatic history/form events.
  window.gtag('config', GA_ID, { ...context, send_page_view: false })
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  script.referrerPolicy = 'no-referrer'
  document.head.appendChild(script)
}

function currentContext() {
  if (typeof window === 'undefined') return null
  const context = analyticsContext(new URL(window.location.href), document.referrer)
  window['ga-disable-G-K7HYM7Q10C'] = !context
  return context
}

export function trackPageView() {
  const context = currentContext()
  if (!context) {
    lastPage = null
    return
  }
  initialize(context)
  const key = window.location.pathname
  if (lastPage === key) return
  lastPage = key
  window.gtag?.('set', context)
  window.gtag?.('event', 'page_view', { ...context, send_to: GA_ID })
}

function trackEvent(name: string, params: Record<string, unknown>) {
  const context = currentContext()
  if (!context) return
  initialize(context)
  window.gtag?.('event', name, { ...params, ...context, send_to: GA_ID })
}

export function trackCompanySearch(resultCount: number) {
  trackEvent('company_search', { result_count: Math.min(100, Math.max(0, Math.trunc(resultCount))) })
}

export function trackCompanySelection() {
  trackEvent('select_company', { item_list_id: 'company_search' })
}

export function trackBeginCheckout(totalCents: number) {
  trackEvent('begin_checkout', {
    currency: 'EUR', value: totalCents / 100,
    items: [{ item_id: 'ai_valuation_report', item_name: 'AI-arvonmääritysraportti', quantity: 1 }],
  })
}

export async function getCheckoutAnalyticsIdentity() {
  if (!currentContext() || !window.gtag) return undefined
  const read = (field: string) => new Promise<unknown>(resolve => {
    const timer = setTimeout(() => resolve(undefined), 350)
    window.gtag?.('get', GA_ID, field, (value: unknown) => {
      clearTimeout(timer)
      resolve(value)
    })
  })
  const [clientId, sessionId] = await Promise.all([read('client_id'), read('session_id')])
  return analyticsIdentity({ clientId, sessionId: sessionId == null ? undefined : String(sessionId) })
}
