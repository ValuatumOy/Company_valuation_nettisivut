// Company data access layer.
//
// In production this proxies the Valuatum backend (set VALUATUM_DATA_API_URL).
// Until that is wired up, a small bundled sample of Finnish companies is used so
// the search, results and buy flows are fully demonstrable end-to-end.

export interface Company {
  id: string // internal slug used in URLs
  name: string
  /**
   * Valuatum's raw company code. NOT for display: live results carry the
   * konserni "K" suffix (`26466749K`) and usually no dash. This is the value
   * checkout and getById must keep using — dropping the K silently switches the
   * report from konserni to emo figures (see backend HANDOFF 2026-07-09).
   */
  businessId: string
  /** The same y-tunnus in the Finnish 7+1 format, for display only. */
  businessIdFormatted: string
  /** Valuatum's "K" suffix: this row is the konserni (group) model. */
  isGroup: boolean
  city: string
  industry: string
  /**
   * Whether we already hold the financial statements for this company.
   * - true  -> "existing data" report, instant generation
   * - false -> user chooses upload ('import') or fetch ('creditsafe')
   */
  hasFinancials: boolean
  latestRevenueEur?: number
  employees?: number
}

/**
 * What the data sources produce. The display fields are derived centrally in
 * `withDisplay` so no source can forget them.
 */
type CompanySeed = Omit<Company, 'businessIdFormatted' | 'isGroup'>

/**
 * Shortest query Valuatum's /company will accept — anything shorter comes back
 * as a 400 ("The search parameter name must contain at least 3 characters"),
 * which the site would only be able to render as "not found".
 */
export const MIN_QUERY_LENGTH = 3

/** Digits-only comparison key: `2646674-9`, `26466749` and `26466749K` all match. */
function idKey(code: string): string {
  return code.trim().replace(/[\s-]/g, '').toUpperCase().replace(/K$/, '')
}

function isGroupCode(code: string): boolean {
  return /^\d{8}K$/i.test(code.trim().replace(/[\s-]/g, ''))
}

/** `26466749K` / `26466749` -> `2646674-9`. Anything unexpected passes through. */
export function formatBusinessId(code: string): string {
  const digits = idKey(code)
  return /^\d{8}$/.test(digits) ? `${digits.slice(0, 7)}-${digits[7]}` : code
}

export function companyDisplayName(c: Pick<Company, 'name' | 'isGroup'>): string {
  return c.isGroup ? `${c.name} – Konserni` : c.name
}

function withDisplay(c: CompanySeed): Company {
  return {
    ...c,
    businessIdFormatted: formatBusinessId(c.businessId),
    isGroup: isGroupCode(c.businessId),
  }
}

