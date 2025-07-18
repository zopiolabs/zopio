/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import { useControllableState } from '@radix-ui/react-use-controllable-state';
import { CheckIcon, CopyIcon } from 'lucide-react';
import type { ComponentProps, HTMLAttributes, ReactElement, ReactNode } from 'react';
import { cloneElement, createContext, useContext, useEffect, useState } from 'react';
import { type BundledLanguage, type CodeOptionsMultipleThemes, codeToHtml } from 'shiki';
import {
  transformerNotationDiff,
  transformerNotationFocus,
  transformerNotationHighlight,
  transformerNotationWordHighlight,
} from '@shikijs/transformers';
import { Button } from '@repo/design-system/ui/button';
import { cn } from '@repo/design-system/lib/utils';

export type { BundledLanguage } from 'shiki';

// Styling classes for the code block
const codeBlockClassName = cn(
  'relative mt-0 bg-background text-sm',
  '[&_pre]:py-4',
  '[&_.shiki]:!bg-[var(--shiki-bg)]',
  '[&_code]:w-full',
  '[&_code]:grid',
  '[&_code]:overflow-x-auto',
  '[&_code]:bg-transparent',
  '[&_.line]:px-4',
  '[&_.line]:w-full',
  '[&_.line]:relative'
);

// Line number styling
const lineNumberClassNames = cn(
  '[&_code]:[counter-reset:line]',
  '[&_code]:[counter-increment:line_0]',
  '[&_.line]:before:content-[counter(line)]',
  '[&_.line]:before:inline-block',
  '[&_.line]:before:[counter-increment:line]',
  '[&_.line]:before:w-[2ch]',
  '[&_.line]:before:mr-4',
  '[&_.line]:before:text-right',
  '[&_.line]:before:text-muted-foreground'
);

// Line highlight styling
const lineHighlightClassNames = cn(
  '[&_.line.highlighted]:bg-muted',
  '[&_.line.highlighted]:after:absolute',
  '[&_.line.highlighted]:after:left-0',
  '[&_.line.highlighted]:after:top-0',
  '[&_.line.highlighted]:after:bottom-0',
  '[&_.line.highlighted]:after:w-0.5',
  'dark:[&_.line.highlighted]:!bg-blue-500/10'
);

// Word highlight styling
const wordHighlightClassNames = cn(
  '[&_.word-highlight]:bg-yellow-300/30',
  '[&_.word-highlight]:rounded',
  '[&_.word-highlight]:p-0.5',
  '[&_.word-highlight]:border-b-2',
  '[&_.word-highlight]:border-yellow-400',
  'dark:[&_.word-highlight]:bg-yellow-300/20',
  'dark:[&_.word-highlight]:border-yellow-300/40'
);

// Focus styling
const lineFocusedClassNames = cn(
  '[&_.line.focused]:bg-muted',
  '[&_.line:not(.focused)]:opacity-50',
  '[&_.line.focused]:after:absolute',
  '[&_.line.focused]:after:left-0',
  '[&_.line.focused]:after:top-0',
  '[&_.line.focused]:after:bottom-0',
  '[&_.line.focused]:after:w-0.5',
  '[&_.line.focused]:after:bg-blue-500'
);

// Dark mode styling
const darkModeClassNames = cn(
  'dark:[&_.shiki]:!bg-[var(--shiki-dark-bg)]'
);

// Highlight function to transform code into HTML with syntax highlighting
async function highlight(
  html: string,
  language?: BundledLanguage,
  themes?: CodeOptionsMultipleThemes['themes']
) {
  try {
    return await codeToHtml(html, {
      lang: language || 'plaintext',
      themes: themes || {
        light: 'github-light',
        dark: 'github-dark-default',
      },
      transformers: [
        transformerNotationHighlight(),
        transformerNotationFocus(),
        transformerNotationWordHighlight(),
        transformerNotationDiff(),
      ],
    });
  } catch (error) {
    console.error('Error highlighting code:', error);
    return html;
  }
}

// Data structure for code blocks
export interface CodeBlockData {
  language: string;
  filename?: string;
  code: string;
}

// Context type for code block
interface CodeBlockContextType {
  value: string | undefined;
  onValueChange: ((value: string) => void) | undefined;
  data: CodeBlockData[];
}

// Create context for code block
const CodeBlockContext = createContext<CodeBlockContextType>({
  value: undefined,
  onValueChange: undefined,
  data: [],
});

// Props for the main CodeBlock component
export interface CodeBlockProps extends HTMLAttributes<HTMLDivElement> {
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  data: CodeBlockData[];
}

// Main CodeBlock component
export function CodeBlock({
  value: controlledValue,
  onValueChange: controlledOnValueChange,
  defaultValue,
  className,
  data,
  ...props
}: CodeBlockProps) {
  const [value, onValueChange] = useControllableState({
    prop: controlledValue,
    defaultProp: defaultValue || data[0]?.language,
    onChange: controlledOnValueChange,
  });

  return (
    <CodeBlockContext.Provider value={{ value, onValueChange, data }}>
      <div className={cn('rounded-lg border bg-background', className)} {...props} />
    </CodeBlockContext.Provider>
  );
}

