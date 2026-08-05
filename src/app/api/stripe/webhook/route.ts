import { NextResponse } from 'next/server'
import type Stripe from 'stripe'
import { getStripe, VALUATION_PRODUCT_TAG } from '@/lib/stripe'
import { postOrder, postCheckoutGenerate } from '@/lib/orders'
import { eur } from '@/lib/pricing'

// Stripe SDK needs Node.js (crypto), not the edge runtime.
export const runtime = 'nodejs'

// Durable fulfilment. The /kassa/valmis success page fulfils in the browser,
// which breaks if the user closes the tab during the redirect — payment taken,
// nothing generated. This webhook is the server-to-server safety net Stripe
// always calls. checkout-generate is idempotent on the session id, so the
// webhook and the success page racing each other cannot double-generate.
//
// ponytail: import/creditsafe still fall to postOrder, which is not idempotent
// on session id — if BOTH the browser page and this webhook fire for the same
// import order, the operator sees a duplicate order row (no money path, human
// fulfils). Dedupe there is a backend /api/orders concern, left for when it bites.
export async function POST(req: Request) {
  const stripe = getStripe()
  const secret = process.env.STRIPE_WEBHOOK_SECRET
  // No Stripe / no signing secret → webhooks are not in use (demo mode). Ack so
  // Stripe (if somehow pointed here) doesn't retry forever.
  if (!stripe || !secret) return NextResponse.json({ received: true })

  const sig = req.headers.get('stripe-signature')
  if (!sig) return NextResponse.json({ error: 'no signature' }, { status: 400 })

  const raw = await req.text()
  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(raw, sig, secret)
  } catch (err) {
    console.error('stripe webhook signature verification failed', err)
    return NextResponse.json({ error: 'invalid signature' }, { status: 400 })
  }

  // async_payment_succeeded covers delayed methods; completed covers cards.
  if (
    event.type === 'checkout.session.completed' ||
    event.type === 'checkout.session.async_payment_succeeded'
  ) {
    const session = event.data.object as Stripe.Checkout.Session
    if (session.payment_status === 'paid') {
      try {
        await fulfilSession(session)
      } catch (err) {
        // Log but still 200: a thrown fulfilment error should not make Stripe
        // retry indefinitely. The browser page is a second chance; alerts on
        // these logs are the operator's signal.
        console.error('stripe webhook fulfilment threw', session.id, err)
      }
    }
  }

  return NextResponse.json({ received: true })
}

// Kinds this site sells. Our own Checkout Sessions always set one; a session
// carrying none was created by some other product on the account.
const OWN_KINDS = new Set(['existing', 'import', 'creditsafe'])

/**
 * Is this session ours to fulfil? Stripe fans checkout.session.completed out to
 * EVERY endpoint registered on the account, so this endpoint also receives the
 * luottoriskit.fi products' purchases — and those carry businessId/fid/
 * companyName metadata under the very same names we read. Without this gate,
 * `kind` defaulted to 'existing', the session looked like an auto-generate
 * purchase, and a credit-report buyer got a paid (~$3) valuation report
 * generated and emailed to them (2026-08-05).
 *
 * The tag is the real check; the kind fallback keeps sessions created before
 * the tag shipped fulfillable, and still excludes foreign products (which never
 * set `kind`).
 */
function isOwnSession(m: Stripe.Metadata): boolean {
  return m.product === VALUATION_PRODUCT_TAG || OWN_KINDS.has(m.kind ?? '')
}

async function fulfilSession(session: Stripe.Checkout.Session) {
  const m = session.metadata ?? {}
  if (!isOwnSession(m)) {
    // Not an error: it's another product's payment arriving here by design.
    // Logged (not silent) so a metadata regression on our own checkout shows up
    // as unfulfilled orders rather than as nothing at all.
    console.warn('stripe webhook: session is not an arvonmääritys purchase, ignoring', {
      sessionId: session.id,
      product: m.product ?? null,
      reportType: m.reportType ?? null,
    })
    return
  }
  const kind = m.kind === 'import' || m.kind === 'creditsafe' ? m.kind : 'existing'
  const companyName = m.companyName || 'Tuntematon yritys'
  const businessId = m.businessId || ''
  // Metadata is strings; undefined when absent so the backend keeps its own
  // model heuristic instead of receiving a bogus 0/NaN.
  const fidNum = Number(m.fid)
  const fid = Number.isSafeInteger(fidNum) && fidNum > 0 ? fidNum : undefined
  const userInput = m.userInput || ''
  const email =
    session.customer_details?.email || session.customer_email || m.customerEmail || ''
  const sessionId = session.id

  if (!email) {
    console.error('stripe webhook: no email on session', sessionId)
    return
  }

  // Auto-generation path (we already hold the financials) — idempotent backend.
  if (kind === 'existing' && businessId) {
    const result = await postCheckoutGenerate({
      businessId, fid, companyName, email, userInput, stripeSessionId: sessionId,
      // Must match the success page: the buyer opted in to reviewing forecasts,
      // so start the run in forecast mode whichever path (webhook/page) fires first.
      forecast: m.forecast === 'true',
    })
    if (result) return // run started (or reused) — done
    console.error('stripe webhook: checkout-generate returned null, queuing order', sessionId)
  }

  // import/creditsafe, or auto-gen failed → operator intake.
  const queued = await postOrder({
    company: companyName,
    email,
    user_input: `MAKSETTU (Stripe ${sessionId}, webhook), tuote: ${kind}, hinta: ${eur(session.amount_total ?? 0)}`,
  })
  if (!queued) console.error('stripe webhook: postOrder failed', sessionId)
}
