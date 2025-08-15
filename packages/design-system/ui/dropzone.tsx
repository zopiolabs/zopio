/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { Upload, X, File, Image as ImageIcon, FileText } from "lucide-react";
import { cn } from "../lib/utils";

const dropzoneVariants = cva(
  "relative flex flex-col items-center justify-center rounded-lg border-2 border-dashed transition-colors",
  {
    variants: {
      variant: {
        default: "border-border bg-background hover:bg-accent/50",
        active: "border-primary bg-primary/5",
        error: "border-destructive bg-destructive/5",
        success: "border-green-500 bg-green-50 dark:bg-green-950",
      },
      size: {
        sm: "h-32 p-4",
        md: "h-48 p-6",
        lg: "h-64 p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface DropzoneFile extends File {
  preview?: string;
  error?: string;
}

interface DropzoneContextValue {
  files: DropzoneFile[];
  isDragActive: boolean;
  isUploading: boolean;
  error?: string;
  removeFile: (index: number) => void;
  clearFiles: () => void;
}

const DropzoneContext = React.createContext<DropzoneContextValue | null>(null);

interface DropzoneProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof dropzoneVariants> {
  onFilesChange?: (files: DropzoneFile[]) => void;
  onFilesDrop?: (files: DropzoneFile[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSize?: number; // in bytes
  minSize?: number; // in bytes
  disabled?: boolean;
  showPreview?: boolean;
  allowReplace?: boolean;
}

const Dropzone = React.forwardRef<HTMLDivElement, DropzoneProps>(
  (
    {
      className,
      variant,
      size,
      children,
      onFilesChange,
      onFilesDrop,
      accept,
      multiple = true,
      maxFiles,
      maxSize,
      minSize,
      disabled = false,
      showPreview = false,
      allowReplace = false,
      ...props
    },
    ref
  ) => {
    const [files, setFiles] = React.useState<DropzoneFile[]>([]);
    const [isDragActive, setIsDragActive] = React.useState(false);
    const [isUploading, setIsUploading] = React.useState(false);
    const [error, setError] = React.useState<string>();
    const fileInputRef = React.useRef<HTMLInputElement>(null);

    const validateFile = React.useCallback(
      (file: File): string | null => {
        if (minSize && file.size < minSize) {
          return `File size must be at least ${formatFileSize(minSize)}`;
        }
        if (maxSize && file.size > maxSize) {
          return `File size must be less than ${formatFileSize(maxSize)}`;
        }
        if (accept) {
          const acceptedTypes = accept.split(',').map(type => type.trim());
          const isAccepted = acceptedTypes.some(type => {
            if (type.startsWith('.')) {
              return file.name.toLowerCase().endsWith(type.toLowerCase());
            }
            if (type.includes('/*')) {
              const [mainType] = type.split('/');
              return file.type.startsWith(mainType);
            }
            return file.type === type;
          });
          if (!isAccepted) {
            return `File type not accepted. Accepted types: ${accept}`;
          }
        }
        return null;
      },
      [accept, maxSize, minSize]
    );

    const processFiles = React.useCallback(
      async (fileList: FileList | File[]) => {
        const newFiles: DropzoneFile[] = [];
        const filesArray = Array.from(fileList);

        // Check max files limit
        if (maxFiles && (!multiple || allowReplace)) {
          if (filesArray.length > maxFiles) {
            setError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
            return;
          }
        } else if (maxFiles && multiple && !allowReplace) {
          if (files.length + filesArray.length > maxFiles) {
            setError(`Maximum ${maxFiles} file${maxFiles > 1 ? 's' : ''} allowed`);
            return;
          }
        }

        for (const file of filesArray) {
          const validationError = validateFile(file);
          const dropzoneFile: DropzoneFile = Object.assign(file, {
            error: validationError || undefined,
          });

          // Create preview for images
          if (showPreview && file.type.startsWith('image/') && !validationError) {
            try {
              dropzoneFile.preview = URL.createObjectURL(file);
            } catch (e) {
              // Handle error silently
            }
          }

          newFiles.push(dropzoneFile);
        }

        const updatedFiles = allowReplace || !multiple ? newFiles : [...files, ...newFiles];
        setFiles(updatedFiles);
        setError(undefined);
        onFilesChange?.(updatedFiles);
        onFilesDrop?.(newFiles);
      },
      [files, maxFiles, multiple, allowReplace, validateFile, showPreview, onFilesChange, onFilesDrop]
    );

    const removeFile = React.useCallback(
      (index: number) => {
        const updatedFiles = files.filter((_, i) => i !== index);
        
        // Revoke preview URL to prevent memory leaks
        const fileToRemove = files[index];
        if (fileToRemove?.preview) {
          URL.revokeObjectURL(fileToRemove.preview);
        }
        
        setFiles(updatedFiles);
        onFilesChange?.(updatedFiles);
      },
      [files, onFilesChange]
    );

    const clearFiles = React.useCallback(() => {
      // Revoke all preview URLs
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      
      setFiles([]);
      setError(undefined);
      onFilesChange?.([]);
    }, [files, onFilesChange]);

    const handleDragEnter = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(true);
      }
    }, [disabled]);

    const handleDragLeave = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      if (!disabled) {
        setIsDragActive(false);
      }
    }, [disabled]);

    const handleDragOver = React.useCallback((e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
    }, []);

    const handleDrop = React.useCallback(
      (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragActive(false);

        if (disabled) return;

        const { files: droppedFiles } = e.dataTransfer;
        if (droppedFiles?.length) {
          processFiles(droppedFiles);
        }
      },
      [disabled, processFiles]
    );

    const handleFileInputChange = React.useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const { files: selectedFiles } = e.target;
        if (selectedFiles?.length) {
          processFiles(selectedFiles);
        }
        // Reset input value to allow selecting the same file again
        e.target.value = '';
      },
      [processFiles]
    );

    const handleClick = React.useCallback(() => {
      if (!disabled) {
        fileInputRef.current?.click();
      }
    }, [disabled]);

    // Cleanup preview URLs on unmount
    React.useEffect(() => {
      return () => {
        files.forEach(file => {
          if (file.preview) {
            URL.revokeObjectURL(file.preview);
          }
        });
      };
    }, []);

    const contextValue = React.useMemo(
      () => ({
        files,
        isDragActive,
        isUploading,
        error,
        removeFile,
        clearFiles,
      }),
      [files, isDragActive, isUploading, error, removeFile, clearFiles]
    );

    const currentVariant = error ? 'error' : isDragActive ? 'active' : variant;

    return (
      <DropzoneContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(
            dropzoneVariants({ variant: currentVariant, size, className }),
            disabled && "cursor-not-allowed opacity-50",
            !disabled && "cursor-pointer"
          )}
          onDragEnter={handleDragEnter}
          onDragLeave={handleDragLeave}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
          onClick={handleClick}
          {...props}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            multiple={multiple}
            onChange={handleFileInputChange}
            disabled={disabled}
            className="sr-only"
          />
          {children}
        </div>
      </DropzoneContext.Provider>
    );
  }
);

