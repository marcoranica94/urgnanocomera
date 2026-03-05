import type { Metadata } from 'next'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TimelineView } from '@/components/timeline/TimelineView'
import type { DecadeData, TimelineEvent } from '@/components/timeline/TimelineView'

export const revalidate = 3600

export const metadata: Metadata = {
  title: 'Timeline storica',
  description: 'La storia di Urgnano decennio per decennio, dal 1900 al 2000.',
  openGraph: { title: 'Timeline storica — UrgnanoComEra' },
}

const ALL_DECADES = [
  1900, 1910, 1920, 1930, 1940, 1950, 1960, 1970, 1980, 1990,
]

export default async function TimelinePage() {
  const payload = await getPayload({ config })

  // Tutti gli eventi ordinati per anno
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const eventsRes = await payload.find({
    collection: 'timeline-events',
    limit: 1000,
    sort: 'year',
    depth: 2,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allEvents: any[] = eventsRes.docs

  // Foto pubblicate per decennio (per conteggio e foto in evidenza)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const photosRes = await payload.find({
    collection: 'photos',
    where: { status: { equals: 'published' } },
    limit: 1000,
    depth: 1,
    sort: '-createdAt',
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const allPhotos: any[] = photosRes.docs

  // Raggruppa foto per decennio
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const photosByDecade: Record<number, any[]> = {}
  for (const photo of allPhotos) {
    if (!photo.decade) continue
    const start = parseInt(photo.decade.split('-')[0], 10)
    if (!photosByDecade[start]) photosByDecade[start] = []
    photosByDecade[start].push(photo)
  }

  // Componi i dati per decennio
  const decades: DecadeData[] = ALL_DECADES.map(start => {
    const end = start + 10
    const label = `${start}-${end}`

    const decadeEvents: TimelineEvent[] = allEvents
      .filter((e: any) => e.year >= start && e.year < end)
      .map((e: any) => {
        // Prima foto dell'evento (se ha relazione photos popolata)
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const firstPhoto = (e.photos as any[])?.[0]
        const photoUrl = firstPhoto && typeof firstPhoto === 'object' ? firstPhoto.file?.url ?? null : null
        return {
          id: e.id,
          year: e.year,
          title: e.title,
          description: e.description ?? null,
          category: e.category ?? null,
          featuredPhotoUrl: photoUrl,
          featuredPhotoAlt: firstPhoto?.title,
        }
      })

    const decadePhotos = photosByDecade[start] ?? []
    const featuredPhoto = decadePhotos[0]
    const featuredPhotoUrl = featuredPhoto?.file && typeof featuredPhoto.file === 'object'
      ? featuredPhoto.file.url ?? null
      : null

    return {
      decade: label,
      decadeStart: start,
      events: decadeEvents,
      featuredPhotoUrl,
      featuredPhotoAlt: featuredPhoto?.title,
      photoCount: decadePhotos.length,
    }
  })

  // Mostra solo decenni con eventi O foto (non tutti vuoti)
  const populated = decades.filter(d => d.events.length > 0 || d.photoCount > 0)
  // Se non ci sono contenuti, mostra tutti i decenni con messaggio vuoto
  const toShow = populated.length > 0 ? populated : decades

  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 pt-10 sm:px-6">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Timeline storica
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Urgnano dal 1900 al 2000 — eventi, foto e trasformazioni decennio per decennio
        </p>
      </div>

      <TimelineView decades={toShow} />
    </div>
  )
}
