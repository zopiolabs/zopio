/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Eye, EyeOff, ChevronDown, ChevronUp, Info, AlertCircle, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";

const glimpseVariants = cva(
  "relative overflow-hidden transition-all duration-300 ease-in-out",
  {
    variants: {
      variant: {
        default: "bg-background border rounded-lg",
        card: "bg-card border rounded-lg shadow-sm",
        ghost: "bg-transparent",
        outline: "border-2 border-dashed rounded-lg",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface GlimpseContextValue {
  isExpanded: boolean;
  setIsExpanded: (expanded: boolean) => void;
  isVisible: boolean;
  setIsVisible: (visible: boolean) => void;
  maxLines: number;
  showToggle: boolean;
  expandable: boolean;
}

const GlimpseContext = React.createContext<GlimpseContextValue | null>(null);

interface GlimpseProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof glimpseVariants> {
  maxLines?: number;
  expandable?: boolean;
  showToggle?: boolean;
  initialExpanded?: boolean;
  initialVisible?: boolean;
  onToggleExpand?: (expanded: boolean) => void;
  onToggleVisibility?: (visible: boolean) => void;
}

const Glimpse = React.forwardRef<HTMLDivElement, GlimpseProps>(
  (
    {
      className,
      variant,
      size,
      children,
      maxLines = 3,
      expandable = true,
      showToggle = true,
      initialExpanded = false,
      initialVisible = true,
      onToggleExpand,
      onToggleVisibility,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpandedState] = React.useState(initialExpanded);
    const [isVisible, setIsVisibleState] = React.useState(initialVisible);

    const setIsExpanded = React.useCallback(
      (expanded: boolean) => {
        setIsExpandedState(expanded);
        onToggleExpand?.(expanded);
      },
      [onToggleExpand]
    );

    const setIsVisible = React.useCallback(
      (visible: boolean) => {
        setIsVisibleState(visible);
        onToggleVisibility?.(visible);
      },
      [onToggleVisibility]
    );

    const contextValue = React.useMemo(
      () => ({
        isExpanded,
        setIsExpanded,
        isVisible,
        setIsVisible,
        maxLines,
        showToggle,
        expandable,
      }),
      [isExpanded, setIsExpanded, isVisible, setIsVisible, maxLines, showToggle, expandable]
    );

    if (!isVisible) {
      return null;
    }

    return (
      <GlimpseContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(glimpseVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </div>
      </GlimpseContext.Provider>
    );
  }
);

Glimpse.displayName = "Glimpse";

// Glimpse Content
interface GlimpseContentProps extends React.HTMLAttributes<HTMLDivElement> {
  fadeOut?: boolean;
}

const GlimpseContent = React.forwardRef<HTMLDivElement, GlimpseContentProps>(
  ({ className, children, fadeOut = true, ...props }, ref) => {
    const context = React.useContext(GlimpseContext);

    if (!context) {
      throw new Error("GlimpseContent must be used within a Glimpse");
    }

    const { isExpanded, maxLines } = context;

    const contentStyle = !isExpanded
      ? {
          display: '-webkit-box',
          WebkitLineClamp: maxLines,
          WebkitBoxOrient: 'vertical' as const,
          overflow: 'hidden',
        }
      : {};

    return (
      <div className="relative">
        <div
          ref={ref}
          className={cn("transition-all duration-300", className)}
          style={contentStyle}
          {...props}
        >
          {children}
        </div>
        
        {!isExpanded && fadeOut && (
          <div className="absolute bottom-0 left-0 right-0 h-6 bg-gradient-to-t from-background to-transparent pointer-events-none" />
        )}
      </div>
    );
  }
);

GlimpseContent.displayName = "GlimpseContent";

// Glimpse Header
interface GlimpseHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlimpseHeader = React.forwardRef<HTMLDivElement, GlimpseHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between p-4 border-b", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlimpseHeader.displayName = "GlimpseHeader";

// Glimpse Body
interface GlimpseBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlimpseBody = React.forwardRef<HTMLDivElement, GlimpseBodyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-4", className)}
        {...props}
      >
        <GlimpseContent>
          {children}
        </GlimpseContent>
      </div>
    );
  }
);

GlimpseBody.displayName = "GlimpseBody";

// Glimpse Footer
interface GlimpseFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlimpseFooter = React.forwardRef<HTMLDivElement, GlimpseFooterProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(GlimpseContext);

    if (!context) {
      throw new Error("GlimpseFooter must be used within a Glimpse");
    }

    const { showToggle } = context;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-4 border-t bg-muted/30",
          !showToggle && "justify-end",
          className
        )}
        {...props}
      >
        {showToggle && <GlimpseToggle />}
        {children}
      </div>
    );
  }
);

