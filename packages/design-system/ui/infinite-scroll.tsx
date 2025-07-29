/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';

interface InfiniteScrollProps {
  isLoading: boolean;
  hasMore: boolean;
  next: () => unknown;
  threshold?: number;
  root?: Element | Document | null;
  rootMargin?: string;
  reverse?: boolean;
  children?: React.ReactNode;
}

/**
 * InfiniteScroll component that automatically loads more content when the user scrolls to the end
 * 
 * @param isLoading - Whether data is currently being loaded
 * @param hasMore - Whether there is more data to load
 * @param next - Function to call when more data should be loaded
 * @param threshold - Value between 0 and 1 indicating how much of the target element should be visible before triggering the next load
 * @param root - The element that is used as the viewport for checking visibility
 * @param rootMargin - Margin around the root element
 * @param reverse - Whether to observe the first child instead of the last (for reverse scrolling)
 * @param children - React elements to render, typically including a loading indicator
 */
export function InfiniteScroll({
  isLoading,
  hasMore,
  next,
  threshold = 1,
  root = null,
  rootMargin = '0px',
  reverse = false,
  children,
}: InfiniteScrollProps) {
  const observer = React.useRef<IntersectionObserver | null>(null);
  
  // This callback ref will be called when it is dispatched to an element or detached from an element,
  // or when the callback function changes.
  const observerRef = React.useCallback(
    (element: HTMLElement | null) => {
      let safeThreshold = threshold;
      if (threshold < 0 || threshold > 1) {
        console.warn(
          'threshold should be between 0 and 1. You are exceeding the range. Will use default value: 1',
        );
        safeThreshold = 1;
      }

      // When isLoading is true, this callback will do nothing.
      // It means that the next function will never be called.
      // It is safe because the intersection observer has disconnected the previous element.
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      if (!element) return;

      // Create a new IntersectionObserver instance because hasMore or next may be changed.
      observer.current = new IntersectionObserver(
        (entries) => {
          if (entries[0].isIntersecting && hasMore) {
            next();
          }
        },
        {
          root,
          rootMargin,
          threshold: safeThreshold,
        },
      );
      observer.current.observe(element);
    },
    [hasMore, isLoading, next, root, rootMargin, threshold],
  );

  const flattenChildren = React.useMemo(() => React.Children.toArray(children), [children]);

  return (
    <>
      {flattenChildren.map((child, index) => {
        if (!React.isValidElement(child)) {
          process.env.NODE_ENV === 'development' &&
            console.warn('You should use a valid element with InfiniteScroll');
          return child;
        }

        const isObserveTarget = reverse ? index === 0 : index === flattenChildren.length - 1;
        const ref = isObserveTarget ? observerRef : null;
        
        // @ts-ignore ignore ref type
        return React.cloneElement(child, { ref });
      })}
    </>
  );
}

export default InfiniteScroll;
