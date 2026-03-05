'use client'

import 'leaflet/dist/leaflet.css'
import { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet'
import MarkerClusterGroup from 'react-leaflet-cluster'
import L from 'leaflet'
import Image from 'next/image'
import Link from 'next/link'

export interface LocationMarker {
  id: string | number
  name: string
  slug: string
  category?: string | null
  lat: number
  lng: number
  coverImageUrl?: string | null
  photoCount: number
  testimonialCount: number
}

type LayerFilter = 'all' | 'foto' | 'testimonianze'

interface MapViewProps {
  locations: LocationMarker[]
}

// Fix icone Leaflet in Next.js (i PNG di default non vengono trovati)
function createMarkerIcon(active = false) {
  return L.divIcon({
    className: '',
    html: `<div style="
      width:18px;height:18px;border-radius:50%;
      background:${active ? 'hsl(35 55% 65%)' : 'hsl(220 60% 40%)'};
      border:2.5px solid white;
      box-shadow:0 1px 4px rgba(0,0,0,.35);
      transition:background .2s;
    "></div>`,
    iconSize: [18, 18],
    iconAnchor: [9, 9],
    popupAnchor: [0, -14],
  })
}

// Sub-componente che pan/zoom quando si seleziona dalla sidebar
function MapController({ center }: { center: [number, number] | null }) {
  const map = useMap()
  useEffect(() => {
    if (center) map.flyTo(center, 17, { duration: 0.8 })
  }, [map, center])
  return null
}

export function MapView({ locations }: MapViewProps) {
  const [layer, setLayer] = useState<LayerFilter>('all')
  const [selected, setSelected] = useState<string | number | null>(null)
  const [flyTo, setFlyTo] = useState<[number, number] | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filtered = locations.filter(loc => {
    if (layer === 'foto' && loc.photoCount === 0) return false
    if (layer === 'testimonianze' && loc.testimonialCount === 0) return false
    return true
  })

  const sidebarItems = locations.filter(loc =>
    loc.name.toLowerCase().includes(search.toLowerCase())
  )

  const handleSidebarClick = (loc: LocationMarker) => {
    setSelected(loc.id)
    setFlyTo([loc.lat, loc.lng])
    setSidebarOpen(false)
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">

      {/* ── Sidebar ──────────────────────────────────────────────────────────── */}
      <aside className={`
        flex flex-col border-b border-border bg-background lg:w-72 lg:flex-shrink-0 lg:border-b-0 lg:border-r
        ${sidebarOpen ? 'h-64' : 'h-auto'} lg:h-full
      `}>
        {/* Header sidebar */}
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-sm font-semibold text-foreground">
            {locations.length} luoghi
          </span>
          {/* Toggle mobile */}
          <button
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-md hover:bg-muted lg:hidden"
            onClick={() => setSidebarOpen(o => !o)}
            aria-label={sidebarOpen ? 'Chiudi lista' : 'Apri lista luoghi'}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24"
              fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              {sidebarOpen
                ? <path d="M18 6 6 18M6 6l12 12" />
                : <><line x1="3" x2="21" y1="6" y2="6" /><line x1="3" x2="21" y1="12" y2="12" /><line x1="3" x2="21" y1="18" y2="18" /></>
              }
            </svg>
          </button>
        </div>

        {/* Ricerca + lista — solo quando aperta su mobile, sempre su desktop */}
        <div className={`flex flex-1 flex-col overflow-hidden ${sidebarOpen || 'hidden lg:flex'}`}>
          <div className="px-3 py-2">
            <input
              type="search"
              placeholder="Cerca luogo…"
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="h-9 w-full rounded-md border border-input bg-background px-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <ul className="flex-1 overflow-y-auto">
            {sidebarItems.map(loc => (
              <li key={loc.id}>
                <button
                  onClick={() => handleSidebarClick(loc)}
                  className={`
                    flex min-h-[44px] w-full items-start gap-3 px-4 py-3 text-left text-sm transition-colors hover:bg-muted
                    ${selected === loc.id ? 'bg-primary/10 font-medium text-primary' : 'text-foreground'}
                  `}
                >
                  <span className="mt-0.5 flex-1 leading-snug">{loc.name}</span>
                  <span className="flex-shrink-0 text-xs text-muted-foreground">
                    {loc.photoCount > 0 && `📷 ${loc.photoCount}`}
                    {loc.photoCount > 0 && loc.testimonialCount > 0 && ' '}
                    {loc.testimonialCount > 0 && `🎙 ${loc.testimonialCount}`}
                  </span>
                </button>
              </li>
            ))}
            {sidebarItems.length === 0 && (
              <li className="px-4 py-6 text-center text-xs text-muted-foreground">
                Nessun luogo trovato
              </li>
            )}
          </ul>
        </div>
      </aside>

      {/* ── Mappa ─────────────────────────────────────────────────────────────── */}
      <div className="relative flex-1">
        {/* Layer toggle */}
        <div className="absolute left-3 top-3 z-[400] flex gap-1 rounded-lg border border-border bg-background/95 p-1 shadow-sm backdrop-blur-sm">
          {(['all', 'foto', 'testimonianze'] as LayerFilter[]).map(l => (
            <button
              key={l}
              onClick={() => setLayer(l)}
              className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors min-h-[36px] ${
                layer === l
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-muted'
              }`}
            >
              {l === 'all' ? 'Tutti' : l === 'foto' ? 'Foto' : 'Testimonianze'}
            </button>
          ))}
        </div>

        <MapContainer
          center={[45.5962, 9.6858]}
          zoom={14}
          className="h-full w-full"
          scrollWheelZoom
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          <MapController center={flyTo} />

          <MarkerClusterGroup chunkedLoading>
            {filtered.map(loc => (
              <Marker
                key={loc.id}
                position={[loc.lat, loc.lng]}
                icon={createMarkerIcon(selected === loc.id)}
                eventHandlers={{ click: () => setSelected(loc.id) }}
              >
                <Popup maxWidth={240}>
                  <div className="min-w-[200px]">
                    {loc.coverImageUrl && (
                      <div className="relative mb-2 h-28 w-full overflow-hidden rounded">
                        <Image
                          src={loc.coverImageUrl}
                          alt={loc.name}
                          fill
                          className="object-cover"
                          sizes="240px"
                        />
                      </div>
                    )}
                    <p className="font-semibold text-foreground">{loc.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {[
                        loc.photoCount > 0 && `${loc.photoCount} foto`,
                        loc.testimonialCount > 0 && `${loc.testimonialCount} testimonianze`,
                      ].filter(Boolean).join(' · ')}
                    </p>
                    <Link
                      href={`/mappa/${loc.slug}`}
                      className="mt-2 inline-block text-xs font-medium text-primary hover:underline"
                    >
                      Vedi tutti i contenuti →
                    </Link>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        </MapContainer>
      </div>
    </div>
  )
}
