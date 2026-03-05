'use client'

import dynamic from 'next/dynamic'
import type { LocationMarker } from './MapView'

function MapSkeleton() {
  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center bg-muted">
      <p className="text-sm text-muted-foreground">Caricamento mappa…</p>
    </div>
  )
}

const MapView = dynamic(
  () => import('./MapView').then(m => m.MapView),
  { ssr: false, loading: () => <MapSkeleton /> },
)

export function MapClient({ locations }: { locations: LocationMarker[] }) {
  return <MapView locations={locations} />
}
