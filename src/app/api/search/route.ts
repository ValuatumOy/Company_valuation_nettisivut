import { NextResponse } from 'next/server'
import { MIN_QUERY_LENGTH, searchCompanies } from '@/lib/companies'

// Search-as-you-type means every visitor types the same prefixes ("kes", "kesk",
// "keskise"…) and the ~1.4 s Valuatum lookup behind each one costs a function
// invocation. Let the CDN answer repeats: the upstream fetch is already
// revalidate-300 inside the process, this extends the same 5 minutes to the edge
// so a repeat query never wakes a function at all.
const CACHE = 'public, s-maxage=300, stale-while-revalidate=3600'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const q = searchParams.get('q') ?? ''
  const limit = Math.min(Math.max(Number(searchParams.get('limit')) || 8, 1), 20)

  if (q.trim().length < MIN_QUERY_LENGTH) {
    return NextResponse.json({ companies: [] }, { headers: { 'Cache-Control': CACHE } })
  }

  try {
    const companies = await searchCompanies(q, limit)
    return NextResponse.json({ companies }, { headers: { 'Cache-Control': CACHE } })
  } catch (err) {
    console.error('search failed', err)
    return NextResponse.json(
      { companies: [], error: 'Haku ei ole juuri nyt käytettävissä' },
      { status: 502 }
    )
  }
}
