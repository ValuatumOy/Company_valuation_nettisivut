import Link from 'next/link'
import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { companyDisplayName, getCompany } from '@/lib/companies'
import { BuyBox } from '@/components/BuyBox'
import { Reveal } from '@/components/Reveal'

// Was force-dynamic, which re-ran the ~1.4 s Valuatum lookup on every single
// visit. Company master data (name, y-tunnus, toimiala) doesn't change by the
// minute, so cache the rendered page and let it revalidate in the background.
export const revalidate = 300

type Params = Promise<{ id: string }>

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { id } = await params
  const company = await getCompany(id)
  if (!company) return { title: 'Yritystä ei löytynyt | Valuatum' }
  return {
    title: `${companyDisplayName(company)} — yrityksen arvonmääritys | Valuatum`,
    description: `Tilaa tekoälyavusteinen arvonmääritysraportti yritykselle ${company.name} (${company.businessIdFormatted}). DCF, EVA-täsmäytys, skenaariot ja riskiarvio yhdessä PDF-raportissa.`,
  }
}

// No Liikevaihto tile: /rest/company carries no revenue, so it showed "–" for
// every live company. Bringing it back means a per-company /rest/modeldata
// call — Company.latestRevenueEur is still there, and the bundled sample still
// carries the figures.

// Mirrors the section list of the actual delivered report — see the sample PDF
// at /samples/esimerkki_ilmainen.pdf before changing this.
const FEATURES = [
  'Tiivistelmä, avainluvut ja luottamustaso',
  'Datan laatuluokka, lähteet ja rajoitteet',
  'Liiketoimintaprofiili, markkina ja kilpailijat',
  'Markkinasignaalit ja strateginen arvo',
  'Historiallinen kehitys ja henkilöstötehokkuus',
  '10 vuoden ennuste ja arvio sen uskottavuudesta',
  'Menetelmien pisteytys: hyväksytyt ja hylätyt',
  'DCF-laskelma ja WACC-parametrit',
  'EVA-täsmäytys ja Verohallinnon mallin ristiintarkistus',
  'Herkkyysanalyysi ja skenaariot todennäköisyyksineen',
  'Riskit, arvon ajurit ja mikä liikuttaisi arviota',
  'Tilinpäätöstaulukot, lähderekisteri ja metodologia',
]

export default async function CompanyPage({ params }: { params: Params }) {
  const { id } = await params
  const company = await getCompany(id)
  if (!company) notFound()

  return (
    <>
      <section className="relative overflow-hidden bg-forest text-white">
        <div className="hero-pattern absolute inset-0" />
        <div className="relative mx-auto max-w-7xl px-6 pb-14 pt-32 lg:px-10 lg:pb-16 lg:pt-40">
          <Link
            href="/yritys"
            className="text-sm text-white/50 transition-colors hover:text-white"
          >
            ← Takaisin hakuun
          </Link>
          <div className="mt-6 flex flex-wrap items-center gap-4">
            <h1 className="text-balance text-4xl font-light leading-[1.1] tracking-[-0.02em] lg:text-5xl">
              {companyDisplayName(company)}
            </h1>
            {company.hasFinancials && (
              <span className="rounded-full border border-green-light/30 bg-green/15 px-3.5 py-1.5 text-[12.5px] font-medium text-green-light">
                Tilinpäätöstiedot valmiina
              </span>
            )}
          </div>
          <p className="mt-4 text-[15px] font-light text-white/60">
            {[`Y-tunnus ${company.businessIdFormatted}`, company.city, company.industry]
              .filter(Boolean)
              .join(' · ')}
          </p>
        </div>
      </section>

      <section className="bg-off-white py-16 lg:py-24">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_400px] lg:px-10">
          <div>
            <Reveal>
              <dl className="grid gap-px overflow-hidden rounded-3xl border border-mist bg-mist sm:grid-cols-3">
                <Fact label="Y-tunnus" value={company.businessIdFormatted} />
                <Fact label="Kotipaikka" value={company.city || '–'} />
                <Fact label="Toimiala" value={company.industry || '–'} />
              </dl>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-8 rounded-3xl border border-mist bg-white p-8">
                <p className="text-[13px] font-semibold uppercase tracking-[0.14em] text-green-deep">
                  Raportin sisältö
                </p>
                <h2 className="mt-3 text-3xl font-light tracking-[-0.02em] text-charcoal">
                  Mitä raportti sisältää
                </h2>
                <p className="mt-4 max-w-2xl text-[15px] font-light leading-relaxed text-charcoal-mid">
                  Jäsennelty PDF-muotoinen arvonmääritysraportti yrityksestä {company.name} —
                  perusteltu analyysi, ei pelkkä tunnuslukukooste.
                </p>
                <ul className="mt-7 grid gap-3 sm:grid-cols-2">
                  {FEATURES.map((f) => (
                    <li
                      key={f}
                      className="flex gap-3 rounded-2xl border border-mist bg-off-white px-4 py-3 text-sm text-charcoal"
                    >
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-green" />
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
                <p className="mt-7 border-t border-mist pt-4 text-[13px] leading-relaxed text-steel">
                  Raportti on analyysi päätöksenteon tueksi. Se ei ole tilintarkastus, fairness
                  opinion eikä sijoitusneuvontaa.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={150} className="lg:sticky lg:top-28 lg:self-start">
            <BuyBox
              companyId={company.id}
              // Name and businessId stay raw here — they are forwarded to
              // checkout and on to the backend. fid rides along and is what
              // actually decides konserni vs emo there (the backend's own
              // lookup drops the K suffix). isGroup only drives the label.
              companyName={company.name}
              businessId={company.businessId}
              fid={company.fid}
              isGroup={company.isGroup}
            />
          </Reveal>
        </div>
      </section>
    </>
  )
}

function Fact({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-white p-5">
      <dt className="text-[11px] font-semibold uppercase tracking-[0.12em] text-steel">{label}</dt>
      <dd className="mt-2 text-sm font-medium text-charcoal">{value}</dd>
    </div>
  )
}
