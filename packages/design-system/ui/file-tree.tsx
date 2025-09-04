/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { 
  ChevronRight, 
  ChevronDown, 
  Folder, 
  FolderOpen, 
  File, 
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  FileCode,
  FileArchive,
  MoreHorizontal,
  Plus,
  Search
} from "lucide-react";
import { cn } from "../lib/utils";

const fileTreeVariants = cva(
  "w-full bg-background border rounded-lg overflow-hidden",
  {
    variants: {
      variant: {
        default: "border-border",
        ghost: "border-transparent bg-transparent",
        outline: "border-2 border-dashed",
      },
      size: {
        sm: "text-sm",
        md: "text-base",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  }
);

interface FileTreeItem {
  id: string;
  name: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: Date;
  children?: FileTreeItem[];
  icon?: React.ReactNode;
  metadata?: Record<string, any>;
}

interface FileTreeContextValue {
  expandedItems: Set<string>;
  selectedItems: Set<string>;
  toggleExpanded: (id: string) => void;
  toggleSelected: (id: string, multiSelect?: boolean) => void;
  selectItem: (id: string) => void;
  deselectItem: (id: string) => void;
  clearSelection: () => void;
  onItemClick?: (item: FileTreeItem) => void;
  onItemDoubleClick?: (item: FileTreeItem) => void;
  onItemContextMenu?: (item: FileTreeItem, event: React.MouseEvent) => void;
  multiSelect: boolean;
  showIcons: boolean;
  showSize: boolean;
  showModified: boolean;
}

const FileTreeContext = React.createContext<FileTreeContextValue | null>(null);

interface FileTreeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof fileTreeVariants> {
  data: FileTreeItem[];
  multiSelect?: boolean;
  showIcons?: boolean;
  showSize?: boolean;
  showModified?: boolean;
  defaultExpanded?: string[];
  defaultSelected?: string[];
  onItemClick?: (item: FileTreeItem) => void;
  onItemDoubleClick?: (item: FileTreeItem) => void;
  onItemContextMenu?: (item: FileTreeItem, event: React.MouseEvent) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
}

const FileTree = React.forwardRef<HTMLDivElement, FileTreeProps>(
  (
    {
      className,
      variant,
      size,
      data,
      multiSelect = false,
      showIcons = true,
      showSize = false,
      showModified = false,
      defaultExpanded = [],
      defaultSelected = [],
      onItemClick,
      onItemDoubleClick,
      onItemContextMenu,
      onSelectionChange,
      children,
      ...props
    },
    ref
  ) => {
    const [expandedItems, setExpandedItems] = React.useState(
      new Set(defaultExpanded)
    );
    const [selectedItems, setSelectedItems] = React.useState(
      new Set(defaultSelected)
    );

    const toggleExpanded = React.useCallback((id: string) => {
      setExpandedItems(prev => {
        const newSet = new Set(prev);
        if (newSet.has(id)) {
          newSet.delete(id);
        } else {
          newSet.add(id);
        }
        return newSet;
      });
    }, []);

    const toggleSelected = React.useCallback(
      (id: string, multiSelectOverride?: boolean) => {
        const shouldMultiSelect = multiSelectOverride ?? multiSelect;
        
        setSelectedItems(prev => {
          const newSet = shouldMultiSelect ? new Set(prev) : new Set<string>();
          
          if (prev.has(id) && shouldMultiSelect) {
            newSet.delete(id);
          } else {
            newSet.add(id);
          }
          
          onSelectionChange?.(Array.from(newSet));
          return newSet;
        });
      },
      [multiSelect, onSelectionChange]
    );

    const selectItem = React.useCallback(
      (id: string) => {
        setSelectedItems(prev => {
          const newSet = new Set<string>(prev);
          newSet.add(id);
          onSelectionChange?.(Array.from(newSet));
          return newSet;
        });
      },
      [onSelectionChange]
    );

    const deselectItem = React.useCallback(
      (id: string) => {
        setSelectedItems(prev => {
          const newSet = new Set<string>(prev);
          newSet.delete(id);
          onSelectionChange?.(Array.from(newSet));
          return newSet;
        });
      },
      [onSelectionChange]
    );

    const clearSelection = React.useCallback(() => {
      setSelectedItems(new Set<string>());
      onSelectionChange?.([]);
    }, [onSelectionChange]);

    const contextValue = React.useMemo(
      () => ({
        expandedItems,
        selectedItems,
        toggleExpanded,
        toggleSelected,
        selectItem,
        deselectItem,
        clearSelection,
        onItemClick,
        onItemDoubleClick,
        onItemContextMenu,
        multiSelect,
        showIcons,
        showSize,
        showModified,
      }),
      [
        expandedItems,
        selectedItems,
        toggleExpanded,
        toggleSelected,
        selectItem,
        deselectItem,
        clearSelection,
        onItemClick,
        onItemDoubleClick,
        onItemContextMenu,
        multiSelect,
        showIcons,
        showSize,
        showModified,
      ]
    );

    return (
      <FileTreeContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(fileTreeVariants({ variant, size, className }))}
          {...props}
        >
          {children}
        </div>
      </FileTreeContext.Provider>
    );
  }
);

FileTree.displayName = "FileTree";

// File Tree Content
interface FileTreeContentProps extends React.HTMLAttributes<HTMLDivElement> {
  data: FileTreeItem[];
}

const FileTreeContent = React.forwardRef<HTMLDivElement, FileTreeContentProps>(
  ({ className, data, ...props }, ref) => {
    const renderItems = (items: FileTreeItem[], level = 0) => {
      return items.map((item) => (
        <FileTreeItem key={item.id} item={item} level={level} />
      ));
    };

    return (
      <div ref={ref} className={cn("p-2", className)} {...props}>
        {renderItems(data)}
      </div>
    );
  }
);

FileTreeContent.displayName = "FileTreeContent";

// File Tree Item
interface FileTreeItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: FileTreeItem;
  level: number;
}

