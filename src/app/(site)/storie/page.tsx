import type { Metadata } from 'next'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Storie e racconti',
  description: 'Racconti multimediali sulla storia e la vita di Urgnano nel Novecento.',
  openGraph: { title: 'Storie e racconti — UrgnanoComEra' },
}

export default async function StoriesPage() {
  const payload = await getPayload({ config })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const res = await payload.find({
    collection: 'stories',
    where: { status: { equals: 'published' } },
    limit: 100,
    sort: '-publishedAt',
    depth: 1,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const stories: any[] = res.docs

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-10">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Storie e racconti
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Pagine multimediali che raccontano Urgnano attraverso fotografie, voci e testimonianze
        </p>
      </div>

      {stories.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-muted-foreground">Nessuna storia pubblicata ancora.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {stories.map((story: any) => {
            const coverUrl = story.coverImage?.url ?? null
            const coverAlt = story.coverImage?.alt ?? story.title
            return (
              <Link
                key={story.id}
                href={`/storie/${story.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-border bg-card transition-shadow hover:shadow-md"
              >
                {/* Copertina */}
                <div className="relative h-48 w-full flex-shrink-0 bg-muted">
                  {coverUrl ? (
                    <Image
                      src={coverUrl}
                      alt={coverAlt}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-secondary/50">
                      <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24"
                        fill="none" stroke="currentColor" strokeWidth="1" className="text-muted-foreground" aria-hidden>
                        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
                        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
                      </svg>
                    </div>
                  )}
                </div>

                {/* Contenuto */}
                <div className="flex flex-1 flex-col gap-2 p-5">
                  <h2 className="font-serif text-lg font-bold leading-snug text-card-foreground group-hover:text-primary transition-colors">
                    {story.title}
                  </h2>
                  {story.summary && (
                    <p className="line-clamp-3 text-sm text-muted-foreground">{story.summary}</p>
                  )}
                  {story.tags?.length > 0 && (
                    <div className="mt-auto flex flex-wrap gap-1 pt-2">
                      {story.tags.slice(0, 3).map((t: any) => (
                        <span key={t.tag} className="rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                          {t.tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
