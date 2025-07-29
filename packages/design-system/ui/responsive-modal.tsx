/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '../lib/utils';

const ResponsiveModal = DialogPrimitive.Root;
const ResponsiveModalTrigger = DialogPrimitive.Trigger;
const ResponsiveModalClose = DialogPrimitive.Close;
const ResponsiveModalPortal = DialogPrimitive.Portal;

const ResponsiveModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      'backdrop-blur-sm bg-background/80 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0 fixed inset-0 z-50',
      className,
    )}
    {...props}
    ref={ref}
  />
));

ResponsiveModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ResponsiveModalVariants = cva(
  cn(
    'bg-background data-[state=closed]:animate-out data-[state=closed]:duration-300 data-[state=open]:animate-in data-[state=open]:duration-500 ease-in-out fixed gap-4 overflow-y-auto p-6 shadow-lg transition z-50',
    'data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] data-[state=open]:zoom-in-95 duration-200 lg:border lg:left-[50%] lg:max-w-lg lg:rounded-xl lg:top-[50%] lg:translate-x-[-50%] lg:translate-y-[-50%] lg:w-full',
  ),
  {
    variants: {
      side: {
        top: 'border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 max-h-[80dvh] rounded-b-xl top-0 lg:h-fit',
        bottom: 'border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom bottom-0 inset-x-0 lg:h-fit max-h-[80dvh] rounded-t-xl',
        left: 'border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left h-full inset-y-0 left-0 lg:h-fit rounded-r-xl sm:max-w-sm w-3/4',
        right: 'border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right h-full inset-y-0 lg:h-fit right-0 rounded-l-xl sm:max-w-sm w-3/4',
      },
    },
    defaultVariants: {
      side: 'bottom',
    },
  },
);

interface ResponsiveModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof ResponsiveModalVariants> {}

const ResponsiveModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ResponsiveModalContentProps
>(({ side = 'bottom', className, children, ...props }, ref) => (
  <ResponsiveModalPortal>
    <ResponsiveModalOverlay />
    <DialogPrimitive.Content
      ref={ref}
      className={cn(ResponsiveModalVariants({ side }), className)}
      {...props}
    >
      {children}
      <ResponsiveModalClose className="absolute data-[state=open]:bg-secondary disabled:pointer-events-none focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring hover:opacity-100 opacity-70 right-4 ring-offset-background rounded-sm top-4 transition-opacity">
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </ResponsiveModalClose>
    </DialogPrimitive.Content>
  </ResponsiveModalPortal>
));

ResponsiveModalContent.displayName = DialogPrimitive.Content.displayName;

const ResponsiveModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col sm:text-left space-y-2 text-center', className)}
    {...props}
  />
);

ResponsiveModalHeader.displayName = 'ResponsiveModalHeader';

const ResponsiveModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2', className)}
    {...props}
  />
);

ResponsiveModalFooter.displayName = 'ResponsiveModalFooter';

const ResponsiveModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('font-semibold text-foreground text-lg', className)}
    {...props}
  />
));

ResponsiveModalTitle.displayName = DialogPrimitive.Title.displayName;

const ResponsiveModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-muted-foreground text-sm', className)}
    {...props}
  />
));

ResponsiveModalDescription.displayName = DialogPrimitive.Description.displayName;

export {
  ResponsiveModal,
  ResponsiveModalPortal,
  ResponsiveModalOverlay,
  ResponsiveModalTrigger,
  ResponsiveModalClose,
  ResponsiveModalContent,
  ResponsiveModalHeader,
  ResponsiveModalFooter,
  ResponsiveModalTitle,
  ResponsiveModalDescription,
};
