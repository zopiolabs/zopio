/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";

const wordRevealVariants = cva(
  "inline-block",
  {
    variants: {
      variant: {
        default: "text-foreground",
        muted: "text-muted-foreground",
        accent: "text-accent-foreground",
        primary: "text-primary",
        secondary: "text-secondary-foreground",
      },
      size: {
        sm: "text-sm",
        default: "text-base",
        lg: "text-lg",
        xl: "text-xl",
        "2xl": "text-2xl",
        "3xl": "text-3xl",
        "4xl": "text-4xl",
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

export interface WordRevealProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof wordRevealVariants> {
  text: string;
  delay?: number;
  duration?: number;
  stagger?: number;
  blur?: boolean;
  once?: boolean;
}

const WordReveal = React.forwardRef<HTMLDivElement, WordRevealProps>(
  (
    {
      className,
      variant,
      size,
      weight,
      text,
      delay = 0.1,
      duration = 0.6,
      stagger = 0.1,
      blur = true,
      once = true,
      ...props
    },
    ref
  ) => {
    const [isMounted, setIsMounted] = React.useState(false);
    const animationRef = React.useRef<HTMLDivElement>(null);
    const words = text.split(" ");

    // Ensure component is mounted before animating
    React.useEffect(() => {
      setIsMounted(true);
      return () => {
        setIsMounted(false);
        // Cancel any pending animations
        if (animationRef.current) {
          const element = animationRef.current;
          element.getAnimations?.().forEach(animation => {
            animation.cancel();
          });
        }
      };
    }, []);

    // Container animation variants
    const containerVariants = React.useMemo(() => ({
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: stagger,
          delayChildren: delay,
          when: "beforeChildren",
        },
      },
    }), [stagger, delay]);

    // Word animation variants
    const wordVariants = React.useMemo(() => ({
      hidden: {
        opacity: 0,
        y: 20,
        filter: blur ? "blur(8px)" : "blur(0px)",
      },
      visible: {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
      },
    }), [blur]);

    const transition = React.useMemo(() => ({
      duration,
      ease: "easeOut" as const,
      type: "tween" as const,
    }), [duration]);

    // Check for reduced motion preference
    const prefersReducedMotion = React.useMemo(() => {
      if (typeof window === "undefined") return false;
      return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    }, []);

    // If reduced motion is preferred or not mounted, show text immediately
    if (prefersReducedMotion || !isMounted) {
      return (
        <div
          ref={ref}
          className={cn(wordRevealVariants({ variant, size, weight }), className)}
          {...props}
        >
          {text}
        </div>
      );
    }

    return (
      <motion.div
        ref={(node) => {
          animationRef.current = node;
          if (typeof ref === 'function') {
            ref(node);
          } else if (ref) {
            ref.current = node;
          }
        }}
        className={cn(wordRevealVariants({ variant, size, weight }), className)}
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once, margin: "-50px", amount: 0.1 }}
        onAnimationComplete={() => {
          // Animation completed successfully
        }}
        {...(props as any)}
      >
        {words.map((word, index) => (
          <motion.span
            key={`${word}-${index}`}
            variants={wordVariants}
            transition={transition}
            className="inline-block mr-1 last:mr-0"
            style={{ willChange: "transform, opacity, filter" }}
          >
            {word}
          </motion.span>
        ))}
      </motion.div>
    );
  }
);

WordReveal.displayName = "WordReveal";

export { WordReveal, wordRevealVariants };
