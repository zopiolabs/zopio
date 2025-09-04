/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Star } from "lucide-react";
import { cn } from "../lib/utils";

const ratingVariants = cva("flex items-center gap-1", {
  variants: {
    size: {
      sm: "text-sm",
      md: "text-base",
      lg: "text-lg",
      xl: "text-xl",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

const starVariants = cva(
  "transition-colors duration-150 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-sm",
  {
    variants: {
      size: {
        sm: "h-4 w-4",
        md: "h-5 w-5",
        lg: "h-6 w-6",
        xl: "h-8 w-8",
      },
      state: {
        empty: "text-muted-foreground/40 hover:text-muted-foreground/60",
        filled: "text-yellow-400 hover:text-yellow-500",
        hover: "text-yellow-300",
      },
    },
    defaultVariants: {
      size: "md",
      state: "empty",
    },
  }
);

interface RatingProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof ratingVariants> {
  value?: number;
  defaultValue?: number;
  max?: number;
  readOnly?: boolean;
  disabled?: boolean;
  onValueChange?: (value: number) => void;
  name?: string;
  icon?: React.ComponentType<{ className?: string }>;
  emptyIcon?: React.ComponentType<{ className?: string }>;
  precision?: number;
}

const Rating = React.forwardRef<HTMLDivElement, RatingProps>(
  (
    {
      className,
      size,
      value: controlledValue,
      defaultValue = 0,
      max = 5,
      readOnly = false,
      disabled = false,
      onValueChange,
      name,
      icon: Icon = Star,
      emptyIcon: EmptyIcon = Star,
      precision = 1,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState(defaultValue);
    const [hoverValue, setHoverValue] = React.useState<number | null>(null);
    
    const isControlled = controlledValue !== undefined;
    const value = isControlled ? controlledValue : internalValue;
    const displayValue = hoverValue !== null ? hoverValue : value;

    const handleStarClick = (starValue: number) => {
      if (readOnly || disabled) return;
      
      const newValue = starValue;
      if (!isControlled) {
        setInternalValue(newValue);
      }
      onValueChange?.(newValue);
    };

    const handleStarHover = (starValue: number) => {
      if (readOnly || disabled) return;
      setHoverValue(starValue);
    };

    const handleMouseLeave = () => {
      if (readOnly || disabled) return;
      setHoverValue(null);
    };

    const handleKeyDown = (event: React.KeyboardEvent, starValue: number) => {
      if (readOnly || disabled) return;
      
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        handleStarClick(starValue);
      }
    };

    const getStarState = (starIndex: number): "empty" | "filled" | "hover" => {
      const starValue = starIndex + 1;
      
      if (hoverValue !== null) {
        return starValue <= hoverValue ? "hover" : "empty";
      }
      
      return starValue <= displayValue ? "filled" : "empty";
    };

    return (
      <div
        ref={ref}
        className={cn(ratingVariants({ size, className }))}
        role="radiogroup"
        aria-label={`Rating: ${value} out of ${max} stars`}
        onMouseLeave={handleMouseLeave}
        {...props}
      >
        {Array.from({ length: max }, (_, index) => {
          const starValue = index + 1;
          const state = getStarState(index);
          const StarComponent = state === "empty" ? EmptyIcon : Icon;
          
          return (
            <button
              key={index}
              type="button"
              className={cn(
                starVariants({ size, state }),
                (readOnly || disabled) && "cursor-default pointer-events-none",
                disabled && "opacity-50"
              )}
              onClick={() => handleStarClick(starValue)}
              onMouseEnter={() => handleStarHover(starValue)}
              onKeyDown={(e) => handleKeyDown(e, starValue)}
              disabled={disabled}
              role="radio"
              aria-checked={starValue <= value}
              aria-label={`${starValue} star${starValue !== 1 ? "s" : ""}`}
              tabIndex={readOnly || disabled ? -1 : 0}
            >
              <StarComponent
                className={cn(
                  "h-full w-full",
                  state === "filled" || state === "hover" ? "fill-current" : ""
                )}
              />
            </button>
          );
        })}
        
        {/* Hidden input for form submission */}
        {name && (
          <input
            type="hidden"
            name={name}
            value={value}
          />
        )}
      </div>
    );
  }
);

Rating.displayName = "Rating";

export { Rating, ratingVariants };
export type { RatingProps };
