import type { Metadata } from 'next'
import { ReportApp, type Entry } from '@/report/ReportApp'

export const metadata: Metadata = {
  title: 'Arvonmääritysraportti | Valuatum',
  robots: { index: false, follow: false },
}

type Search = Record<string, string | string[] | undefined>

export default async function RaporttiPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const has = (k: string) => typeof sp[k] === 'string' && sp[k] !== ''
  // A buyer always arrives on a key+rid link (from checkout, the delivery email,
  // or a paid round-2 return). Anything else is someone signing in with a key.
  const entry: Entry = has('key') && has('rid') ? 'link' : 'manual'
  return <ReportApp entry={entry} />
}
