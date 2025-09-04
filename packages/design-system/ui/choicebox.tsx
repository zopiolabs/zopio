/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Check } from "lucide-react";
import { cn } from "../lib/utils";

const choiceboxVariants = cva(
  "relative flex cursor-pointer rounded-lg border p-4 transition-all duration-200 focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-border bg-background hover:bg-accent/50",
        selected: "border-primary bg-primary/5 hover:bg-primary/10",
      },
      size: {
        sm: "p-3",
        md: "p-4",
        lg: "p-5",
      },
      orientation: {
        horizontal: "flex-row items-center gap-3",
        vertical: "flex-col gap-2",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
      orientation: "horizontal",
    },
  }
);

const choiceboxGroupVariants = cva("space-y-2", {
  variants: {
    orientation: {
      horizontal: "flex flex-wrap gap-2",
      vertical: "space-y-2",
    },
  },
  defaultVariants: {
    orientation: "vertical",
  },
});

interface ChoiceboxContextValue {
  name?: string;
  value?: string | string[];
  onChange?: (value: string) => void;
  type: "radio" | "checkbox";
  disabled?: boolean;
}

const ChoiceboxContext = React.createContext<ChoiceboxContextValue | null>(null);

interface ChoiceboxGroupProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof choiceboxGroupVariants> {
  name?: string;
  value?: string | string[];
  defaultValue?: string | string[];
  onValueChange?: (value: string | string[]) => void;
  type?: "radio" | "checkbox";
  disabled?: boolean;
}

const ChoiceboxGroup = React.forwardRef<HTMLDivElement, ChoiceboxGroupProps>(
  (
    {
      className,
      orientation,
      children,
      name,
      value,
      defaultValue,
      onValueChange,
      type = "radio",
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<string | string[]>(
      value !== undefined ? value : defaultValue || (type === "checkbox" ? [] : "")
    );

    const currentValue = value !== undefined ? value : internalValue;

    const handleChange = React.useCallback(
      (selectedValue: string) => {
        let newValue: string | string[];

        if (type === "checkbox") {
          const currentArray = Array.isArray(currentValue) ? currentValue : [];
          if (currentArray.includes(selectedValue)) {
            newValue = currentArray.filter((v) => v !== selectedValue);
          } else {
            newValue = [...currentArray, selectedValue];
          }
        } else {
          newValue = selectedValue;
        }

        if (value === undefined) {
          setInternalValue(newValue);
        }
        onValueChange?.(newValue);
      },
      [currentValue, type, value, onValueChange]
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalValue(value);
      }
    }, [value]);

    const contextValue = React.useMemo(
      () => ({
        name,
        value: currentValue,
        onChange: handleChange,
        type,
        disabled,
      }),
      [name, currentValue, handleChange, type, disabled]
    );

    return (
      <ChoiceboxContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(choiceboxGroupVariants({ orientation, className }))}
          role={type === "radio" ? "radiogroup" : "group"}
          aria-disabled={disabled}
          {...props}
        >
          {children}
        </div>
      </ChoiceboxContext.Provider>
    );
  }
);

ChoiceboxGroup.displayName = "ChoiceboxGroup";

interface ChoiceboxProps
  extends Omit<React.HTMLAttributes<HTMLLabelElement>, 'title'>,
    VariantProps<typeof choiceboxVariants> {
  value: string;
  disabled?: boolean;
  header?: React.ReactNode;
  title?: React.ReactNode;
  description?: React.ReactNode;
  indicator?: React.ReactNode;
}

