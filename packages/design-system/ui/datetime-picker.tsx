/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ChevronDownIcon } from "lucide-react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";
import { Button } from "@repo/design-system/ui/button";
import { Calendar } from "@repo/design-system/ui/calendar";
import { Input } from "@repo/design-system/ui/input";
import { Label } from "@repo/design-system/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@repo/design-system/ui/popover";

const dateTimePickerVariants = cva(
  "flex flex-col gap-3",
  {
    variants: {
      variant: {
        default: "",
        compact: "gap-2",
      },
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function formatDate(date: Date | undefined, formatStr: string = "PPP") {
  if (!date) {
    return "";
  }
  return format(date, formatStr);
}

function isValidDate(date: Date | undefined) {
  if (!date) {
    return false;
  }
  return !isNaN(date.getTime());
}

export interface DateTimePickerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  variant?: VariantProps<typeof dateTimePickerVariants>["variant"];
  size?: VariantProps<typeof dateTimePickerVariants>["size"];
  label?: string;
  placeholder?: string;
  value?: Date;
  onValueChange?: (date: Date | undefined) => void;
  disabled?: boolean;
  withInput?: boolean;
  captionLayout?: "buttons" | "dropdown";
  formatString?: string;
}

const DateTimePicker = React.forwardRef<HTMLDivElement, DateTimePickerProps>(
  (
    {
      className,
      variant,
      size,
      label,
      placeholder = "Pick a date",
      value,
      onValueChange,
      disabled = false,
      withInput = false,
      captionLayout = "buttons",
      formatString = "PPP",
      ...props
    },
    ref
  ) => {
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(value);
    const [month, setMonth] = React.useState<Date | undefined>(value);
    const [inputValue, setInputValue] = React.useState(
      formatDate(value, formatString)
    );

    React.useEffect(() => {
      setDate(value);
      setMonth(value);
      setInputValue(formatDate(value, formatString));
    }, [value, formatString]);

    const handleDateSelect = (selectedDate: Date | undefined) => {
      setDate(selectedDate);
      setInputValue(formatDate(selectedDate, formatString));
      onValueChange?.(selectedDate);
      setOpen(false);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setInputValue(newValue);
      
      const parsedDate = new Date(newValue);
      if (isValidDate(parsedDate)) {
        setDate(parsedDate);
        setMonth(parsedDate);
        onValueChange?.(parsedDate);
      }
    };

    if (withInput) {
      return (
        <div
          ref={ref}
          className={cn(dateTimePickerVariants({ variant, size, className }))}
          {...props}
        >
          {label && (
            <Label htmlFor="date" className="px-1">
              {label}
            </Label>
          )}
          <div className="relative flex gap-2">
            <Input
              id="date"
              value={inputValue}
              placeholder={placeholder}
              className="bg-background pr-10"
              disabled={disabled}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") {
                  e.preventDefault();
                  setOpen(true);
                }
              }}
            />
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="ghost"
                  className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                  disabled={disabled}
                >
                  <CalendarIcon className="size-3.5" />
                  <span className="sr-only">Select date</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="w-auto overflow-hidden p-0"
                align="end"
                alignOffset={-8}
                sideOffset={10}
              >
                <Calendar
                  mode="single"
                  selected={date}
                  captionLayout={captionLayout}
                  month={month}
                  onMonthChange={setMonth}
                  onSelect={handleDateSelect}
                  disabled={disabled}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn(dateTimePickerVariants({ variant, size, className }))}
        {...props}
      >
        {label && (
          <Label htmlFor="date" className="px-1">
            {label}
          </Label>
        )}
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              id="date"
              className={cn(
                "w-[280px] justify-start text-left font-normal",
                !date && "text-muted-foreground"
              )}
              disabled={disabled}
            >
              <CalendarIcon />
              {date ? formatDate(date, formatString) : <span>{placeholder}</span>}
              {captionLayout === "dropdown" && <ChevronDownIcon />}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={date}
              captionLayout={captionLayout}
              onSelect={handleDateSelect}
              disabled={disabled}
            />
          </PopoverContent>
        </Popover>
      </div>
    );
  }
);

DateTimePicker.displayName = "DateTimePicker";

export { DateTimePicker, dateTimePickerVariants };
