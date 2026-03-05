import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  sendContributionConfirmation,
  sendContributionNotificationToAdmin,
} from '@/lib/email'

// ─── Schema di validazione ────────────────────────────────────────────────────

const contributionSchema = z.object({
  type: z.enum(['photo', 'video', 'audio', 'story']),
  title: z.string().min(2).max(200),
  description: z.string().min(10).max(2000),
  estimatedYear: z
    .string()
    .optional()
    .transform(v => (v ? parseInt(v, 10) : undefined))
    .pipe(z.number().int().min(1800).max(2000).optional()),
  locationId: z.string().optional(),
  storyText: z.string().max(20000).optional(),
  submitterName: z.string().min(2).max(150),
  submitterEmail: z.string().email(),
  gdprConsent: z.literal('true').refine(v => v === 'true', {
    message: 'Il consenso GDPR è obbligatorio',
  }),
})

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50 MB

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    // ── Estrai campi testo ─────────────────────────────────────────────────
    const raw = {
      type: formData.get('type'),
      title: formData.get('title'),
      description: formData.get('description'),
      estimatedYear: formData.get('estimatedYear') ?? undefined,
      locationId: formData.get('locationId') ?? undefined,
      storyText: formData.get('storyText') ?? undefined,
      submitterName: formData.get('submitterName'),
      submitterEmail: formData.get('submitterEmail'),
      gdprConsent: formData.get('gdprConsent'),
    }

    const parsed = contributionSchema.safeParse(raw)
    if (!parsed.success) {
      return NextResponse.json(
        { error: 'Dati non validi', details: parsed.error.flatten().fieldErrors },
        { status: 400 },
      )
    }

    const data = parsed.data
    const payload = await getPayload({ config })

    // ── Upload file media (se presente) ────────────────────────────────────
    let mediaId: string | number | undefined

    const file = formData.get('file')
    if (file && file instanceof File && file.size > 0) {
      if (file.size > MAX_FILE_SIZE) {
        return NextResponse.json({ error: 'File troppo grande (max 50 MB)' }, { status: 400 })
      }

      const buffer = Buffer.from(await file.arrayBuffer())

      const media = await payload.create({
        collection: 'media',
        data: { alt: data.title },
        file: {
          data: buffer,
          mimetype: file.type,
          name: file.name,
          size: file.size,
        },
      })
      mediaId = media.id
    }

    // ── Crea contributo ────────────────────────────────────────────────────
    const contributionData: Record<string, unknown> = {
      type: data.type,
      submitterName: data.submitterName,
      submitterEmail: data.submitterEmail,
      description: data.storyText
        ? `${data.description}\n\n---\n\n${data.storyText}`
        : data.description,
      gdprConsent: true,
      status: 'pending',
    }

    if (data.estimatedYear !== undefined) {
      contributionData.estimatedYear = data.estimatedYear
    }

    if (data.locationId) {
      contributionData.location = data.locationId
    }

    if (mediaId !== undefined) {
      contributionData.files = [{ file: mediaId }]
    }

    await payload.create({
      collection: 'contributions',
      data: contributionData as Parameters<typeof payload.create>[0]['data'],
    })

    // ── Email ──────────────────────────────────────────────────────────────
    await Promise.allSettled([
      sendContributionConfirmation(data.submitterEmail, data.submitterName, data.type),
      sendContributionNotificationToAdmin({
        name: data.submitterName,
        email: data.submitterEmail,
        type: data.type,
        title: data.title,
      }),
    ])

    return NextResponse.json({ ok: true })
  } catch (err) {
    console.error('[api/contribuisci]', err)
    return NextResponse.json({ error: 'Errore interno del server' }, { status: 500 })
  }
}
