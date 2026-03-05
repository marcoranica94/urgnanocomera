import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { VideoPlayer } from '@/components/testimonial/VideoPlayer'
import { AudioPlayer } from '@/components/testimonial/AudioPlayer'

interface PageProps {
  params: Promise<{ id: string }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getTestimonial(id: string): Promise<any | null> {
  try {
    const payload = await getPayload({ config })
    const t = await payload.findByID({ collection: 'testimonials', id, depth: 2 })
    if (!t || t.status !== 'published') return null
    return t
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const t = await getTestimonial(id)
  if (!t) return {}

  const typeLabel = t.type === 'video' ? 'Video' : t.type === 'audio' ? 'Audio' : 'Testimonianza scritta'

  return {
    title: t.title,
    description: t.description ?? `${typeLabel} — ${t.person ?? 'Testimonianza di Urgnano'}`,
    openGraph: {
      title: `${t.title} — UrgnanoComEra`,
      description: t.description ?? undefined,
      type: 'article',
    },
  }
}

const TYPE_LABELS = { video: 'Video', audio: 'Audio', written: 'Testo scritto' } as const

export default async function TestimonialPage({ params }: PageProps) {
  const { id } = await params
  const t = await getTestimonial(id)
  if (!t) notFound()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const file = t.file as any
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const location = t.location as any
  const fileUrl: string | null = file?.url ?? null
  const locationName: string | null = location?.name ?? null

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': t.type === 'video' ? 'VideoObject' : t.type === 'audio' ? 'AudioObject' : 'Article',
    name: t.title,
    description: t.description ?? undefined,
    contentUrl: fileUrl ?? undefined,
    dateCreated: t.year ? String(t.year) : undefined,
    author: t.person ? { '@type': 'Person', name: t.person } : undefined,
    locationCreated: locationName ? { '@type': 'Place', name: locationName } : undefined,
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
      />

      <div className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        <Link
          href="/testimonianze"
          className="mb-6 inline-flex min-h-[44px] items-center gap-1 text-sm text-muted-foreground hover:text-foreground"
        >
          ← Testimonianze
        </Link>

        {/* Badge tipo */}
        <span className="inline-block rounded-sm bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
          {TYPE_LABELS[t.type as keyof typeof TYPE_LABELS]}
        </span>

        <h1 className="mt-3 font-serif text-2xl font-bold text-foreground sm:text-3xl">
          {t.title}
        </h1>

        {/* Metadati */}
        <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted-foreground">
          {t.person && (
            <div>
              <dt className="inline font-medium text-foreground">Testimone: </dt>
              <dd className="inline">{t.person}</dd>
            </div>
          )}
          {t.year && (
            <div>
              <dt className="inline font-medium text-foreground">Periodo: </dt>
              <dd className="inline">{t.year}</dd>
            </div>
          )}
          {locationName && (
            <div>
              <dt className="inline font-medium text-foreground">Luogo: </dt>
              <dd className="inline">{locationName}</dd>
            </div>
          )}
        </dl>

        {t.description && (
          <p className="mt-4 text-base text-muted-foreground">{t.description}</p>
        )}

        {/* ── Player video ──────────────────────────────────────────────────── */}
        {t.type === 'video' && fileUrl && (
          <div className="mt-8">
            <VideoPlayer src={fileUrl} title={t.title} />
          </div>
        )}

        {/* ── Player audio ──────────────────────────────────────────────────── */}
        {t.type === 'audio' && fileUrl && (
          <div className="mt-8">
            <AudioPlayer src={fileUrl} title={t.title} />
          </div>
        )}

        {/* ── Testo scritto ─────────────────────────────────────────────────── */}
        {t.type === 'written' && t.content && (
          <div className="mt-8 rounded-lg border border-border bg-card p-6">
            <p className="font-serif text-base leading-relaxed text-card-foreground whitespace-pre-wrap">
              {t.content}
            </p>
          </div>
        )}

        {/* ── Trascrizione (sotto player video/audio) ───────────────────────── */}
        {t.type !== 'written' && t.content && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Trascrizione
            </h2>
            <div className="rounded-lg border border-border bg-muted/40 p-5">
              <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                {t.content}
              </p>
            </div>
          </div>
        )}

        {/* Nota GDPR discreta */}
        {t.person && (
          <p className="mt-8 text-xs text-muted-foreground">
            Il testimone ha fornito il proprio consenso alla pubblicazione ai sensi del GDPR.
          </p>
        )}
      </div>
    </>
  )
}
