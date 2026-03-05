import Link from 'next/link'

export type TestimonialType = 'video' | 'audio' | 'written'

export interface TestimonialCardProps {
  id: string | number
  title: string
  type: TestimonialType
  person?: string | null
  description?: string | null
  year?: number | null
  locationName?: string | null
  href?: string
}

const TYPE_LABELS: Record<TestimonialType, string> = {
  video: 'Video',
  audio: 'Audio',
  written: 'Scritto',
}

const TYPE_ICONS: Record<TestimonialType, React.ReactNode> = {
  video: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  ),
  audio: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
      <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
      <line x1="12" x2="12" y1="19" y2="23" />
      <line x1="8" x2="16" y1="23" y2="23" />
    </svg>
  ),
  written: (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" x2="8" y1="13" y2="13" />
      <line x1="16" x2="8" y1="17" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
  ),
}

export function TestimonialCard({
  id,
  title,
  type,
  person,
  description,
  year,
  locationName,
  href,
}: TestimonialCardProps) {
  const content = (
    <article className="group flex flex-col gap-3 rounded-lg border border-border bg-card p-4 text-card-foreground transition-shadow hover:shadow-md">
      {/* Header: badge tipo + anno */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-sm bg-secondary px-2 py-1 text-xs font-medium text-secondary-foreground">
          {TYPE_ICONS[type]}
          {TYPE_LABELS[type]}
        </span>
        {year && (
          <span className="text-xs text-muted-foreground">{year}</span>
        )}
      </div>

      {/* Titolo */}
      <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground group-hover:text-primary transition-colors">
        {title}
      </h3>

      {/* Descrizione */}
      {description && (
        <p className="line-clamp-3 text-xs text-muted-foreground">{description}</p>
      )}

      {/* Footer: persona e luogo */}
      <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 text-xs text-muted-foreground">
        {person && (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
            {person}
          </span>
        )}
        {locationName && (
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="10" height="10" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
            {locationName}
          </span>
        )}
      </div>
    </article>
  )

  if (href) {
    return (
      <Link
        href={href}
        className="block min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg"
      >
        {content}
      </Link>
    )
  }

  return content
}
