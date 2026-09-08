# Handoff — 2026-09-08 (read this first)

## 2026-09-08 (cont.) — Asiakkaan omat sanat viedään nyt ennusteen läpi

Apogeen raportti kertoi proosassa, että ilmailuliiketoiminta eriytetään ennen
kauppaa, ja lisäsi rehellisesti "eikä sitä ole viety valuaatiomoottorin
ennusteeseen". Se on koko ongelma yhdessä lauseessa: `user_input` menee vain
kirjoittajalle ja rikastukseen, ja ainoa kanava asiakkaan sanoista lukuihin on
ennustemuokkaus (ns/ebit -> ValuBuild) — se sama näyttö, jonka hän ohitti.

`ForecastEditor` saa nyt propin `autoPreviewText`: teksti, jonka asiakas on jo
kirjoittanut muualle, tulkitaan kerran automaattisesti olemassa olevalla
`/forecast-preview`-polulla ja näytetään tavallisena ehdotuksena.

- Kierros 1 (ForecastGate): `orderInput={run.params.user_input}` eli tilauksen
  lisätiedot tulkitaan heti kun näyttö aukeaa.
- Kierros 2 (ClarifyPanel): vapaan tekstin `onBlur` syöttää tekstin samaan
  tulkintaan, kun taulukkoa ei ole muokattu käsin.

**Automaattinen ehdotus ei koskaan estä lähettämistä.** `onPendingPreviewChange`
raportoi pendingiksi vain käyttäjän itse pyytämän ehdotuksen (`fromElsewhere`
false). Muuten olisimme korvanneet "painiketta ei löydy" -ongelman
"painike on disabloitu" -ongelmalla samalla maksetulla polulla.

Todennettu mockilla molemmissa tiloissa (`/raportti/mock?state=forecast` ja
`?state=clarify`): ehdotus ilmestyy, teksti "Tulkittu antamistasi
lisätiedoista" näkyy, ja molemmat painikkeet pysyvät aktiivisina.

## 2026-09-08 — Ensimmäinen ulkopuolinen maksava asiakas ei saanut raporttiaan

Niko Lamberg / Apogee Oy osti raportin klo 10.50 (79 €, `cs_live_b10Eru…`).
Kaksi vikaa, kumpikaan ei ollut kaatuminen.

**1. Ostajan taustateksti katkesi 500 merkkiin.** `/api/checkout` kirjoitti
`userInput: userInput.slice(0, 500)` Stripen metadataan, ja molemmat
täyttöpolut (webhook + /kassa/valmis) lukivat vain sen. Textarea sallii 4000
merkkiä eikä varoita. Asiakkaan teksti katkesi kesken sanan "Arvioitu realis",
ja loppu on peruuttamattomasti poissa — mikään ei tallenna tekstiä ennen
Stripeä. Sama oli osunut kahteen NoCFO-testiostoon (25.8. ja 27.8., molemmat
tasan 500 merkkiä) eikä kukaan huomannut.

Korjaus: `src/lib/userInputMetadata.ts` pilkkoo tekstin 500 merkin paloihin
(`userInput`, `userInput2`, … enintään 8 = 4000) ja `readUserInput` kokoaa ne
webhookissa ja kiitos-sivulla. Lukee myös vanhan yhden avaimen sessiot.
Itsetarkistus: `node src/lib/userInputMetadata.check.ts` (Node 24 ajaa .ts
suoraan; tiedosto on tsconfigin excludessa, koska import käyttää .ts-päätettä).

**2. Maksettu ajo jäi ennustenäyttöön kahdeksi tunniksi.** `forecast_mode`
pysäyttää ajon `awaiting_forecast`-tilaan, ja raportti käynnistyy vasta kun
ostaja painaa painiketta. Painike oli AI-kuvauslaatikon ja 10 vuoden
ennustetaulukon ALAPUOLELLA, eli läppärillä taitteen alla. Asiakas kävi
sivulla kolmesti (10.51, 11.05, 11.16) eikä löytänyt sitä.

Huom: muistutusmaili EI puuttunut — `send_forecast_ready` lähtee parkkeerauksen
yhteydessä ja lähti myös tälle asiakkaalle. Vika oli yksinomaan siinä, mitä
linkin takana näkyi.

