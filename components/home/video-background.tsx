"use client"

import { forwardRef, useState } from "react"

interface VideoBackgroundProps {
  isMuted?: boolean
  onEnter?: () => void
}

export const VideoBackground = forwardRef<HTMLVideoElement, VideoBackgroundProps>(
  function VideoBackground({ isMuted = true, onEnter }, ref) {
    const [hasEntered, setHasEntered] = useState(false)

    const handleEnter = () => {
      setHasEntered(true)
      onEnter?.()
    }

    return (
      <>
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <video
            ref={ref}
            autoPlay
            loop
            muted={isMuted}
            playsInline
            preload="auto"
            className="absolute inset-0 h-full w-full object-cover"
          >
            <source src="/video.mp4" type="video/mp4" />
          </video>
        </div>

        {!hasEntered && (
          <div
            role="button"
            tabIndex={0}
            onClick={handleEnter}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                handleEnter()
              }
            }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md cursor-pointer select-none transition-all duration-300"
          >
            <div className="px-7 py-3.5 rounded-full bg-white/10 backdrop-blur-lg shadow-2xl hover:bg-white/15 hover:scale-105 transition-all">
              <p className="text-sm sm:text-base font-semibold tracking-wider text-white uppercase text-center">
                Click to enter website
              </p>
            </div>
          </div>
        )}
      </>
    )
  }
)