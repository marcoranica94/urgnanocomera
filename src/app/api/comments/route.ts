import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { photoId, author, content, isTagging } = body

    if (!photoId || !author?.trim() || !content?.trim()) {
      return NextResponse.json({ error: 'Campi obbligatori mancanti' }, { status: 400 })
    }

    if (author.trim().length > 100 || content.trim().length > 2000) {
      return NextResponse.json({ error: 'Testo troppo lungo' }, { status: 400 })
    }

    const payload = await getPayload({ config })

    await payload.create({
      collection: 'comments',
      data: {
        photo: photoId,
        author: author.trim(),
        content: content.trim(),
        isTagging: !!isTagging,
        status: 'pending',
      },
    })

    return NextResponse.json({ ok: true })
  } catch {
    return NextResponse.json({ error: 'Errore interno' }, { status: 500 })
  }
}
