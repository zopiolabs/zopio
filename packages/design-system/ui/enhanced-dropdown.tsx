/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { Check, ChevronDown, ChevronRight, Circle } from 'lucide-react';
import * as DropdownMenuPrimitive from '@radix-ui/react-dropdown-menu';

import { cn } from '@repo/design-system/lib/utils';

/* ----------------- Enhanced Dropdown Root ----------------- */
export interface EnhancedDropdownProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Root> {
  backdrop?: 'opaque' | 'blur' | 'transparent';
}

function EnhancedDropdown({
  backdrop = 'transparent',
  ...props
}: EnhancedDropdownProps) {
  return (
    <DropdownMenuPrimitive.Root 
      data-slot="enhanced-dropdown"
      data-backdrop={backdrop}
      {...props} 
    />
  );
}

/* ----------------- Enhanced Dropdown Trigger ----------------- */
function EnhancedDropdownTrigger({
  className,
  children,
  asChild = false,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger> & {
  asChild?: boolean;
}) {
  if (asChild) {
    return (
      <DropdownMenuPrimitive.Trigger
        data-slot="enhanced-dropdown-trigger"
        className={className}
        asChild
        {...props}
      >
        {children}
      </DropdownMenuPrimitive.Trigger>
    );
  }

  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="enhanced-dropdown-trigger"
      className={cn(
        'flex items-center justify-between gap-1 rounded-md border border-input bg-background px-3 py-2 text-sm font-medium ring-offset-background hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown className="size-4 opacity-50" />
    </DropdownMenuPrimitive.Trigger>
  );
}

/* ----------------- Enhanced Dropdown Portal ----------------- */
function EnhancedDropdownPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal 
      data-slot="enhanced-dropdown-portal" 
      {...props} 
    />
  );
}

/* ----------------- Enhanced Dropdown Content ----------------- */
export interface EnhancedDropdownContentProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Content> {
  variant?: 'default' | 'flat' | 'elevated';
  align?: 'start' | 'center' | 'end';
  sideOffset?: number;
  alignOffset?: number;
  avoidCollisions?: boolean;
  collisionBoundary?: Element | null | Array<Element | null>;
  collisionPadding?: number | Partial<Record<'top' | 'right' | 'bottom' | 'left', number>>;
  arrowPadding?: number;
  sticky?: 'partial' | 'always';
  hideWhenDetached?: boolean;
  portalContainer?: HTMLElement;
}

function EnhancedDropdownContent({
  className,
  variant = 'default',
  sideOffset = 4,
  align = 'center',
  alignOffset = 0,
  avoidCollisions = true,
  collisionBoundary,
  collisionPadding,
  arrowPadding,
  sticky,
  hideWhenDetached,
  portalContainer,
  ...props
}: EnhancedDropdownContentProps) {
  return (
    <DropdownMenuPrimitive.Portal container={portalContainer}>
      <DropdownMenuPrimitive.Content
        data-slot="enhanced-dropdown-content"
        data-variant={variant}
        sideOffset={sideOffset}
        align={align}
        alignOffset={alignOffset}
        avoidCollisions={avoidCollisions}
        collisionBoundary={collisionBoundary}
        collisionPadding={collisionPadding}
        arrowPadding={arrowPadding}
        sticky={sticky}
        hideWhenDetached={hideWhenDetached}
        className={cn(
          'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 max-h-(--radix-dropdown-menu-content-available-height) min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md data-[state=closed]:animate-out data-[state=open]:animate-in',
          'data-[variant=flat]:shadow-sm data-[variant=flat]:border-muted',
          'data-[variant=elevated]:shadow-lg',
          className
        )}
        {...props}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

/* ----------------- Enhanced Dropdown Group ----------------- */
function EnhancedDropdownGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="enhanced-dropdown-group"
      className={cn('', className)}
      {...props}
    />
  );
}

/* ----------------- Enhanced Dropdown Item ----------------- */
export interface EnhancedDropdownItemProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Item> {
  inset?: boolean;
  variant?: 'default' | 'destructive';
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  description?: string;
  shortcut?: string;
}

function EnhancedDropdownItem({
  className,
  inset,
  variant = 'default',
  startContent,
  endContent,
  description,
  shortcut,
  children,
  ...props
}: EnhancedDropdownItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="enhanced-dropdown-item"
      data-inset={inset}
      data-variant={variant}
      data-has-description={!!description}
      className={cn(
        'cursor-default data-[disabled]:opacity-50 data-[disabled]:pointer-events-none data-[has-description=true]:flex-col data-[has-description=true]:items-start data-[has-description=true]:py-2 data-[inset]:pl-8 data-[variant=destructive]:focus:bg-destructive/10 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:text-destructive dark:data-[variant=destructive]:focus:bg-destructive/20 flex focus:bg-accent focus:text-accent-foreground gap-2 items-center outline-hidden px-2 py-1.5 relative rounded-sm select-none text-sm',
        className
      )}
      {...props}
    >
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-2 items-center">
          {startContent && (
            <span className="flex items-center justify-center">{startContent}</span>
          )}
          <span>{children}</span>
        </div>
        <div className="flex gap-2 items-center">
          {shortcut && (
            <EnhancedDropdownShortcut>{shortcut}</EnhancedDropdownShortcut>
          )}
          {endContent && (
            <span className="flex items-center justify-center">{endContent}</span>
          )}
        </div>
      </div>
      {description && (
        <span className="text-muted-foreground text-xs">{description}</span>
      )}
    </DropdownMenuPrimitive.Item>
  );
}

