// This file contains type declarations for modules that don't have their own type definitions

// Import React types to use in declarations
import type { ReactElement } from 'react';

// Add React JSX support using module augmentation
declare global {
  interface JSX {
    Element: ReactElement;
    IntrinsicElements: {
      [elemName: string]: Record<string, unknown>;
    };
  }
}

declare module '*.svg' {
  import type { ComponentType, SVGAttributes } from 'react';
  const content: ComponentType<SVGAttributes<SVGElement>>;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

// React Native
declare module 'react-native' {
  import type { ReactNode, FC } from 'react';
  
  export type StyleProp<T> = T | T[] | null | undefined;
  
  export interface ViewProps {
    style?: StyleProp<ViewStyle>;
    children?: ReactNode;
    [key: string]: unknown;
  }
  
  export interface TextProps {
    style?: StyleProp<TextStyle>;
    children?: ReactNode;
    [key: string]: unknown;
  }
  
  export interface TextInputProps {
    style?: StyleProp<TextStyle>;
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    secureTextEntry?: boolean;
    [key: string]: unknown;
  }
  
  export interface TouchableOpacityProps {
    style?: StyleProp<ViewStyle>;
    onPress?: () => void;
    children?: ReactNode;
    [key: string]: unknown;
  }
  
  export interface ScrollViewProps {
    style?: StyleProp<ViewStyle>;
    contentContainerStyle?: StyleProp<ViewStyle>;
    children?: ReactNode;
    [key: string]: unknown;
  }
  
  export interface KeyboardAvoidingViewProps {
    style?: StyleProp<ViewStyle>;
    behavior?: 'height' | 'position' | 'padding';
    children?: ReactNode;
    [key: string]: unknown;
  }
  
  export interface ActivityIndicatorProps {
    size?: 'small' | 'large' | number;
    color?: string;
    [key: string]: unknown;
  }
  
  export interface ViewStyle {
    [key: string]: string | number | undefined;
  }
  
  export interface TextStyle extends ViewStyle {
    fontSize?: number;
    fontWeight?: string;
    color?: string;
  }
  
  export const View: FC<ViewProps>;
  export const Text: FC<TextProps>;
  export const TextInput: FC<TextInputProps>;
  export const TouchableOpacity: FC<TouchableOpacityProps>;
  export const ScrollView: FC<ScrollViewProps>;
  export const KeyboardAvoidingView: FC<KeyboardAvoidingViewProps>;
  export const ActivityIndicator: FC<ActivityIndicatorProps>;
  export const StyleSheet: {
    create: <T extends Record<string, StyleProp<ViewStyle | TextStyle>>>(styles: T) => T;
  };
  export const Platform: {
    OS: 'ios' | 'android' | 'web';
    select: <T extends Record<string, unknown>>(obj: T) => unknown;
  };
}

// React Native Safe Area Context
declare module 'react-native-safe-area-context' {
  import type { FC, ReactNode } from 'react';
  import type { ViewProps } from 'react-native';
  
  export const SafeAreaView: FC<ViewProps>;
  export const SafeAreaProvider: FC<{ children?: ReactNode }>;
  export function useSafeAreaInsets(): { top: number; right: number; bottom: number; left: number };
}

// React Navigation Native Stack
declare module '@react-navigation/native-stack' {
  import type { ComponentType } from 'react';
  
  export interface RootStackParamList {
    Home: undefined;
    Login: undefined;
    Signup: undefined;
    [key: string]: undefined | Record<string, unknown>;
  }
  
  export interface NativeStackNavigationProp<T> {
    navigate: (name: keyof T, params?: Record<string, unknown>) => void;
    goBack: () => void;
  }
  
  export interface NativeStackNavigatorProps {
    initialRouteName?: string;
    screenOptions?: Record<string, unknown>;
  }
  
  export interface ScreenProps {
    name: string;
    component: ComponentType<unknown>;
    options?: Record<string, unknown>;
  }
  
  export function createNativeStackNavigator(): {
    Navigator: ComponentType<NativeStackNavigatorProps>;
    Screen: ComponentType<ScreenProps>;
  };
}

// React Navigation Native
declare module '@react-navigation/native' {
  export interface ParamListBase {
    [key: string]: Record<string, unknown> | undefined;
  }
}
