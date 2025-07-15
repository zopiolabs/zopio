/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { OTPInput, OTPInputContext } from 'input-otp';
import * as React from 'react';

// Define explicit interface for OTP input props to fix type issues
interface OTPInputProps {
  value?: string;
  onChange?: (value: string) => void;
  maxLength: number;
  textAlign?: 'left' | 'center' | 'right';
  containerClassName?: string;
  className?: string;
  [key: string]: any;
}

import { cn } from '@repo/design-system/lib/utils';

function InputOTP({
  className,
  containerClassName,
  maxLength,
  ...props
}: OTPInputProps & {
  containerClassName?: string;
  className?: string;
}) {
  return React.createElement(OTPInput as any, {
    'data-slot': 'input-otp',
    containerClassName: cn(
      'flex items-center gap-2 has-disabled:opacity-50',
      containerClassName
    ),
    className: cn('disabled:cursor-not-allowed', className),
    maxLength: maxLength,
    ...props,
  });
}

function InputOTPGroup({ className, ...props }: React.ComponentProps<'div'>) {
  return React.createElement('div', {
    'data-slot': 'input-otp-group',
    className: cn('flex items-center', className),
    ...props,
  });
}

function InputOTPSlot({
  index,
  className,
  ...props
}: React.ComponentProps<'div'> & {
  index: number;
}) {
  const inputOTPContext = React.useContext(
    OTPInputContext as unknown as React.Context<any>
  ) as any;
  const { char, hasFakeCaret, isActive } = inputOTPContext?.slots[index] ?? {};

  return React.createElement(
    'div',
    {
      'data-slot': 'input-otp-slot',
      'data-active': isActive,
      className: cn(
        'relative flex h-9 w-9 items-center justify-center border-input border-y border-r text-sm shadow-xs outline-none transition-all first:rounded-l-md first:border-l last:rounded-r-md aria-invalid:border-destructive data-[active=true]:z-10 data-[active=true]:border-ring data-[active=true]:ring-[3px] data-[active=true]:ring-ring/50 data-[active=true]:aria-invalid:border-destructive data-[active=true]:aria-invalid:ring-destructive/20 dark:bg-input/30 dark:data-[active=true]:aria-invalid:ring-destructive/40',
        className
      ),
      ...props,
    },
    char,
    hasFakeCaret &&
      React.createElement(
        'div',
        {
          className:
            'pointer-events-none absolute inset-0 flex items-center justify-center',
        },
        React.createElement('div', {
          className: 'animate-caret-blink bg-foreground h-4 w-px duration-1000',
        })
      )
  );
}

function InputOTPSeparator({ ...props }: React.ComponentProps<'div'>) {
  return React.createElement(
    'div',
    {
      'data-slot': 'input-otp-separator',
      role: 'separator',
      ...props,
    },
    React.createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        width: '24',
        height: '24',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: 'size-4',
      },
      React.createElement('path', { d: 'M5 12h14' })
    )
  );
}

export { InputOTP, InputOTPGroup, InputOTPSlot, InputOTPSeparator };
