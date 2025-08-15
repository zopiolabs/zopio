/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../lib/utils";

const tickerVariants = cva(
  "inline-flex items-center gap-2 text-sm font-medium",
  {
    variants: {
      size: {
        sm: "text-xs gap-1",
        md: "text-sm gap-2",
        lg: "text-base gap-2",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface TickerProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof tickerVariants> {
  symbol: string;
  price: number;
  change?: number;
  changePercent?: number;
  currency?: string;
  locale?: string;
  showIcon?: boolean;
  showPercentage?: boolean;
  iconSrc?: string;
  iconAlt?: string;
}

const Ticker = React.forwardRef<HTMLDivElement, TickerProps>(
  (
    {
      className,
      size,
      symbol,
      price,
      change,
      changePercent,
      currency = "USD",
      locale = "en-US",
      showIcon = false,
      showPercentage = false,
      iconSrc,
      iconAlt,
      ...props
    },
    ref
  ) => {
    const [iconError, setIconError] = React.useState(false);
    
    const formatPrice = (value: number): string => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    const formatChange = (value: number): string => {
      const formatted = new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: "always",
      }).format(value);
      return formatted;
    };

    const formatPercentage = (value: number): string => {
      return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: "always",
      }).format(value / 100);
    };

    const isPositive = change !== undefined ? change >= 0 : false;
    const changeColor = isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400";

    return (
      <div
        ref={ref}
        className={cn(tickerVariants({ size, className }))}
        {...props}
      >
        <TickerIcon 
          src={iconSrc}
          alt={iconAlt}
          symbol={symbol}
          show={showIcon}
          onError={() => setIconError(true)}
          error={iconError}
        />
        
        <TickerSymbol>{symbol}</TickerSymbol>
        
        <TickerPrice currency={currency} locale={locale}>
          {price}
        </TickerPrice>
        
        {change !== undefined && (
          <TickerChange 
            value={change}
            percentage={changePercent}
            currency={currency}
            locale={locale}
            showPercentage={showPercentage}
            positive={isPositive}
          />
        )}
      </div>
    );
  }
);

Ticker.displayName = "Ticker";

// Ticker Icon component
interface TickerIconProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  symbol: string;
  show: boolean;
  onError?: () => void;
  error?: boolean;
}

const TickerIcon = React.forwardRef<HTMLDivElement, TickerIconProps>(
  ({ className, src, alt, symbol, show, onError, error, ...props }, ref) => {
    if (!show) return null;

    if (!src || error) {
      return (
        <div
          ref={ref}
          className={cn(
            "flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground",
            className
          )}
          {...props}
        >
          {symbol.slice(0, 2).toUpperCase()}
        </div>
      );
    }

    return (
      <div ref={ref} className={cn("flex-shrink-0", className)} {...props}>
        <img
          src={src}
          alt={alt || symbol}
          className="h-6 w-6 rounded-full"
          onError={onError}
        />
      </div>
    );
  }
);

TickerIcon.displayName = "TickerIcon";

// Ticker Symbol component
interface TickerSymbolProps extends React.HTMLAttributes<HTMLSpanElement> {}

const TickerSymbol = React.forwardRef<HTMLSpanElement, TickerSymbolProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn("font-semibold text-foreground", className)}
        {...props}
      >
        {children}
      </span>
    );
  }
);

TickerSymbol.displayName = "TickerSymbol";

// Ticker Price component
interface TickerPriceProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency?: string;
  locale?: string;
  children: number;
}

const TickerPrice = React.forwardRef<HTMLSpanElement, TickerPriceProps>(
  ({ className, currency = "USD", locale = "en-US", children, ...props }, ref) => {
    const formatPrice = (value: number): string => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    };

    return (
      <span
        ref={ref}
        className={cn("font-semibold text-foreground", className)}
        {...props}
      >
        {formatPrice(children)}
      </span>
    );
  }
);

TickerPrice.displayName = "TickerPrice";

// Ticker Change component
interface TickerChangeProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: number;
  percentage?: number;
  currency?: string;
  locale?: string;
  showPercentage?: boolean;
  positive: boolean;
}

const TickerChange = React.forwardRef<HTMLSpanElement, TickerChangeProps>(
  (
    {
      className,
      value,
      percentage,
      currency = "USD",
      locale = "en-US",
      showPercentage = false,
      positive,
      ...props
    },
    ref
  ) => {
    const formatChange = (val: number): string => {
      return new Intl.NumberFormat(locale, {
        style: "currency",
        currency: currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: "always",
      }).format(val);
    };

    const formatPercentage = (val: number): string => {
      return new Intl.NumberFormat(locale, {
        style: "percent",
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
        signDisplay: "always",
      }).format(val / 100);
    };

    const changeColor = positive 
      ? "text-green-600 dark:text-green-400" 
      : "text-red-600 dark:text-red-400";

    const TrendIcon = positive ? TrendingUp : TrendingDown;

    return (
      <span
        ref={ref}
        className={cn("inline-flex items-center gap-1 font-medium", changeColor, className)}
        {...props}
      >
        <TrendIcon className="h-3 w-3" />
        <span>
          {formatChange(value)}
          {showPercentage && percentage !== undefined && (
            <span className="ml-1">
              ({formatPercentage(percentage)})
            </span>
          )}
        </span>
      </span>
    );
  }
);

TickerChange.displayName = "TickerChange";

export {
  Ticker,
  TickerIcon,
  TickerSymbol,
  TickerPrice,
  TickerChange,
  tickerVariants,
};

export type {
  TickerProps,
  TickerIconProps,
  TickerSymbolProps,
  TickerPriceProps,
  TickerChangeProps,
};
