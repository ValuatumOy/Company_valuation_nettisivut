import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // `/yritys/:id` is an unbounded URL space — every y-tunnus in the Finnish
  // register resolves to a page — and a scraper that ignores robots.txt was
  // walking it at ~30 ids/minute, turning each id into a server render plus a
  // ~1.4 s Valuatum lookup. That is what exhausted the Vercel allowance (twice:
  // once before the ISR fix, and again after it, because ISR caches per path
  // and every path in that walk is a fresh one).
  //
  // beforeFiles, so it wins over the filesystem route it replaced: every id now
  // serves the one prerendered `/yritys/detail` shell straight from the CDN,
  // and the company lookup happens client-side against the cached /api/search.
  // Unlimited ids, zero compute. The browser URL is untouched, so links people
  // already have keep working and the id is still readable from the path.
  async rewrites() {
    return {
      beforeFiles: [{ source: '/yritys/:id', destination: '/yritys/detail' }],
      afterFiles: [],
      fallback: [],
    }
  },
}

export default nextConfig
