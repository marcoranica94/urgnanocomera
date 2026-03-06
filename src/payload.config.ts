import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Collections
import { Photos } from './collections/Photos.ts'
import { Testimonials } from './collections/Testimonials.ts'
import { Locations } from './collections/Locations.ts'
import { Stories } from './collections/Stories.ts'
import { TimelineEvents } from './collections/TimelineEvents.ts'
import { Contributions } from './collections/Contributions.ts'
import { Comments } from './collections/Comments.ts'
import { Users } from './collections/Users.ts'
import { Media } from './collections/Media.ts'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL ?? 'http://localhost:3000',

  admin: {
    user: Users.slug,
    meta: {
      titleSuffix: '— UrgnanoComEra Admin',
    },
  },

  collections: [
    Users,
    Media,
    Photos,
    Testimonials,
    Locations,
    Stories,
    TimelineEvents,
    Contributions,
    Comments,
  ],

  editor: lexicalEditor({}),

  secret: process.env.PAYLOAD_SECRET ?? 'dev-secret-change-in-production',

  // ─── Database ─────────────────────────────────────────────────
  // Fase A: SQLite (file locale, zero configurazione server)
  // Fase B: sostituire con @payloadcms/db-postgres e DATABASE_URI
  db: sqliteAdapter({
    client: {
      url: process.env.DATABASE_URI ?? (
        process.env.NODE_ENV === 'production'
          ? 'file:/app/data/urgnanocomera.db'
          : `file:${path.join(dirname, '../data/urgnanocomera.db')}`
      ),
    },
  }),

  // ─── Upload media ─────────────────────────────────────────────
  // Fase A: disco locale nella cartella /public/media
  // Fase B: configurare @payloadcms/storage-s3 per Cloudflare R2
  upload: {
    limits: {
      fileSize: 52_428_800, // 50 MB
    },
  },

  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },

  localization: {
    locales: ['it'],
    defaultLocale: 'it',
  },
})
