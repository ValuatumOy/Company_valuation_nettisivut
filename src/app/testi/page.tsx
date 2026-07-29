import { redirect } from 'next/navigation'

// Legacy path. Report links are permanent — they sit in customers' inboxes
// (email_delivery.py) and in Stripe round-2 redirect URLs — so /testi keeps
// working forever and just forwards to the canonical /raportti, query intact.
// Removing this route breaks every link already sent.
export const dynamic = 'force-dynamic'

type Search = Record<string, string | string[] | undefined>

export default async function TestiPage({
  searchParams,
}: {
  searchParams: Promise<Search>
}) {
  const sp = await searchParams
  const qs = new URLSearchParams()
  for (const [k, v] of Object.entries(sp)) {
    if (typeof v === 'string') qs.set(k, v)
    else if (Array.isArray(v)) v.forEach((one) => qs.append(k, one))
  }
  const query = qs.toString()
  redirect(query ? `/raportti?${query}` : '/raportti')
}
