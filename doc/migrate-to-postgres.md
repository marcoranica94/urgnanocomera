# Guida migrazione Fase A → Fase B

> Quando: dopo aver attivato dominio reale e VPS dedicato
> Tempo stimato: 2-4 ore

## Cosa cambia

| | Fase A (attuale) | Fase B (produzione) |
|---|---|---|
| Database | SQLite (file locale) | PostgreSQL 18 |
| Media | Disco locale container | Cloudflare R2 |
| Deploy | Railway free tier | VPS con Docker |
| Dominio | URL Railway | `comera.urgnanoturistica.it` |

---

## 1. Preparare PostgreSQL

```bash
# Sul VPS
docker run -d \
  --name urgnanocomera-postgres \
  -e POSTGRES_DB=urgnanocomera \
  -e POSTGRES_USER=urgnano \
  -e POSTGRES_PASSWORD=<password-sicura> \
  -v postgres_data:/var/lib/postgresql/data \
  -p 5432:5432 \
  postgres:16-alpine
```

---

## 2. Cambiare l'adapter in payload.config.ts

```typescript
// Rimuovere:
import { sqliteAdapter } from '@payloadcms/db-sqlite'
// Aggiungere:
import { postgresAdapter } from '@payloadcms/db-postgres'

// Nel buildConfig, sostituire:
db: postgresAdapter({
  pool: {
    connectionString: process.env.DATABASE_URI,
  },
}),
```

---

## 3. Aggiornare package.json

```bash
npm uninstall @payloadcms/db-sqlite
npm install @payloadcms/db-postgres
```

---

## 4. Migrare i dati SQLite → PostgreSQL

```bash
# Esportare dati da Payload (Fase A) come JSON
npm run payload -- export --output ./backup/export.json

# Dopo aver configurato PostgreSQL, importare
npm run payload -- import --input ./backup/export.json
```

---

## 5. Configurare Cloudflare R2 per i media

```bash
npm install @payloadcms/storage-s3
```

In `payload.config.ts`:
```typescript
import { s3Storage } from '@payloadcms/storage-s3'

plugins: [
  s3Storage({
    collections: { media: true },
    bucket: process.env.CLOUDFLARE_R2_BUCKET,
    config: {
      endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
      credentials: {
        accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY,
        secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_KEY,
      },
      region: 'auto',
    },
  }),
],
```

---

## 6. Aggiornare i secrets GitHub

Aggiungere nell'ambiente `production` su GitHub:
- `DATABASE_URI` → stringa connessione PostgreSQL
- `CLOUDFLARE_R2_ACCESS_KEY`
- `CLOUDFLARE_R2_SECRET_KEY`
- `CLOUDFLARE_R2_BUCKET`
- `CLOUDFLARE_R2_ENDPOINT`
- `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY`

---

## 7. Attivare il deploy SSH nel workflow

In `.github/workflows/deploy-prod.yml`, commentare il blocco Railway
e decommentare il blocco `deploy-vps` con `appleboy/ssh-action`.

---

## 8. Aggiornare next.config.ts per R2

```typescript
remotePatterns: [
  {
    protocol: 'https',
    hostname: '<accountid>.r2.cloudflarestorage.com',
  },
],
```
