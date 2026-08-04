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
    <aside className="overflow-hidden rounded-3xl border border-mist bg-white shadow-[0_20px_60px_rgba(26,36,32,0.1)]">
      <div className="bg-forest p-6 text-white">
        <p className="text-[12.5px] font-medium text-green-light">AI-arvonmääritysraportti</p>
        <h2 className="mt-1 text-2xl font-light tracking-tight">
          {companyDisplayName({ name: companyName, isGroup })}
        </h2>
        <div className="mt-4 flex items-end gap-2">
          <span className="text-[2.6rem] font-light leading-none tracking-tight">{eur(total)}</span>
        </div>
        <p className="mt-2 text-xs text-white/50">Kertamaksu per raportti, ei tilausta. Hintoihin lisätään alv.</p>
      </div>

      <form onSubmit={checkout} className="p-6">
        <p className="text-sm font-light leading-relaxed text-charcoal-mid">
          Tilinpäätöstiedot yritykselle {companyName} ovat jo hallussamme. Raportti
          laaditaan automaattisesti maksun jälkeen ja valmistuu tyypillisesti 10–20
          minuutissa.
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
            className="mt-1.5 w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-steel focus:border-green"
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
            className="mt-1.5 w-full rounded-xl border border-mist bg-white px-4 py-3 text-sm text-charcoal outline-none transition-colors placeholder:text-steel focus:border-green"
          />
        </label>

        <label className="mt-4 flex cursor-pointer items-start gap-2.5 rounded-xl border border-mist bg-off-white px-3.5 py-3">
          <input
            type="checkbox"
            checked={wantForecast}
            onChange={(e) => setWantForecast(e.target.checked)}
            className="mt-0.5 h-4 w-4 shrink-0 accent-green"
          />
          <span className="text-[13px] leading-relaxed text-charcoal-mid">
            <span className="font-medium text-charcoal">
              Haluan tarkistaa ennusteet ennen raporttia
            </span>
            <br />
            Maksun jälkeen näet liikevaihto- ja EBIT-ennusteet ja voit muokata niitä
            omilla näkemyksilläsi. Raportti luodaan vasta kun vahvistat ne. Jätä tyhjäksi,
            niin raportti syntyy suoraan meidän ennusteillamme.
          </span>
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-full bg-green px-5 py-3 text-[14.5px] font-medium text-white transition-colors hover:bg-green-deep disabled:pointer-events-none disabled:opacity-60"
        >
          {loading ? 'Siirrytään maksuun…' : `Siirry maksamaan — ${eur(total)}`}
        </button>

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <p className="mt-4 flex items-center justify-center gap-1.5 text-xs text-steel">
          <LockIcon /> Turvallinen maksu Stripen kautta. Ei vaadi käyttäjätiliä.
        </p>
        <p className="mt-3 border-t border-mist pt-3 text-center text-[11.5px] leading-relaxed text-steel">
          Raportti on analyysi päätöksenteon tueksi. Se ei ole tilintarkastus, fairness opinion
          eikä sijoitusneuvontaa.
        </p>
      </form>
    </aside>
  )
}

function LockIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
      <rect x="4" y="10" width="16" height="11" rx="2" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="2" />
    </svg>
  )
}