/* ----------------- Enhanced Dropdown Checkbox Item ----------------- */
export interface EnhancedDropdownCheckboxItemProps extends React.ComponentProps<typeof DropdownMenuPrimitive.CheckboxItem> {
  shortcut?: string;
}

function EnhancedDropdownCheckboxItem({
  className,
  children,
  checked,
  shortcut,
  ...props
}: EnhancedDropdownCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="enhanced-dropdown-checkbox-item"
      className={cn(
        'cursor-default data-[disabled]:opacity-50 data-[disabled]:pointer-events-none flex focus:bg-accent focus:text-accent-foreground gap-2 items-center justify-between outline-hidden pl-8 pr-2 py-1.5 relative rounded-sm select-none text-sm',
        className
      )}
      checked={checked}
      {...props}
    >
      <span className="absolute flex items-center justify-center left-2 size-3.5">
        <DropdownMenuPrimitive.ItemIndicator>
          <Check className="size-4" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      <span>{children}</span>
      {shortcut && (
        <EnhancedDropdownShortcut>{shortcut}</EnhancedDropdownShortcut>
      )}
    </DropdownMenuPrimitive.CheckboxItem>
  );
}

/* ----------------- Enhanced Dropdown Radio Group ----------------- */
function EnhancedDropdownRadioGroup({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="enhanced-dropdown-radio-group"
      className={cn('', className)}
      {...props}
    />
  );
}

/* ----------------- Enhanced Dropdown Radio Item ----------------- */
function EnhancedDropdownRadioItem({
  className,
  children,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioItem>) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="enhanced-dropdown-radio-item"
      className={cn(
        'relative flex cursor-default select-none items-center justify-between gap-2 rounded-sm py-1.5 pr-2 pl-8 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        className
      )}
      {...props}
    >
      <span className="absolute left-2 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <Circle className="size-2 fill-current" />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  );
}

/* ----------------- Enhanced Dropdown Label ----------------- */
export interface EnhancedDropdownLabelProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Label> {
  inset?: boolean;
}

function EnhancedDropdownLabel({
  className,
  inset,
  ...props
}: EnhancedDropdownLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="enhanced-dropdown-label"
      data-inset={inset}
      className={cn(
        'px-2 py-1.5 font-medium text-sm data-[inset]:pl-8',
        className
      )}
      {...props}
    />
  );
}

/* ----------------- Enhanced Dropdown Separator ----------------- */
function EnhancedDropdownSeparator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Separator>) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="enhanced-dropdown-separator"
      className={cn('-mx-1 my-1 h-px bg-border', className)}
      {...props}
    />
  );
}

/* ----------------- Enhanced Dropdown Sub ----------------- */
function EnhancedDropdownSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="enhanced-dropdown-sub" {...props} />;
}

/* ----------------- Enhanced Dropdown Sub Trigger ----------------- */
export interface EnhancedDropdownSubTriggerProps extends React.ComponentProps<typeof DropdownMenuPrimitive.SubTrigger> {
  inset?: boolean;
  startContent?: React.ReactNode;
}

function EnhancedDropdownSubTrigger({
  className,
  inset,
  startContent,
  children,
  ...props
}: EnhancedDropdownSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="enhanced-dropdown-sub-trigger"
      data-inset={inset}
      className={cn(
        'flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-hidden focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[inset]:pl-8 data-[state=open]:text-accent-foreground',
        className
      )}
      {...props}
    >
      {startContent && (
        <span className="mr-2 flex items-center justify-center">{startContent}</span>
      )}
      {children}
      <ChevronRight className="ml-auto size-4" />
    </DropdownMenuPrimitive.SubTrigger>
  );
}

/* ----------------- Enhanced Dropdown Sub Content ----------------- */
function EnhancedDropdownSubContent({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.SubContent>) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="enhanced-dropdown-sub-content"
      className={cn(
        'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[8rem] origin-(--radix-dropdown-menu-content-transform-origin) overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=closed]:animate-out data-[state=open]:animate-in',
        className
      )}
      {...props}
    />
  );
}

/* ----------------- Enhanced Dropdown Section ----------------- */
export interface EnhancedDropdownSectionProps extends React.ComponentProps<typeof DropdownMenuPrimitive.Group> {
  title?: string;
}

function EnhancedDropdownSection({
  className,
  title,
  children,
  ...props
}: EnhancedDropdownSectionProps) {
  return (
    <DropdownMenuPrimitive.Group
      data-slot="enhanced-dropdown-section"
      className={cn('', className)}
      {...props}
    >
      {title && (
        <DropdownMenuPrimitive.Label className="px-2 py-1.5 text-sm font-semibold">
          {title}
        </DropdownMenuPrimitive.Label>
      )}
      {children}
    </DropdownMenuPrimitive.Group>
  );
}

/* ----------------- Enhanced Dropdown Shortcut ----------------- */
function EnhancedDropdownShortcut({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      data-slot="enhanced-dropdown-shortcut"
      className={cn('ml-auto text-xs tracking-widest text-muted-foreground', className)}
      {...props}
    />
  );
}

export {
  EnhancedDropdown,
  EnhancedDropdownTrigger,
  EnhancedDropdownPortal,
  EnhancedDropdownContent,
  EnhancedDropdownGroup,
  EnhancedDropdownItem,
  EnhancedDropdownCheckboxItem,
  EnhancedDropdownRadioGroup,
  EnhancedDropdownRadioItem,
  EnhancedDropdownLabel,
  EnhancedDropdownSeparator,
  EnhancedDropdownSub,
  EnhancedDropdownSubTrigger,
  EnhancedDropdownSubContent,
  EnhancedDropdownSection,
  EnhancedDropdownShortcut,
};
