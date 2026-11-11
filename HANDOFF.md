# Handoff — 2026-11-11 — Sample-report measurement and mobile purchase path

- Added `sample_report_click` for direct activations of the four linked public example PDFs (Harvia, Gofore, Fiskars, Heeros). The only extra event field, `sample_report`, is a fixed allowlisted name; the existing sanitized public-page context remains in force. No raw URLs, queries, company IDs or private pages are sent, and Enhanced Measurement stays disabled. A click is not proof of a successful PDF view; same-tab navigations may lose an event when the page unloads. GA4 custom dimensions would need separate configuration to break down the parameter in standard reports.
- Added a Harvia example PDF link beside the equity-value explanation in the valuation-methods article. This minor link addition does not change its substantive update date (6.11.).
- Fixed the long company-search headline wrapping on small screens. A live mobile check found real company search and its purchase card working; no live checkout was started. A separate local 320/375px browser test used mocked search and checkout, checked required email validation, and reached a local fake checkout screen without payment or report generation.
- Validation: production build, changed-file ESLint, `node src/lib/analytics.check.mjs`, and local checks of all 34 sitemap pages passed. The browser test verified both the search-page and article sample links open a PDF and queue one sanitized `sample_report_click`; Google Analytics was blocked during local testing. Existing Turbopack dynamic-filesystem tracing warning remains. Luottoriskit.fi was not changed.
- Weekly baseline, 4.–10.11. vs 28.10.–3.11. (Helsinki): GA4 24 users / 25 sessions vs 24 / 27, seven vs five users saw the BuyBox; no tracked checkout starts. Stripe showed no positive product-tagged paid orders in either week. Search Console final data 3.–9.11. vs 27.10.–2.11. (Pacific time): nine vs sixteen clicks and 1,821 vs 2,046 impressions. Only two of the seven newly published profiles were indexed at the check on 11.11.; allow time for indexing.

# Handoff — 2026-11-06 — Other public pages' structured data

- Added homepage `WebSite` data with the configured site name and linked its Organization, publisher and Service provider to the same Valuatum `#organization` identity used on company pages. Homepage FAQ markup now only includes a visible FAQ section. The 79 EUR offer still matches the displayed price; if pricing changes, synchronize the homepage copy/schema and the environment-driven checkout price.
- Blog article JSON-LD now connects its canonical URL, author and publisher, and includes a breadcrumb matching the visible Blogi → article navigation. Guide articles also identify their canonical page and publisher. Their FAQ links render as links, while the JSON-LD answers contain the same visible plain text. No invented dates, reviews or ratings were added.
- Google retired FAQ rich results on 2026-05-07; existing accurate FAQPage data is retained without expecting that search feature. Google chooses site names and search appearance, even with valid markup. `/yritys`, `/laskuri` and `/kertoimet` did not need speculative schema.
- GSC's indexed snapshots reported Breadcrumbs PASS and no issues for the 14 previously indexed company profiles and the company directory. Two freshly added profiles had been crawled but were not yet indexed; five were still unknown when checked on 6.11. The snapshot does not verify current live markup.
- Validation: checked canonicals and structured-data syntax for all 34 sitemap pages, confirmed homepage and article data against rendered text, and checked all 21 company identities and profile schemas. Google Rich Results Test accepted both Article and Breadcrumb on the price-guide article; it flagged the optional image and the date-only values without times/timezones. The source has no verified times or representative article image, so none were invented. Google says dates are required but times are optional for byline dates. Production build and focused ESLint passed. Existing Turbopack dynamic-filesystem tracing warning remains.

# Handoff — 2026-11-06 — Search-led company profiles and schema

