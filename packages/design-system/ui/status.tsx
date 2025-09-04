/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const statusVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium",
  {
    variants: {
      variant: {
        operational: "bg-green-50 text-green-700 border border-green-200",
        degraded: "bg-yellow-50 text-yellow-700 border border-yellow-200",
        partial: "bg-orange-50 text-orange-700 border border-orange-200",
        outage: "bg-red-50 text-red-700 border border-red-200",
        maintenance: "bg-blue-50 text-blue-700 border border-blue-200",
        unknown: "bg-gray-50 text-gray-700 border border-gray-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "operational",
      size: "md",
    },
  }
);

const indicatorVariants = cva("rounded-full", {
  variants: {
    variant: {
      operational: "bg-green-500",
      degraded: "bg-yellow-500",
      partial: "bg-orange-500",
      outage: "bg-red-500",
      maintenance: "bg-blue-500",
      unknown: "bg-gray-500",
    },
    size: {
      sm: "h-2 w-2",
      md: "h-2.5 w-2.5",
      lg: "h-3 w-3",
    },
    animated: {
      true: "animate-pulse",
      false: "",
    },
  },
  defaultVariants: {
    variant: "operational",
    size: "md",
    animated: false,
  },
});

interface StatusProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof statusVariants> {
  label?: string;
  animated?: boolean;
  showIndicator?: boolean;
}

const Status = React.forwardRef<HTMLDivElement, StatusProps>(
  (
    {
      className,
      variant,
      size,
      label,
      animated = false,
      showIndicator = true,
      children,
      ...props
    },
    ref
  ) => {
    const getDefaultLabel = (variant: string) => {
      switch (variant) {
        case "operational":
          return "Operational";
        case "degraded":
          return "Degraded Performance";
        case "partial":
          return "Partial Outage";
        case "outage":
          return "Major Outage";
        case "maintenance":
          return "Under Maintenance";
        case "unknown":
        default:
          return "Unknown";
      }
    };

    const displayLabel = label || getDefaultLabel(variant || "operational");

    return (
      <div
        ref={ref}
        className={cn(statusVariants({ variant, size, className }))}
        role="status"
        aria-label={`Service status: ${displayLabel}`}
        {...props}
      >
        {showIndicator && (
          <div className="relative">
            <div
              className={cn(
                indicatorVariants({ variant, size, animated: false })
              )}
            />
            {animated && (
              <div
                className={cn(
                  indicatorVariants({ variant, size, animated: false }),
                  "absolute inset-0 animate-ping"
                )}
              />
            )}
          </div>
        )}
        <span>{children || displayLabel}</span>
      </div>
    );
  }
);

Status.displayName = "Status";

export { Status, statusVariants };
export type { StatusProps };
