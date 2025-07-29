/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';

/**
 * Navigation utility that abstracts framework-specific navigation
 * This allows components to use navigation without direct Next.js dependencies
 */
export interface NavigationUtils {
  /**
   * Navigate to a specific URL
   */
  push: (url: string) => void;
  
  /**
   * Navigate back in history
   */
  back: () => void;
}

// Create a type for the window.history methods we use
type HistoryNavigation = Pick<History, 'back' | 'pushState'>;

/**
 * Hook that provides navigation utilities
 * Falls back to browser history API if Next.js router is not available
 */
export const useNavigation = (): NavigationUtils => {
  // Use a ref to avoid re-renders when checking for Next.js
  const navigationRef = React.useRef<NavigationUtils | null>(null);
  
  if (navigationRef.current === null) {
    // Try to dynamically use Next.js router if available
    try {
      // Using dynamic import would be ideal here, but for simplicity
      // we'll use a more basic approach that works in both browser and SSR
      const hasNextNavigation = typeof require !== 'undefined' && 
        require.resolve('next/navigation');
      
      if (hasNextNavigation) {
        // This will only execute if Next.js is available
        // We're using this pattern to avoid direct imports that cause TS errors
        const { useRouter } = require('next/navigation');
        const router = useRouter();
        
        navigationRef.current = {
          push: (url: string) => router.push(url),
          back: () => router.back()
        };
      }
    } catch (e) {
      // Next.js navigation not available, will fall through to default
    }
    
    // If Next.js router is not available, use browser history API
    if (!navigationRef.current) {
      navigationRef.current = {
        push: (url: string) => {
          if (typeof window !== 'undefined') {
            window.location.href = url;
          }
        },
        back: () => {
          if (typeof window !== 'undefined') {
            window.history.back();
          }
        }
      };
    }
  }
  
  return navigationRef.current;
};
