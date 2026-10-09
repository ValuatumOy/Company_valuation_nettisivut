'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import { companyDisplayName, matchCompany, type Company } from '@/lib/companies'
import { BuyBox } from '@/components/BuyBox'
import { OrderProcess } from '@/components/OrderProcess'
import { Reveal } from '@/components/Reveal'

// This page used to be server-rendered per company id, which is what blew
// through the Vercel allowance twice: `/yritys/:id` is an unbounded URL space
// (every y-tunnus in the Finnish register resolves), so a scraper walking that
// space turned every id into one function invocation plus a ~1.4 s Valuatum
// lookup. Live production logs on 2026-08-19 showed exactly that still
// happening at ~30 ids/minute — 88 % of all traffic — despite robots.txt
// disallowing `/yritys/`, because the crawler simply ignores robots.txt.
//
// robots.txt is advice; this is enforcement. `/yritys/:id` is now rewritten to
// one prerendered shell (see next.config.ts), so every id in the universe is
// served the same static file from the CDN at zero compute. The company data
// is fetched here, client-side, from the already CDN-cached `/api/search` — so
// a crawler that doesn't run JS costs nothing at all, and a real visitor pays
// the same single lookup they always did.
//
// Nothing is lost by not rendering this on the server: the page is noindex and
// robots-disallowed, so it never ranked and never will. It exists purely as a
// step in the buy funnel.

// Mirrors the section list of the actual delivered report — see the sample PDF
// at /samples/heeros-oyj.pdf before changing this.
const FEATURES = [
  'Tiivistelmä, avainluvut ja luottamustaso',
  'Datan laatuluokka, lähteet ja rajoitteet',
  'Liiketoimintaprofiili, markkina ja kilpailijat',
  'Markkinasignaalit ja strateginen arvo',
  'Historiallinen kehitys ja henkilöstötehokkuus',
  '10 vuoden ennuste ja arvio sen uskottavuudesta',
  'Menetelmien pisteytys: hyväksytyt ja hylätyt',
  'DCF-laskelma ja WACC-parametrit',
  'EVA-täsmäytys ja Verohallinnon mallin ristiintarkistus',
  'Herkkyysanalyysi ja skenaariot todennäköisyyksineen',
  'Riskit, arvon ajurit ja mikä liikuttaisi arviota',
  'Tilinpäätöstaulukot, lähderekisteri ja metodologia',
]

type State =
  | { status: 'loading' }
  | { status: 'found'; company: Company }
  | { status: 'missing' }
  | { status: 'error' }

export function CompanyDetail() {
  // The URL still reads `/yritys/26466749K`; the rewrite is invisible to the
  // browser, so the id is simply the last path segment.
  const pathname = usePathname()
  const id = decodeURIComponent(pathname.split('/').filter(Boolean).pop() ?? '')
  const valid = Boolean(id) && id !== 'yritys'

  // Keyed by the id it belongs to rather than reset in an effect: navigating
  // from one company page to another keeps this component mounted, and a stale
  // result must read as `loading` on the first render after the id changes.
  const [result, setResult] = useState<{ id: string; state: State } | null>(null)
  const state: State = result?.id === id ? result.state : { status: 'loading' }

  useEffect(() => {
    if (!valid) return
    let cancelled = false
    const run = async () => {
      try {
        const res = await fetch(`/api/search?q=${encodeURIComponent(id)}&limit=5`)
        const data = (await res.json()) as { companies?: Company[] }
        if (cancelled) return
        const requestedFid = new URLSearchParams(window.location.search).get('fid')
        const fid = requestedFid === null ? undefined : Number(requestedFid)
        const company = fid !== undefined && (!Number.isSafeInteger(fid) || fid <= 0)
          ? null
          : matchCompany(data.companies ?? [], id, fid)
        setResult({
          id,
          state: company ? { status: 'found', company } : { status: 'missing' },
        })
      } catch {
        if (!cancelled) setResult({ id, state: { status: 'error' } })
      }
    }
    run()
    return () => {
      cancelled = true
    }
  }, [id, valid])

  // No server render means no generateMetadata — set the title here so the tab
  // and any shared link still name the company. The page is noindex either way.
  const title =
    state.status === 'found'
      ? `${companyDisplayName(state.company)} — yrityksen arvonmääritys | Valuatum`
      : 'Yrityksen arvonmääritys | Valuatum'
  useEffect(() => {
    document.title = title
  }, [title])

  if (!valid) return <NotFound reason="missing" />
  if (state.status === 'loading') return <CompanySkeleton />
  if (state.status !== 'found') return <NotFound reason={state.status} />

  const company = state.company

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-40">
          <Link
            href="/yritys"
            className="text-sm text-white/80 underline-offset-4 transition-colors hover:text-white hover:underline"
          >
            ← Takaisin hakuun
          </Link>
          <div className="mt-6">
            <h1 className="break-words text-balance text-4xl font-medium leading-[1.1] tracking-[-0.02em] lg:text-5xl">
              {companyDisplayName(company)}
            </h1>
            {company.hasFinancials && (
              <p className="mt-4 text-sm text-green-light">
                Tilinpäätöstiedot valmiina
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="bg-white py-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:px-10">
          <div className="min-w-0">
            <Reveal>
              <dl className="grid gap-5 sm:grid-cols-[1fr_1fr_2fr]">
                <Fact label="Y-tunnus" value={company.businessIdFormatted} />
                <Fact label="Kotipaikka" value={company.city || '–'} />
                <Fact label="Toimiala" value={company.industry || '–'} />
              </dl>
            </Reveal>

            <Reveal delay={100}>
              <OrderProcess />
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-10 border-t border-mist pt-8">
                <h2 className="text-2xl font-medium tracking-[-0.02em] text-charcoal sm:text-3xl">
                  Mitä raportti sisältää
                </h2>
                <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-charcoal-mid">
                  Jäsennelty PDF-muotoinen arvonmääritysraportti yrityksestä {company.name} —
                  perusteltu analyysi, ei pelkkä tunnuslukukooste.
                </p>
                <ul className="mt-5 grid gap-x-6 border-t border-mist sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <li
                      key={f}
                      className="border-b border-mist py-3 text-sm leading-relaxed text-charcoal"
                    >
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/samples/heeros-oyj.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-green-deep underline-offset-4 transition-colors hover:text-forest hover:underline"
                >
                  Avaa esimerkkiraportti: Heeros Oyj →
                </a>
                <p className="mt-4 text-[13px] leading-relaxed text-charcoal-mid">
                  Raportti on analyysi päätöksenteon tueksi. Se ei ole tilintarkastus, fairness
                  opinion eikä sijoitusneuvontaa.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={200} className="lg:sticky lg:top-28 lg:self-start">
            <BuyBox
              companyId={company.id}
              // Name and businessId stay raw here — they are forwarded to
              // checkout and on to the backend. fid rides along and is what
              // actually decides konserni vs emo there (the backend's own
              // lookup drops the K suffix). isGroup only drives the label.
              companyName={company.name}
              businessId={company.businessId}
              fid={company.fid}
              isGroup={company.isGroup}
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs text-charcoal-mid">{label}</dt>
      <dd className="mt-1 break-words text-sm font-medium text-charcoal">{value}</dd>
    </div>
  )
}

function NotFound({ reason }: { reason: 'missing' | 'error' }) {
  return (
    <section className="relative overflow-hidden bg-forest text-white">
      <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-40 lg:px-10">
        <h1 className="text-4xl font-medium tracking-[-0.02em] lg:text-5xl">
          {reason === 'error' ? 'Haku ei ole juuri nyt käytettävissä' : 'Yritystä ei löytynyt'}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] text-white/80">
          {reason === 'error'
            ? 'Yritä hetken kuluttua uudelleen, tai etsi yritys haun kautta.'
            : 'Tarkista y-tunnus tai etsi yritys nimellä.'}
        </p>
        <Link
          href="/yritys"
          className="mt-8 inline-flex rounded-xl bg-white px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-white/90"
        >
          Siirry hakuun
        </Link>
      </div>
    </section>
  )
}

