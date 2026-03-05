import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params

  try {
    const payload = await getPayload({ config })

    const photo = await payload.findByID({
      collection: 'photos',
      id,
      depth: 2,
    })

    if (!photo || photo.status !== 'published') {
      return NextResponse.json({ error: 'Non trovata' }, { status: 404 })
    }

    // Commenti approvati per questa foto
    const commentsResult = await payload.find({
      collection: 'comments',
      where: {
        and: [
          { photo: { equals: id } },
          { status: { equals: 'published' } },
        ],
      },
      sort: 'createdAt',
      limit: 100,
    })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const file = photo.file as any
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const location = photo.location as any

    return NextResponse.json({
      id: photo.id,
      title: photo.title,
      description: photo.description ?? null,
      year: photo.year ?? null,
      decade: photo.decade ?? null,
      locationName: location?.name ?? null,
      imageUrl: file?.url ?? null,
      imageAlt: file?.alt ?? photo.title,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tags: (photo.tags as any[])?.map((t: { tag: string }) => t.tag) ?? [],
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      comments: commentsResult.docs.map((c: any) => ({
        id: c.id,
        author: c.author,
        content: c.content,
        isTagging: c.isTagging,
        createdAt: c.createdAt,
      })),
    })
  } catch {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
