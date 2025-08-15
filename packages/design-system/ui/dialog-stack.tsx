/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Maximize2, Minimize2 } from "lucide-react";
import { cn } from "../lib/utils";

const dialogStackVariants = cva(
  "fixed inset-0 z-50 flex items-center justify-center p-4",
  {
    variants: {
      backdrop: {
        default: "bg-black/50 backdrop-blur-sm",
        dark: "bg-black/70",
        light: "bg-white/30 backdrop-blur-sm",
        none: "",
      },
    },
    defaultVariants: {
      backdrop: "default",
    },
  }
);

const dialogVariants = cva(
  "relative bg-background border rounded-lg shadow-lg max-h-[90vh] overflow-hidden",
  {
    variants: {
      size: {
        sm: "w-full max-w-sm",
        md: "w-full max-w-md",
        lg: "w-full max-w-lg",
        xl: "w-full max-w-xl",
        "2xl": "w-full max-w-2xl",
        full: "w-full max-w-[90vw]",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

interface DialogData {
  id: string;
  title?: string;
  content?: React.ReactNode;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "full";
  closable?: boolean;
  maximizable?: boolean;
  onClose?: () => void;
  onMaximize?: (maximized: boolean) => void;
  maximized?: boolean;
  zIndex?: number;
}

interface DialogStackContextValue {
  dialogs: DialogData[];
  openDialog: (dialog: Omit<DialogData, 'id'>) => string;
  closeDialog: (id: string) => void;
  closeAllDialogs: () => void;
  maximizeDialog: (id: string, maximized?: boolean) => void;
  bringToFront: (id: string) => void;
  getTopDialog: () => DialogData | null;
}

const DialogStackContext = React.createContext<DialogStackContextValue | null>(null);

interface DialogStackProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dialogStackVariants> {
  maxDialogs?: number;
}

const DialogStack = React.forwardRef<HTMLDivElement, DialogStackProps>(
  ({ className, backdrop, children, maxDialogs = 10, ...props }, ref) => {
    const [dialogs, setDialogs] = React.useState<DialogData[]>([]);
    const [nextId, setNextId] = React.useState(1);

    const openDialog = React.useCallback(
      (dialogData: Omit<DialogData, 'id'>) => {
        const id = `dialog-${nextId}`;
        setNextId(prev => prev + 1);

        setDialogs(prev => {
          const newDialogs = [
            ...prev,
            {
              ...dialogData,
              id,
              zIndex: 50 + prev.length + 1,
            },
          ];

          // Remove oldest dialog if exceeding max
          if (newDialogs.length > maxDialogs) {
            const removed = newDialogs.shift();
            removed?.onClose?.();
          }

          return newDialogs;
        });

        return id;
      },
      [nextId, maxDialogs]
    );

    const closeDialog = React.useCallback((id: string) => {
      setDialogs(prev => {
        const dialog = prev.find(d => d.id === id);
        dialog?.onClose?.();
        return prev.filter(d => d.id !== id);
      });
    }, []);

    const closeAllDialogs = React.useCallback(() => {
      setDialogs(prev => {
        prev.forEach(dialog => dialog.onClose?.());
        return [];
      });
    }, []);

    const maximizeDialog = React.useCallback((id: string, maximized?: boolean) => {
      setDialogs(prev =>
        prev.map(dialog => {
          if (dialog.id === id) {
            const newMaximized = maximized !== undefined ? maximized : !dialog.maximized;
            dialog.onMaximize?.(newMaximized);
            return { ...dialog, maximized: newMaximized };
          }
          return dialog;
        })
      );
    }, []);

    const bringToFront = React.useCallback((id: string) => {
      setDialogs(prev => {
        const maxZ = Math.max(...prev.map(d => d.zIndex || 50));
        return prev.map(dialog =>
          dialog.id === id
            ? { ...dialog, zIndex: maxZ + 1 }
            : dialog
        );
      });
    }, []);

    const getTopDialog = React.useCallback(() => {
      if (dialogs.length === 0) return null;
      return dialogs.reduce((top, current) =>
        (current.zIndex || 0) > (top.zIndex || 0) ? current : top
      );
    }, [dialogs]);

    const contextValue = React.useMemo(
      () => ({
        dialogs,
        openDialog,
        closeDialog,
        closeAllDialogs,
        maximizeDialog,
        bringToFront,
        getTopDialog,
      }),
      [dialogs, openDialog, closeDialog, closeAllDialogs, maximizeDialog, bringToFront, getTopDialog]
    );

    // Handle escape key to close top dialog
    React.useEffect(() => {
      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          const topDialog = getTopDialog();
          if (topDialog && topDialog.closable !== false) {
            closeDialog(topDialog.id);
          }
        }
      };

      if (dialogs.length > 0) {
        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
      }
    }, [dialogs, getTopDialog, closeDialog]);

    return (
      <DialogStackContext.Provider value={contextValue}>
        <div ref={ref} {...props}>
          {children}
          
          {/* Render dialogs */}
          {dialogs.map((dialog) => (
            <DialogStackOverlay
              key={dialog.id}
              dialog={dialog}
              backdrop={backdrop}
              isTop={getTopDialog()?.id === dialog.id}
            />
          ))}
        </div>
      </DialogStackContext.Provider>
    );
  }
);

DialogStack.displayName = "DialogStack";

// Dialog Stack Overlay
interface DialogStackOverlayProps {
  dialog: DialogData;
  backdrop?: "default" | "dark" | "light" | "none" | null;
  isTop: boolean;
}

const DialogStackOverlay = React.forwardRef<HTMLDivElement, DialogStackOverlayProps>(
  ({ dialog, backdrop = "default", isTop }, ref) => {
    const context = React.useContext(DialogStackContext);

    if (!context) {
      throw new Error("DialogStackOverlay must be used within a DialogStack");
    }

    const { closeDialog, maximizeDialog, bringToFront } = context;

    const handleBackdropClick = (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && dialog.closable !== false) {
        closeDialog(dialog.id);
      }
    };

    const handleDialogClick = () => {
      if (!isTop) {
        bringToFront(dialog.id);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          dialogStackVariants({ backdrop: isTop ? (backdrop || "default") : "none" }),
          !isTop && "bg-transparent"
        )}
        style={{ zIndex: dialog.zIndex }}
        onClick={handleBackdropClick}
      >
        <div
          className={cn(
            dialogVariants({ 
              size: dialog.maximized ? "full" : dialog.size 
            }),
            dialog.maximized && "max-w-[95vw] max-h-[95vh]",
            !isTop && "opacity-80 scale-95",
            "transition-all duration-200 ease-out"
          )}
          onClick={handleDialogClick}
        >
          {/* Dialog Header */}
          <DialogStackHeader dialog={dialog} />
          
          {/* Dialog Content */}
          <DialogStackContent>
            {dialog.content}
          </DialogStackContent>
        </div>
      </div>
    );
  }
);

