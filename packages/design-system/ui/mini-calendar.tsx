/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "../lib/utils";

const miniCalendarVariants = cva(
  "flex flex-col gap-2 p-3 rounded-lg border bg-card text-card-foreground",
  {
    variants: {
      size: {
        sm: "text-xs",
        md: "text-sm",
        lg: "text-base",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

const miniCalendarDayVariants = cva(
  "flex flex-col items-center justify-center rounded-md transition-colors cursor-pointer",
  {
    variants: {
      variant: {
        default: "hover:bg-accent hover:text-accent-foreground",
        today: "bg-accent text-accent-foreground",
        selected: "bg-primary text-primary-foreground",
      },
      size: {
        sm: "h-12 w-12 text-xs",
        md: "h-14 w-14 text-sm",
        lg: "h-16 w-16 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface MiniCalendarContextValue {
  selectedDate?: Date;
  onDateSelect?: (date: Date) => void;
  startDate: Date;
  onStartDateChange?: (date: Date) => void;
  numberOfDays: number;
  size: "sm" | "md" | "lg";
}

const MiniCalendarContext = React.createContext<MiniCalendarContextValue | null>(null);

interface MiniCalendarProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>,
    VariantProps<typeof miniCalendarVariants> {
  value?: Date;
  defaultValue?: Date;
  onValueChange?: (date: Date) => void;
  startDate?: Date;
  defaultStartDate?: Date;
  onStartDateChange?: (date: Date) => void;
  numberOfDays?: number;
}

const MiniCalendar = React.forwardRef<HTMLDivElement, MiniCalendarProps>(
  (
    {
      className,
      size,
      children,
      value,
      defaultValue,
      onValueChange,
      startDate,
      defaultStartDate,
      onStartDateChange,
      numberOfDays = 5,
      ...props
    },
    ref
  ) => {
    const [internalSelectedDate, setInternalSelectedDate] = React.useState<Date | undefined>(
      value !== undefined ? value : defaultValue
    );
    const [internalStartDate, setInternalStartDate] = React.useState<Date>(
      startDate !== undefined ? startDate : defaultStartDate || new Date()
    );

    const currentSelectedDate = value !== undefined ? value : internalSelectedDate;
    const currentStartDate = startDate !== undefined ? startDate : internalStartDate;

    const handleDateSelect = React.useCallback(
      (date: Date) => {
        if (value === undefined) {
          setInternalSelectedDate(date);
        }
        onValueChange?.(date);
      },
      [value, onValueChange]
    );

    const handleStartDateChange = React.useCallback(
      (date: Date) => {
        if (startDate === undefined) {
          setInternalStartDate(date);
        }
        onStartDateChange?.(date);
      },
      [startDate, onStartDateChange]
    );

    React.useEffect(() => {
      if (value !== undefined) {
        setInternalSelectedDate(value);
      }
    }, [value]);

    React.useEffect(() => {
      if (startDate !== undefined) {
        setInternalStartDate(startDate);
      }
    }, [startDate]);

    const contextValue = React.useMemo(
      () => ({
        selectedDate: currentSelectedDate,
        onDateSelect: handleDateSelect,
        startDate: currentStartDate,
        onStartDateChange: handleStartDateChange,
        numberOfDays,
        size: size || "md",
      }),
      [currentSelectedDate, handleDateSelect, currentStartDate, handleStartDateChange, numberOfDays, size]
    );

    return (
      <MiniCalendarContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(miniCalendarVariants({ size, className }))}
          {...props}
        >
          {children}
        </div>
      </MiniCalendarContext.Provider>
    );
  }
);

MiniCalendar.displayName = "MiniCalendar";

// Mini Calendar Navigation
interface MiniCalendarNavigationProps extends React.HTMLAttributes<HTMLDivElement> {}

const MiniCalendarNavigation = React.forwardRef<HTMLDivElement, MiniCalendarNavigationProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(MiniCalendarContext);
    
    if (!context) {
      throw new Error("MiniCalendarNavigation must be used within a MiniCalendar");
    }

    const { startDate, onStartDateChange, numberOfDays } = context;

    const handlePrevious = () => {
      const newStartDate = new Date(startDate);
      newStartDate.setDate(startDate.getDate() - numberOfDays);
      onStartDateChange?.(newStartDate);
    };

    const handleNext = () => {
      const newStartDate = new Date(startDate);
      newStartDate.setDate(startDate.getDate() + numberOfDays);
      onStartDateChange?.(newStartDate);
    };

    const formatMonthYear = (date: Date) => {
      return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    };

    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between", className)}
        {...props}
      >
        <button
          type="button"
          onClick={handlePrevious}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          aria-label="Previous dates"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        
        <div className="font-medium">
          {formatMonthYear(startDate)}
        </div>
        
        <button
          type="button"
          onClick={handleNext}
          className="flex h-8 w-8 items-center justify-center rounded-md hover:bg-accent hover:text-accent-foreground"
          aria-label="Next dates"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    );
  }
);

MiniCalendarNavigation.displayName = "MiniCalendarNavigation";

// Mini Calendar Days Container
interface MiniCalendarDaysProps extends React.HTMLAttributes<HTMLDivElement> {}

const MiniCalendarDays = React.forwardRef<HTMLDivElement, MiniCalendarDaysProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(MiniCalendarContext);
    
    if (!context) {
      throw new Error("MiniCalendarDays must be used within a MiniCalendar");
    }

    const { startDate, numberOfDays } = context;

    const days = React.useMemo(() => {
      const daysArray = [];
      for (let i = 0; i < numberOfDays; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        daysArray.push(date);
      }
      return daysArray;
    }, [startDate, numberOfDays]);

    return (
      <div
        ref={ref}
        className={cn("flex gap-1", className)}
        {...props}
      >
        {children || days.map((date, index) => (
          <MiniCalendarDay key={`${date.toISOString()}-${index}`} date={date} />
        ))}
      </div>
    );
  }
);

MiniCalendarDays.displayName = "MiniCalendarDays";

// Mini Calendar Day
interface MiniCalendarDayProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof miniCalendarDayVariants> {
  date: Date;
}

const MiniCalendarDay = React.forwardRef<HTMLButtonElement, MiniCalendarDayProps>(
  ({ className, variant, size, date, ...props }, ref) => {
    const context = React.useContext(MiniCalendarContext);
    
    if (!context) {
      throw new Error("MiniCalendarDay must be used within a MiniCalendar");
    }

    const { selectedDate, onDateSelect, size: contextSize } = context;

    const isToday = React.useMemo(() => {
      const today = new Date();
      return (
        date.getDate() === today.getDate() &&
        date.getMonth() === today.getMonth() &&
        date.getFullYear() === today.getFullYear()
      );
    }, [date]);

    const isSelected = React.useMemo(() => {
      if (!selectedDate) return false;
      return (
        date.getDate() === selectedDate.getDate() &&
        date.getMonth() === selectedDate.getMonth() &&
        date.getFullYear() === selectedDate.getFullYear()
      );
    }, [date, selectedDate]);

    const getVariant = () => {
      if (variant) return variant;
      if (isSelected) return "selected";
      if (isToday) return "today";
      return "default";
    };

    const formatDay = (date: Date) => {
      return date.getDate().toString();
    };

    const formatDayName = (date: Date) => {
      return date.toLocaleDateString('en-US', { weekday: 'short' });
    };

    const handleClick = () => {
      onDateSelect?.(date);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          miniCalendarDayVariants({ 
            variant: getVariant(), 
            size: size || contextSize,
            className 
          })
        )}
        onClick={handleClick}
        aria-label={`Select ${date.toLocaleDateString()}`}
        aria-pressed={isSelected}
        {...props}
      >
        <div className="font-medium">
          {formatDay(date)}
        </div>
        <div className="text-xs opacity-70">
          {formatDayName(date)}
        </div>
      </button>
    );
  }
);

