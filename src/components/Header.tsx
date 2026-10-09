'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { SiteSettings } from '@/content/schema'

type Props = {
  site: Pick<SiteSettings, 'name' | 'navLinks' | 'navCta'>
}

export function Header({ site }: Props) {
  const [menuOpen, setMenuOpen] = useState(false)
  const menuButton = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenuOpen(false)
        menuButton.current?.focus()
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [menuOpen])

  return (
    <header className="site-header fixed inset-x-0 top-0 z-50">
      <div className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-6 lg:px-10">
        <Link href="/" className="flex min-h-11 items-center gap-2.5" onClick={() => setMenuOpen(false)}>
          <Image src="/logo.svg" alt="" width={30} height={30} priority />
          <span className="text-[15px] font-medium tracking-tight text-white">
            Valuatum <span className="font-light text-white/70">Arvonmääritys</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-6 xl:flex" aria-label="Päänavigaatio">
          {site.navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="inline-flex min-h-11 items-center text-sm text-white/80 transition-colors duration-150 hover:text-white active:text-green-light"
            >
              {link.label}
            </a>
          ))}
          <a
            href={site.navCta.href}
            className="inline-flex min-h-11 items-center rounded-lg bg-green px-5 py-2.5 text-sm font-medium text-white transition-[background-color,transform] duration-150 hover:bg-green-deep active:scale-[0.98]"
          >
            {site.navCta.label}
          </a>
        </nav>

        <button
          type="button"
          ref={menuButton}
          className="flex h-11 w-11 items-center justify-center rounded-lg text-white transition-colors active:bg-white/10 xl:hidden"
          aria-expanded={menuOpen}
          aria-controls="mobile-navigation"
          aria-label={menuOpen ? 'Sulje valikko' : 'Avaa valikko'}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            {menuOpen ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M4 7h16M4 12h16M4 17h16" />}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav id="mobile-navigation" className="max-h-[calc(100dvh-4.5rem)] overflow-y-auto bg-forest px-6 pb-6 pt-2 xl:hidden" aria-label="Mobiilinavigaatio">
          {site.navLinks.map((link) => (
            <a
              key={link.id}
              href={link.href}
              className="block border-b border-white/5 py-3.5 text-[15px] text-white/80"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </a>
          ))}
          <a
            href={site.navCta.href}
            className="mt-5 block rounded-lg bg-green px-5 py-3 text-center text-[15px] font-medium text-white transition-[background-color,transform] duration-150 active:scale-[0.98]"
            onClick={() => setMenuOpen(false)}
          >
            {site.navCta.label}
          </a>
        </nav>
      )}
    </header>
  )
}