Dropzone.displayName = "Dropzone";

// Dropzone Content
interface DropzoneContentProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropzoneContent = React.forwardRef<HTMLDivElement, DropzoneContentProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DropzoneContext);
    
    if (!context) {
      throw new Error("DropzoneContent must be used within a Dropzone");
    }

    const { files, isDragActive, error } = context;

    if (files.length > 0) {
      return (
        <div ref={ref} className={cn("w-full", className)} {...props}>
          <DropzoneFileList />
        </div>
      );
    }

    return (
      <div
        ref={ref}
        className={cn("flex flex-col items-center justify-center text-center", className)}
        {...props}
      >
        {error ? (
          <DropzoneError />
        ) : isDragActive ? (
          <DropzoneActive />
        ) : (
          children || <DropzoneEmpty />
        )}
      </div>
    );
  }
);

DropzoneContent.displayName = "DropzoneContent";

// Dropzone Empty State
interface DropzoneEmptyProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropzoneEmpty = React.forwardRef<HTMLDivElement, DropzoneEmptyProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col items-center gap-2", className)} {...props}>
        <Upload className="h-8 w-8 text-muted-foreground" />
        {children || (
          <>
            <div className="text-sm font-medium">Upload files</div>
            <div className="text-xs text-muted-foreground">
              Drag and drop or click to upload
            </div>
          </>
        )}
      </div>
    );
  }
);

DropzoneEmpty.displayName = "DropzoneEmpty";

