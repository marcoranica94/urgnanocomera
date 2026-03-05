/**
 * Client Meilisearch condizionale.
 * Attivo solo se MEILISEARCH_HOST è definito — fallback a Payload altrimenti.
 */

interface MeilisearchHit {
  id: string | number
}

interface MeilisearchResult {
  hits: MeilisearchHit[]
}

export function isMeilisearchConfigured(): boolean {
  return !!process.env.MEILISEARCH_HOST
}

/**
 * Cerca foto in Meilisearch.
 * Restituisce array di ID o null se Meilisearch non è configurato.
 */
export async function searchPhotoIds(query: string): Promise<Array<string | number> | null> {
  if (!isMeilisearchConfigured() || !query.trim()) return null

  try {
    const res = await fetch(
      `${process.env.MEILISEARCH_HOST}/indexes/photos/search`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY ?? ''}`,
        },
        body: JSON.stringify({
          q: query,
          limit: 200,
          attributesToRetrieve: ['id'],
        }),
        next: { revalidate: 0 },
      },
    )

    if (!res.ok) return null
    const data: MeilisearchResult = await res.json()
    return data.hits.map(h => h.id)
  } catch {
    return null
  }
}

/**
 * Indicizza una foto in Meilisearch (chiamata dall'hook afterChange di Payload).
 */
export async function indexPhoto(doc: {
  id: string | number
  title: string
  description?: string | null
  year?: number | null
  decade?: string | null
  tags?: Array<{ tag: string }>
  status: string
}) {
  if (!isMeilisearchConfigured()) return

  const host = process.env.MEILISEARCH_HOST
  const apiKey = process.env.MEILISEARCH_API_KEY ?? ''

  if (doc.status !== 'published') {
    // Rimuovi dall'indice se non pubblicata
    await fetch(`${host}/indexes/photos/documents/${doc.id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${apiKey}` },
    }).catch(() => null)
    return
  }

  await fetch(`${host}/indexes/photos/documents`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify([{
      id: doc.id,
      title: doc.title,
      description: doc.description ?? '',
      year: doc.year ?? null,
      decade: doc.decade ?? '',
      tags: doc.tags?.map(t => t.tag) ?? [],
    }]),
  }).catch(() => null)
}

export async function deletePhotoFromIndex(id: string | number) {
  if (!isMeilisearchConfigured()) return
  await fetch(`${process.env.MEILISEARCH_HOST}/indexes/photos/documents/${id}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${process.env.MEILISEARCH_API_KEY ?? ''}` },
  }).catch(() => null)
}
