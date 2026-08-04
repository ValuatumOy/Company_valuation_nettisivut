import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { ReportApp } from '@/report/ReportApp'
import { MOCK_STATES, type MockState, mockSeed } from '@/report/mockRun'

export const metadata: Metadata = {
  title: 'Raportti — mock',
  robots: { index: false, follow: false },
}

// Design harness for the screens that normally require a real 10-20 min run.
// 404s outside `next dev` so it can never be reached in production.
export default async function MockPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>
}) {
  if (process.env.NODE_ENV === 'production') notFound()
  const sp = await searchParams
  const raw = typeof sp.state === 'string' ? sp.state : 'report'
  const state = (MOCK_STATES.some((s) => s.id === raw) ? raw : 'report') as MockState

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 border-b border-dashed border-amber-400 bg-amber-100 px-4 py-2 text-xs">
        <span className="font-semibold text-amber-900">MOCK</span>
        {MOCK_STATES.map((s) => (
          <a
            key={s.id}
            href={`/raportti/mock?state=${s.id}`}
            className={`rounded px-2 py-1 ${
              s.id === state ? 'bg-amber-700 text-white' : 'bg-white text-amber-900 hover:bg-amber-50'
            }`}
          >
            {s.label}
          </a>
        ))}
      </div>
      <ReportApp entry="manual" mock={mockSeed(state)} />
    </>
  )
}
