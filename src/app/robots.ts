import type { MetadataRoute } from 'next'
import { SITE_URL } from '@/lib/site'

// One allow-all rule covers Google + AI crawlers (GPTBot, ClaudeBot,
// PerplexityBot, Google-Extended) — being citable by AI assistants is a goal.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: '*', allow: '/', disallow: ['/api/'] }],
    sitemap: `${SITE_URL}/sitemap.xml`,
  }
}
