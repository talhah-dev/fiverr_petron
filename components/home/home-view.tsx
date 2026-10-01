"use client"

import { useState } from "react"
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

  const handleTogglePlay = (item: MediaItem) => {
    if (activeItem?.id === item.id && isPlaying) {
      setIsPlaying(false)
    } else {
      setActiveItem(item)
      setIsPlaying(true)
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
      <VideoBackground />

      <HeroHeader
        subscription={subscription}
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
        onTogglePlay={() => setIsPlaying((prev) => !prev)}
        onClose={() => {
          setIsPlaying(false)
          setActiveItem(null)
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
