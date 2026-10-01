"use client"

import { useEffect, useRef } from "react"

export function VideoBackground() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = window.innerWidth)
    let height = (canvas.height = window.innerHeight)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = window.innerWidth
      height = canvas.height = window.innerHeight
    }

    window.addEventListener("resize", handleResize)

    const particles: {
      x: number
      y: number
      radius: number
      speedY: number
      opacity: number
    }[] = []

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * 0.3 + 0.1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      ctx.fillStyle = "rgba(10, 10, 12, 1)"
      ctx.fillRect(0, 0, width, height)

      const gradient = ctx.createRadialGradient(
        width / 2,
        height * 0.3,
        10,
        width / 2,
        height * 0.4,
        Math.max(width, height) * 0.8
      )
      gradient.addColorStop(0, "rgba(28, 28, 35, 0.7)")
      gradient.addColorStop(0.5, "rgba(18, 18, 22, 0.85)")
      gradient.addColorStop(1, "rgba(8, 8, 10, 0.98)")

      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, width, height)

      particles.forEach((p) => {
        p.y -= p.speedY
        if (p.y < 0) {
          p.y = height
          p.x = Math.random() * width
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity * 0.4})`
        ctx.fill()
      })

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      window.removeEventListener("resize", handleResize)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
      <canvas ref={canvasRef} className="absolute inset-0 h-full w-full" />
      <div className="absolute inset-0 bg-radial-[at_center_top] from-transparent via-background/40 to-background/95" />
    </div>
  )
}