- Added seven static financial-history profiles: Läänin Kuljetus (group), Kavora, Helsingin KTK, Imatran Seudun Sähkö, Akun Tehdas, Lounea (group), and Napapiirin Kuljetus. Candidates were selected from exact company-name-plus-valuation/share-value/sale-price queries in Luottoriskit.fi Search Console, final data 6.8.–3.11.; the two strongest queries had 64 and 27 impressions, and the others 2–5. These are small counts, not proof of broad search demand or conversions. No changes to Luottoriskit.fi.
- Verified company IDs and exact site-search FIDs, parent/group model selection and historical annual revenue/EBIT against read-only Profinderprod and Luottoriskit public tables at their displayed precision. Figures are reported historical data, not newly generated forecasts; `netDebtEur` remains null. Kavora's latest verified year is 2024. Its street address is Pieksämäki and postal address Kangasala; the profile omits city to avoid conflating them. The ordering page now says `Paikkakunta` rather than `Kotipaikka` because the search backend returns postal town, with visiting town as fallback.
- Profile JSON-LD links each `WebPage.about` to a separate company `Organization` identified by its displayed Y-tunnus; Valuatum remains the publisher. Group labels also appear in the page metadata. A short share-value FAQ explains the outstanding-shares assumption and links to the tax authority's guidance with its taxation scope. No `ProfilePage`, review, price, or rating markup was invented.
- Validation: production build and focused ESLint passed; local HTTP checks covered all 21 profile schemas, canonicals, sitemap/directory links and unknown-page 404, plus exact search-code/FID/group matching for the seven additions. The Läänin group purchase path was opened locally without payment. Tiny nonzero percentage values now retain enough precision instead of showing `−0 %`.

# Handoff — 2026-11-06 — Campaign attribution and SEO check

- Luottoriskit.fi's existing valuation-page links use `rel=noreferrer` and a known set of UTM values. Public-page analytics now emits a separate `luottoriskit_referral` event only for that exact approved campaign. If the UTM content parameter is present, it must be one of three known link values; the event does not identify which link was used. Raw query strings, company IDs, unknown campaign values and private pages remain excluded. This measures future arrivals; it does not change GA4's standard session-source dimension or reclassify past direct traffic.
- Google Search Console showed 15 clicks and 1,934 impressions on 28.10.–3.11., versus 18 and 2,045 in the preceding week (final data, Pacific Time). Nine clicks went to blocked legacy `/yritys/` URLs and five to `/yritykset/` company profiles. Those groups target different searches and are not an A/B test. GA4 recorded 19 users, 20 sessions, three order-card viewers and zero checkout starts on 30.10.–5.11. (Helsinki time); Stripe had zero positive paid, product-tagged checkouts.
- Expanded the existing valuation-methods article to distinguish accounting equity from estimated equity value and clarify its net-debt example. The article was appearing for related queries, but the data is too sparse to infer an SEO effect.
- Requested reindexing of `/yrityskauppa` on 6.11. because the indexed copy had last been crawled on 20.10., before its update. A request is not a guarantee of recrawling. Existing WAF challenge on `/yritys/` protects against a bot that previously caused usage overages; a browser check encountered the challenge. Assess user impact before changing it. No changes were made to Luottoriskit.fi.

# Handoff — 2026-10-28 — Mobile purchase path and funnel

- Company detail pages show the existing 79 € price and an anchor to the order card near the company identity on mobile; the full order process and desktop card remain. `/yritys` shows the price and a current sample earlier. Order copy distinguishes report generation time from the optional forecast review.
- GA4 `view_item` fires when at least 20% of the order card is visible; `checkout_error` reports only a fixed failure category. Both retain the public-path allowlist and never send company IDs, queries, user input or raw error messages. Checkout is not blocked if analytics fails. Keep Enhanced Measurement disabled as described below.
- Updated the company-sale and pricing content and their links to reviewed Harvia, Gofore and Fiskars examples. `/kertoimet` now labels calculator sector ranges as assumptions and replaces the stale, inconsistently dated peer table with instructions for constructing a comparable multiple. No new company pages, forecasts or paid report runs.
- Next.js and eslint-config-next were updated from 16.4.0 to 16.4.3 for the published security fixes. As of 2026-10-28, `npm audit --omit=dev` still reports a high-severity Zod array-validation advisory and a moderate `qs` advisory; Zod arrays in this app are used for checked-in content, not the checkout request. Assess remaining exposure and dependency updates separately.
- Validation: production build and mocked analytics/checkout tests passed; focused ESLint and TypeScript passed. The mobile card anchor and desktop layout were checked without initiating payment. The existing Turbopack file-tracing warning remains.

