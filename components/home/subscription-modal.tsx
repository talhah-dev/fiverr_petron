"use client"

import { useState } from "react"
import { Check, Loader2, Music, Film } from "lucide-react"
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
  const [isProcessing, setIsProcessing] = useState(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null)

  if (!item) return null

  const isAudioItem = item.type === "song"

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
      const tier: SubscriptionTier = isAudioItem ? "lifetime" : "yearly"
      onClose()
      onSuccessfulSubscription(tier, mockEmail, item.id)
    }, 1000)
  }

  const appleButtonLabel = isAudioItem
    ? `Pay $${item.price.toFixed(2)} with Apple Pay`
    : "Subscribe with Apple Pay ($29/yr)"

  const googleButtonLabel = isAudioItem
    ? `Pay $${item.price.toFixed(2)} with Google Pay`
    : "Subscribe with Google Pay ($29/yr)"

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[calc(100vw-1.5rem)] max-w-[calc(100vw-1.5rem)] sm:max-w-md p-4 sm:p-6 bg-card border-border/80 shadow-lg rounded-xl overflow-hidden box-border">
        <DialogHeader className="space-y-1 text-left pr-7 min-w-0">
          <DialogTitle className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2 min-w-0">
            {isAudioItem ? (
              <>
                <Music className="size-4.5 text-primary shrink-0" />
                <span className="truncate">Buy Audio • Lifetime Access</span>
              </>
            ) : (
              <>
                <Film className="size-4.5 text-primary shrink-0" />
                <span className="truncate">Subscribe to Video Vault</span>
              </>
            )}
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground leading-relaxed break-words">
            {isAudioItem
              ? "Direct one-time purchase for permanent lifetime streaming and download."
              : "Annual subscription for unlimited 1-year access to all 4K videos."}
          </DialogDescription>
        </DialogHeader>

        <div className="p-3 sm:p-3.5 my-2 rounded-lg border border-border/80 bg-muted/20 space-y-2">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="flex items-center gap-1.5 min-w-0 flex-1">
              <Badge
                variant="outline"
                className="text-[10px] px-1 py-0 h-4 uppercase tracking-wider font-semibold shrink-0"
              >
                {isAudioItem ? "Lifetime Audio" : "Annual Video"}
              </Badge>
              {item.genre && (
                <span className="text-xs text-muted-foreground truncate">
                  {item.genre}
                </span>
              )}
            </div>
            <div className="text-right shrink-0">
              <span className="text-base sm:text-lg font-bold text-foreground">
                ${item.price.toFixed(2)}
              </span>
              <span className="text-[10px] text-muted-foreground ml-1">
                {isAudioItem ? "one-time" : "/ yr"}
              </span>
            </div>
          </div>

          <div className="min-w-0 space-y-0.5 pt-0.5">
            <p className="text-sm font-semibold text-foreground truncate">
              {item.title}
            </p>
            <p className="text-[11px] text-muted-foreground leading-normal">
              {isAudioItem
                ? "Instant MP3/WAV download & lifetime streaming"
                : "All current and upcoming 4K studio videos included"}
            </p>
          </div>
        </div>

        <div className="space-y-1.5 py-1 text-xs text-muted-foreground">
          <div className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-tight">
              {isAudioItem
                ? "Instant lifetime access immediately upon checkout"
                : "Instant 1-year access to all 4K videos upon checkout"}
            </span>
          </div>
          <div className="flex items-start gap-2">
            <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
            <span className="leading-tight">Encrypted 256-bit secure transaction</span>
          </div>
        </div>

        <div className="space-y-2 pt-2.5 sm:pt-3 border-t border-border/60">
          <Button
            type="button"
            variant="default"
            size="lg"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment("apple")}
            className="w-full h-10 sm:h-11 bg-foreground text-background hover:bg-foreground/90 font-medium text-xs sm:text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer"
          >
            {isProcessing && activePaymentMethod === "apple" ? (
              <>
                <Loader2 className="size-4 animate-spin shrink-0" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaApple className="size-4 shrink-0" />
                <span className="truncate">{appleButtonLabel}</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="lg"
            disabled={isProcessing}
            onClick={() => handleSimulatePayment("google")}
            className="w-full h-10 sm:h-11 border-border/80 hover:bg-muted font-medium text-xs sm:text-sm flex items-center justify-center gap-2 rounded-lg cursor-pointer"
          >
            {isProcessing && activePaymentMethod === "google" ? (
              <>
                <Loader2 className="size-4 animate-spin shrink-0" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <FaGoogle className="size-4 shrink-0" />
                <span className="truncate">{googleButtonLabel}</span>
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
