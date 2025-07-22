/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from "../lib/utils";
import * as React from 'react';
import { forwardRef, useEffect, useState, useRef, createContext, useContext } from 'react';
import './number-flow-barvian.css';

// Types for the NumberFlowBarvian component
export type Value = number;

export type Format = Omit<Intl.NumberFormatOptions, 'notation'> & {
  notation?: 'standard' | 'compact' | undefined;
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

export type Plugin = 'continuous';

// Use the built-in Intl.NumberFormatPart types
export type NumberPartType = Intl.NumberFormatPartTypes;

// Use the built-in Intl.NumberFormatPart type
export type NumberPart = Intl.NumberFormatPart;

export type Data = {
  parts: NumberPart[];
  prefix?: string;
  suffix?: string;
};

export type Trend = number | ((oldValue: number, value: number) => number);

export interface NumberFlowBarvianProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Callback fired when animations start
   */
  onAnimationsStart?: () => void;
  /**
   * Callback fired when animations finish
   */
  onAnimationsFinish?: () => void;
  /**
   * The numeric value to display and animate
   */
  value: Value;
  /**
   * Formatting options based on Intl.NumberFormat
   */
  format?: Format;
  /**
   * The locale(s) to use for number formatting
   */
  locales?: Intl.LocalesArgument;
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
   * Animation timing for transforming digits
   */
  transformTiming?: EffectTiming;
  /**
   * Animation timing for opacity changes
   */
  opacityTiming?: EffectTiming;
  /**
   * Hint to browser for performance optimization
   */
  willChange?: boolean;
  /**
   * Whether to continuously update the number
   */
  plugins?: Plugin[];
  /**
   * Control how digits trend during animation
   * 1: digits always go up
   * 0: each digit goes up/down based on its change
   * -1: digits always go down
   */
  trend?: Trend;
  /**
   * Whether to respect user's motion preference
   */
  respectMotionPreference?: boolean;
  /**
   * Whether animations are enabled
   */
  animated?: boolean;
  /**
   * Whether to isolate this component's animations
   */
  isolate?: boolean;
}

// Formatter cache to improve performance
const formatters: Record<string, Intl.NumberFormat> = {};

/**
 * Format a number to parts using Intl.NumberFormat
 */
const formatToData = (value: Value, formatter: Intl.NumberFormat, prefix?: string, suffix?: string): Data => {
  const parts = formatter.formatToParts(value);
  return {
    parts,
    prefix,
    suffix
  };
};

/**
 * Format a number using Intl.NumberFormat with the provided options
 */
const formatNumber = (value: number, format: Format = {}, locales?: Intl.LocalesArgument): string => {
  try {
    return new Intl.NumberFormat(locales, format).format(value);
  } catch (error) {
    console.error('Error formatting number:', error);
    return value.toString();
  }
};

/**
 * Check if the browser supports reduced motion preference
 */
const prefersReducedMotion = typeof window !== 'undefined' ?
  window.matchMedia?.('(prefers-reduced-motion: reduce)') : null;

/**
 * Check if the browser can animate the component
 */
const canAnimate = typeof window !== 'undefined' &&
  'CSS' in window &&
  CSS.supports('mask-image', 'linear-gradient(#000, #000)');

/**
 * Hook to check if animations are supported and preferred
 */
export const useCanAnimate = (opts: { respectMotionPreference?: boolean } = {}): boolean => {
  const [reducedMotion, setReducedMotion] = useState(() =>
    prefersReducedMotion ? prefersReducedMotion.matches : false
  );

  useEffect(() => {
    if (!prefersReducedMotion) return;

    const handleChange = () => {
      setReducedMotion(prefersReducedMotion.matches);
    };

    prefersReducedMotion.addEventListener('change', handleChange);
    return () => prefersReducedMotion.removeEventListener('change', handleChange);
  }, []);

  return canAnimate && (!opts.respectMotionPreference || !reducedMotion);
};

// Group context for syncing animations
export type GroupContext = {
  useRegister: (ref: React.RefObject<HTMLDivElement | null>) => () => void;
  willUpdate: () => void;
  didUpdate: () => void;
};

const NumberFlowGroupContext = createContext<GroupContext | undefined>(undefined);

/**
 * NumberFlowGroup component for syncing transitions between multiple NumberFlow components
 */
export const NumberFlowBarvianGroup: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const flows = useRef(new Set<React.RefObject<HTMLDivElement | null>>());
  const updating = useRef(false);
  const pending = useRef(new WeakMap<HTMLDivElement, boolean>());

  const value = React.useMemo<GroupContext>(
    () => ({
      useRegister(ref) {
        // Register the flow reference (the actual effect is handled in the component)
        flows.current.add(ref);
        return () => {
          flows.current.delete(ref);
        };
      },
      willUpdate() {
        if (updating.current) return;
        updating.current = true;
        flows.current.forEach((ref) => {
          const element = ref.current;
          if (!element) return;

          // Mark element as pending update
          pending.current.set(element, true);

          // Prepare for animation
          element.dispatchEvent(new CustomEvent('willupdate'));
        });
      },
      didUpdate() {
        flows.current.forEach((ref) => {
          const element = ref.current;
          if (!element || !pending.current.get(element)) return;

          // Trigger animation
          element.dispatchEvent(new CustomEvent('didupdate'));
          pending.current.delete(element);
        });
        updating.current = false;
      }
    }),
    []
  );

  return <NumberFlowGroupContext.Provider value={value}>{children}</NumberFlowGroupContext.Provider>;
};

