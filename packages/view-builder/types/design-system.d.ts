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
  }

  export const Button: React.ForwardRefExoticComponent<
    ButtonProps & React.RefAttributes<HTMLButtonElement>
  >;
}

declare module '@repo/design-system/components/ui/input' {
  export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {}

  export const Input: React.ForwardRefExoticComponent<
    InputProps & React.RefAttributes<HTMLInputElement>
  >;
}

declare module '@repo/design-system/components/ui/textarea' {
  export interface TextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

  export const Textarea: React.ForwardRefExoticComponent<
    TextareaProps & React.RefAttributes<HTMLTextAreaElement>
  >;
}

declare module '@repo/design-system/components/ui/checkbox' {
  export interface CheckboxProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }

  export const Checkbox: React.ForwardRefExoticComponent<
    CheckboxProps & React.RefAttributes<HTMLButtonElement>
  >;
}

declare module '@repo/design-system/components/ui/label' {
  export interface LabelProps
    extends React.LabelHTMLAttributes<HTMLLabelElement> {}

  export const Label: React.ForwardRefExoticComponent<
    LabelProps & React.RefAttributes<HTMLLabelElement>
  >;
}

declare module '@repo/design-system/components/ui/card' {
  export const Card: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  export const CardHeader: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  export const CardTitle: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLHeadingElement> &
      React.RefAttributes<HTMLHeadingElement>
  >;
  export const CardDescription: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLParagraphElement> &
      React.RefAttributes<HTMLParagraphElement>
  >;
  export const CardContent: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  export const CardFooter: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
}

declare module '@repo/design-system/components/ui/tabs' {
  export interface TabsProps extends React.HTMLAttributes<HTMLDivElement> {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
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

declare module '@repo/design-system/components/ui/select' {
  export interface SelectProps {
    value?: string;
    defaultValue?: string;
    onValueChange?: (value: string) => void;
  }

  export const Select: React.FC<SelectProps>;
  export const SelectTrigger: React.ForwardRefExoticComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement> &
      React.RefAttributes<HTMLButtonElement>
  >;
  export const SelectValue: React.FC<React.HTMLAttributes<HTMLSpanElement>>;
  export const SelectContent: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & React.RefAttributes<HTMLDivElement>
  >;
  export const SelectItem: React.ForwardRefExoticComponent<
    React.HTMLAttributes<HTMLDivElement> & {
      value: string;
    } & React.RefAttributes<HTMLDivElement>
  >;
}

declare module '@repo/design-system/components/ui/calendar' {
  export interface CalendarProps {
    mode?: 'single' | 'multiple' | 'range';
    selected?: Date | Date[] | { from: Date; to: Date };
    onSelect?: (
      date: Date | Date[] | { from: Date; to: Date } | undefined
    ) => void;
    disabled?: boolean | ((date: Date) => boolean);
    initialFocus?: boolean;
  }

  export const Calendar: React.FC<CalendarProps>;
}

declare module '@repo/design-system/components/ui/slider' {
  export interface SliderProps {
    defaultValue?: number[];
    value?: number[];
    min?: number;
    max?: number;
    step?: number;
    onValueChange?: (value: number[]) => void;
  }

  export const Slider: React.ForwardRefExoticComponent<
    SliderProps & React.RefAttributes<HTMLDivElement>
  >;
}

declare module '@repo/design-system/components/ui/radio-group' {
  export interface RadioGroupProps {
    defaultValue?: string;
    value?: string;
    onValueChange?: (value: string) => void;
  }

  export const RadioGroup: React.ForwardRefExoticComponent<
    RadioGroupProps &
      React.HTMLAttributes<HTMLDivElement> &
      React.RefAttributes<HTMLDivElement>
  >;
  export const RadioGroupItem: React.ForwardRefExoticComponent<
    React.ButtonHTMLAttributes<HTMLButtonElement> & {
      value: string;
    } & React.RefAttributes<HTMLButtonElement>
  >;
}

declare module '@repo/design-system/components/ui/switch' {
  export interface SwitchProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
  }

  export const Switch: React.ForwardRefExoticComponent<
    SwitchProps & React.RefAttributes<HTMLButtonElement>
  >;
}
