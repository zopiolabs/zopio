/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { Slot } from '@radix-ui/react-slot';
import { cn } from '@repo/design-system/lib/utils';

/* ---------------------------------- Types ---------------------------------- */

export interface ImageProps
  extends Omit<React.ImgHTMLAttributes<HTMLImageElement>, 'title'>,
    VariantProps<typeof imageVariants> {
  /**
   * The source URL of the image
   */
  src: string;
  /**
   * Alternative text for the image
   */
  alt: string;
  /**
   * The fallback source URL to use when the image fails to load
   */
  fallbackSrc?: string;
  /**
   * Whether to apply a blur effect to the image
   */
  isBlurred?: boolean;
  /**
   * Whether to apply a zoom effect on hover
   */
  isZoomed?: boolean;
  /**
   * Whether to disable the loading skeleton
   */
  disableSkeleton?: boolean;
  /**
   * Whether to remove the wrapper element
   */
  removeWrapper?: boolean;
  /**
   * Whether the component should be rendered as a child
   */
  asChild?: boolean;
  /**
   * Custom classNames for specific parts of the component
   */
  classNames?: {
    img?: string;
    wrapper?: string;
    zoomedWrapper?: string;
    blurredImg?: string;
  };
}

/* -------------------------------- Variants -------------------------------- */

const imageVariants = cva('max-w-full h-auto transition-opacity duration-300', {
  variants: {
    radius: {
      none: 'rounded-none',
      sm: 'rounded-sm',
      md: 'rounded-md',
      lg: 'rounded-lg',
      xl: 'rounded-xl',
      full: 'rounded-full',
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
    },
    objectFit: {
      contain: 'object-contain',
      cover: 'object-cover',
      fill: 'object-fill',
      none: 'object-none',
      scaleDown: 'object-scale-down',
    },
  },
  defaultVariants: {
    radius: 'none',
    shadow: 'none',
    objectFit: 'cover',
  },
});

/* -------------------------------- Component ------------------------------- */

const Image = React.forwardRef<HTMLImageElement, ImageProps>(
  (
    {
      alt,
      asChild = false,
      className,
      classNames,
      disableSkeleton = false,
      fallbackSrc,
      height,
      isBlurred = false,
      isZoomed = false,
      loading = 'lazy',
      objectFit,
      radius,
      removeWrapper = false,
      shadow,
      src,
      width,
      ...props
    },
    ref
  ) => {
    const ImageComponent = asChild ? Slot : 'img';
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [error, setError] = React.useState(false);
    const showSkeleton = !disableSkeleton && !isLoaded && !error;
    const showImage = isLoaded || error;
    const imageSrc = error && fallbackSrc ? fallbackSrc : src;

    const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
      setIsLoaded(true);
      props.onLoad?.(e);
    };

    const handleError = () => {
      setError(true);
      props.onError?.({} as React.SyntheticEvent<HTMLImageElement, Event>);
    };

    // If removeWrapper is true, render just the image
    if (removeWrapper) {
      return (
        <ImageComponent
          ref={ref}
          src={imageSrc}
          alt={alt}
          width={width}
          height={height}
          loading={loading}
          data-slot="image"
          className={cn(
            imageVariants({ radius, shadow, objectFit }),
            className,
            classNames?.img
          )}
          onLoad={handleLoad}
          onError={handleError}
          {...props}
        />
      );
    }

    return (
      <div
        data-slot="image-wrapper"
        className={cn(
          'relative inline-block overflow-hidden',
          isZoomed && 'cursor-pointer',
          classNames?.wrapper
        )}
        style={{ width: width ? `${width}px` : 'auto' }}
      >
        {/* Skeleton */}
        {showSkeleton && (
          <div
            className={cn(
              'absolute inset-0 bg-muted/20 animate-pulse',
              imageVariants({ radius, shadow })
            )}
            style={{
                width: width ? `${width}px` : '100%',
                height: height ? `${height}px` : '100%',
            }}
            aria-hidden="true"
          />
        )}

        {/* Blurred background image */}
        {isBlurred && (
          <div
            data-slot="blurred-image"
            className={cn(
              'absolute inset-0 z-0 scale-105 blur-md opacity-70',
              classNames?.blurredImg
            )}
            aria-hidden="true"
          >
            <img
              src={imageSrc}
              alt=""
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
        )}

        {/* Zoomed wrapper */}
        {isZoomed ? (
          <div
            data-slot="zoomed-wrapper"
            className={cn(
              'overflow-hidden',
              imageVariants({ radius, shadow }),
              classNames?.zoomedWrapper
            )}
          >
            <ImageComponent
              ref={ref}
              src={imageSrc}
              alt={alt}
              width={width}
              height={height}
              loading={loading}
              data-slot="image"
              className={cn(
                'transition-transform duration-500 ease-in-out hover:scale-110',
                imageVariants({ objectFit }),
                showImage ? 'opacity-100' : 'opacity-0',
                className,
                classNames?.img
              )}
              onLoad={handleLoad}
              onError={handleError}
              {...props}
            />
          </div>
        ) : (
          <ImageComponent
            ref={ref}
            src={imageSrc}
            alt={alt}
            width={width}
            height={height}
            loading={loading}
            data-slot="image"
            className={cn(
              imageVariants({ radius, shadow, objectFit }),
              showImage ? 'opacity-100' : 'opacity-0',
              className,
              classNames?.img
            )}
            onLoad={handleLoad}
            onError={handleError}
            {...props}
          />
        )}
      </div>
    );
  }
);

Image.displayName = 'Image';

/* --------------------------------- Exports --------------------------------- */

export { Image };
