"use client"

import { useState } from "react"
import { Check, Loader2, Sparkles, ShoppingBag } from "lucide-react"
import { FaApple, FaGoogle } from "react-icons/fa6"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MediaItem, SubscriptionTier } from "./types"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  item?: MediaItem | null
  onSuccessfulSubscription: (
    tier: SubscriptionTier,
    email: string,
    itemId?: string
  ) => void
}

export function SubscriptionModal({
  isOpen,
  onClose,
  item,
  onSuccessfulSubscription,
}: SubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<"yearly" | "lifetime">("yearly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null)

  const isAudioItem = item?.type === "song"
  const isVideoItem = item?.type === "video"

  const handleSimulatePayment = (method: string) => {
    setActivePaymentMethod(method)
    setIsProcessing(true)

    setTimeout(() => {
      setIsProcessing(false)
      setActivePaymentMethod(null)
      const mockEmail =
        method === "apple"
          ? "customer@icloud.com"
          : "customer@gmail.com"
      const tier: SubscriptionTier = isAudioItem
        ? "lifetime"
        : isVideoItem
        ? "yearly"
        : selectedTier
      onSuccessfulSubscription(tier, mockEmail, item?.id)
      onClose()
    }, 1000)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-card border-border/80 shadow-lg">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold tracking-tight flex items-center gap-2">
            {isAudioItem ? (
              <>
                <ShoppingBag className="size-5 text-primary" />
                <span>Buy Audio • Lifetime Access</span>
              </>
            ) : isVideoItem ? (
              <>
                <Sparkles className="size-5 text-primary" />
                <span>Subscribe to Video Vault</span>
              </>
            ) : (
              <span>Unlock Creator Vault</span>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            {isAudioItem
              ? "One-time purchase for permanent streaming and stems access."
              : isVideoItem
              ? "Annual subscription for unlimited 4K video streaming access."
              : "Instant streaming access to all unreleased songs and videos."}
          </DialogDescription>
        </DialogHeader>

        {item ? (
          <div className="p-3.5 my-3 rounded-lg border border-border/80 bg-muted/20 flex items-center justify-between gap-3">
            <div className="min-w-0 space-y-0.5">
              <div className="flex items-center gap-1.5">
                <Badge
                  variant="outline"
                  className="text-[10px] px-1 py-0 h-4 uppercase tracking-wider font-semibold"
                >
                  {isAudioItem ? "Lifetime Audio" : "Annual VIP"}
                </Badge>
                {item.genre && (
                  <span className="text-xs text-muted-foreground truncate">
                    {item.genre}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-foreground truncate">
                {item.title}
              </p>
              <p className="text-[11px] text-muted-foreground">
                {isAudioItem
                  ? "Instant MP3/WAV download & stream"
                  : "All current and upcoming 4K videos included"}
              </p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-xl font-bold text-foreground">
                ${item.price.toFixed(2)}
              </p>
              <p className="text-[10px] text-muted-foreground">
                {isAudioItem ? "one-time" : "/ year"}
              </p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2.5 my-3">
            <button
              type="button"
              onClick={() => setSelectedTier("yearly")}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedTier === "yearly"
                  ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Yearly
                </span>
                <Badge variant="outline" className="text-[10px] py-0 px-1 h-4">
                  Videos
                </Badge>
              </div>
              <div className="mt-2">
                <span className="text-xl font-bold text-foreground">$29</span>
                <span className="text-xs text-muted-foreground"> / year</span>
              </div>
            </button>

            <button
              type="button"
              onClick={() => setSelectedTier("lifetime")}
              className={`p-3 rounded-lg border text-left transition-all ${
                selectedTier === "lifetime"
                  ? "border-primary bg-primary/5 text-foreground ring-1 ring-primary/30"
                  : "border-border/60 bg-muted/20 text-muted-foreground hover:border-border"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold uppercase tracking-wider">
                  Lifetime
                </span>
                <Badge variant="secondary" className="text-[10px] py-0 px-1 h-4">
                  VIP
                </Badge>
              </div>
              <div className="mt-2">
                <span className="text-xl font-bold text-foreground">$79</span>
                <span className="text-xs text-muted-foreground"> one-time</span>
              </div>
            </button>
          </div>
        )}

        <div className="space-y-1.5 py-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>Instant access immediately upon checkout</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0" />
            <span>Encrypted 256-bit secure transaction</span>
          </div>
        </div>

        <div className="space-y-2 pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment("apple")}
            className="w-full h-11 bg-foreground text-background hover:bg-foreground/90 font-medium text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer"
          >
            {isProcessing && activePaymentMethod === "apple" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaApple className="size-4.5" />
                <span>Pay with Apple Pay</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment("google")}
            className="w-full h-11 border-border/80 hover:bg-muted font-medium text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer"
          >
            {isProcessing && activePaymentMethod === "google" ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaGoogle className="size-4" />
                <span>Pay with Google Pay</span>
              </>
            )}
          </Button>
        </div>

        <p className="pt-1 text-[11px] text-muted-foreground/80 text-center">
          Account created automatically with payment email
        </p>
      </DialogContent>
    </Dialog>
  )
}
