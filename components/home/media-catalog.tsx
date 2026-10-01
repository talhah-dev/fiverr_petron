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
    <section id="media-catalog-section" className="w-full max-w-2xl px-2.5 sm:px-4 pb-24">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3 border-b border-border/40 mb-3 sm:mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Vault
          </h2>
          <Badge variant="secondary" className="text-[11px] px-1.5 py-0 h-4 font-mono">
            {audioCount} Audios • {videoCount} Videos
          </Badge>
        </div>

        <div className="grid grid-cols-3 p-0.5 bg-muted/60 rounded-lg text-xs w-full sm:w-auto sm:inline-flex">
          <button
            onClick={() => setFilter("all")}
            className={`py-1.5 px-2 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "all"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter("song")}
            className={`py-1.5 px-2 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "song"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audio ({audioCount})
          </button>
          <button
            onClick={() => setFilter("video")}
            className={`py-1.5 px-2 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "video"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Videos ({videoCount})
          </button>
        </div>
      </div>

      <div className="space-y-2">
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
              <CardContent className="p-2 sm:p-3 flex items-center justify-between gap-2 sm:gap-3">
                <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 flex-1">
                  <span className="hidden sm:inline-block text-xs font-mono text-muted-foreground/60 w-4 text-center shrink-0">
                    {index + 1}
                  </span>

                  {isAudio ? (
                    <div className="relative size-10 sm:size-11 rounded-md bg-muted/80 shrink-0 border border-border flex items-center justify-center group overflow-hidden">
                      <div className="flex flex-col items-center justify-center size-full group-hover:scale-105 transition-transform">
                        <Music className="size-4 text-foreground/80" />
                        <span className="text-[7px] font-mono text-muted-foreground font-semibold uppercase leading-tight mt-0.5">
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
                          <Pause className="size-3.5" />
                        ) : (
                          <Play className="size-3.5 ml-0.5" />
                        )}
                      </button>
                    </div>
                  ) : (
                    <div className="relative w-14 sm:w-16 h-10 sm:h-11 rounded-md overflow-hidden bg-muted shrink-0 border border-border group">
                      <Image
                        src={item.thumbnailUrl ?? "/avatar.jpg"}
                        alt={item.title}
                        width={64}
                        height={44}
                        className="size-full object-cover group-hover:scale-105 transition-transform"
                      />
                      <div className="absolute top-0.5 left-0.5 bg-black/75 backdrop-blur-xs px-1 py-0 rounded text-[7px] font-semibold text-white flex items-center gap-0.5 pointer-events-none">
                        <Film className="size-2" />
                        <span>4K</span>
                      </div>
                      <div className="absolute bottom-0.5 right-0.5 bg-black/75 backdrop-blur-xs text-[7px] font-mono px-1 py-0 rounded text-white pointer-events-none">
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
                          <Pause className="size-3.5" />
                        ) : (
                          <Play className="size-3.5 ml-0.5" />
                        )}
                      </button>
                    </div>
                  )}

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </p>

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
                      <span className="truncate">
                        {isAudio ? (item.bpm ?? item.genre) : (item.genre ?? "4K Video")}
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

                <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                  {isUnlocked ? (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onTogglePlay(item)}
                      className="text-xs gap-1 h-7.5 sm:h-8 px-2 sm:px-3 text-emerald-500 border-border/80 hover:bg-muted cursor-pointer shrink-0"
                    >
                      <Check className="size-3.5" />
                      <span>{isAudio ? "Stream" : "Watch"}</span>
                    </Button>
                  ) : isAudio ? (
                    <Button
                      onClick={() => onOpenPayment(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-7.5 sm:h-8 px-2 sm:px-3 rounded-md gap-1 cursor-pointer shadow-xs text-xs shrink-0 whitespace-nowrap"
                    >
                      <ShoppingCart className="size-3" />
                      <span className="hidden xs:inline">Buy </span>
                      <span>${item.price.toFixed(0)}</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onOpenPayment(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-7.5 sm:h-8 px-2 sm:px-3 rounded-md gap-1 cursor-pointer shadow-xs text-xs shrink-0 whitespace-nowrap"
                    >
                      <Sparkles className="size-3" />
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