Korjaus: `ForecastGate` nostaa painikkeen heti otsikon alle omaan laatikkoonsa
tekstillä "Raportti ei käynnisty ennen kuin painat alla olevaa painiketta".
Alempi painike jäi paikalleen. Backend lähettää nyt myös meille hälytyksen
(`send_admin_forecast_parked`) kun maksettu ajo parkkeeraa.

Ajo `e709ab3480c542ac945246ed27ba5837` käynnistettiin käsin Valuatumin
ennusteilla (`POST /generate-forecast`, `forecast_edits: []`) käyttäjän luvalla.

Seuraava, jos tämä toistuu: ajastettu muistutus jos ajo on ollut
`awaiting_forecast` yli ~20 min. Nyt hälytys tulee vain parkkeeraushetkellä.

# Handoff — site repo (read `README.md` first for the map)

Rewritten 2026-08-04. Everything before this entry described `/asiantuntija`,
`ExpertApp.tsx`, the statement-upload flow and the built-in content editor —
all of which have been deleted. That history is in git; it is not repeated here
because it was actively misleading.

The valuation backend is a separate repo
(`../AI-company-valuation-raportti`, FastAPI on Railway,
`valu-pipeline-production-88f2.up.railway.app`). Its `HANDOFF.md` is the source
of truth for anything API-shaped. ⛔ Never trigger a report generation against
prod without asking — there is no cancel endpoint and each run costs real money.

## 2026-08-26 — a pending AI forecast proposal no longer submits as nothing

NoCFO refinement (backend runs `2429d74b` → `a13e34a5`): the CEO described a
forecast change, `ForecastEditor` produced a good proposal, he never clicked
"Käytä nämä muutokset", and "Tarkenna raporttia" ran anyway — free text alone
cleared `nothingToSend`. The proposal is local state, so the round ran on the
untouched numbers and the new report was numerically identical.

`ForecastEditor` now reports a pending, un-accepted proposal up via
`onPendingPreviewChange`. Both parents — `ClarifyPanel` (round 2) and
`ForecastGate` (round-1 checkpoint) — disable their submit button while one is
open and show a red line naming the two buttons that clear it. Not auto-accepted:
these are financial inputs, the user has to look at them.

Verified on `/raportti/mock?state=forecast`: after "Muodosta muutokset" the
button is `disabled`, after "Käytä nämä muutokset" it re-enables and its label
flips to "Luo raportti näillä ennusteilla". `tsc --noEmit` clean.

The matching backend work (the writer dropping free-text corrections, and a
`GET /api/runs/{rid}/comments` trail so what a customer wrote is visible at all)
is in the backend repo's HANDOFF.md.

## What the product is, today

One sellable thing: a 79 € AI valuation report on a Finnish company whose
financials Valuatum already holds. Buy → Stripe → the backend generates →
the customer reads it at `/raportti` and can refine it.

- **`/yritys`** search → **`/yritys/:id`** → `BuyBox` → `POST /api/checkout`
  → Stripe Checkout.
- **`POST /api/stripe/webhook`** is the durable fulfilment path;
  **`/kassa/valmis`** does the same call on page load as a fallback.
  `checkout-generate` is idempotent on the Stripe session id, so both firing is
  safe.
- **`/raportti`** (`src/report/ReportApp.tsx`) is the whole customer app:
  progress → optional forecast review → report in an iframe → refinement
  rounds → optional paid extra round (5 €) via Stripe.
- **`/testi`** is a permanent redirect to `/raportti`, query intact. Old links
  sit in customer inboxes and in Stripe redirect URLs; never delete it.

## Things that will bite you

- **`/yritys/:id` has no server route and must not get one back.** There is no
  `[id]` segment any more. `next.config.ts` rewrites every `/yritys/:id` to the
  single prerendered `/yritys/detail` shell, and `CompanyDetail.tsx` fetches the
  company client-side from the CDN-cached `/api/search`. This is not a
  micro-optimisation — the unbounded id space (every y-tunnus resolves) is what
  exhausted the whole Vercel allowance twice. `revalidate` + ISR was the first
  attempt and did not help, because ISR caches per path and a crawler walking
  the id space produces nothing but fresh paths. Live logs on 2026-08-19 showed
  the walk still running at ~30 ids/minute — 88 % of all production traffic —
  and ignoring the robots.txt Disallow. The only thing that actually holds is
  having no per-id server render at all.

  Consequences to keep in mind: no `generateMetadata`, so the title is set in a
  `useEffect` (fine — the page is noindex); the id comes from `usePathname()`,
  not `useParams()`, because the rewrite means there is no route param; and
  `matchCompany()` in `lib/companies.ts` is what picks konserni vs emo out of
  the search response, so it must stay in sync with `ValuatumDataSource.getById`.

