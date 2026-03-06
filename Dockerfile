FROM node:22-alpine AS base

# ─── Dipendenze ──────────────────────────────────────────────────────────────
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

COPY package.json package-lock.json* ./
# --legacy-peer-deps: react-leaflet 4.x dichiara peer react@^18 ma funziona con React 19
RUN npm ci --legacy-peer-deps

# ─── Build ───────────────────────────────────────────────────────────────────
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npm run generate:types && \
    npm run generate:importmap && \
    npm run build

# ─── Runner ──────────────────────────────────────────────────────────────────
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# su-exec per droppare da root a nextjs dopo aver fixato i permessi del volume
RUN apk add --no-cache su-exec && \
    addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Crea cartella dati persistenti (unico volume Railway: /app/data)
# Fase A: SQLite in /app/data/urgnanocomera.db, media in /app/data/media
RUN mkdir -p /app/data/media && \
    chown -R nextjs:nodejs /app/data

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Copiare i binding nativi di libsql per musl (Alpine)
COPY --from=builder /app/node_modules/@libsql ./node_modules/@libsql
COPY --from=builder /app/node_modules/libsql ./node_modules/libsql

# Copiare sharp e le sue dipendenze native
COPY --from=builder /app/node_modules/sharp ./node_modules/sharp
COPY --from=builder /app/node_modules/@img ./node_modules/@img

# Entrypoint: fixa permessi volume a runtime, poi droppa a nextjs
COPY docker-entrypoint.sh /app/docker-entrypoint.sh
RUN chmod +x /app/docker-entrypoint.sh

EXPOSE 3000

# PORT viene iniettata da Railway al runtime (non hardcodare)
ENV HOSTNAME="0.0.0.0"

# Avvio come root; l'entrypoint fa chown e poi esegue come nextjs
CMD ["/app/docker-entrypoint.sh"]
