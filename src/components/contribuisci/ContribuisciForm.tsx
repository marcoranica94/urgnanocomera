'use client'

import { useRef, useState, useCallback, type DragEvent, type ChangeEvent } from 'react'
import Link from 'next/link'

// ─── Tipi ────────────────────────────────────────────────────────────────────

type ContributionType = 'photo' | 'video' | 'audio' | 'story'

interface Location {
  id: string | number
  name: string
}

interface Props {
  locations: Location[]
}

// ─── Costanti ─────────────────────────────────────────────────────────────────

const TYPE_OPTIONS: { value: ContributionType; label: string; description: string; icon: React.ReactNode }[] = [
  {
    value: 'photo',
    label: 'Fotografia',
    description: 'Un\'immagine storica di Urgnano, persone, luoghi o eventi',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" />
        <circle cx="12" cy="13" r="3" />
      </svg>
    ),
  },
  {
    value: 'video',
    label: 'Video',
    description: 'Un video o filmato che documenta la vita di Urgnano',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="m22 8-6 4 6 4V8z" />
        <rect width="14" height="12" x="2" y="6" rx="2" ry="2" />
      </svg>
    ),
  },
  {
    value: 'audio',
    label: 'Audio',
    description: 'Una registrazione audio: intervista, canto, racconto orale',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" x2="12" y1="19" y2="22" />
      </svg>
    ),
  },
  {
    value: 'story',
    label: 'Racconto scritto',
    description: 'Un ricordo, una storia familiare, un aneddoto sulla vita di un tempo',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24"
        fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" x2="16" y1="9" y2="9" />
        <line x1="8" x2="14" y1="13" y2="13" />
      </svg>
    ),
  },
]

const ACCEPT: Record<ContributionType, string> = {
  photo: 'image/jpeg,image/png,image/webp,image/tiff',
  video: 'video/mp4,video/quicktime,video/x-msvideo,video/webm',
  audio: 'audio/mpeg,audio/wav,audio/ogg,audio/m4a,audio/x-m4a',
  story: '',
}

const MAX_SIZE_MB = 50

// ─── Input base riutilizzabile ────────────────────────────────────────────────

