/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { Check, ChevronDown } from "lucide-react";
import { cn } from "../lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { useControllableState } from "@radix-ui/react-use-controllable-state";

/* ---------------------------------- Types ---------------------------------- */

type ListboxContextValue = {
  open: boolean;
  setOpen: (open: boolean) => void;
  value: any;
  onChange: (value: any) => void;
  multiple: boolean;
  disabled?: boolean;
  invalid?: boolean;
  by?: ((a: any, b: any) => boolean) | string;
  name?: string;
  horizontal?: boolean;
};

type ListboxProps = {
  children: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  defaultValue?: any;
  value?: any;
  onChange?: (value: any) => void;
  multiple?: boolean;
  disabled?: boolean;
  invalid?: boolean;
  by?: ((a: any, b: any) => boolean) | string;
  name?: string;
  horizontal?: boolean;
  className?: string;
};

type ListboxButtonProps = {
  children?: React.ReactNode;
  asChild?: boolean;
  className?: string;
};

type ListboxSelectedOptionProps = {
  children?: React.ReactNode;
  placeholder?: string;
  className?: string;
};

type ListboxOptionsProps = {
  children: React.ReactNode;
  className?: string;
};

type ListboxOptionProps = {
  children: React.ReactNode;
  value: any;
  disabled?: boolean;
  className?: string;
};

type ListboxSectionProps = {
  children: React.ReactNode;
  title?: string;
  className?: string;
};

type ListboxLabelProps = {
  children: React.ReactNode;
  className?: string;
};

type ListboxDividerProps = {
  className?: string;
};

/* --------------------------------- Context --------------------------------- */

const ListboxContext = React.createContext<ListboxContextValue | undefined>(undefined);

function useListboxContext() {
  const context = React.useContext(ListboxContext);
  if (!context) {
    throw new Error("Listbox components must be used within a Listbox");
  }
  return context;
}

/* -------------------------------- Component ------------------------------- */

export function Listbox({
  children,
  defaultOpen,
  open: openProp,
  onOpenChange,
  defaultValue,
  value: valueProp,
  onChange,
  multiple = false,
  disabled = false,
  invalid = false,
  by = (a, b) => a === b,
  name,
  horizontal = false,
  className,
}: ListboxProps) {
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen || false,
    onChange: onOpenChange,
  });

  const [value, setValue] = useControllableState({
    prop: valueProp,
    defaultProp: defaultValue,
    onChange,
  });
  
  // Handle clicks outside the listbox to close it
  const listboxRef = React.useRef<HTMLDivElement>(null);
  
  React.useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (listboxRef.current && !listboxRef.current.contains(event.target as Node) && open) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleOutsideClick);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [open, setOpen]);

  // Create a comparison function based on the 'by' prop
  const getComparisonFn = React.useCallback(() => {
    if (typeof by === 'string') {
      return (a: any, b: any) => a?.[by] === b?.[by];
    }
    return by || ((a: any, b: any) => a === b);
  }, [by]);

  const handleChange = React.useCallback(
    (newValue: any) => {
      const compareFn = getComparisonFn();
      
      if (multiple) {
        if (!value) {
          setValue([newValue]);
          return;
        }
        
        const isSelected = value.some((item: any) => compareFn(item, newValue));
        
        if (isSelected) {
          setValue(value.filter((item: any) => !compareFn(item, newValue)));
        } else {
          setValue([...value, newValue]);
        }
      } else {
        setValue(newValue);
        setOpen(false);
      }
    },
    [getComparisonFn, multiple, setOpen, setValue, value]
  );

  const contextValue = React.useMemo(
    () => ({
      open: Boolean(open),
      setOpen,
      value,
      onChange: handleChange,
      multiple,
      disabled,
      invalid,
      by,
      name,
      horizontal,
    }),
    [open, setOpen, value, handleChange, multiple, disabled, invalid, by, name, horizontal]
  );

  return (
    <ListboxContext.Provider value={contextValue}>
      <div ref={listboxRef} className={cn("relative", className)}>
        {children}
        {name && value && !multiple && (
          <input type="hidden" name={name} value={JSON.stringify(value)} />
        )}
        {name && value && multiple && Array.isArray(value) && value.map((item, index) => (
          <input
            key={index}
            type="hidden"
            name={`${name}[${index}]`}
            value={JSON.stringify(item)}
          />
        ))}
      </div>
    </ListboxContext.Provider>
  );
}

