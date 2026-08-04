'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  type ClarificationRequest,
  type CompanyCandidate,
  type ExpertMe,
  type ForecastEdit,
  type ForecastPreview,
  Round2CapReachedError,
  forecastPreview,
  generate,
  generateForecast,
  getRun,
  reportHtml,
  reportPdf,
  round2,
  round2Checkout,
  round2Redeem,
  searchCompany,
  validateKey,
} from './reportApi'
import { type MockSeed, mockForecastPreview } from './mockRun'

const KEY_STORAGE = 'valu_expert_key'
const TERMINAL = ['ok', 'validation_failed', 'error']
const SUPPORT_EMAIL = 'company-valuation@valuatum.com'

// One vocabulary for the whole app, borrowed from the marketing site's design
// system (DESIGN.md): Inter, pill CTAs, rounded-3xl cards on mist borders,
// green as the only accent. Defined once so the same control never renders two
// different ways on two screens.
const CARD = 'rounded-3xl border border-mist bg-white'
const EYEBROW = 'text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep'
const TITLE = 'text-[22px] font-light tracking-tight text-charcoal'
const HELP = 'text-sm leading-relaxed text-steel'
const LABEL = 'text-[13px] font-medium text-charcoal-mid'
const INPUT =
  'w-full rounded-xl border border-mist bg-white px-3.5 py-2.5 text-sm text-charcoal placeholder:text-steel/70 transition-colors duration-150 focus:border-green focus:outline-none focus:ring-2 focus:ring-green/15 disabled:bg-off-white disabled:text-steel'
const BTN =
  'rounded-full bg-green px-6 py-3 text-sm font-semibold text-white transition-colors duration-150 hover:bg-green-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-green'
const BTN_GHOST =
  'rounded-full border border-mist bg-white px-5 py-2.5 text-sm font-medium text-charcoal-mid transition-colors duration-150 hover:border-steel/40 hover:bg-off-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green disabled:opacity-40'

// How the visitor reached this page. A paying customer always arrives on a
// `?key=&rid=` link minted by checkout, so that entry mode drives a stripped
// view: no key quota, no sign-out, no company search — their run is already
// determined, and every one of those controls is either meaningless or an
// outright trap (a spent single-use key can't start a second run, and signing
// out erases the only handle they have on a report they paid for).
// Resolved on the server from the query string and passed in, not sniffed from
// window in an effect: the mode decides which copy renders on the very first
// paint, and a customer must never be flashed the key-entry tool.
export type Entry = 'link' | 'manual'

// Prefill data for the "Muuta ennusteita" table, pulled from the run's stage-0
// FAKTAT (forecast block, tEUR). `actual*` is the last realized year, shown
// read-only as a comparison column.
type ForecastData = {
  years: number[]
  rev: number[]
  ebit: number[]
  actualYear: number | null
  actualRev: number | null
  actualEbit: number | null
}

// Loosely-typed view of a stage-0 FAKTAT object (parsed JSON — fields validated
// at runtime below, so the shape is optional/unknown rather than `any`).
type Stage0 = {
  forecast?: { years?: unknown; net_sales?: unknown; ebit?: unknown }
  actuals?: {
    years?: unknown
    income_statement?: { net_sales?: unknown; ebit?: unknown }
  }
}

// Pull the forecast prefill out of a stage-0 FAKTAT object. Returns null when the
// forecast block is missing/empty so the editor simply isn't offered.
function extractForecastData(stage0: Stage0 | null | undefined): ForecastData | null {
  const fc = stage0?.forecast
  const years = fc?.years
  if (!Array.isArray(years) || years.length === 0) return null
  const rev = Array.isArray(fc?.net_sales) ? fc.net_sales : []
  const ebit = Array.isArray(fc?.ebit) ? fc.ebit : []
  if (!rev.some((v: unknown) => typeof v === 'number')) return null
  const aYears = stage0?.actuals?.years
  const income = stage0?.actuals?.income_statement
  const lastIdx = Array.isArray(aYears) ? aYears.length - 1 : -1
  const pick = (arr: unknown, i: number) =>
    Array.isArray(arr) && typeof arr[i] === 'number' ? arr[i] : null
  return {
    years,
    rev,
    ebit,
    actualYear: lastIdx >= 0 ? pick(aYears, lastIdx) : null,
    actualRev: lastIdx >= 0 ? pick(income?.net_sales, lastIdx) : null,
    actualEbit: lastIdx >= 0 ? pick(income?.ebit, lastIdx) : null,
  }
}

