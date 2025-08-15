/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ZoomIn, ZoomOut, RotateCw, Move, Maximize2 } from "lucide-react";
import { cn } from "../lib/utils";

const imageZoomVariants = cva(
  "relative overflow-hidden rounded-lg border bg-background",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
        full: "w-full",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface ImageZoomContextValue {
  zoom: number;
  setZoom: (zoom: number) => void;
  position: { x: number; y: number };
  setPosition: (position: { x: number; y: number }) => void;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  rotation: number;
  setRotation: (rotation: number) => void;
  isFullscreen: boolean;
  setIsFullscreen: (fullscreen: boolean) => void;
  minZoom: number;
  maxZoom: number;
  zoomStep: number;
  resetView: () => void;
}

const ImageZoomContext = React.createContext<ImageZoomContextValue | null>(null);

interface ImageZoomProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof imageZoomVariants> {
  src: string;
  alt?: string;
  minZoom?: number;
  maxZoom?: number;
  zoomStep?: number;
  initialZoom?: number;
  wheelZoom?: boolean;
  doubleClickZoom?: boolean;
  onZoomChange?: (zoom: number) => void;
  onPositionChange?: (position: { x: number; y: number }) => void;
}

const ImageZoom = React.forwardRef<HTMLDivElement, ImageZoomProps>(
  (
    {
      className,
      size,
      children,
      src,
      alt = "Zoomable image",
      minZoom = 0.5,
      maxZoom = 5,
      zoomStep = 0.25,
      initialZoom = 1,
      wheelZoom = true,
      doubleClickZoom = true,
      onZoomChange,
      onPositionChange,
      ...props
    },
    ref
  ) => {
    const [zoom, setZoomState] = React.useState(initialZoom);
    const [position, setPositionState] = React.useState({ x: 0, y: 0 });
    const [isDragging, setIsDragging] = React.useState(false);
    const [rotation, setRotation] = React.useState(0);
    const [isFullscreen, setIsFullscreen] = React.useState(false);

    const setZoom = React.useCallback(
      (newZoom: number) => {
        const clampedZoom = Math.max(minZoom, Math.min(maxZoom, newZoom));
        setZoomState(clampedZoom);
        onZoomChange?.(clampedZoom);
      },
      [minZoom, maxZoom, onZoomChange]
    );

    const setPosition = React.useCallback(
      (newPosition: { x: number; y: number }) => {
        setPositionState(newPosition);
        onPositionChange?.(newPosition);
      },
      [onPositionChange]
    );

    const resetView = React.useCallback(() => {
      setZoom(initialZoom);
      setPosition({ x: 0, y: 0 });
      setRotation(0);
    }, [initialZoom, setZoom, setPosition]);

    const contextValue = React.useMemo(
      () => ({
        zoom,
        setZoom,
        position,
        setPosition,
        isDragging,
        setIsDragging,
        rotation,
        setRotation,
        isFullscreen,
        setIsFullscreen,
        minZoom,
        maxZoom,
        zoomStep,
        resetView,
      }),
      [
        zoom,
        setZoom,
        position,
        setPosition,
        isDragging,
        rotation,
        isFullscreen,
        minZoom,
        maxZoom,
        zoomStep,
        resetView,
      ]
    );

    return (
      <ImageZoomContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(imageZoomVariants({ size, className }))}
          {...props}
        >
          <ImageZoomCanvas
            src={src}
            alt={alt}
            wheelZoom={wheelZoom}
            doubleClickZoom={doubleClickZoom}
          />
          {children}
        </div>
      </ImageZoomContext.Provider>
    );
  }
);

ImageZoom.displayName = "ImageZoom";

// Image Zoom Canvas
interface ImageZoomCanvasProps extends React.HTMLAttributes<HTMLDivElement> {
  src: string;
  alt: string;
  wheelZoom?: boolean;
  doubleClickZoom?: boolean;
}

