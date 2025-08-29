/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence, type Variants } from "framer-motion";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";
import { Button, type ButtonProps } from "./button";

const timelineVariants = cva("relative space-y-8", {
  variants: {
    variant: {
      default: "",
      minimal: "",
    },
  },
  defaultVariants: {
    variant: "default",
  },
});

export interface TimelineItem {
  date: string;
  title: string;
  description: string;
  href?: string;
  icon?: React.ReactNode;
}

export interface TimelineProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof timelineVariants> {
  items: TimelineItem[];
  initialCount?: number;
  showMoreText?: string;
  showLessText?: string;
  dotClassName?: string;
  lineClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  dateClassName?: string;
  buttonVariant?: ButtonProps["variant"];
  buttonSize?: ButtonProps["size"];
  animationDuration?: number;
  animationDelay?: number;
  showAnimation?: boolean;
}

const Timeline = React.forwardRef<HTMLDivElement, TimelineProps>(
  (
    {
      className,
      variant,
      items,
      initialCount = 5,
      showMoreText = "Show More",
      showLessText = "Show Less",
      dotClassName,
      lineClassName,
      titleClassName,
      descriptionClassName,
      dateClassName,
      buttonVariant = "ghost",
      buttonSize = "sm",
      animationDuration = 0.3,
      animationDelay = 0.1,
      showAnimation = true,
      ...props
    },
    ref
  ) => {
    const [showAll, setShowAll] = React.useState(false);
    const [visibleItems] = React.useState(initialCount);
    const [isMounted, setIsMounted] = React.useState(false);

    // Ensure component is mounted before showing animations
    React.useEffect(() => {
      setIsMounted(true);
      return () => setIsMounted(false);
    }, []);

    // Sort items by date (newest first)
    const sortedItems = React.useMemo(() => {
      return [...items].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    }, [items]);

    const displayedItems = showAll
      ? sortedItems
      : sortedItems.slice(0, visibleItems);

    const hasMoreItems = sortedItems.length > visibleItems;

    const toggleShowAll = () => {
      setShowAll((s) => !s);
    };

    // Use a cubic-bezier tuple for ease (TypeScript-safe Easing)
    // This approximates an "easeOut" feel.
    const ease: [number, number, number, number] = [0.16, 1, 0.3, 1];

    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: animationDelay,
        },
      },
    };

    const itemVariants: Variants = {
      hidden: {
        opacity: 0,
        x: -20,
        scale: 0.95,
      },
      visible: {
        opacity: 1,
        x: 0,
        scale: 1,
        transition: {
          duration: animationDuration,
          ease, // tuple satisfies Easing type
        },
      },
      exit: {
        opacity: 0,
        x: -20,
        scale: 0.95,
        transition: {
          duration: animationDuration * 0.5,
        },
      },
    };

    return (
      <div
        ref={ref}
        className={cn(timelineVariants({ variant }), className)}
        {...props}
      >
        <motion.div
          variants={showAnimation && isMounted ? containerVariants : undefined}
          initial={showAnimation && isMounted ? "hidden" : undefined}
          animate={showAnimation && isMounted ? "visible" : undefined}
          className="space-y-8"
        >
          <AnimatePresence mode="popLayout">
            {displayedItems.map((item, index) => {
              const isLast = index === displayedItems.length - 1;
              const itemKey = `timeline-item-${item.date}-${item.title.replace(/\s+/g, '-').toLowerCase()}`;

              return (
                <motion.div
                  key={itemKey}
                  variants={showAnimation ? itemVariants : undefined}
                  initial={showAnimation ? "hidden" : undefined}
                  animate={showAnimation ? "visible" : undefined}
                  exit={showAnimation ? "exit" : undefined}
                  className="group relative flex gap-4"
                >
                  {/* Timeline line */}
                  {!isLast && (
                    <div
                      className={cn(
                        "absolute left-2 top-8 h-full w-px bg-border",
                        lineClassName
                      )}
                    />
                  )}

                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "relative z-10 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-background ring-2 ring-border",
                      dotClassName
                    )}
                  >
                    {item.icon && (
                      <div className="flex h-3 w-3 items-center justify-center">
                        {item.icon}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2 pb-8">
                    <div className="flex flex-col gap-1">
                      <time
                        dateTime={item.date}
                        className={cn(
                          "text-xs text-muted-foreground",
                          dateClassName
                        )}
                      >
                        {new Date(item.date).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </time>

                      {item.href ? (
                        <a
                          href={item.href}
                          className={cn(
                            "font-medium text-foreground transition-colors hover:text-primary",
                            titleClassName
                          )}
                        >
                          {item.title}
                        </a>
                      ) : (
                        <h3
                          className={cn("font-medium text-foreground", titleClassName)}
                        >
                          {item.title}
                        </h3>
                      )}
                    </div>

                    <p
                      className={cn(
                        "text-sm text-muted-foreground",
                        descriptionClassName
                      )}
                    >
                      {item.description}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>

        {/* Show More/Less Button */}
        {hasMoreItems && (
          <motion.div
            initial={showAnimation ? { opacity: 0, y: 10 } : undefined}
            animate={showAnimation ? { opacity: 1, y: 0 } : undefined}
            transition={showAnimation ? { delay: 0.2, duration: animationDuration } : undefined}
            className="flex justify-center pt-4"
          >
            <Button
              variant={buttonVariant}
              size={buttonSize}
              onClick={toggleShowAll}
              className="gap-2"
            >
              {showAll ? showLessText : showMoreText}
            </Button>
          </motion.div>
        )}
      </div>
    );
  }
);

Timeline.displayName = "Timeline";

export { Timeline, timelineVariants };