// Dev-only: `/raportti/mock?state=…` passes a seed so the post-generation
// screens can be designed without spending a real run. Null in production.
export function ReportApp({ entry, mock }: { entry: Entry; mock?: MockSeed | null }) {
  const [key, setKey] = useState('')
  const [me, setMe] = useState<ExpertMe | null>(mock?.me ?? null)

  const [query, setQuery] = useState('')
  const [candidates, setCandidates] = useState<CompanyCandidate[]>([])
  const [selected, setSelected] = useState<CompanyCandidate | null>(null)
  const [searching, setSearching] = useState(false)
  const [searchErr, setSearchErr] = useState<string | null>(null)
  const [deliveryEmail, setDeliveryEmail] = useState('')
  const [userInput, setUserInput] = useState('')
  // Opt-in (default off): stop after data fetch so the user can review/edit the
  // revenue+EBIT forecasts before the report is written (round-1 forecast flow).
  const [wantForecast, setWantForecast] = useState(false)
  // Forecast edits the user made on the round-1 awaiting_forecast screen (millions).
  const [round1Edits, setRound1Edits] = useState<ForecastEdit[]>([])
  // True while the generate-forecast request holds through the ValuBuild import
  // (~100 s); drives the "importing forecasts" progress label.
  const [importingForecast, setImportingForecast] = useState(false)

  const [runId, setRunId] = useState<string | null>(mock?.runId ?? null)
  const [run, setRun] = useState<any>(mock?.run ?? null)
  const [busy, setBusy] = useState(mock?.busy ?? false)
  const [reportSrc, setReportSrc] = useState<string | null>(mock?.reportSrc ?? null)
  const [error, setError] = useState<string | null>(null)
  // Free rounds (2) used up: hold the answers the user just typed so the
  // "buy extra round" button can send the same payload to checkout.
  const [capReachedPayload, setCapReachedPayload] = useState<{
    answers: { id: string; question: string; answer: string }[]
    freeText: string
    showOldNumbers: boolean
    scenarioProbabilities?: { pessimistic: number; base: number; optimistic: number }
    forecastEdits: ForecastEdit[]
  } | null>(
    mock?.capReached
      ? { answers: [], freeText: '', showOldNumbers: false, forecastEdits: [] }
      : null
  )
  const [buying, setBuying] = useState(false)
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Entry points, checked in order:
  // 1. Stripe just redirected back from a paid-extra-round checkout
  //    (?paid_round_token=&session_id=&rid=&key=) — redeem the payment and
  //    start that round.
  // 2. An emailed/on-screen link carries ?key=&rid= straight to a specific
  //    report (the paid checkout flow mints a single-use key per order).
  // 3. Otherwise restore a previously signed-in key from localStorage.
  useEffect(() => {
    if (typeof window === 'undefined' || mock) return
    const params = new URLSearchParams(window.location.search)
    const urlKey = params.get('key')
    const urlRid = params.get('rid')
    const paidToken = params.get('paid_round_token')
    const sessionId = params.get('session_id')
    const showOld = params.get('show_old_numbers') === '1'
    if (urlKey && urlRid && paidToken && sessionId) {
      void resumePaidRound(urlKey, urlRid, paidToken, sessionId, showOld)
      return
    }
    if (urlKey && urlRid) {
      void resumeFromLink(urlKey, urlRid)
      return
    }
    const saved = localStorage.getItem(KEY_STORAGE)
    if (saved) void signIn(saved)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  async function resumeFromLink(k: string, rid: string) {
    setError(null)
    const info = await validateKey(k)
    if (!info) {
      setError('Avain ei kelpaa tai on käytetty loppuun.')
      return
    }
    localStorage.setItem(KEY_STORAGE, k)
    setKey(k)
    setMe(info)
    try {
      const r = await getRun(k, rid)
      setRunId(rid)
      setRun(r)
      if (r.status === 'awaiting_forecast') {
        // Parked mid round-1 forecast review — show the editor, not a report.
        setBusy(false)
      } else if (r.status === 'running' || r.status === 'importing_forecast') {
        setBusy(true)
        poll(rid, k)
      } else {
        setBusy(true)
        await finishRun(r, k)
      }
    } catch (e: any) {
      setError('Raporttia ei löytynyt: ' + (e?.message || e))
    }
  }

  async function resumePaidRound(k: string, rid: string, token: string, sessionId: string, showOldNumbers: boolean) {
    setError(null)
    const info = await validateKey(k)
    if (!info) {
      setError('Avain ei kelpaa tai on käytetty loppuun.')
      return
    }
    localStorage.setItem(KEY_STORAGE, k)
    setKey(k)
    setMe(info)
    setBusy(true)
    try {
      const { run_id } = await round2Redeem(k, rid, { token, stripe_session_id: sessionId, show_old_numbers: showOldNumbers })
      setRunId(run_id)
      poll(run_id, k)
    } catch (e: any) {
      setBusy(false)
      setError('Maksettua lisäkierrosta ei voitu käynnistää: ' + (e?.message || e))
      // Fall back to showing the original report so the page isn't just an error.
      await resumeFromLink(k, rid)
    }
  }

  async function signIn(k: string) {
    setError(null)
    const info = await validateKey(k)
    if (!info) {
      setError('Avain ei kelpaa tai on käytetty loppuun.')
      return
    }
    localStorage.setItem(KEY_STORAGE, k)
    setKey(k)
    setMe(info)
  }

  function signOut() {
    localStorage.removeItem(KEY_STORAGE)
    setKey('')
    setMe(null)
    resetRun()
  }

  function resetRun() {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = null
    setRunId(null)
    setRun(null)
    setReportSrc(null)
    setBusy(false)
    setError(null)
    setQuery('')
    setCandidates([])
    setSelected(null)
    setSearchErr(null)
    setDeliveryEmail('')
    setUserInput('')
    setWantForecast(false)
    setRound1Edits([])
  }

  async function doSearch() {
    const q = query.trim()
    if (q.length < 2) return
    setSearching(true)
    setSearchErr(null)
    setSelected(null)
    setCandidates([])
    try {
      const results = await searchCompany(key, q)
      setCandidates(results)
      if (results.length === 1) setSelected(results[0])
      if (results.length === 0) {
        setSearchErr('Yritystä ei löytynyt. Tarkista nimi tai y-tunnus.')
      }
    } catch (e: any) {
      setSearchErr(e?.message || String(e))
    } finally {
      setSearching(false)
    }
  }

  const finishRun = useCallback(
    // k defaults to the signed-in key; resumeFromLink passes it explicitly
    // since it can't wait for the setKey() state update to land first.
    async (r: any, k: string = key) => {
      setBusy(false)
      if (pollRef.current) clearInterval(pollRef.current)
      pollRef.current = null
      const errored = (r.results || []).find((x: any) => x.status === 'error')
      if (errored) {
        setError(
          'Raportin tuottaminen epäonnistui teknisen virheen vuoksi. ' +
          'Käyttämätön krediitti on palautettu, kokeile generointia hetken päästä uudelleen. ' +
          `(Tekninen syy: vaihe ${errored.order}: ${errored.error_message || 'tuntematon virhe'})`,
        )
        return
      }
      try {
        setReportSrc(padHtml(await reportHtml(k, r.id)))
      } catch (e: any) {
        setError('Raporttia ei voitu hakea: ' + (e?.message || e))
      }
    },
    [key]
  )

  async function downloadPdf(open: boolean) {
    if (!runId) return
    try {
      const url = URL.createObjectURL(await reportPdf(key, runId))
      if (open) {
        window.open(url, '_blank')
      } else {
        const a = document.createElement('a')
        a.href = url
        a.download = 'arvonmaaritys.pdf'
        a.click()
      }
      setTimeout(() => URL.revokeObjectURL(url), 60000)
    } catch (e: any) {
      setError('PDF:n haku epäonnistui: ' + (e?.message || e))
    }
  }

  // Poll a run until it settles. k defaults to the signed-in key; see finishRun.
  // `running` and `importing_forecast` keep polling; `awaiting_forecast` stops
  // and drops into the round-1 forecast-review screen (not a report, not an
  // error); everything else is terminal → fetch the report.
  function poll(rid: string, k: string = key) {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = setInterval(async () => {
      try {
        const r = await getRun(k, rid)
        setRun(r)
        if (r.status === 'awaiting_forecast') {
          if (pollRef.current) clearInterval(pollRef.current)
          pollRef.current = null
          setBusy(false)
        } else if (r.status !== 'running' && r.status !== 'importing_forecast') {
          void finishRun(r, k)
        }
      } catch {
        /* transient */
      }
    }, 3000)
  }

  async function startGeneration() {
    if (!selected) return
    const company = selected
    resetRunKeepSelection()
    setBusy(true)
    try {
      const { run_id } = await generate(key, {
        fid: company.fid,
        company_name: company.company_name || query.trim(),
        company_code: company.company_code,
        industry_text: company.industry_text,
        industry_code: company.industry_code,
        industry_id: company.industry_id,
        industry_tree: company.industry_tree,
        delivery_email: deliveryEmail.trim() || undefined,
        user_input: userInput.trim() || undefined,
        mode: wantForecast ? 'forecast' : 'generate',
      })
      setRunId(run_id)
      setMe(await validateKey(key)) // refresh remaining quota
      poll(run_id)
    } catch (e: any) {
      setBusy(false)
      setError(e?.message || String(e))
    }
  }

  // Continue a round-1 run parked in awaiting_forecast. With edits the request
  // holds through the ValuBuild import (~100 s) before the report starts.
  async function continueFromForecast(edits: ForecastEdit[]) {
    if (!runId) return
    setBusy(true)
    setError(null)
    setImportingForecast(edits.length > 0)
    try {
      await generateForecast(key, runId, edits)
      poll(runId)
    } catch (e: any) {
      // Import failed → backend reset the run to awaiting_forecast; keep the
      // editor on screen so the user can retry or continue unchanged.
      setBusy(false)
      setError(e?.message || String(e))
    } finally {
      setImportingForecast(false)
    }
  }

  // Like resetRun, but keeps the already-picked company + free-text notes
  // (used right before starting a generation, not when leaving the run).
  function resetRunKeepSelection() {
    if (pollRef.current) clearInterval(pollRef.current)
    pollRef.current = null
    setRunId(null)
    setRun(null)
    setReportSrc(null)
    setBusy(false)
    setError(null)
    setRound1Edits([])
  }

  async function startRound2(
    answers: { id: string; question: string; answer: string }[],
    freeText: string,
    showOldNumbers: boolean,
    scenarioProbabilities: { pessimistic: number; base: number; optimistic: number } | undefined,
    forecastEdits: ForecastEdit[]
  ) {
    if (!runId) return
    setBusy(true)
    setError(null)
    setCapReachedPayload(null)
    try {
      const { run_id } = await round2(key, runId, {
        clarifications: answers,
        clarifications_free_text: freeText,
        show_old_numbers: showOldNumbers,
        scenario_probabilities: scenarioProbabilities,
        ...(forecastEdits.length ? { forecast_edits: forecastEdits } : {}),
      })
      setReportSrc(null)
      setRunId(run_id)
      poll(run_id)
    } catch (e: any) {
      setBusy(false)
      if (e instanceof Round2CapReachedError) {
        setCapReachedPayload({ answers, freeText, showOldNumbers, scenarioProbabilities, forecastEdits })
      } else {
        setError(e?.message || String(e))
      }
    }
  }

  async function buyExtraRound() {
    if (!runId || !capReachedPayload) return
    setBuying(true)
    setError(null)
    try {
      const { checkout_url } = await round2Checkout(key, runId, {
        clarifications: capReachedPayload.answers,
        clarifications_free_text: capReachedPayload.freeText,
        show_old_numbers: capReachedPayload.showOldNumbers,
        scenario_probabilities: capReachedPayload.scenarioProbabilities,
        ...(capReachedPayload.forecastEdits.length
          ? { forecast_edits: capReachedPayload.forecastEdits }
          : {}),
      })
      window.location.href = checkout_url
    } catch (e: any) {
      setBuying(false)
      setError('Maksun käynnistys epäonnistui: ' + (e?.message || e))
    }
  }

  useEffect(() => () => { if (pollRef.current) clearInterval(pollRef.current) }, [])

  // Never hardcode the free-round count: it is ROUND2_MAX_PER_RUN on the backend
  // and has already changed once (2 -> 5). An unlimited key skips the cap entirely.
  const freeRounds = me?.free_rounds_per_report
  const roundsNote = me?.unlimited
    ? ''
    : freeRounds
      ? ` (${freeRounds} tarkennuskierrosta sisältyy)`
      : ''

  const results: any[] = run?.results || []
  const clarifications: ClarificationRequest[] =
    (!busy && Array.isArray(results.find((r) => r.order === 1)?.parsed_json?.clarification_requests)
      ? results.find((r) => r.order === 1).parsed_json.clarification_requests
      : []) || []
  const isRefinedVersion = Boolean(run?.parent_run_id)
  // Prefill for the forecast editor: the run's stage-0 FAKTAT forecast block.
  // Memoized on the run, not rebuilt per render: ForecastEditor's edit-reporting
  // effect lists `data` in its deps, so a fresh object every render made it
  // fire → setState in the parent → render → fire again (infinite loop).
  const forecastData: ForecastData | null = useMemo(
    () =>
      busy
        ? null
        : extractForecastData(
            (run?.results || []).find((r: any) => r.order === 0)?.parsed_json
          ),
    [run, busy]
  )

  // Arrived on a checkout/email link → customer view, not the key-entry tool.
  const customerMode = entry === 'link'

  const previewForecast = (text: string) =>
    mock ? mockForecastPreview(text) : forecastPreview(key, runId!, text)

  // ── gate ──────────────────────────────────────────────────────────────
  if (!me) {
    return (
      <Shell>
        <div className={`mx-auto mt-16 max-w-md ${CARD} p-8`}>
          {customerMode && (
            <>
              <h1 className={TITLE}>Arvonmääritysraportti</h1>
              {error ? (
                <>
                  <p className={`mt-3 ${HELP}`}>
                    Tämä linkki ei kelpaa tai se on vanhentunut. Raporttisi ei ole
                    kadonnut, lähetämme sen uudelleen kun otat yhteyttä.
                  </p>
                  <a
                    href={`mailto:${SUPPORT_EMAIL}`}
                    className="mt-4 inline-block text-sm font-medium text-green-deep underline-offset-2 hover:underline"
                  >
                    {SUPPORT_EMAIL}
                  </a>
                </>
              ) : (
                <p className={`mt-3 flex items-center gap-2.5 ${HELP}`}>
                  <Pulse />
                  Avataan raporttia…
                </p>
              )}
            </>
          )}

          {entry === 'manual' && (
            <>
              <h1 className={TITLE}>Kirjaudu sisään</h1>
              <p className={`mt-3 ${HELP}`}>
                Syötä avaimesi. Krediiteilläsi voit tuottaa rajatun määrän
                arvonmäärityksiä; tarkennukset ovat maksuttomia.
              </p>
              <form
                onSubmit={(e) => { e.preventDefault(); void signIn(key) }}
                className="mt-6 flex gap-2"
              >
                <input
                  value={key}
                  onChange={(e) => setKey(e.target.value)}
                  placeholder="exp_…"
                  className={INPUT}
                />
                <button className={`${BTN} shrink-0 px-5 py-2.5`}>Kirjaudu</button>
              </form>
              {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
            </>
          )}
        </div>
      </Shell>
    )
  }

  // ── app ───────────────────────────────────────────────────────────────
  return (
    <Shell>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-mist pb-5">
        <div>
          <p className={EYEBROW}>
            {customerMode ? 'Arvonmääritysraportti' : 'Arvonmääritys'}
          </p>
          <h1 className={`mt-1.5 ${TITLE}`}>
            {(customerMode ? run?.params?.company_name : me.label) || 'Yritys'}
          </h1>
        </div>
        {!customerMode && (
          <div className="flex items-center gap-4">
            <span className="rounded-full bg-green-mist px-3 py-1 text-[12.5px] font-medium text-green-deep">
              {me.unlimited ? 'Rajaton käyttö' : `${me.remaining} / ${me.generations_limit} krediittiä`}
            </span>
            {runId && !busy && (
              // Always-reachable escape: a failed/finished run otherwise dead-ends
              // the page (the search form is hidden once runId is set).
              <button
                onClick={resetRun}
                className="text-[13px] font-medium text-green-deep underline-offset-2 hover:underline"
              >
                Aloita uusi
              </button>
            )}
            <button
              onClick={signOut}
              className="text-[13px] text-steel underline-offset-2 hover:text-charcoal-mid hover:underline"
            >
              Kirjaudu ulos
            </button>
          </div>
        )}
      </div>

      {!runId && !customerMode && (
        <div className={`mt-8 max-w-2xl ${CARD} p-6 lg:p-8`}>
          <label className={`block ${LABEL}`} htmlFor="company-q">
            Yritys (nimi tai y-tunnus)
          </label>
          <div className="mt-2 flex gap-2">
            <input
              id="company-q"
              value={query}
              onChange={(e) => { setQuery(e.target.value); setSelected(null) }}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); void doSearch() } }}
              placeholder="esim. Valuatum Oy tai 1612398-8"
              className={INPUT}
            />
            <button
              onClick={doSearch}
              disabled={searching || query.trim().length < 2}
              className={`${BTN_GHOST} shrink-0`}
            >
              {searching ? 'Haetaan…' : 'Hae'}
            </button>
          </div>
          {searchErr && <p className="mt-2 text-[13px] text-red-600">{searchErr}</p>}

          {candidates.length > 1 && !selected && (
            <div className="mt-2 grid gap-1.5">
              {candidates.map((c) => (
                <button
                  key={`${c.fid}-${c.analyst_name || ''}`}
                  onClick={() => setSelected(c)}
                  className="rounded-xl border border-mist px-3 py-2 text-left text-[13px] text-charcoal-mid transition-colors duration-150 hover:border-green/40 hover:bg-green-faint"
                >
                  {c.company_name} · {c.company_code}
                  {c.industry_text ? ` · ${c.industry_text}` : ''}
                  {c.analyst_name ? ` (${c.analyst_name})` : ''}
                </button>
              ))}
            </div>
          )}

          {selected && (
            <div className="mt-2 flex flex-wrap items-center justify-between gap-2 rounded-xl bg-green-faint px-3.5 py-2.5 text-[13px] text-green-deep">
              <span>
                Valittu: <strong className="font-semibold">{selected.company_name}</strong> ({selected.company_code})
                {selected.industry_text ? ` · ${selected.industry_text}` : ''}
              </span>
              <button
                onClick={() => { setSelected(null); setCandidates([]) }}
                className="font-medium underline-offset-2 hover:underline"
              >
                Vaihda
              </button>
            </div>
          )}

          <label className={`mt-6 block ${LABEL}`} htmlFor="delivery-email">
            Sähköposti raportille <span className="font-normal text-steel">(valinnainen)</span>
          </label>
          <input
            id="delivery-email"
            value={deliveryEmail}
            onChange={(e) => setDeliveryEmail(e.target.value)}
            type="email"
            placeholder="nimi@yritys.fi"
            className={`mt-2 ${INPUT}`}
          />

          <label className={`mt-5 block ${LABEL}`} htmlFor="user-input">
            Lisätiedot <span className="font-normal text-steel">(valinnainen)</span>
          </label>
          <textarea
            id="user-input"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            rows={3}
            placeholder="Omat oletukset, tiedot joita ei löydy julkisista lähteistä…"
            className={`mt-2 ${INPUT} resize-y`}
          />

          <fieldset className="mt-6">
            <legend className={LABEL}>Ennusteet</legend>
            <div className="mt-2 grid gap-2">
              {[
                [false, 'Käytä Valuatumin ennusteita', 'Raportti luodaan suoraan. Oletus.'],
                [true, 'Tarkistan ennusteet ensin', 'Näet liikevaihto- ja EBIT-ennusteet ja voit muokata niitä ennen raportin luontia.'],
              ].map(([val, title, desc]) => (
                <label
                  key={String(val)}
                  className={`flex cursor-pointer items-start gap-3 rounded-xl border px-3.5 py-3 transition-colors duration-150 ${
                    wantForecast === val
                      ? 'border-green bg-green-faint'
                      : 'border-mist hover:border-steel/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="forecast-mode"
                    checked={wantForecast === val}
                    onChange={() => setWantForecast(val as boolean)}
                    className="mt-1 accent-[var(--green)]"
                  />
                  <span>
                    <span className="block text-[13.5px] font-medium text-charcoal">{title as string}</span>
                    <span className="mt-0.5 block text-[12.5px] text-steel">{desc as string}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          <button
            onClick={startGeneration}
            disabled={!selected || (!me.unlimited && (me.remaining ?? 0) <= 0)}
            className={`mt-6 ${BTN}`}
          >
            {!me.unlimited && (me.remaining ?? 0) <= 0
              ? 'Kiintiö käytetty'
              : wantForecast
                ? 'Hae tiedot ja tarkista ennusteet'
                : 'Tuota arvonmääritys'}
          </button>
          <p className="mt-3 text-[12.5px] leading-relaxed text-steel">
            {wantForecast
              ? 'Haemme ensin yrityksen taloustiedot ja näytämme ennusteet. Sen jälkeen raportin generointi kestää tyypillisesti 10–20 minuuttia.'
              : 'Raportin generointi kestää tyypillisesti 10–20 minuuttia.'}{' '}
            Valmis raportti sisältää tekoälyn tarkentavia kysymyksiä; vastaamalla niihin saat
            halutessasi tarkennetun version{roundsNote}.
          </p>
        </div>
      )}

      {runId && busy && (
        <Progress
          results={results}
          awaitingImport={importingForecast || run?.status === 'importing_forecast'}
          forecastFetch={Boolean(run?.params?.forecast_mode) && !results.some((r: any) => r.order >= 1)}
        />
      )}

      {runId && !busy && run?.status === 'awaiting_forecast' && (
        <ForecastGate
          data={forecastData}
          edits={round1Edits}
          onEditsChange={setRound1Edits}
          onPreview={previewForecast}
          onContinue={() => continueFromForecast(round1Edits)}
        />
      )}

      {error && (
        <p className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {reportSrc && (
        <div className="mt-8">
          {capReachedPayload ? (
            <div className={`mb-10 ${CARD} p-6 lg:p-8`}>
              <p className={EYEBROW.replace('text-green-deep', 'text-gold')}>Tarkennukset</p>
              <h2 className={`mt-1.5 ${TITLE}`}>
                {me?.free_rounds_per_report
                  ? `Maksuttomat kierrokset (${me.free_rounds_per_report}) on käytetty`
                  : 'Maksuttomat kierrokset on käytetty'}
              </h2>
              <p className={`mt-2 max-w-[62ch] ${HELP}`}>
                {me?.paid_rounds_enabled
                  ? 'Vastauksesi ovat tallessa. Lisäkierros maksaa 5 € ja käynnistyy heti maksun jälkeen.'
                  : `Raportti alla on viimeisin versio ja voit yhä ladata sen PDF:nä. Jos tarvitset lisää tarkennuksia, ota yhteyttä: ${SUPPORT_EMAIL}`}
              </p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                {me?.paid_rounds_enabled && (
                  <button onClick={buyExtraRound} disabled={buying} className={BTN}>
                    {buying ? 'Siirrytään maksuun…' : 'Osta lisäkierros, 5 €'}
                  </button>
                )}
                <button
                  onClick={() => setCapReachedPayload(null)}
                  disabled={buying}
                  className={BTN_GHOST}
                >
                  {me?.paid_rounds_enabled ? 'Muokkaa vastauksia' : 'Sulje'}
                </button>
              </div>
            </div>
          ) : (
            (clarifications.length > 0 || forecastData) && (
              <ClarifyPanel
                busy={busy}
                requests={clarifications}
                forecastData={forecastData}
                onForecastPreview={previewForecast}
                onSubmit={startRound2}
              />
            )
          )}

          <div className="mt-10 flex flex-wrap items-end justify-between gap-3 border-t border-mist pt-6">
            <div>
              <p className={EYEBROW}>{isRefinedVersion ? 'Tarkennettu versio' : 'Ensimmäinen versio'}</p>
              <h2 className={`mt-1.5 ${TITLE}`}>Raportti</h2>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button onClick={() => downloadPdf(false)} className={`${BTN} px-5 py-2.5`}>
                Lataa PDF
              </button>
              <button onClick={() => downloadPdf(true)} className={BTN_GHOST}>
                Avaa uuteen välilehteen
              </button>
            </div>
          </div>
          <iframe
            title="Raportti"
            srcDoc={reportSrc}
            className="mt-5 h-[80vh] w-full rounded-3xl border border-mist bg-white"
          />

          {!customerMode && (
            <button
              onClick={resetRun}
              className="mt-6 text-sm font-medium text-green-deep underline-offset-2 hover:underline"
            >
              Uusi arvonmääritys
            </button>
          )}
        </div>
      )}
    </Shell>
  )
}

// The backend report HTML is laid out for an A4 PDF; on screen its content
// hugs the frame edges. Inject a little side padding for the in-page view only
// (the downloaded PDF comes straight from the backend, unaffected).
function padHtml(html: string): string {
  const style = '<style>body{padding:24px 32px !important;box-sizing:border-box}</style>'
  return html.includes('</head>') ? html.replace('</head>', style + '</head>') : style + html
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-off-white">
      <header className="border-b border-mist bg-white">
        <div className="mx-auto flex max-w-4xl items-center gap-2.5 px-6 py-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.svg" alt="" aria-hidden className="h-5 w-auto" />
          <span className="text-[13px] font-medium tracking-tight text-charcoal">Valuatum</span>
          <span className="text-[13px] text-steel">Arvonmääritys</span>
        </div>
      </header>
      <div className="mx-auto max-w-4xl px-6 py-10">
        {children}
        <p className="mt-12 border-t border-mist pt-5 text-[13px] text-steel">
          Jos jokin menee pieleen, ota yhteyttä:{' '}
          <a
            href={`mailto:${SUPPORT_EMAIL}`}
            className="font-medium text-green-deep underline-offset-2 hover:underline"
          >
            {SUPPORT_EMAIL}
          </a>
        </p>
      </div>
    </main>
  )
}

function Progress({
  results,
  awaitingImport = false,
  forecastFetch = false,
}: {
  results: any[]
  awaitingImport?: boolean
  // Forecast-mode data fetch before the review screen (~1 min) — not the
  // 10-20 min report generation, so the copy must differ.
  forecastFetch?: boolean
}) {
  const byOrder: Record<number, any> = {}
  for (const r of results) byOrder[r.order] = r
  const running = results.find((r) => r.status === 'running')
  const label = awaitingImport
    ? 'Tuodaan muokatut ennusteet Valuatumin malliin…'
    : forecastFetch
    ? 'Haetaan taloustiedot, pääset kohta tarkistamaan ennusteet…'
    : byOrder[0] && byOrder[0].status === 'running'
    ? 'Haetaan taloustietoja Valuatumista…'
    : running
    ? `Analysoidaan (vaihe ${running.order})…`
    : 'Käynnistetään…'
  return (
    <div className={`mt-8 ${CARD} p-6 lg:p-8`}>
      <div className="flex items-center gap-3">
        <Pulse />
        <span className="text-[15px] text-charcoal">{label}</span>
      </div>
      <p className="mt-2 pl-[22px] text-[13px] text-steel">
        {forecastFetch ? 'Kestää noin minuutin.' : 'Kestää tyypillisesti 10–20 minuuttia.'}{' '}
        {!forecastFetch &&
          'Valmis raportti sisältää tekoälyn tarkentavia kysymyksiä; vastaamalla niihin saat halutessasi tarkennetun version.'}
      </p>
    </div>
  )
}

// Single loading affordance for the whole app: a slow green pulse, never a spinner.
function Pulse() {
  return (
    <span className="relative flex h-2.5 w-2.5 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-60" />
      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-green" />
    </span>
  )
}

// Round-1 checkpoint: the run has fetched data and is parked in awaiting_forecast.
// Show Valuatum's forecasts, let the user optionally edit them, then continue.
// Doing nothing and pressing the button is a first-class path — the report is
// simply generated on Valuatum's own numbers.
function ForecastGate({
  data,
  edits,
  onEditsChange,
  onPreview,
  onContinue,
}: {
  data: ForecastData | null
  edits: ForecastEdit[]
  onEditsChange: (edits: ForecastEdit[]) => void
  onPreview: (text: string) => Promise<ForecastPreview>
  onContinue: () => void
}) {
  const edited = edits.length > 0
  return (
    <div className="mt-8">
      <p className={EYEBROW}>Ennen raporttia</p>
      <h2 className={`mt-1.5 ${TITLE}`}>Tarkista ennusteet</h2>
      <p className={`mt-2 max-w-[62ch] ${HELP}`}>
        Alla ovat Valuatumin ennusteet liikevaihdolle ja EBITille. Voit muokata niitä omilla
        näkemyksilläsi tai jättää ne ennalleen. Muokkaaminen on vapaaehtoista.
      </p>

      {data ? (
        <ForecastEditor
          data={data}
          busy={false}
          bare
          onPreview={onPreview}
          onEditsChange={onEditsChange}
        />
      ) : (
        <p className={`mt-6 rounded-2xl bg-gold-faint px-4 py-3 text-[13px] text-charcoal-mid`}>
          Ennustedataa ei ollut saatavilla. Raportti luodaan Valuatumin ennusteilla.
        </p>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2">
        <button onClick={onContinue} className={BTN}>
          {edited ? 'Luo raportti näillä ennusteilla' : 'Luo raportti Valuatumin ennusteilla'}
        </button>
        {edited && (
          <span className="text-[12.5px] text-steel">
            Muokatut ennusteet viedään ensin Valuatumin malliin (n. 1–2 min).
          </span>
        )}
      </div>
    </div>
  )
}

function ClarifyPanel({
  requests,
  busy,
  forecastData,
  onForecastPreview,
  onSubmit,
}: {
  requests: ClarificationRequest[]
  busy: boolean
  forecastData: ForecastData | null
  onForecastPreview: (text: string) => Promise<ForecastPreview>
  onSubmit: (
    answers: { id: string; question: string; answer: string }[],
    freeText: string,
    showOldNumbers: boolean,
    scenarioProbabilities: { pessimistic: number; base: number; optimistic: number } | undefined,
    forecastEdits: ForecastEdit[]
  ) => void
}) {
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [freeText, setFreeText] = useState('')
  const [showOldNumbers, setShowOldNumbers] = useState(false)
  const [forecastEdits, setForecastEdits] = useState<ForecastEdit[]>([])
  const [probs, setProbs] = useState({ pessimistic: '', base: '', optimistic: '' })
  const probsFilled = [probs.pessimistic, probs.base, probs.optimistic].filter(
    (v) => v.trim() !== ''
  ).length
  const probsSum =
    (parseInt(probs.pessimistic) || 0) +
    (parseInt(probs.base) || 0) +
    (parseInt(probs.optimistic) || 0)
  const probsValid = probsFilled === 3 && probsSum === 100
  const probsError = probsFilled > 0 && !probsValid
  const answered =
    Object.values(answers).filter((v) => v.trim()).length +
    (freeText.trim() ? 1 : 0) +
    (probsValid ? 1 : 0)

  const nothingToSend = answered === 0 && forecastEdits.length === 0

  return (
    <section className={`${CARD} overflow-hidden`}>
      <div className="border-b border-mist px-6 py-6 lg:px-8">
        <p className={EYEBROW}>Tarkennuskierros</p>
        <h2 className={`mt-1.5 ${TITLE}`}>Haluatko tarkentaa raporttia?</h2>
        <p className={`mt-2 max-w-[62ch] ${HELP}`}>
          Lue raportti alta ensin. Vastaa alla oleviin kysymyksiin mihin voit, korjaa ennusteita
          tai kirjoita vapaasti mitä tekoäly ei osannut kysyä. Tarkennus ei kuluta kiintiötä.
        </p>
      </div>

      {requests.length > 0 && (
        <div className="px-6 lg:px-8">
          <div className="flex items-baseline gap-2 pt-6">
            <h3 className={LABEL}>Tekoäly ei pystynyt varmentamaan näitä</h3>
            <span className="text-[12px] text-steel">{requests.length} kysymystä</span>
          </div>
          <ul className="mt-1 divide-y divide-mist">
            {requests.map((r) => (
              <li key={r.id} className="py-5">
                <label htmlFor={`ans-${r.id}`} className="block text-[14.5px] leading-snug text-charcoal">
                  {r.question}
                </label>
                {r.valuation_impact && (
                  <p className="mt-1.5 text-[12px] text-steel">
                    Vaikutus arvoon: {r.valuation_impact}
                  </p>
                )}
                <textarea
                  id={`ans-${r.id}`}
                  value={answers[r.id] || ''}
                  onChange={(e) => setAnswers((a) => ({ ...a, [r.id]: e.target.value }))}
                  disabled={busy}
                  rows={2}
                  placeholder="Vastauksesi. Jätä tyhjäksi jos et tiedä."
                  className={`mt-2.5 ${INPUT} resize-y`}
                />
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="border-t border-mist px-6 py-6 lg:px-8">
        <label htmlFor="free-text" className={LABEL}>
          Muuta täydennettävää <span className="font-normal text-steel">(valinnainen)</span>
        </label>
        <textarea
          id="free-text"
          value={freeText}
          onChange={(e) => setFreeText(e.target.value)}
          disabled={busy}
          rows={3}
          placeholder="Esim. yrityskohtaisia tietoja, joita julkisista lähteistä ei löydy."
          className={`mt-2 ${INPUT} resize-y`}
        />

        <div className="mt-6">
          <span className={LABEL}>
            Skenaarioiden todennäköisyydet <span className="font-normal text-steel">(valinnainen)</span>
          </span>
          <p className="mt-1 text-[12.5px] text-steel">
            Jätä tyhjäksi, niin tekoäly valitsee itse. Täytä kaikki kolme, summan on oltava 100 %.
          </p>
          <div className="mt-3 flex flex-wrap items-end gap-3">
            {(
              [
                ['pessimistic', 'Pessimistinen'],
                ['base', 'Konservatiivinen'],
                ['optimistic', 'Optimistinen'],
              ] as const
            ).map(([k, label]) => (
              <label key={k} className="flex flex-col gap-1 text-[12.5px] text-charcoal-mid">
                {label}
                <input
                  type="number"
                  min={0}
                  max={100}
                  step={5}
                  value={probs[k]}
                  onChange={(e) => setProbs((p) => ({ ...p, [k]: e.target.value }))}
                  disabled={busy}
                  placeholder="%"
                  className={`${INPUT} w-24 tabular-nums`}
                />
              </label>
            ))}
            {probsFilled > 0 && (
              <span className={`pb-2.5 text-[12.5px] ${probsError ? 'text-red-600' : 'text-green-deep'}`}>
                Summa {probsSum} %{probsError ? ', täytä kaikki kolme niin että summa on 100 %' : ''}
              </span>
            )}
          </div>
        </div>
      </div>

      {forecastData && (
        <div className="border-t border-mist px-6 lg:px-8">
          <ForecastEditor
            data={forecastData}
            busy={busy}
            onPreview={onForecastPreview}
            onEditsChange={setForecastEdits}
          />
        </div>
      )}

      <div className="border-t border-mist bg-off-white px-6 py-6 lg:px-8">
        {/* Sets `show_old_numbers` on the round-2 run, which swaps one directive in
            the writer prompt: either report every changed figure as "vanha → uusi"
            with a reason, or never mention the previous round at all (default). */}
        <label className="flex cursor-pointer select-none items-start gap-2.5">
          <input
            type="checkbox"
            checked={showOldNumbers}
            onChange={(e) => setShowOldNumbers(e.target.checked)}
            disabled={busy}
            className="mt-0.5 h-4 w-4 rounded border-mist accent-[var(--green)]"
          />
          <span>
            <span className="block text-[13.5px] text-charcoal">
              Näytä raportissa mikä muuttui
            </span>
            <span className="mt-0.5 block max-w-[62ch] text-[12.5px] leading-relaxed text-steel">
              Tarkennettu raportti kirjoittaa muuttuneet luvut muodossa vanha → uusi ja kertoo
              syyn. Ilman valintaa raportissa näkyvät vain uudet luvut, eikä edelliseen versioon
              viitata.
            </span>
          </span>
        </label>
        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
          <button
            onClick={() =>
              onSubmit(
                requests
                  .map((r) => ({ id: r.id, question: r.question, answer: (answers[r.id] || '').trim() }))
                  .filter((a) => a.answer),
                freeText.trim(),
                showOldNumbers,
                probsValid
                  ? {
                      pessimistic: parseInt(probs.pessimistic),
                      base: parseInt(probs.base),
                      optimistic: parseInt(probs.optimistic),
                    }
                  : undefined,
                forecastEdits
              )
            }
            disabled={busy || nothingToSend || probsError}
            className={BTN}
          >
            Tarkenna raporttia
          </button>
          <span className="text-[12.5px] text-steel">
            {nothingToSend
              ? 'Vastaa vähintään yhteen kohtaan tai muuta ennusteita.'
              : forecastEdits.length > 0
                ? 'Ennusteita muutettu: malli ja raportti lasketaan uudelleen, kesto 10–20 min.'
                : 'Uusi versio valmistuu tyypillisesti 10–20 minuutissa.'}
          </span>
        </div>
      </div>
    </section>
  )
}

type Unit = 'abs' | 'pct'
const _fmt0 = new Intl.NumberFormat('fi-FI', { maximumFractionDigits: 0 })
const _fmt1 = new Intl.NumberFormat('fi-FI', { minimumFractionDigits: 1, maximumFractionDigits: 1 })

function _parseNum(s: string): number | null {
  const cleaned = s.replace(/[\s ]/g, '').replace(',', '.')
  if (cleaned === '') return null
  const v = parseFloat(cleaned)
  return Number.isFinite(v) ? v : null
}

// tEUR → millions (the import API unit), rounded to kill float noise.
function _toMillions(teur: number): number {
  return Math.round((teur / 1000) * 1e6) / 1e6
}

const _FC_ROWS = [
  { key: 'rev' as const, varname: 'ns' as const, name: 'Liikevaihto', pctLabel: 'kasvu-%' },
  { key: 'ebit' as const, varname: 'ebit' as const, name: 'EBIT', pctLabel: 'EBIT-%' },
]

// Collapsible revenue/EBIT forecast table. Edits are absolute tEUR in local
// state; per-row a tEUR ↔ % toggle converts in the browser (revenue = YoY
// growth %, EBIT = % of revenue). Changed cells are reported up as ForecastEdits
// (only cells that differ from the prefill, converted to millions).
function ForecastEditor({
  data,
  busy,
  onPreview,
  onEditsChange,
  bare = false,
}: {
  data: ForecastData
  busy: boolean
  onPreview: (text: string) => Promise<ForecastPreview>
  onEditsChange: (edits: ForecastEdit[]) => void
  // `bare` = the forecast-review screen, where editing forecasts IS the task:
  // no disclosure to open, no "why would I click this" label. Inside the
  // refinement panel it stays collapsed, because there it is one option of four.
  bare?: boolean
}) {
  const [open, setOpen] = useState(bare)
  const [rev, setRev] = useState<number[]>(() => data.years.map((_, i) => data.rev[i]))
  const [ebit, setEbit] = useState<number[]>(() => data.years.map((_, i) => data.ebit[i]))
  const [mode, setMode] = useState<{ rev: Unit; ebit: Unit }>({ rev: 'abs', ebit: 'abs' })
  const [description, setDescription] = useState('')
  const [aiPreview, setAiPreview] = useState<ForecastPreview | null>(null)
  const [aiBusy, setAiBusy] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const [acceptedSummary, setAcceptedSummary] = useState<string | null>(null)

  const cur = { rev, ebit }
  const set = { rev: setRev, ebit: setEbit }

  const revPct = (arr: number[], i: number) => {
    const prev = i === 0 ? data.actualRev : arr[i - 1]
    if (!prev || !Number.isFinite(arr[i])) return NaN
    return (arr[i] / prev - 1) * 100
  }
  const ebitPct = (revArr: number[], ebitArr: number[], i: number) => {
    if (!revArr[i] || !Number.isFinite(ebitArr[i])) return NaN
    return (ebitArr[i] / revArr[i]) * 100
  }
  const changed = (key: 'rev' | 'ebit', i: number) =>
    Number.isFinite(cur[key][i]) && Math.abs(cur[key][i] - data[key][i]) > 0.5

  // Report edits (in millions) to the parent whenever a cell changes.
  //
  // ValuBuild's forecast import applies values year-by-year and STOPS at the first
  // year with no value, so sending only the changed cells (e.g. 2027-2029) drops
  // them when an earlier year (2025/2026) has none — verified end-to-end. So we
  // send a CONTIGUOUS block from the first forecast year through the last changed
  // year, filling untouched years with their current (baseline) value.
  // ponytail: workaround for ValuBuild dropping sparse years; drop back to
  // changed-only once ValuBuild sets values directly (PSD2-style, see handoff).
  useEffect(() => {
    let lastChanged = -1
    data.years.forEach((_, i) => {
      if (changed('rev', i) || changed('ebit', i)) lastChanged = i
    })
    const edits: ForecastEdit[] = []
    for (let i = 0; i <= lastChanged; i++) {
      _FC_ROWS.forEach((row) => {
        if (Number.isFinite(cur[row.key][i])) {
          edits.push({ varname: row.varname, year: data.years[i], value: _toMillions(cur[row.key][i]) })
        }
      })
    }
    onEditsChange(edits)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rev, ebit, data])

  function commit(key: 'rev' | 'ebit', i: number, raw: string) {
    const v = _parseNum(raw)
    if (v === null) return // ignore unparseable; input reverts to state on re-render
    set[key]((arr) => {
      const next = arr.slice()
      if (mode[key] === 'abs') {
        next[i] = v
      } else if (key === 'rev') {
        const prev = i === 0 ? data.actualRev : next[i - 1]
        if (prev) next[i] = prev * (1 + v / 100)
      } else {
        next[i] = rev[i] * (v / 100)
      }
      return next
    })
  }

  function reset() {
    setRev(data.years.map((_, i) => data.rev[i]))
    setEbit(data.years.map((_, i) => data.ebit[i]))
    setAcceptedSummary(null)
  }

  async function createAiPreview() {
    const text = description.trim()
    if (!text) return
    setAiBusy(true)
    setAiError(null)
    setAiPreview(null)
    try {
      setAiPreview(await onPreview(text))
    } catch (e: unknown) {
      setAiError(e instanceof Error ? e.message : String(e))
    } finally {
      setAiBusy(false)
    }
  }

  function acceptAiPreview() {
    if (!aiPreview || aiPreview.edits.length === 0) return
    const byCell = new Map(
      aiPreview.rows.map((row) => [`${row.varname}:${row.year}`, row.value] as const),
    )
    setRev((current) =>
      data.years.map((year, i) => byCell.get(`ns:${year}`) ?? current[i]),
    )
    setEbit((current) =>
      data.years.map((year, i) => byCell.get(`ebit:${year}`) ?? current[i]),
    )
    setAcceptedSummary(aiPreview.summary || 'AI:n ehdottamat ennustemuutokset')
    setAiPreview(null)
  }

  const anyChanged = data.years.some((_, i) => changed('rev', i) || changed('ebit', i))

  return (
    <div className={bare ? 'mt-6' : ''}>
      {!bare && (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          className="flex w-full items-center justify-between gap-4 py-6 text-left"
        >
          <span>
            <span className={LABEL}>Muuta ennusteita</span>
            <span className="mt-1 block max-w-[58ch] text-[12.5px] leading-relaxed text-steel">
              Liikevaihto- ja EBIT-ennusteet, joiden pohjalta arvonmääritys on laskettu.
              {anyChanged ? ' Muutoksia tehty.' : ''}
            </span>
          </span>
          <span
            className={`shrink-0 text-steel transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
            aria-hidden
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M3 5.5L7 9.5L11 5.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
        </button>
      )}

      {open && (
        <div className={bare ? '' : 'pb-6'}>
          <div className="rounded-2xl bg-green-faint p-5">
            <h3 className="text-[13.5px] font-medium text-charcoal">
              Kuvaile, miten ennustetta pitäisi muuttaa
            </h3>
            <p className="mt-1 max-w-[62ch] text-[12.5px] leading-relaxed text-steel">
              Tekoäly muodostaa kuvauksesta numeroehdotuksen. Näet ja hyväksyt luvut ennen
              raportin uudelleenlaskentaa.
            </p>
            <textarea
              value={description}
              onChange={(e) => {
                setDescription(e.target.value)
                setAiError(null)
              }}
              disabled={busy || aiBusy}
              rows={3}
              maxLength={8000}
              placeholder="Esim. Liikevaihto kasvaa noin 20 % vuodessa uuden tuotelinjan ansiosta, ja EBIT-marginaali paranee 12 %:iin vuoteen 2028 mennessä."
              className={`mt-3 ${INPUT} resize-y`}
            />
            <div className="mt-2.5 flex flex-wrap gap-2">
              {[
                ['Nopeampi kasvu, parempi marginaali', 'Liikevaihto kasvaa noin 20 % vuodessa uuden tuotelinjan ansiosta, ja EBIT-marginaali paranee 12 %:iin ennustejakson loppuun mennessä.'],
                ['Maltillisempi kasvu', 'Kasvu hidastuu noin 5 %:iin vuodessa markkinan kypsyessä. Kannattavuus säilyy nykytasolla.'],
              ].map(([label, text]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setDescription(text)}
                  disabled={busy || aiBusy}
                  className="rounded-full border border-mist bg-white px-3 py-1.5 text-[12px] text-charcoal-mid transition-colors duration-150 hover:border-green/40 hover:text-green-deep disabled:opacity-40"
                >
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => void createAiPreview()}
                disabled={busy || aiBusy || !description.trim()}
                className={`${BTN_GHOST} ${aiBusy ? 'inline-flex items-center gap-2' : ''}`}
              >
                {aiBusy && <Pulse />}
                {aiBusy ? 'Muodostetaan…' : 'Muodosta muutokset'}
              </button>
            </div>
            <p className="mt-3 max-w-[70ch] text-[11.5px] leading-relaxed text-steel">
              Kuvaus sekä nykyiset liikevaihto- ja EBIT-ennusteet käsitellään ulkoisessa
              AI-palvelussa (Google Gemini). Yrityksen nimeä, tunnusta tai sähköpostia ei lähetetä.
            </p>
            {aiError && <p className="mt-2 text-[12.5px] text-red-600">{aiError}</p>}

            {aiPreview && (
              <div className="mt-4 overflow-hidden rounded-2xl border border-mist bg-white">
                <div className="border-b border-mist px-4 py-3">
                  <h4 className="text-[13.5px] font-medium text-charcoal">
                    Ehdotus, tarkista ennen käyttöönottoa
                  </h4>
                  {aiPreview.summary && (
                    <p className="mt-1 text-[12.5px] leading-relaxed text-steel">{aiPreview.summary}</p>
                  )}
                </div>
                <div className="px-4 py-3">
                  {aiPreview.rows.length > 0 ? (
                    <div className="overflow-x-auto">
                      <table className="w-full border-collapse text-[13px]">
                        <thead>
                          <tr className="text-left text-[11.5px] font-medium uppercase tracking-wide text-steel">
                            <th className="pb-2 pr-2 font-medium">Muuttuja</th>
                            <th className="px-2 pb-2 text-right font-medium">Vuosi</th>
                            <th className="px-2 pb-2 text-right font-medium">Nykyinen</th>
                            <th className="pb-2 pl-2 text-right font-medium">Ehdotus</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-mist">
                          {aiPreview.rows.map((row) => (
                            <tr key={`${row.varname}-${row.year}`}>
                              <td className="py-2 pr-2 text-charcoal-mid">
                                {row.varname === 'ns' ? 'Liikevaihto' : 'EBIT'}
                              </td>
                              <td className="px-2 py-2 text-right tabular-nums text-steel">{row.year}</td>
                              <td className="px-2 py-2 text-right tabular-nums text-steel">
                                {_fmt0.format(row.old)}
                              </td>
                              <td className="py-2 pl-2 text-right font-semibold tabular-nums text-green-deep">
                                {_fmt0.format(row.value)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <p className="text-[13px] text-steel">
                      Tekoäly ei ehdottanut muutoksia nykyisiin ennustelukuihin.
                    </p>
                  )}
                  {aiPreview.notes.length > 0 && (
                    <ul className="mt-3 list-disc space-y-1 pl-4 text-[12.5px] text-steel">
                      {aiPreview.notes.map((note) => <li key={note}>{note}</li>)}
                    </ul>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={acceptAiPreview}
                      disabled={busy || aiPreview.edits.length === 0}
                      className={`${BTN} px-5 py-2.5`}
                    >
                      Käytä nämä muutokset
                    </button>
                    <button
                      type="button"
                      onClick={() => setAiPreview(null)}
                      disabled={busy}
                      className={BTN_GHOST}
                    >
                      Muokkaa kuvausta
                    </button>
                  </div>
                </div>
              </div>
            )}

            {acceptedSummary && (
              <div className="mt-4 rounded-2xl border border-green/30 bg-white px-4 py-3">
                <p className="text-[13.5px] font-medium text-green-deep">
                  Ennustemuutokset otettu käyttöön
                </p>
                <p className="mt-1 text-[12.5px] leading-relaxed text-steel">{acceptedSummary}</p>
                <p className="mt-1 text-[12.5px] text-steel">
                  Voit vielä hienosäätää arvoja alla olevasta taulukosta.
                </p>
              </div>
            )}
          </div>

          <div className="mt-6 overflow-x-auto">
            <table className="w-full border-collapse text-[13px]">
              <thead>
                <tr className="text-[11.5px] font-medium text-steel">
                  <th className="pb-2 text-left font-medium" />
                  {data.actualYear != null && (
                    <th className="px-2 pb-2 text-right font-medium">
                      {data.actualYear}
                      <span className="block font-normal">toteutunut</span>
                    </th>
                  )}
                  {data.years.map((y) => (
                    <th key={y} className="px-2 pb-2 text-right font-medium tabular-nums">
                      {y}E
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-mist">
                {_FC_ROWS.map((row) => {
                  const isAbs = mode[row.key] === 'abs'
                  const actualVal = row.key === 'rev' ? data.actualRev : data.actualEbit
                  const actualPct =
                    row.key === 'ebit' && data.actualRev && actualVal != null
                      ? (actualVal / data.actualRev) * 100
                      : null
                  return (
                    <tr key={row.key}>
                      <td className="whitespace-nowrap py-3 pr-3 text-left align-top">
                        <span className="block text-[13.5px] font-medium text-charcoal">{row.name}</span>
                        <span className="mt-1.5 inline-flex overflow-hidden rounded-full border border-mist">
                          {(['abs', 'pct'] as const).map((m) => (
                            <button
                              key={m}
                              type="button"
                              disabled={busy}
                              onClick={() => setMode((mm) => ({ ...mm, [row.key]: m }))}
                              aria-pressed={mode[row.key] === m}
                              className={`px-2.5 py-1 text-[11.5px] transition-colors duration-150 ${
                                mode[row.key] === m
                                  ? 'bg-charcoal text-white'
                                  : 'bg-white text-steel hover:text-charcoal-mid'
                              }`}
                            >
                              {m === 'abs' ? 'tEUR' : row.pctLabel}
                            </button>
                          ))}
                        </span>
                      </td>
                      {data.actualYear != null && (
                        <td className="px-2 py-3 text-right align-top tabular-nums text-steel">
                          {actualVal == null
                            ? '–'
                            : isAbs
                              ? _fmt0.format(actualVal)
                              : row.key === 'rev'
                                ? '–'
                                : actualPct != null
                                  ? `${_fmt1.format(actualPct)} %`
                                  : '–'}
                        </td>
                      )}
                      {data.years.map((y, i) => {
                        const pct =
                          row.key === 'rev' ? revPct(cur.rev, i) : ebitPct(cur.rev, cur.ebit, i)
                        const shown = isAbs
                          ? Number.isFinite(cur[row.key][i])
                            ? _fmt0.format(cur[row.key][i])
                            : ''
                          : Number.isFinite(pct)
                            ? _fmt1.format(pct)
                            : ''
                        const deriv = isAbs
                          ? Number.isFinite(pct)
                            ? `${_fmt1.format(pct)} %`
                            : ''
                          : Number.isFinite(cur[row.key][i])
                            ? `${_fmt0.format(cur[row.key][i])} tEUR`
                            : ''
                        const isChanged = changed(row.key, i)
                        return (
                          <td key={y} className="px-1 py-3 text-right align-top">
                            <input
                              defaultValue={shown}
                              key={`${row.key}-${i}-${mode[row.key]}-${shown}`}
                              disabled={busy}
                              aria-label={`${row.name} ${y}`}
                              onBlur={(e) => commit(row.key, i, e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') (e.target as HTMLInputElement).blur()
                              }}
                              className={`w-[4.9rem] rounded-lg border px-2 py-1.5 text-right text-[13px] tabular-nums transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-green/15 ${
                                isChanged
                                  ? 'border-green bg-green-faint font-semibold text-green-deep'
                                  : 'border-mist text-charcoal focus:border-green'
                              }`}
                            />
                            {deriv && (
                              <span className="mt-1 block text-[11.5px] tabular-nums text-steel">{deriv}</span>
                            )}
                            {isChanged && (
                              <span className="mt-0.5 block text-[11.5px] tabular-nums text-green-deep/70">
                                alkup.{' '}
                                {isAbs
                                  ? _fmt0.format(data[row.key][i])
                                  : `${_fmt1.format(
                                      row.key === 'rev'
                                        ? revPct(data.rev, i)
                                        : ebitPct(data.rev, data.ebit, i)
                                    )} %`}
                              </span>
                            )}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          <div className="mt-3 flex flex-wrap items-baseline justify-between gap-3">
            <span className="max-w-[70ch] text-[11.5px] leading-relaxed text-steel">
              Luvut tuhansina euroina (tEUR). Prosenttinäkymässä liikevaihto on kasvu-%
              edellisvuodesta ja EBIT osuus liikevaihdosta.
            </span>
            {anyChanged && (
              <button
                type="button"
                onClick={reset}
                disabled={busy}
                className="text-[12.5px] font-medium text-green-deep underline-offset-2 hover:underline disabled:opacity-40"
              >
                Palauta alkuperäiset
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
