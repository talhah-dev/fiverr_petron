"use client"

import { useEffect, useRef } from "react"

interface VideoBackgroundProps {
  videoUrl?: string
}

export function VideoBackground({
  videoUrl = "/video.mp4",
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.muted = false
    video.volume = 1.0
    video.play().catch(() => {})
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <video
        ref={videoRef}
        autoPlay
        loop
        playsInline
        preload="auto"
        src={videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}


