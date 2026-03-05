import path from 'path'
import { fileURLToPath } from 'url'
import { buildConfig } from 'payload'
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { lexicalEditor } from '@payloadcms/richtext-lexical'

// Collections
import { Photos } from './collections/Photos.js'
import { Testimonials } from './collections/Testimonials.js'
import { Locations } from './collections/Locations.js'
import { Stories } from './collections/Stories.js'
import { TimelineEvents } from './collections/TimelineEvents.js'
import { Contributions } from './collections/Contributions.js'
import { Comments } from './collections/Comments.js'
import { Users } from './collections/Users.js'
import { Media } from './collections/Media.js'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
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
      url: process.env.DATABASE_URI ?? `file:${path.join(dirname, '../data/urgnanocomera.db')}`,
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
