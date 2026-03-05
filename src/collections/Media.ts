import type { CollectionConfig } from 'payload'
import path from 'path'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    // Fase A: salva nella cartella public/media (servita da Next.js staticamente)
    // Fase B: sostituire con storage Cloudflare R2 via @payloadcms/storage-s3
    staticDir: path.resolve('./public/media'),
    mimeTypes: ['image/*', 'video/*', 'audio/*'],
    imageSizes: [
      { name: 'thumbnail', width: 400, height: 300, position: 'centre' },
      { name: 'card',      width: 800, height: 600, position: 'centre' },
      { name: 'hero',      width: 1920, height: 1080, position: 'centre' },
    ],
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      label: 'Testo alternativo (accessibilità)',
      required: true,
    },
    {
      name: 'caption',
      type: 'text',
      label: 'Didascalia',
    },
  ],
}
