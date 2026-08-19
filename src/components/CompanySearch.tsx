'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { companyDisplayName, MIN_QUERY_LENGTH, type Company } from '@/lib/companies'

type Props = {
  variant?: 'dark' | 'light'
  autoFocus?: boolean
}

export function CompanySearch({ variant = 'dark', autoFocus = false }: Props) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Company[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [searched, setSearched] = useState(false)
  const boxRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const dark = variant === 'dark'

  useEffect(() => {
    const q = query.trim()
    // 3, not 2: Valuatum's /company rejects shorter queries outright
    // ("The search parameter name must contain at least 3 characters"), so a
    // 2-char query only bought a guaranteed round trip to an error.
    if (q.length < MIN_QUERY_LENGTH) {
      setResults([])
      setSearched(false)
      return
    }

    setLoading(true)
    const t = setTimeout(async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`)
        const data = (await res.json()) as { companies: Company[] }
        setResults(data.companies ?? [])
        setSearched(true)
        setOpen(true)
      } catch {
        setResults([])
      } finally {
        setLoading(false)
      }
    }, 220)

    return () => clearTimeout(t)
  }, [query])

  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (boxRef.current && !boxRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [])

  function submitSearch() {
    if (results[0]) {
      router.push(`/yritys/${results[0].id}`)
    }
  }

  return (
    <div ref={boxRef} className="relative">
      <div
        className={`flex min-h-16 items-center gap-3 rounded-2xl border px-4 py-2 transition-colors ${
          dark
            ? 'border-white/15 bg-white/10 shadow-[0_16px_48px_rgba(0,0,0,0.25)] backdrop-blur-md focus-within:border-green-light/60 focus-within:bg-white/15'
            : 'border-mist bg-white shadow-[0_8px_32px_rgba(26,36,32,0.06)] focus-within:border-green'
        }`}
      >
        <SearchIcon className={dark ? 'text-white/50' : 'text-steel'} />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => results.length && setOpen(true)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') submitSearch()
          }}
          placeholder="Hae yritystä nimellä tai Y-tunnuksella…"
          aria-label="Hae yrityksiä"
          className={`min-w-0 flex-1 bg-transparent py-2.5 text-[15px] font-light outline-none ${
            dark ? 'text-white placeholder:text-white/40' : 'text-charcoal placeholder:text-steel'
          }`}
        />
        {loading ? (
          <Spinner className={dark ? 'text-green-light' : 'text-green'} />
        ) : (
          <button
            type="button"
            onClick={submitSearch}
            className="hidden rounded-full bg-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-deep sm:inline-flex"
          >
            Hae
          </button>
        )}
      </div>

      {open && (
        <div className="absolute z-40 mt-2 w-full overflow-hidden rounded-2xl border border-mist bg-white text-charcoal shadow-[0_24px_64px_rgba(26,36,32,0.18)]">
          {results.length > 0 ? (
            <ul className="max-h-96 overflow-auto py-1">
              {results.map((c) => (
                <li key={c.id}>
                  <Link
                    href={`/yritys/${c.id}`}
                    // Never prefetch. There is nothing left to prefetch: the
                    // target is one static shell the CDN already serves
                    // instantly, and the company data is fetched client-side
                    // after mount. The old hover-to-prefetch dance existed only
                    // because this route used to be a ~1.4 s server render.
                    //
                    // It also actively hurt: the WAF rule that challenges
                    // /yritys/ (the id-walk mitigation) challenges the RSC
                    // prefetch too, so every hover produced a failed 429 in the
                    // console before the real navigation went through anyway.
                    prefetch={false}
                    className="flex w-full items-center justify-between gap-4 border-b border-mist/70 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-green-faint"
                  >
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium text-charcoal">
                        {companyDisplayName(c)}
                      </span>
                      <span className="block truncate text-xs text-steel">
                        {/* Live rows carry no city, so filter rather than
                            rendering a stray " ·  · " separator. */}
                        {[c.businessIdFormatted, c.city, c.industry]
                          .filter(Boolean)
                          .join(' · ')}
                      </span>
                    </span>
                    {c.hasFinancials && (
                      <span className="shrink-0 rounded-full bg-green-mist px-2.5 py-1 text-[11px] font-medium text-green-deep">
                        Tiedot valmiina
                      </span>
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            searched &&
            !loading && (
              <div className="px-5 py-5">
                <p className="text-sm font-medium text-charcoal">
                  Yritystä ”{query}” ei löytynyt hakemistostamme.
                </p>
                <p className="mt-1.5 text-sm font-light leading-relaxed text-charcoal-mid">
                  Kokeile Y-tunnusta tai yhtiön virallista nimeä. Jos yhtiötä ei löydy
                  vieläkään, ota yhteyttä — tarkistamme onko sille saatavilla
                  tilinpäätösaineistoa.
                </p>
                <a
                  href="mailto:company-valuation@valuatum.com"
                  className="mt-4 inline-block rounded-full bg-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-deep"
                >
                  Ota yhteyttä
                </a>
              </div>
            )
          )}
        </div>
      )}
    </div>
  )
}

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className={`shrink-0 ${className ?? ''}`} aria-hidden>
      <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.7" />
      <path d="m20 20-3-3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function Spinner({ className }: { className?: string }) {
  return (
    <svg className={`h-5 w-5 shrink-0 animate-spin ${className ?? ''}`} viewBox="0 0 24 24" aria-hidden>
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
      <path className="opacity-90" fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
    </svg>
  )
}
