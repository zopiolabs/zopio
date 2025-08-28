/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@repo/design-system/lib/utils"

interface NumberFlowProps {
  value: number
  duration?: number
  format?: "default" | "currency" | "percentage" | "compact"
  currency?: string
  locale?: string
  className?: string
  prefix?: string
  suffix?: string
  decimalPlaces?: number
  easing?: "linear" | "ease-out" | "ease-in-out"
}

export function NumberFlow({
  value,
  duration = 1000,
  format = "default",
  currency = "USD",
  locale = "en-US",
  className,
  prefix = "",
  suffix = "",
  decimalPlaces,
  easing = "ease-out",
}: NumberFlowProps) {
  const [displayValue, setDisplayValue] = useState(0)
  const animationRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number | undefined>(undefined)
  const startValueRef = useRef<number>(0)

  const formatNumber = (num: number): string => {
    let formatted: string

    switch (format) {
      case "currency":
        formatted = new Intl.NumberFormat(locale, {
          style: "currency",
          currency,
          minimumFractionDigits: decimalPlaces ?? 2,
          maximumFractionDigits: decimalPlaces ?? 2,
        }).format(num)
        break
      case "percentage":
        formatted = new Intl.NumberFormat(locale, {
          style: "percent",
          minimumFractionDigits: decimalPlaces ?? 1,
          maximumFractionDigits: decimalPlaces ?? 1,
        }).format(num / 100)
        break
      case "compact":
        formatted = new Intl.NumberFormat(locale, {
          notation: "compact",
          compactDisplay: "short",
          minimumFractionDigits: decimalPlaces ?? 0,
          maximumFractionDigits: decimalPlaces ?? 1,
        }).format(num)
        break
      default:
        formatted = new Intl.NumberFormat(locale, {
          minimumFractionDigits: decimalPlaces ?? 0,
          maximumFractionDigits: decimalPlaces ?? 2,
        }).format(num)
    }

    return `${prefix}${formatted}${suffix}`
  }

  const getEasingFunction = (t: number): number => {
    switch (easing) {
      case "linear":
        return t
      case "ease-out":
        return 1 - Math.pow(1 - t, 3)
      case "ease-in-out":
        return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
      default:
        return t
    }
  }

  const animate = (timestamp: number) => {
    if (!startTimeRef.current) {
      startTimeRef.current = timestamp
    }

    const elapsed = timestamp - startTimeRef.current
    const progress = Math.min(elapsed / duration, 1)
    const easedProgress = getEasingFunction(progress)

    const currentValue = startValueRef.current + (value - startValueRef.current) * easedProgress
    setDisplayValue(currentValue)

    if (progress < 1) {
      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    startTimeRef.current = undefined
    startValueRef.current = displayValue
    animationRef.current = requestAnimationFrame(animate)

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [value, duration, easing])

  useEffect(() => {
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  return <span className={cn("font-mono tabular-nums", className)}>{formatNumber(displayValue)}</span>
}
