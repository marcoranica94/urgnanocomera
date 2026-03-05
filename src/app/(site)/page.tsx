import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

import { HeroSlideshow } from '@/components/home/HeroSlideshow'
import { AnimatedCounter } from '@/components/home/AnimatedCounter'
import { PhotoCard } from '@/components/photo/PhotoCard'
import { TestimonialCard } from '@/components/testimonial/TestimonialCard'

export const revalidate = 3600

// ─── Tipi minimi per i dati restituiti da Payload ─────────────────────────────

interface MediaDoc {
  id: string | number
  url?: string | null
  thumbnailURL?: string | null
  alt: string
}

interface LocationDoc {
  id: string | number
  name: string
}

interface PhotoDoc {
  id: string | number
  title: string
  description?: string | null
  year?: number | null
  decade?: string | null
  file: MediaDoc | string | number
  location?: LocationDoc | string | number | null
  tags?: Array<{ tag: string }>
}

interface TestimonialDoc {
  id: string | number
  title: string
  type: 'video' | 'audio' | 'written'
  person?: string | null
  description?: string | null
  year?: number | null
  location?: LocationDoc | string | number | null
}

interface StoryDoc {
  id: string | number
  title: string
  slug: string
  summary?: string | null
  coverImage?: MediaDoc | string | number | null
  publishedAt?: string | null
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function getMediaUrl(file: MediaDoc | string | number | null | undefined): string | null {
  if (!file || typeof file !== 'object') return null
  return (file as MediaDoc).url ?? null
}

function getMediaAlt(file: MediaDoc | string | number | null | undefined, fallback = ''): string {
  if (!file || typeof file !== 'object') return fallback
  return (file as MediaDoc).alt || fallback
}

function getLocationName(loc: LocationDoc | string | number | null | undefined): string | null {
  if (!loc || typeof loc !== 'object') return null
  return (loc as LocationDoc).name ?? null
}

// ─── Pagina ───────────────────────────────────────────────────────────────────

export default async function HomePage() {
  const payload = await getPayload({ config })

  const [
    heroResult,
    latestPhotosResult,
    latestTestimonialsResult,
    featuredStoryResult,
    photosCount,
    testimonialsCount,
    locationsCount,
  ] = await Promise.all([
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.find({ collection: 'photos', where: { status: { equals: 'published' } }, limit: 5, sort: '-createdAt', depth: 2 }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.find({ collection: 'photos', where: { status: { equals: 'published' } }, limit: 3, sort: '-createdAt', depth: 2 }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.find({ collection: 'testimonials', where: { status: { equals: 'published' } }, limit: 2, sort: '-createdAt', depth: 1 }) as any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    payload.find({ collection: 'stories', where: { status: { equals: 'published' }, featured: { equals: true } }, limit: 1, sort: '-publishedAt', depth: 1 }) as any,
    payload.count({ collection: 'photos', where: { status: { equals: 'published' } } }),
    payload.count({ collection: 'testimonials', where: { status: { equals: 'published' } } }),
    payload.count({ collection: 'locations' }),
  ])

  const heroPhotos = (heroResult.docs as PhotoDoc[]).map(p => ({
    id: p.id,
    title: p.title,
    year: p.year,
    locationName: getLocationName(p.location),
    imageUrl: getMediaUrl(p.file) ?? '',
    imageAlt: getMediaAlt(p.file, p.title),
  })).filter(p => p.imageUrl)

  const latestPhotos = latestPhotosResult.docs as PhotoDoc[]
  const latestTestimonials = latestTestimonialsResult.docs as TestimonialDoc[]
  const featuredStory = (featuredStoryResult.docs as StoryDoc[])[0] ?? null

  return (
    <div className="flex flex-col">

      {/* ── Hero ──────────────────────────────────────────────────────────────── */}
      <HeroSlideshow photos={heroPhotos} />

      {/* ── Presentazione progetto ────────────────────────────────────────────── */}
      <section className="mx-auto max-w-3xl px-4 py-16 text-center sm:px-6">
        <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
          La memoria di un paese, custodita da chi ci vive
        </h2>
        <p className="mt-4 text-base text-muted-foreground">
          UrgnanoComEra è l&apos;archivio digitale della storia di Urgnano: fotografie d&apos;epoca,
          testimonianze orali e racconti di chi ha vissuto il Novecento in questo territorio.
          Un progetto del Comune aperto a tutti i cittadini.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link
            href="/archivio"
            className="flex min-h-[44px] items-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Sfoglia l&apos;archivio
          </Link>
          <Link
            href="/storie"
            className="flex min-h-[44px] items-center rounded-md border border-border px-6 py-3 text-sm font-medium text-foreground transition-colors hover:bg-muted"
          >
            Leggi le storie
          </Link>
        </div>
      </section>

      {/* ── Counter ───────────────────────────────────────────────────────────── */}
      <AnimatedCounter
        photoCount={photosCount.totalDocs}
        testimonialCount={testimonialsCount.totalDocs}
        locationCount={locationsCount.totalDocs}
      />

      {/* ── Ultime foto ───────────────────────────────────────────────────────── */}
      {latestPhotos.length > 0 && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <div className="flex items-baseline justify-between">
            <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
              Ultime fotografie
            </h2>
            <Link
              href="/archivio"
              className="text-sm text-primary hover:underline"
            >
              Vedi tutte →
            </Link>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {latestPhotos.map((photo) => {
              const imageUrl = getMediaUrl(photo.file)
              if (!imageUrl) return null
              return (
                <PhotoCard
                  key={photo.id}
                  id={photo.id}
                  title={photo.title}
                  description={photo.description}
                  imageUrl={imageUrl}
                  imageAlt={getMediaAlt(photo.file, photo.title)}
                  year={photo.year}
                  decade={photo.decade}
                  locationName={getLocationName(photo.location)}
                  tags={photo.tags?.map(t => t.tag)}
                  href={`/archivio/${photo.id}`}
                />
              )
            })}
          </div>
        </section>
      )}

      {/* ── Ultime testimonianze ──────────────────────────────────────────────── */}
      {latestTestimonials.length > 0 && (
        <section className="bg-secondary/20 py-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6">
            <div className="flex items-baseline justify-between">
              <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
                Testimonianze vive
              </h2>
              <Link
                href="/testimonianze"
                className="text-sm text-primary hover:underline"
              >
                Vedi tutte →
              </Link>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
              {latestTestimonials.map((t) => (
                <TestimonialCard
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  type={t.type}
                  person={t.person}
                  description={t.description}
                  year={t.year}
                  locationName={getLocationName(t.location)}
                  href={`/testimonianze/${t.id}`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Storia del mese ───────────────────────────────────────────────────── */}
      {featuredStory && (
        <section className="mx-auto w-full max-w-7xl px-4 py-16 sm:px-6">
          <h2 className="font-serif text-xl font-bold text-foreground sm:text-2xl">
            Storia del mese
          </h2>

          <Link
            href={`/storie/${featuredStory.slug}`}
            className="group mt-6 flex min-h-[44px] flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md sm:flex-row"
          >
            {featuredStory.coverImage && getMediaUrl(featuredStory.coverImage) && (
              <div className="relative h-48 w-full flex-shrink-0 sm:h-auto sm:w-64">
                <Image
                  src={getMediaUrl(featuredStory.coverImage)!}
                  alt={getMediaAlt(featuredStory.coverImage, featuredStory.title)}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 100vw, 256px"
                />
              </div>
            )}
            <div className="flex flex-col justify-center gap-2 p-6">
              <h3 className="font-serif text-xl font-bold text-card-foreground group-hover:text-primary transition-colors">
                {featuredStory.title}
              </h3>
              {featuredStory.summary && (
                <p className="line-clamp-3 text-sm text-muted-foreground">
                  {featuredStory.summary}
                </p>
              )}
              <span className="mt-2 text-sm font-medium text-primary">
                Leggi la storia →
              </span>
            </div>
          </Link>
        </section>
      )}

      {/* ── CTA Contribuisci ──────────────────────────────────────────────────── */}
      <section className="bg-primary/5 py-16">
        <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
          <h2 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            Hai foto, ricordi o storie di Urgnano?
          </h2>
          <p className="mt-4 text-base text-muted-foreground">
            Contribuisci all&apos;archivio: carica fotografie d&apos;epoca, registra una testimonianza
            o scrivi un racconto. Ogni contributo arricchisce la memoria collettiva del paese.
          </p>
          <Link
            href="/contribuisci"
            className="mt-8 inline-flex min-h-[44px] items-center rounded-md bg-primary px-8 py-3 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
          >
            Contribuisci ora
          </Link>
        </div>
      </section>

    </div>
  )
}
