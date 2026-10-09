import type { PageSection } from '@/content/schema'

type Props = Extract<PageSection, { type: 'pricing' }>

export function PricingSection({ title, subtitle, vatNote, plans }: Props) {
  return (
    <section id="hinnoittelu" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-charcoal-mid">{subtitle}</p>
        <div className="mt-10 divide-y divide-mist border-y border-mist">
          {plans.map((plan) => (
            <article
              key={plan.id}
              className={`grid gap-6 py-8 md:grid-cols-[0.7fr_1.3fr] md:gap-10 ${plan.highlighted ? 'bg-green-faint px-5 md:px-6' : ''}`}
            >
              <div>
                <h3 className="text-lg font-medium text-charcoal">{plan.name}</h3>
                <p className="mt-3 flex flex-wrap items-baseline gap-2">
                  <span className="text-3xl font-medium tracking-tight text-charcoal">{plan.price}</span>
                  {plan.priceSuffix && <span className="text-sm text-charcoal-mid">{plan.priceSuffix}</span>}
                </p>
                {plan.badge && <p className="mt-2 text-sm text-green-deep">{plan.badge}</p>}
              </div>
              <div>
                <p className="max-w-2xl text-base leading-relaxed text-charcoal-mid">{plan.description}</p>
                <ul className="mt-5 list-disc space-y-2 pl-5 text-sm leading-relaxed text-charcoal-mid">
                  {plan.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                <a
                  href={plan.ctaHref}
                  className={`mt-6 inline-flex min-h-11 items-center justify-center rounded-lg px-5 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep ${plan.highlighted ? 'bg-green text-white hover:bg-green-deep active:bg-green-deep' : 'border border-mist text-green-deep hover:border-green-deep active:bg-green-faint'}`}
                >
                  {plan.ctaLabel}
                </a>
              </div>
            </article>
          ))}
        </div>
        <p className="mt-6 max-w-3xl text-sm leading-relaxed text-charcoal-mid">{vatNote}</p>
      </div>
    </section>
  )
}
