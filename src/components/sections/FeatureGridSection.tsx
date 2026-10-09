import type { PageSection } from '@/content/schema'

type Props = Extract<PageSection, { type: 'featureGrid' }>

export function FeatureGridSection({ title, subtitle, items }: Props) {
  const groups = [...new Set(items.map((item) => item.group))]

  return (
    <section id="sisalto" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-charcoal-mid">{subtitle}</p>
        <div className="mt-10 divide-y divide-mist border-t border-mist">
          {groups.map((group) => (
            <div key={group} className="grid gap-4 py-6 md:grid-cols-[0.7fr_1.3fr] md:gap-10">
              <h3 className="text-lg font-medium text-charcoal">{group}</h3>
              <ul className="list-disc space-y-2 pl-5 text-base leading-relaxed text-charcoal-mid">
                {items.filter((item) => item.group === group).map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
