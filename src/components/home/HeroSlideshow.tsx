'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState, useEffect } from 'react'

export interface HeroPhoto {
  id: string | number
  title: string
  year?: number | null
  locationName?: string | null
  imageUrl: string
  imageAlt: string
}

interface HeroSlideshowProps {
  photos: HeroPhoto[]
}

export function HeroSlideshow({ photos }: HeroSlideshowProps) {
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (photos.length <= 1) return
    const timer = setInterval(() => setCurrent(i => (i + 1) % photos.length), 5000)
    return () => clearInterval(timer)
  }, [photos.length])

  // Fallback statico quando non ci sono foto
  if (photos.length === 0) {
    return (
      <section className="flex min-h-[70vh] items-center justify-center bg-secondary/40 px-4 py-24">
        <div className="max-w-3xl text-center">
          <h1 className="font-serif text-4xl font-bold leading-tight text-foreground sm:text-5xl lg:text-6xl">
            La memoria di Urgnano,<br />
            <span className="text-accent">come era.</span>
          </h1>
          <p className="mt-6 text-lg text-muted-foreground">
            Fotografie, testimonianze e storie che raccontano il passato del nostro paese.
            Esplora, scopri, contribuisci.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/archivio"
              className="flex min-h-[44px] items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
            >
              Esplora l&apos;archivio
            </Link>
            <Link
              href="/contribuisci"
              className="flex min-h-[44px] items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
            >
              Contribuisci
            </Link>
          </div>
        </div>
      </section>
    )
  }

  const photo = photos[current]

  return (
    <section className="relative flex min-h-[70vh] items-end overflow-hidden bg-foreground">
      {/* Immagini in stack con dissolvenza */}
      {photos.map((p, i) => (
        <div
          key={p.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
        >
          <Image
            src={p.imageUrl}
            alt={p.imageAlt}
            fill
            className="object-cover"
            priority={i === 0}
            sizes="100vw"
          />
        </div>
      ))}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Contenuto */}
      <div className="relative z-10 w-full px-4 pb-10 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <h1 className="font-serif text-3xl font-bold text-white sm:text-4xl lg:text-5xl">
            La memoria di Urgnano,<br />
            <span className="text-accent">come era.</span>
          </h1>

          <p className="mt-2 text-sm text-white/70">
            {photo.title}
            {photo.year && ` · ${photo.year}`}
            {photo.locationName && ` · ${photo.locationName}`}
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/archivio"
              className="flex min-h-[44px] items-center rounded-md bg-white/90 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:bg-white"
            >
              Esplora l&apos;archivio
            </Link>
            <Link
              href="/contribuisci"
              className="flex min-h-[44px] items-center rounded-md border border-white/50 px-5 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-white/10"
            >
              Contribuisci
            </Link>
          </div>

          {/* Dots */}
          {photos.length > 1 && (
            <div className="mt-5 flex gap-2">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  aria-label={`Foto ${i + 1} di ${photos.length}`}
                  className="flex min-h-[44px] min-w-[44px] items-center justify-center"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === current ? 'w-6 bg-white' : 'w-2 bg-white/40'
                    }`}
                  />
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
