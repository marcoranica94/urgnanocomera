'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useCallback, useTransition } from 'react'

interface LocationOption {
  id: string | number
  name: string
  slug: string
}

interface TestimonialFiltersProps {
  locations: LocationOption[]
  totalDocs: number
}

const PERIODI = [
  { label: 'Prima del 1940', value: 'pre1940' },
  { label: 'Anni \'40', value: '1940' },
  { label: 'Anni \'50', value: '1950' },
  { label: 'Anni \'60', value: '1960' },
  { label: 'Anni \'70', value: '1970' },
  { label: 'Anni \'80', value: '1980' },
  { label: 'Anni \'90', value: '1990' },
]

const TIPI = [
  { label: 'Video', value: 'video' },
  { label: 'Audio', value: 'audio' },
  { label: 'Scritto', value: 'written' },
]

export function TestimonialFilters({ locations, totalDocs }: TestimonialFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const currentTipo = searchParams.get('tipo') ?? ''
  const currentLuogo = searchParams.get('luogo') ?? ''
  const currentPeriodo = searchParams.get('periodo') ?? ''

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString())
      if (value) params.set(key, value)
      else params.delete(key)
      params.delete('pagina')
      startTransition(() => router.push(`${pathname}?${params.toString()}`))
    },
    [router, pathname, searchParams],
  )

  const clearAll = () => startTransition(() => router.push(pathname))
  const hasFilters = currentTipo || currentLuogo || currentPeriodo

  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* Tipo */}
      <div className="flex gap-1">
        {TIPI.map(t => (
          <button
            key={t.value}
            onClick={() => updateParam('tipo', currentTipo === t.value ? '' : t.value)}
            className={`flex min-h-[44px] items-center rounded-md border px-3 text-sm transition-colors ${
              currentTipo === t.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-foreground hover:bg-muted'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Luogo */}
      <select
        value={currentLuogo}
        onChange={e => updateParam('luogo', e.target.value)}
        aria-label="Filtra per luogo"
        className="h-11 min-w-[140px] rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Tutti i luoghi</option>
        {locations.map(l => (
          <option key={l.id} value={l.slug}>{l.name}</option>
        ))}
      </select>

      {/* Periodo */}
      <select
        value={currentPeriodo}
        onChange={e => updateParam('periodo', e.target.value)}
        aria-label="Filtra per periodo"
        className="h-11 min-w-[140px] rounded-md border border-input bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
      >
        <option value="">Tutti i periodi</option>
        {PERIODI.map(p => (
          <option key={p.value} value={p.value}>{p.label}</option>
        ))}
      </select>

      {hasFilters && (
        <button
          onClick={clearAll}
          className="flex h-11 items-center gap-1.5 rounded-md border border-border px-3 text-sm text-muted-foreground transition-colors hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
          Azzera
        </button>
      )}

      <span className="ml-auto text-xs text-muted-foreground">
        {isPending ? 'Ricerca…' : `${totalDocs} testimonianze`}
      </span>
    </div>
  )
}
