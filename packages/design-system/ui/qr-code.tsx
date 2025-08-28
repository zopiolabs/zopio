/**
 * SPDX-License-Identifier: MIT
 */

"use client"

import { useEffect, useRef } from "react"
import { cn } from "@repo/design-system/lib/utils"

interface QRCodeProps {
  /**
   * The text or URL to encode in the QR code
   */
  value: string
  /**
   * Size of the QR code in pixels
   * @default 200
   */
  size?: number
  /**
   * Background color of the QR code
   * @default "#ffffff"
   */
  bgColor?: string
  /**
   * Foreground color of the QR code
   * @default "#000000"
   */
  fgColor?: string
  /**
   * Error correction level
   * @default "M"
   */
  level?: "L" | "M" | "Q" | "H"
  /**
   * Additional CSS classes
   */
  className?: string
  /**
   * Whether to include a margin around the QR code
   * @default true
   */
  includeMargin?: boolean
}

export function QRCode({
  value,
  size = 200,
  bgColor = "#ffffff",
  fgColor = "#000000",
  level = "M",
  className,
  includeMargin = true,
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const generateQR = async () => {
      if (!canvasRef.current || !value) return

      try {
        // Dynamic import to avoid SSR issues
        const QRCodeLib = await import("qrcode")

        const canvas = canvasRef.current
        const options = {
          errorCorrectionLevel: level,
          type: "image/png" as const,
          quality: 0.92,
          margin: includeMargin ? 1 : 0,
          color: {
            dark: fgColor,
            light: bgColor,
          },
          width: size,
        }

        await QRCodeLib.toCanvas(canvas, value, options)
      } catch (error) {
        console.error("Error generating QR code:", error)
      }
    }

    generateQR()
  }, [value, size, bgColor, fgColor, level, includeMargin])

  if (!value) {
    return (
      <div
        className={cn("flex items-center justify-center bg-gray-100 text-gray-500 text-sm", className)}
        style={{ width: size, height: size }}
      >
        No data provided
      </div>
    )
  }

  return (
    <canvas
      ref={canvasRef}
      className={cn("border border-gray-200 rounded", className)}
      style={{ maxWidth: "100%", height: "auto" }}
    />
  )
}
