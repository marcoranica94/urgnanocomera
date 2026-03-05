# Piano Sprint — UrgnanoComEra

> Metodologia: Scrum-like, sprint da 2 settimane
> Team: 1 sviluppatore full-stack + 1 team grafico (fase 2)
> Velocità stimata: ~20 story point per sprint

---

## EPICA 1 — Fondamenta del Progetto

**Obiettivo**: Repository pronto, CI/CD operativo, CMS installato e configurato, ambienti online.

> **Fase A**: SQLite + disco locale + GitHub Actions → Railway/Render free tier.
> Nessun PostgreSQL né Cloudflare R2 in questa fase.

---

### Sprint 1.1 — Setup Infrastruttura

**Durata**: 2 settimane | **Story Points totali**: ~18

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E1-01 | Inizializzare repository Next.js 14 con TypeScript e App Router | 2 | Must |
| E1-02 | Configurare Payload CMS 3 con SQLite (`@payloadcms/db-sqlite`) | 3 | Must |
| E1-03 | Setup Docker Compose (Next.js + Payload, senza PostgreSQL) | 2 | Must |
| E1-04 | Configurare GitHub Actions: CI (lint, typecheck, build) | 3 | Must |
| E1-05 | Configurare GitHub Actions: deploy su Railway/Render (push `develop`) | 3 | Must |
| E1-06 | Configurare GitHub Actions: deploy produzione (push `main`) | 2 | Must |
| E1-07 | Setup secrets GitHub (Payload secret, SMTP, deploy token) | 1 | Must |
| E1-08 | Preparare `migrate-to-postgres.md`: guida alla migrazione Fase B | 2 | Should |

#### Criteri di accettazione Sprint 1.1
- [ ] PR su `develop` → CI (lint + typecheck + build) passa
- [ ] Push su `develop` → staging aggiornato entro 5 minuti
- [ ] Admin Payload CMS raggiungibile su staging con SQLite
- [ ] `docker compose up` porta il sito in locale su `localhost:3000`

---

### Sprint 1.2 — Modello Dati e Media Storage

**Durata**: 2 settimane | **Story Points totali**: ~20

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E1-09 | Creare collection Payload: `Photo` | 3 | Must |
| E1-10 | Creare collection Payload: `Testimonial` | 3 | Must |
| E1-11 | Creare collection Payload: `Location` | 2 | Must |
| E1-12 | Creare collection Payload: `Story` | 3 | Must |
| E1-13 | Creare collection Payload: `TimelineEvent` | 2 | Must |
| E1-14 | Creare collection Payload: `Contribution` e `Comment` | 3 | Must |
| E1-15 | Media upload su disco locale (Fase A) — configurare per R2 in Fase B | 2 | Must |
| E1-16 | Caricare 10 foto di test per validare pipeline | 1 | Must |

#### Criteri di accettazione Sprint 1.2
- [ ] Admin Payload: inserimento e modifica di tutti i tipi di contenuto
- [ ] Upload foto → file salvato su disco locale, URL restituito correttamente
- [ ] Relazioni tra entità funzionanti (Foto → Location, etc.)
- [ ] API locale Payload raggiungibile da Next.js

---

## EPICA 2 — Frontend Core

**Obiettivo**: Sito pubblico con layout, homepage, archivio fotografico e testimonianze funzionanti. Grafica temporanea Claude (fase 1).

---

### Sprint 2.1 — Design System e Layout

**Durata**: 2 settimane | **Story Points totali**: ~18

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E2-01 | Creare `design-tokens.ts` con palette light/dark, tipografia, spacing | 2 | Must |
| E2-02 | Installare e configurare Tailwind CSS + Shadcn/ui + `next-themes` | 2 | Must |
| E2-03 | Implementare dark/light mode: `ThemeProvider`, toggle nel header, persistenza | 3 | Must |
| E2-04 | Creare layout base: Header con navigazione + Footer | 3 | Must |
| E2-05 | Header: logo, menu principale, toggle tema chiaro/scuro | 3 | Must |
| E2-06 | Footer: link utili, info Comune, credits | 1 | Must |
| E2-07 | Componente: `PhotoCard` (anteprima foto con metadati, adattiva al tema) | 3 | Must |
| E2-08 | Componente: `TestimonialCard` (card video/audio/testo) | 2 | Must |
| E2-09 | Menu hamburger mobile: overlay fullscreen con tutti i link nav | 3 | Must |
| E2-10 | Verifica touch target ≥ 44px su tutti gli elementi interattivi del layout | 1 | Must |
| E2-11 | Test layout su 375px (iPhone SE), 390px (iPhone 14), 412px (Android) | 1 | Must |

