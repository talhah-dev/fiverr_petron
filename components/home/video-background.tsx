"use client"

interface VideoBackgroundProps {
  videoUrl?: string
}

export function VideoBackground({
  videoUrl = "https://f7m4enyxvx3urxqn.public.blob.vercel-storage.com/Video%20Apr%2003%202026%2C%2011%2007%2048%20PM%20%281%29.mp4",
}: VideoBackgroundProps) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      <video
        autoPlay
        loop
        playsInline
        src={videoUrl}
        className="absolute inset-0 h-full w-full object-cover"
      />
    </div>
  )
}


