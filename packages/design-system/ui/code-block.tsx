/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';
import { Copy, Check, Download, Maximize2 } from 'lucide-react';

// Code Block variants
const codeBlockVariants = cva(
  'relative overflow-hidden rounded-lg border bg-muted/50',
  {
    variants: {
      variant: {
        default: 'bg-muted/50 border-border',
        ghost: 'bg-transparent border-transparent',
        outline: 'bg-background border-border',
      },
      size: {
        sm: 'text-xs',
        md: 'text-sm',
        lg: 'text-base',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const codeContentVariants = cva(
  'overflow-x-auto font-mono',
  {
    variants: {
      size: {
        sm: 'text-xs leading-relaxed',
        md: 'text-sm leading-relaxed',
        lg: 'text-base leading-relaxed',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Types
interface CodeBlockProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof codeBlockVariants> {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  showCopyButton?: boolean;
  highlightLines?: number[];
  highlightWords?: string[];
  focusLines?: number[];
  diffLines?: { added: number[]; removed: number[] };
  theme?: 'light' | 'dark' | 'auto';
  maxHeight?: string;
  wrap?: boolean;
}

interface CodeBlockContextType {
  copied: boolean;
  setCopied: React.Dispatch<React.SetStateAction<boolean>>;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

const CodeBlockContext = React.createContext<CodeBlockContextType | undefined>(undefined);

export const useCodeBlock = () => {
  const context = React.useContext(CodeBlockContext);
  if (context === undefined) {
    throw new Error('useCodeBlock must be used within a CodeBlock');
  }
  return context;
};

// Main CodeBlock component
const CodeBlock = React.forwardRef<HTMLDivElement, CodeBlockProps>(
  ({ 
    className, 
    variant, 
    size, 
    code,
    language = 'javascript',
    filename,
    showLineNumbers = true,
    showCopyButton = true,
    highlightLines = [],
    highlightWords = [],
    focusLines = [],
    diffLines,
    theme = 'auto',
    maxHeight,
    wrap = false,
    children,
    ...props 
  }, ref) => {
    const [copied, setCopied] = React.useState(false);
    const [expanded, setExpanded] = React.useState(false);

    const copyToClipboard = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    };

    const downloadCode = () => {
      const blob = new Blob([code], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || `code.${getFileExtension(language)}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    };

    const getFileExtension = (lang: string) => {
      const extensions: Record<string, string> = {
        javascript: 'js',
        typescript: 'ts',
        jsx: 'jsx',
        tsx: 'tsx',
        python: 'py',
        java: 'java',
        cpp: 'cpp',
        css: 'css',
        html: 'html',
        json: 'json',
        yaml: 'yml',
        markdown: 'md',
      };
      return extensions[lang] || 'txt';
    };

    const processCode = () => {
      const lines = code.split('\n');
      
      return lines.map((line, index) => {
        const lineNumber = index + 1;
        let processedLine = line;
        
        // Process highlighted words
        highlightWords.forEach(word => {
          const regex = new RegExp(`(${word})`, 'g');
          processedLine = processedLine.replace(regex, '<mark class="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">$1</mark>');
        });

        // Determine line classes
        const lineClasses = [];
        
        if (highlightLines.includes(lineNumber)) {
          lineClasses.push('bg-yellow-100 dark:bg-yellow-900/30');
        }
        
        if (focusLines.includes(lineNumber)) {
          lineClasses.push('bg-blue-100 dark:bg-blue-900/30 ring-2 ring-blue-500/20');
        }
        
        if (diffLines?.added.includes(lineNumber)) {
          lineClasses.push('bg-green-100 dark:bg-green-900/30 before:content-["+"] before:text-green-600 before:mr-2');
        }
        
        if (diffLines?.removed.includes(lineNumber)) {
          lineClasses.push('bg-red-100 dark:bg-red-900/30 before:content-["-"] before:text-red-600 before:mr-2 line-through opacity-70');
        }

        return {
          content: processedLine,
          classes: lineClasses.join(' '),
          lineNumber,
        };
      });
    };

    const processedLines = processCode();

    const contextValue: CodeBlockContextType = {
      copied,
      setCopied,
      expanded,
      setExpanded,
    };

    return (
      <CodeBlockContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(codeBlockVariants({ variant, size }), className)}
          {...props}
        >
          {(filename || showCopyButton) && (
            <CodeBlockHeader
              filename={filename}
              language={language}
              showCopyButton={showCopyButton}
              onCopy={copyToClipboard}
              onDownload={downloadCode}
              onExpand={() => setExpanded(!expanded)}
            />
          )}
          
          <div 
            className={cn(
              codeContentVariants({ size }),
              maxHeight && !expanded && `max-h-[${maxHeight}] overflow-hidden`,
              wrap ? 'whitespace-pre-wrap' : 'whitespace-pre'
            )}
          >
            <div className="relative">
              {processedLines.map((line, index) => (
                <div
                  key={index}
                  className={cn(
                    'flex',
                    line.classes,
                    'hover:bg-muted/50 transition-colors'
                  )}
                >
                  {showLineNumbers && (
                    <span className="select-none text-muted-foreground text-right pr-4 pl-4 py-1 min-w-[3rem] border-r border-border/50">
                      {line.lineNumber}
                    </span>
                  )}
                  <span 
                    className="flex-1 px-4 py-1"
                    dangerouslySetInnerHTML={{ __html: line.content || '&nbsp;' }}
                  />
                </div>
              ))}
            </div>
          </div>

          {maxHeight && !expanded && (
            <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-muted/80 to-transparent flex items-end justify-center pb-2">
              <button
                onClick={() => setExpanded(true)}
                className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 bg-background/80 rounded border"
              >
                Show more
              </button>
            </div>
          )}

          {children}
        </div>
      </CodeBlockContext.Provider>
    );
  }
);

CodeBlock.displayName = 'CodeBlock';

// CodeBlock Header component
interface CodeBlockHeaderProps {
  filename?: string;
  language: string;
  showCopyButton: boolean;
  onCopy: () => void;
  onDownload: () => void;
  onExpand: () => void;
}

const CodeBlockHeader = React.forwardRef<HTMLDivElement, CodeBlockHeaderProps>(
  ({ filename, language, showCopyButton, onCopy, onDownload, onExpand }, ref) => {
    const { copied } = useCodeBlock();

    return (
      <div
        ref={ref}
        className="flex items-center justify-between px-4 py-2 border-b border-border/50 bg-muted/30"
      >
        <div className="flex items-center gap-2">
          {filename && (
            <span className="text-sm font-medium text-foreground">
              {filename}
            </span>
          )}
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded">
            {language}
          </span>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={onExpand}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            title="Expand"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={onDownload}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            title="Download"
          >
            <Download className="h-4 w-4" />
          </button>
          
          {showCopyButton && (
            <button
              onClick={onCopy}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
              title={copied ? 'Copied!' : 'Copy to clipboard'}
            >
              {copied ? (
                <Check className="h-4 w-4 text-green-500" />
              ) : (
                <Copy className="h-4 w-4" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

CodeBlockHeader.displayName = 'CodeBlockHeader';

// CodeBlock Content component
export interface CodeBlockContentProps extends React.HTMLAttributes<HTMLDivElement> {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

const CodeBlockContent = React.forwardRef<HTMLDivElement, CodeBlockContentProps>(
  ({ className, code, language = 'javascript', showLineNumbers = true, ...props }, ref) => {
    const lines = code.split('\n');

    return (
      <div
        ref={ref}
        className={cn('font-mono text-sm overflow-x-auto', className)}
        {...props}
      >
        {lines.map((line, index) => (
          <div key={index} className="flex hover:bg-muted/50 transition-colors">
            {showLineNumbers && (
              <span className="select-none text-muted-foreground text-right pr-4 pl-4 py-1 min-w-[3rem] border-r border-border/50">
                {index + 1}
              </span>
            )}
            <span className="flex-1 px-4 py-1 whitespace-pre">
              {line || '\u00A0'}
            </span>
          </div>
        ))}
      </div>
    );
  }
);

CodeBlockContent.displayName = 'CodeBlockContent';

// CodeBlock Actions component
export interface CodeBlockActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const CodeBlockActions = React.forwardRef<HTMLDivElement, CodeBlockActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

CodeBlockActions.displayName = 'CodeBlockActions';

export {
  CodeBlock,
  CodeBlockHeader,
  CodeBlockContent,
  CodeBlockActions,
  codeBlockVariants,
  codeContentVariants,
};
