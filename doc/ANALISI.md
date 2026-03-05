# Analisi Tecnica — UrgnanoComEra

> Piattaforma digitale della memoria storica di Urgnano
> Sottodominio di `urgnanoturistica.it`
> Data analisi: 2026-03-05

---

## 1. Contesto e Obiettivi

### 1.1 Descrizione del progetto

**UrgnanoComEra** è un sito web che racconta il passato del Comune di Urgnano. Non un semplice archivio, ma un racconto interattivo della memoria storica del territorio. Il progetto nasce su iniziativa dell'Assessorato alla Digitalizzazione del Comune di Urgnano.

Il sito permetterà di:
- Viaggiare nel tempo attraverso fotografie storiche organizzate per luoghi, periodi e temi
- Ascoltare voci del passato tramite video e audio di cittadini
- Esplorare il territorio tramite una mappa interattiva dove ogni luogo è collegato alla sua storia
- Contribuire alla memoria collettiva tramite invio di foto, video e racconti
- Taggare e commentare le fotografie per arricchire il censimento storico

### 1.2 Naming

Opzioni in valutazione (decisione da prendere con il Comune):

| Nome | Carattere |
|---|---|
| **UrgnanoComEra** | Diretto e nostalgico. Evoca il confronto tra passato e presente |
| Voci di Urgnano | Centrato sulle testimonianze e i racconti delle persone |
| Memorie di Urgnano | Classico ed elegante, sottolinea la conservazione storica |
| Urgnano Racconta | Dinamico e narrativo, il paese protagonista |

**Nome repository/progetto scelto**: `urgnanocomera`
**Sottodominio**: `comera.urgnanoturistica.it` (da confermare con il Comune)

### 1.3 Vincoli e note

- La grafica **iniziale** è temporanea (prodotta da Claude), verrà **sostituita dallo studio grafico** dedicato in una fase successiva — il design system deve essere modulare e facilmente rimpiazzabile
- Il deploy avviene tramite **GitHub Actions** in entrambe le fasi
- Il progetto deve rispettare le norme GDPR per i dati dei cittadini che contribuiscono
- Il sito supporta **tema chiaro e scuro** (light/dark mode) con persistenza della preferenza utente
- Il sito è **mobile-first**: ogni funzionalità deve essere pienamente usabile su smartphone prima di essere ottimizzata per desktop

### 1.4 Fasi di deployment

Il progetto evolve in due fasi infrastrutturali:

**Fase A — Iniziale (ora)**
- CI/CD: GitHub Actions
- Hosting: servizio gratuito/economico (Railway free tier o Render)
- Database: **SQLite** (nessun server separato, file locale)
- Media: **disco locale** del container (foto di test, niente storage cloud)
- Obiettivo: avere tutto funzionante e iterare velocemente senza costi fissi

**Fase B — Produzione (futuro)**
- Hosting: VPS o server dedicato con dominio reale
- Database: **PostgreSQL 18** (migrazione da SQLite con zero downtime)
- Media: **Cloudflare R2** (storage scalabile)
- Dominio: `comera.urgnanoturistica.it`
- La migrazione Fase A → Fase B non richiede modifiche al codice applicativo — solo le variabili d'ambiente cambiano

---

## 2. Architettura del Sistema

### 2.1 Stack tecnologico

**Fase A (iniziale)**
```
Frontend          → Next.js 14 (App Router, TypeScript)
Styling           → Tailwind CSS + Shadcn/ui + next-themes (dark/light mode)
CMS               → Payload CMS 3 (headless, self-hosted, TypeScript nativo)
Database          → SQLite (via @payloadcms/db-sqlite)
Media Storage     → Disco locale del container
Mappe             → Leaflet.js con tiles OpenStreetMap
CI/CD             → GitHub Actions → Railway / Render free tier
```

**Fase B (produzione)**
```
Frontend          → Next.js 14 (invariato)
Styling           → invariato (+ sostituzione token per studio grafico)
CMS               → Payload CMS 3 (invariato)
Database          → PostgreSQL 18 (migrazione da SQLite)
Media Storage     → Cloudflare R2
Ricerca           → Meilisearch
CI/CD             → GitHub Actions → VPS / server dedicato
Containerizzazione→ Docker + Docker Compose
```

