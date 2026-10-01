"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Play,
  Pause,
  Sparkles,
  ShoppingCart,
  Music,
  Film,
  Check,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MediaItem, UserSubscription } from "./types"

interface MediaCatalogProps {
  items: MediaItem[]
  subscription: UserSubscription
  activePlayingId: string | null
  onTogglePlay: (item: MediaItem) => void
  onOpenPayment: (item: MediaItem) => void
}

export function MediaCatalog({
  items,
  subscription,
  activePlayingId,
  onTogglePlay,
  onOpenPayment,
}: MediaCatalogProps) {
  const [filter, setFilter] = useState<"all" | "song" | "video">("all")

  const audioCount = items.filter((item) => item.type === "song").length
  const videoCount = items.filter((item) => item.type === "video").length

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    return item.type === filter
  })

  return (
    <section id="media-catalog-section" className="w-full max-w-2xl px-3 sm:px-4 pb-24">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/40 mb-3 sm:mb-4">
        <div className="flex items-center gap-2 shrink-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Vault
          </h2>
          <span className="text-xs text-muted-foreground font-mono">
            {audioCount} Audios • {videoCount} Videos
          </span>
        </div>

        <div className="inline-flex items-center p-0.5 bg-muted/60 rounded-lg text-xs shrink-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "all"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter("song")}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "song"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audio ({audioCount})
          </button>
          <button
            onClick={() => setFilter("video")}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "video"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Videos ({videoCount})
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredItems.map((item, index) => {
          const isPlaying = activePlayingId === item.id
          const isPurchased = (subscription.purchasedItemIds ?? []).includes(item.id)
          const isUnlocked =
            !item.isExclusive ||
            subscription.tier === "lifetime" ||
            (item.type === "video" && subscription.tier === "yearly") ||
            isPurchased

          const isAudio = item.type === "song"

          return (
            <Card
              key={item.id}
              className="bg-card/70 backdrop-blur-sm border-border/50 hover:border-border transition-colors shadow-none"
            >
              <CardContent className="p-2.5 sm:p-3 flex items-center justify-between gap-2.5 sm:gap-3">
                <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
                  <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground/60 w-4 text-center shrink-0">
                    {index + 1}
                  </span>

                  {isAudio ? (
                    <div className="relative size-11 sm:size-12 rounded-lg bg-muted/80 shrink-0 border border-border flex items-center justify-center group overflow-hidden">
                      <div className="flex flex-col items-center justify-center size-full group-hover:scale-105 transition-transform">
                        <Music className="size-5 text-foreground/80" />
                        <span className="text-[8px] font-mono text-muted-foreground font-semibold uppercase mt-0.5">
                          AUDIO
                        </span>
                      </div>
                      <button
                        onClick={() => onTogglePlay(item)}
                        aria-label={isPlaying ? "Pause track" : "Play preview"}
                        className={`absolute inset-0 flex items-center justify-center transition-all cursor-pointer text-white ${
                          isPlaying
                            ? "bg-black/60 opacity-100"
                            : "bg-black/40 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="size-4" />
                        ) : (
                          <Play className="size-4 ml-0.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-16 sm:w-20 h-11 sm:h-12 rounded-lg overflow-hidden bg-muted shrink-0 border border-border group">
                      <Image
                        src={item.thumbnailUrl ?? "/avatar.jpg"}
                        alt={item.title}
                        width={80}
                        height={48}
                        className="size-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-1 left-1 bg-black/75 backdrop-blur-xs px-1 py-0.2 rounded text-[8px] font-semibold text-white flex items-center gap-0.5 pointer-events-none">
                        <Film className="size-2" />
                        <span>4K</span>
                      </div>
                      <div className="absolute bottom-1 right-1 bg-black/75 backdrop-blur-xs text-[8px] font-mono px-1 py-0.2 rounded text-white pointer-events-none">
                        {item.duration}
                      </div>
                      <button
                        onClick={() => onTogglePlay(item)}
                        aria-label={isPlaying ? "Pause video" : "Play video preview"}
                        className={`absolute inset-0 flex items-center justify-center transition-all cursor-pointer text-white ${
                          isPlaying
                            ? "bg-black/60 opacity-100"
                            : "bg-black/30 group-hover:bg-black/60 opacity-0 group-hover:opacity-100"
                        }`}
                      >
                        {isPlaying ? (
                          <Pause className="size-4" />
                        ) : (
                          <Play className="size-4 ml-0.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                        {item.title}
                      </p>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1 py-0 h-3.5 uppercase font-medium"
                      >
                        {isAudio ? "Audio" : "4K Video"}
                      </Badge>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground/80 shrink-0">
                        {isAudio ? (
                          <Music className="size-3" />
                        ) : (
                          <Film className="size-3" />
                        )}
                        <span>swagsxn</span>
                      </span>
                      <span>•</span>
                      <span className="truncate whitespace-nowrap">
                        {item.bpm ? item.bpm : item.genre}
                      </span>
                      <span className="hidden xs:inline">•</span>
                      <span className="hidden xs:inline shrink-0">{item.duration}</span>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="hidden md:flex items-center gap-1.5 pt-0.5">
                        {item.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] px-2 py-0.2 rounded-full bg-muted/70 text-muted-foreground"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isUnlocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTogglePlay(item)}
                      className="text-xs gap-1.5 h-8 px-2.5 sm:px-3 text-emerald-500 border-border/80 hover:bg-muted cursor-pointer shrink-0"
                    >
                      <Check className="size-3.5" />
                      <span>{isAudio ? "Stream" : "Watch"}</span>
                    </Button>
                  ) : isAudio ? (
                    <Button
                      onClick={() => onOpenPayment(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-8 sm:h-8.5 px-2.5 sm:px-3.5 rounded-md gap-1.5 cursor-pointer shadow-xs text-xs shrink-0 whitespace-nowrap"
                    >
                      <ShoppingCart className="size-3.5" />
                      <span>Buy ${item.price.toFixed(2)}</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onOpenPayment(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-8 sm:h-8.5 px-2.5 sm:px-3.5 rounded-md gap-1.5 cursor-pointer shadow-xs text-xs shrink-0 whitespace-nowrap"
                    >
                      <Sparkles className="size-3.5" />
                      <span>Subscribe</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
}


