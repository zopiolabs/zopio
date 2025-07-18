/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { Command as CommandPrimitive } from 'cmdk';
import * as React from 'react';

import { cn } from '@repo/design-system/lib/utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@repo/design-system/ui/dialog';

type CommandProps = React.HTMLAttributes<HTMLDivElement> & {
  filter?: (value: any, search: any) => number;
};

const Command = React.forwardRef<HTMLDivElement, CommandProps>(
  ({ className, filter, ...props }, ref) => {
    // @ts-ignore - CommandPrimitive has JSX compatibility issues with React 19.1.0
    return React.createElement(CommandPrimitive as any, {
      ref,
      'data-slot': 'command',
      className: cn(
        'flex h-full w-full flex-col overflow-hidden rounded-md bg-popover text-popover-foreground',
        className as string | undefined
      ),
      filter,
      ...props,
    });
  }
);

interface DialogProps extends React.ComponentPropsWithoutRef<typeof Dialog> {
  children: React.ReactNode;
  title?: string;
  description?: string;
}

const CommandDialog: React.FC<DialogProps> = ({
  title = 'Command Palette',
  description = 'Search for a command to run...',
  children,
  ...props
}) => {
  return (
    // @ts-ignore - Dialog has JSX compatibility issues with React 19.1.0
    React.createElement(
      Dialog as any,
      props,
      React.createElement(
        DialogContent as any,
        {
          className:
            'fixed left-[50%] top-[50%] z-50 max-h-[85vh] w-[90vw] max-w-[450px] translate-x-[-50%] translate-y-[-50%] overflow-hidden rounded-md bg-transparent p-0 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
        },
        React.createElement(
          DialogHeader as any,
          null,
          // @ts-ignore - DialogTitle has JSX compatibility issues with React 19.1.0
          React.createElement(DialogTitle as any, null, title),
          // @ts-ignore - DialogDescription has JSX compatibility issues with React 19.1.0
          React.createElement(DialogDescription as any, null, description)
        ),
        children
      )
    )
  );
};

const CommandInput = ({
  className,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return React.createElement(
    'div',
    {
      'data-slot': 'command-input-wrapper',
      className: 'flex h-9 items-center gap-2 border-b px-3',
    },
    React.createElement(
      'svg',
      {
        xmlns: 'http://www.w3.org/2000/svg',
        viewBox: '0 0 24 24',
        fill: 'none',
        stroke: 'currentColor',
        strokeWidth: '2',
        strokeLinecap: 'round',
        strokeLinejoin: 'round',
        className: 'size-4 shrink-0 opacity-50',
      },
      React.createElement('circle', { cx: '11', cy: '11', r: '8' }),
      React.createElement('path', { d: 'm21 21-4.3-4.3' })
    ),
    // @ts-ignore - CommandPrimitive.Input has JSX compatibility issues with React 19.1.0
    React.createElement(CommandPrimitive.Input as any, {
      'data-slot': 'command-input',
      className: cn(
        'flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-hidden placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50',
        className as string | undefined
      ),
      ...props,
    })
  );
};

function CommandList({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // @ts-ignore - CommandPrimitive.List has JSX compatibility issues with React 19.1.0
  return React.createElement(CommandPrimitive.List as any, {
    'data-slot': 'command-list',
    className: cn(
      'max-h-[300px] scroll-py-1 overflow-y-auto overflow-x-hidden',
      className as string | undefined
    ),
    ...props,
  });
}

function CommandEmpty({ ...props }: React.HTMLAttributes<HTMLDivElement>) {
  // @ts-ignore - CommandPrimitive.Empty has JSX compatibility issues with React 19.1.0
  return React.createElement(CommandPrimitive.Empty as any, {
    'data-slot': 'command-empty',
    className: 'py-6 text-center text-sm',
    ...props,
  });
}

function CommandGroup({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // @ts-ignore - CommandPrimitive.Group has JSX compatibility issues with React 19.1.0
  return React.createElement(CommandPrimitive.Group as any, {
    'data-slot': 'command-group',
    className: cn(
      'overflow-hidden p-1 text-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:text-xs',
      className as string | undefined
    ),
    ...props,
  });
}

function CommandSeparator({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // @ts-ignore - CommandPrimitive.Separator has JSX compatibility issues with React 19.1.0
  return React.createElement(CommandPrimitive.Separator as any, {
    'data-slot': 'command-separator',
    className: cn('-mx-1 h-px bg-border', className as string | undefined),
    ...props,
  });
}

function CommandItem({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  // @ts-ignore - CommandPrimitive.Item has JSX compatibility issues with React 19.1.0
  return React.createElement(CommandPrimitive.Item as any, {
    'data-slot': 'command-item',
    className: cn(
      'relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden data-[disabled=true]:pointer-events-none data-[selected=true]:bg-accent data-[selected=true]:text-accent-foreground data-[disabled=true]:opacity-50 [&_svg:not([class*="size-"])]:size-4 [&_svg:not([class*="text-"])]:text-muted-foreground [&_svg]:pointer-events-none [&_svg]:shrink-0',
      className as string | undefined
    ),
    ...props,
  });
}

function CommandShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return React.createElement('span', {
    'data-slot': 'command-shortcut',
    className: cn(
      'ml-auto text-muted-foreground text-xs tracking-widest',
      className
    ),
    ...props,
  });
}

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