# Handoff — 2026-10-21 — SEO and conversion measurement

- Restored the canonical gtag Arguments queue. Public pageviews and company search/selection/checkout events use sanitized paths; private report/checkout URLs, raw queries, company identifiers and customer input are excluded. Dynamic public pages are grouped for privacy; use Search Console for individual SEO landing pages. All Enhanced Measurement options are disabled on GA4 stream 15377948030; do not re-enable automatic history/form/search tracking without repeating privacy checks.
- Signed Stripe webhooks send GA4 purchase events only for this product's live, paid, positive EUR existing-company orders. Revenue excludes Stripe tax; transaction/client fallbacks are stable hashes. Production server secret `GA_MEASUREMENT_PROTOCOL_API_SECRET` was added to Vercel. No thank-you-page purchase pixel. Delivery is best effort (2-second timeout); a transport failure logs an error and needs manual replay, without failing fulfillment. Zero-euro discounted sessions are excluded.
- Homepage search and calculator result now show 79 € including VAT, with report benefits and current Harvia/Gofore examples. Updated generic sample links, contextual SEO links, multiplier-page search intent and actual modification dates. No new company profiles or report/forecast generation.
- Verification: installed locked Next 16.4.0 dependencies; production build and mocked analytics/payment checks pass. Google MP strict debug validator returned no validation messages (no event recorded). Independent analytics review found no blocking issue. Production dependency audit has zero findings; existing CompanySearch lint error and checkout warning remain. Mobile/desktop views checked; external payment/report calls were mocked or avoided.

# Handoff — 2026-10-14 — Current public report examples

- Replaced the homepage's old Heeros example and two coming-soon cards with full Harvia, Gofore and Fiskars consolidated reports. Public paths: `/samples/harvia-oyj.pdf`, `/samples/gofore-oyj.pdf`, `/samples/fiskars-oyj-abp.pdf`. Historical Heeros PDFs and articles retain their URLs.
- Generated through the current backend main pipeline locally in isolated SQLite, using actuals through 2025. Each report has 16 sections and 26 tables; Harvia/Gofore/Fiskars have 7/7/8 SVG charts and 34/34/36 pages. Three authorized runs cost USD 1.655158; no Railway production run or backend change.
- Reviewed public copies remove obsolete confidence-grade wording while retaining substantive limitations. Manual corrections align scenario prose and discount horizons with deterministic calculations, restore the Gofore peer-revenue range, and include Harvia's missing EVA adjustment. Visible notes explain Fiskars's historical EBITDA source gap and differences between source-model and published company ratios, without claiming an unverified cause. Originals and repair manifests remain private outside this repository. Independent financial and PDF review passed.
- Do not regenerate public snapshots from the original JSON without repeating these checks. The current renderer can rewrite peer ranges and leave stale scenario prose despite updating scenario tables. These sample-specific corrections do not imply a production generator fix.
- Removed confidence-level promises and obsolete Heeros-specific example descriptions from the homepage and ordering summary. Updated Next.js and its ESLint config from 16.2.9 to 16.4.0 to resolve the production dependency advisory; production npm audit has zero findings.
- Production build and changed-file ESLint passed. Local homepage/PDF checks passed at 375/768/1440px without horizontal overflow or page errors. Full-repository lint retains 23 pre-existing errors in CompanySearch/report app files; the existing Turbopack tracing warning remains. Existing tablet-header label overlap is outside this report update.

# Handoff — 2026-09-18 — Public company financial profiles

