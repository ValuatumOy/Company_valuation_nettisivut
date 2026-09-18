import Link from 'next/link'
import type { Metadata } from 'next'
import { listCompanyProfiles } from '@/lib/companyProfiles'
import { SITE_URL } from '@/lib/site'
import { safeJsonLd } from '@/lib/jsonld'

export const metadata: Metadata = {
  title: 'Yritysten taloustiedot ja arvonmääritys | Valuatum',
  description:
    'Tarkastele yritysten tilikausittaisia liikevaihto- ja liiketuloslukuja lähteineen. Yrityskohtainen arvonmääritysraportti laaditaan erikseen tilauksesta.',
  alternates: { canonical: '/yritykset' },
}

function jsonLd() {
  const url = `${SITE_URL}/yritykset`
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
        name: 'Yritysten taloustiedot ja arvonmääritys',
        description:
          'Yrityskohtaisia tilikausittaisia taloustietoja ja niiden lähteet.',
        inLanguage: 'fi-FI',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Etusivu', item: SITE_URL },
          { '@type': 'ListItem', position: 2, name: 'Yritysten taloustiedot', item: url },
        ],
      },
    ],
  }
}

export default function CompanyProfilesPage() {
  const profiles = listCompanyProfiles()

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: safeJsonLd(jsonLd()) }} />
      <section className="relative bg-forest text-white">
        <div className="absolute inset-0 overflow-hidden">
          <div className="hero-pattern absolute inset-0" />
          <div className="hero-glow absolute left-1/2 top-0 h-[460px] w-[760px] -translate-x-1/2" />
        </div>
        <div className="relative mx-auto max-w-7xl px-6 pb-16 pt-36 lg:px-10 lg:pb-20 lg:pt-44">
          <p className="text-[12px] font-semibold uppercase tracking-[0.15em] text-green-light">
            Yritysten taloustiedot
          </p>
          <h1 className="mt-3 max-w-3xl text-balance text-4xl font-light leading-[1.08] tracking-[-0.025em] sm:text-5xl lg:text-[3.5rem]">
            Yrityksen talous näkyviin tilikausi kerrallaan
          </h1>
          <p className="mt-5 max-w-2xl text-[16px] font-light leading-relaxed text-white/70">
            Tarkastele lähteistettyä liikevaihto- ja liiketuloshistoriaa. Maksuton sivu kertoo toteutuneista luvuista; arvonmääritysraportti arvioi tulevaa kehitystä erikseen.
          </p>
          <Link
            href="/yritys"
            className="mt-7 inline-flex min-h-11 items-center rounded-full border border-white/25 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
          >
            Hae muuta yritystä <span className="ml-2" aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <section className="bg-off-white py-12 md:py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-green-deep">Yritysprofiilit</p>
              <h2 className="mt-2 text-2xl font-light tracking-tight text-charcoal sm:text-3xl">
                Avaa tilinpäätöshistoria
              </h2>
            </div>
            <p className="max-w-md text-sm font-light leading-relaxed text-charcoal-mid">
              Jokaisella sivulla näet tilikausittaiset luvut, laskennan rajat ja tiedon lähteen.
            </p>
          </div>

          {profiles.length > 0 ? (
            <ul className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {profiles.map((profile) => {
                const years = [...profile.years].sort((a, b) => a.year - b.year)
                const firstYear = years[0]?.year
                const lastYear = years.at(-1)?.year
                return (
                  <li key={profile.slug}>
                    <Link
                      href={`/yritykset/${profile.slug}`}
                      className="group flex h-full flex-col rounded-2xl border border-mist bg-white p-6 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-green/50 hover:shadow-[0_14px_38px_rgba(18,35,27,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                    >
                      <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-green-deep">
                        {profile.isGroup ? 'Konserni' : 'Yhtiö'}
                      </span>
                      <span className="mt-2 text-xl font-light tracking-tight text-charcoal group-hover:text-green-deep">
                        {profile.name}
                      </span>
                      <span className="mt-1 text-xs text-steel">Y-tunnus {profile.businessId}</span>
                      {(profile.city || profile.industry) && (
                        <span className="mt-3 text-sm text-charcoal-mid">
                          {[profile.city, profile.industry].filter(Boolean).join(' · ')}
                        </span>
                      )}
                      <span className="mt-auto flex items-center justify-between gap-4 border-t border-mist pt-5 text-xs text-steel">
                        <span>{firstYear && lastYear ? `Tilikaudet ${firstYear}–${lastYear}` : 'Tilikausihistoria'}</span>
                        <span className="font-medium text-green-deep">Avaa tiedot <span aria-hidden="true">→</span></span>
                      </span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="mt-8 rounded-2xl border border-mist bg-white p-6 text-sm text-charcoal-mid">
              Yritysprofiileja ei ole juuri nyt saatavilla. Voit hakea yritystä nimellä tai Y-tunnuksella.
            </p>
          )}
        </div>
      </section>
    </>
  )
}
