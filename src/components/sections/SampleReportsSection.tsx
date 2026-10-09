import type { PageSection } from '@/content/schema'
import { ArrowRightIcon } from '@/components/icons'

type Props = Extract<PageSection, { type: 'sampleReports' }>

export function SampleReportsSection({ title, subtitle, ctaLabel, reports }: Props) {
  return (
    <section id="esimerkit" className="bg-off-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl">{title}</h2>
        <p className="mt-5 max-w-2xl text-pretty text-base leading-relaxed text-charcoal-mid">{subtitle}</p>
        <div className="mt-10 divide-y divide-mist border-y border-mist">
          {reports.map((report) => (
            <article key={report.id} className="grid gap-5 py-7 md:grid-cols-[0.7fr_1.3fr] md:gap-10">
              <div>
                <h3 className="text-xl font-medium tracking-tight text-charcoal">{report.name}</h3>
                <p className="mt-2 text-sm text-charcoal-mid">{report.tag}</p>
              </div>
              <div>
                <p className="max-w-2xl text-base leading-relaxed text-charcoal-mid">{report.description}</p>
                <ul className="mt-4 list-disc space-y-1 pl-5 text-sm leading-relaxed text-charcoal-mid">
                  {report.features.map((feature) => <li key={feature}>{feature}</li>)}
                </ul>
                {report.pdfUrl && !report.pdfUrl.startsWith('#') ? (
                  <a
                    href={report.pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-4 inline-flex min-h-11 items-center gap-2 text-sm font-medium text-green-deep underline-offset-4 hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep"
                  >
                    {ctaLabel}
                    <ArrowRightIcon className="h-4 w-4" />
                  </a>
                ) : (
                  <p className="mt-5 text-sm text-charcoal-mid">Esimerkki tulossa</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
