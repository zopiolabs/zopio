/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";

const displayCardsVariants = cva(
  "relative grid gap-4",
  {
    variants: {
      variant: {
        default: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
        stacked: "grid-cols-1 max-w-sm mx-auto",
        grid: "grid-cols-2 md:grid-cols-3 lg:grid-cols-4",
      },
      size: {
        sm: "gap-2",
        default: "gap-4",
        lg: "gap-6",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const displayCardVariants = cva(
  "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300 hover:shadow-md",
  {
    variants: {
      variant: {
        default: "p-6",
        compact: "p-4",
        minimal: "p-3",
      },
      hover: {
        none: "",
        lift: "hover:-translate-y-1",
        scale: "hover:scale-105",
        glow: "hover:shadow-lg hover:shadow-primary/20",
      },
    },
    defaultVariants: {
      variant: "default",
      hover: "lift",
    },
  }
);

export interface DisplayCard {
  id?: string;
  icon?: React.ReactNode;
  title: string;
  description: string;
  date?: string;
  image?: string;
  href?: string;
  iconClassName?: string;
  titleClassName?: string;
  descriptionClassName?: string;
  dateClassName?: string;
}

export interface DisplayCardsProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof displayCardsVariants> {
  cards?: DisplayCard[];
  cardVariant?: VariantProps<typeof displayCardVariants>["variant"];
  cardHover?: VariantProps<typeof displayCardVariants>["hover"];
  onCardClick?: (card: DisplayCard) => void;
}

const defaultCards: DisplayCard[] = [
  {
    id: "1",
    title: "Design System",
    description: "A comprehensive design system with components and guidelines",
    date: "2024-01-15",
  },
  {
    id: "2",
    title: "Component Library",
    description: "Reusable components built with modern technologies",
    date: "2024-01-10",
  },
  {
    id: "3",
    title: "Documentation",
    description: "Complete documentation with examples and best practices",
    date: "2024-01-05",
  },
];

const DisplayCards = React.forwardRef<HTMLDivElement, DisplayCardsProps>(
  (
    {
      className,
      variant,
      size,
      cards = defaultCards,
      cardVariant = "default",
      cardHover = "lift",
      onCardClick,
      ...props
    },
    ref
  ) => {
    // Use React state to disable animations in Storybook to prevent AbortError
    const [isMounted, setIsMounted] = React.useState(false);
    
    React.useEffect(() => {
      // Enable animations only after component is mounted
      setIsMounted(true);
      
      // Cleanup function
      return () => {
        setIsMounted(false);
      };
    }, []);
    
    // Simple animation variants
    const cardVariants = {
      initial: { opacity: 0 },
      animate: { 
        opacity: 1,
        transition: { duration: 0.3 }
      }
    };

    const handleCardClick = (card: DisplayCard) => {
      if (onCardClick) {
        onCardClick(card);
      } else if (card.href) {
        window.open(card.href, "_blank");
      }
    };

    return (
      <div
        ref={ref}
        className={cn(displayCardsVariants({ variant, size }), className)}
        {...props}
      >
        {cards.map((card, index) => (
          <motion.div
            key={`${card.id || 'card'}-${index}`}
            initial={isMounted ? { opacity: 0 } : false}
            animate={isMounted ? { opacity: 1 } : false}
            transition={{ duration: 0.3 }}
            className={cn(
              displayCardVariants({ variant: cardVariant, hover: cardHover }),
              card.href || onCardClick ? "cursor-pointer" : ""
            )}
            onClick={() => handleCardClick(card)}
            whileHover={isMounted && cardHover === "scale" ? { scale: 1.05 } : undefined}
            whileTap={isMounted ? { scale: 0.98 } : undefined}
          >
            {card.image && (
              <div className="mb-4 overflow-hidden rounded-md">
                <img
                  src={card.image}
                  alt={card.title}
                  className="h-32 w-full object-cover transition-all duration-300 hover:scale-110 hover:grayscale-0 grayscale"
                />
              </div>
            )}

            <div className="space-y-3">
              {card.icon && (
                <div className={cn("flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10", card.iconClassName)}>
                  {card.icon}
                </div>
              )}

              <div className="space-y-2">
                <h3 className={cn("font-semibold text-foreground", card.titleClassName)}>
                  {card.title}
                </h3>
                <p className={cn("text-sm text-muted-foreground", card.descriptionClassName)}>
                  {card.description}
                </p>
              </div>

              {card.date && (
                <p className={cn("text-xs text-muted-foreground", card.dateClassName)}>
                  {new Date(card.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </p>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    );
  }
);

DisplayCards.displayName = "DisplayCards";

export { DisplayCards, displayCardsVariants, displayCardVariants };
