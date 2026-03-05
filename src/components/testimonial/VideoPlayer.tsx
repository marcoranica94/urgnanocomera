'use client'

import { useRef, useState } from 'react'

interface VideoPlayerProps {
  src: string
  title: string
  posterUrl?: string | null
}

export function VideoPlayer({ src, title, posterUrl }: VideoPlayerProps) {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [error, setError] = useState(false)

  if (error) {
    return (
      <div className="flex aspect-video w-full items-center justify-center rounded-lg bg-muted text-sm text-muted-foreground">
        Video non disponibile
      </div>
    )
  }

  return (
    <div className="overflow-hidden rounded-lg bg-black">
      <video
        ref={videoRef}
        src={src}
        poster={posterUrl ?? undefined}
        controls
        preload="metadata"
        onError={() => setError(true)}
        className="aspect-video w-full"
        aria-label={title}
      >
        <p className="text-sm text-muted-foreground">
          Il tuo browser non supporta la riproduzione video.{' '}
          <a href={src} download className="underline">Scarica il video</a>
        </p>
      </video>
    </div>
  )
}
