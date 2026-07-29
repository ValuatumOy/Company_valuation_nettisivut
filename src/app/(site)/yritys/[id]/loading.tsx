// Without this, a click from the search dropdown left the visitor on the
// previous page with no feedback for the whole company lookup (~1.4 s, most of
// it Valuatum's /company query). This shell paints instantly instead, and it is
// also what <Link> prefetches on viewport — the full page+data prefetch only
// happens on hover, so opening a dropdown doesn't fan out one backend query per
// result row.
export default function Loading() {
  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="hero-pattern absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-40">
          <span className="text-sm text-white/50">← Takaisin hakuun</span>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <div className="h-11 w-80 max-w-full animate-pulse rounded-lg bg-white/10 lg:h-12" />
            <div className="h-8 w-52 animate-pulse rounded-full bg-white/[0.07]" />
          </div>
          <div className="mt-5 h-4 w-64 max-w-full animate-pulse rounded bg-white/10" />
        </div>
      </section>

      <section className="bg-off-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_400px] lg:px-10">
          <div>
            <div className="grid gap-px overflow-hidden rounded-3xl border border-mist bg-mist sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="bg-white p-5">
                  <div className="h-3 w-16 animate-pulse rounded bg-mist" />
                  <div className="mt-3 h-4 w-24 animate-pulse rounded bg-mist" />
                </div>
              ))}
            </div>

            <div className="mt-8 rounded-3xl border border-mist bg-white p-8">
              <div className="h-3 w-32 animate-pulse rounded bg-green-mist" />
              <div className="mt-4 h-8 w-72 max-w-full animate-pulse rounded bg-mist" />
              <div className="mt-5 h-4 w-full max-w-2xl animate-pulse rounded bg-mist" />
              <div className="mt-2 h-4 w-4/5 max-w-xl animate-pulse rounded bg-mist" />
              <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                {Array.from({ length: 8 }).map((_, i) => (
                  <li
                    key={i}
                    className="flex gap-3 rounded-2xl border border-mist bg-off-white px-4 py-3"
                  >
                    <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-mist" />
                    <span className="h-4 flex-1 animate-pulse rounded bg-mist" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="overflow-hidden rounded-3xl border border-mist bg-white shadow-[0_20px_60px_rgba(26,36,32,0.1)] lg:sticky lg:top-28 lg:self-start">
            <div className="bg-forest p-6">
              <div className="h-3 w-40 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-7 w-56 max-w-full animate-pulse rounded bg-white/10" />
              <div className="mt-5 h-10 w-32 animate-pulse rounded bg-white/10" />
              <div className="mt-3 h-3 w-52 max-w-full animate-pulse rounded bg-white/[0.07]" />
            </div>
            <div className="p-6">
              <div className="h-4 w-full animate-pulse rounded bg-mist" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-mist" />
              <div className="mt-6 h-3 w-56 max-w-full animate-pulse rounded bg-mist" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-xl bg-off-white" />
              <div className="mt-5 h-3 w-48 animate-pulse rounded bg-mist" />
              <div className="mt-2 h-20 w-full animate-pulse rounded-xl bg-off-white" />
              <div className="mt-5 h-12 w-full animate-pulse rounded-full bg-mist" />
              <div className="mt-4 h-3 w-64 max-w-full animate-pulse rounded bg-mist" />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
