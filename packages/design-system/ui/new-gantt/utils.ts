/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import {
  addDays,
  addMonths,
  differenceInDays,
  differenceInHours,
  differenceInMonths,
  endOfDay,
  endOfMonth,
  getDaysInMonth,
  isSameDay,
  startOfDay,
  startOfMonth,
} from 'date-fns';

import { GanttContextProps, Range, TimelineData } from './types';

/**
 * Gets the appropriate function to calculate days in a range based on the range type
 */
export const getsDaysIn = (range: Range) => {
  // For when range is daily
  let fn = (_date: Date) => 1;
  if (range === 'monthly' || range === 'quarterly') {
    fn = getDaysInMonth;
  }
  return fn;
};

/**
 * Gets the appropriate difference function based on the range type
 */
export const getDifferenceIn = (range: Range) => {
  let fn = differenceInDays;
  if (range === 'monthly' || range === 'quarterly') {
    fn = differenceInMonths;
  }
  return fn;
};

/**
 * Gets the appropriate inner difference function based on the range type
 */
export const getInnerDifferenceIn = (range: Range) => {
  let fn = differenceInHours;
  if (range === 'monthly' || range === 'quarterly') {
    fn = differenceInDays;
  }
  return fn;
};

/**
 * Gets the appropriate start-of function based on the range type
 */
export const getStartOf = (range: Range) => {
  let fn = startOfDay;
  if (range === 'monthly' || range === 'quarterly') {
    fn = startOfMonth;
  }
  return fn;
};

/**
 * Gets the appropriate end-of function based on the range type
 */
export const getEndOf = (range: Range) => {
  let fn = endOfDay;
  if (range === 'monthly' || range === 'quarterly') {
    fn = endOfMonth;
  }
  return fn;
};

/**
 * Gets the appropriate add function based on the range type
 */
export const getAddRange = (range: Range) => {
  let fn = addDays;
  if (range === 'monthly' || range === 'quarterly') {
    fn = addMonths;
  }
  return fn;
};

/**
 * Calculates a date based on mouse position in the timeline
 */
export const getDateByMousePosition = (context: GanttContextProps, mouseX: number) => {
  const timelineStartDate = new Date(context.timelineData[0].year, 0, 1);
  const columnWidth = (context.columnWidth * context.zoom) / 100;
  const offset = Math.floor(mouseX / columnWidth);
  const daysIn = getsDaysIn(context.range);
  const addRange = getAddRange(context.range);
  const month = addRange(timelineStartDate, offset);
  const daysInMonth = daysIn(month);
  const pixelsPerDay = Math.round(columnWidth / daysInMonth);
  const dayOffset = Math.floor((mouseX % columnWidth) / pixelsPerDay);
  const actualDate = addDays(month, dayOffset);
  return actualDate;
};

/**
 * Creates initial timeline data structure for the Gantt chart
 */
export const createInitialTimelineData = (today: Date) => {
  const data: TimelineData = [];
  data.push(
    { year: today.getFullYear() - 1, quarters: new Array(4).fill(null) },
    { year: today.getFullYear(), quarters: new Array(4).fill(null) },
    { year: today.getFullYear() + 1, quarters: new Array(4).fill(null) }
  );
  for (const yearObj of data) {
    yearObj.quarters = new Array(4).fill(null).map((_, quarterIndex) => ({
      months: new Array(3).fill(null).map((_, monthIndex) => {
        const month = quarterIndex * 3 + monthIndex;
        return {
          days: getDaysInMonth(new Date(yearObj.year, month, 1)),
        };
      }),
    }));
  }
  return data;
};

/**
 * Calculates the horizontal offset for a date in the timeline
 */
export const getOffset = (
  date: Date,
  timelineStartDate: Date,
  context: GanttContextProps
) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  const differenceIn = getDifferenceIn(context.range);
  const startOf = getStartOf(context.range);
  const fullColumns = differenceIn(startOf(date), timelineStartDate);
  if (context.range === 'daily') {
    return parsedColumnWidth * fullColumns;
  }
  const partialColumns = date.getDate();
  const daysInMonth = getDaysInMonth(date);
  const pixelsPerDay = parsedColumnWidth / daysInMonth;
  return fullColumns * parsedColumnWidth + partialColumns * pixelsPerDay;
};

/**
 * Calculates the width of a feature item based on its start and end dates
 */
export const getWidth = (
  startAt: Date,
  endAt: Date | null,
  context: GanttContextProps
) => {
  const parsedColumnWidth = (context.columnWidth * context.zoom) / 100;
  if (!endAt) {
    return parsedColumnWidth * 2;
  }
  const differenceIn = getDifferenceIn(context.range);
  if (context.range === 'daily') {
    const delta = differenceIn(endAt, startAt);
    return parsedColumnWidth * (delta ? delta : 1);
  }
  const daysInStartMonth = getDaysInMonth(startAt);
  const pixelsPerDayInStartMonth = parsedColumnWidth / daysInStartMonth;
  if (isSameDay(startAt, endAt)) {
    return pixelsPerDayInStartMonth;
  }
  const innerDifferenceIn = getInnerDifferenceIn(context.range);
  const startOf = getStartOf(context.range);
  if (isSameDay(startOf(startAt), startOf(endAt))) {
    return innerDifferenceIn(endAt, startAt) * pixelsPerDayInStartMonth;
  }
  const startRangeOffset = daysInStartMonth - startAt.getDate();
  const endRangeOffset = endAt.getDate();
  const fullRangeOffset = differenceIn(startOf(endAt), startOf(startAt));
  const daysInEndMonth = getDaysInMonth(endAt);
  const pixelsPerDayInEndMonth = parsedColumnWidth / daysInEndMonth;
  return (
    (fullRangeOffset - 1) * parsedColumnWidth +
    startRangeOffset * pixelsPerDayInStartMonth +
    endRangeOffset * pixelsPerDayInEndMonth
  );
};

/**
 * Calculates the inner offset within a column for a specific date
 */
export const calculateInnerOffset = (
  date: Date,
  range: Range,
  columnWidth: number
) => {
  const startOf = getStartOf(range);
  const endOf = getEndOf(range);
  const differenceIn = getInnerDifferenceIn(range);
  const startOfRange = startOf(date);
  const endOfRange = endOf(date);
  const totalRangeDays = differenceIn(endOfRange, startOfRange);
  const dayOfMonth = date.getDate();
  return (dayOfMonth / totalRangeDays) * columnWidth;
};
