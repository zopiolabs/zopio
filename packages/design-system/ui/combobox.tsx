/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check, ChevronDown, Search, Plus } from "lucide-react";
import { cn } from "../lib/utils";

const comboboxVariants = cva(
  "flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
  {
    variants: {
      size: {
        sm: "h-8 px-2 text-xs",
        md: "h-10 px-3 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const comboboxContentVariants = cva(
  "relative z-50 max-h-96 min-w-[8rem] overflow-hidden rounded-md border bg-popover text-popover-foreground shadow-md data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
  {
    variants: {
      width: {
        trigger: "w-full",
        content: "w-auto min-w-[200px]",
        fixed: "w-[300px]",
      },
    },
    defaultVariants: {
      width: "trigger",
    },
  }
);

interface ComboboxItemData {
  value: string;
  label: string;
  group?: string;
  disabled?: boolean;
}

interface ComboboxContextValue {
  open: boolean;
  setOpen: (open: boolean) => void;
  value?: string;
  onValueChange?: (value: string) => void;
  search: string;
  setSearch: (search: string) => void;
  items: ComboboxItemData[];
  filteredItems: ComboboxItemData[];
  onCreateNew?: (value: string) => void;
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
}

const ComboboxContext = React.createContext<ComboboxContextValue | null>(null);

interface ComboboxProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof comboboxVariants> {
  value?: string;
  defaultValue?: string;
  onValueChange?: (value: string) => void;
  items: ComboboxItemData[];
  placeholder?: string;
  emptyMessage?: string;
  searchPlaceholder?: string;
  disabled?: boolean;
  onCreateNew?: (value: string) => void;
  allowCreateNew?: boolean;
}

const Combobox = React.forwardRef<HTMLDivElement, ComboboxProps>(
  (
    {
      className,
      size,
      children,
      value,
      defaultValue,
      onValueChange,
      items,
      placeholder = "Select an option...",
      emptyMessage = "No results found.",
      searchPlaceholder = "Search...",
      disabled = false,
      onCreateNew,
      allowCreateNew = false,
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [search, setSearch] = React.useState("");
    const [internalValue, setInternalValue] = React.useState(
      value !== undefined ? value : defaultValue || ""
    );

    const currentValue = value !== undefined ? value : internalValue;

    const filteredItems = React.useMemo(() => {
      if (!search) return items;
      return items.filter((item) =>
        item.label.toLowerCase().includes(search.toLowerCase()) ||
        item.value.toLowerCase().includes(search.toLowerCase())
      );
    }, [items, search]);

    const selectedItem = React.useMemo(() => {
      return items.find((item) => item.value === currentValue);
    }, [items, currentValue]);

    const handleValueChange = React.useCallback(
      (newValue: string) => {
        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
        setOpen(false);
        setSearch("");
      },
      [value, onValueChange]
    );

    const handleCreateNew = React.useCallback(() => {
      if (search && onCreateNew) {
        onCreateNew(search);
        setSearch("");
        setOpen(false);
      }
    }, [search, onCreateNew]);

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const contextValue = React.useMemo(
      () => ({
        open,
        setOpen,
        value: currentValue,
        onValueChange: handleValueChange,
        search,
        setSearch,
        items,
        filteredItems,
        onCreateNew: handleCreateNew,
        placeholder,
        emptyMessage,
        searchPlaceholder,
      }),
      [
        open,
        currentValue,
        handleValueChange,
        search,
        items,
        filteredItems,
        handleCreateNew,
        placeholder,
        emptyMessage,
        searchPlaceholder,
      ]
    );

    return (
      <ComboboxContext.Provider value={contextValue}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          <ComboboxTrigger size={size} disabled={disabled}>
            {selectedItem ? selectedItem.label : placeholder}
          </ComboboxTrigger>
          {open && (
            <ComboboxContent>
              <ComboboxSearch />
              <ComboboxList>
                {filteredItems.length === 0 && search && allowCreateNew && onCreateNew && (
                  <ComboboxCreateItem />
                )}
                {filteredItems.length === 0 && !allowCreateNew && (
                  <ComboboxEmpty />
                )}
                {filteredItems.map((item) => (
                  <ComboboxItem key={item.value} item={item} />
                ))}
              </ComboboxList>
            </ComboboxContent>
          )}
          {children}
        </div>
      </ComboboxContext.Provider>
    );
  }
);

Combobox.displayName = "Combobox";

// Combobox Trigger
interface ComboboxTriggerProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof comboboxVariants> {
  disabled?: boolean;
}

const ComboboxTrigger = React.forwardRef<HTMLButtonElement, ComboboxTriggerProps>(
  ({ className, size, children, disabled, ...props }, ref) => {
    const context = React.useContext(ComboboxContext);
    
    if (!context) {
      throw new Error("ComboboxTrigger must be used within a Combobox");
    }

    const { open, setOpen } = context;

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          comboboxVariants({ size, className }),
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={() => !disabled && setOpen(!open)}
        disabled={disabled}
        aria-expanded={open}
        aria-haspopup="listbox"
        {...props}
      >
        <span className="truncate">{children}</span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", open && "rotate-180")} />
      </button>
    );
  }
);

ComboboxTrigger.displayName = "ComboboxTrigger";

// Combobox Content
interface ComboboxContentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof comboboxContentVariants> {}

const ComboboxContent = React.forwardRef<HTMLDivElement, ComboboxContentProps>(
  ({ className, width, ...props }, ref) => {
    const context = React.useContext(ComboboxContext);
    
    if (!context) {
      throw new Error("ComboboxContent must be used within a Combobox");
    }

    return (
      <div
        ref={ref}
        className={cn(
          comboboxContentVariants({ width, className }),
          "absolute top-full left-0 mt-1 overflow-auto"
        )}
        {...props}
      />
    );
  }
);

ComboboxContent.displayName = "ComboboxContent";

// Combobox Search
interface ComboboxSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const ComboboxSearch = React.forwardRef<HTMLInputElement, ComboboxSearchProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(ComboboxContext);
    
    if (!context) {
      throw new Error("ComboboxSearch must be used within a Combobox");
    }

    const { search, setSearch, searchPlaceholder } = context;

    return (
      <div className="flex items-center border-b px-3">
        <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
        <input
          ref={ref}
          className={cn(
            "flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50",
            className
          )}
          placeholder={searchPlaceholder}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          {...props}
        />
      </div>
    );
  }
);

ComboboxSearch.displayName = "ComboboxSearch";

// Combobox List
interface ComboboxListProps extends React.HTMLAttributes<HTMLDivElement> {}

const ComboboxList = React.forwardRef<HTMLDivElement, ComboboxListProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("max-h-[300px] overflow-auto p-1", className)}
        {...props}
      />
    );
  }
);

