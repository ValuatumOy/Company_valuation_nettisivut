'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { trackPageView, trackSampleReportClick } from '@/lib/analytics'

export function GoogleAnalytics() {
  const pathname = usePathname()
  useEffect(() => {
    trackPageView()
  }, [pathname])

  useEffect(() => {
    const trackSampleLink = (event: MouseEvent) => {
      if (event.button > 0 && !(event.type === 'auxclick' && event.button === 1)) return
      if (!(event.target instanceof Element)) return
      const link = event.target.closest('a[href]')
      if (!link) return
      try { trackSampleReportClick(link.getAttribute('href') ?? '') } catch {}
    }
    document.addEventListener('click', trackSampleLink, true)
    document.addEventListener('auxclick', trackSampleLink, true)
    return () => {
      document.removeEventListener('click', trackSampleLink, true)
      document.removeEventListener('auxclick', trackSampleLink, true)
    }
  }, [])

  return null
}
