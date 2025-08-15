/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { GripVertical } from "lucide-react";
import { cn } from "../lib/utils";

const comparisonVariants = cva(
  "relative overflow-hidden rounded-lg",
  {
    variants: {
      size: {
        sm: "h-48",
        md: "h-64",
        lg: "h-80",
        xl: "h-96",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface ComparisonContextValue {
  position: number;
  isDragging: boolean;
  mode: "drag" | "hover";
}

const ComparisonContext = React.createContext<ComparisonContextValue | null>(null);

interface ComparisonProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof comparisonVariants> {
  defaultPosition?: number;
  position?: number;
  onPositionChange?: (position: number) => void;
  mode?: "drag" | "hover";
  disabled?: boolean;
}

const Comparison = React.forwardRef<HTMLDivElement, ComparisonProps>(
  (
    {
      className,
      size,
      children,
      defaultPosition = 50,
      position,
      onPositionChange,
      mode = "drag",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalPosition, setInternalPosition] = React.useState(
      position !== undefined ? position : defaultPosition
    );
    const [isDragging, setIsDragging] = React.useState(false);
    const containerRef = React.useRef<HTMLDivElement>(null);

    const currentPosition = position !== undefined ? position : internalPosition;

    const updatePosition = React.useCallback(
      (newPosition: number) => {
        const clampedPosition = Math.max(0, Math.min(100, newPosition));
        if (position === undefined) {
          setInternalPosition(clampedPosition);
        }
        onPositionChange?.(clampedPosition);
      },
      [position, onPositionChange]
    );

    const handleMouseMove = React.useCallback(
      (e: MouseEvent) => {
        if (!containerRef.current || disabled) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        updatePosition(percentage);
      },
      [updatePosition, disabled]
    );

    const handleTouchMove = React.useCallback(
      (e: TouchEvent) => {
        if (!containerRef.current || disabled) return;

        const rect = containerRef.current.getBoundingClientRect();
        const x = e.touches[0].clientX - rect.left;
        const percentage = (x / rect.width) * 100;
        updatePosition(percentage);
      },
      [updatePosition, disabled]
    );

    const handleMouseDown = React.useCallback(
      (e: React.MouseEvent) => {
        if (mode !== "drag" || disabled) return;
        e.preventDefault();
        setIsDragging(true);
        handleMouseMove(e.nativeEvent);
      },
      [mode, disabled, handleMouseMove]
    );

    const handleTouchStart = React.useCallback(
      (e: React.TouchEvent) => {
        if (mode !== "drag" || disabled) return;
        e.preventDefault();
        setIsDragging(true);
        handleTouchMove(e.nativeEvent);
      },
      [mode, disabled, handleTouchMove]
    );

    const handleHoverMove = React.useCallback(
      (e: React.MouseEvent) => {
        if (mode !== "hover" || disabled) return;
        handleMouseMove(e.nativeEvent);
      },
      [mode, disabled, handleMouseMove]
    );

    React.useEffect(() => {
      if (!isDragging || mode !== "drag") return;

      const handleMouseUp = () => setIsDragging(false);
      const handleMouseMoveGlobal = (e: MouseEvent) => handleMouseMove(e);
      const handleTouchEnd = () => setIsDragging(false);
      const handleTouchMoveGlobal = (e: TouchEvent) => handleTouchMove(e);

      document.addEventListener("mouseup", handleMouseUp);
      document.addEventListener("mousemove", handleMouseMoveGlobal);
      document.addEventListener("touchend", handleTouchEnd);
      document.addEventListener("touchmove", handleTouchMoveGlobal);

      return () => {
        document.removeEventListener("mouseup", handleMouseUp);
        document.removeEventListener("mousemove", handleMouseMoveGlobal);
        document.removeEventListener("touchend", handleTouchEnd);
        document.removeEventListener("touchmove", handleTouchMoveGlobal);
      };
    }, [isDragging, mode, handleMouseMove, handleTouchMove]);

    React.useEffect(() => {
      if (position !== undefined) {
        setInternalPosition(position);
      }
    }, [position]);

    const contextValue = React.useMemo(
      () => ({
        position: currentPosition,
        isDragging,
        mode,
      }),
      [currentPosition, isDragging, mode]
    );

    return (
      <ComparisonContext.Provider value={contextValue}>
        <div
          ref={(node) => {
            containerRef.current = node;
            if (typeof ref === "function") {
              ref(node);
            } else if (ref) {
              ref.current = node;
            }
          }}
          className={cn(
            comparisonVariants({ size, className }),
            disabled && "opacity-50 cursor-not-allowed",
            mode === "hover" && !disabled && "cursor-crosshair",
            mode === "drag" && !disabled && "cursor-grab",
            isDragging && "cursor-grabbing select-none"
          )}
          onMouseDown={handleMouseDown}
          onTouchStart={handleTouchStart}
          onMouseMove={handleHoverMove}
          {...props}
        >
          {children}
          
          {/* Slider Line */}
          <div
            className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg z-20 transition-opacity"
            style={{ left: `${currentPosition}%` }}
          />
          
          {/* Slider Handle */}
          <div
            className={cn(
              "absolute top-1/2 w-8 h-8 bg-white rounded-full shadow-lg border-2 border-gray-200 z-30 flex items-center justify-center transition-all",
              "transform -translate-x-1/2 -translate-y-1/2",
              !disabled && "hover:scale-110",
              isDragging && "scale-110"
            )}
            style={{ left: `${currentPosition}%` }}
          >
            <GripVertical className="h-4 w-4 text-gray-600" />
          </div>
        </div>
      </ComparisonContext.Provider>
    );
  }
);

Comparison.displayName = "Comparison";

// Comparison Before component
interface ComparisonBeforeProps extends React.HTMLAttributes<HTMLDivElement> {}

const ComparisonBefore = React.forwardRef<HTMLDivElement, ComparisonBeforeProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(ComparisonContext);
    
    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 z-10", className)}
        style={{
          clipPath: `inset(0 ${100 - (context?.position || 50)}% 0 0)`,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComparisonBefore.displayName = "ComparisonBefore";

// Comparison After component
interface ComparisonAfterProps extends React.HTMLAttributes<HTMLDivElement> {}

const ComparisonAfter = React.forwardRef<HTMLDivElement, ComparisonAfterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("absolute inset-0 z-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ComparisonAfter.displayName = "ComparisonAfter";

// Hook for accessing comparison context
const useComparison = () => {
  const context = React.useContext(ComparisonContext);
  if (!context) {
    throw new Error("useComparison must be used within a Comparison component");
  }
  return context;
};

export {
  Comparison,
  ComparisonBefore,
  ComparisonAfter,
  useComparison,
  comparisonVariants,
};

export type {
  ComparisonProps,
  ComparisonBeforeProps,
  ComparisonAfterProps,
  ComparisonContextValue,
};
