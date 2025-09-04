/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cn } from "../lib/utils";

interface CursorProps {
  x: number;
  y: number;
  color?: string;
  name?: string;
  message?: string;
  className?: string;
}

const Cursor = React.forwardRef<HTMLDivElement, CursorProps>(
  ({ x, y, color = "#3b82f6", name, message, className }, ref) => {
    // Generate contrasting text color based on background color
    const getContrastColor = (hexColor: string) => {
      const r = parseInt(hexColor.slice(1, 3), 16);
      const g = parseInt(hexColor.slice(3, 5), 16);
      const b = parseInt(hexColor.slice(5, 7), 16);
      const brightness = (r * 299 + g * 587 + b * 114) / 1000;
      return brightness > 128 ? "#000000" : "#ffffff";
    };

    const textColor = getContrastColor(color);

    return (
      <div
        ref={ref}
        className={cn("pointer-events-none fixed z-50", className)}
        style={{
          left: x,
          top: y,
          transform: "translate(-50%, -50%)",
        }}
        role="img"
        aria-label={`Cursor${name ? ` for ${name}` : ""}${
          message ? ` with message: ${message}` : ""
        }`}
      >
        {/* Cursor pointer */}
        <div className="relative">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-sm"
          >
            <path
              d="M2 2L18 8L8 10L6 18L2 2Z"
              fill={color}
              stroke="white"
              strokeWidth="1"
              strokeLinejoin="round"
            />
          </svg>

          {/* Name and message tooltip */}
          {(name || message) && (
            <div
              className="absolute left-5 top-2 min-w-max rounded-md px-2 py-1 text-xs font-medium shadow-lg"
              style={{
                backgroundColor: color,
                color: textColor,
              }}
            >
              {name && <div className="font-semibold">{name}</div>}
              {message && (
                <div className={cn("text-xs", name && "mt-0.5 opacity-90")}>
                  {message}
                </div>
              )}
              {/* Tooltip arrow */}
              <div
                className="absolute left-0 top-2 h-0 w-0 -translate-x-1"
                style={{
                  borderTop: "4px solid transparent",
                  borderBottom: "4px solid transparent",
                  borderRight: `4px solid ${color}`,
                }}
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

Cursor.displayName = "Cursor";

export { Cursor };
export type { CursorProps };
