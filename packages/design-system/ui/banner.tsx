/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X } from "lucide-react";
import { cn } from "../lib/utils";

const bannerVariants = cva(
  "flex items-center gap-3 p-4 text-sm font-medium",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground",
        destructive: "bg-destructive text-destructive-foreground",
        warning: "bg-yellow-500 text-yellow-50",
        success: "bg-green-500 text-green-50",
        info: "bg-blue-500 text-blue-50",
      },
      inset: {
        true: "mx-4 rounded-lg",
        false: "w-full",
      },
    },
    defaultVariants: {
      variant: "default",
      inset: false,
    },
  }
);

interface BannerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof bannerVariants> {
  open?: boolean;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  onClose?: () => void;
  closable?: boolean;
}

const BannerContext = React.createContext<{
  onClose: () => void;
} | null>(null);

const Banner = React.forwardRef<HTMLDivElement, BannerProps>(
  (
    {
      className,
      variant,
      inset,
      children,
      open,
      defaultOpen = true,
      onOpenChange,
      onClose,
      closable = true,
      ...props
    },
    ref
  ) => {
    const [internalOpen, setInternalOpen] = React.useState(
      open !== undefined ? open : defaultOpen
    );

    const isOpen = open !== undefined ? open : internalOpen;

    const handleClose = React.useCallback(() => {
      if (open === undefined) {
        setInternalOpen(false);
      }
      onOpenChange?.(false);
      onClose?.();
    }, [open, onOpenChange, onClose]);

    React.useEffect(() => {
      if (open !== undefined) {
        setInternalOpen(open);
      }
    }, [open]);

    if (!isOpen) {
      return null;
    }

    return (
      <BannerContext.Provider value={{ onClose: handleClose }}>
        <div
          ref={ref}
          className={cn(bannerVariants({ variant, inset, className }))}
          role="banner"
          {...props}
        >
          {children}
          {closable && (
            <BannerClose className="ml-auto" />
          )}
        </div>
      </BannerContext.Provider>
    );
  }
);

Banner.displayName = "Banner";

// Banner Icon component
interface BannerIconProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

const BannerIcon = React.forwardRef<HTMLDivElement, BannerIconProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-shrink-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BannerIcon.displayName = "BannerIcon";

// Banner Title component
interface BannerTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const BannerTitle = React.forwardRef<HTMLDivElement, BannerTitleProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("font-semibold", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BannerTitle.displayName = "BannerTitle";

// Banner Description component
interface BannerDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const BannerDescription = React.forwardRef<HTMLDivElement, BannerDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("opacity-90", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BannerDescription.displayName = "BannerDescription";

// Banner Content component
interface BannerContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const BannerContent = React.forwardRef<HTMLDivElement, BannerContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1 space-y-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

BannerContent.displayName = "BannerContent";

// Banner Action component
interface BannerActionProps extends React.HTMLAttributes<HTMLDivElement> {}

const BannerAction = React.forwardRef<HTMLDivElement, BannerActionProps>(
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

BannerAction.displayName = "BannerAction";

// Banner Close component
interface BannerCloseProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {}

const BannerClose = React.forwardRef<HTMLButtonElement, BannerCloseProps>(
  ({ className, onClick, ...props }, ref) => {
    const context = React.useContext(BannerContext);

    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
      onClick?.(event);
      context?.onClose();
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "flex-shrink-0 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none",
          className
        )}
        onClick={handleClick}
        aria-label="Close banner"
        {...props}
      >
        <X className="h-4 w-4" />
      </button>
    );
  }
);

BannerClose.displayName = "BannerClose";

export {
  Banner,
  BannerIcon,
  BannerTitle,
  BannerDescription,
  BannerContent,
  BannerAction,
  BannerClose,
  bannerVariants,
};

export type {
  BannerProps,
  BannerIconProps,
  BannerTitleProps,
  BannerDescriptionProps,
  BannerContentProps,
  BannerActionProps,
  BannerCloseProps,
};
