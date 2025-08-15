/**
 * SPDX-License-Identifier: MIT
 */

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";

const heroVariants = cva(
  "flex items-center justify-center min-h-screen",
  {
    variants: {
      variant: {
        default: "bg-secondary",
        primary: "bg-primary text-primary-foreground",
        gradient: "bg-gradient-to-r from-primary to-secondary",
        image: "bg-cover bg-center bg-no-repeat relative",
      },
      size: {
        default: "min-h-screen",
        sm: "min-h-[50vh]",
        lg: "min-h-[120vh]",
        auto: "min-h-fit py-20",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const heroContentVariants = cva(
  "flex items-center justify-center w-full max-w-7xl mx-auto px-4",
  {
    variants: {
      layout: {
        center: "text-center flex-col",
        "image-left": "flex-col lg:flex-row gap-8",
        "image-right": "flex-col lg:flex-row-reverse gap-8",
        split: "flex-col lg:flex-row gap-8 items-stretch",
      },
      spacing: {
        default: "gap-6",
        sm: "gap-4",
        lg: "gap-8",
        xl: "gap-12",
      },
    },
    defaultVariants: {
      layout: "center",
      spacing: "default",
    },
  }
);

export interface HeroProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof heroVariants>["variant"];
  size?: VariantProps<typeof heroVariants>["size"];
  layout?: VariantProps<typeof heroContentVariants>["layout"];
  spacing?: VariantProps<typeof heroContentVariants>["spacing"];
  backgroundImage?: string;
  overlay?: boolean;
}

export interface HeroContentProps extends React.HTMLAttributes<HTMLDivElement> {
  layout?: VariantProps<typeof heroContentVariants>["layout"];
  spacing?: VariantProps<typeof heroContentVariants>["spacing"];
}

export interface HeroTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
}

export interface HeroDescriptionProps extends React.HTMLAttributes<HTMLParagraphElement> {}

export interface HeroImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  containerClassName?: string;
}

export interface HeroActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  orientation?: "horizontal" | "vertical";
}

const Hero = React.forwardRef<HTMLDivElement, HeroProps>(
  (
    {
      className,
      variant,
      size,
      layout,
      spacing,
      backgroundImage,
      overlay = false,
      children,
      style,
      ...props
    },
    ref
  ) => {
    const heroStyle = backgroundImage
      ? { ...style, backgroundImage: `url(${backgroundImage})` }
      : style;

    return (
      <div
        ref={ref}
        className={cn(heroVariants({ variant, size, className }))}
        style={heroStyle}
        {...props}
      >
        {overlay && variant === "image" && (
          <div className="absolute inset-0 bg-black/50" />
        )}
        <HeroContent layout={layout} spacing={spacing}>
          {children}
        </HeroContent>
      </div>
    );
  }
);

const HeroContent = React.forwardRef<HTMLDivElement, HeroContentProps>(
  ({ className, layout, spacing, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          heroContentVariants({ layout, spacing }),
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const HeroTitle = React.forwardRef<HTMLHeadingElement, HeroTitleProps>(
  ({ className, as: Component = "h1", children, ...props }, ref) => {
    return (
      <Component
        ref={ref}
        className={cn(
          "text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight",
          className
        )}
        {...props}
      >
        {children}
      </Component>
    );
  }
);

const HeroDescription = React.forwardRef<HTMLParagraphElement, HeroDescriptionProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <p
        ref={ref}
        className={cn(
          "text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto py-6",
          className
        )}
        {...props}
      >
        {children}
      </p>
    );
  }
);

const HeroImage = React.forwardRef<HTMLImageElement, HeroImageProps>(
  ({ className, containerClassName, alt, ...props }, ref) => {
    return (
      <div className={cn("flex-shrink-0", containerClassName)}>
        <img
          ref={ref}
          className={cn(
            "max-w-sm w-full h-auto rounded-lg shadow-2xl object-cover",
            className
          )}
          alt={alt}
          {...props}
        />
      </div>
    );
  }
);

const HeroActions = React.forwardRef<HTMLDivElement, HeroActionsProps>(
  ({ className, orientation = "horizontal", children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex gap-4",
          orientation === "vertical" ? "flex-col items-center" : "flex-row justify-center flex-wrap",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const HeroCard = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "bg-card text-card-foreground w-full max-w-sm shrink-0 shadow-2xl rounded-lg border",
          className
        )}
        {...props}
      >
        <div className="p-6">
          {children}
        </div>
      </div>
    );
  }
);

Hero.displayName = "Hero";
HeroContent.displayName = "HeroContent";
HeroTitle.displayName = "HeroTitle";
HeroDescription.displayName = "HeroDescription";
HeroImage.displayName = "HeroImage";
HeroActions.displayName = "HeroActions";
HeroCard.displayName = "HeroCard";

export {
  Hero,
  HeroContent,
  HeroTitle,
  HeroDescription,
  HeroImage,
  HeroActions,
  HeroCard,
  heroVariants,
  heroContentVariants,
};