const Choicebox = React.forwardRef<HTMLLabelElement, ChoiceboxProps>(
  (
    {
      className,
      variant,
      size,
      orientation,
      children,
      value,
      disabled: propDisabled = false,
      header,
      title,
      description,
      indicator,
      ...props
    },
    ref
  ) => {
    const context = React.useContext(ChoiceboxContext);
    const inputRef = React.useRef<HTMLInputElement>(null);

    if (!context) {
      throw new Error("Choicebox must be used within a ChoiceboxGroup");
    }

    const { name, value: groupValue, onChange, type, disabled: groupDisabled } = context;
    const disabled = propDisabled || groupDisabled;

    const isSelected = React.useMemo(() => {
      if (type === "checkbox") {
        return Array.isArray(groupValue) && groupValue.includes(value);
      }
      return groupValue === value;
    }, [groupValue, value, type]);

    const handleClick = React.useCallback(() => {
      if (disabled) return;
      onChange?.(value);
    }, [disabled, onChange, value]);

    const handleKeyDown = React.useCallback(
      (e: React.KeyboardEvent) => {
        if (disabled) return;
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onChange?.(value);
        }
      },
      [disabled, onChange, value]
    );

    return (
      <label
        ref={ref}
        className={cn(
          choiceboxVariants({
            variant: isSelected ? "selected" : "default",
            size,
            orientation,
            className,
          }),
          disabled && "cursor-not-allowed opacity-50"
        )}
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        tabIndex={disabled ? -1 : 0}
        role={type === "radio" ? "radio" : "checkbox"}
        aria-checked={isSelected}
        aria-disabled={disabled}
        {...props}
      >
        <input
          ref={inputRef}
          type={type}
          name={name}
          value={value}
          checked={isSelected}
          disabled={disabled}
          onChange={() => {}} // Handled by label click
          className="sr-only"
          tabIndex={-1}
        />

        <div className="flex-1 min-w-0">
          {header && (
            <div className="text-xs font-medium text-muted-foreground mb-1">
              {header}
            </div>
          )}
          
          {title && (
            <div className="font-medium text-foreground mb-1">
              {title}
            </div>
          )}
          
          {description && (
            <div className="text-sm text-muted-foreground">
              {description}
            </div>
          )}
          
          {children}
        </div>

        <div className="flex-shrink-0 flex items-center">
          {indicator || (
            <div
              className={cn(
                "flex h-4 w-4 items-center justify-center rounded border-2 transition-colors",
                type === "radio" && "rounded-full",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-muted-foreground/25"
              )}
            >
              {isSelected && <Check className="h-3 w-3" />}
            </div>
          )}
        </div>
      </label>
    );
  }
);

Choicebox.displayName = "Choicebox";

// Choicebox Header component
interface ChoiceboxHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChoiceboxHeader = React.forwardRef<HTMLDivElement, ChoiceboxHeaderProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-xs font-medium text-muted-foreground mb-1", className)}
        {...props}
      />
    );
  }
);

ChoiceboxHeader.displayName = "ChoiceboxHeader";

// Choicebox Title component
interface ChoiceboxTitleProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChoiceboxTitle = React.forwardRef<HTMLDivElement, ChoiceboxTitleProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("font-medium text-foreground mb-1", className)}
        {...props}
      />
    );
  }
);

ChoiceboxTitle.displayName = "ChoiceboxTitle";

// Choicebox Description component
interface ChoiceboxDescriptionProps extends React.HTMLAttributes<HTMLDivElement> {}

const ChoiceboxDescription = React.forwardRef<HTMLDivElement, ChoiceboxDescriptionProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
      />
    );
  }
);

ChoiceboxDescription.displayName = "ChoiceboxDescription";

// Hook for accessing choicebox context
const useChoicebox = () => {
  const context = React.useContext(ChoiceboxContext);
  if (!context) {
    throw new Error("useChoicebox must be used within a ChoiceboxGroup");
  }
  return context;
};

export {
  Choicebox,
  ChoiceboxGroup,
  ChoiceboxHeader,
  ChoiceboxTitle,
  ChoiceboxDescription,
  useChoicebox,
  choiceboxVariants,
  choiceboxGroupVariants,
};

export type {
  ChoiceboxProps,
  ChoiceboxGroupProps,
  ChoiceboxHeaderProps,
  ChoiceboxTitleProps,
  ChoiceboxDescriptionProps,
  ChoiceboxContextValue,
};
