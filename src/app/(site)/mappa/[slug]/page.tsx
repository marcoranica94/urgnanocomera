import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { PhotoCard } from '@/components/photo/PhotoCard'
import { TestimonialCard } from '@/components/testimonial/TestimonialCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getLocation(slug: string): Promise<any | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'locations',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 1,
    })
    return res.docs[0] ?? null
  } catch { return null }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const loc = await getLocation(slug)
  if (!loc) return {}
  return {
    title: loc.name,
    description: loc.description ?? `Fotografie e testimonianze di ${loc.name}, Urgnano`,
    openGraph: { title: `${loc.name} — UrgnanoComEra` },
  }
}

export default async function LocationPage({ params }: PageProps) {
  const { slug } = await params
  const loc = await getLocation(slug)
  if (!loc) notFound()

  const payload = await getPayload({ config })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [photosRes, testimonialsRes] = await Promise.all([
    payload.find({
      collection: 'photos',
      where: { and: [{ status: { equals: 'published' } }, { location: { equals: loc.id } }] },
      limit: 24, sort: '-createdAt', depth: 2,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
    payload.find({
      collection: 'testimonials',
      where: { and: [{ status: { equals: 'published' } }, { location: { equals: loc.id } }] },
      limit: 12, sort: '-createdAt', depth: 1,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    }) as any,
  ])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const photos: any[] = photosRes.docs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const testimonials: any[] = testimonialsRes.docs
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const coverImageUrl = (loc.coverImage as any)?.url ?? null

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Place',
    name: loc.name,
    description: loc.description ?? undefined,
    address: { '@type': 'PostalAddress', addressLocality: 'Urgnano', addressCountry: 'IT' },
    geo: loc.coordinates?.lat
      ? { '@type': 'GeoCoordinates', latitude: loc.coordinates.lat, longitude: loc.coordinates.lng }
      : undefined,
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
        <Link href="/mappa" className="mb-6 inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground">
          ← Mappa
        </Link>

        {/* Header luogo */}
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {coverImageUrl && (
            <div className="relative h-48 w-full flex-shrink-0 overflow-hidden rounded-lg sm:h-40 sm:w-56">
              <Image src={coverImageUrl} alt={loc.name} fill className="object-cover" sizes="(max-width: 640px) 100vw, 224px" />
            </div>
          )}
          <div>
            {loc.category && (
              <span className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground capitalize">
                {loc.category}
              </span>
            )}
            <h1 className="mt-2 font-serif text-3xl font-bold text-foreground">{loc.name}</h1>
            {loc.description && <p className="mt-3 text-base text-muted-foreground">{loc.description}</p>}
            {loc.coordinates?.lat && (
              <p className="mt-2 text-xs text-muted-foreground">
                {loc.coordinates.lat.toFixed(4)}°N, {loc.coordinates.lng.toFixed(4)}°E
              </p>
            )}
          </div>
        </div>

        {/* Foto */}
        {photos.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-serif text-xl font-bold text-foreground">
              Fotografie ({photos.length})
            </h2>
            <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
              {photos.map((photo: any) => {
                const imgUrl = photo.file?.url ?? null
                if (!imgUrl) return null
                return (
                  <div key={photo.id} className="mb-4 break-inside-avoid">
                    <PhotoCard
                      id={photo.id}
                      title={photo.title}
                      description={photo.description}
                      imageUrl={imgUrl}
                      imageAlt={photo.file?.alt ?? photo.title}
                      year={photo.year}
                      decade={photo.decade}
                      locationName={loc.name}
                      tags={photo.tags?.map((t: any) => t.tag)}
                      href={`/archivio?foto=${photo.id}`}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Testimonianze */}
        {testimonials.length > 0 && (
          <section className="mt-12">
            <h2 className="mb-5 font-serif text-xl font-bold text-foreground">
              Testimonianze ({testimonials.length})
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {testimonials.map((t: any) => (
                <TestimonialCard
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  type={t.type}
                  person={t.person}
                  description={t.description}
                  year={t.year}
                  locationName={loc.name}
                  href={`/testimonianze/${t.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {photos.length === 0 && testimonials.length === 0 && (
          <div className="mt-16 text-center text-muted-foreground">
            Nessun contenuto pubblicato per questo luogo ancora.
          </div>
        )}
      </div>
    </>
  )
}
