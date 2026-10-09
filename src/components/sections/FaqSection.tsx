'use client'

import { useState } from 'react'
import type { PageSection } from '@/content/schema'
import { ChevronDownIcon } from '@/components/icons'

type Props = Extract<PageSection, { type: 'faq' }>

export function FaqSection({ title, items }: Props) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <section id="ukk" className="bg-white py-20 lg:py-24">
      <div className="mx-auto max-w-6xl px-6 lg:px-10">
        <h2 className="text-balance text-3xl font-medium tracking-[-0.02em] text-charcoal sm:text-4xl">{title}</h2>
        <div className="mt-10 max-w-3xl divide-y divide-mist border-y border-mist">
          {items.map((item) => {
            const open = openId === item.id
            return (
              <div key={item.id} className="faq-item" data-open={open}>
                <button
                  type="button"
                  className="flex min-h-14 w-full items-center justify-between gap-6 py-5 text-left text-charcoal transition-colors hover:text-green-deep active:text-green-deep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-green-deep"
                  aria-expanded={open}
                  aria-controls={`${item.id}-answer`}
                  onClick={() => setOpenId(open ? null : item.id)}
                >
                  <span className="text-base font-medium">{item.question}</span>
                  <ChevronDownIcon className="faq-chevron h-5 w-5 shrink-0 text-green-deep" />
                </button>
                <div id={`${item.id}-answer`} className="faq-answer" aria-hidden={!open}>
                  <div className="overflow-hidden">
                    <p className="pb-6 pr-8 text-base leading-relaxed text-charcoal-mid">{item.answer}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
