/**
 * React Navigation Type Definitions
 */
declare module '@react-navigation/native' {
  import type { ComponentType, ReactNode } from 'react';
  
  export interface NavigationContainerProps {
    children: ReactNode;
    theme?: Record<string, unknown>;
    onReady?: () => void;
    linking?: Record<string, unknown>;
  }
  
  export const NavigationContainer: ComponentType<NavigationContainerProps>;
}
