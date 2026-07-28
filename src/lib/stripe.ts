import Stripe from 'stripe'

let cached: Stripe | null = null
const DEFAULT_PUBLIC_SITE_URL = 'https://www.arvonmaaritys.fi'
const LEGACY_PUBLIC_SITE_HOSTS = new Set(['valuation.fi', 'www.valuation.fi'])

/**
 * Returns a configured Stripe client, or null when no Stripe secret key is set.
 * The checkout route degrades gracefully to a demo mode in that case so the
 * site is runnable without secrets.
 */
export function getStripe(): Stripe | null {
  if (cached) return cached
  const key = process.env.STRIPE_SECRET_KEY ?? process.env.STRIPE_API_KEY
  if (!key) return null
  // Use the SDK's pinned API version (avoids hard-coding a version string that
  // drifts when the stripe package is upgraded).
  cached = new Stripe(key)
  return cached
}

export function siteUrl(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL?.trim()
  if (configuredUrl) {
    const normalizedUrl = configuredUrl.replace(/\/$/, '')
    const host = normalizedUrl.replace(/^https?:\/\//, '').split('/')[0]
    if (!LEGACY_PUBLIC_SITE_HOSTS.has(host)) return normalizedUrl
  }

  const vercelUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL ?? process.env.VERCEL_URL
  if (vercelUrl) return `https://${vercelUrl.replace(/^https?:\/\//, '').replace(/\/$/, '')}`

  if (process.env.NODE_ENV === 'production') return DEFAULT_PUBLIC_SITE_URL

  return 'http://localhost:3000'
}
