'use client'

import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'

const GA_ID = 'G-K7HYM7Q10C'
const PRIVATE_PATHS = ['/raportti', '/testi', '/kassa']
const SENSITIVE_PARAMS = new Set(['key', 'token', 'access_token', 'api_key', 'session_id'])

declare global {
  interface Window {
    dataLayer?: unknown[][]
    gtag?: (...args: unknown[]) => void
    'ga-disable-G-K7HYM7Q10C'?: boolean
  }
}

function isPrivatePath(pathname: string) {
  return PRIVATE_PATHS.some(path => pathname === path || pathname.startsWith(`${path}/`))
}

function safeReferrer() {
  if (!document.referrer) return ''
  try {
    const referrer = new URL(document.referrer)
    if (referrer.origin === window.location.origin && isPrivatePath(referrer.pathname)) return ''
    return `${referrer.origin}${referrer.pathname}`
  } catch {
    return ''
  }
}

export function GoogleAnalytics() {
  const pathname = usePathname()
  const initialized = useRef(false)

  useEffect(() => {
    const sensitiveQuery = Array.from(new URLSearchParams(window.location.search).keys())
      .some(key => SENSITIVE_PARAMS.has(key.toLowerCase()))
    const excluded = isPrivatePath(pathname) || sensitiveQuery
    window['ga-disable-G-K7HYM7Q10C'] = excluded
    if (excluded || initialized.current) return

    initialized.current = true
    window.dataLayer = window.dataLayer ?? []
    window.gtag = window.gtag ?? function gtag(...args: unknown[]) {
      window.dataLayer?.push(args)
    }
    window.gtag('js', new Date())
    window.gtag('config', GA_ID, { page_referrer: safeReferrer() })

    const script = document.createElement('script')
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
    document.head.appendChild(script)
  }, [pathname])

  return null
}
