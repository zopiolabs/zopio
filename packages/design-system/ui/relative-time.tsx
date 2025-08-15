/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "../lib/utils";

const relativeTimeVariants = cva("text-sm", {
  variants: {
    variant: {
      default: "text-foreground",
      muted: "text-muted-foreground",
      secondary: "text-secondary-foreground",
    },
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "md",
  },
});

interface RelativeTimeProps
  extends React.HTMLAttributes<HTMLTimeElement>,
    VariantProps<typeof relativeTimeVariants> {
  date: Date | string | number;
  updateInterval?: number;
  format?: "relative" | "absolute" | "both";
  locale?: string;
  showTooltip?: boolean;
}

const RelativeTime = React.forwardRef<HTMLTimeElement, RelativeTimeProps>(
  (
    {
      className,
      variant,
      size,
      date,
      updateInterval = 60000, // Update every minute by default
      format = "relative",
      locale = "en-US",
      showTooltip = true,
      ...props
    },
    ref
  ) => {
    const [currentTime, setCurrentTime] = React.useState(new Date());
    const dateObj = React.useMemo(() => new Date(date), [date]);

    // Update current time periodically
    React.useEffect(() => {
      const interval = setInterval(() => {
        setCurrentTime(new Date());
      }, updateInterval);

      return () => clearInterval(interval);
    }, [updateInterval]);

    const getRelativeTime = (date: Date, now: Date): string => {
      const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const diffInHours = Math.floor(diffInMinutes / 60);
      const diffInDays = Math.floor(diffInHours / 24);
      const diffInWeeks = Math.floor(diffInDays / 7);
      const diffInMonths = Math.floor(diffInDays / 30);
      const diffInYears = Math.floor(diffInDays / 365);

      // Future dates
      if (diffInSeconds < 0) {
        const absDiffInSeconds = Math.abs(diffInSeconds);
        const absDiffInMinutes = Math.abs(diffInMinutes);
        const absDiffInHours = Math.abs(diffInHours);
        const absDiffInDays = Math.abs(diffInDays);

        if (absDiffInSeconds < 60) return "in a few seconds";
        if (absDiffInMinutes === 1) return "in 1 minute";
        if (absDiffInMinutes < 60) return `in ${absDiffInMinutes} minutes`;
        if (absDiffInHours === 1) return "in 1 hour";
        if (absDiffInHours < 24) return `in ${absDiffInHours} hours`;
        if (absDiffInDays === 1) return "tomorrow";
        if (absDiffInDays < 7) return `in ${absDiffInDays} days`;
        return date.toLocaleDateString(locale);
      }

      // Past dates
      if (diffInSeconds < 60) return "just now";
      if (diffInMinutes === 1) return "1 minute ago";
      if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`;
      if (diffInHours === 1) return "1 hour ago";
      if (diffInHours < 24) return `${diffInHours} hours ago`;
      if (diffInDays === 1) return "yesterday";
      if (diffInDays < 7) return `${diffInDays} days ago`;
      if (diffInWeeks === 1) return "1 week ago";
      if (diffInWeeks < 4) return `${diffInWeeks} weeks ago`;
      if (diffInMonths === 1) return "1 month ago";
      if (diffInMonths < 12) return `${diffInMonths} months ago`;
      if (diffInYears === 1) return "1 year ago";
      return `${diffInYears} years ago`;
    };

    const getAbsoluteTime = (date: Date): string => {
      return date.toLocaleDateString(locale, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    };

    const relativeText = getRelativeTime(dateObj, currentTime);
    const absoluteText = getAbsoluteTime(dateObj);

    const displayText = React.useMemo(() => {
      switch (format) {
        case "relative":
          return relativeText;
        case "absolute":
          return absoluteText;
        case "both":
          return `${relativeText} (${absoluteText})`;
        default:
          return relativeText;
      }
    }, [format, relativeText, absoluteText]);

    const tooltipText = format === "absolute" ? relativeText : absoluteText;

    return (
      <time
        ref={ref}
        className={cn(relativeTimeVariants({ variant, size, className }))}
        dateTime={dateObj.toISOString()}
        title={showTooltip ? tooltipText : undefined}
        {...props}
      >
        {displayText}
      </time>
    );
  }
);

RelativeTime.displayName = "RelativeTime";

// Multi-timezone component
interface TimeZoneDisplayProps extends React.HTMLAttributes<HTMLDivElement> {
  timezones: Array<{
    label: string;
    timezone: string;
  }>;
  time?: Date;
  format?: "12h" | "24h";
}

const TimeZoneDisplay = React.forwardRef<HTMLDivElement, TimeZoneDisplayProps>(
  ({ className, timezones, time, format = "24h", ...props }, ref) => {
    const [currentTime, setCurrentTime] = React.useState(time || new Date());

    React.useEffect(() => {
      if (!time) {
        const interval = setInterval(() => {
          setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
      }
    }, [time]);

    React.useEffect(() => {
      if (time) {
        setCurrentTime(time);
      }
    }, [time]);

    const formatTime = (date: Date, timezone: string): string => {
      return date.toLocaleTimeString("en-US", {
        timeZone: timezone,
        hour12: format === "12h",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });
    };

    const formatDate = (date: Date, timezone: string): string => {
      return date.toLocaleDateString("en-US", {
        timeZone: timezone,
        weekday: "short",
        month: "short",
        day: "numeric",
      });
    };

    return (
      <div
        ref={ref}
        className={cn("space-y-2", className)}
        {...props}
      >
        {timezones.map((tz) => (
          <div
            key={tz.timezone}
            className="flex items-center justify-between rounded-lg border bg-card p-3"
          >
            <div className="flex flex-col">
              <span className="text-sm font-medium">{tz.label}</span>
              <span className="text-xs text-muted-foreground">
                {formatDate(currentTime, tz.timezone)}
              </span>
            </div>
            <div className="text-right">
              <span className="font-mono text-lg font-semibold">
                {formatTime(currentTime, tz.timezone)}
              </span>
            </div>
          </div>
        ))}
      </div>
    );
  }
);

TimeZoneDisplay.displayName = "TimeZoneDisplay";

export { RelativeTime, TimeZoneDisplay, relativeTimeVariants };
export type { RelativeTimeProps, TimeZoneDisplayProps };
