/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";
import { Check } from "lucide-react";

import { cn } from "@repo/design-system/lib/utils";

const listboxVariants = cva(
  "w-full max-w-xs border border-border rounded-lg bg-background shadow-sm",
  {
    variants: {
      variant: {
        flat: "bg-secondary/50",
        faded: "bg-background border-border",
        bordered: "border-2 border-border",
        light: "bg-transparent",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "faded",
      size: "md",
    },
  }
);

const listboxItemVariants = cva(
  "relative flex cursor-pointer select-none items-center gap-2 rounded-md px-3 py-2 text-sm outline-none transition-colors",
  {
    variants: {
      variant: {
        flat: "hover:bg-secondary/80 data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        faded: "hover:bg-secondary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        bordered: "hover:bg-secondary data-[selected=true]:bg-primary data-[selected=true]:text-primary-foreground",
        light: "hover:bg-secondary/50 data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary",
      },
      disabled: {
        true: "pointer-events-none opacity-50",
        false: "",
      },
    },
    defaultVariants: {
      variant: "faded",
      disabled: false,
    },
  }
);

export interface ListboxProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof listboxVariants>["variant"];
  size?: VariantProps<typeof listboxVariants>["size"];
  selectionMode?: "none" | "single" | "multiple";
  disallowEmptySelection?: boolean;
  selectedKeys?: Set<string> | string[];
  defaultSelectedKeys?: Set<string> | string[];
  disabledKeys?: Set<string> | string[];
  onSelectionChange?: (keys: Set<string>) => void;
  topContent?: React.ReactNode;
  bottomContent?: React.ReactNode;
  isVirtualized?: boolean;
}

export interface ListboxItemProps extends React.HTMLAttributes<HTMLDivElement | HTMLAnchorElement> {
  key?: string;
  variant?: VariantProps<typeof listboxItemVariants>["variant"];
  isDisabled?: boolean;
  startContent?: React.ReactNode;
  endContent?: React.ReactNode;
  description?: string;
  href?: string;
  target?: string;
  onAction?: () => void;
}

export interface ListboxSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  showDivider?: boolean;
}

const ListboxContext = React.createContext<{
  variant?: VariantProps<typeof listboxVariants>["variant"];
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys: Set<string>;
  disabledKeys: Set<string>;
  onSelectionChange?: (keys: Set<string>) => void;
}>({
  selectedKeys: new Set(),
  disabledKeys: new Set(),
});

const Listbox = React.forwardRef<HTMLDivElement, ListboxProps>(
  (
    {
      className,
      variant,
      size,
      selectionMode = "none",
      disallowEmptySelection = true,
      selectedKeys: controlledSelectedKeys,
      defaultSelectedKeys,
      disabledKeys,
      onSelectionChange,
      topContent,
      bottomContent,
      children,
      ...props
    },
    ref
  ) => {
    const [selectedKeys, setSelectedKeys] = React.useState<Set<string>>(
      controlledSelectedKeys
        ? new Set(Array.isArray(controlledSelectedKeys) ? controlledSelectedKeys : controlledSelectedKeys)
        : new Set(Array.isArray(defaultSelectedKeys) ? defaultSelectedKeys : defaultSelectedKeys || [])
    );

    const disabledKeysSet = React.useMemo(
      () => new Set(Array.isArray(disabledKeys) ? disabledKeys : disabledKeys || []),
      [disabledKeys]
    );

    React.useEffect(() => {
      if (controlledSelectedKeys) {
        setSelectedKeys(
          new Set(Array.isArray(controlledSelectedKeys) ? controlledSelectedKeys : controlledSelectedKeys)
        );
      }
    }, [controlledSelectedKeys]);

    const handleSelectionChange = React.useCallback(
      (newKeys: Set<string>) => {
        if (!controlledSelectedKeys) {
          setSelectedKeys(newKeys);
        }
        onSelectionChange?.(newKeys);
      },
      [controlledSelectedKeys, onSelectionChange]
    );

    const contextValue = React.useMemo(
      () => ({
        variant,
        selectionMode,
        selectedKeys: controlledSelectedKeys 
          ? new Set(Array.isArray(controlledSelectedKeys) ? controlledSelectedKeys : controlledSelectedKeys)
          : selectedKeys,
        disabledKeys: disabledKeysSet,
        onSelectionChange: handleSelectionChange,
      }),
      [variant, selectionMode, controlledSelectedKeys, selectedKeys, disabledKeysSet, handleSelectionChange]
    );

    return (
      <ListboxContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(listboxVariants({ variant, size, className }))}
          role="listbox"
          aria-multiselectable={selectionMode === "multiple"}
          {...props}
        >
          {topContent && (
            <div className="px-3 py-2 border-b border-border">
              {topContent}
            </div>
          )}
          <div className="p-1">
            {children}
          </div>
          {bottomContent && (
            <div className="px-3 py-2 border-t border-border">
              {bottomContent}
            </div>
          )}
        </div>
      </ListboxContext.Provider>
    );
  }
);