> **Nota**: La palette light usa toni seppia/crema. La palette dark usa toni antracite/oro.
> Entrambe definite in `design-tokens.ts` — il team grafico sostituirà solo questo file.
> `next-themes` gestisce la persistenza in `localStorage` e rispetta `prefers-color-scheme`.
> Il menu hamburger su mobile è obbligatorio: la nav desktop è nascosta sotto `lg:`.

---

### Sprint 2.2 — Homepage

**Durata**: 2 settimane | **Story Points totali**: ~16

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E2-09 | Hero section con slideshow foto storiche | 4 | Must |
| E2-10 | Sezione presentazione progetto (testo + CTA) | 2 | Must |
| E2-11 | Sezione "Ultime foto aggiunte" (griglia 3 foto) | 2 | Must |
| E2-12 | Sezione "Ultime testimonianze" (card 2 testimonianze) | 2 | Must |
| E2-13 | Sezione "Storia del mese" (story in evidenza) | 2 | Must |
| E2-14 | Counter animato: N foto · N testimonianze · N luoghi | 2 | Must |
| E2-15 | CTA "Contribuisci" visibile in homepage | 1 | Must |
| E2-16 | Metadati OpenGraph per homepage | 1 | Should |

---

### Sprint 2.3 — Archivio Fotografico

**Durata**: 2 settimane | **Story Points totali**: ~22

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E2-17 | Pagina `/archivio`: griglia masonry di foto | 4 | Must |
| E2-18 | Filtri: per luogo, decennio, tag | 4 | Must |
| E2-19 | Ricerca testuale (Meilisearch integration) | 4 | Must |
| E2-20 | Lightbox: visualizzazione foto a schermo intero con metadati | 3 | Must |
| E2-21 | Sezione commenti nella lightbox | 2 | Must |
| E2-22 | Paginazione / infinite scroll | 2 | Must |
| E2-23 | OpenGraph per ogni foto (per condivisione) | 1 | Should |
| E2-24 | Schema.org markup `Photograph` | 2 | Should |

---

### Sprint 2.4 — Testimonianze Vive

**Durata**: 2 settimane | **Story Points totali**: ~18

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E2-25 | Pagina `/testimonianze`: griglia card con filtri | 3 | Must |
| E2-26 | Player video integrato (react-player + R2) | 4 | Must |
| E2-27 | Player audio integrato | 3 | Must |
| E2-28 | Visualizzazione testimonianze scritte con typography | 2 | Must |
| E2-29 | Filtri: tipo (video/audio/scritto), luogo, periodo | 2 | Must |
| E2-30 | Trascrizione testuale under player (accessibilità) | 2 | Must |
| E2-31 | Pagina singola testimonianza con metadati OpenGraph | 2 | Should |

---

## EPICA 3 — Features Interattive

**Obiettivo**: Mappa interattiva, timeline storica, pagine storie multimediali.

---

### Sprint 3.1 — Mappa Interattiva

**Durata**: 2 settimane | **Story Points totali**: ~20

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E3-01 | Pagina `/mappa`: mappa Leaflet centrata su Urgnano | 3 | Must |
| E3-02 | Marker per ogni Location con cluster automatico | 4 | Must |
| E3-03 | Popup marker: anteprima foto + nome luogo + link | 3 | Must |
| E3-04 | Sidebar: lista luoghi con filtro e click per centrare | 3 | Must |
| E3-05 | Toggle layer: mostra/nascondi foto, testimonianze, storie | 3 | Must |
| E3-06 | Pagina singola Location (`/mappa/[slug]`) con tutti i contenuti | 3 | Must |
| E3-07 | Responsive: mappa usabile su mobile | 1 | Must |

---

### Sprint 3.2 — Timeline Storica

