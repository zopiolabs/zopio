/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const qrCodeVariants = cva("inline-block", {
  variants: {
    size: {
      sm: "w-16 h-16",
      md: "w-24 h-24",
      lg: "w-32 h-32",
      xl: "w-48 h-48",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

type ErrorCorrectionLevel = "L" | "M" | "Q" | "H";

interface QRCodeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof qrCodeVariants> {
  value: string;
  size?: "sm" | "md" | "lg" | "xl";
  foregroundColor?: string;
  backgroundColor?: string;
  errorCorrectionLevel?: ErrorCorrectionLevel;
  margin?: number;
  includeMargin?: boolean;
}

// Simple QR code generation using a data URL approach
// This is a simplified implementation that creates a basic QR pattern
const generateQRCodeSVG = (
  value: string,
  options: {
    foregroundColor: string;
    backgroundColor: string;
    errorCorrectionLevel: ErrorCorrectionLevel;
    margin: number;
  }
): string => {
  // This is a simplified QR code generator for demo purposes
  // In a real implementation, you would use a proper QR code library
  const size = 21; // Standard QR code size for version 1
  const cellSize = 10;
  const totalSize = size * cellSize + options.margin * 2;

  // Create a simple pattern based on the input value
  const pattern: boolean[][] = [];
  for (let i = 0; i < size; i++) {
    pattern[i] = [];
    for (let j = 0; j < size; j++) {
      // Create a pseudo-random pattern based on value and position
      const hash = value.charCodeAt((i + j) % value.length) + i * j;
      pattern[i][j] = hash % 2 === 0;
    }
  }

  // Add finder patterns (corners)
  const addFinderPattern = (startRow: number, startCol: number) => {
    for (let i = 0; i < 7; i++) {
      for (let j = 0; j < 7; j++) {
        if (
          (i === 0 || i === 6 || j === 0 || j === 6) ||
          (i >= 2 && i <= 4 && j >= 2 && j <= 4)
        ) {
          if (startRow + i < size && startCol + j < size) {
            pattern[startRow + i][startCol + j] = true;
          }
        } else {
          if (startRow + i < size && startCol + j < size) {
            pattern[startRow + i][startCol + j] = false;
          }
        }
      }
    }
  };

  addFinderPattern(0, 0); // Top-left
  addFinderPattern(0, size - 7); // Top-right
  addFinderPattern(size - 7, 0); // Bottom-left

  // Generate SVG
  let svg = `<svg width="${totalSize}" height="${totalSize}" viewBox="0 0 ${totalSize} ${totalSize}" xmlns="http://www.w3.org/2000/svg">`;
  svg += `<rect width="${totalSize}" height="${totalSize}" fill="${options.backgroundColor}"/>`;

  for (let i = 0; i < size; i++) {
    for (let j = 0; j < size; j++) {
      if (pattern[i][j]) {
        const x = j * cellSize + options.margin;
        const y = i * cellSize + options.margin;
        svg += `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${options.foregroundColor}"/>`;
      }
    }
  }

  svg += "</svg>";
  return svg;
};

const QRCode = React.forwardRef<HTMLDivElement, QRCodeProps>(
  (
    {
      className,
      size,
      value,
      foregroundColor,
      backgroundColor,
      errorCorrectionLevel = "M",
      margin = 20,
      includeMargin = true,
      ...props
    },
    ref
  ) => {
    const [svgContent, setSvgContent] = React.useState<string>("");

    // Get CSS custom properties for colors
    const getForegroundColor = (): string => {
      if (foregroundColor) return foregroundColor;
      if (typeof window !== "undefined") {
        const style = getComputedStyle(document.documentElement);
        const hsl = style.getPropertyValue("--foreground").trim();
        if (hsl) {
          // Convert HSL to hex (simplified)
          return "hsl(" + hsl + ")";
        }
      }
      return "#000000";
    };

    const getBackgroundColor = (): string => {
      if (backgroundColor) return backgroundColor;
      if (typeof window !== "undefined") {
        const style = getComputedStyle(document.documentElement);
        const hsl = style.getPropertyValue("--background").trim();
        if (hsl) {
          // Convert HSL to hex (simplified)
          return "hsl(" + hsl + ")";
        }
      }
      return "#ffffff";
    };

    React.useEffect(() => {
      const fg = getForegroundColor();
      const bg = getBackgroundColor();

      const svg = generateQRCodeSVG(value, {
        foregroundColor: fg,
        backgroundColor: bg,
        errorCorrectionLevel,
        margin: includeMargin ? margin : 0,
      });

      setSvgContent(svg);
    }, [value, foregroundColor, backgroundColor, errorCorrectionLevel, margin, includeMargin]);

    if (!svgContent) {
      return (
        <div
          ref={ref}
          className={cn(qrCodeVariants({ size, className }))}
          {...props}
        >
          <div className="flex h-full w-full items-center justify-center bg-muted">
            <span className="text-xs text-muted-foreground">Loading...</span>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(qrCodeVariants({ size, className }))}
        {...props}
      >
        <div
          className="h-full w-full"
          dangerouslySetInnerHTML={{ __html: svgContent }}
        />
      </div>
    );
  }
);

QRCode.displayName = "QRCode";

// Server-side component version
interface QRCodeServerProps extends Omit<QRCodeProps, "foregroundColor" | "backgroundColor"> {
  foregroundColor: string;
  backgroundColor: string;
}

const QRCodeServer: React.FC<QRCodeServerProps> = ({
  className,
  size,
  value,
  foregroundColor,
  backgroundColor,
  errorCorrectionLevel = "M",
  margin = 20,
  includeMargin = true,
  ...props
}) => {
  const svgContent = generateQRCodeSVG(value, {
    foregroundColor,
    backgroundColor,
    errorCorrectionLevel,
    margin: includeMargin ? margin : 0,
  });

  return (
    <div
      className={cn(qrCodeVariants({ size, className }))}
      {...props}
    >
      <div
        className="h-full w-full"
        dangerouslySetInnerHTML={{ __html: svgContent }}
      />
    </div>
  );
};

QRCodeServer.displayName = "QRCodeServer";

export { QRCode, QRCodeServer, qrCodeVariants };
export type { QRCodeProps, QRCodeServerProps, ErrorCorrectionLevel };
