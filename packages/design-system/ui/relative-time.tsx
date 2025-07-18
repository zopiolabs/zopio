/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import {
  createContext,
  type HTMLAttributes,
  useContext,
  useEffect,
  useState,
} from 'react';
import { cn } from '@repo/design-system/lib/utils';

const formatDate = (
  date: Date,
  timeZone: string,
  options?: Intl.DateTimeFormatOptions
) =>
  new Intl.DateTimeFormat(
    'en-US',
    options ?? {
      dateStyle: 'long',
      timeZone,
    }
  ).format(date);

const formatTime = (
  date: Date,
  timeZone: string,
  options?: Intl.DateTimeFormatOptions
) =>
  new Intl.DateTimeFormat(
    'en-US',
    options ?? {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone,
    }
  ).format(date);

type RelativeTimeContextType = {
  time: Date;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  timeFormatOptions?: Intl.DateTimeFormatOptions;
};

const RelativeTimeContext = createContext<RelativeTimeContextType>({
  time: new Date(),
  dateFormatOptions: {
    dateStyle: 'long',
  },
  timeFormatOptions: {
    hour: '2-digit',
    minute: '2-digit',
  },
});

export type RelativeTimeProps = HTMLAttributes<HTMLDivElement> & {
  time?: Date;
  defaultTime?: Date;
  onTimeChange?: (time: Date) => void;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  timeFormatOptions?: Intl.DateTimeFormatOptions;
};

export const RelativeTime = ({
  time: controlledTime,
  defaultTime = new Date(),
  onTimeChange,
  dateFormatOptions,
  timeFormatOptions,
  className,
  ...props
}: RelativeTimeProps) => {
  const [internalTime, setInternalTime] = useState<Date>(defaultTime);

  // Use controlled time if provided, otherwise use internal state
  const time = controlledTime ?? internalTime;

  useEffect(() => {
    if (controlledTime) {
      return;
    }
    const interval = setInterval(() => {
      const newTime = new Date();
      setInternalTime(newTime);
      onTimeChange?.(newTime);
    }, 1000);
    return () => clearInterval(interval);
  }, [controlledTime, onTimeChange]);

  return (
    <RelativeTimeContext.Provider
      value={{
        time,
        dateFormatOptions,
        timeFormatOptions,
      }}
    >
      <div className={cn('grid gap-2', className)} {...props} />
    </RelativeTimeContext.Provider>
  );
};

export type RelativeTimeZoneProps = HTMLAttributes<HTMLDivElement> & {
  zone: string;
  dateFormatOptions?: Intl.DateTimeFormatOptions;
  timeFormatOptions?: Intl.DateTimeFormatOptions;
};

export type RelativeTimeZoneContextType = {
  zone: string;
};

const RelativeTimeZoneContext = createContext<RelativeTimeZoneContextType>({
  zone: 'UTC',
});

export const RelativeTimeZone = ({
  zone,
  className,
  ...props
}: RelativeTimeZoneProps) => (
  <RelativeTimeZoneContext.Provider value={{ zone }}>
    <div
      className={cn(
        'flex items-center justify-between gap-1.5 text-xs',
        className
      )}
      {...props}
    />
  </RelativeTimeZoneContext.Provider>
);

export type RelativeTimeZoneDisplayProps = HTMLAttributes<HTMLDivElement>;

export const RelativeTimeZoneDisplay = ({
  className,
  ...props
}: RelativeTimeZoneDisplayProps) => {
  const { time, timeFormatOptions } = useContext(RelativeTimeContext);
  const { zone } = useContext(RelativeTimeZoneContext);
  const display = formatTime(time, zone, timeFormatOptions);

  return (
    <div
      className={cn('pl-8 text-muted-foreground tabular-nums', className)}
      {...props}
    >
      {display}
    </div>
  );
};

export type RelativeTimeZoneDateProps = HTMLAttributes<HTMLDivElement>;

export const RelativeTimeZoneDate = ({
  className,
  ...props
}: RelativeTimeZoneDateProps) => {
  const { time, dateFormatOptions } = useContext(RelativeTimeContext);
  const { zone } = useContext(RelativeTimeZoneContext);
  const display = formatDate(time, zone, dateFormatOptions);

  return <div {...props}>{display}</div>;
};

export type RelativeTimeZoneLabelProps = HTMLAttributes<HTMLDivElement>;

export const RelativeTimeZoneLabel = ({
  className,
  ...props
}: RelativeTimeZoneLabelProps) => (
  <div
    className={cn(
      'flex h-4 items-center justify-center rounded-xs bg-secondary px-1.5 font-mono',
      className
    )}
    {...props}
  />
);
