import Image from 'next/image'
import Link from 'next/link'

export interface PhotoCardProps {
  id: string | number
  title: string
  description?: string | null
  imageUrl: string
  imageAlt: string
  year?: number | null
  decade?: string | null
  locationName?: string | null
  tags?: string[]
  href?: string
}

export function PhotoCard({
  id,
  title,
  description,
  imageUrl,
  imageAlt,
  year,
  decade,
  locationName,
  tags,
  href,
}: PhotoCardProps) {
  const content = (
    <article className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-card text-card-foreground transition-shadow hover:shadow-md">
      {/* Immagine */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
        <Image
          src={imageUrl}
          alt={imageAlt}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover transition-transform duration-300 group-hover:scale-105"
        />

        {/* Badge decennio */}
        {decade && (
          <span className="absolute left-2 top-2 rounded-sm bg-background/80 px-2 py-0.5 text-xs font-medium text-foreground backdrop-blur-sm">
            {decade}
          </span>
        )}
      </div>

      {/* Contenuto */}
      <div className="flex flex-1 flex-col gap-1 p-3">
        <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-card-foreground">
          {title}
        </h3>

        {description && (
          <p className="line-clamp-2 text-xs text-muted-foreground">{description}</p>
        )}

        {/* Metadati */}
        <div className="mt-auto flex flex-wrap items-center gap-x-3 gap-y-1 pt-2 text-xs text-muted-foreground">
          {year && <span>{year}</span>}
          {locationName && (
            <span className="flex items-center gap-1">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
              >
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                <circle cx="12" cy="10" r="3" />
              </svg>
              {locationName}
            </span>
          )}
        </div>

        {/* Tag */}
        {tags && tags.length > 0 && (
          <div className="flex flex-wrap gap-1 pt-1">
            {tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="rounded-sm bg-secondary px-1.5 py-0.5 text-xs text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {tags.length > 3 && (
              <span className="text-xs text-muted-foreground">+{tags.length - 3}</span>
            )}
          </div>
        )}
      </div>
    </article>
  )

  if (href) {
    return (
      <Link href={href} className="block min-h-[44px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-lg">
        {content}
      </Link>
    )
  }

  return content
}
