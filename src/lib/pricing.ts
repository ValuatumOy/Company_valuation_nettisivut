// Central pricing config. All amounts in EUR cents (all prices + alv).
// Override via env so finance/ops can tune prices without code changes.
// Launch pricing: 79 € base — the ONLY price the site currently sells.
//
// 'import' and 'creditsafe' are legacy: the upload-your-own-statements and
// we-fetch-them-for-you flows were never built end-to-end, and every page and
// component offering them was removed. The kinds stay here (and in the checkout
// route / kassa/valmis) only so a Stripe session created before that removal
// still resolves to the right label and amount. Do not surface them again
// without building the fulfilment behind them.

export const PRICES = {
  existingReport: Number(process.env.PRICE_EXISTING_REPORT ?? 7900), // 79 € — data already on file
  importReport: Number(process.env.PRICE_IMPORT_REPORT ?? 9900), // 99 € — user imports statements, no data sharing
  shareDiscount: Number(process.env.PRICE_SHARE_DISCOUNT ?? 2000), // 20 € off (import + share = 79 €, same as on-file)
  creditsafeReport: Number(process.env.PRICE_CREDITSAFE_REPORT ?? 12900), // 129 € — we retrieve the statements
} as const

// "existing"  -> we already hold the financial statements
// "import"    -> user uploads five years of PDF statements
// "creditsafe"-> user has no statements; we fetch them from CreditSafe / provider
export type ReportKind = 'existing' | 'import' | 'creditsafe'

export function eur(cents: number): string {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: 'EUR',
  }).format(cents / 100)
}

export interface PriceQuote {
  kind: ReportKind
  shareData: boolean
  base: number
  discount: number
  total: number
}

export function quote(kind: ReportKind, shareData: boolean): PriceQuote {
  const base =
    kind === 'creditsafe'
      ? PRICES.creditsafeReport
      : kind === 'import'
        ? PRICES.importReport
        : PRICES.existingReport
  // The data-sharing discount only applies to statements the user imports.
  const discount = kind === 'import' && shareData ? PRICES.shareDiscount : 0
  return {
    kind,
    shareData,
    base,
    discount,
    total: Math.max(0, base - discount),
  }
}
