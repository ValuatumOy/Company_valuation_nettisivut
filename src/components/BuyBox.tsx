'use client'

import { useState, type FormEvent } from 'react'
import { eur, quote } from '@/lib/pricing'
import { companyDisplayName } from '@/lib/companies'

type Props = {
  companyId: string
  /** Raw Valuatum values — forwarded to checkout, never reformatted here. */
  companyName: string
  businessId: string
  /** Valuatum followed model id — pins emo vs konserni for the paid run. */
  fid?: number
  /** Konserni row: shown in the title so the buyer knows which model they get. */
  isGroup?: boolean
}

// Every company reachable through search comes from Valuatum's own data, which
// is what "we hold the financials" means — so 'existing' is the only kind the
// site can sell. The user-uploads-statements and we-fetch-them flows were never
// built end-to-end; the pricing/checkout plumbing for them still exists so that
// any Stripe session already in flight resolves, but nothing offers them.
export function BuyBox({
  companyId,
  companyName,
  businessId,
  fid,
  isGroup = false,
}: Props) {
  const [email, setEmail] = useState('')
  const [userInput, setUserInput] = useState('')
  // Opt-in (default off): review/edit forecasts before the report is generated.
  const [wantForecast, setWantForecast] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const { total } = quote('existing', false)

  async function checkout(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          kind: 'existing',
          companyId,
          companyName,
          businessId,
          fid,
          customerEmail: email,
          userInput: userInput.trim() || undefined,
          wantForecast,
        }),
      })
      const data = (await res.json()) as { url?: string; error?: string }
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Maksun käynnistäminen epäonnistui. Yritä uudelleen.')
        setLoading(false)
      }
    } catch {
      setError('Verkkovirhe. Yritä uudelleen.')
      setLoading(false)
    }
  }

  return (
    <aside className="rounded-2xl border border-mist bg-white">
      <div className="border-b border-mist p-6 text-charcoal">
        <h2 className="text-xl font-medium tracking-[-0.02em]">AI-arvonmääritysraportti</h2>
        <p className="mt-2 break-words text-sm leading-relaxed text-charcoal-mid">
          {companyDisplayName({ name: companyName, isGroup })}
        </p>
        <p className="mt-5 text-4xl font-medium leading-none tracking-[-0.02em] tabular-nums">{eur(total)}</p>
        <p className="mt-3 text-xs leading-relaxed text-charcoal-mid">Kertamaksu per raportti, ei tilausta. Hinta sisältää alv:n 25,5 %.</p>
      </div>

      <form onSubmit={checkout} className="p-6">
        <p className="text-sm leading-relaxed text-charcoal-mid">
          Tilinpäätöstiedot yritykselle {companyName} ovat jo hallussamme. Raportti
          laaditaan automaattisesti maksun jälkeen. Jos valitset ennusteiden tarkistuksen,
          käynnistät raportin itse ennustenäkymästä. Raportti valmistuu tyypillisesti 10–20
          minuutissa käynnistämisestä.
        </p>

        <label className="mt-5 block">
          <span className="text-[13px] font-medium text-charcoal">
            Sähköposti raportin toimitusta varten
          </span>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="nimi@yritys.fi"
            autoComplete="email"
            className="mt-2 w-full rounded-lg border border-mist bg-white px-3 py-3 text-sm text-charcoal caret-green-deep outline-none transition-colors placeholder:text-charcoal-mid focus:border-green-deep focus:ring-1 focus:ring-green-deep"
          />
        </label>

        <label className="mt-4 block">
          <span className="text-[13px] font-medium text-charcoal">
            Lisätiedot tekoälylle (valinnainen)
          </span>
          <textarea
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={3}
            maxLength={4000}
            placeholder="Tietoja joita tekoäly ei löydä itse julkisista lähteistä — esim. ajankohtainen konteksti, omat oletukset…"
            className="mt-2 w-full resize-y rounded-lg border border-mist bg-white px-3 py-3 text-sm text-charcoal caret-green-deep outline-none transition-colors placeholder:text-charcoal-mid focus:border-green-deep focus:ring-1 focus:ring-green-deep"
          />
        </label>

        <label className="mt-5 flex cursor-pointer items-start gap-3 border-t border-mist pt-5">
          <input
            type="checkbox"
            checked={wantForecast}
            onChange={(e) => setWantForecast(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-green-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep"
          />
          <span className="text-[13px] leading-relaxed text-charcoal-mid">
            <span className="font-medium text-charcoal">
              Haluan tarkistaa ennusteet ennen raporttia
            </span>
            <br />
            Maksun jälkeen näet liikevaihto- ja EBIT-ennusteet ja voit muokata niitä
            omilla näkemyksilläsi. Paina ennustenäkymässä <strong className="font-medium">Luo raportti</strong>
            {' '}myös silloin, kun jätät luvut ennalleen. Jätä valinta tyhjäksi,
            niin raportti syntyy suoraan meidän ennusteillamme.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 w-full rounded-xl bg-green-deep px-5 py-3.5 text-[14.5px] font-medium text-white transition-colors hover:bg-forest active:bg-forest focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? 'Siirrytään maksuun…' : `Siirry maksamaan — ${eur(total)}`}
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-charcoal-mid">
          <LockIcon /> Turvallinen maksu Stripen kautta. Ei vaadi käyttäjätiliä.
        </p>
        <p className="mt-4 border-t border-mist pt-4 text-xs leading-relaxed text-charcoal-mid">
          Raportti on analyysi päätöksenteon tueksi. Se ei ole tilintarkastus, fairness opinion
          eikä sijoitusneuvontaa.
        </p>
      </form>
    </aside>
  )
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden className="mt-0.5 shrink-0">
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
