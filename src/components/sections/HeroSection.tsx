import Image from 'next/image'
import type { PageSection } from '@/content/schema'
import { CompanySearch } from '@/components/CompanySearch'

type Props = Extract<PageSection, { type: 'hero' }> & { contactEmail: string }

export function HeroSection({ title, subtitle, trustLine, secondaryCta, mockup }: Props) {
  return (
    <section id="tilaa" className="bg-forest text-white">
      <div className="mx-auto max-w-6xl px-6 pb-20 pt-36 lg:px-10 lg:pb-24 lg:pt-44">
        <div className="grid items-start gap-16 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <h1 className="text-balance text-4xl font-medium leading-[1.1] tracking-[-0.03em] sm:text-5xl lg:text-[3.4rem]">
              {title}
            </h1>
            <p className="mt-6 max-w-xl text-pretty text-base leading-relaxed text-white/80 sm:text-lg">
              {subtitle}
            </p>
            <div className="mt-8">
              <CompanySearch variant="dark" />
              <p className="mt-3 text-sm leading-relaxed text-white/70">
                Hae yritys nimellä tai Y-tunnuksella → näet hinnan ja tilaat raportin.
              </p>
              <a
                href={secondaryCta.href}
                className="mt-5 inline-flex min-h-11 items-center text-sm font-medium text-green-light underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-light"
              >
                {secondaryCta.label} →
              </a>
            </div>
            <p className="mt-8 max-w-xl text-sm leading-relaxed text-white/70">{trustLine}</p>
          </div>

          <figure className="hidden rounded-xl bg-white p-7 text-charcoal lg:block">
            <figcaption className="mb-5 border-b border-mist pb-4 text-sm text-charcoal-mid">
              {mockup.footnote}
            </figcaption>
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-sm text-green-deep">{mockup.reportLabel}</p>
                <p className="mt-1 text-lg font-medium tracking-tight">{mockup.company}</p>
                <p className="mt-1 text-sm text-charcoal-mid">{mockup.businessId}</p>
              </div>
              <Image src="/logo.svg" alt="" width={28} height={28} />
            </div>
            <dl className="mt-6 space-y-4 tabular-nums">
              <div>
                <dt className="text-sm text-charcoal-mid">{mockup.valueLabel}</dt>
                <dd className="mt-1 text-3xl font-medium tracking-tight">{mockup.value}</dd>
              </div>
              <div className="flex items-baseline justify-between gap-4 text-sm">
                <dt className="text-charcoal-mid">{mockup.rangeLabel}</dt>
                <dd className="font-medium">{mockup.rangeLow} – {mockup.rangeHigh}</dd>
              </div>
            </dl>
            <div className="mt-6 border-t border-mist pt-5">
              <p className="text-sm font-medium">{mockup.methodsLabel}</p>
              <dl className="mt-3 space-y-2 text-sm tabular-nums">
                {mockup.methods.map((method) => (
                  <div key={method.id} className="flex justify-between gap-4">
                    <dt className="text-charcoal-mid">{method.name}</dt>
                    <dd>{method.weight} %</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="mt-6 border-t border-mist pt-5">
              <p className="text-sm font-medium">{mockup.risksLabel}</p>
              <ul className="mt-3 space-y-2 text-sm text-charcoal-mid">
                {mockup.risks.map((risk) => <li key={risk}>{risk}</li>)}
              </ul>
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
