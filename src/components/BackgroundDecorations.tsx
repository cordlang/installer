"use client"

import type React from "react"
import { useEffect, useState } from "react"

const BackgroundDecorations: React.FC = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  })

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      })
    }

    window.addEventListener("resize", handleResize)
    return () => {
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  // Generar formas geométricas
  const shapes = [
    {
      className: "bg-shape-pink",
      style: {
        width: windowSize.width < 768 ? "120px" : "200px",
        height: windowSize.width < 768 ? "120px" : "200px",
        top: "5%",
        right: "-50px",
        animationDelay: "0s",
      },
    },
    {
      className: "bg-shape-blue",
      style: {
        width: windowSize.width < 768 ? "150px" : "250px",
        height: windowSize.width < 768 ? "150px" : "250px",
        bottom: "-80px",
        left: "10%",
        animationDelay: "-5s",
      },
    },
    {
      className: "bg-shape-yellow",
      style: {
        width: windowSize.width < 768 ? "100px" : "180px",
        height: windowSize.width < 768 ? "100px" : "180px",
        top: "30%",
        left: "-50px",
        animationDelay: "-10s",
      },
    },
    {
      className: "bg-shape-green",
      style: {
        width: windowSize.width < 768 ? "80px" : "150px",
        height: windowSize.width < 768 ? "80px" : "150px",
        bottom: "15%",
        right: "5%",
        animationDelay: "-7s",
      },
    },
  ]

  // Generar burbujas
  const generateBubbles = () => {
    const bubbleCount = Math.min(12, Math.max(5, Math.floor((windowSize.width * windowSize.height) / 50000)))
    const bubbleColors = ["bg-bubble-blue", "bg-bubble-pink", "bg-bubble-green", "bg-bubble-yellow", "bg-bubble-purple"]

    return Array.from({ length: bubbleCount }).map((_, index) => {
      const size = Math.max(50, Math.min(200, 50 + Math.random() * 150))
      const left = `${Math.random() * 100}%`
      const top = `${Math.random() * 100}%`
      const duration = 15 + Math.random() * 15
      const delay = Math.random() * 5
      const colorClass = bubbleColors[Math.floor(Math.random() * bubbleColors.length)]

      return (
        <div
          key={`bubble-${index}`}
          className={`absolute rounded-full blur-md opacity-15 animate-float ${colorClass}`}
          style={{
            width: `${size}px`,
            height: `${size}px`,
            left,
            top,
            animationDuration: `${duration}s`,
            animationDelay: `${delay}s`,
          }}
        />
      )
    })
  }

  return (
    <>
      {/* Formas geométricas */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {shapes.map((shape, index) => (
          <div
            key={`shape-${index}`}
            className={`absolute rounded-full blur-md opacity-15 animate-float-shape ${shape.className}`}
            style={shape.style}
          />
        ))}
      </div>

      {/* Burbujas animadas */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">{generateBubbles()}</div>

      {/* Líneas de cuadrícula */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]">
        <div
          className="w-full h-full border border-light-primary"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--color-light-tertiary) 1px, transparent 1px), linear-gradient(to bottom, var(--color-light-tertiary) 1px, transparent 1px)",
            backgroundSize: "20px 20px",
          }}
        ></div>
      </div>
    </>
  )
}

export default BackgroundDecorations

