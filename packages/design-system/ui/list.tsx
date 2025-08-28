/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';
import { Plus, MoreHorizontal, X, GripVertical } from 'lucide-react';

// List variants
const listVariants = cva(
  'space-y-4',
  {
    variants: {
      variant: {
        default: 'bg-background',
        ghost: 'bg-transparent',
        outline: 'border border-border rounded-lg p-4',
      },
      size: {
        sm: 'text-sm space-y-2',
        md: 'text-base space-y-4',
        lg: 'text-lg space-y-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const listGroupVariants = cva(
  'space-y-2',
  {
    variants: {
      variant: {
        default: 'bg-muted/50 rounded-lg p-4',
        ghost: 'bg-transparent',
        outline: 'border border-border rounded-lg p-4',
      },
      size: {
        sm: 'p-2 space-y-1',
        md: 'p-4 space-y-2',
        lg: 'p-6 space-y-3',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const listItemVariants = cva(
  'flex items-center gap-3 p-3 bg-card border border-border rounded-lg cursor-grab active:cursor-grabbing transition-all hover:shadow-sm',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        ghost: 'bg-transparent border-transparent',
        outline: 'bg-transparent border-border',
      },
      size: {
        sm: 'p-2 text-sm gap-2',
        md: 'p-3 text-base gap-3',
        lg: 'p-4 text-lg gap-4',
      },
      priority: {
        low: 'border-l-4 border-l-green-500',
        medium: 'border-l-4 border-l-yellow-500',
        high: 'border-l-4 border-l-red-500',
        none: '',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
      priority: 'none',
    },
  }
);

// Types
interface ListItem {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
  dueDate?: Date;
  completed?: boolean;
  color?: string;
}

interface ListGroup {
  id: string;
  title: string;
  items: ListItem[];
  color?: string;
  collapsible?: boolean;
  collapsed?: boolean;
}

interface ListData {
  groups: ListGroup[];
}

interface ListContextType {
  data: ListData;
  setData: React.Dispatch<React.SetStateAction<ListData>>;
  onItemMove?: (itemId: string, sourceGroupId: string, destinationGroupId: string, destinationIndex: number) => void;
  onItemAdd?: (groupId: string, item: Omit<ListItem, 'id'>) => void;
  onItemEdit?: (itemId: string, updates: Partial<ListItem>) => void;
  onItemDelete?: (itemId: string, groupId: string) => void;
  onItemToggle?: (itemId: string, groupId: string) => void;
  onGroupAdd?: (group: Omit<ListGroup, 'id' | 'items'>) => void;
  onGroupEdit?: (groupId: string, updates: Partial<Omit<ListGroup, 'id' | 'items'>>) => void;
  onGroupDelete?: (groupId: string) => void;
  onGroupToggle?: (groupId: string) => void;
  readonly?: boolean;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
}

const ListContext = React.createContext<ListContextType | undefined>(undefined);

export const useList = () => {
  const context = React.useContext(ListContext);
  if (context === undefined) {
    throw new Error('useList must be used within a ListProvider');
  }
  return context;
};

// Main List component
export interface ListProps 
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof listVariants> {
  data: ListData;
  onItemMove?: (itemId: string, sourceGroupId: string, destinationGroupId: string, destinationIndex: number) => void;
  onItemAdd?: (groupId: string, item: Omit<ListItem, 'id'>) => void;
  onItemEdit?: (itemId: string, updates: Partial<ListItem>) => void;
  onItemDelete?: (itemId: string, groupId: string) => void;
  onItemToggle?: (itemId: string, groupId: string) => void;
  onGroupAdd?: (group: Omit<ListGroup, 'id' | 'items'>) => void;
  onGroupEdit?: (groupId: string, updates: Partial<Omit<ListGroup, 'id' | 'items'>>) => void;
  onGroupDelete?: (groupId: string) => void;
  onGroupToggle?: (groupId: string) => void;
  readonly?: boolean;
  children?: React.ReactNode;
}

const List = React.forwardRef<HTMLDivElement, ListProps>(
  ({ 
    className, 
    variant, 
    size, 
    data: initialData,
    onItemMove,
    onItemAdd,
    onItemEdit,
    onItemDelete,
    onItemToggle,
    onGroupAdd,
    onGroupEdit,
    onGroupDelete,
    onGroupToggle,
    readonly = false,
    children,
    ...props 
  }, ref) => {
    const [data, setData] = React.useState<ListData>(initialData);

    React.useEffect(() => {
      setData(initialData);
    }, [initialData]);

    const contextValue: ListContextType = {
      data,
      setData,
      onItemMove,
      onItemAdd,
      onItemEdit,
      onItemDelete,
      onItemToggle,
      onGroupAdd,
      onGroupEdit,
      onGroupDelete,
      onGroupToggle,
      readonly,
      variant: variant || 'default',
      size: size || 'md',
    };

    return (
      <ListContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(listVariants({ variant, size }), className)}
          {...props}
        >
          {children || <ListContainer />}
        </div>
      </ListContext.Provider>
    );
  }
);

List.displayName = 'List';

// List Container component
export interface ListContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListContainer = React.forwardRef<HTMLDivElement, ListContainerProps>(
  ({ className, ...props }, ref) => {
    const { data } = useList();

    return (
      <div ref={ref} className={cn('space-y-4', className)} {...props}>
        {data.groups.map((group) => (
          <ListGroup key={group.id} group={group} />
        ))}
        <ListAddGroup />
      </div>
    );
  }
);

ListContainer.displayName = 'ListContainer';

// List Group component
export interface ListGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  group: {
    id: string;
    title: string;
    items: Array<{
      id: string;
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      assignee?: string;
      tags?: string[];
      dueDate?: Date;
      completed?: boolean;
      color?: string;
    }>;
    color?: string;
    collapsible?: boolean;
    collapsed?: boolean;
  };
}

const ListGroup = React.forwardRef<HTMLDivElement, ListGroupProps>(
  ({ className, group, ...props }, ref) => {
    const { variant, size, readonly, onItemMove, data } = useList();
    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      if (readonly) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      // Only set isDragOver to false if we're leaving the group container
      if (!e.currentTarget.contains(e.relatedTarget as Node)) {
        setIsDragOver(false);
      }
    };

    const handleDrop = (e: React.DragEvent) => {
      if (readonly) return;
      e.preventDefault();
      setIsDragOver(false);
      
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { itemId: draggedItemId, sourceGroupId } = dragData;
        
        // Drop at the end of the group
        onItemMove?.(draggedItemId, sourceGroupId, group.id, group.items.length);
      } catch (error) {
        console.error('Failed to parse drag data:', error);
      }
    };

    return (
      <div
        ref={ref}
        className={cn(
          listGroupVariants({ variant, size }),
          isDragOver && !readonly && 'ring-2 ring-primary ring-opacity-50',
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        {...props}
      >
        <ListGroupHeader group={group} />
        {!group.collapsed && (
          <div className="space-y-2">
            {group.items.length === 0 && !readonly ? (
              <div className={cn(
                'p-8 border-2 border-dashed border-muted-foreground/25 rounded-lg text-center text-muted-foreground',
                isDragOver && 'border-primary bg-primary/5'
              )}>
                Drop items here
              </div>
            ) : (
              group.items.map((item, index) => (
                <ListItem key={item.id} item={item} groupId={group.id} />
              ))
            )}
            {!readonly && <ListAddItem groupId={group.id} />}
          </div>
        )}
      </div>
    );
  }
);

ListGroup.displayName = 'ListGroup';

// List Group Header component
export interface ListGroupHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  group: {
    id: string;
    title: string;
    items: Array<{
      id: string;
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      assignee?: string;
      tags?: string[];
      dueDate?: Date;
      completed?: boolean;
      color?: string;
    }>;
    color?: string;
    collapsible?: boolean;
    collapsed?: boolean;
  };
}

const ListGroupHeader = React.forwardRef<HTMLDivElement, ListGroupHeaderProps>(
  ({ className, group, ...props }, ref) => {
    const { readonly, onGroupEdit, onGroupDelete, onGroupToggle } = useList();

    const completedCount = group.items.filter(item => item.completed).length;

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between', className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          {group.color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: group.color }}
            />
          )}
          <h3 className="font-semibold">{group.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {completedCount}/{group.items.length}
          </span>
        </div>
        <div className="flex items-center gap-1">
          {group.collapsible && (
            <button
              className="p-1 hover:bg-muted rounded text-xs"
              onClick={() => onGroupToggle?.(group.id)}
            >
              {group.collapsed ? 'Show' : 'Hide'}
            </button>
          )}
          {!readonly && (
            <button
              className="p-1 hover:bg-muted rounded"
              onClick={() => onGroupEdit?.(group.id, {})}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

ListGroupHeader.displayName = 'ListGroupHeader';

// List Item component
export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  item: {
    id: string;
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
    tags?: string[];
    dueDate?: Date;
    completed?: boolean;
    color?: string;
  };
  groupId: string;
}

const ListItem = React.forwardRef<HTMLDivElement, ListItemProps>(
  ({ className, item, groupId, ...props }, ref) => {
    const { variant, size, readonly, onItemEdit, onItemDelete, onItemToggle, onItemMove, data } = useList();
    const [isDragging, setIsDragging] = React.useState(false);
    const [dragOverPosition, setDragOverPosition] = React.useState<'top' | 'bottom' | null>(null);

    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };

    const handleDragStart = (e: React.DragEvent) => {
      if (readonly) return;
      setIsDragging(true);
      e.dataTransfer.setData('text/plain', JSON.stringify({ itemId: item.id, sourceGroupId: groupId }));
      e.dataTransfer.effectAllowed = 'move';
    };

    const handleDragEnd = () => {
      setIsDragging(false);
      setDragOverPosition(null);
    };

    const handleDragOver = (e: React.DragEvent) => {
      if (readonly) return;
      e.preventDefault();
      e.dataTransfer.dropEffect = 'move';
      
      const rect = e.currentTarget.getBoundingClientRect();
      const midpoint = rect.top + rect.height / 2;
      setDragOverPosition(e.clientY < midpoint ? 'top' : 'bottom');
    };

    const handleDragLeave = () => {
      setDragOverPosition(null);
    };

    const handleDrop = (e: React.DragEvent) => {
      if (readonly) return;
      e.preventDefault();
      setDragOverPosition(null);
      
      try {
        const dragData = JSON.parse(e.dataTransfer.getData('text/plain'));
        const { itemId: draggedItemId, sourceGroupId } = dragData;
        
        if (draggedItemId === item.id) return; // Can't drop on itself
        
        // Find the current group and item index
        const currentGroup = data.groups.find(g => g.id === groupId);
        if (!currentGroup) return;
        
        const currentItemIndex = currentGroup.items.findIndex(i => i.id === item.id);
        const targetIndex = dragOverPosition === 'top' ? currentItemIndex : currentItemIndex + 1;
        
        onItemMove?.(draggedItemId, sourceGroupId, groupId, targetIndex);
      } catch (error) {
        console.error('Failed to parse drag data:', error);
      }
    };

    return (
      <div
        ref={ref}
        draggable={!readonly}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          listItemVariants({ 
            variant, 
            size, 
            priority: item.priority || 'none' 
          }),
          item.completed && 'opacity-60',
          isDragging && 'opacity-50 transform rotate-2',
          dragOverPosition === 'top' && 'border-t-2 border-t-primary',
          dragOverPosition === 'bottom' && 'border-b-2 border-b-primary',
          'relative group',
          className
        )}
        {...props}
      >
        {!readonly && (
          <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {!readonly && (
                  <input
                    type="checkbox"
                    checked={item.completed || false}
                    onChange={() => onItemToggle?.(item.id, groupId)}
                    className="rounded border-border"
                  />
                )}
                <h4 className={cn(
                  'font-medium',
                  item.completed && 'line-through text-muted-foreground'
                )}>
                  {item.title}
                </h4>
              </div>
              {item.description && (
                <p className="text-sm text-muted-foreground mt-1">
                  {item.description}
                </p>
              )}
            </div>
            {!readonly && (
              <button
                className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-opacity"
                onClick={() => onItemDelete?.(item.id, groupId)}
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {(item.tags || item.priority || item.assignee || item.dueDate) && (
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {item.priority && (
                <span
                  className={cn(
                    'text-xs px-2 py-1 rounded-full font-medium',
                    priorityColors[item.priority]
                  )}
                >
                  {item.priority}
                </span>
              )}
              {item.tags?.map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
                >
                  {tag}
                </span>
              ))}
              {item.assignee && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                    {item.assignee.charAt(0).toUpperCase()}
                  </div>
                  <span>{item.assignee}</span>
                </div>
              )}
              {item.dueDate && (
                <span className="text-xs text-muted-foreground">
                  Due {item.dueDate.toLocaleDateString()}
                </span>
              )}
            </div>
          )}

          {item.color && (
            <div
              className="w-full h-1 rounded-full mt-2"
              style={{ backgroundColor: item.color }}
            />
          )}
        </div>
      </div>
    );
  }
);

ListItem.displayName = 'ListItem';

// Add Item component
export interface ListAddItemProps extends React.HTMLAttributes<HTMLButtonElement> {
  groupId: string;
}

const ListAddItem = React.forwardRef<HTMLButtonElement, ListAddItemProps>(
  ({ className, groupId, ...props }, ref) => {
    const { onItemAdd } = useList();
    const [isAdding, setIsAdding] = React.useState(false);
    const [title, setTitle] = React.useState('');

    const handleAdd = () => {
      if (title.trim()) {
        onItemAdd?.(groupId, { title: title.trim() });
        setTitle('');
        setIsAdding(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAdd();
      } else if (e.key === 'Escape') {
        setTitle('');
        setIsAdding(false);
      }
    };

    if (isAdding) {
      return (
        <div className="p-2 bg-card border border-border rounded-lg">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAdd}
            placeholder="Enter item title..."
            className="w-full p-2 text-sm border-none outline-none bg-transparent"
            autoFocus
          />
        </div>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          'w-full p-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex items-center justify-center gap-2',
          className
        )}
        onClick={() => setIsAdding(true)}
        {...props}
      >
        <Plus className="h-4 w-4" />
        Add item
      </button>
    );
  }
);

ListAddItem.displayName = 'ListAddItem';

// Add Group component
export interface ListAddGroupProps extends React.HTMLAttributes<HTMLButtonElement> {}

const ListAddGroup = React.forwardRef<HTMLButtonElement, ListAddGroupProps>(
  ({ className, ...props }, ref) => {
    const { onGroupAdd, readonly } = useList();
    const [isAdding, setIsAdding] = React.useState(false);
    const [title, setTitle] = React.useState('');

    if (readonly) return null;

    const handleAdd = () => {
      if (title.trim()) {
        onGroupAdd?.({ title: title.trim() });
        setTitle('');
        setIsAdding(false);
      }
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
      if (e.key === 'Enter') {
        handleAdd();
      } else if (e.key === 'Escape') {
        setTitle('');
        setIsAdding(false);
      }
    };

    if (isAdding) {
      return (
        <div className="p-3 bg-muted/50 rounded-lg">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAdd}
            placeholder="Enter group title..."
            className="w-full p-2 text-sm border border-border rounded bg-background"
            autoFocus
          />
        </div>
      );
    }

    return (
      <button
        ref={ref}
        className={cn(
          'w-full p-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex items-center justify-center gap-2',
          className
        )}
        onClick={() => setIsAdding(true)}
        {...props}
      >
        <Plus className="h-4 w-4" />
        Add group
      </button>
    );
  }
);

ListAddGroup.displayName = 'ListAddGroup';

// Header component
export interface ListHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListHeader = React.forwardRef<HTMLDivElement, ListHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between p-4 border-b', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ListHeader.displayName = 'ListHeader';

// Controls component
export interface ListControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListControls = React.forwardRef<HTMLDivElement, ListControlsProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-center gap-2', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

ListControls.displayName = 'ListControls';

export {
  List,
  ListContainer,
  ListGroup,
  ListGroupHeader,
  ListItem,
  ListAddItem,
  ListAddGroup,
  ListHeader,
  ListControls,
  listVariants,
  listGroupVariants,
  listItemVariants,
  type ListItem as ListItemType,
  type ListGroup as ListGroupType,
  type ListData,
};
