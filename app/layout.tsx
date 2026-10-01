import type { Metadata } from "next"
import { DM_Sans } from "next/font/google"
import "./globals.css"

const dmSans = DM_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "swagsxn | Creator Vault & Exclusive Media",
  description: "Exclusive songs, music videos, and vault access with yearly & lifetime subscription.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="en"
      className={`${dmSans.variable} dark h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-background text-foreground antialiased font-sans selection:bg-foreground selection:text-background">
        {children}
      </body>
    </html>
  )
}
