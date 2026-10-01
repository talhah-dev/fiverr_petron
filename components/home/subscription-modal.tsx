"use client"

import { useState } from "react"
import { Check, Loader2 } from "lucide-react"
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
import { SubscriptionTier } from "./types"

interface SubscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccessfulSubscription: (tier: SubscriptionTier, email: string) => void
}

export function SubscriptionModal({
  isOpen,
  onClose,
  onSuccessfulSubscription,
}: SubscriptionModalProps) {
  const [selectedTier, setSelectedTier] = useState<"yearly" | "lifetime">("yearly")
  const [isProcessing, setIsProcessing] = useState(false)
  const [activePaymentMethod, setActivePaymentMethod] = useState<string | null>(null)

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
      onSuccessfulSubscription(selectedTier, mockEmail)
      onClose()
    }, 1200)
  }

  const yearlyPerks = [
    "Full access to all songs & 4K videos",
    "Active for 365 days, cancel anytime",
  ]

  const lifetimePerks = [
    "Lifetime VIP access to all songs & videos",
    "All future releases included, never pay again",
  ]

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md p-6 bg-card border-border/80 shadow-lg">
        <DialogHeader className="space-y-1 text-left">
          <DialogTitle className="text-xl font-bold tracking-tight">
            Unlock Creator Vault
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Instant streaming access to all unreleased songs and videos.
          </DialogDescription>
        </DialogHeader>

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
                Popular
              </Badge>
            </div>
            <div className="mt-2">
              <span className="text-xl font-bold text-foreground">$29</span>
              <span className="text-xs text-muted-foreground"> / year</span>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Billed annually
            </p>
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
            <p className="text-[11px] text-muted-foreground mt-1">
              Permanent access
            </p>
          </button>
        </div>

        <div className="space-y-1.5 py-1">
          <p className="text-xs font-medium text-foreground">
            What is included:
          </p>
          {(selectedTier === "yearly" ? yearlyPerks : lifetimePerks).map(
            (perk, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2 text-xs text-muted-foreground"
              >
                <Check className="size-3.5 text-emerald-500 shrink-0 mt-0.5" />
                <span>{perk}</span>
              </div>
            )
          )}
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

        <p className="pt-2 text-[11px] text-muted-foreground/80 text-center">
          Account created automatically with payment email
        </p>
      </DialogContent>
    </Dialog>
  )
}
