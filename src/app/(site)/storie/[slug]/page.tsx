import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { LexicalContent } from '@/components/story/LexicalContent'
import { ShareButton } from '@/components/story/ShareButton'
import { PhotoCard } from '@/components/photo/PhotoCard'
import { TestimonialCard } from '@/components/testimonial/TestimonialCard'

interface PageProps {
  params: Promise<{ slug: string }>
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getStory(slug: string): Promise<any | null> {
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'stories',
      where: { and: [{ slug: { equals: slug } }, { status: { equals: 'published' } }] },
      limit: 1,
      depth: 2,
    })
    return res.docs[0] ?? null
  } catch { return null }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function getRelatedStories(currentId: any, tags: string[]): Promise<any[]> {
  if (!tags.length) return []
  try {
    const payload = await getPayload({ config })
    const res = await payload.find({
      collection: 'stories',
      where: {
        and: [
          { status: { equals: 'published' } },
          { id: { not_equals: currentId } },
        ],
      },
      limit: 3,
      sort: '-publishedAt',
      depth: 1,
    })
    return res.docs
  } catch { return [] }
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) return {}
  const coverUrl = story.coverImage?.url ?? null
  return {
    title: story.title,
    description: story.summary ?? `Storia di Urgnano — ${story.title}`,
    openGraph: {
      title: `${story.title} — UrgnanoComEra`,
      description: story.summary ?? undefined,
      images: coverUrl ? [{ url: coverUrl, alt: story.coverImage?.alt ?? story.title }] : [],
      type: 'article',
      publishedTime: story.publishedAt ?? undefined,
    },
  }
}

export default async function StoryPage({ params }: PageProps) {
  const { slug } = await params
  const story = await getStory(slug)
  if (!story) notFound()

  const tags: string[] = story.tags?.map((t: any) => t.tag) ?? []
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const relatedStories = await getRelatedStories(story.id, tags) as any[]

  const coverUrl: string | null = story.coverImage?.url ?? null
  const coverAlt: string = story.coverImage?.alt ?? story.title
  const serverUrl = process.env.NEXT_PUBLIC_SERVER_URL ?? ''
  const storyUrl = `${serverUrl}/storie/${story.slug}`

  const schemaOrg = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: story.title,
    description: story.summary ?? undefined,
    image: coverUrl ?? undefined,
    datePublished: story.publishedAt ?? undefined,
    publisher: { '@type': 'Organization', name: 'Comune di Urgnano' },
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }} />

      <article className="mx-auto max-w-3xl px-4 py-10 sm:px-6">
        {/* Breadcrumb */}
        <Link href="/storie" className="mb-6 inline-flex min-h-[44px] items-center text-sm text-muted-foreground hover:text-foreground">
          ← Storie e racconti
        </Link>

        {/* Copertina */}
        {coverUrl && (
          <div className="relative mb-8 aspect-[16/7] w-full overflow-hidden rounded-xl bg-muted">
            <Image src={coverUrl} alt={coverAlt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 768px" priority />
          </div>
        )}

        {/* Intestazione */}
        <header className="mb-8">
          <h1 className="font-serif text-3xl font-bold leading-tight text-foreground sm:text-4xl">
            {story.title}
          </h1>
          {story.summary && (
            <p className="mt-4 text-lg text-muted-foreground">{story.summary}</p>
          )}
          <div className="mt-4 flex flex-wrap items-center gap-3">
            {story.publishedAt && (
              <time className="text-xs text-muted-foreground" dateTime={story.publishedAt}>
                {new Date(story.publishedAt).toLocaleDateString('it-IT', { year: 'numeric', month: 'long', day: 'numeric' })}
              </time>
            )}
            {tags.map(tag => (
              <span key={tag} className="rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">{tag}</span>
            ))}
            <div className="ml-auto">
              <ShareButton title={story.title} url={storyUrl} />
            </div>
          </div>
        </header>

        {/* Corpo rich text */}
        {story.content && (
          <div className="border-t border-border pt-8">
            <LexicalContent content={story.content} />
          </div>
        )}

        {/* Foto correlate */}
        {story.relatedPhotos?.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="mb-5 font-serif text-xl font-bold text-foreground">Fotografie correlate</h2>
            <div className="columns-1 gap-4 sm:columns-2">
              {story.relatedPhotos.map((photo: any) => {
                const imgUrl = photo.file?.url ?? null
                if (!imgUrl) return null
                return (
                  <div key={photo.id} className="mb-4 break-inside-avoid">
                    <PhotoCard
                      id={photo.id}
                      title={photo.title}
                      imageUrl={imgUrl}
                      imageAlt={photo.file?.alt ?? photo.title}
                      year={photo.year}
                      href={`/archivio?foto=${photo.id}`}
                    />
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* Testimonianze correlate */}
        {story.relatedTestimonials?.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="mb-5 font-serif text-xl font-bold text-foreground">Testimonianze correlate</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {story.relatedTestimonials.map((t: any) => (
                <TestimonialCard
                  key={t.id}
                  id={t.id}
                  title={t.title}
                  type={t.type}
                  person={t.person}
                  description={t.description}
                  year={t.year}
                  href={`/testimonianze/${t.id}`}
                />
              ))}
            </div>
          </section>
        )}

        {/* Storie correlate */}
        {relatedStories.length > 0 && (
          <section className="mt-12 border-t border-border pt-8">
            <h2 className="mb-5 font-serif text-xl font-bold text-foreground">Altre storie</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {relatedStories.map((s: any) => (
                <Link
                  key={s.id}
                  href={`/storie/${s.slug}`}
                  className="group flex flex-col overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
                >
                  {s.coverImage?.url && (
                    <div className="relative h-32 w-full flex-shrink-0 overflow-hidden bg-muted">
                      <Image
                        src={s.coverImage.url}
                        alt={s.coverImage.alt ?? s.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, 256px"
                      />
                    </div>
                  )}
                  <div className="p-3">
                    <p className="line-clamp-2 text-sm font-semibold text-card-foreground group-hover:text-primary transition-colors">
                      {s.title}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  )
}