/**
 * NumberFlowBarvian component for animated number transitions with enhanced features
 *
 * @example
 * ```tsx
 * <NumberFlowBarvian value={1234} />
 * <NumberFlowBarvian
 *   value={1234.56}
 *   format={{ style: 'currency', currency: 'USD' }}
 * />
 * ```
 */
export const NumberFlowBarvian = forwardRef<HTMLDivElement, NumberFlowBarvianProps>(
  ({
    className,
    value,
    format = {},
    locales,
    prefix = '',
    suffix = '',
    spinTiming = { duration: 750, easing: 'ease-out' },
    transformTiming = { duration: 400, easing: 'ease-in-out' },
    opacityTiming = { duration: 350, easing: 'ease-out' },
    willChange = false,
    plugins = [],
    trend = 1,
    respectMotionPreference = true,
    animated = true,
    isolate = false,
    onAnimationsStart,
    onAnimationsFinish,
    ...props
  }, ref) => {
    const elementRef = useRef<HTMLDivElement>(null);
    const previousValue = useRef(value);
    const animationRef = useRef<number | null>(null);
    const startTimeRef = useRef<number | null>(null);
    const [forceUpdate, setForceUpdate] = useState(0); // Used to force re-renders during animation
    const group = useContext(NumberFlowGroupContext);
    const shouldAnimate = useCanAnimate({ respectMotionPreference }) && animated;
    const isContinuous = plugins.includes('continuous');

    // Register with group if available and not isolated
    useEffect(() => {
      if (group && !isolate) {
        // Use the cleanup function returned by useRegister
        const cleanup = group.useRegister(elementRef);
        return cleanup;
      }
    }, [group, isolate]);

    // Combine refs
    const handleRef = React.useCallback(
      (element: HTMLDivElement | null) => {
        elementRef.current = element;
        if (typeof ref === 'function') {
          ref(element);
        } else if (ref) {
          ref.current = element;
        }
      },
      [ref]
    );

    // Format the value using Intl.NumberFormat
    const localesString = React.useMemo(() => (locales ? JSON.stringify(locales) : ''), [locales]);
    const formatString = React.useMemo(() => (format ? JSON.stringify(format) : ''), [format]);
    const formattedValue = React.useMemo(() => {
      const formatter = (formatters[`${localesString}:${formatString}`] ??= new Intl.NumberFormat(
        locales,
        format
      ));
      return formatNumber(value, format, locales);
    }, [value, localesString, formatString]);

    // Handle animation
    const animate = React.useCallback((fromValue: number, toValue: number) => {
      if (!shouldAnimate || fromValue === toValue) return;

      const startAnimation = (timestamp: number) => {
        if (startTimeRef.current === null) {
          startTimeRef.current = timestamp;
        }

        const elapsed = timestamp - startTimeRef.current;
        const duration = transformTiming?.duration || 400;
        const progress = Math.min(elapsed / duration, 1);

        // Apply easing function based on transformTiming
        const easingFunction = transformTiming?.easing || 'ease-in-out';
        let easeProgress = progress;

        // Simple easing functions
        if (easingFunction === 'ease-out') {
          easeProgress = 1 - Math.pow(1 - progress, 2);
        } else if (easingFunction === 'ease-in') {
          easeProgress = progress * progress;
        } else if (easingFunction === 'ease-in-out') {
          easeProgress = progress < 0.5
            ? 2 * progress * progress
            : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        }

        // Calculate the current value based on animation progress
        const diff = toValue - fromValue;

        // Apply continuous animation if enabled
        let currentValue;
        if (isContinuous && typeof trend === 'number' && trend !== 0) {
          // For continuous animation, we pass through intermediate values
          currentValue = fromValue + (diff * easeProgress);

          // Update the data attribute for trend direction
          if (elementRef.current) {
            elementRef.current.setAttribute('data-trend', trend.toString());
          }
        } else {
          // For non-continuous, we directly set the final value at the end
          currentValue = progress >= 1 ? toValue : fromValue;

          // If trend is a function, calculate and set the trend direction
          if (typeof trend === 'function' && elementRef.current) {
            const trendValue = trend(fromValue, toValue);
            elementRef.current.setAttribute('data-trend', trendValue.toString());
          }
        }

        // Update the formatted value display
        if (elementRef.current) {
          // We'll handle the DOM updates in the render function using React state
          // This approach is more React-friendly than direct DOM manipulation
          // Force a re-render with the current animation value
          previousValue.current = currentValue;
          setForceUpdate(prev => prev + 1); // Trigger a re-render
        }

        if (progress < 1) {
          animationRef.current = requestAnimationFrame(startAnimation);
        } else {
          // Animation complete
          previousValue.current = toValue;
          startTimeRef.current = null;
          animationRef.current = null;

          // Dispatch custom event for animation completion
          if (elementRef.current) {
            elementRef.current.dispatchEvent(new CustomEvent('animationsfinish', { bubbles: true }));

            // Trigger animation finish callback
            onAnimationsFinish?.();
          }
        }
      };

      // Start the animation
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      // Trigger animation start callback
      onAnimationsStart?.();

      animationRef.current = requestAnimationFrame(startAnimation);
    }, [shouldAnimate, transformTiming, isContinuous, trend, format, locales]);

    // Handle value changes
    useEffect(() => {
      if (value === previousValue.current) return;

      // If in a group and not isolated, let the group handle the update
      if (group && !isolate) {
        group.willUpdate();
        setTimeout(() => group.didUpdate(), 0);
      } else {
        // Otherwise animate directly
        animate(previousValue.current, value);
      }

      // Cleanup function
      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    }, [value, group, isolate, animate]);

    // Add event listeners for group animations
    useEffect(() => {
      if (!elementRef.current) return;

      const element = elementRef.current;

      const handleWillUpdate = () => {
        // Prepare for animation
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          startTimeRef.current = null;
        }
      };

      const handleDidUpdate = () => {
        // Start animation
        animate(previousValue.current, value);
      };

      element.addEventListener('willupdate', handleWillUpdate);
      element.addEventListener('didupdate', handleDidUpdate);

      return () => {
        element.removeEventListener('willupdate', handleWillUpdate);
        element.removeEventListener('didupdate', handleDidUpdate);
      };
    }, [animate, value]);

    // Define CSS custom properties for animation timings
    const customProperties = {
      '--number-flow-char-height': '0.85em',
      '--number-flow-mask-height': '0.25em',
      '--number-flow-mask-width': '0.5em',
      '--number-flow-spin-duration': `${spinTiming?.duration || 750}ms`,
      '--number-flow-spin-easing': spinTiming?.easing || 'ease-out',
      '--number-flow-opacity-duration': `${opacityTiming?.duration || 350}ms`,
      '--number-flow-opacity-easing': opacityTiming?.easing || 'ease-out',
      willChange: willChange ? 'contents' : undefined,
    } as React.CSSProperties;

    // Apply different styles based on animation capability
    const containerClasses = cn(
      "inline-block relative overflow-hidden",
      shouldAnimate ? "number-flow-animated" : "number-flow-static",
      className
    );

    // Function to render the formatted number with proper markup for animation
    const renderFormattedNumber = () => {
      // Get the formatted values for both current and previous values
      const currentFormatted = formatNumber(value, format, locales);
      const previousFormatted = previousValue.current !== value ?
        formatNumber(previousValue.current, format, locales) :
        currentFormatted;

      // Split the formatted values into individual characters
      const currentChars = currentFormatted.split('');
      const previousChars = previousFormatted.split('');

      // Track if we're currently animating
      const isAnimating = shouldAnimate && previousValue.current !== value;

      return currentChars.map((char, index) => {
        // Determine if this character is a digit that should animate
        const isDigit = /[0-9]/.test(char);
        const previousChar = index < previousChars.length ? previousChars[index] : '';
        const hasChanged = char !== previousChar;

        if (isDigit) {
          // Calculate the trend direction for this specific digit
          let digitTrend = 0;
          if (typeof trend === 'number') {
            digitTrend = trend;
          } else if (typeof trend === 'function') {
            digitTrend = trend(Number(previousChar) || 0, Number(char) || 0);
          } else if (hasChanged) {
            // Default behavior: determine trend based on value change
            digitTrend = Number(char) > Number(previousChar) ? 1 : -1;
          }

          return (
            <span
              key={`digit-${index}-${forceUpdate}`}
              className="number-flow-digit"
              data-value={char}
              data-previous={previousChar}
              data-animating={isAnimating && hasChanged}
              data-trend={digitTrend}
            >
              {char}
            </span>
          );
        } else {
          // Non-digit characters (commas, decimals, etc.)
          return (
            <span
              key={`char-${index}-${forceUpdate}`}
              className="number-flow-separator"
            >
              {char}
            </span>
          );
        }
      });
    };

    return (
      <div
        ref={handleRef}
        className={containerClasses}
        style={customProperties}
        data-trend={typeof trend === 'number' ? trend : 0}
        {...props}
      >
        <span
          className="inline-flex items-center"
          aria-live="polite"
          aria-atomic="true"
        >
          {prefix && <span className="number-flow-prefix">{prefix}</span>}
          <span className="number-flow-value">
            {renderFormattedNumber()}
          </span>
          {suffix && <span className="number-flow-suffix">{suffix}</span>}
        </span>
      </div>
    );
  }
);

NumberFlowBarvian.displayName = "NumberFlowBarvian";

// Export continuous plugin for convenience
export const continuous: Plugin = 'continuous';

// Export the component as default as well
export default NumberFlowBarvian;
