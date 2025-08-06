/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from "@repo/design-system/lib/utils";
import { ArrowUp } from "lucide-react";
import * as React from 'react';
import { forwardRef } from 'react';
import { NumberFlowBarvian, useCanAnimate, Format } from './number-flow-barvian';
import { motion, MotionConfig, HTMLMotionProps } from 'framer-motion';

// Create motion versions of our components
const MotionNumberFlow = motion.create(NumberFlowBarvian);
const MotionArrowUp = motion.create(ArrowUp);

export interface NumberFlowMotionProps extends Omit<HTMLMotionProps<"span">, 'onAnimationStart' | 'onDrag' | 'onDragEnd' | 'onDragStart'> {
  /**
   * The value to display and animate
   */
  value: number;
  /**
   * Format options for the number display
   */
  format?: Format;
  /**
   * Whether to show the trend indicator arrow
   */
  showTrend?: boolean;
}

/**
 * NumberFlowMotion component with enhanced animations using framer-motion
 *
 * @example
 * ```tsx
 * <NumberFlowMotion value={0.25} format={{ style: 'percent' }} />
 * ```
 */
export const NumberFlowMotion = forwardRef<HTMLSpanElement, NumberFlowMotionProps>(
  ({
    className,
    value,
    format = { style: 'percent', maximumFractionDigits: 2 },
    showTrend = true,
    ...props
  }, ref) => {
    const canAnimate = useCanAnimate();

    return (
      <MotionConfig
        // Disable layout animations if NumberFlow can't animate
        transition={{
          layout: canAnimate
            ? { duration: 0.9, bounce: 0, type: 'spring' }
            : { duration: 0 }
        }}
      >
        <motion.span
          ref={ref}
          className={cn(
            value > 0 ? "bg-emerald-400" : "bg-red-500",
            "inline-flex items-center px-[0.3em] text-white rounded-full",
            className
          )}
          layout
          {...props}
        >
          {showTrend && (
            <MotionArrowUp
              className="mr-0.5 h-[0.75em] w-[0.75em]"
              strokeWidth={3}
              layout // undo parent
              transition={{
                rotate: canAnimate
                  ? { type: 'spring', duration: 0.5, bounce: 0 }
                  : { duration: 0 }
              }}
              animate={{ rotate: value > 0 ? 0 : -180 }}
              initial={false}
            />
          )}

          <MotionNumberFlow
            value={value}
            format={format}
            className="font-semibold"
            style={{
              '--number-flow-char-height': '0.85em',
              '--number-flow-mask-height': '0.3em'
            } as React.CSSProperties}
            // Important for proper layout animations
            layout
            layoutRoot
            willChange={true}
          />
        </motion.span>
      </MotionConfig>
    );
  }
);

NumberFlowMotion.displayName = "NumberFlowMotion";

export default NumberFlowMotion;
