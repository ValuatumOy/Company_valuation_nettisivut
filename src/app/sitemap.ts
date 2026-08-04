import type { MetadataRoute } from 'next'
import { blogPosts } from '@/content/blog'
import { SITE_URL } from '@/lib/site'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/yrityskauppa`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/sukupolvenvaihdos`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/yritys`, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${SITE_URL}/laskuri`, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${SITE_URL}/kertoimet`, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE_URL}/blogi`, changeFrequency: 'weekly', priority: 0.6 },
    ...blogPosts.map((p) => ({
      url: `${SITE_URL}/blogi/${p.slug}`,
      lastModified: new Date(p.date),
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    })),
    { url: `${SITE_URL}/tietosuoja`, changeFrequency: 'yearly' as const, priority: 0.3 },
  ]
}
