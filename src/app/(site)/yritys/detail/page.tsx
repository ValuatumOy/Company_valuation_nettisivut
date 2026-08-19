import type { Metadata } from 'next'
import { CompanyDetail } from '@/components/CompanyDetail'

// The single prerendered shell behind every `/yritys/:id` URL. The rewrite that
// points them all here lives in next.config.ts; the reasoning is in
// CompanyDetail.tsx. Nothing on this page depends on the id at build time, so
// it comes out `○ (Static)` — one file on the CDN, zero functions, no matter
// how many company ids a crawler invents.
export const dynamic = 'force-static'

// noindex for the same reason it always was: one template with three facts
// swapped is not a page that ranks, and `/yritys` (the indexed search page) is
// the entry point we actually want. robots.txt disallows `/yritys/` on top.
export const metadata: Metadata = {
  title: 'Yrityksen arvonmääritys | Valuatum',
  robots: { index: false, follow: true },
}

export default function Page() {
  return <CompanyDetail />
}
