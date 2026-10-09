import type { PageSection } from '@/content/schema'

type Props = Extract<PageSection, { type: 'useCases' }>

export function UseCasesSection({ title, cases }: Props) {
  return (
    <section className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl">{title}</h2>
        <div className="mt-10 grid gap-x-16 sm:grid-cols-2">
          {cases.map((useCase) => (
            <article key={useCase.id} className="border-t border-mist py-6">
              <h3 className="text-lg font-medium leading-snug text-charcoal">{useCase.title}</h3>
              <p className="mt-3 text-base leading-relaxed text-charcoal-mid">{useCase.description}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
