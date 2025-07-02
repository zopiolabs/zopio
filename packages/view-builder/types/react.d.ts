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
declare module 'react' {
  export interface ReactElement<
    P = Record<string, unknown>,
    T extends string | JSXElementConstructor<Record<string, unknown>> =
      | string
      | JSXElementConstructor<Record<string, unknown>>,
  > {
    type: T;
    props: P;
    key: Key | null;
  }

  export type Key = string | number;

  export type JSXElementConstructor<P> =
    | ((
        props: P
      ) => ReactElement<
        Record<string, unknown>,
        string | JSXElementConstructor<Record<string, unknown>>
      > | null)
    | (new (
        props: P
      ) => Component<P, Record<string, unknown>>);

  export interface RefObject<T> {
    readonly current: T | null;
  }

  export type Ref<T> = RefCallback<T> | RefObject<T> | null;
  export type RefCallback<T> = (instance: T | null) => void;

  export type ComponentType<P = Record<string, unknown>> =
    | ComponentClass<P>
    | FunctionComponent<P>;

  export interface FunctionComponent<P = Record<string, unknown>> {
    (
      props: P,
      context?: unknown
    ): ReactElement<
      Record<string, unknown>,
      string | JSXElementConstructor<Record<string, unknown>>
    > | null;
    displayName?: string;
  }

  export interface ForwardRefExoticComponent<P>
    extends NamedExoticComponent<P> {
    defaultProps?: Partial<P>;
  }

  export interface NamedExoticComponent<P = Record<string, unknown>>
    extends ExoticComponent<P> {
    displayName?: string;
  }

  export type ExoticComponent<P = Record<string, unknown>> = (
    props: P
  ) => ReactElement | null;

  export interface RefAttributes<T> extends Attributes {
    ref?: Ref<T>;
  }

  export interface Attributes {
    key?: Key;
  }

  export class Component<P, S> {
    constructor(props: P, context?: unknown);
    props: Readonly<P>;
    state: Readonly<S>;
    setState<K extends keyof S>(
      state:
        | ((
            prevState: Readonly<S>,
            props: Readonly<P>
          ) => Pick<S, K> | S | null)
        | (Pick<S, K> | S | null),
      callback?: () => void
    ): void;
    forceUpdate(callback?: () => void): void;
    render(): ReactNode;
  }

  export interface ComponentClass<
    P = Record<string, unknown>,
    S = Record<string, unknown>,
  > extends StaticLifecycle<P, S> {
    new (props: P, context?: unknown): Component<P, S>;
    displayName?: string;
    defaultProps?: Partial<P>;
  }

  export interface StaticLifecycle<_P, _S> {
    // Static lifecycle methods would go here
  }

  export type ReactNode =
    | ReactElement
    | string
    | number
    | Iterable<ReactNode>
    | ReactPortal
    | boolean
    | null
    | undefined;

  export interface ReactPortal extends ReactElement {
    key: Key | null;
    children: ReactNode;
  }

  export type FC<P = Record<string, unknown>> = FunctionComponent<P>;

  export interface ChangeEvent<T = Element> extends SyntheticEvent<T> {
    target: EventTarget & T;
  }

  export interface SyntheticEvent<T = Element, E = Event> {
    currentTarget: EventTarget & T;
    target: EventTarget & T;
    preventDefault(): void;
    stopPropagation(): void;
    nativeEvent: E;
    bubbles: boolean;
    cancelable: boolean;
    defaultPrevented: boolean;
    eventPhase: number;
    isTrusted: boolean;
    timeStamp: number;
    type: string;
  }

  export interface EventTarget {}

  export interface HTMLAttributes<T> extends AriaAttributes, DOMAttributes<T> {
    // Standard HTML Attributes
    className?: string;
    id?: string;
    role?: string;
    style?: CSSProperties;
    tabIndex?: number;
    // Plus many more...
  }

  export interface AriaAttributes {}
  export interface DOMAttributes<_T> {}
  export interface CSSProperties {}

  export interface InputHTMLAttributes<T> extends HTMLAttributes<T> {
    accept?: string;
    alt?: string;
    autoComplete?: string;
    checked?: boolean;
    disabled?: boolean;
    form?: string;
    max?: number | string;
    maxLength?: number;
    min?: number | string;
    minLength?: number;
    multiple?: boolean;
    name?: string;
    onChange?: ChangeEventHandler<T>;
    pattern?: string;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    size?: number;
    src?: string;
    step?: number | string;
    type?: string;
    value?: string | number | readonly string[];
  }

  export interface TextareaHTMLAttributes<T> extends HTMLAttributes<T> {
    autoComplete?: string;
    cols?: number;
    disabled?: boolean;
    form?: string;
    maxLength?: number;
    minLength?: number;
    name?: string;
    onChange?: ChangeEventHandler<T>;
    placeholder?: string;
    readOnly?: boolean;
    required?: boolean;
    rows?: number;
    value?: string | number | readonly string[];
    wrap?: string;
  }

  export interface ButtonHTMLAttributes<T> extends HTMLAttributes<T> {
    autoFocus?: boolean;
    disabled?: boolean;
    form?: string;
    formAction?: string;
    formEncType?: string;
    formMethod?: string;
    formNoValidate?: boolean;
    formTarget?: string;
    name?: string;
    type?: 'submit' | 'reset' | 'button';
    value?: string | number | readonly string[];
  }

  export interface LabelHTMLAttributes<T> extends HTMLAttributes<T> {
    form?: string;
    htmlFor?: string;
  }

  export type ChangeEventHandler<T = Element> = (event: ChangeEvent<T>) => void;

  export function useState<S>(
    initialState: S | (() => S)
  ): [S, Dispatch<SetStateAction<S>>];
  export function useState<S = undefined>(): [
    S | undefined,
    Dispatch<SetStateAction<S | undefined>>,
  ];

  export type Dispatch<A> = (value: A) => void;
  export type SetStateAction<S> = S | ((prevState: S) => S);

  export function useEffect(
    effect: EffectCallback,
    deps?: DependencyList
  ): void;
  export function useCallback<T extends (...args: unknown[]) => unknown>(
    callback: T,
    deps: DependencyList
  ): T;

  export type EffectCallback = () => (() => void) | undefined;
  export type DependencyList = ReadonlyArray<unknown>;

  export const Fragment: ExoticComponent<{ children?: ReactNode }>;

  // Add missing React hooks and functions
  export function createElement<P>(
    type: string | ComponentType<P>,
    props?: P | null,
    ...children: ReactNode[]
  ): ReactElement<P>;
  export function createContext<T>(defaultValue: T): Context<T>;
  export function useContext<T>(context: Context<T>): T;

  export interface Context<T> {
    Provider: Provider<T>;
    Consumer: Consumer<T>;
    displayName?: string;
  }

  export type Provider<T> = (props: ProviderProps<T>) => ReactElement | null;

  export type Consumer<T> = (props: ConsumerProps<T>) => ReactElement | null;

  export interface ProviderProps<T> {
    value: T;
    children?: ReactNode;
  }

  export interface ConsumerProps<T> {
    children: (value: T) => ReactNode;
  }
}