### 2.2 Struttura sottodominio

```
urgnanoturistica.it          → sito principale turismo (esistente)
comera.urgnanoturistica.it   → questo progetto (nuovo)
  └── /                      → Homepage
  └── /archivio              → Archivio fotografico
  └── /testimonianze         → Testimonianze vive (video/audio)
  └── /mappa                 → Mappa interattiva
  └── /timeline              → Timeline storica
  └── /storie                → Storie e racconti
  └── /contribuisci          → Form contributi cittadini
  └── /admin                 → Payload CMS admin panel (nascosto)
```

### 2.3 Diagramma architettura

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Repository                     │
│  ┌─────────────┐    ┌─────────────┐   ┌──────────────┐ │
│  │  Next.js    │    │ Payload CMS │   │  GitHub      │ │
│  │  Frontend   │    │  (Backend)  │   │  Actions     │ │
│  └──────┬──────┘    └──────┬──────┘   └──────┬───────┘ │
└─────────┼─────────────────┼─────────────────┼──────────┘
          │                 │                 │
          ▼                 ▼                 ▼
    ┌──────────┐     ┌──────────┐      ┌──────────┐
    │  CDN /   │     │ PostgreSQL│     │  Docker  │
    │ Vercel / │     │    DB    │      │  Deploy  │
    │  Server  │     └──────────┘      └──────────┘
    └──────────┘           │
          │         ┌──────────────┐
          └────────▶│ Cloudflare  │
                    │     R2      │
                    │(foto/video) │
                    └──────────────┘