**Durata**: 2 settimane | **Story Points totali**: ~16

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E3-08 | Pagina `/timeline`: scroller orizzontale per decennio | 4 | Must |
| E3-09 | Card decennio: eventi, foto in evidenza, link a contenuti | 4 | Must |
| E3-10 | Navigazione via slider + click sui decenni | 2 | Must |
| E3-11 | Versione mobile: scroll verticale | 3 | Must |
| E3-12 | Animazioni di entrata per gli eventi | 2 | Should |
| E3-13 | Admin Payload: interfaccia semplice per aggiungere eventi | 1 | Must |

---

### Sprint 3.3 — Storie e Racconti

**Durata**: 2 settimane | **Story Points totali**: ~16

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E3-14 | Pagina `/storie`: elenco storie con copertina e sommario | 3 | Must |
| E3-15 | Pagina singola storia (`/storie/[slug]`): layout multimediale | 4 | Must |
| E3-16 | Blocchi rich text Payload: testo, foto, audio, video, citazione | 4 | Must |
| E3-17 | Storie correlate in fondo alla pagina | 2 | Should |
| E3-18 | OpenGraph + Schema.org per ogni storia | 1 | Should |
| E3-19 | Condivisione social (bottone share) | 2 | Should |

---

## EPICA 4 — Contribuzione Cittadina

**Obiettivo**: I cittadini possono inviare foto, video e racconti. Gli admin moderano e pubblicano.

---

### Sprint 4.1 — Form Contributi

**Durata**: 2 settimane | **Story Points totali**: ~20

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E4-01 | Pagina `/contribuisci`: landing con spiegazione | 2 | Must |
| E4-02 | Form multi-step: selezione tipo (foto/video/audio/racconto) | 3 | Must |
| E4-03 | Step upload: drag & drop con anteprima, max 50MB | 4 | Must |
| E4-04 | Step metadati: anno stimato, luogo, descrizione | 3 | Must |
| E4-05 | Step consenso GDPR: checkbox esplicito + link privacy | 2 | Must |
| E4-06 | Email di conferma al cittadino post-invio | 2 | Must |
| E4-07 | Notifica email all'admin per ogni nuovo contributo | 2 | Must |
| E4-08 | Validazione lato server con Zod | 2 | Must |

---

### Sprint 4.2 — Moderazione e Commenti

**Durata**: 2 settimane | **Story Points totali**: ~18

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E4-09 | Admin Payload: pannello moderazione contributi | 4 | Must |
| E4-10 | Workflow: pending → approved/rejected con note | 3 | Must |
| E4-11 | Email al cittadino: notifica approvazione/rifiuto | 2 | Must |
| E4-12 | Commenti sulle foto: form pubblico con moderazione | 4 | Must |
| E4-13 | Commenti "di censimento": flag speciale per identificazioni | 2 | Must |
| E4-14 | Admin: approvazione commenti prima della pubblicazione | 3 | Must |

---

## EPICA 5 — Handoff Grafico (Studio Esterno)

**Obiettivo**: Integrare la nuova identità visiva prodotta dallo studio grafico, senza toccare la logica business.

---

### Sprint 5.1 — Preparazione Handoff

**Durata**: 1 settimana | **Story Points totali**: ~8

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E5-01 | Documento di handoff: lista componenti, token, screenshot | 3 | Must |
| E5-02 | Storybook: documentare tutti i componenti visivi | 3 | Must |
| E5-03 | Aggiornare `design-tokens.ts` con nuovi valori da studio | 2 | Must |

---

### Sprint 5.2 — Implementazione Nuovo Design

**Durata**: 2 settimane | **Story Points totali**: ~22

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E5-04 | Sostituire palette e font in `design-tokens.ts` | 2 | Must |
| E5-05 | Aggiornare Header/Footer con nuovi asset | 3 | Must |
| E5-06 | Aggiornare Hero homepage con nuovi asset | 3 | Must |
| E5-07 | Aggiornare tutti i componenti card con nuovo design | 4 | Must |
| E5-08 | Aggiornare layout Archivio con nuovo design | 3 | Must |
| E5-09 | Aggiornare Mappa e Timeline con nuovi stili | 4 | Must |
| E5-10 | QA visivo completo su tutte le pagine | 3 | Must |

---

### Sprint 5.3 — Testing Design e Refactoring

