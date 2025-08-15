/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { motion, useSpring, useTransform } from "framer-motion";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";

const numberFlowVariants = cva(
  "inline-block tabular-nums",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        destructive: "text-destructive",
        success: "text-green-600 dark:text-green-400",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
      },
      weight: {
        normal: "font-normal",
        medium: "font-medium",
        semibold: "font-semibold",
        bold: "font-bold",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
      weight: "normal",
    },
  }
);

export interface NumberFlowProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof numberFlowVariants> {
  value: number;
  format?: Intl.NumberFormatOptions;
  locale?: string;
  transformTiming?: {
    duration?: number;
    easing?: string;
  };
  trend?: "up" | "down" | "neutral";
  continuous?: boolean;
  willChange?: boolean;
  prefix?: string;
  suffix?: string;
}

const NumberFlow = React.forwardRef<HTMLSpanElement, NumberFlowProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      value,
      format,
      locale = "en-US",
      transformTiming = { duration: 750, easing: "ease-out" },
      trend,
      continuous = false,
      willChange = false,
      prefix = "",
      suffix = "",
      ...props
    },
    ref
  ) => {
    const [displayValue, setDisplayValue] = React.useState(value);
    const springValue = useSpring(value, {
      stiffness: 100,
      damping: 30,
      mass: 1,
    });

    // Format number using Intl.NumberFormat
    const formatNumber = React.useCallback(
      (num: number) => {
        try {
          const formatter = new Intl.NumberFormat(locale, format);
          return formatter.format(num);
        } catch {
          return num.toString();
        }
      },
      [locale, format]
    );

    // Update spring value when value changes
    React.useEffect(() => {
      springValue.set(value);
    }, [value, springValue]);

    // Transform spring value to display value
    const transformedValue = useTransform(springValue, (latest) => {
      if (continuous) {
        return formatNumber(latest);
      }
      // For discrete updates, round to nearest integer for counting effect
      const rounded = Math.round(latest);
      return formatNumber(rounded);
    });

    // Update display value from transformed value
    React.useEffect(() => {
      const unsubscribe = transformedValue.on("change", (latest) => {
        setDisplayValue(latest as any);
      });
      return unsubscribe;
    }, [transformedValue]);

    // Determine trend color classes
    const getTrendClasses = () => {
      switch (trend) {
        case "up":
          return "text-green-600 dark:text-green-400";
        case "down":
          return "text-red-600 dark:text-red-400";
        case "neutral":
        default:
          return "";
      }
    };

    // Check for reduced motion preference
    const prefersReducedMotion = React.useMemo(() => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    return (
      <motion.span
        ref={ref}
        className={cn(
          numberFlowVariants({ variant, size, weight }),
          getTrendClasses(),
          className
        )}
        style={{
          willChange: willChange ? "transform" : "auto",
        }}
        initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
        animate={prefersReducedMotion ? false : { opacity: 1, scale: 1 }}
        transition={
          prefersReducedMotion
            ? { duration: 0 }
            : {
                duration: (transformTiming.duration || 750) / 1000,
                ease: "easeOut",
              }
        }
        role="status"
        aria-live="polite"
        aria-label={`${prefix}${formatNumber(value)}${suffix}`}
        {...(props as any)}
      >
        {prefix}
        {prefersReducedMotion ? formatNumber(value) : displayValue}
        {suffix}
      </motion.span>
    );
  }
);

NumberFlow.displayName = "NumberFlow";

export { NumberFlow, numberFlowVariants };
