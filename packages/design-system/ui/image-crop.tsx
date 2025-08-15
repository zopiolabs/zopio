/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Crop, RotateCcw, Download, Upload } from "lucide-react";
import { cn } from "../lib/utils";

const imageCropVariants = cva(
  "relative overflow-hidden rounded-lg border bg-background",
  {
    variants: {
      size: {
        sm: "max-w-sm",
        md: "max-w-md",
        lg: "max-w-lg",
        xl: "max-w-xl",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

interface ImageCropContextValue {
  image?: HTMLImageElement;
  cropArea: CropArea;
  setCropArea: React.Dispatch<React.SetStateAction<CropArea>>;
  aspectRatio?: number;
  circular: boolean;
  isDragging: boolean;
  setIsDragging: (dragging: boolean) => void;
  onCrop?: (croppedImageUrl: string) => void;
}

const ImageCropContext = React.createContext<ImageCropContextValue | null>(null);

interface ImageCropProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof imageCropVariants> {
  src?: string;
  aspectRatio?: number;
  circular?: boolean;
  maxFileSize?: number; // in bytes
  onCrop?: (croppedImageUrl: string) => void;
  onImageLoad?: (image: HTMLImageElement) => void;
}

const ImageCrop = React.forwardRef<HTMLDivElement, ImageCropProps>(
  (
    {
      className,
      size,
      children,
      src,
      aspectRatio,
      circular = false,
      maxFileSize,
      onCrop,
      onImageLoad,
      ...props
    },
    ref
  ) => {
    const [image, setImage] = React.useState<HTMLImageElement>();
    const [cropArea, setCropArea] = React.useState<CropArea>({
      x: 0,
      y: 0,
      width: 100,
      height: 100,
    });
    const [isDragging, setIsDragging] = React.useState(false);

    React.useEffect(() => {
      if (src) {
        const img = new Image();
        img.onload = () => {
          setImage(img);
          onImageLoad?.(img);
          
          // Initialize crop area to center of image
          const initialSize = Math.min(img.width, img.height) * 0.8;
          const initialWidth = aspectRatio ? initialSize : initialSize;
          const initialHeight = aspectRatio ? initialSize / aspectRatio : initialSize;
          
          setCropArea({
            x: (img.width - initialWidth) / 2,
            y: (img.height - initialHeight) / 2,
            width: initialWidth,
            height: initialHeight,
          });
        };
        img.crossOrigin = "anonymous";
        img.src = src;
      }
    }, [src, aspectRatio, onImageLoad]);

    const contextValue = React.useMemo(
      () => ({
        image,
        cropArea,
        setCropArea,
        aspectRatio,
        circular,
        isDragging,
        setIsDragging,
        onCrop,
      }),
      [image, cropArea, aspectRatio, circular, isDragging, onCrop]
    );

    return (
      <ImageCropContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(imageCropVariants({ size, className }))}
          {...props}
        >
          {children}
        </div>
      </ImageCropContext.Provider>
    );
  }
);

ImageCrop.displayName = "ImageCrop";

// Image Crop Canvas
interface ImageCropCanvasProps extends React.HTMLAttributes<HTMLDivElement> {}

const ImageCropCanvas = React.forwardRef<HTMLDivElement, ImageCropCanvasProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(ImageCropContext);
    const canvasRef = React.useRef<HTMLDivElement>(null);
    const [isDragging, setIsDragging] = React.useState(false);
    const [isResizing, setIsResizing] = React.useState(false);
    const [dragStart, setDragStart] = React.useState({ x: 0, y: 0 });
    const [resizeHandle, setResizeHandle] = React.useState<string>('');

    if (!context) {
      throw new Error("ImageCropCanvas must be used within an ImageCrop");
    }

    const { image, cropArea, setCropArea, aspectRatio, circular } = context;

    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent, handle?: string) => {
        e.preventDefault();
        const rect = canvasRef.current?.getBoundingClientRect();
        if (!rect) return;

        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        if (handle) {
          setIsResizing(true);
          setResizeHandle(handle);
        } else {
          setIsDragging(true);
        }

        setDragStart({ x, y });
      },
      []
    );

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!isDragging && !isResizing) return;
        if (!canvasRef.current || !image) return;

        const rect = canvasRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const deltaX = x - dragStart.x;
        const deltaY = y - dragStart.y;

        const scaleX = image.width / rect.width;
        const scaleY = image.height / rect.height;

        if (isDragging) {
          setCropArea(prev => ({
            ...prev,
            x: Math.max(0, Math.min(image.width - prev.width, prev.x + deltaX * scaleX)),
            y: Math.max(0, Math.min(image.height - prev.height, prev.y + deltaY * scaleY)),
          }));
        } else if (isResizing) {
          setCropArea(prev => {
            let newWidth = prev.width;
            let newHeight = prev.height;
            let newX = prev.x;
            let newY = prev.y;

            if (resizeHandle.includes('right')) {
              newWidth = Math.max(20, Math.min(image.width - prev.x, prev.width + deltaX * scaleX));
            }
            if (resizeHandle.includes('left')) {
              const widthChange = deltaX * scaleX;
              newWidth = Math.max(20, prev.width - widthChange);
              newX = Math.max(0, prev.x + widthChange);
            }
            if (resizeHandle.includes('bottom')) {
              newHeight = Math.max(20, Math.min(image.height - prev.y, prev.height + deltaY * scaleY));
            }
            if (resizeHandle.includes('top')) {
              const heightChange = deltaY * scaleY;
              newHeight = Math.max(20, prev.height - heightChange);
              newY = Math.max(0, prev.y + heightChange);
            }

            // Maintain aspect ratio if specified
            if (aspectRatio) {
              if (resizeHandle.includes('right') || resizeHandle.includes('left')) {
                newHeight = newWidth / aspectRatio;
              } else {
                newWidth = newHeight * aspectRatio;
              }
            }

            return { x: newX, y: newY, width: newWidth, height: newHeight };
          });
        }

        setDragStart({ x, y });
      },
      [isDragging, isResizing, dragStart, image, aspectRatio, setCropArea, resizeHandle]
    );

    const handleMouseUp = React.useCallback(() => {
      setIsDragging(false);
      setIsResizing(false);
      setResizeHandle('');
    }, []);

    React.useEffect(() => {
      if (isDragging || isResizing) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        return () => {
          document.removeEventListener('mousemove', handleMouseMove);
          document.removeEventListener('mouseup', handleMouseUp);
        };
      }
    }, [isDragging, isResizing, handleMouseMove, handleMouseUp]);

    if (!image) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex items-center justify-center h-64 bg-muted rounded-md",
            className
          )}
          {...props}
        >
          <div className="text-center text-muted-foreground">
            <Upload className="h-8 w-8 mx-auto mb-2" />
            <div className="text-sm">No image selected</div>
          </div>
        </div>
      );
    }

    const containerAspectRatio = image.width / image.height;
    const containerWidth = 400;
    const containerHeight = containerWidth / containerAspectRatio;

    const scaleX = containerWidth / image.width;
    const scaleY = containerHeight / image.height;

    const scaledCropArea = {
      x: cropArea.x * scaleX,
      y: cropArea.y * scaleY,
      width: cropArea.width * scaleX,
      height: cropArea.height * scaleY,
    };

    return (
      <div
        ref={canvasRef}
        className={cn(
          "relative bg-checkered bg-opacity-50 select-none",
          className
        )}
        style={{ width: containerWidth, height: containerHeight }}
        {...props}
      >
        {/* Background image */}
        <img
          src={image.src}
          alt="Crop preview"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none"
          draggable={false}
        />

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-50 pointer-events-none" />

        {/* Crop area */}
        <div
          className={cn(
            "absolute border-2 border-white bg-transparent cursor-move",
            circular && "rounded-full"
          )}
          style={{
            left: scaledCropArea.x,
            top: scaledCropArea.y,
            width: scaledCropArea.width,
            height: scaledCropArea.height,
          }}
          onMouseDown={(e) => handleMouseDown(e)}
        >
          {/* Crop preview */}
          <div
            className={cn(
              "absolute inset-0 overflow-hidden",
              circular && "rounded-full"
            )}
          >
            <img
              src={image.src}
              alt="Crop area"
              className="absolute object-contain pointer-events-none"
              style={{
                left: -scaledCropArea.x,
                top: -scaledCropArea.y,
                width: containerWidth,
                height: containerHeight,
              }}
              draggable={false}
            />
          </div>

          {/* Resize handles */}
          {!circular && (
            <>
              {/* Corner handles */}
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-nw-resize -top-1 -left-1"
                onMouseDown={(e) => handleMouseDown(e, 'top-left')}
              />
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-ne-resize -top-1 -right-1"
                onMouseDown={(e) => handleMouseDown(e, 'top-right')}
              />
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-sw-resize -bottom-1 -left-1"
                onMouseDown={(e) => handleMouseDown(e, 'bottom-left')}
              />
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-se-resize -bottom-1 -right-1"
                onMouseDown={(e) => handleMouseDown(e, 'bottom-right')}
              />

              {/* Edge handles */}
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-n-resize -top-1 left-1/2 transform -translate-x-1/2"
                onMouseDown={(e) => handleMouseDown(e, 'top')}
              />
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-s-resize -bottom-1 left-1/2 transform -translate-x-1/2"
                onMouseDown={(e) => handleMouseDown(e, 'bottom')}
              />
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-w-resize -left-1 top-1/2 transform -translate-y-1/2"
                onMouseDown={(e) => handleMouseDown(e, 'left')}
              />
              <div
                className="absolute w-3 h-3 bg-white border border-gray-300 cursor-e-resize -right-1 top-1/2 transform -translate-y-1/2"
                onMouseDown={(e) => handleMouseDown(e, 'right')}
              />
            </>
          )}
        </div>
      </div>
    );
  }
);

