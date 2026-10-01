"use client"

import { forwardRef } from "react"

interface VideoBackgroundProps {
  videoUrl?: string
  isMuted?: boolean
}

export const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(
  function VideoBackground(
    {
      videoUrl = "https://f7m4enyxvx3urxqn.public.blob.vercel-storage.com/Video%20Apr%2003%202026%2C%2011%2007%2048%20PM%20%281%29.mp4",
      isMuted = true,
    },
    ref
  ) {
    return (
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <video
          ref={ref}
          autoPlay
          loop
          muted={isMuted}
          playsInline
          preload="auto"
          src={videoUrl}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-background/30 backdrop-blur-[1px]" />
      </div>
    )
  }
)
