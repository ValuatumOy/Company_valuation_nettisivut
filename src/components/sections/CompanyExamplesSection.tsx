import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons'
import { listCompanyProfiles, type CompanyProfile } from '@/lib/companyProfiles'

const featuredSlugs = [
  'kamrock-2749011-8',
  'lvi-aman-2655476-5',
  'varusteleka-2082907-8',
] as const

function getFeaturedProfiles(): CompanyProfile[] {
  const profiles = listCompanyProfiles()

  return featuredSlugs.flatMap((slug) => {
    const profile = profiles.find((candidate) => candidate.slug === slug)
    return profile ? [profile] : []
  })
}

export function CompanyExamplesSection() {
  const profiles = getFeaturedProfiles()

  return (
    <section aria-labelledby="company-examples-heading" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2
              id="company-examples-heading"
              className="text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl"
            >
              Tutustu yritysten tilinpäätöshistoriaan
            </h2>
            <p className="mt-5 text-pretty text-base leading-relaxed text-charcoal-mid">
              Profiileissa voit tarkastella lähteistettyjä liikevaihto- ja liiketulostietoja tilikausittain.
              Ne kuvaavat toteutunutta kehitystä; yrityksen tulevaa arvoa arvioidaan erikseen tilattavassa
              arvonmääritysraportissa.
            </p>
          </div>
          <Link
            href="/yritykset"
            className="inline-flex min-h-11 shrink-0 items-center gap-2 self-start text-sm font-medium text-green-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep md:self-auto"
          >
            Kaikki {listCompanyProfiles().length} yritystä
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>
        <ul aria-label="Esimerkkejä yritysprofiileista" className="mt-10 divide-y divide-mist border-y border-mist">
          {profiles.map((profile) => {
            const years = [...profile.years].sort((a, b) => a.year - b.year)
            const firstYear = years[0]?.year
            const lastYear = years[years.length - 1]?.year

            return (
              <li key={profile.slug}>
                <Link
                  href={`/yritykset/${profile.slug}`}
                  aria-label={`Avaa yrityksen ${profile.name} taloustiedot`}
                  className="group flex flex-col justify-between gap-4 py-6 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="text-lg font-medium tracking-tight text-charcoal group-hover:text-green-deep">
                      {profile.name}
                    </h3>
                    <p className="mt-1 text-sm text-charcoal-mid">
                      {profile.city ? `${profile.city} · ` : ''}
                      {firstYear !== undefined && lastYear !== undefined
                        ? `Tilikaudet ${firstYear}–${lastYear}`
                        : 'Tilikausihistoria'}
                    </p>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-green-deep underline-offset-4 group-hover:underline">
                    Avaa taloustiedot
                    <ArrowRightIcon className="h-4 w-4" />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
