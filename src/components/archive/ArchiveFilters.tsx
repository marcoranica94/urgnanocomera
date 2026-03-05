'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'

interface LocationOption {
  id: string | number
  name: string
  slug: string
}

interface ArchiveFiltersProps {
  locations: LocationOption[]
  totalDocs: number
}

const DECADES = [
  '1900-1910', '1910-1920', '1920-1930', '1930-1940', '1940-1950',
  '1950-1960', '1960-1970', '1970-1980', '1980-1990', '1990-2000',
]

export function ArchiveFilters({ locations, totalDocs }: ArchiveFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentQ = searchParams.get('q') ?? ''
  const currentLuogo = searchParams.get('luogo') ?? ''
  const currentDecennio = searchParams.get('decennio') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) {
        params.set(key, value)
      } else {
        params.delete(key)
      }
      params.delete('pagina') // reset pagina al cambio filtro
      startTransition(() => {
        router.push(`${pathname}?${params.toString()}`)
      })
    },
    [router, pathname, searchParams],
  )

  const clearAll = () => {
    startTransition(() => {
      router.push(pathname)
    })
  }

  const hasFilters = currentQ || currentLuogo || currentDecennio

  return (
    <div className="space-y-3">
      {/* Barra ricerca */}
      <div className="relative">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16" height="16"
          viewBox="0 0 24 24"
          fill="none" stroke="currentColor" strokeWidth="2"
          strokeLinecap="round" strokeLinejoin="round"
          aria-hidden
          className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>
        <input
          type="search"
          placeholder="Cerca per titolo, luogo, anno…"
          defaultValue={currentQ}
          onChange={e => {
            const val = e.target.value
            // Debounce leggero: aggiorna solo dopo 400ms di pausa
            clearTimeout((window as Window & { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer)
            ;(window as Window & { _searchTimer?: ReturnType<typeof setTimeout> })._searchTimer = setTimeout(
              () => updateParam('q', val),
              400,
            )
          }}
          className="
            h-11 w-full rounded-md border border-input bg-background
            pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground
            focus:outline-none focus:ring-2 focus:ring-ring
          "
        />
      </div>

      {/* Filtri riga */}
      <div className="flex flex-wrap gap-2">
        {/* Luogo */}
        <select
          value={currentLuogo}
          onChange={e => updateParam('luogo', e.target.value)}
          className="
            h-11 min-w-[140px] rounded-md border border-input bg-background
            px-3 text-sm text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring
          "
          aria-label="Filtra per luogo"
        >
          <option value="">Tutti i luoghi</option>
          {locations.map(l => (
            <option key={l.id} value={l.slug}>{l.name}</option>
          ))}
        </select>

        {/* Decennio */}
        <select
          value={currentDecennio}
          onChange={e => updateParam('decennio', e.target.value)}
          className="
            h-11 min-w-[140px] rounded-md border border-input bg-background
            px-3 text-sm text-foreground
            focus:outline-none focus:ring-2 focus:ring-ring
          "
          aria-label="Filtra per decennio"
        >
          <option value="">Tutti i decenni</option>
          {DECADES.map(d => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        {/* Reset */}
        {hasFilters && (
          <button
            onClick={clearAll}
            className="flex h-11 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M18 6 6 18M6 6l12 12" />
            </svg>
            Azzera filtri
          </button>
        )}

        {/* Contatore risultati */}
        <span className="ml-auto flex items-center text-xs text-muted-foreground">
          {isPending ? 'Ricerca…' : `${totalDocs} foto`}
        </span>
      </div>
    </div>
  )
}
