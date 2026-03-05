# CLAUDE.md — Istruzioni per Claude Code

> Questo file guida il comportamento di Claude Code nel progetto **UrgnanoComEra**.
> Leggi sempre questo file prima di iniziare a lavorare.

---

## Progetto

**UrgnanoComEra** — Piattaforma digitale della memoria storica di Urgnano.
Sottodominio: `comera.urgnanoturistica.it`
Repository: `urgnanocomera`

---

## Stack tecnologico

- **Next.js 15** (App Router, TypeScript) — frontend e routing
- **Payload CMS 3** — backend headless CMS, admin panel, API
- **SQLite** (Fase A) / **PostgreSQL 18** (Fase B) — database
- **Disco locale** (Fase A) / **Cloudflare R2** (Fase B) — storage media
- **Tailwind CSS + Shadcn/ui** — design system temporaneo (fase 1)
- **Leaflet.js / React-Leaflet** — mappa interattiva
- **Meilisearch** — ricerca full-text archivio
- **GitHub Actions** — CI/CD (staging su `develop`, prod su `main`)
- **Docker / Docker Compose** — containerizzazione

---

## Regole fondamentali

### Design System — IMPORTANTE
La grafica attuale è **TEMPORANEA** (prodotta da Claude nella fase 1).
Verrà sostituita dallo **studio grafico** nella fase 2.

Per facilitare questa transizione:
- Tutti i valori di design (colori, font, spacing, border-radius) devono stare in `src/design-tokens.ts`
- Non hardcodare mai colori o font direttamente nei componenti
- Usare sempre classi Tailwind derivate dai token, non valori raw
- Documentare ogni componente visivo (Storybook se richiesto)

### Mobile-First — OBBLIGATORIO
Il sito è **mobile-first**. Ogni componente, pagina e feature va sviluppata e testata prima su smartphone, poi su desktop.

Regole concrete:
- Scrivere le classi Tailwind partendo dal viewport base (mobile), poi aggiungere `sm:`, `md:`, `lg:` per schermi più grandi — mai il contrario
- La navigazione su mobile usa il menu hamburger (`MobileNav`), non la barra orizzontale
- Touch target minimi: `min-h-[44px] min-w-[44px]` su tutti i bottoni e link
- Nessun `overflow-x` nascosto che mascheri contenuto su mobile
- Testare sempre a 375px prima di aprire una PR

### Lingua del codice
- **Codice, commenti, variabili**: inglese
- **Contenuto UI, documenti, messaggi commit**: italiano
- **Nomi file/cartelle**: inglese (kebab-case)

### Architettura

```
src/
├── app/                    # Next.js App Router
│   ├── (site)/             # Route group sito pubblico
│   │   ├── page.tsx        # Homepage
│   │   ├── archivio/       # Archivio fotografico
│   │   ├── testimonianze/  # Testimonianze vive
│   │   ├── mappa/          # Mappa interattiva
│   │   ├── timeline/       # Timeline storica
│   │   ├── storie/         # Storie e racconti
│   │   └── contribuisci/   # Form contributi
│   └── (payload)/          # Payload CMS admin
├── collections/            # Payload CMS collections
├── components/             # Componenti React riutilizzabili
│   ├── ui/                 # Shadcn primitives
│   └── [feature]/          # Componenti per feature
├── design-tokens.ts        # UNICO FILE per token design
├── lib/                    # Utility, helpers, API client
└── types/                  # TypeScript types globali
```

### Gestione media
- Foto, video e audio vanno sempre su **Cloudflare R2**, mai nel repo
- Usare sempre `next/image` per le immagini con `sizes` appropriato
- Non inserire mai file binari nel repository

### GDPR e Privacy
- Ogni form che raccoglie dati personali deve avere consenso esplicito
- Non loggare mai email o dati personali
- Contributi cittadini: sempre in stato `pending` prima di pubblicare

---

## Workflow Git

```
main        → produzione (deploy automatico)
develop     → staging (deploy automatico)
feature/*   → sviluppo feature
fix/*       → bugfix
```

- Aprire sempre una PR da `feature/*` verso `develop`
- Non fare push diretto su `main`
- Commit in italiano, convenzione: `feat:`, `fix:`, `docs:`, `style:`, `refactor:`, `test:`

---

## Ambienti

| Env | Branch | URL |
|---|---|---|
| Locale | qualsiasi | `localhost:3000` |
| Staging | `develop` | `staging-comera.urgnanoturistica.it` |
| Produzione | `main` | `comera.urgnanoturistica.it` |

---

## Epiche e Sprint (riferimento)

Vedi `SPRINTS.md` per il piano completo.

**Epica 1** — Fondamenta (infra, CI/CD, CMS setup)
**Epica 2** — Frontend Core (layout, homepage, archivio, testimonianze)
**Epica 3** — Features Interattive (mappa, timeline, storie)
**Epica 4** — Contribuzione Cittadina (form, moderazione, commenti)
**Epica 5** — Handoff Grafico (integrazione studio grafico, nuovo design system)
**Epica 6** — Go-Live (SEO, accessibilità, performance, deploy prod)

---

## Note operative

- Quando aggiungi una collection Payload CMS, aggiorna anche i tipi TypeScript
- Ogni nuova sezione pubblica del sito deve avere metadati OpenGraph
- Testare sempre su mobile (375px) **prima** di chiedere review
- I placeholder grafici usano la palette seppia/terra documentata nei token
