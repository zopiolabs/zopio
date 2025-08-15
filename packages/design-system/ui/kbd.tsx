/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const kbdVariants = cva(
  "inline-flex items-center gap-1 rounded border bg-muted px-1.5 py-0.5 text-xs font-mono font-medium text-muted-foreground",
  {
    variants: {
      size: {
        sm: "px-1 py-0.5 text-xs",
        md: "px-1.5 py-0.5 text-xs",
        lg: "px-2 py-1 text-sm",
      },
      variant: {
        default: "border-border bg-muted text-muted-foreground",
        outline: "border-2 border-border bg-background text-foreground",
        secondary: "border-border bg-secondary text-secondary-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

const keyVariants = cva(
  "inline-flex items-center justify-center rounded border bg-background px-1 py-0.5 text-xs font-mono font-medium shadow-sm",
  {
    variants: {
      size: {
        sm: "min-w-[1.25rem] px-0.5 py-0.5 text-xs",
        md: "min-w-[1.5rem] px-1 py-0.5 text-xs",
        lg: "min-w-[2rem] px-1.5 py-1 text-sm",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface KbdProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof kbdVariants> {
  keys?: string[];
  separator?: string;
}

const Kbd = React.forwardRef<HTMLElement, KbdProps>(
  ({ className, size, variant, keys, separator = "+", children, ...props }, ref) => {
    // Helper function to format key names
    const formatKey = (key: string): string => {
      const keyMap: Record<string, string> = {
        cmd: "⌘",
        command: "⌘",
        ctrl: "⌃",
        control: "⌃",
        alt: "⌥",
        option: "⌥",
        shift: "⇧",
        enter: "↵",
        return: "↵",
        backspace: "⌫",
        delete: "⌦",
        tab: "⇥",
        space: "␣",
        esc: "⎋",
        escape: "⎋",
        up: "↑",
        down: "↓",
        left: "←",
        right: "→",
      };

      return keyMap[key.toLowerCase()] || key;
    };

    // Generate aria-label for accessibility
    const getAriaLabel = (): string => {
      if (keys && keys.length > 0) {
        return keys.join(" plus ");
      }
      if (typeof children === "string") {
        return children;
      }
      return "Keyboard shortcut";
    };

    if (keys && keys.length > 0) {
      return (
        <kbd
          ref={ref}
          className={cn(kbdVariants({ size, variant, className }))}
          aria-label={getAriaLabel()}
          {...props}
        >
          {keys.map((key, index) => (
            <React.Fragment key={key}>
              <span className={cn(keyVariants({ size }))}>{formatKey(key)}</span>
              {index < keys.length - 1 && (
                <span className="text-muted-foreground">{separator}</span>
              )}
            </React.Fragment>
          ))}
        </kbd>
      );
    }

    return (
      <kbd
        ref={ref}
        className={cn(kbdVariants({ size, variant, className }))}
        aria-label={getAriaLabel()}
        {...props}
      >
        {children}
      </kbd>
    );
  }
);

Kbd.displayName = "Kbd";

// Individual Key component for more granular control
interface KeyProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof keyVariants> {}

const Key = React.forwardRef<HTMLSpanElement, KeyProps>(
  ({ className, size, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(keyVariants({ size, className }))}
        {...props}
      >
        {children}
      </span>
    );
  }
);

Key.displayName = "Key";

export { Kbd, Key, kbdVariants, keyVariants };
export type { KbdProps, KeyProps };
