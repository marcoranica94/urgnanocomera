'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { ThemeToggle } from '@/components/ui/ThemeToggle'

const navLinks = [
  { href: '/archivio',      label: 'Archivio fotografico' },
  { href: '/testimonianze', label: 'Testimonianze' },
  { href: '/mappa',         label: 'Mappa' },
  { href: '/timeline',      label: 'Timeline' },
  { href: '/storie',        label: 'Storie' },
  { href: '/contribuisci',  label: 'Contribuisci' },
]

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-baseline gap-2 font-serif text-xl font-bold text-foreground hover:text-primary transition-colors"
          onClick={() => setMobileOpen(false)}
        >
          <span>UrgnanoComEra</span>
          <span className="hidden text-xs font-sans font-normal text-muted-foreground sm:inline">
            La memoria di Urgnano
          </span>
        </Link>

        {/* Nav desktop (visibile da lg in su) */}
        <nav aria-label="Navigazione principale" className="hidden lg:flex items-center gap-6">
          {navLinks.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors hover:text-foreground ${
                pathname === href ? 'text-foreground font-medium' : 'text-muted-foreground'
              }`}
            >
              {label}
            </Link>
          ))}
        </nav>

        {/* Azioni destra */}
        <div className="flex items-center gap-2">
          <ThemeToggle />

          {/* Hamburger (visibile sotto lg) */}
          <button
            aria-label={mobileOpen ? 'Chiudi menu' : 'Apri menu'}
            aria-expanded={mobileOpen}
            aria-controls="mobile-nav"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="
              inline-flex lg:hidden h-11 w-11 items-center justify-center
              rounded-md border border-border bg-background
              text-foreground transition-colors hover:bg-muted
              focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring
            "
          >
            {mobileOpen ? (
              /* X */
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            ) : (
              /* Hamburger */
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <line x1="4" x2="20" y1="6" y2="6" />
                <line x1="4" x2="20" y1="12" y2="12" />
                <line x1="4" x2="20" y1="18" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Menu mobile — overlay a tutta larghezza */}
      {mobileOpen && (
        <nav
          id="mobile-nav"
          aria-label="Menu mobile"
          className="lg:hidden border-t border-border bg-background"
        >
          <ul className="flex flex-col divide-y divide-border">
            {navLinks.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className={`
                    flex items-center px-6 py-4 text-base font-medium
                    min-h-[44px] transition-colors
                    ${pathname === href
                      ? 'text-primary bg-primary/5'
                      : 'text-foreground hover:bg-muted'
                    }
                  `}
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  )
}
