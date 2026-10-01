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
    <section id="media-catalog-section" className="w-full max-w-2xl px-4 pb-24">
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-border/40 mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Tracks
          </h2>
          <Badge variant="secondary" className="text-xs px-2 py-0 h-5 font-mono">
            {items.length}
          </Badge>
        </div>

        <div className="grid grid-cols-3 sm:inline-flex items-center p-0.5 bg-muted/60 rounded-lg text-xs shrink-0">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer ${
              filter === "all"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All
          </button>
          <button
            onClick={() => setFilter("song")}
            className={`px-3 py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer ${
              filter === "song"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Audio (2)
          </button>
          <button
            onClick={() => setFilter("video")}
            className={`px-3 py-1.5 rounded-md transition-all text-center whitespace-nowrap cursor-pointer ${
              filter === "video"
                ? "bg-background text-foreground shadow-xs font-medium"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Videos (2)
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
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-xs font-mono text-muted-foreground/70 w-4 text-center shrink-0">
                    {index + 1}
                  </span>

                  <div className="relative size-11 rounded-md overflow-hidden bg-muted shrink-0 border border-border/60 group">
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

                  <div className="min-w-0 space-y-0.5">
                    <p className="text-sm font-semibold text-foreground truncate">
                      {item.title}
                    </p>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1 font-medium text-foreground/80">
                        {item.type === "song" ? (
                          <Headphones className="size-3" />
                        ) : (
                          <Film className="size-3" />
                        )}
                        <span>swagsxn</span>
                      </span>
                      <span>•</span>
                      {item.bpm ? <span>{item.bpm}</span> : <span>{item.genre}</span>}
                      <span>•</span>
                      <span>{item.duration}</span>
                    </div>

                    {item.tags && item.tags.length > 0 && (
                      <div className="hidden sm:flex items-center gap-1.5 pt-0.5">
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
                      className="text-xs gap-1.5 h-8 text-foreground border-border/80 hover:bg-muted cursor-pointer"
                    >
                      <Download className="size-3.5 text-emerald-500" />
                      <span>Stream</span>
                    </Button>
                  ) : item.type === "song" ? (
                    <Button
                      onClick={() => onOpenPayment(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3 h-8.5 rounded-md gap-1.5 cursor-pointer shadow-xs text-xs"
                    >
                      <ShoppingCart className="size-3.5" />
                      <span>Buy ${item.price.toFixed(2)}</span>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onOpenPayment(item)}
                      size="sm"
                      className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3.5 h-8.5 rounded-md gap-1.5 cursor-pointer shadow-xs text-xs"
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