GlimpseFooter.displayName = "GlimpseFooter";

// Glimpse Toggle
interface GlimpseToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  expandText?: string;
  collapseText?: string;
}

const GlimpseToggle = React.forwardRef<HTMLButtonElement, GlimpseToggleProps>(
  ({ className, expandText = "Show more", collapseText = "Show less", ...props }, ref) => {
    const context = React.useContext(GlimpseContext);

    if (!context) {
      throw new Error("GlimpseToggle must be used within a Glimpse");
    }

    const { isExpanded, setIsExpanded, expandable } = context;

    if (!expandable) {
      return null;
    }

    const handleToggle = () => {
      setIsExpanded(!isExpanded);
    };

    return (
      <button
        ref={ref}
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
        {...props}
      >
        {isExpanded ? collapseText : expandText}
        {isExpanded ? (
          <ChevronUp className="ml-1 h-4 w-4" />
        ) : (
          <ChevronDown className="ml-1 h-4 w-4" />
        )}
      </button>
    );
  }
);

GlimpseToggle.displayName = "GlimpseToggle";

// Glimpse Visibility Toggle
interface GlimpseVisibilityToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  showText?: string;
  hideText?: string;
}

const GlimpseVisibilityToggle = React.forwardRef<HTMLButtonElement, GlimpseVisibilityToggleProps>(
  ({ className, showText = "Show", hideText = "Hide", ...props }, ref) => {
    const context = React.useContext(GlimpseContext);

    if (!context) {
      throw new Error("GlimpseVisibilityToggle must be used within a Glimpse");
    }

    const { isVisible, setIsVisible } = context;

    const handleToggle = () => {
      setIsVisible(!isVisible);
    };

    return (
      <button
        ref={ref}
        onClick={handleToggle}
        className={cn(
          "inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors",
          className
        )}
        {...props}
      >
        {isVisible ? (
          <>
            <EyeOff className="mr-1 h-4 w-4" />
            {hideText}
          </>
        ) : (
          <>
            <Eye className="mr-1 h-4 w-4" />
            {showText}
          </>
        )}
      </button>
    );
  }
);

GlimpseVisibilityToggle.displayName = "GlimpseVisibilityToggle";

// Glimpse Badge
interface GlimpseBadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "info" | "warning" | "success" | "error";
}

const GlimpseBadge = React.forwardRef<HTMLDivElement, GlimpseBadgeProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "bg-muted text-muted-foreground",
      info: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
      warning: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
      success: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
      error: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
    };

    const icons = {
      default: null,
      info: <Info className="h-3 w-3 mr-1" />,
      warning: <AlertCircle className="h-3 w-3 mr-1" />,
      success: <CheckCircle className="h-3 w-3 mr-1" />,
      error: <AlertCircle className="h-3 w-3 mr-1" />,
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center px-2 py-1 rounded-full text-xs font-medium",
          variants[variant],
          className
        )}
        {...props}
      >
        {icons[variant]}
        {children}
      </div>
    );
  }
);

GlimpseBadge.displayName = "GlimpseBadge";

// Glimpse Actions
interface GlimpseActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const GlimpseActions = React.forwardRef<HTMLDivElement, GlimpseActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlimpseActions.displayName = "GlimpseActions";

// Hook for accessing glimpse context
const useGlimpse = () => {
  const context = React.useContext(GlimpseContext);
  if (!context) {
    throw new Error("useGlimpse must be used within a Glimpse component");
  }
  return context;
};

// Utility function to truncate text
const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

// Utility function to count lines in text
const countLines = (text: string): number => {
  return text.split('\n').length;
};

export {
  Glimpse,
  GlimpseContent,
  GlimpseHeader,
  GlimpseBody,
  GlimpseFooter,
  GlimpseToggle,
  GlimpseVisibilityToggle,
  GlimpseBadge,
  GlimpseActions,
  useGlimpse,
  truncateText,
  countLines,
  glimpseVariants,
};

export type {
  GlimpseProps,
  GlimpseContentProps,
  GlimpseHeaderProps,
  GlimpseBodyProps,
  GlimpseFooterProps,
  GlimpseToggleProps,
  GlimpseVisibilityToggleProps,
  GlimpseBadgeProps,
  GlimpseActionsProps,
  GlimpseContextValue,
};
