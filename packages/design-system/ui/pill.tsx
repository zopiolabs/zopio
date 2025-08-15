/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "../lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const pillVariants = cva(
  "inline-flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        primary: "bg-primary text-primary-foreground hover:bg-primary/90",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        success: "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
        warning: "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200",
        error: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
        info: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1.5 text-sm",
        lg: "px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const statusIndicatorVariants = cva("rounded-full", {
  variants: {
    status: {
      success: "bg-green-500",
      error: "bg-red-500",
      warning: "bg-yellow-500",
      info: "bg-blue-500",
      neutral: "bg-gray-500",
    },
    size: {
      sm: "h-1.5 w-1.5",
      md: "h-2 w-2",
      lg: "h-2.5 w-2.5",
    },
    animated: {
      true: "animate-pulse",
      false: "",
    },
  },
  defaultVariants: {
    status: "neutral",
    size: "md",
    animated: false,
  },
});

const deltaVariants = cva("inline-flex items-center gap-1", {
  variants: {
    delta: {
      increase: "text-green-600",
      decrease: "text-red-600",
      neutral: "text-gray-600",
    },
  },
});

interface PillProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof pillVariants> {
  onRemove?: () => void;
  avatar?: {
    src?: string;
    alt?: string;
    fallback?: string;
  };
  avatars?: Array<{
    src?: string;
    alt?: string;
    fallback?: string;
  }>;
  status?: {
    type: "success" | "error" | "warning" | "info" | "neutral";
    animated?: boolean;
  };
  delta?: {
    type: "increase" | "decrease" | "neutral";
    value?: string | number;
  };
  icon?: React.ComponentType<{ className?: string }>;
  removable?: boolean;
  disabled?: boolean;
}

const Pill = React.forwardRef<HTMLDivElement, PillProps>(
  (
    {
      className,
      variant,
      size,
      children,
      onRemove,
      avatar,
      avatars,
      status,
      delta,
      icon: Icon,
      removable = false,
      disabled = false,
      onClick,
      ...props
    },
    ref
  ) => {
    const handleRemove = (e: React.MouseEvent) => {
      e.stopPropagation();
      onRemove?.();
    };

    const getDeltaIcon = (type: "increase" | "decrease" | "neutral") => {
      switch (type) {
        case "increase":
          return TrendingUp;
        case "decrease":
          return TrendingDown;
        case "neutral":
        default:
          return Minus;
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          pillVariants({ variant, size }),
          onClick && "cursor-pointer",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={disabled ? undefined : onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick && !disabled ? 0 : undefined}
        {...props}
      >
        {/* Status Indicator */}
        {status && (
          <div
            className={cn(
              statusIndicatorVariants({
                status: status.type,
                size,
                animated: status.animated,
              })
            )}
          />
        )}

        {/* Single Avatar */}
        {avatar && (
          <Avatar className={cn(size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5")}>
            <AvatarImage src={avatar.src} alt={avatar.alt} />
            <AvatarFallback className="text-xs">
              {avatar.fallback}
            </AvatarFallback>
          </Avatar>
        )}

        {/* Avatar Group */}
        {avatars && avatars.length > 0 && (
          <div className="flex -space-x-2">
            {avatars.slice(0, 3).map((avatarItem, index) => (
              <Avatar
                key={index}
                className={cn(
                  "border-2 border-background",
                  size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"
                )}
              >
                <AvatarImage src={avatarItem.src} alt={avatarItem.alt} />
                <AvatarFallback className="text-xs">
                  {avatarItem.fallback}
                </AvatarFallback>
              </Avatar>
            ))}
            {avatars.length > 3 && (
              <div
                className={cn(
                  "flex items-center justify-center rounded-full bg-muted text-xs font-medium border-2 border-background",
                  size === "sm" ? "h-4 w-4" : size === "lg" ? "h-6 w-6" : "h-5 w-5"
                )}
              >
                +{avatars.length - 3}
              </div>
            )}
          </div>
        )}

        {/* Icon */}
        {Icon && (
          <Icon
            className={cn(
              size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
            )}
          />
        )}

        {/* Content */}
        <span className="flex-1">{children}</span>

        {/* Delta */}
        {delta && (
          <div className={cn(deltaVariants({ delta: delta.type }))}>
            {React.createElement(getDeltaIcon(delta.type), {
              className: cn(
                size === "sm" ? "h-3 w-3" : size === "lg" ? "h-5 w-5" : "h-4 w-4"
              ),
            })}
            {delta.value && <span className="text-xs">{delta.value}</span>}
          </div>
        )}

        {/* Remove Button */}
        {(removable || onRemove) && (
          <button
            type="button"
            onClick={handleRemove}
            disabled={disabled}
            className={cn(
              "rounded-full hover:bg-black/10 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
              size === "sm" ? "p-0.5" : "p-1"
            )}
          >
            <X
              className={cn(
                size === "sm" ? "h-2.5 w-2.5" : size === "lg" ? "h-4 w-4" : "h-3 w-3"
              )}
            />
            <span className="sr-only">Remove</span>
          </button>
        )}
      </div>
    );
  }
);

Pill.displayName = "Pill";

export { Pill, pillVariants };
export type { PillProps };