- Added a separate static `/yritykset` directory and 14 allowlisted `/yritykset/[slug]` pages. The route uses generateStaticParams, force-static and dynamicParams=false; unknown slugs return 404. No page visit fetches financial data or generates a forecast/report.
- `src/data/company-profiles.json` contains three historical annual revenue/EBIT rows per company, EUR-normalized from read-only Valuatum modeldata and reconciled with the existing Luottoriskit public tables at their display precision. `retrievedAt` is the data check date, not the financial year. `netDebtEur` is deliberately null until source definitions reconcile. No customer data or forecasts included.
- 4K Capital / old Jyväskylän Autovaruste identity and Kuljetus Tornikoski's null-vs-zero revenue discrepancy were excluded. Expansion requires exact company/FID identity and checked historical fields; do not synthesize missing values or call the normal company-json exporter (it regenerates estimates).
- Profile links use the existing order shell with `?fid=...`; matchCompany now fails closed on exact normalized company code + FID when supplied. Keep these links as native anchors: CompanyDetail reads the query after a full navigation. Existing search and its static noindex rewrite remain intact.
- Added directory/footer discovery and sitemap entries. No Luottoriskit repository or page was modified.
- Validation: production build produces static directory + 14 SSG paths; changed-file ESLint passes; HTTP checks cover canonical/indexability/JSON-LD/order links/sitemap/404/noindex boundaries; mobile overflow fixed and exact Kamrock order-page transition verified without payment. Full-repository lint has 23 pre-existing errors in CompanySearch and report app files; existing Turbopack tracing warning remains outside this change.

# Handoff — 2026-09-15 (read this first)

## 2026-09-15 — Ennustenäyttö kertoo, miksi marginaali liikkuu

`ForecastGate` näyttää ohjetekstin alla Valuatumin oman EBIT-%-uran
(ensimmäinen → viimeinen ennustevuosi) ja sanoo, että se on mallin yleinen
oletus (pääoman tuotto lähestyy pääoman kustannusta), ei näkemys tästä
yhtiöstä. Lasketaan `ForecastData`sta (ebit/rev), ei uutta backend-kenttää.
Mekanismin selitys ja Apogeen tapaus: backend-repon HANDOFF 2026-09-15.
Raporttiin vastaava lohko "Mistä ennuste tulee" (backend `80c81cf`).

Huomattu samalla: ALV-korjaus (Stripe Tax + laskutus, PR #5 / backend PR
#11) tuli mergattuna toisesta koneesta. Apogeen 8.9. kuitti oli vielä
ilman alv-erittelyä (Stripe-sessio: tax 0) — lähetä käsin.

# Handoff — 2026-09-08 (read this first)

## 2026-09-08 (korjaus) — asiakas ei ollut jumissa, hän odotti tarkoituksella

Niko vastasi: "Ennusteiden laskeminen on vielä kesken. Sen takia en ole vielä
tarkoituksella käynnistänyt raportin muodostamista."

Eli alla oleva juurisyyanalyysi oli VÄÄRÄ. Hän löysi näytön, ymmärsi sen ja
jätti painamatta harkiten. Me käynnistimme ajon hänen puolestaan Valuatumin
oletusennusteilla — juuri niillä luvuilla, jotka hän aikoi korvata omillaan.

Mitä tästä jää voimaan:
- Painikkeen siirto (`d2e5b1c`) on edelleen oikea korjaus, mutta se ei ollut
  tämän tapauksen syy. Älä perustele sitä enää tällä asiakkaalla.
- 500 merkin katkaisu (`f878109`) oli aito ja asiakkaasta riippumaton vika.
- **Prosessisääntö: `awaiting_forecast` EI tarkoita jumia.** Uusi
  admin-hälytys kertoo vain, että ajo odottaa asiakasta. Älä käynnistä
  kenenkään ajoa hänen puolestaan pelkän hälytyksen perusteella — kysy
  asiakkaalta ensin.
- Vahinko rajoittui 0,50 $:n laskentakuluun. `ROUND2_MAX_PER_RUN=5` prodissa
  ja perhelaskuri oli 0, joten asiakkaalla on kaikki maksuttomat
  tarkennuskierrokset tallella ja ennustemuokkaus toimii niissä.

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