MiniCalendarDay.displayName = "MiniCalendarDay";

// Mini Calendar Header (for custom layouts)
interface MiniCalendarHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const MiniCalendarHeader = React.forwardRef<HTMLDivElement, MiniCalendarHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center justify-between mb-2", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MiniCalendarHeader.displayName = "MiniCalendarHeader";

// Mini Calendar Content (for custom layouts)
interface MiniCalendarContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const MiniCalendarContent = React.forwardRef<HTMLDivElement, MiniCalendarContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

MiniCalendarContent.displayName = "MiniCalendarContent";

// Hook for accessing mini calendar context
const useMiniCalendar = () => {
  const context = React.useContext(MiniCalendarContext);
  if (!context) {
    throw new Error("useMiniCalendar must be used within a MiniCalendar component");
  }
  return context;
};

// Utility functions
const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
  return (
    date1.getDate() === date2.getDate() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getFullYear() === date2.getFullYear()
  );
};

const isToday = (date: Date): boolean => {
  return isSameDay(date, new Date());
};

export {
  MiniCalendar,
  MiniCalendarNavigation,
  MiniCalendarDays,
  MiniCalendarDay,
  MiniCalendarHeader,
  MiniCalendarContent,
  useMiniCalendar,
  miniCalendarVariants,
  miniCalendarDayVariants,
  addDays,
  isSameDay,
  isToday,
};

export type {
  MiniCalendarProps,
  MiniCalendarNavigationProps,
  MiniCalendarDaysProps,
  MiniCalendarDayProps,
  MiniCalendarHeaderProps,
  MiniCalendarContentProps,
  MiniCalendarContextValue,
};
