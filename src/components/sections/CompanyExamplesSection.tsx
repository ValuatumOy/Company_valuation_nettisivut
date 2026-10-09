import Link from 'next/link'
import { ArrowRightIcon } from '@/components/icons'
import { Reveal } from '@/components/Reveal'
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
    <section aria-labelledby="company-examples-heading" className="bg-white py-16 md:py-20">
      <div className="mx-auto max-w-7xl px-6 lg:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div className="max-w-2xl">
            <h2
              id="company-examples-heading"
              className="text-balance text-3xl font-light tracking-[-0.02em] text-charcoal sm:text-4xl"
            >
              Tutustu yritysten tilinpäätöshistoriaan
            </h2>
            <p className="mt-4 max-w-2xl text-pretty text-[16px] font-light leading-relaxed text-charcoal-mid">
              Profiileissa voit tarkastella lähteistettyjä liikevaihto- ja liiketulostietoja tilikausittain.
              Ne kuvaavat toteutunutta kehitystä; yrityksen tulevaa arvoa arvioidaan erikseen tilattavassa
              arvonmääritysraportissa.
            </p>
          </div>

          <Link
            href="/yritykset"
            className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 self-start rounded-full bg-green px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-green-deep focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold md:self-auto"
          >
            Kaikki {listCompanyProfiles().length} yritystä
            <ArrowRightIcon className="h-4 w-4" />
          </Link>
        </div>

        <ul aria-label="Esimerkkejä yritysprofiileista" className="mt-8 grid gap-4 md:grid-cols-3">
          {profiles.map((profile, index) => {
            const years = [...profile.years].sort((a, b) => a.year - b.year)
            const firstYear = years[0]?.year
            const lastYear = years[years.length - 1]?.year

            return (
              <li key={profile.slug}>
                <Reveal delay={index * 80} className="h-full">
                  <Link
                    href={`/yritykset/${profile.slug}`}
                    aria-label={`Avaa yrityksen ${profile.name} taloustiedot`}
                    className="group flex h-full min-h-40 flex-col justify-between rounded-2xl border border-mist bg-off-white p-5 transition-[border-color,transform,box-shadow] duration-200 hover:-translate-y-0.5 hover:border-green/50 hover:shadow-[0_14px_38px_rgba(18,35,27,0.08)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gold"
                  >
                    <div>
                      <h3 className="text-lg font-medium tracking-tight text-charcoal transition-colors group-hover:text-green-deep">
                        {profile.name}
                      </h3>
                      <p className="mt-1 text-sm text-charcoal-mid">
                        {profile.city ? `${profile.city} · ` : ''}
                        {firstYear !== undefined && lastYear !== undefined
                          ? `Tilikaudet ${firstYear}–${lastYear}`
                          : 'Tilikausihistoria'}
                      </p>
                    </div>
                    <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-green-deep">
                      Avaa taloustiedot
                      <ArrowRightIcon className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </Reveal>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}