// Props for the CodeBlockHeader component
export interface CodeBlockHeaderProps extends HTMLAttributes<HTMLDivElement> {}

// Header component for the code block
export function CodeBlockHeader({
  className,
  ...props
}: CodeBlockHeaderProps) {
  return (
    <div
      className={cn(
        'flex items-center justify-between border-b bg-muted/50 px-4 py-2',
        className
      )}
      {...props}
    />
  );
}

// Props for the CodeBlockTitle component
export interface CodeBlockTitleProps extends HTMLAttributes<HTMLDivElement> {
  title?: string;
}

// Title component for the code block
export function CodeBlockTitle({
  className,
  title,
  children,
  ...props
}: CodeBlockTitleProps) {
  return (
    <div
      className={cn('flex items-center gap-2 text-sm font-medium', className)}
      {...props}
    >
      {title || children}
    </div>
  );
}

// Props for the CodeBlockCopyButton component
export interface CodeBlockCopyButtonProps extends ComponentProps<typeof Button> {
  onCopy?: () => void;
  onCopyError?: (error: Error) => void;
  timeout?: number;
}

// Copy button component for the code block
export function CodeBlockCopyButton({
  asChild,
  onCopy,
  onCopyError,
  timeout = 2000,
  children,
  className,
  ...props
}: CodeBlockCopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);
  const { data, value } = useContext(CodeBlockContext);
  const code = data.find((item) => item.language === value)?.code;

  const copyToClipboard = () => {
    if (
      typeof window === 'undefined' ||
      !navigator.clipboard.writeText ||
      !code
    ) {
      return;
    }

    navigator.clipboard.writeText(code).then(() => {
      setIsCopied(true);
      onCopy?.();
      setTimeout(() => setIsCopied(false), timeout);
    }, onCopyError);
  };

  if (asChild) {
    return cloneElement(children as ReactElement, {
      // @ts-expect-error - we know this is a button
      onClick: copyToClipboard,
    });
  }

  const Icon = isCopied ? CheckIcon : CopyIcon;
  return (
    <Button
      className={cn('shrink-0', className)}
      onClick={copyToClipboard}
      size="icon"
      variant="ghost"
      {...props}
    >
      {children ?? <Icon className="text-muted-foreground" size={14} />}
    </Button>
  );
}

// Props for the CodeBlockFallback component
interface CodeBlockFallbackProps extends HTMLAttributes<HTMLDivElement> {}

// Fallback component when syntax highlighting fails
function CodeBlockFallback({ children, ...props }: CodeBlockFallbackProps) {
  return (
    <div {...props}>
      <pre className="w-full">
        <code>
          {children
            ?.toString()
            .split('\n')
            .map((line, i) => (
              <span className="line" key={i}>
                {line}
              </span>
            ))}
        </code>
      </pre>
    </div>
  );
}

// Props for the CodeBlockBody component
export interface CodeBlockBodyProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  children: (item: CodeBlockData) => ReactNode;
}

// Body component for the code block
export function CodeBlockBody({ children, ...props }: CodeBlockBodyProps) {
  const { data } = useContext(CodeBlockContext);
  return <div {...props}>{data.map(children)}</div>;
}

// Props for the CodeBlockItem component
export interface CodeBlockItemProps extends HTMLAttributes<HTMLDivElement> {
  value: string;
  lineNumbers?: boolean;
}

// Item component for the code block
export function CodeBlockItem({
  children,
  lineNumbers = true,
  className,
  value,
  ...props
}: CodeBlockItemProps) {
  const { value: activeValue } = useContext(CodeBlockContext);
  if (value !== activeValue) {
    return null;
  }

  return (
    <div
      className={cn(
        codeBlockClassName,
        lineHighlightClassNames,
        lineFocusedClassNames,
        wordHighlightClassNames,
        darkModeClassNames,
        lineNumbers && lineNumberClassNames,
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

// Props for the CodeBlockContent component
export interface CodeBlockContentProps extends HTMLAttributes<HTMLDivElement> {
  themes?: CodeOptionsMultipleThemes['themes'];
  language?: BundledLanguage;
  syntaxHighlighting?: boolean;
  children: string;
}

// Content component for the code block
export function CodeBlockContent({
  children,
  themes,
  language,
  syntaxHighlighting = true,
  ...props
}: CodeBlockContentProps) {
  const [html, setHtml] = useState<string | null>(null);

  useEffect(() => {
    if (!syntaxHighlighting) {
      return;
    }

    highlight(children as string, language, themes)
      .then(setHtml)
      .catch(console.error);
  }, [children, themes, syntaxHighlighting, language]);

  if (!(syntaxHighlighting && html)) {
    return <CodeBlockFallback>{children}</CodeBlockFallback>;
  }

  return (
    <div
      dangerouslySetInnerHTML={{ __html: html }}
      {...props}
    />
  );
}
