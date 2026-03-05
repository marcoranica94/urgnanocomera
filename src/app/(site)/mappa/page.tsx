import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { LocationMarker } from '@/components/map/MapView'

export const metadata: Metadata = {
  title: 'Mappa interattiva',
  description: 'Esplora i luoghi storici di Urgnano sulla mappa. Fotografie e testimonianze georeferenziate.',
  openGraph: { title: 'Mappa interattiva — UrgnanoComEra' },
}

// Leaflet usa window → ssr: false obbligatorio
const MapView = dynamic(
  () => import('@/components/map/MapView').then(m => m.MapView),
  { ssr: false, loading: () => <MapSkeleton /> },
)

function MapSkeleton() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">Caricamento mappa…</p>
    </div>
  )
}

interface MediaDoc { url?: string | null }
interface LocationDoc {
  id: string | number
  name: string
  slug: string
  category?: string | null
  coordinates?: { lat?: number | null; lng?: number | null } | null
  coverImage?: MediaDoc | string | number | null
}

export default async function MappaPage() {
  const payload = await getPayload({ config })

  // Tutti i luoghi con coordinate
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locsResult = await payload.find({ collection: 'locations', limit: 500, depth: 1 }) as any
  const allLocations = locsResult.docs as LocationDoc[]

  // Contiamo foto e testimonianze per luogo in batch
  const publishedPhotos = await payload.find({
    collection: 'photos',
    where: { status: { equals: 'published' } },
    limit: 0, // conta solo
    depth: 0,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  const publishedTestimonials = await payload.find({
    collection: 'testimonials',
    where: { status: { equals: 'published' } },
    limit: 0,
    depth: 0,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  // Per contare per luogo usiamo query separate solo se ci sono pochi luoghi
  // (per archivi grandi si userebbe un aggregation o Meilisearch)
  const locationMarkers: LocationMarker[] = []

  for (const loc of allLocations) {
    const coords = loc.coordinates
    if (!coords?.lat || !coords?.lng) continue

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const photoCountRes = await payload.count({
      collection: 'photos',
      where: { and: [{ status: { equals: 'published' } }, { location: { equals: loc.id } }] },
    }) as any

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const testimonialCountRes = await payload.count({
      collection: 'testimonials',
      where: { and: [{ status: { equals: 'published' } }, { location: { equals: loc.id } }] },
    }) as any

    const coverImageUrl =
      loc.coverImage && typeof loc.coverImage === 'object'
        ? (loc.coverImage as MediaDoc).url ?? null
        : null

    locationMarkers.push({
      id: loc.id,
      name: loc.name,
      slug: loc.slug,
      category: loc.category,
      lat: coords.lat,
      lng: coords.lng,
      coverImageUrl,
      photoCount: photoCountRes.totalDocs ?? 0,
      testimonialCount: testimonialCountRes.totalDocs ?? 0,
    })
  }

  return (
    <div>
      <MapView locations={locationMarkers} />
    </div>
  )
}
