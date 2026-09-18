import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { CompanyProfilePage } from '@/components/CompanyProfilePage'
import { getCompanyProfileBySlug, listCompanyProfiles } from '@/lib/companyProfiles'
import { SITE_URL } from '@/lib/site'
import { safeJsonLd } from '@/lib/jsonld'

export const dynamic = 'force-static'
export const dynamicParams = false

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return listCompanyProfiles().map(({ slug }) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = getCompanyProfileBySlug(slug)
  if (!profile) notFound()

  const canonical = `/yritykset/${profile.slug}`
  return {
    title: `${profile.name} – taloustiedot ja arvonmääritys | Valuatum`,
    description: `${profile.name}: tilikausittainen liikevaihto- ja liiketuloshistoria lähteineen. Tutustu lukuihin ja tilauksesta laadittavan raportin sisältöön.`,
    alternates: { canonical },
    openGraph: {
      title: `${profile.name} – taloustiedot ja arvonmääritys`,
      description: `Lähteistetty tilinpäätöshistoria yritykselle ${profile.name}.`,
      url: canonical,
      type: 'website',
    },
  }
}

function jsonLd(profile: NonNullable<ReturnType<typeof getCompanyProfileBySlug>>) {
  const url = `${SITE_URL}/yritykset/${profile.slug}`
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Valuatum Oy',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.svg`,
      },
      {
        '@type': 'WebPage',
        '@id': `${url}#webpage`,
        url,
        name: `${profile.name} – taloustiedot ja arvonmääritys`,
        description: `Lähteistetty tilikausittainen taloushistoria yritykselle ${profile.name}.`,
        inLanguage: 'fi-FI',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Etusivu', item: SITE_URL },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Yritysten taloustiedot',
            item: `${SITE_URL}/yritykset`,
          },
          { '@type': 'ListItem', position: 3, name: profile.name, item: url },
        ],
      },
    ],
  }
}

export default async function CompanyProfileRoute({ params }: Props) {
  const { slug } = await params
  const profile = getCompanyProfileBySlug(slug)
  if (!profile) notFound()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd(profile)) }} />
      <CompanyProfilePage profile={profile} />
    </>
  )
}
