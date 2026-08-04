# Valuatum AI-arvonmääritysraportti — public site

Finnish marketing site + self-serve report flow for Valuatum's AI company
valuation report. Next.js 16 (App Router) + Tailwind v4, deployed on Vercel.

The valuation itself lives in a **separate backend repo**
(`../AI-company-valuation-raportti`, FastAPI on Railway). This repo only sells
the report and renders it — read that repo's `HANDOFF.md` before changing
anything that talks to the API.

## Develop

```bash
npm install
npm run dev
```

On Windows use `npm.cmd run build` — plain `npm run build` is blocked by the
local PowerShell execution policy.

## Layout

- `src/app/(site)/…` — the public marketing site (landing, `/yritys`,
  `/laskuri`, `/kertoimet`, blog, checkout pages).
- `src/app/raportti/` — the self-serve report app (noindex). `/testi` is a
  permanent redirect to it; old links in customer inboxes point there.
- `src/report/` — `ReportApp.tsx` (the whole flow) + `reportApi.ts` (bearer
  calls to the backend).
- `src/content/` — all page copy as JSON/TS. `fi/home.json` is the landing page.
- `src/lib/pricing.ts` — prices in EUR cents, env-overridable. Read the header
  comment before touching report kinds.

There is no in-app content editor any more; edit the JSON and commit it.

## Flow

1. `/yritys` search → `/yritys/[id]` → `BuyBox` → Stripe Checkout (79 €).
2. `POST /api/stripe/webhook` (durable) and `/kassa/valmis` both call the
   backend's `checkout-generate`, which mints a single-use `exp_` key and
   starts the run.
3. The customer lands on `/raportti?key=…&rid=…`, watches progress, optionally
   reviews and edits the revenue/EBIT forecasts, then reads the report and can
   run refinement rounds.

Stripe runs in demo mode whenever `STRIPE_SECRET_KEY` is unset.

## Designing the report screens (`/raportti/mock`)

The screens after "generate" normally need a real 10–20 min backend run that
costs money. `/raportti/mock?state=…` seeds `ReportApp` with fixtures instead —
`progress`, `forecast`, `report`, `cap`. Dev only; the route 404s in production.
Fixtures live in `src/report/mockRun.ts`.

## Env

| var | where | note |
| --- | --- | --- |
| `NEXT_PUBLIC_ORDERS_API` | client | backend base URL, defaults to the Railway prod host |
| `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET` | server | unset → demo mode |
| `NEXT_PUBLIC_SITE_URL` | server | absolute URLs for Stripe redirects |
| `PRICE_*` | server | see `src/lib/pricing.ts` |

See `PRODUCT.md` (positioning, tone), `DESIGN.md` (design system), and
`HANDOFF.md` (session history).
