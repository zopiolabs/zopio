/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { cn } from "../lib/utils";
import { Minus, Plus } from "lucide-react";
import * as React from 'react';
import { forwardRef, useEffect, useRef, useState } from 'react';
import { NumberFlowBarvian } from './number-flow-barvian';

export interface NumberFlowInputProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The current value of the number input
   */
  value?: number;
  /**
   * The minimum allowed value
   */
  min?: number;
  /**
   * The maximum allowed value
   */
  max?: number;
  /**
   * Callback fired when the value changes
   */
  onValueChange?: (value: number) => void;
  /**
   * Step increment/decrement value
   */
  step?: number;
}

/**
 * NumberFlowInput component with increment/decrement buttons
 * 
 * @example
 * ```tsx
 * <NumberFlowInput value={5} min={0} max={10} onValueChange={(value) => console.log(value)} />
 * ```
 */
export const NumberFlowInput = forwardRef<HTMLDivElement, NumberFlowInputProps>(
  ({
    className,
    value = 0,
    min = -Infinity,
    max = Infinity,
    step = 1,
    onValueChange,
    ...props
  }, ref) => {
    const defaultValue = useRef(value);
    const inputRef = useRef<HTMLInputElement>(null);
    const [animated, setAnimated] = useState(true);
    // Hide the caret during transitions so you can't see it shifting around
    const [showCaret, setShowCaret] = useState(true);

    const handleInput: React.ChangeEventHandler<HTMLInputElement> = ({ currentTarget: el }) => {
      setAnimated(false);
      let next = value;
      
      if (el.value === '') {
        next = defaultValue.current;
      } else {
        const num = el.valueAsNumber;
        if (!isNaN(num) && min <= num && num <= max) {
          next = num;
        }
      }
      
      // Manually update the input.value in case the number stays the same e.g. 09 == 9
      el.value = String(next);
      onValueChange?.(next);
    };

    const handlePointerDown = (diff: number) => (event: React.PointerEvent<HTMLButtonElement>) => {
      setAnimated(true);
      if (event.pointerType === 'mouse') {
        event?.preventDefault();
        inputRef.current?.focus();
      }
      
      const newVal = Math.min(Math.max(value + diff, min), max);
      onValueChange?.(newVal);
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-stretch rounded-md font-semibold ring ring-zinc-200 transition-[box-shadow] focus-within:ring-2 focus-within:ring-primary dark:ring-zinc-800 group",
          className
        )}
        {...props}
      >
        <button
          aria-hidden="true"
          className="flex items-center pl-[.5em] pr-[.325em]"
          disabled={min != null && value <= min}
          onPointerDown={handlePointerDown(-step)}
          tabIndex={-1}
          type="button"
        >
          <Minus className="h-4 w-4" strokeWidth={2.5} />
        </button>
        
        <div className="relative grid items-center justify-items-center text-center [grid-template-areas:'overlap'] *:[grid-area:overlap]">
          <input
            ref={inputRef}
            className={cn(
              showCaret ? "caret-primary" : "caret-transparent",
              "w-[1.5em] bg-transparent py-2 text-center font-[inherit] text-transparent outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
            )}
            // Make sure to disable kerning, to match NumberFlowBarvian
            style={{ fontKerning: 'none' }}
            type="number"
            min={min}
            step={step}
            autoComplete="off"
            inputMode="numeric"
            max={max}
            value={value}
            onInput={handleInput}
          />
          
          <NumberFlowBarvian
            value={value}
            format={{ useGrouping: false }}
            aria-hidden="true"
            animated={animated}
            onAnimationsStart={() => setShowCaret(false)}
            onAnimationsFinish={() => setShowCaret(true)}
            className="pointer-events-none"
            willChange={true}
          />
        </div>
        
        <button
          aria-hidden="true"
          className="flex items-center pl-[.325em] pr-[.5em]"
          disabled={max != null && value >= max}
          onPointerDown={handlePointerDown(step)}
          tabIndex={-1}
          type="button"
        >
          <Plus className="h-4 w-4" strokeWidth={2.5} />
        </button>
      </div>
    );
  }
);

NumberFlowInput.displayName = "NumberFlowInput";

export default NumberFlowInput;
