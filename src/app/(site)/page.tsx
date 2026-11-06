import type { Metadata } from 'next'
import { Fragment } from 'react'
import { getPageContent, getSiteSettings } from '@/content/server'
import { safeJsonLd } from '@/lib/jsonld'
import { SITE_URL } from '@/lib/site'
import { ComparisonSection } from '@/components/sections/ComparisonSection'
import { CompanyExamplesSection } from '@/components/sections/CompanyExamplesSection'
import { FaqSection } from '@/components/sections/FaqSection'
import { FeatureGridSection } from '@/components/sections/FeatureGridSection'
import { FinalCtaSection } from '@/components/sections/FinalCtaSection'
import { HeroSection } from '@/components/sections/HeroSection'
import { HowItWorksSection } from '@/components/sections/HowItWorksSection'
import { MethodologySection } from '@/components/sections/MethodologySection'
import { PricingSection } from '@/components/sections/PricingSection'
import { SampleReportsSection } from '@/components/sections/SampleReportsSection'
import { UseCasesSection } from '@/components/sections/UseCasesSection'

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPageContent('fi', 'home')
  return {
    title: page.metadata.title,
    description: page.metadata.description,
    alternates: { canonical: '/' },
  }
}

function jsonLd(page: Awaited<ReturnType<typeof getPageContent>>, siteName: string) {
  const faq = page.sections.find((s) => s.type === 'faq' && s.visible) as
    | { items?: { question: string; answer: string }[] }
    | undefined
  const graph: object[] = [
    {
      '@type': 'Organization',
      '@id': `${SITE_URL}/#organization`,
      name: 'Valuatum Oy',
      url: SITE_URL,
      logo: `${SITE_URL}/logo.svg`,
      email: 'company-valuation@valuatum.com',
      sameAs: ['https://www.valuatum.com'],
    },
    {
      '@type': 'WebSite',
      '@id': `${SITE_URL}/#website`,
      name: siteName,
      url: SITE_URL,
      publisher: { '@id': `${SITE_URL}/#organization` },
    },
    {
      '@type': 'Service',
      name: 'AI-arvonmääritysraportti',
      serviceType: 'Yrityksen arvonmääritys',
      areaServed: 'FI',
      provider: { '@id': `${SITE_URL}/#organization` },
      description:
        'AI-avusteinen yrityksen arvonmääritysraportti suomalaiselle yritykselle: arvio yrityksen arvosta, arvostusväli, käytetyt ja hylätyt menetelmät, skenaariot, riskit ja arvon ajurit PDF-muodossa.',
      offers: {
        '@type': 'Offer',
        price: '79',
        priceCurrency: 'EUR',
        description: 'Yksittäinen raportti, 79 € sis. alv (aloitushinta)',
      },
    },
  ]
  if (faq?.items?.length) {
    graph.push({
      '@type': 'FAQPage',
      mainEntity: faq.items.map((i) => ({
        '@type': 'Question',
        name: i.question,
        acceptedAnswer: { '@type': 'Answer', text: i.answer },
      })),
    })
  }
  return { '@context': 'https://schema.org', '@graph': graph }
}

export default async function HomePage() {
  const [page, site] = await Promise.all([getPageContent('fi', 'home'), getSiteSettings()])

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd(page, site.name)) }}
      />
      {page.sections
        .filter((section) => section.visible)
        .map((section) => {
          switch (section.type) {
            case 'hero':
              return <HeroSection key={section.id} {...section} contactEmail={site.contactEmail} />
            case 'sampleReports':
              return (
                <Fragment key={section.id}>
                  <SampleReportsSection {...section} />
                  <CompanyExamplesSection />
                </Fragment>
              )
            case 'featureGrid':
              return <FeatureGridSection key={section.id} {...section} />
            case 'comparison':
              return <ComparisonSection key={section.id} {...section} />
            case 'useCases':
              return <UseCasesSection key={section.id} {...section} />
            case 'howItWorks':
              return <HowItWorksSection key={section.id} {...section} />
            case 'pricing':
              return <PricingSection key={section.id} {...section} />
            case 'methodology':
              return <MethodologySection key={section.id} {...section} />
            case 'faq':
              return <FaqSection key={section.id} {...section} />
            case 'finalCta':
              return <FinalCtaSection key={section.id} {...section} />
          }
        })}
    </>
  )
}