// --- Bundled sample dataset (Finnish private companies) ------------------------
const SAMPLE: CompanySeed[] = [
  {
    id: 'rovio-entertainment',
    name: 'Rovio Entertainment Oyj',
    businessId: '1863026-2',
    city: 'Espoo',
    industry: 'Mobiilipelit',
    hasFinancials: true,
    latestRevenueEur: 318_000_000,
    employees: 530,
  },
  {
    id: 'wolt-enterprises',
    name: 'Wolt Enterprises Oy',
    businessId: '2646674-9',
    city: 'Helsinki',
    industry: 'Ruoka- ja vähittäiskaupan jakelu',
    hasFinancials: true,
    latestRevenueEur: 2_200_000_000,
    employees: 8000,
  },
  {
    id: 'supercell',
    name: 'Supercell Oy',
    businessId: '2336509-6',
    city: 'Helsinki',
    industry: 'Mobiilipelit',
    hasFinancials: true,
    latestRevenueEur: 1_540_000_000,
    employees: 490,
  },
  {
    id: 'relex-solutions',
    name: 'Relex Oy',
    businessId: '2096225-2',
    city: 'Helsinki',
    industry: 'Toimitusketjun ohjelmistot',
    hasFinancials: true,
    latestRevenueEur: 280_000_000,
    employees: 2000,
  },
  {
    id: 'oura-health',
    name: 'Oura Health Oy',
    businessId: '2545538-2',
    city: 'Oulu',
    industry: 'Terveysteknologia / puettavat laitteet',
    hasFinancials: true,
    latestRevenueEur: 360_000_000,
    employees: 850,
  },
  {
    id: 'iceye',
    name: 'ICEYE Oy',
    businessId: '2766397-6',
    city: 'Espoo',
    industry: 'Satelliittikuvantaminen (SAR)',
    hasFinancials: true,
    latestRevenueEur: 150_000_000,
    employees: 700,
  },
  {
    id: 'varjo-technologies',
    name: 'Varjo Technologies Oy',
    businessId: '2811597-7',
    city: 'Helsinki',
    industry: 'VR/XR-laitteet',
    hasFinancials: true,
    latestRevenueEur: 35_000_000,
    employees: 250,
  },
  {
    id: 'ponsse',
    name: 'Ponsse Oyj',
    businessId: '0533556-9',
    city: 'Vieremä',
    industry: 'Metsäkoneet',
    hasFinancials: true,
    latestRevenueEur: 760_000_000,
    employees: 2100,
  },
]

interface DataSource {
  search(query: string, limit?: number): Promise<CompanySeed[]>
  getById(id: string): Promise<CompanySeed | null>
}

class MockDataSource implements DataSource {
  async search(query: string, limit = 8): Promise<CompanySeed[]> {
    const q = query.trim().toLowerCase()
    if (!q) return []
    const matches = SAMPLE.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.businessId.replace('-', '').includes(q.replace('-', '')) ||
        c.industry.toLowerCase().includes(q) ||
        c.city.toLowerCase().includes(q)
    )
    return matches.slice(0, limit)
  }

  async getById(id: string): Promise<CompanySeed | null> {
    return SAMPLE.find((c) => c.id === id) ?? null
  }
}

// Proxy hook: when VALUATUM_DATA_API_URL is set, all reads go to a backend
// that already speaks the Company shape (name/businessId/city/industry/...).
class ApiDataSource implements DataSource {
  constructor(
    private baseUrl: string,
    private apiKey: string | undefined
  ) {}

  private headers(): HeadersInit {
    const h: Record<string, string> = { Accept: 'application/json' }
    if (this.apiKey) h.Authorization = `Bearer ${this.apiKey}`
    return h
  }

  async search(query: string, limit = 8): Promise<CompanySeed[]> {
    const url = new URL(`${this.baseUrl}/companies/search`)
    url.searchParams.set('q', query)
    url.searchParams.set('limit', String(limit))
    const res = await fetch(url, { headers: this.headers(), cache: 'no-store' })
    if (!res.ok) throw new Error(`Company search failed: ${res.status}`)
    return (await res.json()) as CompanySeed[]
  }

  async getById(id: string): Promise<CompanySeed | null> {
    const res = await fetch(`${this.baseUrl}/companies/${encodeURIComponent(id)}`, {
      headers: this.headers(),
      cache: 'no-store',
    })
    if (res.status === 404) return null
    if (!res.ok) throw new Error(`Company fetch failed: ${res.status}`)
    return (await res.json()) as CompanySeed
  }
}

type ValuatumCandidate = {
  fid: number
  company_name: string | null
  company_code: string | null
  /** Postal town from Valuatum's companyData; absent on older backends. */
  city?: string | null
  industry_text: string | null
}

// Real "any company" lookup: the report-generation backend already resolves
// a name/y-tunnus to a Valuatum FID (used by /testi and the paid checkout
// flow) — this just reuses that same public endpoint for homepage search, so
// the site isn't limited to the bundled sample anymore. A Valuatum hit always
// means we can generate a report for it (that's what "existing financials"
// means here), so hasFinancials is always true for these results.
class ValuatumDataSource implements DataSource {
  constructor(private baseUrl: string) {}