const FileTreeItem = React.forwardRef<HTMLDivElement, FileTreeItemProps>(
  ({ className, item, level, ...props }, ref) => {
    const context = React.useContext(FileTreeContext);

    if (!context) {
      throw new Error("FileTreeItem must be used within a FileTree");
    }

    const {
      expandedItems,
      selectedItems,
      toggleExpanded,
      toggleSelected,
      onItemClick,
      onItemDoubleClick,
      onItemContextMenu,
      multiSelect,
      showIcons,
      showSize,
      showModified,
    } = context;

    const isExpanded = expandedItems.has(item.id);
    const isSelected = selectedItems.has(item.id);
    const hasChildren = item.children && item.children.length > 0;

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      
      if (e.ctrlKey || e.metaKey) {
        toggleSelected(item.id, true);
      } else if (e.shiftKey && multiSelect) {
        // Handle shift+click for range selection
        toggleSelected(item.id, true);
      } else {
        toggleSelected(item.id, false);
      }
      
      onItemClick?.(item);
    };

    const handleDoubleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      if (item.type === 'folder' && hasChildren) {
        toggleExpanded(item.id);
      }
      onItemDoubleClick?.(item);
    };

    const handleContextMenu = (e: React.MouseEvent) => {
      e.preventDefault();
      onItemContextMenu?.(item, e);
    };

    const handleExpandClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (item.type === 'folder') {
        toggleExpanded(item.id);
      }
    };

    const getFileIcon = (item: FileTreeItem) => {
      if (item.icon) return item.icon;
      
      if (item.type === 'folder') {
        return isExpanded ? <FolderOpen className="h-4 w-4" /> : <Folder className="h-4 w-4" />;
      }

      // Determine file type by extension
      const extension = item.name.split('.').pop()?.toLowerCase();
      
      switch (extension) {
        case 'jpg':
        case 'jpeg':
        case 'png':
        case 'gif':
        case 'svg':
        case 'webp':
          return <FileImage className="h-4 w-4" />;
        case 'mp4':
        case 'avi':
        case 'mov':
        case 'wmv':
          return <FileVideo className="h-4 w-4" />;
        case 'mp3':
        case 'wav':
        case 'flac':
        case 'aac':
          return <FileAudio className="h-4 w-4" />;
        case 'js':
        case 'ts':
        case 'jsx':
        case 'tsx':
        case 'html':
        case 'css':
        case 'scss':
        case 'json':
        case 'xml':
        case 'py':
        case 'java':
        case 'cpp':
        case 'c':
          return <FileCode className="h-4 w-4" />;
        case 'zip':
        case 'rar':
        case 'tar':
        case 'gz':
          return <FileArchive className="h-4 w-4" />;
        case 'txt':
        case 'md':
        case 'doc':
        case 'docx':
        case 'pdf':
          return <FileText className="h-4 w-4" />;
        default:
          return <File className="h-4 w-4" />;
      }
    };

    const formatFileSize = (bytes: number) => {
      const units = ['B', 'KB', 'MB', 'GB'];
      let size = bytes;
      let unitIndex = 0;
      
      while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024;
        unitIndex++;
      }
      
      return `${size.toFixed(1)} ${units[unitIndex]}`;
    };

    const formatDate = (date: Date) => {
      return date.toLocaleDateString();
    };

    return (
      <div ref={ref} className={className} {...props}>
        <div
          className={cn(
            "flex items-center gap-1 px-2 py-1 rounded cursor-pointer hover:bg-muted/50 transition-colors",
            isSelected && "bg-primary/10 text-primary",
            "group"
          )}
          style={{ paddingLeft: `${level * 16 + 8}px` }}
          onClick={handleClick}
          onDoubleClick={handleDoubleClick}
          onContextMenu={handleContextMenu}
        >
          {/* Expand/Collapse Button */}
          {item.type === 'folder' ? (
            <button
              onClick={handleExpandClick}
              className="flex items-center justify-center w-4 h-4 hover:bg-muted rounded transition-colors"
            >
              {hasChildren ? (
                isExpanded ? (
                  <ChevronDown className="h-3 w-3" />
                ) : (
                  <ChevronRight className="h-3 w-3" />
                )
              ) : null}
            </button>
          ) : (
            <div className="w-4" />
          )}

          {/* Icon */}
          {showIcons && (
            <div className="flex items-center justify-center w-4 h-4 text-muted-foreground">
              {getFileIcon(item)}
            </div>
          )}

          {/* Name */}
          <span className="flex-1 truncate text-sm">{item.name}</span>

          {/* Size */}
          {showSize && item.size && (
            <span className="text-xs text-muted-foreground">
              {formatFileSize(item.size)}
            </span>
          )}

          {/* Modified Date */}
          {showModified && item.modified && (
            <span className="text-xs text-muted-foreground">
              {formatDate(item.modified)}
            </span>
          )}

          {/* Actions */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button className="p-1 hover:bg-muted rounded">
              <MoreHorizontal className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Children */}
        {item.type === 'folder' && hasChildren && isExpanded && (
          <div>
            {item.children!.map((child) => (
              <FileTreeItem key={child.id} item={child} level={level + 1} />
            ))}
          </div>
        )}
      </div>
    );
  }
);

