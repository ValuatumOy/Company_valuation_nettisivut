import { createHash } from 'node:crypto'
import type Stripe from 'stripe'
import { analyticsIdentity, GA_ID } from './analytics'
import { VALUATION_PRODUCT_TAG } from './stripe'

/** Only call with a signature-verified Stripe event or a server-retrieved session. */
export function purchasePayload(session: Stripe.Checkout.Session) {
  const metadata = session.metadata ?? {}
  const total = session.amount_total
  const tax = session.total_details?.amount_tax ?? 0
  if (
    !session.livemode || session.mode !== 'payment' || session.payment_status !== 'paid' ||
    metadata.product !== VALUATION_PRODUCT_TAG || metadata.kind !== 'existing' ||
    (metadata.country && metadata.country !== 'FI') || session.currency !== 'eur' ||
    !Number.isSafeInteger(total) || total === null || total <= 0 ||
    !Number.isSafeInteger(tax) || tax < 0 || tax > total ||
    !/^cs_live_[A-Za-z0-9]+$/.test(session.id)
  ) return null

  // Same checkout -> same opaque transaction + fallback client, across retries
  // and server instances. GA deduplicates purchases by transaction_id/client.
  const transactionId = createHash('sha256').update(`valuation:${session.id}`).digest('hex')
  const identity = analyticsIdentity({ clientId: metadata.ga_client_id, sessionId: metadata.ga_session_id })
  const value = (total - tax) / 100
  return {
    client_id: identity?.clientId ?? `${BigInt(`0x${transactionId.slice(0, 12)}`)}.${session.created}`,
    consent: { ad_user_data: 'DENIED', ad_personalization: 'DENIED' },
    events: [{
      name: 'purchase',
      params: {
        transaction_id: transactionId,
        currency: 'EUR', value, tax: tax / 100,
        ...(identity?.sessionId ? { session_id: Number(identity.sessionId), engagement_time_msec: 1 } : {}),
        items: [{ item_id: 'ai_valuation_report', item_name: 'AI-arvonmääritysraportti', price: value, quantity: 1 }],
      },
    }],
  }
}

export async function sendPurchaseAnalytics(session: Stripe.Checkout.Session): Promise<'skipped' | 'accepted' | 'failed'> {
  const secret = process.env.GA_MEASUREMENT_PROTOCOL_API_SECRET
  const payload = purchasePayload(session)
  if (!secret || !payload) return 'skipped'
  try {
    const response = await fetch(`https://www.google-analytics.com/mp/collect?${new URLSearchParams({
      measurement_id: GA_ID, api_secret: secret,
    })}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload), signal: AbortSignal.timeout(2000),
    })
    // A 2xx is transport acceptance, not proof of ingestion into GA reports.
    if (response.ok) return 'accepted'
  } catch {}
  console.error('purchase analytics transport failed')
  return 'failed'
}
