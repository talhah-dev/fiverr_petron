"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  Sparkles,
  User,
} from "lucide-react"
import {
  FaYoutube,
  FaInstagram,
  FaTiktok,
  FaSpotify,
  FaEnvelope,
} from "react-icons/fa6"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ProfileAvatar } from "./profile-avatar"
import { UserSubscription } from "./types"

interface HeroHeaderProps {
  subscription: UserSubscription
  isVideoMuted: boolean
  onToggleVideoSound: () => void
  onOpenSubscription: () => void
  onOpenMemberModal: () => void
}

export function HeroHeader({
  subscription,
  isVideoMuted,
  onToggleVideoSound,
  onOpenSubscription,
  onOpenMemberModal,
}: HeroHeaderProps) {
  const [viewCount, setViewCount] = useState(1918)

  useEffect(() => {
    const timer = setInterval(() => {
      setViewCount((prev) => prev + (Math.random() > 0.6 ? 1 : 0))
    }, 4500)
    return () => clearInterval(timer)
  }, [])

  const isSubscribed = subscription.tier !== "free"

  return (
    <header className="relative w-full pt-6 pb-10 px-4 flex flex-col items-center">
      <div className="w-full max-w-2xl flex items-center justify-between mb-8">
        <Button
          variant="outline"
          onClick={onToggleVideoSound}
          aria-label={isVideoMuted ? "Unmute video sound" : "Mute video sound"}
          className="cursor-pointer rounded-full"
        >
          {!isVideoMuted ? (
            <Volume2 className="size-3.5 text-foreground animate-pulse" />
          ) : (
            <VolumeX className="size-3.5 text-muted-foreground" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMemberModal}
              className="gap-1.5 cursor-pointer text-xs"
            >
              <CheckCircle2 className="size-3 text-emerald-500" />
              <span className="capitalize">{subscription.tier} Member</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMemberModal}
              className="gap-1.5 cursor-pointer text-xs"
            >
              <User className="size-3.5 text-muted-foreground" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 max-w-md w-full">
        <div className="flex flex-col items-center">
          <ProfileAvatar size={96} />
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1.5">
              <h1 className="text-2xl font-bold tracking-tight text-foreground">
                swagsxn
              </h1>
              <Badge variant="secondary" className="text-[10px] py-0 px-1.5 h-4">
                PRO
              </Badge>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 py-1">
          <Link
            href="mailto:contact@swagsxn.art"
            aria-label="Email"
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50"
          >
            <FaEnvelope className="size-5" />
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50"
          >
            <FaYoutube className="size-5" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50"
          >
            <FaInstagram className="size-5" />
          </Link>
          <Link
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50"
          >
            <FaTiktok className="size-5" />
          </Link>
          <Link
            href="https://spotify.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Spotify"
            className="p-2.5 rounded-full text-muted-foreground hover:text-foreground transition-all hover:bg-muted/50"
          >
            <FaSpotify className="size-5" />
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground pt-0.5">
          <Eye className="size-3.5" />
          <span className="font-mono">{viewCount.toLocaleString()}</span>
          <span>views</span>
        </div>

        <div className="flex items-center justify-center gap-2.5 pt-2.5 w-full sm:w-auto">
          {!isSubscribed ? (
            <Button
              onClick={onOpenSubscription}
              size="default"
              className="gap-1.5 px-6 font-medium shadow-none cursor-pointer"
            >
              <Sparkles className="size-5" />
              Subscribe & Unlock
            </Button>
          ) : (
            <Button
              variant="outline"
              size="default"
              onClick={onOpenMemberModal}
              className="gap-1.5 px-5 font-medium cursor-pointer"
            >
              <CheckCircle2 className="size-4 text-emerald-500" />
              VIP Access Granted
            </Button>
          )}

          <Button
            variant="outline"
            size="default"
            onClick={() => {
              const el = document.getElementById("media-catalog-section")
              el?.scrollIntoView({ behavior: "smooth" })
            }}
            className="px-4 cursor-pointer"
          >
            Browse Vault
          </Button>
        </div>
      </div>
    </header>
  )
}
