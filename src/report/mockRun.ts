// Dev-only fixtures for the report app.
//
// Every screen after "Tuota arvonmääritys" is normally reachable only by
// spending a real generation against the prod backend (10-20 min and real
// money per run), which makes designing those screens impractical. These
// fixtures seed ReportApp's state directly so `/raportti/mock?state=…`
// renders each screen instantly with plausible data. Wired in `mock/page.tsx`,
// which 404s outside `next dev` — nothing here ships to production.
import type { ClarificationRequest, ExpertMe, ForecastPreview } from './reportApi'

export type MockState = 'progress' | 'forecast' | 'report' | 'cap'

export const MOCK_STATES: { id: MockState; label: string }[] = [
  { id: 'progress', label: 'Generointi käynnissä' },
  { id: 'forecast', label: 'Ennusteiden tarkistus (ennen raporttia)' },
  { id: 'report', label: '1. raportti valmis + tarkennuskierros' },
  { id: 'cap', label: 'Maksuttomat kierrokset käytetty' },
]

const ME: ExpertMe = {
  label: 'Demo-avain',
  generations_used: 3,
  generations_limit: 10,
  unlimited: false,
  remaining: 7,
  paid_rounds_enabled: true,
  free_rounds_per_report: 2,
}

// Shape mirrors a stage-0 FAKTAT payload (tEUR).
const STAGE0 = {
  forecast: {
    years: [2026, 2027, 2028, 2029, 2030, 2031, 2032],
    net_sales: [359, 334, 297, 285, 285, 292, 300],
    ebit: [-25, -15, -5, 5, 14, 23, 32],
  },
  actuals: {
    years: [2022, 2023, 2024, 2025],
    income_statement: {
      net_sales: [512, 470, 438, 421],
      ebit: [-12, -31, -40, -46],
    },
  },
}

const CLARIFICATIONS: ClarificationRequest[] = [
  {
    id: 'q1',
    question:
      'Onko liikevaihdon lasku 2024–2025 seurausta kertaluonteisesta asiakasmenetyksestä vai pysyvästä markkinamuutoksesta?',
    why_it_matters: 'Määrittää palaako kasvu ennustejaksolla.',
    valuation_impact: 'Suuri — vaikuttaa terminaaliarvoon',
    current_assumption: 'Oletamme laskun olevan osin pysyvä.',
  },
  {
    id: 'q2',
    question: 'Sisältyykö henkilöstökuluihin omistajan palkkaa yli markkinaehtoisen tason?',
    valuation_impact: 'Keskisuuri — normalisoitu EBIT',
  },
  {
    id: 'q3',
    question: 'Onko yhtiöllä taseen ulkopuolisia vastuita (takaukset, vuokrasopimukset)?',
    valuation_impact: 'Pieni — nettovelka',
  },
  {
    id: 'q4',
    question: 'Mikä on suurimman asiakkaan osuus liikevaihdosta?',
    valuation_impact: 'Keskisuuri — riskipreemio',
  },
]

