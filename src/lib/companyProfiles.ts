import companyProfileData from '@/data/company-profiles.json'

export interface CompanyProfileYear {
  year: number
  revenueEur: number
  ebitEur: number
  netDebtEur: number | null
}

export interface CompanyProfile {
  slug: string
  businessId: string
  fid: number
  name: string
  isGroup: boolean
  city?: string
  industry?: string
  sourceLabel: string
  sourceUrl: string
  sourceUnit: string
  retrievedAt: string
  years: CompanyProfileYear[]
  orderId: string
}

const profiles = companyProfileData satisfies CompanyProfile[]

function businessIdKey(value: string): string {
  return value.trim().replace(/[\s-]/g, '').toUpperCase()
}

const profilesBySlug = new Map(profiles.map((profile) => [profile.slug, profile]))
const profilesByBusinessId = new Map(
  profiles.map((profile) => [businessIdKey(profile.businessId), profile])
)

export function listCompanyProfiles(): readonly CompanyProfile[] {
  return profiles
}

export function getCompanyProfileBySlug(slug: string): CompanyProfile | undefined {
  return profilesBySlug.get(slug)
}

export function getCompanyProfileByBusinessId(
  businessId: string
): CompanyProfile | undefined {
  return profilesByBusinessId.get(businessIdKey(businessId))
}
