import type { PageSection } from '@/content/schema'

type Props = Extract<PageSection, { type: 'finalCta' }>

export function FinalCtaSection({ title, copy, cta, secondaryCta }: Props) {
  return (
    <section className="bg-forest py-20 text-white lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="max-w-3xl text-balance text-3xl font-medium tracking-[-0.02em] sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-white/80">{copy}</p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-4">
          <a
            href={cta.href}
            className="inline-flex min-h-11 items-center justify-center rounded-lg bg-green px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-green-deep active:bg-green-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-light"
          >
            {cta.label}
          </a>
          <a
            href={secondaryCta.href}
            className="inline-flex min-h-11 items-center text-sm font-medium text-green-light underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-light"
          >
            {secondaryCta.label} →
          </a>
        </div>
      </div>
    </section>
  )
}
