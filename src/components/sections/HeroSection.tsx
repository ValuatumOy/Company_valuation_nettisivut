import Image from 'next/image'
import type { PageSection } from '@/content/schema'
import { CompanySearch } from '@/components/CompanySearch'
import { Reveal } from '@/components/Reveal'

type Props = Extract<PageSection, { type: 'hero' }> & { contactEmail: string }

export function HeroSection({
  title,
  subtitle,
  trustLine,
  secondaryCta,
  mockup,
}: Props) {
  return (
    <section id="tilaa" className="relative bg-forest text-white">
      {/* overflow-hidden belongs on this decoration layer, not on the <section>:
          it has to keep the oversized glow from causing horizontal scroll, but
          clipping the section also clipped the search dropdown at the hero's
          bottom edge, which read as the results hiding under the next section. */}
      <div className="absolute inset-0 overflow-hidden">
        <Image
          src="/images/forest-fog.jpg"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-forest/70 via-forest/55 to-forest" />
        <div className="hero-pattern absolute inset-0" />
        <div className="hero-glow absolute left-1/2 top-0 h-[600px] w-[900px] -translate-x-1/2" />
      </div>

      <div className="relative mx-auto max-w-7xl px-6 pb-20 pt-36 lg:px-10 lg:pb-28 lg:pt-44">
        <div className="grid items-center gap-14 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Reveal delay={100}>
              <h1 className="text-balance text-[2.5rem] font-light leading-[1.08] tracking-[-0.02em] sm:text-5xl lg:text-[3.4rem]">
                {title}
              </h1>
            </Reveal>

            <Reveal delay={200}>
              <p className="mt-6 max-w-xl text-pretty text-[17px] font-light leading-relaxed text-white/75">
                {subtitle}
              </p>
            </Reveal>

            <Reveal delay={300}>
              <div className="mt-8">
                <CompanySearch variant="dark" />
                <p className="mt-3 text-[13px] font-light text-white/55">
                  Hae yritys nimellä tai Y-tunnuksella → näet hinnan ja tilaat raportin.
                </p>
                <div className="mt-4 text-[13px] text-white/55">
                  <a
                    href={secondaryCta.href}
                    className="font-medium text-green-light transition-colors duration-200 hover:text-white"
                  >
                    {secondaryCta.label} →
                  </a>
                </div>
              </div>
            </Reveal>

            <Reveal delay={500}>
              <p className="mt-8 max-w-xl border-l-2 border-green/50 pl-4 text-[13.5px] leading-relaxed text-white/55">
                {trustLine}
              </p>
            </Reveal>
          </div>

          {/* Report preview mockup — illustrative sample data only */}
          <Reveal delay={350} className="hidden lg:block">
            <div className="relative">
              <div className="absolute -inset-6 rounded-[32px] bg-green/10 blur-3xl" />
              <div className="relative rotate-1 rounded-2xl bg-white p-7 text-charcoal shadow-[0_24px_80px_rgba(0,0,0,0.45)] transition-transform duration-500 hover:rotate-0">
                <div className="flex items-center justify-between border-b border-mist pb-4">
                  <div>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-green-deep">
                      {mockup.reportLabel}
                    </p>
                    <p className="mt-1.5 text-lg font-medium tracking-tight">{mockup.company}</p>
                    <p className="text-xs text-steel">{mockup.businessId}</p>
                  </div>
                  <Image src="/logo.svg" alt="" width={28} height={28} />
                </div>

                <div className="mt-5 flex items-end justify-between">
                  <div>
                    <p className="text-xs text-steel">{mockup.valueLabel}</p>
                    <p className="text-[2.1rem] font-light tracking-tight text-charcoal">{mockup.value}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-steel">{mockup.rangeLabel}</p>
                    <p className="text-sm font-medium text-green-deep">
                      {mockup.rangeLow} – {mockup.rangeHigh}
                    </p>
                  </div>
                </div>

                <div className="mt-3 h-2 overflow-hidden rounded-full bg-mist">
                  <div className="method-bar h-full rounded-full bg-gradient-to-r from-green-light to-green" style={{ '--bar-width': '72%' } as React.CSSProperties} />
                </div>

                <div className="mt-6">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-steel">
                    {mockup.methodsLabel}
                  </p>
                  <ul className="mt-3 space-y-2.5">
                    {mockup.methods.map((method) => (
                      <li key={method.id} className="flex items-center gap-3">
                        <span className="w-28 shrink-0 text-xs text-charcoal-mid">{method.name}</span>
                        <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-off-white">
                          <span
                            className="method-bar block h-full rounded-full bg-green"
                            style={{ '--bar-width': `${method.weight}%` } as React.CSSProperties}
                          />
                        </span>
                        <span className="w-9 text-right text-xs font-medium text-steel">{method.weight} %</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-6 border-t border-mist pt-4">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-steel">
                    {mockup.risksLabel}
                  </p>
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {mockup.risks.map((risk) => (
                      <span key={risk} className="rounded-full bg-green-mist px-2.5 py-1 text-[11px] font-medium text-green-deep">
                        {risk}
                      </span>
                    ))}
                  </div>
                  <p className="mt-4 text-[10.5px] italic text-steel">{mockup.footnote}</p>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
