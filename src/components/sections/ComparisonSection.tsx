import type { PageSection } from '@/content/schema'

type Props = Extract<PageSection, { type: 'comparison' }>

export function ComparisonSection({ title, intro, traditional, valuatum, footnote }: Props) {
  return (
    <section className="bg-forest py-20 text-white lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/80">{intro}</p>
        <div className="mt-10 grid gap-10 lg:grid-cols-2 lg:gap-16">
          {[traditional, valuatum].map((column) => (
            <div key={column.title} className="border-t border-white/25 pt-6">
              <h3 className="text-lg font-medium">{column.title}</h3>
              <ul className="mt-5 list-disc space-y-3 pl-5 text-base leading-relaxed text-white/80">
                {column.items.map((item) => <li key={item}>{item}</li>)}
              </ul>
            </div>
          ))}
        </div>
        <p className="mt-10 max-w-3xl text-sm leading-relaxed text-white/70">{footnote}</p>
      </div>
    </section>
  )
}