ImageCropCanvas.displayName = "ImageCropCanvas";

// Image Crop Controls
interface ImageCropControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const ImageCropControls = React.forwardRef<HTMLDivElement, ImageCropControlsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-2 p-3 border-t", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ImageCropControls.displayName = "ImageCropControls";

// Image Crop Button
interface ImageCropButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

const ImageCropButton = React.forwardRef<HTMLButtonElement, ImageCropButtonProps>(
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

ImageCropButton.displayName = "ImageCropButton";

// Crop Image Function
const cropImage = (
  image: HTMLImageElement,
  cropArea: CropArea,
  circular: boolean = false,
  maxFileSize?: number
): Promise<string> => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      resolve('');
      return;
    }

    canvas.width = cropArea.width;
    canvas.height = cropArea.height;

    if (circular) {
      // Create circular clip
      ctx.beginPath();
      ctx.arc(cropArea.width / 2, cropArea.height / 2, Math.min(cropArea.width, cropArea.height) / 2, 0, 2 * Math.PI);
      ctx.clip();
    }

    ctx.drawImage(
      image,
      cropArea.x,
      cropArea.y,
      cropArea.width,
      cropArea.height,
      0,
      0,
      cropArea.width,
      cropArea.height
    );

    let quality = 0.9;
    let dataUrl = canvas.toDataURL('image/png', quality);

    // Compress if needed
    if (maxFileSize) {
      while (dataUrl.length > maxFileSize && quality > 0.1) {
        quality -= 0.1;
        dataUrl = canvas.toDataURL('image/jpeg', quality);
      }
    }

    resolve(dataUrl);
  });
};

// Hook for accessing image crop context
const useImageCrop = () => {
  const context = React.useContext(ImageCropContext);
  if (!context) {
    throw new Error("useImageCrop must be used within an ImageCrop component");
  }
  return context;
};

export {
  ImageCrop,
  ImageCropCanvas,
  ImageCropControls,
  ImageCropButton,
  useImageCrop,
  cropImage,
  imageCropVariants,
};

export type {
  ImageCropProps,
  ImageCropCanvasProps,
  ImageCropControlsProps,
  ImageCropButtonProps,
  CropArea,
  ImageCropContextValue,
};