// Painted while the client-side lookup runs (~1.4 s, most of it Valuatum's
// /company query). This was `loading.tsx` back when the page was server-rendered.
function CompanySkeleton() {
  return (
    <>
      <section className="bg-forest text-white">
        <div className="mx-auto max-w-7xl px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-40">
          <span className="text-sm text-white/80">← Takaisin hakuun</span>
          <div className="mt-6 h-11 w-80 max-w-full animate-pulse rounded-lg bg-white/10 motion-reduce:animate-none lg:h-12" />
          <div className="mt-4 h-4 w-52 max-w-full animate-pulse rounded bg-white/10 motion-reduce:animate-none" />
        </div>
      </section>

      <section className="bg-white py-10 lg:py-16">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-14 lg:px-10">
          <div className="min-w-0">
            <div className="grid gap-5 sm:grid-cols-[1fr_1fr_2fr]">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i}>
                  <div className="h-3 w-16 animate-pulse rounded bg-mist motion-reduce:animate-none" />
                  <div className="mt-2 h-4 w-24 animate-pulse rounded bg-mist motion-reduce:animate-none" />
                </div>
              ))}
            </div>

            <div className="mt-10 border-t border-mist pt-8">
              <div className="h-8 w-72 max-w-full animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-4 h-4 w-full max-w-2xl animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <ul className="mt-6 divide-y divide-mist border-y border-mist">
                {Array.from({ length: 3 }).map((_, i) => (
                  <li key={i} className="py-5">
                    <div className="h-4 w-48 max-w-full animate-pulse rounded bg-mist motion-reduce:animate-none" />
                    <div className="mt-3 h-4 w-full animate-pulse rounded bg-mist motion-reduce:animate-none" />
                    <div className="mt-2 h-4 w-4/5 animate-pulse rounded bg-mist motion-reduce:animate-none" />
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <aside className="rounded-2xl border border-mist bg-white lg:sticky lg:top-28 lg:self-start">
            <div className="border-b border-mist p-6">
              <div className="h-6 w-56 max-w-full animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-3 h-4 w-40 animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-5 h-10 w-32 animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-3 h-3 w-full animate-pulse rounded bg-mist motion-reduce:animate-none" />
            </div>
            <div className="p-6">
              <div className="h-4 w-full animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-6 h-3 w-56 max-w-full animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-2 h-12 w-full animate-pulse rounded-lg bg-off-white motion-reduce:animate-none" />
              <div className="mt-5 h-3 w-48 animate-pulse rounded bg-mist motion-reduce:animate-none" />
              <div className="mt-2 h-20 w-full animate-pulse rounded-lg bg-off-white motion-reduce:animate-none" />
              <div className="mt-5 h-12 w-full animate-pulse rounded-xl bg-mist motion-reduce:animate-none" />
            </div>
          </aside>
        </div>
      </section>
    </>
  )
}
