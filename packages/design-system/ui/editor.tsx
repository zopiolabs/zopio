/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { 
  Bold, 
  Italic, 
  Underline, 
  Strikethrough, 
  AlignLeft, 
  AlignCenter, 
  AlignRight,
  List,
  ListOrdered,
  Quote,
  Code,
  Link,
  Image,
  Undo,
  Redo,
  Type,
  Palette
} from "lucide-react";
import { cn } from "../lib/utils";

const editorVariants = cva(
  "relative border rounded-lg bg-background overflow-hidden",
  {
    variants: {
      size: {
        sm: "min-h-32",
        md: "min-h-48",
        lg: "min-h-64",
        xl: "min-h-96",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface EditorContextValue {
  content: string;
  setContent: (content: string) => void;
  selection: { start: number; end: number } | null;
  setSelection: (selection: { start: number; end: number } | null) => void;
  history: string[];
  historyIndex: number;
  addToHistory: (content: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  formatText: (format: string, value?: string) => void;
  insertText: (text: string) => void;
  focus: () => void;
}

const EditorContext = React.createContext<EditorContextValue | null>(null);

interface EditorProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'>,
    VariantProps<typeof editorVariants> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  readOnly?: boolean;
  maxLength?: number;
  showToolbar?: boolean;
  showWordCount?: boolean;
}

const Editor = React.forwardRef<HTMLDivElement, EditorProps>(
  (
    {
      className,
      size,
      children,
      value = "",
      onChange,
      placeholder = "Start typing...",
      readOnly = false,
      maxLength,
      showToolbar = true,
      showWordCount = false,
      ...props
    },
    ref
  ) => {
    const [content, setContentState] = React.useState(value);
    const [selection, setSelection] = React.useState<{ start: number; end: number } | null>(null);
    const [history, setHistory] = React.useState<string[]>([value]);
    const [historyIndex, setHistoryIndex] = React.useState(0);
    const editorRef = React.useRef<HTMLDivElement>(null);

    const setContent = React.useCallback(
      (newContent: string) => {
        if (maxLength && newContent.length > maxLength) {
          return;
        }
        setContentState(newContent);
        onChange?.(newContent);
      },
      [maxLength, onChange]
    );

    const addToHistory = React.useCallback(
      (newContent: string) => {
        setHistory(prev => {
          const newHistory = prev.slice(0, historyIndex + 1);
          newHistory.push(newContent);
          return newHistory.slice(-50); // Keep last 50 entries
        });
        setHistoryIndex(prev => Math.min(prev + 1, 49));
      },
      [historyIndex]
    );

    const undo = React.useCallback(() => {
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        const previousContent = history[newIndex];
        setContent(previousContent);
      }
    }, [historyIndex, history, setContent]);

    const redo = React.useCallback(() => {
      if (historyIndex < history.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        const nextContent = history[newIndex];
        setContent(nextContent);
      }
    }, [historyIndex, history, setContent]);

    const formatText = React.useCallback(
      (format: string, value?: string) => {
        if (!editorRef.current || readOnly) return;

        const selection = window.getSelection();
        if (!selection || selection.rangeCount === 0) return;

        const range = selection.getRangeAt(0);
        const selectedText = range.toString();

        let formattedText = selectedText;

        switch (format) {
          case 'bold':
            formattedText = `**${selectedText}**`;
            break;
          case 'italic':
            formattedText = `*${selectedText}*`;
            break;
          case 'underline':
            formattedText = `<u>${selectedText}</u>`;
            break;
          case 'strikethrough':
            formattedText = `~~${selectedText}~~`;
            break;
          case 'code':
            formattedText = `\`${selectedText}\``;
            break;
          case 'link':
            const url = value || prompt('Enter URL:');
            if (url) {
              formattedText = `[${selectedText || 'Link'}](${url})`;
            }
            break;
          case 'quote':
            formattedText = `> ${selectedText}`;
            break;
          default:
            return;
        }

        if (formattedText !== selectedText) {
          range.deleteContents();
          range.insertNode(document.createTextNode(formattedText));
          
          // Update content
          const newContent = editorRef.current.textContent || '';
          addToHistory(content);
          setContent(newContent);
        }
      },
      [content, readOnly, addToHistory, setContent]
    );

    const insertText = React.useCallback(
      (text: string) => {
        if (!editorRef.current || readOnly) return;

        const selection = window.getSelection();
        if (selection && selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          range.deleteContents();
          range.insertNode(document.createTextNode(text));
          
          const newContent = editorRef.current.textContent || '';
          addToHistory(content);
          setContent(newContent);
        }
      },
      [content, readOnly, addToHistory, setContent]
    );

    const focus = React.useCallback(() => {
      editorRef.current?.focus();
    }, []);

    // Sync external value changes
    React.useEffect(() => {
      if (value !== content) {
        setContentState(value);
      }
    }, [value, content]);

    // Handle keyboard shortcuts
    React.useEffect(() => {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (!editorRef.current?.contains(e.target as Node)) return;

        if (e.ctrlKey || e.metaKey) {
          switch (e.key) {
            case 'z':
              e.preventDefault();
              if (e.shiftKey) {
                redo();
              } else {
                undo();
              }
              break;
            case 'y':
              e.preventDefault();
              redo();
              break;
            case 'b':
              e.preventDefault();
              formatText('bold');
              break;
            case 'i':
              e.preventDefault();
              formatText('italic');
              break;
            case 'u':
              e.preventDefault();
              formatText('underline');
              break;
          }
        }
      };

      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo, formatText]);

    const contextValue = React.useMemo(
      () => ({
        content,
        setContent,
        selection,
        setSelection,
        history,
        historyIndex,
        addToHistory,
        undo,
        redo,
        canUndo: historyIndex > 0,
        canRedo: historyIndex < history.length - 1,
        formatText,
        insertText,
        focus,
      }),
      [
        content,
        setContent,
        selection,
        history,
        historyIndex,
        addToHistory,
        undo,
        redo,
        formatText,
        insertText,
        focus,
      ]
    );

    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const charCount = content.length;

    return (
      <EditorContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(editorVariants({ size, className }))}
          {...props}
        >
          {showToolbar && <EditorToolbar />}
          
          <EditorContent
            ref={editorRef}
            placeholder={placeholder}
            readOnly={readOnly}
          />
          
          {showWordCount && (
            <EditorFooter>
              <div className="text-xs text-muted-foreground">
                {wordCount} words, {charCount} characters
                {maxLength && ` (${maxLength - charCount} remaining)`}
              </div>
            </EditorFooter>
          )}
          
          {children}
        </div>
      </EditorContext.Provider>
    );
  }
);

Editor.displayName = "Editor";

// Editor Toolbar
interface EditorToolbarProps extends React.HTMLAttributes<HTMLDivElement> {}

const EditorToolbar = React.forwardRef<HTMLDivElement, EditorToolbarProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(EditorContext);

    if (!context) {
      throw new Error("EditorToolbar must be used within an Editor");
    }

    const { formatText, undo, redo, canUndo, canRedo } = context;

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-1 p-2 border-b bg-muted/50 flex-wrap",
          className
        )}
        {...props}
      >
        {/* History */}
        <div className="flex items-center gap-1 mr-2">
          <EditorButton
            onClick={undo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
          >
            <Undo className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            onClick={redo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
          >
            <Redo className="h-4 w-4" />
          </EditorButton>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Text Formatting */}
        <div className="flex items-center gap-1 mr-2">
          <EditorButton
            onClick={() => formatText('bold')}
            title="Bold (Ctrl+B)"
          >
            <Bold className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            onClick={() => formatText('italic')}
            title="Italic (Ctrl+I)"
          >
            <Italic className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            onClick={() => formatText('underline')}
            title="Underline (Ctrl+U)"
          >
            <Underline className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            onClick={() => formatText('strikethrough')}
            title="Strikethrough"
          >
            <Strikethrough className="h-4 w-4" />
          </EditorButton>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Lists and Quotes */}
        <div className="flex items-center gap-1 mr-2">
          <EditorButton
            onClick={() => formatText('quote')}
            title="Quote"
          >
            <Quote className="h-4 w-4" />
          </EditorButton>
          <EditorButton
            onClick={() => formatText('code')}
            title="Code"
          >
            <Code className="h-4 w-4" />
          </EditorButton>
        </div>

        <div className="w-px h-6 bg-border mx-1" />

        {/* Links and Media */}
        <div className="flex items-center gap-1">
          <EditorButton
            onClick={() => formatText('link')}
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </EditorButton>
        </div>
      </div>
    );
  }
);

