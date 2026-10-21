'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'
import { trackPageView } from '@/lib/analytics'

export function GoogleAnalytics() {
  const pathname = usePathname()
  useEffect(() => {
    trackPageView()
  }, [pathname])

  return null
}
