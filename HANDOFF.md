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

## What the product is, today

One sellable thing: a 79 € AI valuation report on a Finnish company whose
financials Valuatum already holds. Buy → Stripe → the backend generates →
the customer reads it at `/raportti` and can refine it.

- **`/yritys`** search → **`/yritys/[id]`** → `BuyBox` → `POST /api/checkout`
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