const REPORT_HTML = `<!doctype html><html lang="fi"><head><meta charset="utf-8">
<style>
 body{font:14px/1.55 Georgia,serif;color:#1c1c1c;margin:0}
 h1{font-size:26px;margin:0 0 4px} h2{font-size:16px;margin:28px 0 6px;border-bottom:1px solid #ddd;padding-bottom:4px}
 .sub{color:#666;font-size:12px} table{border-collapse:collapse;width:100%;font-size:12px;margin-top:8px}
 td,th{border-bottom:1px solid #eee;padding:5px 6px;text-align:right} th:first-child,td:first-child{text-align:left}
 .big{font-size:22px;font-weight:700}
</style></head><body>
<h1>Arvonmääritysraportti — Demo Oy</h1>
<div class="sub">MOCK-RAPORTTI · vain käyttöliittymän suunnitteluun · ei oikeaa dataa</div>
<h2>1. Yhteenveto</h2>
<p>Arvonmäärityksen tulos on <span class="big">1,8 M€</span> (haarukka 1,2–2,6 M€).
Päämenetelmä on vapaan kassavirran DCF-malli.</p>
<h2>2. Skenaariot</h2>
<table><tr><th>Skenaario</th><th>Todennäköisyys</th><th>Arvo</th></tr>
<tr><td>Pessimistinen</td><td>15 %</td><td>1,2 M€</td></tr>
<tr><td>Konservatiivinen</td><td>65 %</td><td>1,8 M€</td></tr>
<tr><td>Optimistinen</td><td>20 %</td><td>2,6 M€</td></tr></table>
<h2>3. Ennusteet</h2>
<table><tr><th>tEUR</th><th>2026E</th><th>2027E</th><th>2028E</th></tr>
<tr><td>Liikevaihto</td><td>359</td><td>334</td><td>297</td></tr>
<tr><td>EBIT</td><td>-25</td><td>-15</td><td>-5</td></tr></table>
<p style="margin-top:40px;color:#888;font-size:11px">Lorem ipsum -täytettä, jotta iframen korkeus vastaa oikeaa raporttia.</p>
${'<p style="color:#bbb;font-size:11px">…</p>'.repeat(30)}
</body></html>`

export type MockSeed = {
  me: ExpertMe
  runId: string
  run: any
  busy: boolean
  reportSrc: string | null
  capReached: boolean
}

export function mockSeed(state: MockState): MockSeed {
  const stage0 = { order: 0, status: 'ok', parsed_json: STAGE0 }
  const stage1 = {
    order: 1,
    status: 'ok',
    parsed_json: { clarification_requests: CLARIFICATIONS },
  }
  const base = {
    id: 'mock-run',
    params: {
      company_name: 'Demo Oy',
      forecast_mode: state === 'forecast',
      // Stands in for what a buyer types at checkout, so the gate's
      // automatic interpretation of it is visible in the mock.
      user_input:
        'Tappiollinen sivuliiketoiminta (liikevaihto n. 20 tEUR, tappio n. 3 tEUR/v) '
        + 'siirretään pois yhtiöstä ennen kauppaa.',
    },
  }
  if (state === 'progress') {
    return {
      me: ME,
      runId: 'mock-run',
      run: { ...base, status: 'running', results: [{ ...stage0, status: 'ok' }, { order: 1, status: 'running' }] },
      busy: true,
      reportSrc: null,
      capReached: false,
    }
  }
  if (state === 'forecast') {
    return {
      me: ME,
      runId: 'mock-run',
      run: { ...base, status: 'awaiting_forecast', results: [stage0] },
      busy: false,
      reportSrc: null,
      capReached: false,
    }
  }
  return {
    me: ME,
    runId: 'mock-run',
    run: { ...base, status: 'ok', results: [stage0, stage1] },
    busy: false,
    reportSrc: REPORT_HTML,
    capReached: state === 'cap',
  }
}

// Stand-in for POST /forecast-preview so the AI-description box is clickable
// while designing. Always proposes the same modest bump.
export async function mockForecastPreview(text: string): Promise<ForecastPreview> {
  await new Promise((r) => setTimeout(r, 700))
  const years = STAGE0.forecast.years
  const rows = years.map((year, i) => ({
    varname: 'ns' as const,
    year,
    old: STAGE0.forecast.net_sales[i],
    value: Math.round(STAGE0.forecast.net_sales[i] * (1 + 0.08 * (i + 1))),
  }))
  return {
    edits: rows.map((r) => ({ varname: r.varname, year: r.year, value: r.value / 1000 })),
    summary: `MOCK: tulkittu kuvauksesta "${text.slice(0, 60)}…" — liikevaihdon kasvua nostettu asteittain.`,
    rows,
    notes: ['Tämä on mock-ehdotus, ei oikea AI-vastaus.'],
  }
}