**Durata**: 1 settimana | **Story Points totali**: ~8

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E5-11 | Test cross-browser (Chrome, Firefox, Safari, Edge) | 3 | Must |
| E5-12 | Test accessibilità WCAG 2.1 AA con axe-core | 3 | Must |
| E5-13 | Rimozione codice CSS/classe Tailwind non usato | 2 | Should |

---

## EPICA 6 — Go-Live

**Obiettivo**: Sito pronto per il pubblico. SEO, accessibilità, performance, deploy produzione.

---

### Sprint 6.1 — SEO e Accessibilità

**Durata**: 2 settimane | **Story Points totali**: ~18

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E6-01 | Sitemap XML automatica (next-sitemap) | 2 | Must |
| E6-02 | robots.txt configurato | 1 | Must |
| E6-03 | Schema.org completo per tutti i tipi di contenuto | 4 | Must |
| E6-04 | Audit accessibilità completo e fix | 4 | Must |
| E6-05 | Alt text obbligatorio in tutti i form admin | 2 | Must |
| E6-06 | Core Web Vitals: LCP < 2.5s, CLS < 0.1, FID < 100ms | 3 | Must |
| E6-07 | Privacy policy e cookie banner GDPR | 2 | Must |

---

### Sprint 6.2 — Testing Finale e Contenuti

**Durata**: 2 settimane | **Story Points totali**: ~16

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E6-08 | Popolare CMS con contenuti reali (foto, testimonianze) | 4 | Must |
| E6-09 | Test E2E con Playwright: flussi principali | 4 | Must |
| E6-10 | Test contributo cittadino end-to-end | 2 | Must |
| E6-11 | Load testing (minimo 100 utenti concorrenti) | 2 | Should |
| E6-12 | Backup automatico PostgreSQL configurato | 2 | Must |
| E6-13 | Monitoring uptime (UptimeRobot o simile) | 2 | Should |

---

### Sprint 6.3 — Deploy Produzione

**Durata**: 1 settimana | **Story Points totali**: ~10

#### Storie

| ID | Titolo | SP | Priorità |
|---|---|---|---|
| E6-14 | Configurare sottodominio DNS `comera.urgnanoturistica.it` | 2 | Must |
| E6-15 | Certificato SSL/TLS (Let's Encrypt) | 2 | Must |
| E6-16 | Deploy GitHub Actions → produzione verificato | 2 | Must |
| E6-17 | Smoke test su produzione: tutte le pagine ok | 2 | Must |
| E6-18 | Comunicato interno al Comune + formazione admin | 2 | Must |

---

## Riepilogo Timeline Stimata

| Epica | Sprint | Durata | Totale |
|---|---|---|---|
| Epica 1 | 1.1 + 1.2 | 4 sett. | 4 sett. |
| Epica 2 | 2.1 + 2.2 + 2.3 + 2.4 | 8 sett. | 12 sett. |
| Epica 3 | 3.1 + 3.2 + 3.3 | 6 sett. | 18 sett. |
| Epica 4 | 4.1 + 4.2 | 4 sett. | 22 sett. |
| Epica 5 | 5.1 + 5.2 + 5.3 | 5 sett. | 27 sett. |
| Epica 6 | 6.1 + 6.2 + 6.3 | 5 sett. | 32 sett. |

**Durata totale stimata: ~8 mesi** (con team di 1 sviluppatore full-stack)

> Nota: l'Epica 5 (Handoff Grafico) dipende dalla consegna dello studio grafico esterno — può sovrapporsi con Epica 6 per comprimere la timeline.

---

## Definition of Done (DoD)

Una storia si considera completata quando:
- [ ] Codice revisionato e approvato in PR
- [ ] Test automatici passano su CI
- [ ] Feature funzionante su staging
- [ ] **Verificato su mobile 375px** (iPhone SE) — primo test obbligatorio
- [ ] Verificato su 390px (iPhone 14) e 412px (Android medio)
- [ ] Verificato su desktop 1440px
- [ ] Touch target ≥ 44px per tutti gli elementi interattivi
- [ ] Nessun overflow orizzontale su mobile
- [ ] Nessun errore TypeScript (`strict: true`)
- [ ] Metadati OpenGraph presenti (per pagine pubbliche)