- **There is a WAF rule on `/yritys/` that lives outside this repo.** Vercel
  Firewall custom rule "Challenge company-id walk": `path starts with /yritys/`
  → **challenge**. Manage it with `vercel firewall rules list` / `edit` /
  `publish` (changes stage as drafts until published; `vercel firewall discard`
  undoes them). It is free on every plan, and Vercel does not bill CDN Requests
  or Fast Data Transfer for challenge-mitigated traffic — which is the whole
  point, because the static-shell rewrite fixed every overage metric *except*
  Edge Requests, and a static file still costs one edge request per hit.

  Two consequences you must not undo by accident:

  1. **The search results are plain `<a>`, not `<Link>`, on purpose.** The
     challenge also applies to the RSC request a client-side navigation makes,
     and an RSC fetch cannot solve a challenge — it 429s and the router
     silently stays put, so clicking a result did nothing at all. A document
     navigation is challenged too, but the browser solves it transparently.
     Same reason `submitSearch` uses `window.location.assign`, not
     `router.push`. If you turn either back into client-side navigation, click
     a search result **in production** and confirm you actually land.
  2. `/yritys` (the search page, no trailing slash) is deliberately not
     matched, and neither is `/api/search`. Keep it that way — challenging the
     search page would put a verification screen on the funnel entrance, and
     challenging `/api/search` would break the company page's own data fetch.

- **`pricing.ts` still defines `import` and `creditsafe` kinds.** Those flows
  (upload your own statements / we fetch them for you) were never built and
  every page offering them was removed. The kinds stay only so a pre-removal
  Stripe session still resolves. Do not surface them without fulfilment.
- **Never hardcode the free refinement-round count.** It is `ROUND2_MAX_PER_RUN`
  on the backend (a Railway env var, has already changed 2 → 5). The UI reads
  `me.free_rounds_per_report` and must keep doing so.
- **Report claims must match the sample PDF**
  (`public/samples/esimerkki_ilmainen.pdf`, St1 Nordic, 26 p). The real report
  runs DCF as primary at 100 % weight, uses EVA as a 0 %-weight reconciliation,
  openly scores and rejects comparables and book value, and cross-checks the tax
  authority's model. It gives no action recommendations. Site copy drifted away
  from this once already.
- **The in-page progress display is one line**, a stage counter — not a live
  breakdown of pipeline steps. Don't promise more in copy.
- `git remote` points at `Valuatum/…`; GitHub redirects to `ValuatumOy/…` on
  every push. Harmless, fixable with `git remote set-url`.

## Designing the post-generation screens

`/raportti/mock?state=progress|forecast|report|cap` renders each screen from
fixtures in `src/report/mockRun.ts` — no backend, no cost, instant. The route
404s outside `next dev`. This exists because those screens were previously only
reachable by paying for a real 10–20 min run, which is why they had never been
designed properly.

Building it immediately surfaced a real bug (now fixed): `forecastData` was
rebuilt on every render, and `ForecastEditor`'s edit-reporting effect lists it
in its deps, so the awaiting-forecast screen looped `setState` → render →
`setState` forever. It is `useMemo`'d on the run now.

## Verification

- `npm.cmd run build` — compiles and prerenders clean. If it fails with
  `Cannot find module '../../../src/app/(editor)/editor/page.js'`, delete
  `.next`; that's stale type output from a deleted route.
- `curl -s https://valu-pipeline-production-88f2.up.railway.app/api/health`
- Dev server: `.claude/launch.json` → `nettisivut-dev` on port 3000. The
  spaces-in-path Turbopack problem noted in old handoffs does not reproduce on
  Next 16.2.9; ignore the `C:\dev\nettisivut` workaround.

## Open

- Two "Tulossa" placeholder cards still sit beside the real St1 sample.
- The exact prod value of `ROUND2_MAX_PER_RUN` is unknown here (Railway
  dashboard, or an `exp_` key + `GET /api/expert/me`).
- The refinement-round UI (`ClarifyPanel`) and the forecast editor look like an
  internal test tool. Redesign in progress — that is what the mock route is for.
