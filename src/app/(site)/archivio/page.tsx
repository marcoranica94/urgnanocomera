import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { searchPhotoIds } from '@/lib/meilisearch'
import { PhotoCard } from '@/components/photo/PhotoCard'
import { ArchiveFilters } from '@/components/archive/ArchiveFilters'
import { PhotoLightbox } from '@/components/archive/PhotoLightbox'

export const metadata: Metadata = {
  title: 'Archivio fotografico',
  description: 'Sfoglia le fotografie storiche di Urgnano. Filtra per luogo, decennio e parola chiave.',
  openGraph: { title: 'Archivio fotografico — UrgnanoComEra' },
}

const PER_PAGE = 12

interface PageProps {
  searchParams: Promise<{
    q?: string
    luogo?: string
    decennio?: string
    pagina?: string
  }>
}

// ─── Tipi locali ──────────────────────────────────────────────────────────────

interface MediaDoc { id: string | number; url?: string | null; alt: string }
interface LocationDoc { id: string | number; name: string; slug: string }
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

function mediaUrl(f: MediaDoc | string | number | null | undefined): string | null {
  if (!f || typeof f !== 'object') return null
  return (f as MediaDoc).url ?? null
}
function mediaAlt(f: MediaDoc | string | number | null | undefined, fb = ''): string {
  if (!f || typeof f !== 'object') return fb
  return (f as MediaDoc).alt || fb
}
function locationName(l: LocationDoc | string | number | null | undefined): string | null {
  if (!l || typeof l !== 'object') return null
  return (l as LocationDoc).name ?? null
}

// ─── Pagina ───────────────────────────────────────────────────────────────────

export default async function ArchivioPage({ searchParams }: PageProps) {
  const params = await searchParams
  const q = params.q?.trim() ?? ''
  const luogo = params.luogo?.trim() ?? ''
  const decennio = params.decennio?.trim() ?? ''
  const pagina = Math.max(1, parseInt(params.pagina ?? '1', 10))

  const payload = await getPayload({ config })

  // ── Fetch locations per il filtro ─────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locationsResult = await payload.find({ collection: 'locations', limit: 100, sort: 'name' }) as any
  const locations = (locationsResult.docs as LocationDoc[]).map(l => ({
    id: l.id,
    name: l.name,
    slug: l.slug,
  }))

  // ── Costruzione filtri Payload ─────────────────────────────────────────────
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = {
    status: { equals: 'published' },
  }

  if (decennio) {
    where.decade = { equals: decennio }
  }

  if (luogo) {
    const loc = locations.find(l => l.slug === luogo)
    if (loc) where.location = { equals: loc.id }
  }

  // ── Ricerca testuale (Meilisearch o Payload) ──────────────────────────────
  if (q) {
    const ids = await searchPhotoIds(q)
    if (ids !== null) {
      // Meilisearch: filtra per ID restituiti
      where.id = { in: ids }
    } else {
      // Fallback: ricerca per titolo/descrizione
      where.or = [
        { title: { like: q } },
        { description: { like: q } },
      ]
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await payload.find({
    collection: 'photos',
    where,
    limit: PER_PAGE,
    page: pagina,
    sort: '-createdAt',
    depth: 2,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  const photos = result.docs as PhotoDoc[]
  const totalDocs: number = result.totalDocs
  const totalPages: number = result.totalPages

  // ── Costruzione URL pagina ────────────────────────────────────────────────
  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams()
    if (q) sp.set('q', q)
    if (luogo) sp.set('luogo', luogo)
    if (decennio) sp.set('decennio', decennio)
    if (p > 1) sp.set('pagina', String(p))
    const qs = sp.toString()
    return `/archivio${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">

      {/* Titolo */}
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Archivio fotografico
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Fotografie storiche di Urgnano e del suo territorio
        </p>
      </div>

      {/* Filtri */}
      <div className="mb-8">
        <Suspense>
          <ArchiveFilters locations={locations} totalDocs={totalDocs} />
        </Suspense>
      </div>

      {/* Griglia foto (masonry via CSS columns) */}
      {photos.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-muted-foreground">Nessuna fotografia trovata.</p>
          {(q || luogo || decennio) && (
            <Link href="/archivio" className="mt-4 text-sm text-primary hover:underline">
              Azzera i filtri
            </Link>
          )}
        </div>
      ) : (
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {photos.map(photo => {
            const imgUrl = mediaUrl(photo.file)
            if (!imgUrl) return null
            return (
              <div key={photo.id} className="mb-4 break-inside-avoid">
                <Suspense>
                  <PhotoCardLink
                    photo={photo}
                    imgUrl={imgUrl}
                    imgAlt={mediaAlt(photo.file, photo.title)}
                    locationNameStr={locationName(photo.location)}
                    q={q}
                    luogo={luogo}
                    decennio={decennio}
                    pagina={pagina}
                  />
                </Suspense>
              </div>
            )
          })}
        </div>
      )}

      {/* Paginazione */}
      {totalPages > 1 && (
        <nav aria-label="Paginazione" className="mt-12 flex items-center justify-center gap-2">
          {pagina > 1 && (
            <Link
              href={buildPageUrl(pagina - 1)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-muted"
            >
              ← Precedente
            </Link>
          )}

          <span className="px-4 text-sm text-muted-foreground">
            Pagina {pagina} di {totalPages}
          </span>

          {pagina < totalPages && (
            <Link
              href={buildPageUrl(pagina + 1)}
              className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md border border-border px-4 text-sm hover:bg-muted"
            >
              Successiva →
            </Link>
          )}
        </nav>
      )}

      {/* Lightbox (client, legge ?foto= dalla URL) */}
      <Suspense>
        <PhotoLightbox />
      </Suspense>
    </div>
  )
}

// ─── Sub-componente per card con link lightbox ────────────────────────────────

function PhotoCardLink({
  photo,
  imgUrl,
  imgAlt,
  locationNameStr,
  q, luogo, decennio, pagina,
}: {
  photo: PhotoDoc
  imgUrl: string
  imgAlt: string
  locationNameStr: string | null
  q: string
  luogo: string
  decennio: string
  pagina: number
}) {
  const sp = new URLSearchParams()
  if (q) sp.set('q', q)
  if (luogo) sp.set('luogo', luogo)
  if (decennio) sp.set('decennio', decennio)
  if (pagina > 1) sp.set('pagina', String(pagina))
  sp.set('foto', String(photo.id))

  return (
    <PhotoCard
      id={photo.id}
      title={photo.title}
      description={photo.description}
      imageUrl={imgUrl}
      imageAlt={imgAlt}
      year={photo.year}
      decade={photo.decade}
      locationName={locationNameStr}
      tags={photo.tags?.map(t => t.tag)}
      href={`/archivio?${sp.toString()}`}
    />
  )
}
