/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '@repo/design-system/lib/utils';

interface DualRangeSliderProps extends React.ComponentProps<typeof SliderPrimitive.Root> {
  /**
   * Function to render the label for each thumb
   */
  label?: (value: number | undefined) => React.ReactNode;
  /**
   * Position of the label relative to the thumb
   * @default 'top'
   */
  labelPosition?: 'top' | 'bottom';
}

/**
 * A dual range slider component that allows users to select a range between two values.
 */
const DualRangeSlider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  DualRangeSliderProps
>(({ className, label, labelPosition = 'top', ...props }, ref) => {
  const initialValue = React.useMemo(
    () => (Array.isArray(props.value) ? props.value : [props.min ?? 0, props.max ?? 100]),
    [props.value, props.min, props.max]
  );

  return (
    <SliderPrimitive.Root
      ref={ref}
      data-slot="dual-range-slider"
      className={cn(
        'relative flex w-full touch-none select-none items-center',
        className
      )}
      {...props}
    >
      <SliderPrimitive.Track
        data-slot="dual-range-slider-track"
        className="relative h-2 w-full grow overflow-hidden rounded-full bg-secondary"
      >
        <SliderPrimitive.Range 
          data-slot="dual-range-slider-range"
          className="absolute h-full bg-primary" 
        />
      </SliderPrimitive.Track>
      
      {initialValue.map((value, index) => (
        <React.Fragment key={index}>
          <SliderPrimitive.Thumb
            data-slot="dual-range-slider-thumb"
            className="relative block h-4 w-4 rounded-full border-2 border-primary bg-background ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
          >
            {label && (
              <span
                className={cn(
                  'absolute flex w-full justify-center',
                  labelPosition === 'top' && '-top-7',
                  labelPosition === 'bottom' && 'top-4'
                )}
              >
                {label(value)}
              </span>
            )}
          </SliderPrimitive.Thumb>
        </React.Fragment>
      ))}
    </SliderPrimitive.Root>
  );
});

DualRangeSlider.displayName = 'DualRangeSlider';

export { DualRangeSlider };