EditorToolbar.displayName = "EditorToolbar";

// Editor Content
interface EditorContentProps extends React.HTMLAttributes<HTMLDivElement> {
  placeholder?: string;
  readOnly?: boolean;
}

const EditorContent = React.forwardRef<HTMLDivElement, EditorContentProps>(
  ({ className, placeholder, readOnly = false, ...props }, ref) => {
    const context = React.useContext(EditorContext);

    if (!context) {
      throw new Error("EditorContent must be used within an Editor");
    }

    const { content, setContent, addToHistory } = context;
    const contentRef = React.useRef<string>(content);
    const selectionRef = React.useRef<{start: number; end: number} | null>(null);

    // Save selection position before update
    const saveSelection = () => {
      const selection = window.getSelection();
      if (selection && selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        const preCaretRange = range.cloneRange();
        const editorElement = (typeof ref === 'object' && ref?.current) ? ref.current : document.body;
        preCaretRange.selectNodeContents(editorElement);
        preCaretRange.setEnd(range.startContainer, range.startOffset);
        const start = preCaretRange.toString().length;
        
        preCaretRange.setEnd(range.endContainer, range.endOffset);
        const end = preCaretRange.toString().length;
        
        selectionRef.current = { start, end };
      }
    };

    // Restore selection position after update
    const restoreSelection = () => {
      const editorElement = typeof ref === 'object' && ref?.current ? ref.current : null;
      if (!selectionRef.current || !editorElement) return;
      
      const selection = window.getSelection();
      if (!selection) return;
      
      const range = document.createRange();
      let charCount = 0;
      let foundStart = false;
      let foundEnd = false;
      
      const traverse = (node: Node) => {
        if (foundStart && foundEnd) return;
        
        if (node.nodeType === Node.TEXT_NODE) {
          const nextCharCount = charCount + (node.textContent?.length || 0);
          const currentSelection = selectionRef.current;
          
          if (currentSelection && !foundStart && currentSelection.start >= charCount && currentSelection.start <= nextCharCount) {
            range.setStart(node, currentSelection.start - charCount);
            foundStart = true;
          }
          
          if (currentSelection && !foundEnd && currentSelection.end >= charCount && currentSelection.end <= nextCharCount) {
            range.setEnd(node, currentSelection.end - charCount);
            foundEnd = true;
          }
          
          charCount = nextCharCount;
        } else {
          for (let i = 0; i < node.childNodes.length; i++) {
            traverse(node.childNodes[i]);
          }
        }
      };
      
      traverse(editorElement);
      
      if (foundStart && foundEnd) {
        selection.removeAllRanges();
        selection.addRange(range);
      }
    };

    const handleInput = (e: React.FormEvent<HTMLDivElement>) => {
      saveSelection();
      const newContent = e.currentTarget.textContent || '';
      contentRef.current = newContent;
      setContent(newContent);
      // We'll restore selection in useEffect
    };

    const handleBlur = () => {
      addToHistory(content);
    };

    const handlePaste = (e: React.ClipboardEvent) => {
      e.preventDefault();
      saveSelection();
      const text = e.clipboardData.getData('text/plain');
      document.execCommand('insertText', false, text);
    };

    // Effect to restore cursor position after content update
    React.useEffect(() => {
      if (contentRef.current === content && selectionRef.current) {
        restoreSelection();
      }
    }, [content]);

    return (
      <div
        ref={ref}
        className={cn(
          "flex-1 p-4 outline-none overflow-y-auto",
          "prose prose-sm max-w-none",
          "focus:ring-0 focus:outline-none",
          readOnly && "cursor-default",
          className
        )}
        contentEditable={!readOnly}
        suppressContentEditableWarning
        onInput={handleInput}
        onBlur={handleBlur}
        onPaste={handlePaste}
        data-placeholder={placeholder}
        style={{
          minHeight: 'inherit',
        }}
        {...props}
      >
        {content}
      </div>
    );
  }
);

