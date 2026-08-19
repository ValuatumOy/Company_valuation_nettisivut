import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// One allow-all rule covers Google + AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) — being citable by AI assistants is a goal.
// That goal is about the content pages; it is NOT about `/yritys/*`.
//
// `/yritys/:id` is an unbounded URL space: any y-tunnus (real or invented)
// resolves to a page, and crawlers walk it. Two 30-day windows of the Vercel
// allowance went that way before the page stopped being server-rendered at all
// (it is now one static shell — see next.config.ts and CompanyDetail.tsx).
//
// Keep the Disallow anyway. It costs nothing, it keeps the polite crawlers off
// a page that is noindex regardless, and the pages are thin and duplicative
// (same template, three facts swapped) — nothing of SEO value is lost here.
// Just don't rely on it: the crawler that emptied the allowance the second
// time ignored this file completely.
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