// Dropzone Active State
interface DropzoneActiveProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropzoneActive = React.forwardRef<HTMLDivElement, DropzoneActiveProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("flex flex-col items-center gap-2", className)} {...props}>
        <Upload className="h-8 w-8 text-primary animate-bounce" />
        {children || (
          <div className="text-sm font-medium text-primary">Drop files here</div>
        )}
      </div>
    );
  }
);

DropzoneActive.displayName = "DropzoneActive";

// Dropzone Error State
interface DropzoneErrorProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropzoneError = React.forwardRef<HTMLDivElement, DropzoneErrorProps>(
  ({ className, children, ...props }, ref) => {
    const context = React.useContext(DropzoneContext);
    
    if (!context) {
      throw new Error("DropzoneError must be used within a Dropzone");
    }

    const { error } = context;

    return (
      <div ref={ref} className={cn("flex flex-col items-center gap-2", className)} {...props}>
        <X className="h-8 w-8 text-destructive" />
        {children || (
          <div className="text-sm font-medium text-destructive">{error}</div>
        )}
      </div>
    );
  }
);

DropzoneError.displayName = "DropzoneError";

// Dropzone File List
interface DropzoneFileListProps extends React.HTMLAttributes<HTMLDivElement> {}

const DropzoneFileList = React.forwardRef<HTMLDivElement, DropzoneFileListProps>(
  ({ className, ...props }, ref) => {
    const context = React.useContext(DropzoneContext);
    
    if (!context) {
      throw new Error("DropzoneFileList must be used within a Dropzone");
    }

    const { files } = context;

    return (
      <div ref={ref} className={cn("space-y-2", className)} {...props}>
        {files.map((file, index) => (
          <DropzoneFileItem key={`${file.name}-${index}`} file={file} index={index} />
        ))}
      </div>
    );
  }
);

DropzoneFileList.displayName = "DropzoneFileList";

// Dropzone File Item
interface DropzoneFileItemProps extends React.HTMLAttributes<HTMLDivElement> {
  file: DropzoneFile;
  index: number;
}

const DropzoneFileItem = React.forwardRef<HTMLDivElement, DropzoneFileItemProps>(
  ({ className, file, index, ...props }, ref) => {
    const context = React.useContext(DropzoneContext);
    
    if (!context) {
      throw new Error("DropzoneFileItem must be used within a Dropzone");
    }

    const { removeFile } = context;

    const getFileIcon = (file: File) => {
      if (file.type.startsWith('image/')) {
        return <ImageIcon className="h-4 w-4" />;
      }
      if (file.type.includes('text/') || file.type.includes('application/json')) {
        return <FileText className="h-4 w-4" />;
      }
      return <File className="h-4 w-4" />;
    };

    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center gap-3 rounded-md border p-3",
          file.error && "border-destructive bg-destructive/5",
          className
        )}
        {...props}
      >
        {file.preview ? (
          <img
            src={file.preview}
            alt={file.name}
            className="h-10 w-10 rounded object-cover"
          />
        ) : (
          <div className="flex h-10 w-10 items-center justify-center rounded bg-muted">
            {getFileIcon(file)}
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="truncate text-sm font-medium">{file.name}</div>
          <div className="text-xs text-muted-foreground">
            {formatFileSize(file.size)}
          </div>
          {file.error && (
            <div className="text-xs text-destructive">{file.error}</div>
          )}
        </div>
        
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            removeFile(index);
          }}
          className="flex h-6 w-6 items-center justify-center rounded-full hover:bg-muted"
        >
          <X className="h-3 w-3" />
        </button>
      </div>
    );
  }
);

DropzoneFileItem.displayName = "DropzoneFileItem";

// Utility function to format file sizes
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

// Hook for accessing dropzone context
const useDropzone = () => {
  const context = React.useContext(DropzoneContext);
  if (!context) {
    throw new Error("useDropzone must be used within a Dropzone component");
  }
  return context;
};

export {
  Dropzone,
  DropzoneContent,
  DropzoneEmpty,
  DropzoneActive,
  DropzoneError,
  DropzoneFileList,
  DropzoneFileItem,
  useDropzone,
  dropzoneVariants,
  formatFileSize,
};

export type {
  DropzoneProps,
  DropzoneContentProps,
  DropzoneEmptyProps,
  DropzoneActiveProps,
  DropzoneErrorProps,
  DropzoneFileListProps,
  DropzoneFileItemProps,
  DropzoneFile,
  DropzoneContextValue,
};
