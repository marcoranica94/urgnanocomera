import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

interface PageProps {
  params: Promise<{ id: string }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getPhoto(id: string): Promise<any | null> {
  try {
    const payload = await getPayload({ config })
    const photo = await payload.findByID({ collection: 'photos', id, depth: 2 })
    if (!photo || photo.status !== 'published') return null
    return photo
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const photo = await getPhoto(id)
  if (!photo) return {}

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const file = photo.file as any
  const imageUrl = file?.url ?? null

  return {
    title: photo.title,
    description: photo.description ?? `Fotografia storica di Urgnano — ${photo.year ?? ''}`,
    openGraph: {
      title: `${photo.title} — UrgnanoComEra`,
      description: photo.description ?? undefined,
      images: imageUrl ? [{ url: imageUrl, alt: file?.alt ?? photo.title }] : [],
      type: 'article',
    },
  }
}

export default async function PhotoPage({ params }: PageProps) {
  const { id } = await params
  const photo = await getPhoto(id)
  if (!photo) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const file = photo.file as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const location = photo.location as any
  const imageUrl: string | null = file?.url ?? null
  const imageAlt: string = file?.alt ?? photo.title
  const locationName: string | null = location?.name ?? null

  // Schema.org Photograph
  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Photograph',
    name: photo.title,
    description: photo.description ?? undefined,
    dateCreated: photo.year ? `${photo.year}` : undefined,
    contentLocation: locationName ? { '@type': 'Place', name: locationName } : undefined,
    image: imageUrl ?? undefined,
    copyrightHolder: { '@type': 'Organization', name: 'Comune di Urgnano' },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <Link
          href="/archivio"
          className="mb-6 inline-flex min-h-[44px] items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Archivio fotografico
        </Link>

        {imageUrl && (
          <div className="relative aspect-[4/3] w-full overflow-hidden rounded-lg bg-muted">
            <Image
              src={imageUrl}
              alt={imageAlt}
              fill
              className="object-contain"
              sizes="(max-width: 896px) 100vw, 896px"
              priority
            />
          </div>
        )}

        <div className="mt-6">
          <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
            {photo.title}
          </h1>

          {photo.description && (
            <p className="mt-3 text-base text-muted-foreground">{photo.description}</p>
          )}

          <dl className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm text-muted-foreground">
            {photo.year && (
              <div><dt className="inline font-medium text-foreground">Anno: </dt><dd className="inline">{photo.year}</dd></div>
            )}
            {photo.decade && (
              <div><dt className="inline font-medium text-foreground">Decennio: </dt><dd className="inline">{photo.decade}</dd></div>
            )}
            {locationName && (
              <div><dt className="inline font-medium text-foreground">Luogo: </dt><dd className="inline">{locationName}</dd></div>
            )}
          </dl>

          {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
          {(photo.tags as any[])?.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {(photo.tags as any[]).map((t: { tag: string }) => (
                <span key={t.tag} className="rounded-sm bg-secondary px-2 py-0.5 text-xs text-secondary-foreground">
                  {t.tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}
