import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// One allow-all rule covers Google + AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) — being citable by AI assistants is a goal.
// That goal is about the content pages; it is NOT about `/yritys/*`.
//
// `/yritys/:id` is an unbounded, per-request-rendered URL space: any y-tunnus
// (real or invented) resolves to a page, so a crawler that finds the pattern
// can generate unlimited server renders, each with a ~1.4 s Valuatum lookup
// behind it. In one 30-day window that produced 585k function invocations and
// 13 GB of origin transfer against ~300 real human pageviews, which blew
// through the whole Vercel allowance. The pages are also thin and duplicative
// (same template, three facts swapped) — nothing of SEO value is lost here.
const CRAWL_TRAPS = [
  '/api/',
  '/yritys/', // unbounded id space, server-rendered per request
  '/raportti', // noindex customer app, needs a key
  '/testi', // redirect to /raportti
  '/kassa/', // Stripe return pages, noindex
]

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: CRAWL_TRAPS }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