DialogStackOverlay.displayName = "DialogStackOverlay";

// Dialog Stack Header
interface DialogStackHeaderProps {
  dialog: DialogData;
}

const DialogStackHeader = React.forwardRef<HTMLDivElement, DialogStackHeaderProps>(
  ({ dialog }, ref) => {
    const context = React.useContext(DialogStackContext);

    if (!context) {
      throw new Error("DialogStackHeader must be used within a DialogStack");
    }

    const { closeDialog, maximizeDialog } = context;

    return (
      <div
        ref={ref}
        className="flex items-center justify-between p-4 border-b bg-muted/50"
      >
        <div className="flex items-center space-x-2">
          <h2 className="text-lg font-semibold">
            {dialog.title || "Dialog"}
          </h2>
        </div>
        
        <div className="flex items-center space-x-1">
          {dialog.maximizable !== false && (
            <button
              onClick={() => maximizeDialog(dialog.id)}
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label={dialog.maximized ? "Restore" : "Maximize"}
            >
              {dialog.maximized ? (
                <Minimize2 className="h-4 w-4" />
              ) : (
                <Maximize2 className="h-4 w-4" />
              )}
            </button>
          )}
          
          {dialog.closable !== false && (
            <button
              onClick={() => closeDialog(dialog.id)}
              className="p-1 rounded hover:bg-muted transition-colors"
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

DialogStackHeader.displayName = "DialogStackHeader";

// Dialog Stack Content
interface DialogStackContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DialogStackContent = React.forwardRef<HTMLDivElement, DialogStackContentProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("p-6 overflow-y-auto flex-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

DialogStackContent.displayName = "DialogStackContent";

// Dialog Stack Button
interface DialogStackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline" | "ghost" | "destructive";
  size?: "sm" | "md" | "lg";
}

const DialogStackButton = React.forwardRef<HTMLButtonElement, DialogStackButtonProps>(
  ({ className, variant = "default", size = "md", children, ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50";
    
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
      ghost: "hover:bg-accent hover:text-accent-foreground",
      destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
    };

    const sizes = {
      sm: "h-8 px-3 text-xs",
      md: "h-9 px-4 text-sm",
      lg: "h-10 px-6 text-base",
    };

    return (
      <button
        ref={ref}
        className={cn(baseClasses, variants[variant], sizes[size], className)}
        {...props}
      >
        {children}
      </button>
    );
  }
);

DialogStackButton.displayName = "DialogStackButton";

// Hook for accessing dialog stack context
const useDialogStack = () => {
  const context = React.useContext(DialogStackContext);
  if (!context) {
    throw new Error("useDialogStack must be used within a DialogStack component");
  }
  return context;
};

// Utility function to create a simple dialog
const createDialog = (
  title: string,
  content: React.ReactNode,
  options?: Partial<Omit<DialogData, 'id' | 'title' | 'content'>>
): Omit<DialogData, 'id'> => ({
  title,
  content,
  size: "md",
  closable: true,
  maximizable: true,
  ...options,
});

export {
  DialogStack,
  DialogStackOverlay,
  DialogStackHeader,
  DialogStackContent,
  DialogStackButton,
  useDialogStack,
  createDialog,
  dialogStackVariants,
  dialogVariants,
};

export type {
  DialogStackProps,
  DialogStackOverlayProps,
  DialogStackHeaderProps,
  DialogStackContentProps,
  DialogStackButtonProps,
  DialogData,
  DialogStackContextValue,
};