export function ListboxButton({
  children,
  asChild = false,
  className,
}: ListboxButtonProps) {
  const { open, setOpen, disabled, invalid } = useListboxContext();
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      type="button"
      aria-haspopup="listbox"
      aria-expanded={open}
      disabled={disabled}
      className={cn(
        "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
        invalid && "border-destructive focus:ring-destructive",
        className
      )}
      onClick={() => setOpen(!open)}
    >
      {children}
    </Comp>
  );
}

export function ListboxSelectedOption({
  children,
  placeholder = "Select an option",
  className,
}: ListboxSelectedOptionProps) {
  const { value, multiple, by } = useListboxContext();

  if (multiple && Array.isArray(value) && value.length > 0) {
    return (
      <div className={cn("flex flex-wrap gap-1", className)}>
        {children ? children : `${value.length} selected`}
      </div>
    );
  }

  if (!value || (Array.isArray(value) && value.length === 0)) {
    return <div className={cn("text-muted-foreground", className)}>{placeholder}</div>;
  }

  return <div className={className}>{children}</div>;
}

export function ListboxOptions({ children, className }: ListboxOptionsProps) {
  const { open, horizontal } = useListboxContext();

  // Don't render anything when closed
  if (!open) return null;

  return (
    <div
      className={cn(
        "absolute z-50 mt-1 max-h-60 min-w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
        horizontal && "flex",
        className
      )}
      role="listbox"
      style={{ display: open ? 'block' : 'none', pointerEvents: open ? 'auto' : 'none' }}
    >
      {children}
    </div>
  );
}

export function ListboxOption({
  children,
  value,
  disabled = false,
  className,
}: ListboxOptionProps) {
  const { value: selectedValue, onChange, multiple, by } = useListboxContext();
  
  // Create a comparison function based on the 'by' prop
  const getComparisonFn = React.useCallback(() => {
    if (typeof by === 'string') {
      return (a: any, b: any) => a?.[by] === b?.[by];
    }
    return by || ((a: any, b: any) => a === b);
  }, [by]);
  
  const compareFn = getComparisonFn();
    
  const isSelected = multiple && Array.isArray(selectedValue)
    ? selectedValue?.some((item) => compareFn(item, value))
    : compareFn(selectedValue, value);

  return (
    <div
      role="option"
      aria-selected={isSelected}
      aria-disabled={disabled}
      className={cn(
        "relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
        isSelected ? "bg-accent text-accent-foreground" : "hover:bg-accent hover:text-accent-foreground",
        disabled && "pointer-events-none opacity-50",
        className
      )}
      data-disabled={disabled ? "" : undefined}
      onClick={() => {
        if (!disabled) {
          onChange(value);
        }
      }}
    >
      <span className="absolute left-2 flex h-4 w-4 items-center justify-center">
        {isSelected && <Check className="h-4 w-4" />}
      </span>
      {children}
    </div>
  );
}

export function ListboxSection({
  children,
  title,
  className,
}: ListboxSectionProps) {
  return (
    <div role="group" aria-label={title} className={className}>
      {title && (
        <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
          {title}
        </div>
      )}
      {children}
    </div>
  );
}

export function ListboxLabel({ children, className }: ListboxLabelProps) {
  return (
    <div className={cn("mb-2 text-sm font-medium", className)}>
      {children}
    </div>
  );
}

export function ListboxDivider({ className }: ListboxDividerProps) {
  return (
    <div className={cn("my-1 h-px bg-muted", className)} />
  );
}