EditorContent.displayName = "EditorContent";

// Editor Footer
interface EditorFooterProps extends React.HTMLAttributes<HTMLDivElement> {}

const EditorFooter = React.forwardRef<HTMLDivElement, EditorFooterProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-2 border-t bg-muted/30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

EditorFooter.displayName = "EditorFooter";

// Editor Button
interface EditorButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

const EditorButton = React.forwardRef<HTMLButtonElement, EditorButtonProps>(
  ({ className, active, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded p-1.5 text-sm font-medium transition-colors",
          "hover:bg-accent hover:text-accent-foreground",
          "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
          "disabled:pointer-events-none disabled:opacity-50",
          active && "bg-accent text-accent-foreground",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

EditorButton.displayName = "EditorButton";

// Editor Menu
interface EditorMenuProps extends React.HTMLAttributes<HTMLDivElement> {
  trigger: React.ReactNode;
}

const EditorMenu = React.forwardRef<HTMLDivElement, EditorMenuProps>(
  ({ className, children, trigger, ...props }, ref) => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
      <div className="relative" ref={ref} {...props}>
        <div onClick={() => setIsOpen(!isOpen)}>
          {trigger}
        </div>
        
        {isOpen && (
          <div
            className={cn(
              "absolute top-full left-0 z-50 mt-1 min-w-32 rounded-md border bg-popover p-1 shadow-lg",
              className
            )}
          >
            {children}
          </div>
        )}
      </div>
    );
  }
);

EditorMenu.displayName = "EditorMenu";

// Hook for accessing editor context
const useEditor = () => {
  const context = React.useContext(EditorContext);
  if (!context) {
    throw new Error("useEditor must be used within an Editor component");
  }
  return context;
};

// Utility functions
const getWordCount = (text: string): number => {
  return text.trim().split(/\s+/).filter(word => word.length > 0).length;
};

const getCharacterCount = (text: string): number => {
  return text.length;
};

const insertAtCursor = (text: string) => {
  const selection = window.getSelection();
  if (selection && selection.rangeCount > 0) {
    const range = selection.getRangeAt(0);
    range.deleteContents();
    const textNode = document.createTextNode(text);
    range.insertNode(textNode);
    
    // Move cursor to end of inserted text
    range.setStartAfter(textNode);
    range.setEndAfter(textNode);
    selection.removeAllRanges();
    selection.addRange(range);
  }
};

export {
  Editor,
  EditorToolbar,
  EditorContent,
  EditorFooter,
  EditorButton,
  EditorMenu,
  useEditor,
  getWordCount,
  getCharacterCount,
  insertAtCursor,
  editorVariants,
};

export type {
  EditorProps,
  EditorToolbarProps,
  EditorContentProps,
  EditorFooterProps,
  EditorButtonProps,
  EditorMenuProps,
  EditorContextValue,
};
