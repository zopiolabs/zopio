/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';
import { Copy, Check, Download, Terminal } from 'lucide-react';

// Snippet variants
const snippetVariants = cva(
  'relative overflow-hidden rounded-lg border bg-background',
  {
    variants: {
      variant: {
        default: 'border-border',
        ghost: 'border-transparent bg-transparent',
        outline: 'border-border shadow-sm',
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

const snippetTabsListVariants = cva(
  'inline-flex h-10 items-center justify-center rounded-t-lg bg-muted p-1 text-muted-foreground',
  {
    variants: {
      size: {
        sm: 'h-8 text-xs',
        md: 'h-10 text-sm',
        lg: 'h-12 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

const snippetTabsTriggerVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow-sm',
  {
    variants: {
      size: {
        sm: 'px-2 py-1 text-xs',
        md: 'px-3 py-1.5 text-sm',
        lg: 'px-4 py-2 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

// Types
interface SnippetTab {
  label: string;
  value: string;
  code: string;
  language?: string;
  filename?: string;
}

interface SnippetProps 
  extends Omit<React.ComponentPropsWithoutRef<typeof TabsPrimitive.Root>, 'onCopy'>,
    VariantProps<typeof snippetVariants> {
  tabs: SnippetTab[];
  showCopyButton?: boolean;
  showDownloadButton?: boolean;
  copyTimeout?: number;
  onCopy?: (code: string, tab: SnippetTab) => void;
  onDownload?: (code: string, tab: SnippetTab) => void;
}

interface SnippetContextType {
  copied: string | null;
  setCopied: React.Dispatch<React.SetStateAction<string | null>>;
  size: 'sm' | 'md' | 'lg' | null;
}

const SnippetContext = React.createContext<SnippetContextType | undefined>(undefined);

export const useSnippet = () => {
  const context = React.useContext(SnippetContext);
  if (context === undefined) {
    throw new Error('useSnippet must be used within a Snippet');
  }
  return context;
};

// Main Snippet component
const Snippet = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Root>,
  SnippetProps
>(({ 
  className, 
  variant, 
  size = 'md',
  tabs,
  showCopyButton = true,
  showDownloadButton = false,
  copyTimeout = 2000,
  onCopy,
  onDownload,
  children,
  ...props 
}, ref) => {
  const [copied, setCopied] = React.useState<string | null>(null);

  const copyToClipboard = async (code: string, tab: SnippetTab) => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(tab.value);
      onCopy?.(code, tab);
      setTimeout(() => setCopied(null), copyTimeout);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  const downloadCode = (code: string, tab: SnippetTab) => {
    const filename = tab.filename || `${tab.value}.${getFileExtension(tab.language || 'text')}`;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    onDownload?.(code, tab);
  };

  const getFileExtension = (language: string): string => {
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
      bash: 'sh',
      shell: 'sh',
    };
    return extensions[language] || 'txt';
  };

  const contextValue: SnippetContextType = {
    copied,
    setCopied,
    size,
  };

  if (tabs.length === 0) {
    return (
      <div className={cn(snippetVariants({ variant, size }), className)}>
        <div className="p-4 text-center text-muted-foreground">
          No code snippets available
        </div>
      </div>
    );
  }

  return (
    <SnippetContext.Provider value={contextValue}>
      <TabsPrimitive.Root
        ref={ref}
        className={cn(snippetVariants({ variant, size }), className)}
        defaultValue={tabs[0]?.value}
        {...props}
      >
        <div className="flex items-center justify-between border-b border-border">
          <SnippetTabsList size={size}>
            {tabs.map((tab) => (
              <SnippetTabsTrigger key={tab.value} value={tab.value} size={size}>
                {tab.label}
              </SnippetTabsTrigger>
            ))}
          </SnippetTabsList>
          
          <TabsPrimitive.Content value={tabs.find(tab => copied === tab.value)?.value || tabs[0]?.value} asChild>
            <div className="flex items-center gap-1 px-2">
              {showDownloadButton && (
                <button
                  onClick={() => {
                    const activeTab = tabs.find(tab => copied === tab.value) || tabs[0];
                    if (activeTab) downloadCode(activeTab.code, activeTab);
                  }}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                  title="Download"
                >
                  <Download className="h-4 w-4" />
                </button>
              )}
              
              {showCopyButton && (
                <button
                  onClick={() => {
                    const activeTab = tabs.find(tab => copied === tab.value) || tabs[0];
                    if (activeTab) copyToClipboard(activeTab.code, activeTab);
                  }}
                  className="p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
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
          </TabsPrimitive.Content>
        </div>

        {tabs.map((tab) => (
          <SnippetTabsContent key={tab.value} value={tab.value} tab={tab} />
        ))}

        {children}
      </TabsPrimitive.Root>
    </SnippetContext.Provider>
  );
});

Snippet.displayName = 'Snippet';

// Snippet Tabs List component
const SnippetTabsList = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.List> & 
  VariantProps<typeof snippetTabsListVariants>
>(({ className, size, ...props }, ref) => (
  <TabsPrimitive.List
    ref={ref}
    className={cn(snippetTabsListVariants({ size }), className)}
    {...props}
  />
));

SnippetTabsList.displayName = TabsPrimitive.List.displayName;

// Snippet Tabs Trigger component
const SnippetTabsTrigger = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof TabsPrimitive.Trigger> & 
  VariantProps<typeof snippetTabsTriggerVariants>
>(({ className, size, ...props }, ref) => (
  <TabsPrimitive.Trigger
    ref={ref}
    className={cn(snippetTabsTriggerVariants({ size }), className)}
    {...props}
  />
));

SnippetTabsTrigger.displayName = TabsPrimitive.Trigger.displayName;

// Snippet Tabs Content component
interface SnippetTabsContentProps 
  extends React.ComponentPropsWithoutRef<typeof TabsPrimitive.Content> {
  tab: SnippetTab;
}

const SnippetTabsContent = React.forwardRef<
  React.ElementRef<typeof TabsPrimitive.Content>,
  SnippetTabsContentProps
>(({ className, tab, ...props }, ref) => {
  const { size } = useSnippet();
  const actualSize = size || 'md';
  
  const processCode = () => {
    return tab.code.split('\n').map((line, index) => ({
      content: line || '\u00A0', // Non-breaking space for empty lines
      lineNumber: index + 1,
    }));
  };

  const processedLines = processCode();

  return (
    <TabsPrimitive.Content
      ref={ref}
      className={cn(
        'overflow-x-auto font-mono bg-muted/20',
        actualSize === 'sm' && 'text-xs',
        actualSize === 'md' && 'text-sm',
        actualSize === 'lg' && 'text-base',
        className
      )}
      {...props}
    >
      <div className="relative">
        {tab.filename && (
          <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/30">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">{tab.filename}</span>
            {tab.language && (
              <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
                {tab.language}
              </span>
            )}
          </div>
        )}
        
        <div className="p-0">
          {processedLines.map((line, index) => (
            <div
              key={index}
              className="flex hover:bg-muted/50 transition-colors"
            >
              <span className="select-none text-muted-foreground text-right pr-4 pl-4 py-2 min-w-[3rem] border-r border-border/50 bg-muted/20">
                {line.lineNumber}
              </span>
              <span className="flex-1 px-4 py-2 whitespace-pre">
                {line.content}
              </span>
            </div>
          ))}
        </div>
      </div>
    </TabsPrimitive.Content>
  );
});

SnippetTabsContent.displayName = TabsPrimitive.Content.displayName;

// Snippet Actions component
export interface SnippetActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const SnippetActions = React.forwardRef<HTMLDivElement, SnippetActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-1 px-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

SnippetActions.displayName = 'SnippetActions';

// Snippet Copy Button component
export interface SnippetCopyButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'onCopy'> {
  code: string;
  tab: SnippetTab;
  onCopy?: (code: string, tab: SnippetTab) => void;
}

const SnippetCopyButton = React.forwardRef<HTMLButtonElement, SnippetCopyButtonProps>(
  ({ className, code, tab, onCopy, ...props }, ref) => {
    const { copied, setCopied } = useSnippet();
    const isCopied = copied === tab.value;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(code);
        setCopied(tab.value);
        onCopy?.(code, tab);
        setTimeout(() => setCopied(null), 2000);
      } catch (err) {
        console.error('Failed to copy code:', err);
      }
    };

    return (
      <button
        ref={ref}
        onClick={handleCopy}
        className={cn(
          'p-1.5 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors',
          className
        )}
        title={isCopied ? 'Copied!' : 'Copy to clipboard'}
        {...props}
      >
        {isCopied ? (
          <Check className="h-4 w-4 text-green-500" />
        ) : (
          <Copy className="h-4 w-4" />
        )}
      </button>
    );
  }
);

SnippetCopyButton.displayName = 'SnippetCopyButton';

export {
  Snippet,
  SnippetTabsList,
  SnippetTabsTrigger,
  SnippetTabsContent,
  SnippetActions,
  SnippetCopyButton,
  snippetVariants,
  snippetTabsListVariants,
  snippetTabsTriggerVariants,
};
