/**
 * SPDX-License-Identifier: MIT
 */

import * as React from 'react';
import { cn } from '../lib/utils';
import { Input } from './input';
import { Label } from './label';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <Input placeholder=" " className={cn('peer', className)} ref={ref} {...props} />;
  },
);
FloatingInput.displayName = 'FloatingInput';

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        'absolute bg-background cursor-text dark:bg-background duration-300 origin-[0] px-2 peer-focus:px-2 peer-focus:scale-75 peer-focus:top-2 peer-focus:-translate-y-4 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100 peer-placeholder-shown:top-1/2 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 scale-75 start-2 text-gray-500 text-sm top-2 transform -translate-y-4 z-10',
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = 'FloatingLabel';

export type FloatingLabelInputProps = InputProps & { 
  label?: string;
};

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = 'FloatingLabelInput';

export { FloatingInput, FloatingLabel, FloatingLabelInput };
