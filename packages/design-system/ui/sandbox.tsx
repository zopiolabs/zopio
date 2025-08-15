/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';
import { 
  Play, 
  Square, 
  RotateCcw, 
  Download, 
  Upload, 
  Settings,
  FileText,
  Folder,
  FolderOpen,
  Plus,
  X,
  Maximize2,
  Minimize2,
  Terminal,
  Eye,
  Code2,
  AlertCircle,
  CheckCircle2
} from 'lucide-react';

// Sandbox variants
const sandboxVariants = cva(
  'relative flex flex-col overflow-hidden rounded-lg border bg-background',
  {
    variants: {
      variant: {
        default: 'border-border',
        ghost: 'border-transparent',
        outline: 'border-border shadow-sm',
      },
      size: {
        sm: 'h-96',
        md: 'h-[32rem]',
        lg: 'h-[40rem]',
        xl: 'h-[48rem]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Types
interface SandboxFile {
  name: string;
  content: string;
  language: string;
  readOnly?: boolean;
}

interface SandboxFiles {
  [path: string]: SandboxFile;
}

interface SandboxProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof sandboxVariants> {
  files: SandboxFiles;
  template?: 'vanilla' | 'react' | 'vue' | 'angular' | 'svelte';
  showFileExplorer?: boolean;
  showConsole?: boolean;
  showPreview?: boolean;
  activeFile?: string;
  onFileChange?: (path: string, content: string) => void;
  onFileCreate?: (path: string, file: SandboxFile) => void;
  onFileDelete?: (path: string) => void;
  onActiveFileChange?: (path: string) => void;
  autoRun?: boolean;
  readOnly?: boolean;
}

interface SandboxContextType {
  files: SandboxFiles;
  activeFile: string;
  setActiveFile: (path: string) => void;
  activeTab: 'code' | 'preview' | 'console';
  setActiveTab: (tab: 'code' | 'preview' | 'console') => void;
  isRunning: boolean;
  setIsRunning: React.Dispatch<React.SetStateAction<boolean>>;
  consoleOutput: ConsoleMessage[];
  setConsoleOutput: React.Dispatch<React.SetStateAction<ConsoleMessage[]>>;
  previewContent: string;
  setPreviewContent: React.Dispatch<React.SetStateAction<string>>;
  expanded: boolean;
  setExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}

interface ConsoleMessage {
  id: string;
  type: 'log' | 'error' | 'warn' | 'info';
  message: string;
  timestamp: Date;
}

const SandboxContext = React.createContext<SandboxContextType | undefined>(undefined);

export const useSandbox = () => {
  const context = React.useContext(SandboxContext);
  if (context === undefined) {
    throw new Error('useSandbox must be used within a Sandbox');
  }
  return context;
};

// Main Sandbox component
const Sandbox = React.forwardRef<HTMLDivElement, SandboxProps>(
  ({ 
    className, 
    variant, 
    size, 
    files,
    template = 'vanilla',
    showFileExplorer = true,
    showConsole = true,
    showPreview = true,
    activeFile: initialActiveFile,
    onFileChange,
    onFileCreate,
    onFileDelete,
    onActiveFileChange,
    autoRun = true,
    readOnly = false,
    children,
    ...props 
  }, ref) => {
    const [activeFile, setActiveFile] = React.useState(
      initialActiveFile || Object.keys(files)[0] || ''
    );
    const [activeTab, setActiveTab] = React.useState<'code' | 'preview' | 'console'>('code');
    const [isRunning, setIsRunning] = React.useState(false);
    const [consoleOutput, setConsoleOutput] = React.useState<ConsoleMessage[]>([]);
    const [previewContent, setPreviewContent] = React.useState('');
    const [expanded, setExpanded] = React.useState(false);

    const handleFileChange = (path: string, content: string) => {
      onFileChange?.(path, content);
      if (autoRun) {
        runCode();
      }
    };

    const handleActiveFileChange = (path: string) => {
      setActiveFile(path);
      onActiveFileChange?.(path);
    };

    const runCode = async () => {
      setIsRunning(true);
      setConsoleOutput([]);
      
      try {
        // Simulate code execution
        const mainFile = files[activeFile];
        if (mainFile) {
          // Generate preview content based on file type
          let content = '';
          if (mainFile.language === 'html' || template === 'vanilla') {
            content = generateHTMLPreview(files);
          } else if (template === 'react') {
            content = generateReactPreview(files);
          } else {
            content = `<div class="p-4"><h3>Preview</h3><pre>${mainFile.content}</pre></div>`;
          }
          
          setPreviewContent(content);
          
          // Add success message to console
          setConsoleOutput(prev => [...prev, {
            id: Date.now().toString(),
            type: 'info',
            message: 'Code executed successfully',
            timestamp: new Date(),
          }]);
        }
      } catch (error) {
        setConsoleOutput(prev => [...prev, {
          id: Date.now().toString(),
          type: 'error',
          message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date(),
        }]);
      } finally {
        setTimeout(() => setIsRunning(false), 500);
      }
    };

    const generateHTMLPreview = (files: SandboxFiles): string => {
      const htmlFile = files['index.html'] || files[Object.keys(files).find(key => key.endsWith('.html')) || ''];
      const cssFile = files['styles.css'] || files[Object.keys(files).find(key => key.endsWith('.css')) || ''];
      const jsFile = files['index.js'] || files[Object.keys(files).find(key => key.endsWith('.js')) || ''];

      let html = htmlFile?.content || '<div class="p-4"><h1>Hello World</h1></div>';
      
      if (cssFile) {
        html = `<style>${cssFile.content}</style>${html}`;
      }
      
      if (jsFile) {
        html = `${html}<script>${jsFile.content}</script>`;
      }
      
      return html;
    };

    const generateReactPreview = (files: SandboxFiles): string => {
      const jsxFile = files['App.jsx'] || files[Object.keys(files).find(key => key.endsWith('.jsx')) || ''];
      
      if (jsxFile) {
        return `
          <div id="react-root" class="p-4">
            <h3>React Component Preview</h3>
            <div class="mt-4 p-4 border rounded">
              <pre class="text-sm">${jsxFile.content}</pre>
            </div>
          </div>
        `;
      }
      
      return '<div class="p-4"><h3>React Preview</h3><p>No JSX file found</p></div>';
    };

    const resetSandbox = () => {
      setConsoleOutput([]);
      setPreviewContent('');
      setIsRunning(false);
    };

    React.useEffect(() => {
      if (autoRun && activeFile && files[activeFile]) {
        runCode();
      }
    }, [activeFile, autoRun]);

    const contextValue: SandboxContextType = {
      files,
      activeFile,
      setActiveFile: handleActiveFileChange,
      activeTab,
      setActiveTab,
      isRunning,
      setIsRunning,
      consoleOutput,
      setConsoleOutput,
      previewContent,
      setPreviewContent,
      expanded,
      setExpanded,
    };

    return (
      <SandboxContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            sandboxVariants({ variant, size }),
            expanded && 'fixed inset-4 z-50 h-auto',
            className
          )}
          {...props}
        >
          <SandboxHeader 
            onRun={runCode}
            onReset={resetSandbox}
            onExpand={() => setExpanded(!expanded)}
            readOnly={readOnly}
          />
          
          <div className="flex flex-1 overflow-hidden">
            {showFileExplorer && (
              <SandboxFileExplorer
                onFileCreate={onFileCreate}
                onFileDelete={onFileDelete}
                readOnly={readOnly}
              />
            )}
            
            <div className="flex-1 flex flex-col">
              <SandboxTabs 
                showConsole={showConsole}
                showPreview={showPreview}
              />
              
              <div className="flex-1 overflow-hidden">
                {activeTab === 'code' && (
                  <SandboxEditor 
                    onFileChange={handleFileChange}
                    readOnly={readOnly}
                  />
                )}
                
                {activeTab === 'preview' && showPreview && (
                  <SandboxPreview />
                )}
                
                {activeTab === 'console' && showConsole && (
                  <SandboxConsole />
                )}
              </div>
            </div>
          </div>

          {children}
        </div>
      </SandboxContext.Provider>
    );
  }
);

Sandbox.displayName = 'Sandbox';

// Sandbox Header component
interface SandboxHeaderProps {
  onRun: () => void;
  onReset: () => void;
  onExpand: () => void;
  readOnly: boolean;
}

const SandboxHeader = React.forwardRef<HTMLDivElement, SandboxHeaderProps>(
  ({ onRun, onReset, onExpand, readOnly }, ref) => {
    const { isRunning, expanded } = useSandbox();

    return (
      <div
        ref={ref}
        className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/30"
      >
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">Sandbox</span>
        </div>
        
        <div className="flex items-center gap-1">
          {!readOnly && (
            <>
              <button
                onClick={onRun}
                disabled={isRunning}
                className="flex items-center gap-1 px-2 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                title="Run code"
              >
                {isRunning ? (
                  <Square className="h-3 w-3" />
                ) : (
                  <Play className="h-3 w-3" />
                )}
                {isRunning ? 'Running' : 'Run'}
              </button>
              
              <button
                onClick={onReset}
                className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
                title="Reset"
              >
                <RotateCcw className="h-4 w-4" />
              </button>
            </>
          )}
          
          <button
            onClick={onExpand}
            className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground transition-colors"
            title={expanded ? 'Minimize' : 'Expand'}
          >
            {expanded ? (
              <Minimize2 className="h-4 w-4" />
            ) : (
              <Maximize2 className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>
    );
  }
);

SandboxHeader.displayName = 'SandboxHeader';

// Sandbox File Explorer component
interface SandboxFileExplorerProps {
  onFileCreate?: (path: string, file: SandboxFile) => void;
  onFileDelete?: (path: string) => void;
  readOnly: boolean;
}

const SandboxFileExplorer = React.forwardRef<HTMLDivElement, SandboxFileExplorerProps>(
  ({ onFileCreate, onFileDelete, readOnly }, ref) => {
    const { files, activeFile, setActiveFile } = useSandbox();
    const [expandedFolders, setExpandedFolders] = React.useState<Set<string>>(new Set());

    const toggleFolder = (path: string) => {
      const newExpanded = new Set(expandedFolders);
      if (newExpanded.has(path)) {
        newExpanded.delete(path);
      } else {
        newExpanded.add(path);
      }
      setExpandedFolders(newExpanded);
    };

    const createFile = () => {
      const fileName = prompt('Enter file name:');
      if (fileName && onFileCreate) {
        const extension = fileName.split('.').pop() || 'txt';
        const language = getLanguageFromExtension(extension);
        onFileCreate(fileName, {
          name: fileName,
          content: '',
          language,
        });
      }
    };

    const deleteFile = (path: string) => {
      if (confirm(`Delete ${path}?`)) {
        onFileDelete?.(path);
      }
    };

    const getLanguageFromExtension = (ext: string): string => {
      const languages: Record<string, string> = {
        js: 'javascript',
        jsx: 'javascript',
        ts: 'typescript',
        tsx: 'typescript',
        html: 'html',
        css: 'css',
        json: 'json',
        md: 'markdown',
      };
      return languages[ext] || 'text';
    };

    return (
      <div
        ref={ref}
        className="w-64 border-r border-border bg-muted/20 flex flex-col"
      >
        <div className="flex items-center justify-between px-3 py-2 border-b border-border">
          <span className="text-sm font-medium">Files</span>
          {!readOnly && (
            <button
              onClick={createFile}
              className="p-1 hover:bg-muted rounded text-muted-foreground hover:text-foreground"
              title="Create file"
            >
              <Plus className="h-3 w-3" />
            </button>
          )}
        </div>
        
        <div className="flex-1 overflow-y-auto">
          {Object.entries(files).map(([path, file]) => (
            <div
              key={path}
              className={cn(
                'flex items-center gap-2 px-3 py-1.5 text-sm cursor-pointer hover:bg-muted/50',
                activeFile === path && 'bg-muted text-foreground'
              )}
              onClick={() => setActiveFile(path)}
            >
              <FileText className="h-4 w-4 text-muted-foreground" />
              <span className="flex-1 truncate">{file.name}</span>
              {!readOnly && !file.readOnly && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteFile(path);
                  }}
                  className="p-0.5 hover:bg-muted rounded text-muted-foreground hover:text-red-500"
                  title="Delete file"
                >
                  <X className="h-3 w-3" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }
);

SandboxFileExplorer.displayName = 'SandboxFileExplorer';

// Sandbox Tabs component
interface SandboxTabsProps {
  showConsole: boolean;
  showPreview: boolean;
}

const SandboxTabs = React.forwardRef<HTMLDivElement, SandboxTabsProps>(
  ({ showConsole, showPreview }, ref) => {
    const { activeTab, setActiveTab } = useSandbox();

    const tabs = [
      { id: 'code' as const, label: 'Code', icon: Code2 },
      ...(showPreview ? [{ id: 'preview' as const, label: 'Preview', icon: Eye }] : []),
      ...(showConsole ? [{ id: 'console' as const, label: 'Console', icon: Terminal }] : []),
    ];

    return (
      <div
        ref={ref}
        className="flex border-b border-border bg-muted/20"
      >
        {tabs.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={cn(
              'flex items-center gap-2 px-4 py-2 text-sm border-b-2 transition-colors',
              activeTab === id
                ? 'border-primary text-foreground bg-background'
                : 'border-transparent text-muted-foreground hover:text-foreground hover:bg-muted/50'
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>
    );
  }
);

SandboxTabs.displayName = 'SandboxTabs';

// Sandbox Editor component
interface SandboxEditorProps {
  onFileChange: (path: string, content: string) => void;
  readOnly: boolean;
}

const SandboxEditor = React.forwardRef<HTMLDivElement, SandboxEditorProps>(
  ({ onFileChange, readOnly }, ref) => {
    const { files, activeFile } = useSandbox();
    const [content, setContent] = React.useState('');

    const currentFile = files[activeFile];

    React.useEffect(() => {
      if (currentFile) {
        setContent(currentFile.content);
      }
    }, [currentFile]);

    const handleContentChange = (newContent: string) => {
      setContent(newContent);
      if (!readOnly && !currentFile?.readOnly) {
        onFileChange(activeFile, newContent);
      }
    };

    if (!currentFile) {
      return (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          No file selected
        </div>
      );
    }

    return (
      <div ref={ref} className="flex-1 flex flex-col">
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">{currentFile.name}</span>
          {(readOnly || currentFile.readOnly) && (
            <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded">
              Read-only
            </span>
          )}
        </div>
        
        <div className="flex-1 relative">
          <textarea
            value={content}
            onChange={(e) => handleContentChange(e.target.value)}
            readOnly={readOnly || currentFile.readOnly}
            className="absolute inset-0 w-full h-full p-4 font-mono text-sm bg-background border-0 resize-none focus:outline-none focus:ring-0"
            placeholder="Start typing your code..."
            spellCheck={false}
          />
        </div>
      </div>
    );
  }
);

SandboxEditor.displayName = 'SandboxEditor';

// Sandbox Preview component
const SandboxPreview = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { previewContent, isRunning } = useSandbox();

    return (
      <div
        ref={ref}
        className={cn('flex-1 flex flex-col', className)}
        {...props}
      >
        <div className="flex items-center gap-2 px-4 py-2 border-b border-border bg-muted/20">
          <Eye className="h-4 w-4 text-muted-foreground" />
          <span className="text-sm font-medium">Preview</span>
          {isRunning && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <div className="animate-spin rounded-full h-3 w-3 border border-muted-foreground border-t-transparent" />
              Running...
            </div>
          )}
        </div>
        
        <div className="flex-1 bg-white">
          {previewContent ? (
            <iframe
              srcDoc={previewContent}
              className="w-full h-full border-0"
              sandbox="allow-scripts allow-same-origin"
              title="Preview"
            />
          ) : (
            <div className="flex items-center justify-center h-full text-muted-foreground">
              Run your code to see the preview
            </div>
          )}
        </div>
      </div>
    );
  }
);

SandboxPreview.displayName = 'SandboxPreview';

// Sandbox Console component
const SandboxConsole = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => {
    const { consoleOutput, setConsoleOutput } = useSandbox();

    const clearConsole = () => {
      setConsoleOutput([]);
    };

    const getMessageIcon = (type: ConsoleMessage['type']) => {
      switch (type) {
        case 'error':
          return <AlertCircle className="h-4 w-4 text-red-500" />;
        case 'warn':
          return <AlertCircle className="h-4 w-4 text-yellow-500" />;
        case 'info':
          return <CheckCircle2 className="h-4 w-4 text-blue-500" />;
        default:
          return <Terminal className="h-4 w-4 text-muted-foreground" />;
      }
    };

    const getMessageColor = (type: ConsoleMessage['type']) => {
      switch (type) {
        case 'error':
          return 'text-red-600 dark:text-red-400';
        case 'warn':
          return 'text-yellow-600 dark:text-yellow-400';
        case 'info':
          return 'text-blue-600 dark:text-blue-400';
        default:
          return 'text-foreground';
      }
    };

    return (
      <div
        ref={ref}
        className={cn('flex-1 flex flex-col', className)}
        {...props}
      >
        <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/20">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium">Console</span>
          </div>
          <button
            onClick={clearConsole}
            className="text-xs text-muted-foreground hover:text-foreground px-2 py-1 hover:bg-muted rounded"
          >
            Clear
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-2 font-mono text-sm bg-muted/10">
          {consoleOutput.length === 0 ? (
            <div className="text-muted-foreground p-2">
              Console output will appear here...
            </div>
          ) : (
            <div className="space-y-1">
              {consoleOutput.map((message) => (
                <div
                  key={message.id}
                  className="flex items-start gap-2 p-2 rounded hover:bg-muted/50"
                >
                  {getMessageIcon(message.type)}
                  <div className="flex-1">
                    <div className={cn('text-sm', getMessageColor(message.type))}>
                      {message.message}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }
);

SandboxConsole.displayName = 'SandboxConsole';

export {
  Sandbox,
  SandboxHeader,
  SandboxFileExplorer,
  SandboxTabs,
  SandboxEditor,
  SandboxPreview,
  SandboxConsole,
  sandboxVariants,
};
