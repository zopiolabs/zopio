/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { cva, type VariantProps } from 'class-variance-authority';
import { X } from 'lucide-react';

import { cn } from '../lib/utils';

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalClose = DialogPrimitive.Close;
const ModalPortal = DialogPrimitive.Portal;

const ModalOverlay = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Overlay>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay> & {
    blur?: 'none' | 'sm' | 'md' | 'lg';
  }
>(({ className, blur = 'sm', ...props }, ref) => (
  <DialogPrimitive.Overlay
    className={cn(
      'fixed inset-0 z-50 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0',
      {
        'backdrop-blur-none bg-background/70': blur === 'none',
        'backdrop-blur-sm bg-background/80': blur === 'sm',
        'backdrop-blur-md bg-background/80': blur === 'md',
        'backdrop-blur-lg bg-background/80': blur === 'lg',
      },
      className,
    )}
    {...props}
    ref={ref}
  />
));

ModalOverlay.displayName = 'ModalOverlay';

const modalVariants = cva(
  'fixed z-50 bg-background shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
  {
    variants: {
      size: {
        xs: 'max-w-xs',
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        '3xl': 'max-w-3xl',
        '4xl': 'max-w-4xl',
        '5xl': 'max-w-5xl',
        '6xl': 'max-w-6xl',
        '7xl': 'max-w-7xl',
        full: 'max-w-full',
      },
      position: {
        center: 'left-[50%] top-[50%] translate-x-[-50%] translate-y-[-50%] data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        'top-center': 'left-[50%] top-4 translate-x-[-50%] data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top',
        'bottom-center': 'left-[50%] bottom-4 translate-x-[-50%] data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom',
        'top-left': 'left-4 top-4 data-[state=closed]:slide-out-to-top-left data-[state=open]:slide-in-from-top-left',
        'top-right': 'right-4 top-4 data-[state=closed]:slide-out-to-top-right data-[state=open]:slide-in-from-top-right',
        'bottom-left': 'left-4 bottom-4 data-[state=closed]:slide-out-to-bottom-left data-[state=open]:slide-in-from-bottom-left',
        'bottom-right': 'right-4 bottom-4 data-[state=closed]:slide-out-to-bottom-right data-[state=open]:slide-in-from-bottom-right',
      },
      scrollBehavior: {
        inside: 'overflow-y-auto',
        outside: 'overflow-y-visible',
      },
    },
    defaultVariants: {
      size: 'md',
      position: 'center',
      scrollBehavior: 'inside',
    },
  },
);

export interface ModalContentProps
  extends React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>,
    VariantProps<typeof modalVariants> {
  hideCloseButton?: boolean;
  blur?: 'none' | 'sm' | 'md' | 'lg';
  draggable?: boolean;
  overflow?: boolean;
  onDragEnd?: (event: React.MouseEvent<HTMLDivElement>) => void;
}

const ModalContent = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Content>,
  ModalContentProps
>(
  (
    {
      className,
      children,
      size,
      position,
      scrollBehavior,
      hideCloseButton = false,
      blur = 'sm',
      draggable = false,
      overflow = false,
      onDragEnd,
      ...props
    },
    ref,
  ) => {
    const [isDragging, setIsDragging] = React.useState(false);
    const [position_, setPosition] = React.useState({ x: 0, y: 0 });
    const dragRef = React.useRef<HTMLDivElement>(null);

    const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!draggable || e.target !== dragRef.current) return;
      
      setIsDragging(true);
      
      const rect = (e.target as HTMLElement).getBoundingClientRect();
      setPosition({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!draggable || !isDragging) return;
      
      const modalElement = e.currentTarget;
      const modalRect = modalElement.getBoundingClientRect();
      
      let newX = e.clientX - position_.x;
      let newY = e.clientY - position_.y;
      
      if (!overflow) {
        // Constrain to viewport
        newX = Math.max(0, Math.min(newX, window.innerWidth - modalRect.width));
        newY = Math.max(0, Math.min(newY, window.innerHeight - modalRect.height));
      }
      
      modalElement.style.transform = `translate(${newX}px, ${newY}px)`;
      modalElement.style.left = '0';
      modalElement.style.top = '0';
      modalElement.style.right = 'auto';
      modalElement.style.bottom = 'auto';
    };

    const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!draggable || !isDragging) return;
      
      setIsDragging(false);
      onDragEnd?.(e);
    };

    return (
      <ModalPortal>
        <ModalOverlay blur={blur} />
        <DialogPrimitive.Content
          ref={ref}
          className={cn(
            modalVariants({ size, position, scrollBehavior }),
            'grid w-full gap-4 border p-6 outline-none',
            draggable && 'cursor-move',
            className,
          )}
          style={draggable ? { transform: 'none' } : undefined}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={isDragging ? handleMouseUp : undefined}
          {...props}
        >
          {draggable && (
            <div
              ref={dragRef}
              className="absolute left-0 top-0 h-10 w-full cursor-move"
              onMouseDown={handleMouseDown}
            />
          )}
          {children}
          {!hideCloseButton && (
            <ModalClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </ModalClose>
          )}
        </DialogPrimitive.Content>
      </ModalPortal>
    );
  },
);

ModalContent.displayName = 'ModalContent';

const ModalHeader = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex flex-col space-y-1.5 text-center sm:text-left', className)} {...props} />
);

ModalHeader.displayName = 'ModalHeader';

const ModalFooter = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={cn('flex flex-col-reverse gap-2 sm:flex-row sm:justify-end', className)}
    {...props}
  />
);

ModalFooter.displayName = 'ModalFooter';

const ModalTitle = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Title>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Title
    ref={ref}
    className={cn('text-lg font-semibold leading-none tracking-tight', className)}
    {...props}
  />
));

ModalTitle.displayName = 'ModalTitle';

const ModalDescription = React.forwardRef<
  React.ElementRef<typeof DialogPrimitive.Description>,
  React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
  <DialogPrimitive.Description
    ref={ref}
    className={cn('text-sm text-muted-foreground', className)}
    {...props}
  />
));

ModalDescription.displayName = 'ModalDescription';

const ModalBody = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div className={cn('flex-1', className)} {...props} />
);

ModalBody.displayName = 'ModalBody';

export {
  Modal,
  ModalPortal,
  ModalOverlay,
  ModalTrigger,
  ModalClose,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalTitle,
  ModalDescription,
  ModalBody,
};
