/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from "@repo/design-system/lib/utils";
import * as React from 'react';
import { forwardRef } from 'react';
import NumberFlow, { type Value } from "@number-flow/react";
import { useCanAnimate, type Format } from './number-flow-barvian';

/**
 * Custom hook to cycle through an array of values
 */
function useCycle<T>(options: Array<T>, defaultValue?: T) {
  const [index, setIndex] = React.useState(defaultValue ? undefined : 0);
  const next = () => setIndex((i) => ((i ?? -1) + 1) % options.length);

  return [
    index == null && defaultValue ? defaultValue : options[index ?? 0]!,
    next,
  ] as const;
}

export interface NumberCounterProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  /**
   * Array of numeric values to cycle through
   */
  values: number[];
  
  /**
   * Optional trend indicator for the animation direction
   * 1: digits always go up
   * 0: each digit goes up/down based on its change
   * -1: digits always go down
   */
  trend?: number;
  
  /**
   * Optional callback when the value changes
   */
  onChange?: (value: number) => void;
  
  /**
   * Format options for the number display
   */
  format?: Format;
  
  /**
   * Optional click handler to override the default cycling behavior
   */
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

/**
 * NumberCounter component that cycles through a list of values with animation
 *
 * @example
 * ```tsx
 * <NumberCounter values={[543, 12000, -3200]} />
 * ```
 */
export const NumberCounter = forwardRef<HTMLDivElement, NumberCounterProps>(
  ({
    className,
    values,
    trend = 0,
    format = { notation: "compact" },
    onChange,
    onClick,
    ...props
  }, ref) => {
    const [value, cycleValue] = useCycle(values);
    const canAnimate = useCanAnimate();
    
    // Handle click to cycle through values
    const handleClick = React.useCallback((event: React.MouseEvent<HTMLDivElement>) => {
      if (onClick) {
        onClick(event);
      } else {
        cycleValue();
        if (onChange) {
          onChange(value);
        }
      }
    }, [cycleValue, onChange, onClick, value]);
    
    return (
      <div
        ref={ref}
        className={cn(
          "flex flex-col items-center justify-center cursor-pointer select-none",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        <NumberFlow 
          value={value} 
          trend={trend} 
          format={format}
          className={cn(
            "font-medium text-2xl",
            value > 0 ? "dark:text-emerald-400 text-emerald-600" : 
            value < 0 ? "dark:text-red-400 text-red-600" : 
            "dark:text-slate-400 text-slate-600"
          )}
          style={{
            '--number-flow-char-height': '0.85em',
            '--number-flow-mask-height': '0.3em'
          } as React.CSSProperties}
        />
        <p className="mt-1 dark:text-slate-400 text-slate-500 text-xs">
          Click to cycle values
        </p>
      </div>
    );
  }
);

NumberCounter.displayName = "NumberCounter";

export default NumberCounter;