FileTreeItem.displayName = "FileTreeItem";

// File Tree Header
interface FileTreeHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const FileTreeHeader = React.forwardRef<HTMLDivElement, FileTreeHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "flex items-center justify-between p-3 border-b bg-muted/30",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FileTreeHeader.displayName = "FileTreeHeader";

// File Tree Search
interface FileTreeSearchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onSearch?: (query: string) => void;
}

const FileTreeSearch = React.forwardRef<HTMLInputElement, FileTreeSearchProps>(
  ({ className, onSearch, ...props }, ref) => {
    const [query, setQuery] = React.useState("");

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setQuery(value);
      onSearch?.(value);
    };

    return (
      <div className="relative">
        <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={ref}
          type="text"
          value={query}
          onChange={handleChange}
          className={cn(
            "w-full pl-8 pr-3 py-1 text-sm bg-background border rounded focus:outline-none focus:ring-2 focus:ring-primary",
            className
          )}
          placeholder="Search files..."
          {...props}
        />
      </div>
    );
  }
);

FileTreeSearch.displayName = "FileTreeSearch";

// File Tree Actions
interface FileTreeActionsProps extends React.HTMLAttributes<HTMLDivElement> {}

const FileTreeActions = React.forwardRef<HTMLDivElement, FileTreeActionsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex items-center gap-1", className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

FileTreeActions.displayName = "FileTreeActions";

// File Tree Button
interface FileTreeButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "ghost";
  size?: "sm" | "md";
}

const FileTreeButton = React.forwardRef<HTMLButtonElement, FileTreeButtonProps>(
  ({ className, variant = "ghost", size = "sm", children, ...props }, ref) => {
    const variants = {
      default: "bg-primary text-primary-foreground hover:bg-primary/90",
      ghost: "hover:bg-muted text-muted-foreground hover:text-foreground",
    };

    const sizes = {
      sm: "p-1 text-xs",
      md: "px-2 py-1 text-sm",
    };

    return (
      <button
        ref={ref}
        className={cn(
          "rounded transition-colors",
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

FileTreeButton.displayName = "FileTreeButton";

// Hook for accessing file tree context
const useFileTree = () => {
  const context = React.useContext(FileTreeContext);
  if (!context) {
    throw new Error("useFileTree must be used within a FileTree component");
  }
  return context;
};

// Utility functions
const filterTreeData = (data: FileTreeItem[], query: string): FileTreeItem[] => {
  if (!query) return data;
  
  const filterItem = (item: FileTreeItem): FileTreeItem | null => {
    const matchesQuery = item.name.toLowerCase().includes(query.toLowerCase());
    const filteredChildren = item.children
      ? item.children.map(filterItem).filter(Boolean) as FileTreeItem[]
      : [];

    if (matchesQuery || filteredChildren.length > 0) {
      return {
        ...item,
        children: filteredChildren,
      };
    }

    return null;
  };

  return data.map(filterItem).filter(Boolean) as FileTreeItem[];
};

const flattenTreeData = (data: FileTreeItem[]): FileTreeItem[] => {
  const result: FileTreeItem[] = [];
  
  const flatten = (items: FileTreeItem[]) => {
    items.forEach(item => {
      result.push(item);
      if (item.children) {
        flatten(item.children);
      }
    });
  };
  
  flatten(data);
  return result;
};

const findItemById = (data: FileTreeItem[], id: string): FileTreeItem | null => {
  for (const item of data) {
    if (item.id === id) return item;
    if (item.children) {
      const found = findItemById(item.children, id);
      if (found) return found;
    }
  }
  return null;
};

export {
  FileTree,
  FileTreeContent,
  FileTreeItem,
  FileTreeHeader,
  FileTreeSearch,
  FileTreeActions,
  FileTreeButton,
  useFileTree,
  filterTreeData,
  flattenTreeData,
  findItemById,
  fileTreeVariants,
};

export type {
  FileTreeProps,
  FileTreeContentProps,
  FileTreeItemProps,
  FileTreeHeaderProps,
  FileTreeSearchProps,
  FileTreeActionsProps,
  FileTreeButtonProps,
  FileTreeItem as FileTreeItemType,
  FileTreeContextValue,
};