  private toCompany(c: ValuatumCandidate): CompanySeed {
    // Keep company_code verbatim, K suffix and all: it is both the URL id and
    // what checkout sends back to the backend to resolve the FID.
    const businessId = c.company_code || String(c.fid)
    return {
      id: businessId,
      name: c.company_name || businessId,
      businessId,
      city: c.city || '',
      industry: c.industry_text || '',
      hasFinancials: true,
    }
  }

  async search(query: string, limit = 8): Promise<CompanySeed[]> {
    const url = new URL(`${this.baseUrl}/api/public/company-search`)
    url.searchParams.set('q', query)
    // Cached rather than no-store: this lookup costs ~1.4 s upstream, and the
    // same query gets repeated constantly (search-as-you-type, then getById
    // when the visitor clicks a result). Company master data tolerates 5 min.
    const res = await fetch(url, { next: { revalidate: 300 } })
    if (!res.ok) throw new Error(`Company search failed: ${res.status}`)
    const rows = (await res.json()) as ValuatumCandidate[]
    return rows.slice(0, limit).map((c) => this.toCompany(c))
  }

  async getById(id: string): Promise<CompanySeed | null> {
    const rows = await this.search(id, 5)
    return (
      // Exact code first (`26466749K` from the URL matches the konserni row),
      // then K-insensitively, so a plain y-tunnus still finds a group-only
      // company instead of falling through to an unrelated first result.
      rows.find((c) => c.businessId.toUpperCase() === id.toUpperCase()) ||
      rows.find((c) => idKey(c.businessId) === idKey(id)) ||
      rows[0] ||
      null
    )
  }
}

// Bundled sample stays searchable too (curated copy, revenue/employee
// figures the live lookup can't cheaply provide) — merged with live results,
// deduped by y-tunnus, live results first.
class CombinedDataSource implements DataSource {
  constructor(
    private live: DataSource,
    private mock: DataSource
  ) {}

  async search(query: string, limit = 8): Promise<CompanySeed[]> {
    const [liveResults, mockResults] = await Promise.all([
      this.live.search(query, limit).catch(() => [] as CompanySeed[]),
      this.mock.search(query, limit),
    ])
    // idKey, not a bare dash strip: the live row for a sample company arrives
    // as `26466749K` and would otherwise duplicate the curated `2646674-9`.
    const seen = new Set(liveResults.map((c) => idKey(c.businessId)))
    const merged = [
      ...liveResults,
      ...mockResults.filter((c) => !seen.has(idKey(c.businessId))),
    ]
    return merged.slice(0, limit)
  }

  async getById(id: string): Promise<CompanySeed | null> {
    const sample = await this.mock.getById(id)
    if (sample) return sample
    return this.live.getById(id).catch(() => null)
  }
}

function source(): DataSource {
  if (process.env.VALUATUM_DATA_API_URL) {
    return new ApiDataSource(process.env.VALUATUM_DATA_API_URL, process.env.VALUATUM_DATA_API_KEY)
  }
  const backend =
    process.env.NEXT_PUBLIC_ORDERS_API ?? 'https://valu-pipeline-production-88f2.up.railway.app'
  return new CombinedDataSource(new ValuatumDataSource(backend), new MockDataSource())
}

export async function searchCompanies(query: string, limit?: number): Promise<Company[]> {
  return (await source().search(query, limit)).map(withDisplay)
}

export async function getCompany(id: string): Promise<Company | null> {
  const seed = await source().getById(id)
  return seed ? withDisplay(seed) : null
}

/**
 * A curated set of companies for browse/listing views. Always the bundled
 * sample — a live Valuatum search has no sensible "browse everything" query.
 */
export async function featuredCompanies(limit = 8): Promise<Company[]> {
  return SAMPLE.slice(0, limit).map(withDisplay)
}