const ImageZoomCanvas = React.forwardRef<HTMLDivElement, ImageZoomCanvasProps>(
  ({ className, src, alt, wheelZoom = true, doubleClickZoom = true, ...props }, ref) => {
    const context = React.useContext(ImageZoomContext);
    const canvasRef = React.useRef<HTMLDivElement>(null);
    const imageRef = React.useRef<HTMLImageElement>(null);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    const [positionStart, setPositionStart] = React.useState({ x: 0, y: 0 });

    if (!context) {
      throw new Error("ImageZoomCanvas must be used within an ImageZoom");
    }

    const {
      zoom,
      setZoom,
      position,
      setPosition,
      isDragging,
      setIsDragging,
      rotation,
      isFullscreen,
      minZoom,
      maxZoom,
      zoomStep,
    } = context;

    // Handle wheel zoom
    const handleWheel = React.useCallback(
      (e: React.WheelEvent) => {
        if (!wheelZoom) return;
        
        e.preventDefault();
        const delta = e.deltaY > 0 ? -zoomStep : zoomStep;
        const newZoom = zoom + delta;
        setZoom(newZoom);
      },
      [wheelZoom, zoom, zoomStep, setZoom]
    );

    // Handle double click zoom
    const handleDoubleClick = React.useCallback(
      (e: React.MouseEvent) => {
        if (!doubleClickZoom) return;
        
        e.preventDefault();
        const newZoom = zoom === 1 ? 2 : 1;
        setZoom(newZoom);
        
        // Reset position when zooming out to 1x
        if (newZoom === 1) {
          setPosition({ x: 0, y: 0 });
        }
      },
      [doubleClickZoom, zoom, setZoom, setPosition]
    );

    // Handle mouse down for dragging
    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (zoom <= 1) return; // Only allow dragging when zoomed in
        
        e.preventDefault();
        setIsDragging(true);
        setDragStart({ x: e.clientX, y: e.clientY });
        setPositionStart(position);
      },
      [zoom, position, setIsDragging]
    );

    // Handle mouse move for dragging
    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging || zoom <= 1) return;

        const deltaX = e.clientX - dragStart.x;
        const deltaY = e.clientY - dragStart.y;

        setPosition({
          x: positionStart.x + deltaX,
          y: positionStart.y + deltaY,
        });
      },
      [isDragging, zoom, dragStart, positionStart, setPosition]
    );

    // Handle mouse up
    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
    }, [setIsDragging]);

    // Add/remove event listeners for dragging
    React.useEffect(() => {
      if (isDragging) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, handleMouseMove, handleMouseUp]);

    // Calculate transform
    const transform = `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`;

    return (
      <div
        ref={canvasRef}
        className={cn(
          "relative w-full h-64 overflow-hidden bg-muted flex items-center justify-center",
          isDragging && "cursor-grabbing",
          zoom > 1 && !isDragging && "cursor-grab",
          isFullscreen && "fixed inset-0 z-50 h-screen bg-black",
          className
        )}
        onWheel={handleWheel}
        onDoubleClick={handleDoubleClick}
        onMouseDown={handleMouseDown}
        {...props}
      >
        <img
          ref={imageRef}
          src={src}
          alt={alt}
          className="max-w-full max-h-full object-contain transition-transform duration-200 ease-out select-none"
          style={{ transform }}
          draggable={false}
        />
        
        {/* Zoom level indicator */}
        {zoom !== 1 && (
          <div className="absolute top-2 left-2 bg-black/75 text-white px-2 py-1 rounded text-xs">
            {Math.round(zoom * 100)}%
          </div>
        )}
      </div>
    );
  }
);

ImageZoomCanvas.displayName = "ImageZoomCanvas";

// Image Zoom Controls
interface ImageZoomControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const ImageZoomControls = React.forwardRef<HTMLDivElement, ImageZoomControlsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 p-3 border-t bg-background", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ImageZoomControls.displayName = "ImageZoomControls";

