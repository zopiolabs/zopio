/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const announcementVariants = cva(
  "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm font-medium transition-shadow hover:shadow-md",
  {
    variants: {
      variant: {
        default: "bg-background text-foreground border-border",
        primary: "bg-primary text-primary-foreground border-primary",
        secondary: "bg-secondary text-secondary-foreground border-secondary",
        destructive: "bg-destructive text-destructive-foreground border-destructive",
        outline: "text-foreground border-border",
        ghost: "border-transparent",
      },
      size: {
        sm: "px-2 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

const announcementTagVariants = cva(
  "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
  {
    variants: {
      variant: {
        default: "bg-muted text-muted-foreground",
        primary: "bg-primary/10 text-primary",
        secondary: "bg-secondary/10 text-secondary-foreground",
        destructive: "bg-destructive/10 text-destructive",
        success: "bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
        warning: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400",
        info: "bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

interface AnnouncementContextValue {
  variant: "default" | "primary" | "secondary" | "destructive" | "outline" | "ghost";
  themed: boolean;
}

const AnnouncementContext = React.createContext<AnnouncementContextValue | null>(null);

interface AnnouncementProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof announcementVariants> {
  themed?: boolean;
}

const Announcement = React.forwardRef<HTMLDivElement, AnnouncementProps>(
  (
    {
      className,
      variant = "default",
      size,
      themed = false,
      children,
      ...props
    },
    ref
  ) => {
    const contextValue = React.useMemo(
      () => ({ variant: variant || "default", themed }),
      [variant, themed]
    );

    return (
      <AnnouncementContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(announcementVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </div>
      </AnnouncementContext.Provider>
    );
  }
);

Announcement.displayName = "Announcement";

// Announcement Tag component
interface AnnouncementTagProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof announcementTagVariants> {
  variant?: "default" | "primary" | "secondary" | "destructive" | "success" | "warning" | "info";
}

const AnnouncementTag = React.forwardRef<HTMLSpanElement, AnnouncementTagProps>(
  ({ className, variant, children, ...props }, ref) => {
    const context = React.useContext(AnnouncementContext);
    
    // Use themed variant if context is themed and no explicit variant is provided
    const effectiveVariant = React.useMemo(() => {
      if (variant) return variant;
      if (context?.themed) {
        switch (context.variant) {
          case "primary": return "primary";
          case "secondary": return "secondary";
          case "destructive": return "destructive";
          default: return "default";
        }
      }
      return "default";
    }, [variant, context]);

    return (
      <span
        ref={ref}
        className={cn(announcementTagVariants({ variant: effectiveVariant, className }))}
        {...props}
      >
        {children}
      </span>
    );
  }
);

AnnouncementTag.displayName = "AnnouncementTag";

// Announcement Title component
interface AnnouncementTitleProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AnnouncementTitle = React.forwardRef<HTMLSpanElement, AnnouncementTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("font-medium", className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

AnnouncementTitle.displayName = "AnnouncementTitle";

// Announcement Content component
interface AnnouncementContentProps extends React.HTMLAttributes<HTMLSpanElement> {}

const AnnouncementContent = React.forwardRef<HTMLSpanElement, AnnouncementContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

AnnouncementContent.displayName = "AnnouncementContent";

export {
  Announcement,
  AnnouncementTag,
  AnnouncementTitle,
  AnnouncementContent,
  announcementVariants,
  announcementTagVariants,
};

export type {
  AnnouncementProps,
  AnnouncementTagProps,
  AnnouncementTitleProps,
  AnnouncementContentProps,
};