const ListboxItem = React.forwardRef<HTMLDivElement | HTMLAnchorElement, ListboxItemProps>(
  (
    {
      className,
      children,
      isDisabled = false,
      startContent,
      endContent,
      description,
      href,
      target,
      onAction,
      onClick,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ListboxContext);
    const itemKey = props.key || React.useId();
    const isSelected = context.selectedKeys.has(itemKey);
    const isItemDisabled = isDisabled || context.disabledKeys.has(itemKey);

    const handleClick = React.useCallback(
      (event: React.MouseEvent<HTMLDivElement | HTMLAnchorElement>) => {
        if (isItemDisabled) return;

        onClick?.(event);
        onAction?.();

        if (context.selectionMode !== "none") {
          const newSelectedKeys = new Set(context.selectedKeys);
          
          if (context.selectionMode === "single") {
            newSelectedKeys.clear();
            if (!isSelected) {
              newSelectedKeys.add(itemKey);
            }
          } else if (context.selectionMode === "multiple") {
            if (isSelected) {
              newSelectedKeys.delete(itemKey);
            } else {
              newSelectedKeys.add(itemKey);
            }
          }

          context.onSelectionChange?.(newSelectedKeys);
        }
      },
      [isItemDisabled, onClick, onAction, context, itemKey, isSelected]
    );

    const Component = href ? "a" : "div";

    return (
      <Component
        ref={ref as any}
        className={cn(
          listboxItemVariants({
            variant: context.variant,
            disabled: isItemDisabled,
            className,
          })
        )}
        role="option"
        aria-selected={isSelected}
        aria-disabled={isItemDisabled}
        data-selected={isSelected}
        data-disabled={isItemDisabled}
        onClick={handleClick as any}
        href={href}
        target={target}
        {...props}
      >
        {startContent && (
          <span className="flex-shrink-0">
            {startContent}
          </span>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="truncate">
            {children}
          </div>
          {description && (
            <div className="text-xs text-muted-foreground mt-1 truncate">
              {description}
            </div>
          )}
        </div>

        {context.selectionMode !== "none" && isSelected && (
          <Check className="h-4 w-4 flex-shrink-0" />
        )}

        {endContent && (
          <span className="flex-shrink-0">
            {endContent}
          </span>
        )}
      </Component>
    );
  }
);

const ListboxSection = React.forwardRef<HTMLDivElement, ListboxSectionProps>(
  ({ className, title, showDivider = true, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("", className)} {...props}>
        {title && (
          <div className="px-3 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {title}
          </div>
        )}
        <div className="space-y-1">
          {children}
        </div>
        {showDivider && (
          <hr className="my-2 border-border" />
        )}
      </div>
    );
  }
);

Listbox.displayName = "Listbox";
ListboxItem.displayName = "ListboxItem";
ListboxSection.displayName = "ListboxSection";

export { Listbox, ListboxItem, ListboxSection, listboxVariants, listboxItemVariants };
