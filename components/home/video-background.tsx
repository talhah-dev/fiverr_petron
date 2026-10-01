"use client"

interface VideoBackgroundProps {
  videoUrl?: string
}

export function VideoBackground({
  videoUrl = "/video.mp4",
}: VideoBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <video
        autoPlay
        loop
        src={videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}


