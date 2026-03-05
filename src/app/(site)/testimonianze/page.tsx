import type { Metadata } from 'next'
import { Suspense } from 'react'
import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@payload-config'
import { TestimonialCard } from '@/components/testimonial/TestimonialCard'
import { TestimonialFilters } from '@/components/testimonial/TestimonialFilters'

export const metadata: Metadata = {
  title: 'Testimonianze vive',
  description: 'Video, audio e racconti scritti di chi ha vissuto la storia di Urgnano.',
  openGraph: { title: 'Testimonianze vive — UrgnanoComEra' },
}

const PER_PAGE = 12

interface PageProps {
  searchParams: Promise<{
    tipo?: string
    luogo?: string
    periodo?: string
    pagina?: string
  }>
}

interface LocationDoc { id: string | number; name: string; slug: string }
interface TestimonialDoc {
  id: string | number
  title: string
  type: 'video' | 'audio' | 'written'
  person?: string | null
  description?: string | null
  year?: number | null
  location?: LocationDoc | string | number | null
}

function locationName(l: LocationDoc | string | number | null | undefined): string | null {
  if (!l || typeof l !== 'object') return null
  return (l as LocationDoc).name ?? null
}

// Mappa periodo → range anni
function periodoToYearRange(periodo: string): { gte?: number; lte?: number } | null {
  if (periodo === 'pre1940') return { lte: 1939 }
  const y = parseInt(periodo, 10)
  if (!isNaN(y)) return { gte: y, lte: y + 9 }
  return null
}

export default async function TestimonianzePage({ searchParams }: PageProps) {
  const params = await searchParams
  const tipo = params.tipo ?? ''
  const luogo = params.luogo ?? ''
  const periodo = params.periodo ?? ''
  const pagina = Math.max(1, parseInt(params.pagina ?? '1', 10))

  const payload = await getPayload({ config })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const locationsResult = await payload.find({ collection: 'locations', limit: 100, sort: 'name' }) as any
  const locations = (locationsResult.docs as LocationDoc[])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const where: Record<string, any> = { status: { equals: 'published' } }

  if (tipo) where.type = { equals: tipo }

  if (luogo) {
    const loc = locations.find((l: LocationDoc) => l.slug === luogo)
    if (loc) where.location = { equals: loc.id }
  }

  if (periodo) {
    const range = periodoToYearRange(periodo)
    if (range) {
      if (range.gte !== undefined) where.year = { greater_than_equal: range.gte }
      if (range.lte !== undefined) where.year = { ...where.year, less_than_equal: range.lte }
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result = await payload.find({
    collection: 'testimonials',
    where,
    limit: PER_PAGE,
    page: pagina,
    sort: '-createdAt',
    depth: 1,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  const testimonials = result.docs as TestimonialDoc[]
  const totalDocs: number = result.totalDocs
  const totalPages: number = result.totalPages

  const buildPageUrl = (p: number) => {
    const sp = new URLSearchParams()
    if (tipo) sp.set('tipo', tipo)
    if (luogo) sp.set('luogo', luogo)
    if (periodo) sp.set('periodo', periodo)
    if (p > 1) sp.set('pagina', String(p))
    const qs = sp.toString()
    return `/testimonianze${qs ? `?${qs}` : ''}`
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="font-serif text-3xl font-bold text-foreground sm:text-4xl">
          Testimonianze vive
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Voci, immagini e racconti di chi ha vissuto la storia di Urgnano
        </p>
      </div>

      <div className="mb-8">
        <Suspense>
          <TestimonialFilters
            locations={locations.map((l: LocationDoc) => ({ id: l.id, name: l.name, slug: l.slug }))}
            totalDocs={totalDocs}
          />
        </Suspense>
      </div>

      {testimonials.length === 0 ? (
        <div className="flex flex-col items-center py-24 text-center">
          <p className="text-muted-foreground">Nessuna testimonianza trovata.</p>
          {(tipo || luogo || periodo) && (
            <Link href="/testimonianze" className="mt-4 text-sm text-primary hover:underline">
              Azzera i filtri
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {testimonials.map(t => (
            <TestimonialCard
              key={t.id}
              id={t.id}
              title={t.title}
              type={t.type}
              person={t.person}
              description={t.description}
              year={t.year}
              locationName={locationName(t.location)}
              href={`/testimonianze/${t.id}`}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <nav aria-label="Paginazione" className="mt-12 flex items-center justify-center gap-2">
          {pagina > 1 && (
            <Link href={buildPageUrl(pagina - 1)}
              className="flex min-h-[44px] items-center rounded-md border border-border px-4 text-sm hover:bg-muted">
              ← Precedente
            </Link>
          )}
          <span className="px-4 text-sm text-muted-foreground">
            Pagina {pagina} di {totalPages}
          </span>
          {pagina < totalPages && (
            <Link href={buildPageUrl(pagina + 1)}
              className="flex min-h-[44px] items-center rounded-md border border-border px-4 text-sm hover:bg-muted">
              Successiva →
            </Link>
          )}
        </nav>
      )}
    </div>
  )
}
