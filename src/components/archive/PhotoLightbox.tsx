'use client'

import Image from 'next/image'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'

interface CommentDoc {
  id: string | number
  author: string
  content: string
  isTagging: boolean
  createdAt: string
}

interface PhotoDetail {
  id: string | number
  title: string
  description?: string | null
  year?: number | null
  decade?: string | null
  locationName?: string | null
  imageUrl: string
  imageAlt: string
  tags?: string[]
  comments: CommentDoc[]
}

export function PhotoLightbox() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const fotoId = searchParams.get('foto')

  const [photo, setPhoto] = useState<PhotoDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [author, setAuthor] = useState('')
  const [content, setContent] = useState('')
  const [isTagging, setIsTagging] = useState(false)
  const [submitState, setSubmitState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')

  const close = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('foto')
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname)
  }, [router, pathname, searchParams])

  // Fetch photo detail
  useEffect(() => {
    if (!fotoId) {
      setPhoto(null)
      return
    }
    setLoading(true)
    fetch(`/api/photos/${fotoId}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        setPhoto(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [fotoId])

  // Chiudi con ESC
  useEffect(() => {
    if (!fotoId) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') close() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [fotoId, close])

  // Blocca scroll body
  useEffect(() => {
    if (fotoId) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [fotoId])

  if (!fotoId) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!author.trim() || !content.trim()) return
    setSubmitState('sending')
    try {
      const res = await fetch('/api/comments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ photoId: fotoId, author, content, isTagging }),
      })
      if (res.ok) {
        setSubmitState('sent')
        setAuthor('')
        setContent('')
        setIsTagging(false)
      } else {
        setSubmitState('error')
      }
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Visualizzazione foto"
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
      onClick={e => { if (e.target === e.currentTarget) close() }}
    >
      <div className="relative flex max-h-[95vh] w-full max-w-5xl flex-col overflow-hidden rounded-lg bg-background shadow-2xl lg:flex-row">

        {/* Chiudi */}
        <button
          onClick={close}
          aria-label="Chiudi"
          className="absolute right-3 top-3 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-background/80 text-foreground backdrop-blur-sm hover:bg-muted"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24"
            fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        </button>

        {loading && (
          <div className="flex flex-1 items-center justify-center p-12">
            <span className="text-muted-foreground text-sm">Caricamento…</span>
          </div>
        )}

        {!loading && photo && (
          <>
            {/* Immagine */}
            <div className="relative min-h-[280px] flex-1 bg-black">
              <Image
                src={photo.imageUrl}
                alt={photo.imageAlt}
                fill
                className="object-contain"
                sizes="(max-width: 1024px) 100vw, 60vw"
                priority
              />
            </div>

            {/* Sidebar metadati + commenti */}
            <div className="flex w-full flex-col overflow-y-auto lg:w-80 lg:flex-shrink-0">
              {/* Metadati */}
              <div className="border-b border-border p-5">
                <h2 className="font-serif text-lg font-bold text-foreground">{photo.title}</h2>
                {photo.description && (
                  <p className="mt-2 text-sm text-muted-foreground">{photo.description}</p>
                )}
                <dl className="mt-3 space-y-1 text-xs text-muted-foreground">
                  {photo.year && <div><dt className="inline font-medium">Anno: </dt><dd className="inline">{photo.year}</dd></div>}
                  {photo.decade && <div><dt className="inline font-medium">Decennio: </dt><dd className="inline">{photo.decade}</dd></div>}
                  {photo.locationName && <div><dt className="inline font-medium">Luogo: </dt><dd className="inline">{photo.locationName}</dd></div>}
                </dl>
                {photo.tags && photo.tags.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1">
                    {photo.tags.map(tag => (
                      <span key={tag} className="rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground">
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Commenti esistenti */}
              <div className="flex-1 overflow-y-auto p-5">
                <h3 className="text-sm font-semibold text-foreground">
                  Commenti{photo.comments.length > 0 ? ` (${photo.comments.length})` : ''}
                </h3>

                {photo.comments.length === 0 && (
                  <p className="mt-3 text-xs text-muted-foreground">Nessun commento ancora. Sai qualcosa su questa foto?</p>
                )}

                <ul className="mt-3 space-y-3">
                  {photo.comments.map(c => (
                    <li key={c.id} className={`rounded-md p-3 text-xs ${c.isTagging ? 'bg-accent/10 border border-accent/30' : 'bg-muted'}`}>
                      {c.isTagging && (
                        <span className="mb-1 block text-[10px] font-medium uppercase tracking-wide text-accent">
                          Identificazione
                        </span>
                      )}
                      <p className="font-medium text-foreground">{c.author}</p>
                      <p className="mt-1 text-muted-foreground">{c.content}</p>
                    </li>
                  ))}
                </ul>

                {/* Form nuovo commento */}
                <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                  <h4 className="text-xs font-semibold text-foreground">Aggiungi un commento</h4>

                  <input
                    type="text"
                    placeholder="Il tuo nome"
                    value={author}
                    onChange={e => setAuthor(e.target.value)}
                    required
                    maxLength={100}
                    className="h-10 w-full rounded-md border border-input bg-background px-3 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <textarea
                    placeholder="Scrivi qui…"
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    required
                    maxLength={2000}
                    rows={3}
                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                  />
                  <label className="flex items-center gap-2 text-xs text-muted-foreground">
                    <input
                      type="checkbox"
                      checked={isTagging}
                      onChange={e => setIsTagging(e.target.checked)}
                      className="h-4 w-4 rounded"
                    />
                    Identifico persone o luoghi in questa foto
                  </label>

                  {submitState === 'sent' && (
                    <p className="text-xs text-green-600 dark:text-green-400">
                      Commento inviato — verrà pubblicato dopo moderazione.
                    </p>
                  )}
                  {submitState === 'error' && (
                    <p className="text-xs text-red-600 dark:text-red-400">Errore nell&apos;invio, riprova.</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitState === 'sending' || submitState === 'sent'}
                    className="flex min-h-[44px] w-full items-center justify-center rounded-md bg-primary px-4 py-2 text-xs font-medium text-primary-foreground transition-colors hover:opacity-90 disabled:opacity-50"
                  >
                    {submitState === 'sending' ? 'Invio…' : 'Invia commento'}
                  </button>
                </form>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
