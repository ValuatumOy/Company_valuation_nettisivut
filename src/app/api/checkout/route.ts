import { randomUUID } from 'crypto'
import { NextResponse } from 'next/server'
import { getStripe, siteUrl, VALUATION_PRODUCT_TAG } from '@/lib/stripe'
import { userInputMetadata } from '@/lib/userInputMetadata'
import { quote, type ReportKind } from '@/lib/pricing'

const STRIPE_AI_REPORT_PRICE_ID =
  process.env.STRIPE_AI_REPORT_PRICE_ID ?? 'price_1Ty8Pt2FVkKDgcuUD2fzJ8Fk'
const DEMO_CHECKOUT_ENABLED =
  process.env.NODE_ENV !== 'production' || process.env.STRIPE_DEMO_CHECKOUT === '1'

export const runtime = 'nodejs'

interface CheckoutBody {
  kind: ReportKind
  companyId?: string
  companyName?: string
  businessId?: string
  fid?: number
  shareData?: boolean
  customerEmail?: string
  userInput?: string
  wantForecast?: boolean
}

export async function POST(req: Request) {
  let body: CheckoutBody
  try {
    body = (await req.json()) as CheckoutBody
  } catch {
    return NextResponse.json({ error: 'Virheellinen pyyntö' }, { status: 400 })
  }

  const kind: ReportKind =
    body.kind === 'import'
      ? 'import'
      : body.kind === 'creditsafe'
        ? 'creditsafe'
        : 'existing'
  // Sharing only meaningful for imported statements.
  const shareData = kind === 'import' && Boolean(body.shareData)
  const companyName = body.companyName?.slice(0, 200) || 'Valittu yritys'
  const businessId = body.businessId?.slice(0, 30) || ''
  // The Valuatum model the buyer selected. Round-tripped through Stripe as a
  // string; the backend re-checks it against businessId before using it, so a
  // tampered value can only cost the buyer the model choice, not redirect the
  // run to another company.
  const fid = Number.isSafeInteger(body.fid) && (body.fid as number) > 0 ? String(body.fid) : ''
  const customerEmail = body.customerEmail?.slice(0, 200) || ''
  const userInput = body.userInput?.slice(0, 4000) || ''
  // Opt-in: stop after the data fetch so the buyer can review/edit forecasts
  // before the report is written. Only meaningful for 'existing' (auto-generation);
  // import/creditsafe still go through the operator, so ignore it there.
  const wantForecast = kind === 'existing' && Boolean(body.wantForecast)
  const q = quote(kind, shareData)

  // Confirmation page: starts generation and/or posts the order to the backend.
  const successPath = `/kassa/valmis?session_id={CHECKOUT_SESSION_ID}&kind=${kind}`

  const stripe = getStripe()

  // --- Demo mode: no Stripe key configured -----------------------------------
  if (!stripe) {
    if (!DEMO_CHECKOUT_ENABLED) {
      console.error('stripe checkout unavailable: STRIPE_SECRET_KEY or STRIPE_API_KEY is not configured')
      return NextResponse.json(
        {
          error: 'Maksun käynnistäminen epäonnistui. Yritä uudelleen.',
          error_code: 'stripe_not_configured',
        },
        { status: 500 },
      )
    }

    // A real Stripe session id is unique per checkout, which is what makes
    // /kassa/valmis's "idempotent on session id, safe to reload" behavior
    // correct. Without a nonce here, the demo-mode session id (built from
    // company+email in kassa/valmis) would be the same on every retry by the
    // same person for the same company — so a failed attempt (e.g. a spend
    // cap trip) would be re-shown forever instead of actually retrying.
    const params = new URLSearchParams({ demo: '1', kind, n: randomUUID() })
    if (companyName) params.set('company', companyName)
    if (businessId) params.set('businessId', businessId)
    if (fid) params.set('fid', fid)
    if (customerEmail) params.set('email', customerEmail)
    if (userInput) params.set('userInput', userInput)
    if (shareData) params.set('share', '1')
    if (wantForecast) params.set('forecast', '1')
    return NextResponse.json({ url: `${siteUrl()}/kassa/valmis?${params}` })
  }

  // --- Real Stripe Checkout Session ------------------------------------------
  // Stripe Tax is always on. The Stripe price is VAT-inclusive
  // (tax_behavior=inclusive), so Tax splits the 25.5 % Finnish VAT out of the
  // 79 € the site advertises; a valid EU VAT id from another member state
  // reverse-charges at the same gross with a 0 VAT line. Requires Stripe Tax +
  // a Finnish registration in the dashboard (both live and test mode), otherwise
  // Stripe rejects every session.
  try {
    const price = await stripe.prices.retrieve(STRIPE_AI_REPORT_PRICE_ID)
    if (!price.active) {
      throw new Error(`Stripe price is inactive: ${STRIPE_AI_REPORT_PRICE_ID}`)
    }

    const session = await stripe.checkout.sessions.create({
      // No payment_method_types: Checkout offers whatever is enabled in the
      // dashboard (MobilePay, Klarna, wallets…) and fits a one-off EUR payment.
      // The webhook already handles async_payment_succeeded for delayed methods.
      line_items: [
        {
          price: price.id,
          quantity: 1,
        },
      ],
      mode: 'payment',
      allow_promotion_codes: true,
      customer_email: customerEmail || undefined,
      billing_address_collection: 'required',
      automatic_tax: { enabled: true },
      // Optional VAT-id field for business buyers (reverse charge inside the EU).
      tax_id_collection: { enabled: true },
      // Finnish Checkout with Finland preselected: a buyer this week ended up with
      // country=US on an Espoo address because Checkout guessed the locale.
      locale: 'fi',
      // Post-payment invoice (PDF + hosted page) with the VAT breakdown, the
      // buyer's VAT id and our VAT id (the account tax id set in the dashboard's
      // invoice settings), on top of the plain Stripe receipt. Needs a Customer,
      // hence customer_creation.
      customer_creation: 'always',
      invoice_creation: {
        enabled: true,
        invoice_data: { footer: 'Valuatum Oy – AI-arvonmääritysraportti' },
      },
      metadata: {
        // Marks the session as OURS — everything downstream (our webhook, the
        // backend's checkout-generate) refuses to fulfil a session without it,
        // because other products bill through this same Stripe account.
        product: VALUATION_PRODUCT_TAG,
        kind,
        companyId: body.companyId ?? '',
        companyName,
        businessId,
        fid,
        customerEmail,
        shareData: String(shareData),
        forecast: String(wantForecast),
        // A metadata value caps at 500 chars, so a longer description travels
        // in numbered keys (see userInputMetadata) and is joined back on the
        // fulfilment side. Slicing to 500 here dropped the rest at the moment
        // of payment, mid-word and without telling anyone.
        ...userInputMetadata(userInput),
      },
      success_url: `${siteUrl()}${successPath}`,
      cancel_url: `${siteUrl()}/kassa/peruutettu`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err) {
    console.error('stripe checkout failed', {
      price: STRIPE_AI_REPORT_PRICE_ID,
      error: err,
    })
    return NextResponse.json(
      {
        error: 'Maksun käynnistäminen epäonnistui. Yritä uudelleen.',
        error_code: 'stripe_session_failed',
      },
      { status: 500 },
    )
  }
}
