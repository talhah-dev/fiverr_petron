"use client"

import { useState, useRef, useEffect } from "react"
import { VideoBackground } from "./video-background"
import { HeroHeader } from "./hero-header"
import { MediaCatalog } from "./media-catalog"
import { SubscriptionModal } from "./subscription-modal"
import { MemberStatusModal } from "./member-status-modal"
import { AudioPlayerBar } from "./audio-player-bar"
import { INITIAL_MEDIA_ITEMS } from "./mock-data"
import { MediaItem, SubscriptionTier, UserSubscription } from "./types"

export function HomeView() {
  const [subscription, setSubscription] = useState<UserSubscription>({
    tier: "free",
    email: null,
    activeUntil: null,
    autoRenew: true,
  })

  const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false)
  const [selectedPaymentItem, setSelectedPaymentItem] = useState<MediaItem | null>(null)
  const [isMemberModalOpen, setIsMemberModalOpen] = useState(false)
  const [activeItem, setActiveItem] = useState<MediaItem | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isVideoMuted, setIsVideoMuted] = useState(false)

  const videoRef = useRef<HTMLVideoElement | null>(null)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const oscRef = useRef<OscillatorNode | null>(null)

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = 1.0

    const tryPlayWithSound = () => {
      video.muted = false
      const promise = video.play()
      if (promise !== undefined) {
        promise
          .then(() => {
            setIsVideoMuted(false)
          })
          .catch(() => {
            video.muted = true
            video.play().catch(() => {})
            setIsVideoMuted(true)
          })
      }
    }

    tryPlayWithSound()

    const enableAudio = () => {
      if (videoRef.current) {
        videoRef.current.muted = false
        videoRef.current.volume = 1.0
        videoRef.current.play().catch(() => {})
        setIsVideoMuted(false)
      }
      window.removeEventListener("pointerdown", enableAudio)
      window.removeEventListener("click", enableAudio)
      window.removeEventListener("scroll", enableAudio)
      window.removeEventListener("touchstart", enableAudio)
      window.removeEventListener("keydown", enableAudio)
    }

    window.addEventListener("pointerdown", enableAudio, { once: true })
    window.addEventListener("click", enableAudio, { once: true })
    window.addEventListener("scroll", enableAudio, { once: true })
    window.addEventListener("touchstart", enableAudio, { once: true })
    window.addEventListener("keydown", enableAudio, { once: true })

    video.addEventListener("canplay", tryPlayWithSound, { once: true })

    return () => {
      window.removeEventListener("pointerdown", enableAudio)
      window.removeEventListener("click", enableAudio)
      window.removeEventListener("scroll", enableAudio)
      window.removeEventListener("touchstart", enableAudio)
      window.removeEventListener("keydown", enableAudio)
      video.removeEventListener("canplay", tryPlayWithSound)
    }
  }, [])

  const handleToggleVideoSound = () => {
    const video = videoRef.current
    if (!video) return

    if (isVideoMuted) {
      video.muted = false
      video.volume = 1.0
      video.play().catch(() => {})
      setIsVideoMuted(false)
    } else {
      video.muted = true
      setIsVideoMuted(true)
    }
  }

  const stopPreviewAudio = () => {
    if (oscRef.current && audioCtxRef.current) {
      try {
        oscRef.current.stop()
        audioCtxRef.current.close()
      } catch {}
      oscRef.current = null
      audioCtxRef.current = null
    }
  }

  const startPreviewAudio = (freq: number) => {
    stopPreviewAudio()
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext
      const ctx = new AudioCtx()
      const osc = ctx.createOscillator()
      const gain = ctx.createGain()

      osc.type = "triangle"
      osc.frequency.setValueAtTime(freq, ctx.currentTime)

      gain.gain.setValueAtTime(0.04, ctx.currentTime)
      osc.connect(gain)
      gain.connect(ctx.destination)
      osc.start()

      audioCtxRef.current = ctx
      oscRef.current = osc
    } catch {}
  }

  const handleTogglePlay = (item: MediaItem) => {
    if (activeItem?.id === item.id && isPlaying) {
      setIsPlaying(false)
      stopPreviewAudio()
    } else {
      setActiveItem(item)
      setIsPlaying(true)
      if (videoRef.current) {
        videoRef.current.muted = true
        setIsVideoMuted(true)
      }
      const freq = item.type === "song" ? 220 : 330
      startPreviewAudio(freq)
    }
  }

  const handleOpenPayment = (item: MediaItem) => {
    setSelectedPaymentItem(item)
    setIsSubscriptionModalOpen(true)
  }

  const handleSuccessfulSubscription = (
    tier: SubscriptionTier,
    email: string,
    itemId?: string
  ) => {
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    setSubscription((prev) => {
      const updatedPurchased = itemId
        ? Array.from(new Set([...(prev.purchasedItemIds ?? []), itemId]))
        : prev.purchasedItemIds

      return {
        ...prev,
        tier: tier !== "free" ? tier : prev.tier,
        email,
        activeUntil:
          tier === "yearly"
            ? nextYear.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })
            : prev.activeUntil,
        autoRenew: tier === "yearly",
        purchasedItemIds: updatedPurchased,
      }
    })
  }

  const handleUpdateSubscription = (updates: Partial<UserSubscription>) => {
    setSubscription((prev) => ({ ...prev, ...updates }))
  }

  const handleSignInMock = (email: string, tier: SubscriptionTier) => {
    const nextYear = new Date()
    nextYear.setFullYear(nextYear.getFullYear() + 1)

    setSubscription({
      tier,
      email,
      activeUntil:
        tier === "yearly"
          ? nextYear.toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : null,
      autoRenew: true,
    })
  }

  const handleSignOut = () => {
    setSubscription({
      tier: "free",
      email: null,
      activeUntil: null,
      autoRenew: true,
    })
  }

  return (
    <div className="relative min-h-screen flex flex-col">
      <VideoBackground ref={videoRef} isMuted={isVideoMuted} />

      <HeroHeader
        subscription={subscription}
        isVideoMuted={isVideoMuted}
        onToggleVideoSound={handleToggleVideoSound}
        onOpenMemberModal={() => setIsMemberModalOpen(true)}
      />

      <main
        id="vault-section"
        className="relative z-10 w-full bg-background border-t border-border/40 flex flex-col items-center pt-10"
      >
        <MediaCatalog
          items={INITIAL_MEDIA_ITEMS}
          subscription={subscription}
          activePlayingId={isPlaying ? activeItem?.id ?? null : null}
          onTogglePlay={handleTogglePlay}
          onOpenPayment={handleOpenPayment}
        />
      </main>

      <AudioPlayerBar
        item={activeItem}
        isPlaying={isPlaying}
        subscription={subscription}
        onTogglePlay={() => {
          if (isPlaying) {
            setIsPlaying(false)
            stopPreviewAudio()
          } else if (activeItem) {
            setIsPlaying(true)
            if (videoRef.current) {
              videoRef.current.muted = true
              setIsVideoMuted(true)
            }
            startPreviewAudio(activeItem.type === "song" ? 220 : 330)
          }
        }}
        onClose={() => {
          setIsPlaying(false)
          setActiveItem(null)
          stopPreviewAudio()
        }}
        onOpenSubscription={() => {
          if (activeItem) {
            handleOpenPayment(activeItem)
          } else {
            setIsSubscriptionModalOpen(true)
          }
        }}
      />

      <SubscriptionModal
        isOpen={isSubscriptionModalOpen}
        onClose={() => {
          setIsSubscriptionModalOpen(false)
          setSelectedPaymentItem(null)
        }}
        item={selectedPaymentItem}
        onSuccessfulSubscription={handleSuccessfulSubscription}
      />

      <MemberStatusModal
        isOpen={isMemberModalOpen}
        onClose={() => setIsMemberModalOpen(false)}
        subscription={subscription}
        onUpdateSubscription={handleUpdateSubscription}
        onSignInMock={handleSignInMock}
        onSignOut={handleSignOut}
      />
    </div>
  )
}
