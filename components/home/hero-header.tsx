"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  Volume2,
  VolumeX,
  Eye,
  CheckCircle2,
  User,
  ChevronDown,
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
  onOpenMemberModal: () => void
}

export function HeroHeader({
  subscription,
  isVideoMuted,
  onToggleVideoSound,
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
    <header className="relative w-full min-h-[100dvh] flex flex-col justify-between items-center px-4 pt-6 pb-6 z-10">
      <div className="w-full max-w-2xl flex items-center justify-between">
        <Button
          variant="outline"
          onClick={onToggleVideoSound}
          aria-label={isVideoMuted ? "Unmute video sound" : "Mute video sound"}
          className="cursor-pointer rounded-full bg-black/40 hover:bg-black/60 border-white/20 text-white backdrop-blur-md shadow-xs"
        >
          {!isVideoMuted ? (
            <Volume2 className="size-3.5 text-white animate-pulse" />
          ) : (
            <VolumeX className="size-3.5 text-white/70" />
          )}
        </Button>

        <div className="flex items-center gap-2">
          {isSubscribed ? (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMemberModal}
              className="gap-1.5 cursor-pointer text-xs rounded-full bg-black/40 hover:bg-black/60 border-white/20 text-white backdrop-blur-md shadow-xs"
            >
              <CheckCircle2 className="size-3 text-emerald-400" />
              <span className="capitalize">{subscription.tier} Member</span>
            </Button>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenMemberModal}
              className="gap-1.5 cursor-pointer text-xs rounded-full bg-black/40 hover:bg-black/60 border-white/20 text-white backdrop-blur-md shadow-xs"
            >
              <User className="size-3.5 text-white/80" />
              <span>Sign In</span>
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col items-center text-center space-y-4 max-w-md w-full">
        <ProfileAvatar size={96} />

        <div className="space-y-1">
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
              swagsxn
            </h1>
            <Badge
              variant="secondary"
              className="text-[10px] py-0 px-1.5 h-4 bg-white/20 text-white border-none backdrop-blur-sm"
            >
              PRO
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2.5 py-1">
          <Link
            href="mailto:contact@swagsxn.art"
            aria-label="Email"
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md"
          >
            <FaEnvelope className="size-4" />
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            aria-label="YouTube"
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md"
          >
            <FaYoutube className="size-4" />
          </Link>
          <Link
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Instagram"
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md"
          >
            <FaInstagram className="size-4" />
          </Link>
          <Link
            href="https://tiktok.com"
            target="_blank"
            rel="noreferrer"
            aria-label="TikTok"
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md"
          >
            <FaTiktok className="size-4" />
          </Link>
          <Link
            href="https://spotify.com"
            target="_blank"
            rel="noreferrer"
            aria-label="Spotify"
            className="p-2.5 rounded-full bg-black/40 hover:bg-black/60 border border-white/15 text-white/90 hover:text-white transition-all backdrop-blur-md"
          >
            <FaSpotify className="size-4" />
          </Link>
        </div>

        <div className="flex items-center gap-1.5 text-xs text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 drop-shadow-sm">
          <Eye className="size-3.5" />
          <span className="font-mono">{viewCount.toLocaleString()}</span>
          <span>views</span>
        </div>
      </div>

      <button
        onClick={() => {
          const el = document.getElementById("media-catalog-section")
          el?.scrollIntoView({ behavior: "smooth" })
        }}
        className="group flex flex-col items-center gap-1.5 text-xs text-white/80 hover:text-white transition-colors cursor-pointer pb-2"
      >
        <span className="font-medium tracking-wide drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]">
          Scroll to unlock vault
        </span>
        <ChevronDown className="size-4 animate-bounce text-white/70 group-hover:text-white drop-shadow-[0_1px_3px_rgba(0,0,0,0.9)]" />
      </button>
    </header>
  )
}

