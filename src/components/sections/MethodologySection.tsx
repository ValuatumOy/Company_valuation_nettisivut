import type { PageSection } from '@/content/schema'

type Props = Extract<PageSection, { type: 'methodology' }>

export function MethodologySection({ title, intro, points, stats, disclaimer }: Props) {
  return (
    <section id="menetelma" className="bg-off-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="max-w-3xl text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-3xl text-pretty text-base leading-relaxed text-charcoal-mid">{intro}</p>
        <div className="mt-10 grid items-start gap-10 lg:grid-cols-[1.3fr_0.7fr] lg:gap-16">
          <div className="divide-y divide-mist border-t border-mist">
            {points.map((point) => (
              <div key={point.id} className="py-6">
                <h3 className="text-lg font-medium text-charcoal">{point.title}</h3>
                <p className="mt-3 text-base leading-relaxed text-charcoal-mid">{point.description}</p>
              </div>
            ))}
          </div>
          <aside className="border-t border-mist pt-6">
            <p className="text-lg font-medium text-charcoal">Valuatum Oy · Helsinki</p>
            <p className="mt-2 text-sm leading-relaxed text-charcoal-mid">Arvonmääritys- ja analyysijärjestelmiä vuodesta 2000</p>
            <dl className="mt-6 space-y-5">
              {stats.map((stat) => (
                <div key={stat.id} className="flex items-baseline gap-4">
                  <dt className="w-14 shrink-0 text-lg font-medium tabular-nums text-green-deep">{stat.value}</dt>
                  <dd className="text-sm leading-relaxed text-charcoal-mid">{stat.label}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-8 border-t border-mist pt-5 text-sm leading-relaxed text-charcoal-mid">{disclaimer}</p>
          </aside>
        </div>
      </div>
    </section>
  )
}
