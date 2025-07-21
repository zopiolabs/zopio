/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import React, { useRef, useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence, useSpring } from "framer-motion";
import { cn } from "@repo/design-system/lib/utils";

export interface ExpandableCardProps {
  children: React.ReactNode;
  className?: string;
  defaultExpanded?: boolean;
  onExpandChange?: (expanded: boolean) => void;
  expandedClassName?: string;
  collapsedClassName?: string;
}

export interface ExpandableCardHeaderProps {
  className?: string;
  children: React.ReactNode;
}

export interface ExpandableCardContentProps {
  className?: string;
  children: React.ReactNode;
}

export interface ExpandableCardFooterProps {
  className?: string;
  children: React.ReactNode;
}

export interface ExpandableCardTriggerProps {
  className?: string;
  children: React.ReactNode | ((props: { isExpanded: boolean }) => React.ReactElement);
  asChild?: boolean;
}

export interface UseExpandableOptions {
  initialState?: boolean;
  onChange?: (expanded: boolean) => void;
}

export function useExpandable(options: UseExpandableOptions = {}) {
  const { initialState = false, onChange } = options;
  const [isExpanded, setIsExpanded] = useState(initialState);

  const springConfig = { stiffness: 300, damping: 30 };
  const animatedHeight = useSpring(0, springConfig);

  const toggleExpand = useCallback(() => {
    const newState = !isExpanded;
    setIsExpanded(newState);
    onChange?.(newState);
  }, [isExpanded, onChange]);

  return { isExpanded, toggleExpand, animatedHeight, setIsExpanded };
}

interface ExpandableCardContextType {
  isExpanded: boolean;
  toggleExpand: () => void;
  animatedHeight: any;
  contentRef: React.RefObject<HTMLDivElement | null>;
}

// Using a dummy ref as default value that satisfies TypeScript
const dummyRef = { current: null };

const ExpandableCardContext = React.createContext<ExpandableCardContextType>({
  isExpanded: false,
  toggleExpand: () => {},
  animatedHeight: null,
  contentRef: dummyRef,
});

export const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  ({ children, className, defaultExpanded = false, onExpandChange, expandedClassName, collapsedClassName, ...props }, ref) => {
    const { isExpanded, toggleExpand, animatedHeight } = useExpandable({
      initialState: defaultExpanded,
      onChange: onExpandChange,
    });
    // Using a type assertion to make TypeScript happy with the ref type
    const contentRef = useRef<HTMLDivElement>(null) as React.RefObject<HTMLDivElement>;

    useEffect(() => {
      if (contentRef.current) {
        animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
      }
    }, [isExpanded, animatedHeight]);

    const cardClassName = cn(
      "rounded-xl border bg-card text-card-foreground shadow-sm transition-all duration-300",
      className,
      isExpanded ? expandedClassName : collapsedClassName
    );

    return (
      <ExpandableCardContext.Provider value={{ isExpanded, toggleExpand, animatedHeight, contentRef }}>
        <div ref={ref} className={cardClassName} {...props}>
          {children}
        </div>
      </ExpandableCardContext.Provider>
    );
  }
);

ExpandableCard.displayName = "ExpandableCard";

export const ExpandableCardHeader = React.forwardRef<HTMLDivElement, ExpandableCardHeaderProps>(
  ({ className, children, ...props }, ref) => {
    const { toggleExpand } = React.useContext(ExpandableCardContext);

    return (
      <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-4", className)}
        onClick={toggleExpand}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ExpandableCardHeader.displayName = "ExpandableCardHeader";

export const ExpandableCardTrigger = React.forwardRef<HTMLDivElement, ExpandableCardTriggerProps>(
  ({ className, children, asChild = false, ...props }, ref) => {
    const { toggleExpand, isExpanded } = React.useContext(ExpandableCardContext);
    const Comp = asChild ? React.Fragment : "div";

    // When using Fragment, we can't forward the ref directly
    if (asChild) {
      return (
        <Comp>
          <div
            ref={ref}
            className={cn("cursor-pointer", className)}
            onClick={(e) => {
              e.stopPropagation();
              toggleExpand();
            }}
            {...props}
          >
            {typeof children === 'function' ? children({ isExpanded }) : children}
          </div>
        </Comp>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("cursor-pointer", className)}
        onClick={(e) => {
          e.stopPropagation();
          toggleExpand();
        }}
        {...props}
      >
        {typeof children === 'function' ? children({ isExpanded }) : children}
      </div>
    );
  }
);

ExpandableCardTrigger.displayName = "ExpandableCardTrigger";

export const ExpandableCardContent = React.forwardRef<HTMLDivElement, ExpandableCardContentProps>(
  ({ className, children, ...props }, ref) => {
    const { isExpanded, animatedHeight, contentRef } = React.useContext(ExpandableCardContext);

    return (
      <motion.div
        style={{ height: animatedHeight }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="overflow-hidden"
      >
        <div ref={contentRef}>
          <AnimatePresence>
            {isExpanded && (
              <motion.div
                ref={ref}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={cn("px-6", className)}
                {...props}
              >
                {children}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }
);

ExpandableCardContent.displayName = "ExpandableCardContent";

export const ExpandableCardFooter = React.forwardRef<HTMLDivElement, ExpandableCardFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ExpandableCardFooter.displayName = "ExpandableCardFooter";

// These components are already exported individually above
// No need to re-export them
