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
        const company = matchCompany(data.companies ?? [], id)
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
        <div className="hero-pattern absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-40">
          <Link
            href="/yritys"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            ← Takaisin hakuun
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <h1 className="text-balance text-4xl font-light leading-[1.1] tracking-[-0.02em] lg:text-5xl">
              {companyDisplayName(company)}
            </h1>
            {company.hasFinancials && (
              <span className="rounded-full border border-green-light/30 bg-green/15 px-3.5 py-1.5 text-[12.5px] font-medium text-green-light">
                Tilinpäätöstiedot valmiina
              </span>
            )}
          </div>
          <p className="mt-4 text-[15px] font-light text-white/60">
            {[`Y-tunnus ${company.businessIdFormatted}`, company.city, company.industry]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_400px] lg:px-10">
          <div>
            <Reveal>
              <dl className="grid gap-px overflow-hidden rounded-3xl border border-mist bg-mist sm:grid-cols-3">
                <Fact label="Y-tunnus" value={company.businessIdFormatted} />
                <Fact label="Kotipaikka" value={company.city || '–'} />
                <Fact label="Toimiala" value={company.industry || '–'} />
              </dl>
            </Reveal>

            <Reveal delay={100}>
              <OrderProcess />
            </Reveal>

            <Reveal delay={150}>
              <div className="mt-8 rounded-3xl border border-mist bg-white p-8">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
                  Raportin sisältö
                </p>
                <h2 className="mt-3 text-3xl font-light tracking-[-0.02em] text-charcoal">
                  Mitä raportti sisältää
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] font-light leading-relaxed text-charcoal-mid">
                  Jäsennelty PDF-muotoinen arvonmääritysraportti yrityksestä {company.name} —
                  perusteltu analyysi, ei pelkkä tunnuslukukooste.
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <li
                      key={f}
                      className="flex gap-3 rounded-2xl border border-mist bg-off-white px-4 py-3 text-sm text-charcoal"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <a
                  href="/samples/heeros-oyj.pdf"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex items-center text-sm font-medium text-green-deep transition-colors hover:text-green"
                >
                  Avaa esimerkkiraportti: Heeros Oyj →
                </a>
                <p className="mt-7 border-t border-mist pt-4 text-[13px] leading-relaxed text-steel">
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
    <div className="bg-white p-5">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-steel">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-charcoal">{value}</dd>
    </div>
  )
}

function NotFound({ reason }: { reason: 'missing' | 'error' }) {
  return (
    <section className="relative overflow-hidden bg-forest text-white">
      <div className="hero-pattern absolute inset-0" />
      <div className="relative mx-auto max-w-7xl px-6 pb-32 pt-40 lg:px-10">
        <h1 className="text-4xl font-light tracking-[-0.02em] lg:text-5xl">
          {reason === 'error' ? 'Haku ei ole juuri nyt käytettävissä' : 'Yritystä ei löytynyt'}
        </h1>
        <p className="mt-4 max-w-xl text-[15px] font-light text-white/60">
          {reason === 'error'
            ? 'Yritä hetken kuluttua uudelleen, tai etsi yritys haun kautta.'
            : 'Tarkista y-tunnus tai etsi yritys nimellä.'}
        </p>
        <Link
          href="/yritys"
          className="mt-8 inline-flex rounded-full bg-white px-6 py-3 text-sm font-medium text-forest transition-colors hover:bg-white/90"
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
