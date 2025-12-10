"use client"

import { useEffect, useRef } from "react"
import { useGSAP } from "@gsap/react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

interface SplitTextProps {
  text: string
  className?: string
  delay?: number
  duration?: number
  ease?: string
  splitType?: "chars" | "words" | "lines"
  from?: Record<string, any>
  to?: Record<string, any>
  threshold?: number
  rootMargin?: string
  textAlign?: "left" | "center" | "right"
  onLetterAnimationComplete?: () => void
  autoPlay?: boolean
}

export default function SplitText({
  text,
  className = "",
  delay = 50,
  duration = 0.6,
  ease = "power3.out",
  splitType = "chars",
  from = { opacity: 0, y: 40 },
  to = { opacity: 1, y: 0 },
  threshold = 0.1,
  rootMargin = "-100px",
  textAlign = "left",
  onLetterAnimationComplete,
  autoPlay = false,
}: SplitTextProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  useGSAP(
    () => {
      if (!containerRef.current) return

      const elements = containerRef.current.querySelectorAll(".split-char, .split-word, .split-line")

      gsap.set(elements, from)

      if (autoPlay) {
        // Play animation immediately on mount
        gsap.to(elements, {
          ...to,
          duration,
          ease,
          stagger: delay / 1000,
          onComplete: () => {
            if (onLetterAnimationComplete) {
              onLetterAnimationComplete()
            }
          },
        })
      } else {
        // Play animation on scroll
        ScrollTrigger.create({
          trigger: containerRef.current,
          start: `top ${threshold * 100}%`,
          once: true,
          onEnter: () => {
            gsap.to(elements, {
              ...to,
              duration,
              ease,
              stagger: delay / 1000,
              onComplete: () => {
                if (onLetterAnimationComplete) {
                  onLetterAnimationComplete()
                }
              },
            })
          },
        })
      }
    },
    { scope: containerRef },
  )

  const splitText = () => {
    if (splitType === "chars") {
      return text.split("").map((char, index) => (
        <span key={index} className="split-char inline-block" style={{ whiteSpace: char === " " ? "pre" : "normal" }}>
          {char}
        </span>
      ))
    } else if (splitType === "words") {
      return text.split(" ").map((word, index) => (
        <span key={index} className="split-word inline-block mr-[0.25em]">
          {word}
        </span>
      ))
    } else {
      // lines
      return text.split("\n").map((line, index) => (
        <span key={index} className="split-line block">
          {line}
        </span>
      ))
    }
  }

  return (
    <div ref={containerRef} className={className} style={{ textAlign }}>
      {splitText()}
    </div>
  )
}
