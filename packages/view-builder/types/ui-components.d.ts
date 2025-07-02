/**
 * Copyright (c) 2025 Zopio Inc.
 * 
 * This file is part of Zopio.
 * 
 * Zopio is licensed under the Business Source License 1.1 (BSL).
 * You may use this source code for development and testing purposes.
 * Production use requires a commercial license from Zopio Inc.
 * 
 * See LICENSE file in the project root for full license details.
 * For commercial licensing, contact: legal@zopio.com
 */
/**
 * Type declarations for UI components used in the view-builder
 */
import type * as React from 'react';

declare global {
  namespace JSX {
    interface IntrinsicElements {
      // Add any custom elements here
    }
  }
}

// Define types for shadcn UI components
declare module '@repo/design-system/components/ui/tabs' {
  export interface TabsProps {
    value: string;
    onValueChange: (value: string) => void;
    className?: string;
    children: React.ReactNode;
  }

  export const Tabs: React.ForwardRefExoticComponent<
    TabsProps & React.RefAttributes<HTMLDivElement>
  >;

  export const TabsList: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;

  export const TabsTrigger: React.ForwardRefExoticComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      value: string;
    } & React.RefAttributes<HTMLButtonElement>
  >;

  export const TabsContent: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & {
      value: string;
    } & React.RefAttributes<HTMLDivElement>
  >;
}

declare module '@repo/design-system/components/ui/button' {
  export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?:
      | 'default'
      | 'destructive'
      | 'outline'
      | 'secondary'
      | 'ghost'
      | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    asChild?: boolean;
  }

  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
}
