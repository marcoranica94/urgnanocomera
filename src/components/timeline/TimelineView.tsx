'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useRef, useState, useEffect } from 'react'

export interface TimelineEvent {
  id: string | number
  year: number
  title: string
  description?: string | null
  category?: string | null
  featuredPhotoUrl?: string | null
  featuredPhotoAlt?: string
}

export interface DecadeData {
  decade: string           // "1900-1910"
  decadeStart: number      // 1900
  events: TimelineEvent[]
  featuredPhotoUrl?: string | null
  featuredPhotoAlt?: string
  photoCount: number
}

interface TimelineViewProps {
  decades: DecadeData[]
}

const CATEGORY_COLORS: Record<string, string> = {
  storia:      'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  tradizione:  'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
  urbanistica: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
  comunità:    'bg-rose-100 text-rose-800 dark:bg-rose-900/30 dark:text-rose-300',
}

// Componente singolo decennio — con animazione entrata
function DecadeCard({ data, index }: { data: DecadeData; index: number }) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.15 },
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      id={`decade-${data.decadeStart}`}
      className={`
        flex-shrink-0 w-72 lg:w-80 flex flex-col rounded-xl border border-border bg-card overflow-hidden
        transition-all duration-700
        ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}
      `}
      style={{ transitionDelay: `${index * 60}ms` }}
    >
      {/* Foto in evidenza */}
      {data.featuredPhotoUrl ? (
        <div className="relative h-40 w-full flex-shrink-0 bg-muted">
          <Image
            src={data.featuredPhotoUrl}
            alt={data.featuredPhotoAlt ?? data.decade}
            fill
            className="object-cover"
            sizes="320px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <span className="absolute bottom-3 left-4 font-serif text-2xl font-bold text-white">
            {data.decade}
          </span>
        </div>
      ) : (
        <div className="flex h-28 items-center bg-secondary/50 px-6">
          <span className="font-serif text-3xl font-bold text-foreground">{data.decade}</span>
        </div>
      )}

      {/* Corpo */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {data.photoCount > 0 && (
          <Link
            href={`/archivio?decennio=${data.decade}`}
            className="text-xs text-primary hover:underline"
          >
            📷 {data.photoCount} foto da questo decennio →
          </Link>
        )}

        {data.events.length === 0 && (
          <p className="text-xs italic text-muted-foreground">Nessun evento registrato per questo decennio.</p>
        )}

        <ul className="space-y-3">
          {data.events.map(ev => (
            <li key={ev.id} className="border-l-2 border-accent pl-3">
              <div className="flex items-start justify-between gap-2">
                <span className="text-xs font-bold text-accent">{ev.year}</span>
                {ev.category && (
                  <span className={`rounded-sm px-1.5 py-0.5 text-[10px] font-medium ${CATEGORY_COLORS[ev.category] ?? 'bg-muted text-muted-foreground'}`}>
                    {ev.category}
                  </span>
                )}
              </div>
              <p className="mt-0.5 text-sm font-medium text-card-foreground leading-snug">{ev.title}</p>
              {ev.description && (
                <p className="mt-1 line-clamp-3 text-xs text-muted-foreground">{ev.description}</p>
              )}
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export function TimelineView({ decades }: TimelineViewProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeDecade, setActiveDecade] = useState(decades[0]?.decadeStart ?? 1900)

  // Desktop: scroll orizzontale al click della nav
  const scrollToDecade = (start: number) => {
    setActiveDecade(start)
    const el = document.getElementById(`decade-${start}`)
    el?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })
  }

  // Aggiorna activeDecade seguendo lo scroll
  useEffect(() => {
    const container = scrollRef.current
    if (!container) return
    const onScroll = () => {
      for (const d of decades) {
        const el = document.getElementById(`decade-${d.decadeStart}`)
        if (!el) continue
        const rect = el.getBoundingClientRect()
        const containerRect = container.getBoundingClientRect()
        if (rect.left >= containerRect.left - 40) {
          setActiveDecade(d.decadeStart)
          break
        }
      }
    }
    container.addEventListener('scroll', onScroll, { passive: true })
    return () => container.removeEventListener('scroll', onScroll)
  }, [decades])

  if (decades.length === 0) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <p className="text-muted-foreground">Nessun evento nella timeline ancora.</p>
        <p className="mt-2 text-sm text-muted-foreground">
          Aggiungi eventi dall&apos;admin Payload → Timeline Events.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      {/* Nav decenni */}
      <nav
        aria-label="Navigazione decenni"
        className="sticky top-16 z-10 overflow-x-auto border-b border-border bg-background/95 backdrop-blur-sm"
      >
        <div className="flex min-w-max gap-1 px-4 py-2 sm:px-6">
          {decades.map(d => (
            <button
              key={d.decadeStart}
              onClick={() => scrollToDecade(d.decadeStart)}
              className={`
                flex min-h-[44px] items-center rounded-md px-3 text-sm font-medium transition-colors
                ${activeDecade === d.decadeStart
                  ? 'bg-primary text-primary-foreground'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'}
              `}
            >
              {d.decadeStart}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Desktop: scroll orizzontale ────────────────────────────────────── */}
      <div
        ref={scrollRef}
        className="hidden overflow-x-auto pb-8 pt-6 lg:block"
        style={{ scrollbarWidth: 'thin' }}
      >
        <div className="flex gap-4 px-6" style={{ width: 'max-content' }}>
          {decades.map((d, i) => (
            <DecadeCard key={d.decadeStart} data={d} index={i} />
          ))}
        </div>
      </div>

      {/* ── Mobile: scroll verticale ───────────────────────────────────────── */}
      <div className="flex flex-col gap-4 px-4 py-6 sm:px-6 lg:hidden">
        {decades.map((d, i) => (
          <DecadeCard key={d.decadeStart} data={d} index={i} />
        ))}
      </div>
    </div>
  )
}