// Image Zoom Button
interface ImageZoomButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const ImageZoomButton = React.forwardRef<HTMLButtonElement, ImageZoomButtonProps>(
  ({ className, variant = "outline", size = "sm", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

ImageZoomButton.displayName = "ImageZoomButton";

// Zoom In Button
const ZoomInButton = React.forwardRef<HTMLButtonElement, Omit<ImageZoomButtonProps, 'onClick'>>(
  (props, ref) => {
    const context = React.useContext(ImageZoomContext);
    
    if (!context) {
      throw new Error("ZoomInButton must be used within an ImageZoom");
    }

    const { zoom, setZoom, zoomStep, maxZoom } = context;

    const handleZoomIn = () => {
      setZoom(zoom + zoomStep);
    };

    return (
      <ImageZoomButton
        ref={ref}
        onClick={handleZoomIn}
        disabled={zoom >= maxZoom}
        {...props}
      >
        <ZoomIn className="h-4 w-4" />
      </ImageZoomButton>
    );
  }
);

ZoomInButton.displayName = "ZoomInButton";

// Zoom Out Button
const ZoomOutButton = React.forwardRef<HTMLButtonElement, Omit<ImageZoomButtonProps, 'onClick'>>(
  (props, ref) => {
    const context = React.useContext(ImageZoomContext);
    
    if (!context) {
      throw new Error("ZoomOutButton must be used within an ImageZoom");
    }

    const { zoom, setZoom, zoomStep, minZoom } = context;

    const handleZoomOut = () => {
      setZoom(zoom - zoomStep);
    };

    return (
      <ImageZoomButton
        ref={ref}
        onClick={handleZoomOut}
        disabled={zoom <= minZoom}
        {...props}
      >
        <ZoomOut className="h-4 w-4" />
      </ImageZoomButton>
    );
  }
);

ZoomOutButton.displayName = "ZoomOutButton";

// Reset Button
const ResetButton = React.forwardRef<HTMLButtonElement, Omit<ImageZoomButtonProps, 'onClick'>>(
  (props, ref) => {
    const context = React.useContext(ImageZoomContext);
    
    if (!context) {
      throw new Error("ResetButton must be used within an ImageZoom");
    }

    const { resetView, zoom, position, rotation } = context;
    const isDefault = zoom === 1 && position.x === 0 && position.y === 0 && rotation === 0;

    return (
      <ImageZoomButton
        ref={ref}
        onClick={resetView}
        disabled={isDefault}
        {...props}
      >
        <Move className="h-4 w-4" />
      </ImageZoomButton>
    );
  }
);

ResetButton.displayName = "ResetButton";

// Rotate Button
const RotateButton = React.forwardRef<HTMLButtonElement, Omit<ImageZoomButtonProps, 'onClick'>>(
  (props, ref) => {
    const context = React.useContext(ImageZoomContext);
    
    if (!context) {
      throw new Error("RotateButton must be used within an ImageZoom");
    }

    const { rotation, setRotation } = context;

    const handleRotate = () => {
      setRotation((rotation + 90) % 360);
    };

    return (
      <ImageZoomButton
        ref={ref}
        onClick={handleRotate}
        {...props}
      >
        <RotateCw className="h-4 w-4" />
      </ImageZoomButton>
    );
  }
);

RotateButton.displayName = "RotateButton";

// Fullscreen Button
const FullscreenButton = React.forwardRef<HTMLButtonElement, Omit<ImageZoomButtonProps, 'onClick'>>(
  (props, ref) => {
    const context = React.useContext(ImageZoomContext);
    
    if (!context) {
      throw new Error("FullscreenButton must be used within an ImageZoom");
    }

    const { isFullscreen, setIsFullscreen } = context;

    const handleFullscreen = () => {
      setIsFullscreen(!isFullscreen);
    };

    // Handle escape key to exit fullscreen
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape' && isFullscreen) {
          setIsFullscreen(false);
        }
      };

      if (isFullscreen) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [isFullscreen, setIsFullscreen]);

    return (
      <ImageZoomButton
        ref={ref}
        onClick={handleFullscreen}
        {...props}
      >
        <Maximize2 className="h-4 w-4" />
      </ImageZoomButton>
    );
  }
);

FullscreenButton.displayName = "FullscreenButton";

// Zoom Slider
interface ZoomSliderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ZoomSlider = React.forwardRef<HTMLDivElement, ZoomSliderProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(ImageZoomContext);
    
    if (!context) {
      throw new Error("ZoomSlider must be used within an ImageZoom");
    }

    const { zoom, setZoom, minZoom, maxZoom } = context;

    const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setZoom(parseFloat(e.target.value));
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 px-2", className)}
        {...props}
      >
        <span className="text-xs text-muted-foreground">{Math.round(minZoom * 100)}%</span>
        <input
          type="range"
          min={minZoom}
          max={maxZoom}
          step={0.1}
          value={zoom}
          onChange={handleSliderChange}
          className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer"
        />
        <span className="text-xs text-muted-foreground">{Math.round(maxZoom * 100)}%</span>
      </div>
    );
  }
);

ZoomSlider.displayName = "ZoomSlider";

// Hook for accessing image zoom context
const useImageZoom = () => {
  const context = React.useContext(ImageZoomContext);
  if (!context) {
    throw new Error("useImageZoom must be used within an ImageZoom component");
  }
  return context;
};

export {
  ImageZoom,
  ImageZoomCanvas,
  ImageZoomControls,
  ImageZoomButton,
  ZoomInButton,
  ZoomOutButton,
  ResetButton,
  RotateButton,
  FullscreenButton,
  ZoomSlider,
  useImageZoom,
  imageZoomVariants,
};

export type {
  ImageZoomProps,
  ImageZoomCanvasProps,
  ImageZoomControlsProps,
  ImageZoomButtonProps,
  ImageZoomContextValue,
};
