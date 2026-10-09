import type { PageSection } from '@/content/schema'

type Props = Extract<PageSection, { type: 'howItWorks' }>

export function HowItWorksSection({ title, steps }: Props) {
  return (
    <section className="bg-off-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl">{title}</h2>
        <ol className="mt-10 divide-y divide-mist border-t border-mist">
          {steps.map((step, index) => (
            <li key={step.id} className="grid grid-cols-[1.5rem_1fr] gap-4 py-6 md:grid-cols-[1.5rem_0.7fr_1.3fr] md:gap-6">
              <span aria-hidden className="text-lg font-medium tabular-nums text-green-deep">{index + 1}.</span>
              <h3 className="text-lg font-medium leading-snug text-charcoal">{step.title}</h3>
              <p className="col-start-2 text-base leading-relaxed text-charcoal-mid md:col-start-auto">{step.description}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