ComboboxList.displayName = "ComboboxList";

// Combobox Item
interface ComboboxItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: ComboboxItemData;
}

const ComboboxItem = React.forwardRef<HTMLDivElement, ComboboxItemProps>(
  ({ className, item, ...props }, ref) => {
    const context = React.useContext(ComboboxContext);
    
    if (!context) {
      throw new Error("ComboboxItem must be used within a Combobox");
    }

    const { value, onValueChange } = context;
    const isSelected = value === item.value;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
          "hover:bg-accent hover:text-accent-foreground",
          isSelected && "bg-accent text-accent-foreground",
          item.disabled && "pointer-events-none opacity-50",
          className
        )}
        onClick={() => !item.disabled && onValueChange?.(item.value)}
        {...props}
      >
        <Check
          className={cn(
            "mr-2 h-4 w-4",
            isSelected ? "opacity-100" : "opacity-0"
          )}
        />
        <span className="truncate">{item.label}</span>
      </div>
    );
  }
);

ComboboxItem.displayName = "ComboboxItem";

// Combobox Empty
interface ComboboxEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const ComboboxEmpty = React.forwardRef<HTMLDivElement, ComboboxEmptyProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(ComboboxContext);
    
    if (!context) {
      throw new Error("ComboboxEmpty must be used within a Combobox");
    }

    const { emptyMessage } = context;

    return (
      <div
        ref={ref}
        className={cn("py-6 text-center text-sm text-muted-foreground", className)}
        {...props}
      >
        {children || emptyMessage}
      </div>
    );
  }
);

ComboboxEmpty.displayName = "ComboboxEmpty";

// Combobox Create Item
interface ComboboxCreateItemProps extends React.HTMLAttributes<HTMLDivElement> {}

const ComboboxCreateItem = React.forwardRef<HTMLDivElement, ComboboxCreateItemProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(ComboboxContext);
    
    if (!context) {
      throw new Error("ComboboxCreateItem must be used within a Combobox");
    }

    const { search, onCreateNew } = context;

    return (
      <div
        ref={ref}
        className={cn(
          "relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none",
          "hover:bg-accent hover:text-accent-foreground border-t",
          className
        )}
        onClick={() => search && onCreateNew?.(search)}
        {...props}
      >
        <Plus className="mr-2 h-4 w-4" />
        <span>Create "{search}"</span>
      </div>
    );
  }
);

ComboboxCreateItem.displayName = "ComboboxCreateItem";

// Combobox Group
interface ComboboxGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  heading?: string;
}

const ComboboxGroup = React.forwardRef<HTMLDivElement, ComboboxGroupProps>(
  ({ className, heading, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("overflow-hidden p-1", className)} {...props}>
        {heading && (
          <div className="px-2 py-1.5 text-xs font-medium text-muted-foreground">
            {heading}
          </div>
        )}
        {children}
      </div>
    );
  }
);

ComboboxGroup.displayName = "ComboboxGroup";

// Hook for accessing combobox context
const useCombobox = () => {
  const context = React.useContext(ComboboxContext);
  if (!context) {
    throw new Error("useCombobox must be used within a Combobox component");
  }
  return context;
};

export {
  Combobox,
  ComboboxTrigger,
  ComboboxContent,
  ComboboxSearch,
  ComboboxList,
  ComboboxItem,
  ComboboxEmpty,
  ComboboxCreateItem,
  ComboboxGroup,
  useCombobox,
  comboboxVariants,
  comboboxContentVariants,
};

export type {
  ComboboxProps,
  ComboboxTriggerProps,
  ComboboxContentProps,
  ComboboxSearchProps,
  ComboboxListProps,
  ComboboxItemProps,
  ComboboxEmptyProps,
  ComboboxCreateItemProps,
  ComboboxGroupProps,
  ComboboxItemData,
  ComboboxContextValue,
};
