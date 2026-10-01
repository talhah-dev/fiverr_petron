"use client"

import { useState } from "react"
import {
  Play,
  Pause,
  Lock,
  Film,
  Music,
  Download,
  Sparkles,
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
  onOpenSubscription: () => void
}

export function MediaCatalog({
  items,
  subscription,
  activePlayingId,
  onTogglePlay,
  onOpenSubscription,
}: MediaCatalogProps) {
  const [filter, setFilter] = useState<"all" | "song" | "video">("all")

  const isSubscribed = subscription.tier !== "free"

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true
    return item.type === filter
  })

  return (
    <section id="media-catalog-section" className="w-full max-w-2xl px-4 pb-24">
      <div className="flex items-center justify-between pb-3 border-b border-border/40 mb-3">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Exclusive Vault
          </h2>
          <p className="text-xs text-muted-foreground">
            Songs, videos & unreleased audio
          </p>
        </div>

        <div className="flex items-center p-0.5 bg-muted/60 rounded-lg text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              filter === "all"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({items.length})
          </button>
          <button
            onClick={() => setFilter("song")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              filter === "song"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Songs
          </button>
          <button
            onClick={() => setFilter("video")}
            className={`px-2.5 py-1 rounded-md transition-all cursor-pointer ${
              filter === "video"
                ? "bg-background text-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Videos
          </button>
        </div>
      </div>

      <div className="space-y-2.5">
        {filteredItems.map((item) => {
          const isPlaying = activePlayingId === item.id
          const isUnlocked = !item.isExclusive || isSubscribed

          return (
            <Card
              key={item.id}
              className="bg-card/60 backdrop-blur-sm border-border/50 hover:border-border transition-colors shadow-none"
            >
              <CardContent className="p-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 min-w-0">
                  <Button
                    variant={isPlaying ? "default" : "secondary"}
                    size="icon"
                    onClick={() => onTogglePlay(item)}
                    className="size-9 rounded-full shrink-0 cursor-pointer"
                    aria-label={isPlaying ? "Pause" : "Play preview"}
                  >
                    {isPlaying ? (
                      <Pause className="size-4" />
                    ) : (
                      <Play className="size-4 ml-0.5" />
                    )}
                  </Button>

                  <div className="min-w-0 space-y-0.5">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-foreground truncate">
                        {item.title}
                      </p>
                      {item.isExclusive && (
                        <Badge
                          variant={isUnlocked ? "secondary" : "outline"}
                          className="text-[10px] px-1.5 py-0 h-4 shrink-0"
                        >
                          {isUnlocked ? "Unlocked" : "VIP"}
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        {item.type === "song" ? (
                          <Music className="size-3" />
                        ) : (
                          <Film className="size-3" />
                        )}
                        <span className="capitalize">{item.type}</span>
                      </span>
                      <span>•</span>
                      <span>{item.duration}</span>
                      {item.genre && (
                        <>
                          <span>•</span>
                          <span className="truncate">{item.genre}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {isUnlocked ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onTogglePlay(item)}
                      className="text-xs gap-1.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    >
                      <Download className="size-3.5" />
                      <span className="hidden sm:inline">Stream</span>
                    </Button>
                  ) : (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={onOpenSubscription}
                      className="text-xs gap-1.5 h-8 border-border/80 hover:bg-muted/80 cursor-pointer"
                    >
                      <Lock className="size-3 text-muted-foreground" />
                      <span>Unlock</span>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {!isSubscribed && (
        <div className="mt-6 p-4 rounded-xl border border-border/60 bg-muted/20 text-center space-y-2.5">
          <div className="inline-flex p-2 rounded-full bg-muted/60 text-foreground">
            <Sparkles className="size-3.5" />
          </div>
          <div>
            <h3 className="text-sm font-medium text-foreground">
              Unlock Full Vault
            </h3>
            <p className="text-xs text-muted-foreground mt-0.5">
              Instant streaming for all songs and 4K videos.
            </p>
          </div>
          <Button
            onClick={onOpenSubscription}
            size="sm"
            className="text-xs px-5 shadow-none cursor-pointer"
          >
            Unlock All
          </Button>
        </div>
      )}
    </section>
  )
}
