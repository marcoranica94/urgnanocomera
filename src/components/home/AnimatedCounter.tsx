'use client'

import { useEffect, useRef, useState } from 'react'

function easeOut(t: number): number {
  return 1 - Math.pow(1 - t, 3)
}

function animateTo(target: number, duration: number, onUpdate: (v: number) => void) {
  if (target === 0) return
  const start = Date.now()
  const tick = () => {
    const progress = Math.min((Date.now() - start) / duration, 1)
    onUpdate(Math.round(easeOut(progress) * target))
    if (progress < 1) requestAnimationFrame(tick)
  }
  requestAnimationFrame(tick)
}

interface AnimatedCounterProps {
  photoCount: number
  testimonialCount: number
  locationCount: number
}

export function AnimatedCounter({ photoCount, testimonialCount, locationCount }: AnimatedCounterProps) {
  const [photos, setPhotos] = useState(0)
  const [testimonials, setTestimonials] = useState(0)
  const [locations, setLocations] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const started = useRef(false)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true
          animateTo(photoCount, 1500, setPhotos)
          animateTo(testimonialCount, 1500, setTestimonials)
          animateTo(locationCount, 1500, setLocations)
        }
      },
      { threshold: 0.5 },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [photoCount, testimonialCount, locationCount])

  const stats = [
    { value: photos, label: 'Fotografie' },
    { value: testimonials, label: 'Testimonianze' },
    { value: locations, label: 'Luoghi mappati' },
  ]

  return (
    <section className="border-y border-border bg-secondary/30 py-12">
      <div ref={containerRef} className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map(({ value, label }) => (
            <div key={label}>
              <p className="font-serif text-4xl font-bold text-foreground sm:text-5xl">
                {value.toLocaleString('it-IT')}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
