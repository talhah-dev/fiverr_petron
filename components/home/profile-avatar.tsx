"use client"

import { useState } from "react"
import { Blobatar } from "@blobatar/react"
import { Shuffle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface ProfileAvatarProps {
  initialName?: string
  size?: number
}

const SEEDS = [
  "swagsxn",
  "midnight-echo",
  "cyber-phantom",
  "astral-pulse",
  "neon-drift",
  "shadow-amanda",
  "tokyo-synth",
  "vortex-audio",
]

export function ProfileAvatar({
  initialName = "swagsxn",
  size = 96,
}: ProfileAvatarProps) {
  const [currentSeed, setCurrentSeed] = useState(initialName)
  const [isRotating, setIsRotating] = useState(false)

  const handleShuffle = () => {
    setIsRotating(true)
    const available = SEEDS.filter((s) => s !== currentSeed)
    const nextSeed =
      available.length > 0
        ? available[Math.floor(Math.random() * available.length)]
        : Math.random().toString(36).substring(2, 9)
    setCurrentSeed(nextSeed)
    setTimeout(() => setIsRotating(false), 300)
  }

  return (
    <div className="relative inline-flex group">
      <div className="size-24 rounded-full overflow-hidden flex items-center justify-center">
        <Blobatar
          name={currentSeed}
          size={size}
          animate="hover"
          className="size-full rounded-full transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <Button
        variant="outline"
        size="icon-xs"
        onClick={handleShuffle}
        aria-label="Shuffle avatar"
        className="absolute -top-1 -right-1 size-6 rounded-full bg-background/90 backdrop-blur-sm shadow-xs border-border/80 hover:bg-muted cursor-pointer"
      >
        <Shuffle
          className={`size-3 text-muted-foreground transition-transform duration-300 ${
            isRotating ? "rotate-180 text-foreground" : ""
          }`}
        />
      </Button>
    </div>
  )
}
