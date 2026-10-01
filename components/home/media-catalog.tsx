"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Play,
  Pause,
  Download,
  Sparkles,
  ShoppingCart,
  Headphones,
  Film,
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

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    return item.type === filter
  })

  return (
    <section id="media-catalog-section" className="w-full max-w-2xl px-3 sm:px-4 pb-24">
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-border/40 mb-3 sm:mb-4">
        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Tracks
          </h2>
          <Badge variant="secondary" className="text-xs px-1.5 py-0 h-4.5 font-mono">
            {items.length}
          </Badge>
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
            All
          </button>
          <button
            onClick={() => setFilter("song")}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "song"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audio
          </button>
          <button
            onClick={() => setFilter("video")}
            className={`px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer text-xs ${
              filter === "video"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Videos
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

                  <div className="relative size-10 sm:size-11 rounded-md overflow-hidden bg-muted shrink-0 border border-border/60 group">
                    <Image
                      src={item.thumbnailUrl ?? "/avatar.jpg"}
                      alt={item.title}
                      width={44}
                      height={44}
                      className="size-full object-cover"
                    />
                    <button
                      onClick={() => onTogglePlay(item)}
                      aria-label={isPlaying ? "Pause track" : "Play preview"}
                      className="absolute inset-0 bg-black/40 hover:bg-black/60 flex items-center justify-center transition-opacity cursor-pointer text-white"
                    >
                      {isPlaying ? (
                        <Pause className="size-4" />
                      ) : (
                        <Play className="size-4 ml-0.5" />
                      )}
                    </button>
                  </div>

                  <div className="min-w-0 flex-1 space-y-0.5">
                    <p className="text-xs sm:text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </p>

                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground/80 shrink-0">
                        {item.type === "song" ? (
                          <Headphones className="size-3" />
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
                      className="text-xs gap-1.5 h-8 px-2.5 sm:px-3 text-foreground border-border/80 hover:bg-muted cursor-pointer shrink-0"
                    >
                      <Download className="size-3.5 text-emerald-500" />
                      <span>Stream</span>
                    </Button>
                  ) : item.type === "song" ? (
                    <Button
                      onClick={() => onOpenPayment(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-8 sm:h-8.5 px-2.5 sm:px-3.5 rounded-md gap-1.5 cursor-pointer shadow-xs text-xs shrink-0 whitespace-nowrap"
                    >
                      <ShoppingCart className="size-3.5" />
                      <span className="hidden sm:inline">Buy </span>
                      <span>${item.price.toFixed(2)}</span>
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


