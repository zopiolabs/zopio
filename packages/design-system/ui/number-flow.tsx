/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from "../lib/utils";
import { forwardRef, useEffect, useState, useRef } from 'react';

// Define types to match the expected NumberFlow API
export type Format = {
  style?: 'decimal' | 'currency' | 'percent' | 'unit';
  currency?: string;
  currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name';
  currencySign?: 'standard' | 'accounting';
  notation?: 'standard' | 'scientific' | 'engineering' | 'compact';
  compactDisplay?: 'short' | 'long';
  signDisplay?: 'auto' | 'never' | 'always' | 'exceptZero';
  unit?: string;
  unitDisplay?: 'short' | 'long' | 'narrow';
  minimumIntegerDigits?: number;
  minimumFractionDigits?: number;
  maximumFractionDigits?: number;
  minimumSignificantDigits?: number;
  maximumSignificantDigits?: number;
  useGrouping?: boolean | 'always' | 'auto' | 'min2';
  roundingMode?: 'ceil' | 'floor' | 'expand' | 'trunc' | 'halfCeil' | 'halfFloor' | 'halfExpand' | 'halfTrunc' | 'halfEven';
};

export type EffectTiming = {
  duration?: number;
  easing?: string;
  delay?: number;
  endDelay?: number;
  fill?: 'none' | 'forwards' | 'backwards' | 'both' | 'auto';
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
  iterations?: number;
  iterationStart?: number;
};

export interface NumberFlowProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The numeric value to display and animate
   */
  value: number;
  /**
   * Formatting options based on Intl.NumberFormat
   * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
   */
  format?: Format;
  /**
   * The locale(s) to use for number formatting
   */
  locales?: string | string[];
  /**
   * Text to display before the number
   */
  prefix?: string;
  /**
   * Text to display after the number
   */
  suffix?: string;
  /**
   * Animation timing for spinning digits
   */
  spinTiming?: EffectTiming;
  /**
   * Hint to browser for performance optimization
   */
  willChange?: boolean;
  /**
   * Whether to continuously update the number
   */
  continuous?: boolean;
  /**
   * Animation timing for transforming digits
   */
  transformTiming?: EffectTiming;
  /**
   * Control how digits trend during animation
   * 1: digits always go up
   * 0: each digit goes up/down based on its change
   * -1: digits always go down
   */
  trend?: (oldValue: number, newValue: number) => number;
}

/**
 * Format a number using Intl.NumberFormat with the provided options
 */
const formatNumber = (value: number, format: Format = {}, locales?: string | string[]): string => {
  try {
    // Convert our Format type to the actual Intl.NumberFormat options
    const intlOptions: Intl.NumberFormatOptions = {
      ...format,
      // Handle the useGrouping property specifically
      useGrouping: typeof format.useGrouping === 'boolean' ? format.useGrouping : undefined,
    };
    
    return new Intl.NumberFormat(locales || undefined, intlOptions).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

/**
 * NumberFlow component for animated number transitions
 * 
 * @example
 * ```tsx
 * <NumberFlow value={1234} />
 * <NumberFlow 
 *   value={1234.56} 
 *   format={{ style: 'currency', currency: 'USD' }} 
 * />
 * ```
 */
const NumberFlow = forwardRef<HTMLDivElement, NumberFlowProps>(
  ({ 
    className,
    value,
    format = {},
    locales,
    prefix = '',
    suffix = '',
    spinTiming = { duration: 600, easing: 'ease-out' },
    transformTiming = { duration: 400, easing: 'ease-in-out' },
    willChange = false,
    continuous = false,
    trend,
    ...props
  }, ref) => {
    const [displayValue, setDisplayValue] = useState(value);
    const [formattedValue, setFormattedValue] = useState('');
    const previousValue = useRef(value);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    
    // Format the number whenever displayValue or format options change
    useEffect(() => {
      const formatted = formatNumber(displayValue, format, locales);
      setFormattedValue(formatted);
    }, [displayValue, format, locales]);
    
    // Handle value changes with animation
    useEffect(() => {
      if (value === previousValue.current) return;
      
      const startAnimation = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }
        
        const elapsed = timestamp - startTimeRef.current;
        const duration = transformTiming?.duration || 400;
        const progress = Math.min(elapsed / duration, 1);
        
        // Simple easing function (ease-out)
        const easeProgress = 1 - Math.pow(1 - progress, 2);
        
        // Calculate the current value based on animation progress
        const diff = value - previousValue.current;
        const current = previousValue.current + (diff * easeProgress);
        
        setDisplayValue(current);
        
        if (progress < 1) {
          animationRef.current = requestAnimationFrame(startAnimation);
        } else {
          // Animation complete
          setDisplayValue(value);
          previousValue.current = value;
          startTimeRef.current = null;
          animationRef.current = null;
        }
      };
      
      // Start the animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      animationRef.current = requestAnimationFrame(startAnimation);
      
      // Cleanup function
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [value, transformTiming]);
    
    const containerStyle = willChange ? { willChange: 'contents' } : {};
    
    return (
      <div 
        ref={ref} 
        className={cn("inline-block", className)} 
        style={containerStyle} 
        {...props}
      >
        <span aria-live="polite" aria-atomic="true">
          {prefix}{formattedValue}{suffix}
        </span>
      </div>
    );
  }
);

NumberFlow.displayName = "NumberFlow";

export { NumberFlow };

