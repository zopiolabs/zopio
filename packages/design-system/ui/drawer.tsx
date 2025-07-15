/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { Drawer as DrawerPrimitive } from 'vaul';

import { cn } from '@repo/design-system/lib/utils';

type DrawerProps = React.ComponentProps<typeof DrawerPrimitive.Root>;
const Drawer: React.FC<DrawerProps> = (props) => {
  return React.createElement(DrawerPrimitive.Root as any, {
    'data-slot': 'drawer',
    ...props,
  });
};

interface DrawerTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  [key: string]: unknown;
}
const DrawerTrigger: React.FC<DrawerTriggerProps> = (props) => {
  return React.createElement(DrawerPrimitive.Trigger as any, {
    'data-slot': 'drawer-trigger',
    ...props,
  });
};

type DrawerPortalProps = React.ComponentProps<typeof DrawerPrimitive.Portal>;
const DrawerPortal: React.FC<DrawerPortalProps> = (props) => {
  return React.createElement(DrawerPrimitive.Portal as any, {
    'data-slot': 'drawer-portal',
    ...props,
  });
};

interface DrawerCloseProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  [key: string]: unknown;
}
const DrawerClose: React.FC<DrawerCloseProps> = (props) => {
  return React.createElement(DrawerPrimitive.Close as any, {
    'data-slot': 'drawer-close',
    ...props,
  });
};

interface DrawerOverlayProps extends React.HTMLAttributes<HTMLDivElement> {
  [key: string]: unknown;
}
const DrawerOverlay: React.FC<DrawerOverlayProps> = ({
  className,
  ...props
}) => {
  return React.createElement(DrawerPrimitive.Overlay as any, {
    'data-slot': 'drawer-overlay',
    className: cn(
      'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50 data-[state=closed]:animate-out data-[state=open]:animate-in',
      className
    ),
    ...props,
  });
};

interface DrawerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  [key: string]: unknown;
}
const DrawerContent = React.forwardRef<HTMLDivElement, DrawerContentProps>(
  ({ className, children, ...props }, ref) => {
    return React.createElement(
      DrawerPortal as any,
      null,
      React.createElement(DrawerOverlay as any, null),
      React.createElement(
        DrawerPrimitive.Content as any,
        {
          ref,
          'data-slot': 'drawer-content',
          className: cn(
            'group/drawer-content fixed z-50 flex h-auto flex-col bg-background',
            'data-[vaul-drawer-direction=top]:inset-x-0 data-[vaul-drawer-direction=top]:top-0 data-[vaul-drawer-direction=top]:mb-24 data-[vaul-drawer-direction=top]:max-h-[80vh] data-[vaul-drawer-direction=top]:rounded-b-lg data-[vaul-drawer-direction=top]:border-b',
            'data-[vaul-drawer-direction=bottom]:inset-x-0 data-[vaul-drawer-direction=bottom]:bottom-0 data-[vaul-drawer-direction=bottom]:mt-24 data-[vaul-drawer-direction=bottom]:max-h-[80vh] data-[vaul-drawer-direction=bottom]:rounded-t-lg data-[vaul-drawer-direction=bottom]:border-t',
            'data-[vaul-drawer-direction=right]:inset-y-0 data-[vaul-drawer-direction=right]:right-0 data-[vaul-drawer-direction=right]:w-3/4 data-[vaul-drawer-direction=right]:border-l data-[vaul-drawer-direction=right]:sm:max-w-sm',
            'data-[vaul-drawer-direction=left]:inset-y-0 data-[vaul-drawer-direction=left]:left-0 data-[vaul-drawer-direction=left]:w-3/4 data-[vaul-drawer-direction=left]:border-r data-[vaul-drawer-direction=left]:sm:max-w-sm',
            className as string | undefined
          ),
          ...props,
        },
        React.createElement(
          React.Fragment,
          null,
          React.createElement('div', {
            className:
              'bg-muted mx-auto mt-4 hidden h-2 w-[100px] shrink-0 rounded-full group-data-[vaul-drawer-direction=bottom]/drawer-content:block',
          }),
          children as React.ReactNode
        )
      )
    );
  }
);

type DrawerHeaderProps = React.ComponentProps<'div'>;
const DrawerHeader: React.FC<DrawerHeaderProps> = ({ className, ...props }) => {
  return React.createElement('div', {
    'data-slot': 'drawer-header',
    className: cn('flex flex-col gap-1.5 p-4', className),
    ...props,
  });
};

type DrawerFooterProps = React.ComponentProps<'div'>;
const DrawerFooter: React.FC<DrawerFooterProps> = ({ className, ...props }) => {
  return React.createElement('div', {
    'data-slot': 'drawer-footer',
    className: cn('mt-auto flex flex-col gap-2 p-4', className),
    ...props,
  });
};

interface DrawerTitleProps extends React.HTMLAttributes<HTMLHeadingElement> {
  [key: string]: unknown;
}
const DrawerTitle: React.FC<DrawerTitleProps> = ({ className, ...props }) => {
  return React.createElement(DrawerPrimitive.Title as any, {
    'data-slot': 'drawer-title',
    className: cn(
      'font-semibold text-foreground',
      className as string | undefined
    ),
    ...props,
  });
};

interface DrawerDescriptionProps
  extends React.HTMLAttributes<HTMLParagraphElement> {
  [key: string]: unknown;
}
const DrawerDescription: React.FC<DrawerDescriptionProps> = ({
  className,
  ...props
}) => {
  return React.createElement(DrawerPrimitive.Description as any, {
    'data-slot': 'drawer-description',
    className: cn(
      'text-muted-foreground text-sm',
      className as string | undefined
    ),
    ...props,
  });
};

export {
  Drawer,
  DrawerPortal,
  DrawerOverlay,
  DrawerTrigger,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerFooter,
  DrawerTitle,
  DrawerDescription,
};