```

---

## 3. Modello dei Dati

### 3.1 Entità principali

#### `Photo` — Fotografia storica
```typescript
{
  id: string
  title: string
  description: string
  year?: number          // anno stimato (es. 1965)
  decade?: string        // es. "1960-1970"
  location: Location     // luogo collegato
  tags: Tag[]
  file: Media            // Cloudflare R2
  uploader: 'admin' | 'citizen'
  status: 'published' | 'pending' | 'rejected'
  comments: Comment[]
  createdAt: Date
}
```

#### `Testimonial` — Testimonianza viva
```typescript
{
  id: string
  title: string
  description: string
  person: string         // nome del testimone (consenso GDPR)
  year?: number          // anno del racconto
  type: 'video' | 'audio' | 'written'
  file?: Media
  content?: string       // testo per tipo "written"
  location?: Location
  tags: Tag[]
  status: 'published' | 'pending'
}
```

#### `Location` — Luogo di Urgnano
```typescript
{
  id: string
  name: string           // es. "Piazza Roma", "Via Mazzini"
  description: string
  lat: number
  lng: number
  photos: Photo[]
  testimonials: Testimonial[]
  stories: Story[]
}
```

#### `Story` — Storia/racconto tematico
```typescript
{
  id: string
  title: string
  slug: string
  content: RichText      // blocchi: testo, foto, audio, video
  coverImage: Media
  tags: Tag[]
  relatedPhotos: Photo[]
  relatedTestimonials: Testimonial[]
  publishedAt: Date
}
```

#### `TimelineEvent` — Evento nella timeline
```typescript
{
  id: string
  year: number
  title: string
  description: string
  photos: Photo[]
  category: 'storia' | 'tradizione' | 'urbanistica' | 'comunità'
}
```

#### `Contribution` — Contributo cittadino (moderazione)
```typescript
{
  id: string
  type: 'photo' | 'video' | 'audio' | 'story'
  submitterName: string
  submitterEmail: string  // per notifiche, GDPR-compliant
  gdprConsent: boolean
  files: Media[]
  description: string
  estimatedYear?: number
  status: 'pending' | 'approved' | 'rejected'
  reviewedBy?: string
  reviewedAt?: Date
}
```

#### `Comment` — Commento su fotografia
```typescript
{
  id: string
  photo: Photo
  author: string
  content: string
  isTagging: boolean     // commento di censimento/identificazione
  status: 'published' | 'pending'
}
```

---

## 4. Sezioni del Sito

### 4.1 Homepage

- Hero con immagine storica animata (fade tra foto d'epoca)
- Presentazione del progetto con call-to-action
- Sezioni preview: ultime foto, ultime testimonianze, storia del mese
- Counter: N fotografie · N testimonianze · N luoghi mappati

### 4.2 Archivio Fotografico

- Griglia masonry di foto storiche
- Filtri: per **luogo**, **periodo/decennio**, **tema/tag**
- Ricerca testuale (Meilisearch)
- Lightbox con metadati completi e commenti
- Paginazione / infinite scroll

### 4.3 Testimonianze Vive

- Griglia card con thumbnail e durata (video/audio) o estratto (scritto)
- Filtri: per tipo, luogo, periodo
- Player video/audio integrato
- Trascrizione testuale (accessibilità)

### 4.4 Mappa Interattiva

- Mappa Leaflet centrata su Urgnano (OpenStreetMap)
- Marker per ogni luogo con foto/testimonianze associate
- Cluster di marker per zoom out
- Popup con anteprima foto + link alla scheda luogo
- Toggle: mostra/nascondi diversi tipi di contenuto

### 4.5 Timeline Storica

- Scorrimento orizzontale per decennio (1900-2000)
- Per ogni decennio: eventi chiave, foto, testimonianze
- Navigazione via slider o click sui decenni
- Responsive su mobile (scorrimento verticale)

### 4.6 Storie e Racconti

- Elenco articoli multimediali (foto + testo + audio/video)
- Template flessibile con blocchi Payload CMS
- Condivisione social (og:image, og:description)

### 4.7 Contribuisci

- Form multi-step: tipo contributo → upload → metadati → consenso GDPR
- Upload file con anteprima
- Email di conferma al cittadino
- Pannello admin per moderazione contributi

---

## 5. Mobile-First e Responsive Design

Il sito è progettato **mobile-first**: l'esperienza su smartphone è la priorità, poi si scala verso tablet e desktop. Questo riflette il pubblico reale — cittadini che esplorano sul telefono, magari mentre camminano per il paese.

### 5.1 Breakpoint Tailwind

| Nome | Larghezza | Uso |
|---|---|---|
| `default` | 0 – 639px | Smartphone (base) |
| `sm` | 640px+ | Smartphone grandi / tablet piccoli |
| `md` | 768px+ | Tablet |
| `lg` | 1024px+ | Laptop / desktop |
| `xl` | 1280px+ | Desktop wide |

### 5.2 Regole per ogni componente

- **Navigazione**: menu hamburger su mobile (< `lg`), barra orizzontale su desktop
- **Griglia foto**: 1 colonna su mobile → 2 su `sm` → 3 su `md` → 4 su `lg`
- **Mappa**: a schermo intero su mobile, sidebar collassabile
- **Timeline**: scroll verticale su mobile, scroll orizzontale su desktop
- **Form contributi**: step a pagina intera su mobile, wizard laterale su desktop
- **Lightbox/overlay**: fullscreen su mobile, modale centrata su desktop
- **Touch target**: minimo 44×44px per tutti gli elementi interattivi

### 5.3 Test obbligatori

Ogni pagina viene testata su questi dispositivi prima di considerarsi completa:

| Dispositivo | Viewport | Priorità |
|---|---|---|
| iPhone SE | 375×667px | Must |
| iPhone 14 | 390×844px | Must |
| Android medio | 412×915px | Must |
| iPad | 768×1024px | Should |
| Desktop | 1440×900px | Must |

---

## 7. Grafica e Design System

### 5.1 Fase 1 — Grafica Claude (Temporanea)

La grafica iniziale seguirà un sistema di design **deliberatamente sostituibile**:

- Palette: toni caldi seppia/terra (evocativi della memoria storica) + accento istituzionale blu Comune
- Typography: serif per titoli (carattere storico), sans-serif per corpo testo
- Componenti Shadcn/ui (unstyled primitives) con Tailwind
- **Tutti i token di design isolati in `design-tokens.ts`** — il team grafico sostituirà solo questo file e gli asset

### 5.2 Fase 2 — Grafica Studio (Produzione)

Il team grafico riceverà:
- Il documento di handoff con lista componenti e token
- Storybook con tutti i componenti documentati
- Le specifiche delle sezioni da redesignare

Il passaggio non richiederà refactoring del codice business — solo sostituzione di token, asset e stili.

---

## 8. CI/CD con GitHub Actions

### 6.1 Pipeline

```yaml
# .github/workflows/
├── ci.yml          # Test, lint, type-check su ogni PR
├── deploy-staging.yml  # Deploy su ambiente staging (push su develop)
└── deploy-prod.yml     # Deploy su produzione (push su main/tag)
```

### 6.2 Ambienti

| Ambiente | Branch | URL |
|---|---|---|
| **Development** | locale | `localhost:3000` |
| **Staging** | `develop` | `staging-comera.urgnanoturistica.it` |
| **Production** | `main` | `comera.urgnanoturistica.it` |

### 6.3 Secrets GitHub necessari

```
POSTGRES_URL              → stringa connessione PostgreSQL
CLOUDFLARE_R2_ACCESS_KEY  → accesso media storage
CLOUDFLARE_R2_SECRET_KEY
CLOUDFLARE_R2_BUCKET
CLOUDFLARE_R2_ENDPOINT
PAYLOAD_SECRET            → chiave JWT Payload CMS
MEILISEARCH_HOST
MEILISEARCH_KEY
SMTP_HOST                 → per email contributi
SMTP_USER
SMTP_PASS
```

---

## 9. Sicurezza e Conformità

### 7.1 GDPR

- Consenso esplicito per ogni contributo cittadino
- Diritto alla cancellazione: form admin per rimozione contributi
- Dati dei submitter non visibili pubblicamente
- Cookie banner per analytics (se presenti)
- Informativa privacy dedicata (`/privacy`)

### 7.2 Moderazione contenuti

- Tutti i contributi cittadini passano per un flusso di approvazione admin
- Commenti con moderazione prima della pubblicazione
- Possibilità di segnalare contenuti inappropriati

### 7.3 Accessibilità

- Obiettivo: **WCAG 2.1 AA**
- Alt text obbligatorio per le foto nell'admin
- Trascrizioni per audio/video
- Navigazione da tastiera completa

---

## 10. Performance e SEO

- **SSG** per pagine statiche (archivio, storie) con **ISR** (Incremental Static Regeneration)
- **SSR** per pagine con contenuto dinamico (ricerca, contribuzioni)
- Ottimizzazione immagini con `next/image` + Cloudflare R2 CDN
- **OpenGraph** per ogni foto/storia (condivisione social)
- Sitemap XML generata automaticamente
- Schema.org markup per patrimonio culturale (tipo `ArchiveMaterial`, `Photograph`)

---

## 11. Dipendenze Tecniche Chiave

```json
{
  "next": "^14",
  "payload": "^3",
  "@payloadcms/db-postgres": "^3",
  "@payloadcms/richtext-lexical": "^3",
  "tailwindcss": "^3",
  "@shadcn/ui": "latest",
  "leaflet": "^1",
  "react-leaflet": "^4",
  "meilisearch": "^0.35",
  "react-player": "^2",
  "zod": "^3",
  "typescript": "^5"
}
```

---

## 12. Rischi e Mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---|---|---|---|
| Qualità bassa dei contributi cittadini | Alta | Media | Flusso moderazione admin robusto |
| Diritti d'autore sulle foto storiche | Media | Alta | Disclaimer + consenso esplicito all'upload |
| Dipendenza da studio grafico per fase 2 | Media | Bassa | Design system modulare, handoff documentato |
| Scalabilità media storage | Bassa | Media | Cloudflare R2 scala automaticamente |
| Performance con molti video | Media | Media | Lazy loading, streaming, Cloudflare CDN |

---

*Documento generato il 2026-03-05 — da aggiornare a ogni sprint review*
