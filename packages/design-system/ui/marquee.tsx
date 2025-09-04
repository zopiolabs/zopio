/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const marqueeVariants = cva("flex w-full overflow-hidden", {
  variants: {
    direction: {
      left: "",
      right: "",
      up: "flex-col",
      down: "flex-col",
    },
    pauseOnHover: {
      true: "[&:hover>div]:pause",
      false: "",
    },
  },
  defaultVariants: {
    direction: "left",
    pauseOnHover: true,
  },
});

interface MarqueeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof marqueeVariants> {
  speed?: number;
  gap?: number;
  fade?: boolean;
  reverse?: boolean;
  vertical?: boolean;
  repeat?: number;
}

const Marquee = React.forwardRef<HTMLDivElement, MarqueeProps>(
  (
    {
      className,
      children,
      direction = "left",
      speed = 4.23,
      gap = 16,
      fade = true,
      reverse = false,
      vertical = false,
      repeat = 2,
      pauseOnHover = true,
      ...props
    },
    ref
  ) => {
    const actualDirection = vertical
      ? reverse
        ? "up"
        : "down"
      : reverse
        ? "right"
        : "left";

    const duration = `${100 / speed}s`;

    const marqueeStyle = {
      "--gap": `${gap}px`,
      "--duration": duration,
    } as React.CSSProperties;

    const getAnimationClass = () => {
      switch (actualDirection) {
        case "left":
          return "animate-marquee-left";
        case "right":
          return "animate-marquee-right";
        case "up":
          return "animate-marquee-up";
        case "down":
          return "animate-marquee-down";
        default:
          return "animate-marquee-left";
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          marqueeVariants({ direction: actualDirection, pauseOnHover }),
          "relative",
          className
        )}
        style={marqueeStyle}
        {...props}
      >
        {/* Fade gradients */}
        {fade && (
          <>
            {vertical ? (
              <>
                <div className="pointer-events-none absolute top-0 z-10 h-8 w-full bg-gradient-to-b from-background to-transparent" />
                <div className="pointer-events-none absolute bottom-0 z-10 h-8 w-full bg-gradient-to-t from-background to-transparent" />
              </>
            ) : (
              <>
                <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-8 bg-gradient-to-r from-background to-transparent" />
                <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-8 bg-gradient-to-l from-background to-transparent" />
              </>
            )}
          </>
        )}

        {/* Marquee content */}
        <div
          className={cn(
            "flex shrink-0",
            vertical ? "flex-col" : "flex-row",
            getAnimationClass()
          )}
          style={{
            gap: `${gap}px`,
            animationDuration: duration,
            animationIterationCount: "infinite",
            animationTimingFunction: "linear",
          }}
        >
          {Array.from({ length: repeat }).map((_, i) => (
            <React.Fragment key={i}>
              {React.Children.map(children, (child, index) => (
                <div
                  key={`${i}-${index}`}
                  className={cn("flex shrink-0", vertical ? "flex-col" : "flex-row")}
                >
                  {child}
                </div>
              ))}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }
);

Marquee.displayName = "Marquee";

export { Marquee, marqueeVariants };
export type { MarqueeProps };