function Field({ label, required, error, children }: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-foreground">
        {label}{required && <span className="ml-0.5 text-red-500" aria-hidden>*</span>}
      </label>
      {children}
      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

const inputClass =
  'h-11 w-full rounded-md border border-input bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

const textareaClass =
  'w-full rounded-md border border-input bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring'

// ─── Indicatore step ──────────────────────────────────────────────────────────

function StepIndicator({ current, total }: { current: number; total: number }) {
  return (
    <div className="flex items-center gap-2" role="progressbar" aria-valuenow={current} aria-valuemax={total}>
      {Array.from({ length: total }, (_, i) => i + 1).map(n => (
        <div key={n} className="flex items-center gap-2">
          <div
            className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold transition-colors ${
              n < current
                ? 'bg-primary text-primary-foreground'
                : n === current
                ? 'bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2 ring-offset-background'
                : 'bg-muted text-muted-foreground'
            }`}
          >
            {n < current ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
                fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
                <polyline points="20 6 9 17 4 12" />
              </svg>
            ) : n}
          </div>
          {n < total && <div className={`h-px w-8 sm:w-12 ${n < current ? 'bg-primary' : 'bg-border'}`} />}
        </div>
      ))}
    </div>
  )
}

// ─── Drop zone ────────────────────────────────────────────────────────────────

function DropZone({
  type,
  file,
  onFile,
  error,
}: {
  type: ContributionType
  file: File | null
  onFile: (f: File | null) => void
  error?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [dragging, setDragging] = useState(false)

  const handleDrop = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDragging(false)
    const f = e.dataTransfer.files[0]
    if (f) validate(f)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null
    if (f) validate(f)
  }

  function validate(f: File) {
    if (f.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`Il file supera il limite di ${MAX_SIZE_MB} MB.`)
      return
    }
    onFile(f)
  }

  const preview = file && type === 'photo' ? URL.createObjectURL(file) : null

  return (
    <div className="flex flex-col gap-3">
      <div
        onDragOver={e => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') inputRef.current?.click() }}
        aria-label="Zona di caricamento file"
        className={`relative flex min-h-[160px] cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed p-6 text-center transition-colors ${
          dragging
            ? 'border-primary bg-primary/5'
            : file
            ? 'border-primary/40 bg-primary/5'
            : 'border-border hover:border-primary/40 hover:bg-muted/50'
        }`}
      >
        {preview ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={preview} alt="Anteprima" className="max-h-32 max-w-full rounded object-contain" />
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="1.5" className="text-muted-foreground" aria-hidden>
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="17 8 12 3 7 8" />
            <line x1="12" x2="12" y1="3" y2="15" />
          </svg>
        )}

        {file ? (
          <div className="text-sm">
            <p className="font-medium text-foreground">{file.name}</p>
            <p className="text-xs text-muted-foreground">{(file.size / 1024 / 1024).toFixed(1)} MB</p>
          </div>
        ) : (
          <div className="text-sm text-muted-foreground">
            <p>Trascina qui il file oppure <span className="text-primary underline">scegli dal dispositivo</span></p>
            <p className="mt-1 text-xs">Max {MAX_SIZE_MB} MB</p>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        type="file"
        accept={ACCEPT[type]}
        onChange={handleChange}
        className="sr-only"
        aria-hidden
        tabIndex={-1}
      />

      {file && (
        <button
          type="button"
          onClick={() => { onFile(null); if (inputRef.current) inputRef.current.value = '' }}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Rimuovi file
        </button>
      )}

      {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
    </div>
  )
}

// ─── Componente principale ─────────────────────────────────────────────────────

export function ContribuisciForm({ locations }: Props) {
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)

  // Step 1
  const [type, setType] = useState<ContributionType | null>(null)

  // Step 2
  const [file, setFile] = useState<File | null>(null)
  const [storyText, setStoryText] = useState('')

  // Step 3
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedYear, setEstimatedYear] = useState('')
  const [locationId, setLocationId] = useState('')

  // Step 4
  const [submitterName, setSubmitterName] = useState('')
  const [submitterEmail, setSubmitterEmail] = useState('')
  const [gdprConsent, setGdprConsent] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)

  // ── Validazioni step ───────────────────────────────────────────────────
  const [errors, setErrors] = useState<Record<string, string>>({})

  function validateStep(n: number): boolean {
    const e: Record<string, string> = {}
    if (n === 1) {
      if (!type) e.type = 'Seleziona un tipo di contributo.'
    }
    if (n === 2) {
      if (type !== 'story' && !file) e.file = 'Carica un file per continuare.'
      if (type === 'story' && storyText.trim().length < 50)
        e.storyText = 'Il racconto deve essere di almeno 50 caratteri.'
    }
    if (n === 3) {
      if (title.trim().length < 2) e.title = 'Inserisci un titolo (min 2 caratteri).'
      if (description.trim().length < 10) e.description = 'Inserisci una descrizione (min 10 caratteri).'
      if (estimatedYear) {
        const y = parseInt(estimatedYear, 10)
        if (isNaN(y) || y < 1800 || y > 2000) e.estimatedYear = 'Anno non valido (tra 1800 e 2000).'
      }
    }
    if (n === 4) {
      if (submitterName.trim().length < 2) e.submitterName = 'Inserisci il tuo nome (min 2 caratteri).'
      if (!/^\S+@\S+\.\S+$/.test(submitterEmail)) e.submitterEmail = 'Inserisci un indirizzo email valido.'
      if (!gdprConsent) e.gdprConsent = 'È necessario accettare il consenso GDPR.'
    }
    setErrors(e)
    return Object.keys(e).length === 0
  }

  function next() {
    if (validateStep(step)) setStep(s => s + 1)
  }

  function back() {
    setErrors({})
    setStep(s => s - 1)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateStep(4) || !type) return

    setSubmitting(true)
    setSubmitError(null)

    const fd = new FormData()
    fd.append('type', type)
    fd.append('title', title.trim())
    fd.append('description', description.trim())
    if (estimatedYear) fd.append('estimatedYear', estimatedYear)
    if (locationId) fd.append('locationId', locationId)
    if (storyText.trim()) fd.append('storyText', storyText.trim())
    if (file) fd.append('file', file)
    fd.append('submitterName', submitterName.trim())
    fd.append('submitterEmail', submitterEmail.trim())
    fd.append('gdprConsent', 'true')

    try {
      const res = await fetch('/api/contribuisci', { method: 'POST', body: fd })
      if (res.ok) {
        setSubmitted(true)
      } else {
        const body = await res.json().catch(() => null)
        setSubmitError(body?.error ?? 'Errore nell\'invio. Riprova tra qualche istante.')
      }
    } catch {
      setSubmitError('Errore di rete. Controlla la connessione e riprova.')
    } finally {
      setSubmitting(false)
    }
  }

  // ── Schermata di successo ──────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="flex flex-col items-center py-16 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" className="text-primary" aria-hidden>
            <polyline points="20 6 9 17 4 12" />
          </svg>
        </div>
        <h2 className="mt-5 font-serif text-2xl font-bold text-foreground">Grazie!</h2>
        <p className="mt-3 max-w-md text-sm text-muted-foreground">
          Il tuo contributo è stato ricevuto e verrà esaminato dal nostro team.
          Riceverai un&apos;email di conferma e ti aggiorneremo quando verrà pubblicato.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <a href="/contribuisci" className="flex min-h-[44px] items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity">
            Invia un altro contributo
          </a>
          <a href="/archivio" className="flex min-h-[44px] items-center justify-center rounded-md border border-border px-6 text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Vai all&apos;archivio
          </a>
        </div>
      </div>
    )
  }

  const TOTAL_STEPS = 4

  const stepLabels = ['Tipo', 'Contenuto', 'Dettagli', 'Invio']

  return (
    <div className="mx-auto max-w-xl">
      {/* Indicatore step */}
      <div className="mb-8 flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
        <StepIndicator current={step} total={TOTAL_STEPS} />
        <span className="text-xs text-muted-foreground">
          Passo {step} di {TOTAL_STEPS} — {stepLabels[step - 1]}
        </span>
      </div>

      <form onSubmit={handleSubmit} noValidate>

        {/* ── Step 1: Tipo ──────────────────────────────────────────────── */}
        {step === 1 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Cosa vuoi condividere?</h2>
              <p className="mt-1 text-sm text-muted-foreground">Scegli il tipo di contributo che intendi inviare.</p>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {TYPE_OPTIONS.map(opt => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => { setType(opt.value); setErrors({}) }}
                  className={`flex flex-col items-start gap-3 rounded-xl border-2 p-5 text-left transition-all min-h-[44px] ${
                    type === opt.value
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/40 hover:bg-muted/50'
                  }`}
                >
                  <span className={type === opt.value ? 'text-primary' : 'text-muted-foreground'}>
                    {opt.icon}
                  </span>
                  <div>
                    <p className="font-medium text-foreground">{opt.label}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground">{opt.description}</p>
                  </div>
                </button>
              ))}
            </div>
            {errors.type && <p className="text-xs text-red-600 dark:text-red-400">{errors.type}</p>}
          </div>
        )}

        {/* ── Step 2: File / Testo ─────────────────────────────────────── */}
        {step === 2 && type && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">
                {type === 'story' ? 'Scrivi il tuo racconto' : 'Carica il file'}
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {type === 'story'
                  ? 'Descrivi il tuo ricordo, la storia familiare o l\'aneddoto che vuoi condividere.'
                  : `Carica il file che vuoi contribuire all'archivio. Formati accettati: ${
                      type === 'photo' ? 'JPG, PNG, WEBP, TIFF'
                      : type === 'video' ? 'MP4, MOV, AVI, WEBM'
                      : 'MP3, WAV, OGG, M4A'
                    }.`
                }
              </p>
            </div>

            {type === 'story' ? (
              <Field label="Racconto" required error={errors.storyText}>
                <textarea
                  value={storyText}
                  onChange={e => setStoryText(e.target.value)}
                  placeholder="Scrivi qui il tuo racconto…"
                  rows={10}
                  maxLength={20000}
                  className={textareaClass}
                />
                <p className="text-right text-xs text-muted-foreground">{storyText.length} / 20000</p>
              </Field>
            ) : (
              <DropZone type={type} file={file} onFile={setFile} error={errors.file} />
            )}
          </div>
        )}

        {/* ── Step 3: Metadati ─────────────────────────────────────────── */}
        {step === 3 && (
          <div className="space-y-4">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">Racconta di più</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Questi dettagli aiutano a catalogare il contributo nell&apos;archivio storico.
              </p>
            </div>

            <Field label="Titolo" required error={errors.title}>
              <input
                type="text"
                value={title}
                onChange={e => setTitle(e.target.value)}
                placeholder="Un titolo breve e descrittivo"
                maxLength={200}
                className={inputClass}
              />
            </Field>

            <Field label="Descrizione" required error={errors.description}>
              <textarea
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Cosa raffigura? Quando è stato scattato/registrato? Cosa ricordi di quel periodo?"
                rows={4}
                maxLength={2000}
                className={textareaClass}
              />
            </Field>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Anno stimato" error={errors.estimatedYear}>
                <input
                  type="number"
                  value={estimatedYear}
                  onChange={e => setEstimatedYear(e.target.value)}
                  placeholder="es. 1965"
                  min={1800}
                  max={2000}
                  className={inputClass}
                />
              </Field>

              <Field label="Luogo (se noto)">
                <select
                  value={locationId}
                  onChange={e => setLocationId(e.target.value)}
                  className={inputClass}
                >
                  <option value="">Seleziona un luogo…</option>
                  {locations.map(l => (
                    <option key={l.id} value={String(l.id)}>{l.name}</option>
                  ))}
                </select>
              </Field>
            </div>
          </div>
        )}

        {/* ── Step 4: Mittente + GDPR ───────────────────────────────────── */}
        {step === 4 && (
          <div className="space-y-5">
            <div>
              <h2 className="font-serif text-xl font-bold text-foreground">I tuoi dati</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Ci serviranno per aggiornarti sull&apos;esito del tuo contributo.
                Non saranno mai visibili pubblicamente.
              </p>
            </div>

            <Field label="Nome e cognome" required error={errors.submitterName}>
              <input
                type="text"
                value={submitterName}
                onChange={e => setSubmitterName(e.target.value)}
                placeholder="Mario Rossi"
                maxLength={150}
                autoComplete="name"
                className={inputClass}
              />
            </Field>

            <Field label="Indirizzo email" required error={errors.submitterEmail}>
              <input
                type="email"
                value={submitterEmail}
                onChange={e => setSubmitterEmail(e.target.value)}
                placeholder="mario.rossi@esempio.it"
                autoComplete="email"
                className={inputClass}
              />
            </Field>

            {/* Consenso GDPR */}
            <div className={`rounded-lg border p-4 ${errors.gdprConsent ? 'border-red-400' : 'border-border'}`}>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={gdprConsent}
                  onChange={e => setGdprConsent(e.target.checked)}
                  className="mt-0.5 h-5 w-5 flex-shrink-0 rounded border-border"
                />
                <span className="text-sm text-foreground">
                  Acconsento al trattamento dei miei dati personali e del materiale fornito secondo la{' '}
                  <Link href="/privacy" className="text-primary underline" target="_blank">
                    privacy policy
                  </Link>{' '}
                  del Comune di Urgnano. Il materiale inviato potrà essere pubblicato sull&apos;archivio digitale UrgnanoComEra con il mio nome.
                </span>
              </label>
              {errors.gdprConsent && (
                <p className="mt-2 text-xs text-red-600 dark:text-red-400">{errors.gdprConsent}</p>
              )}
            </div>

            {submitError && (
              <div className="rounded-md bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
                {submitError}
              </div>
            )}
          </div>
        )}

        {/* ── Navigazione step ─────────────────────────────────────────── */}
        <div className="mt-8 flex items-center justify-between gap-4">
          {step > 1 ? (
            <button
              type="button"
              onClick={back}
              disabled={submitting}
              className="flex min-h-[44px] items-center gap-2 rounded-md border border-border px-5 text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-50"
            >
              ← Indietro
            </button>
          ) : (
            <div />
          )}

          {step < TOTAL_STEPS ? (
            <button
              type="button"
              onClick={next}
              className="flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity"
            >
              Avanti →
            </button>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="flex min-h-[44px] items-center gap-2 rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground hover:opacity-90 transition-opacity disabled:opacity-50"
            >
              {submitting ? 'Invio in corso…' : 'Invia il contributo'}
            </button>
          )}
        </div>
      </form>
    </div>
  )
}
