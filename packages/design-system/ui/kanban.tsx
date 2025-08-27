/**
 * SPDX-License-Identifier: MIT
 */

'use client';

import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';
import { Plus, MoreHorizontal, X } from 'lucide-react';

// Kanban variants
const kanbanVariants = cva(
  'flex flex-col w-full gap-4 p-4 overflow-x-auto',
  {
    variants: {
      variant: {
        default: 'bg-background',
        ghost: 'bg-transparent',
        outline: 'border border-border rounded-lg',
      },
      size: {
        sm: 'text-sm gap-2 p-2',
        md: 'text-base gap-4 p-4',
        lg: 'text-lg gap-6 p-6',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const columnVariants = cva(
  'flex flex-col min-w-[280px] max-w-[320px] bg-muted/50 rounded-lg',
  {
    variants: {
      variant: {
        default: 'bg-muted/50',
        ghost: 'bg-transparent',
        outline: 'border border-border',
      },
      size: {
        sm: 'min-w-[240px] max-w-[280px]',
        md: 'min-w-[280px] max-w-[320px]',
        lg: 'min-w-[320px] max-w-[360px]',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const cardVariants = cva(
  'bg-card border border-border rounded-lg p-3 mb-2 shadow-sm cursor-grab active:cursor-grabbing transition-shadow hover:shadow-md',
  {
    variants: {
      variant: {
        default: 'bg-card border-border',
        ghost: 'bg-transparent border-transparent',
        outline: 'bg-transparent border-border',
      },
      size: {
        sm: 'p-2 text-sm',
        md: 'p-3 text-base',
        lg: 'p-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

// Types
interface KanbanCard {
  id: string;
  title: string;
  description?: string;
  priority?: 'low' | 'medium' | 'high';
  assignee?: string;
  tags?: string[];
  dueDate?: Date;
  color?: string;
}

interface KanbanColumn {
  id: string;
  title: string;
  cards: KanbanCard[];
  limit?: number;
  color?: string;
}

interface KanbanData {
  columns: KanbanColumn[];
}

interface KanbanContextType {
  data: KanbanData;
  setData: React.Dispatch<React.SetStateAction<KanbanData>>;
  onCardMove?: (cardId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) => void;
  onCardAdd?: (columnId: string, card: Omit<KanbanCard, 'id'>) => void;
  onCardEdit?: (cardId: string, updates: Partial<KanbanCard>) => void;
  onCardDelete?: (cardId: string, columnId: string) => void;
  onColumnAdd?: (column: Omit<KanbanColumn, 'id' | 'cards'>) => void;
  onColumnEdit?: (columnId: string, updates: Partial<Omit<KanbanColumn, 'id' | 'cards'>>) => void;
  onColumnDelete?: (columnId: string) => void;
  readonly?: boolean;
  variant?: 'default' | 'ghost' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  draggedCard?: KanbanCard | null;
  setDraggedCard: React.Dispatch<React.SetStateAction<KanbanCard | null>>;
  draggedFromColumn?: string | null;
  setDraggedFromColumn: React.Dispatch<React.SetStateAction<string | null>>;
}

const KanbanContext = React.createContext<KanbanContextType | undefined>(undefined);

export const useKanban = () => {
  const context = React.useContext(KanbanContext);
  if (context === undefined) {
    throw new Error('useKanban must be used within a KanbanProvider');
  }
  return context;
};

// Main Kanban component
export interface KanbanProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof kanbanVariants> {
  data: KanbanData;
  onCardMove?: (cardId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) => void;
  onCardAdd?: (columnId: string, card: Omit<KanbanCard, 'id'>) => void;
  onCardEdit?: (cardId: string, updates: Partial<KanbanCard>) => void;
  onCardDelete?: (cardId: string, columnId: string) => void;
  onColumnAdd?: (column: Omit<KanbanColumn, 'id' | 'cards'>) => void;
  onColumnEdit?: (columnId: string, updates: Partial<Omit<KanbanColumn, 'id' | 'cards'>>) => void;
  onColumnDelete?: (columnId: string) => void;
  readonly?: boolean;
  children?: React.ReactNode;
}

const Kanban = React.forwardRef<HTMLDivElement, KanbanProps>(
  ({
    className,
    variant,
    size,
    data: initialData,
    onCardMove,
    onCardAdd,
    onCardEdit,
    onCardDelete,
    onColumnAdd,
    onColumnEdit,
    onColumnDelete,
    readonly = false,
    children,
    ...props
  }, ref) => {
    const [data, setData] = React.useState<KanbanData>(initialData);

    const [draggedCard, setDraggedCard] = React.useState<KanbanCard | null>(null);
    const [draggedFromColumn, setDraggedFromColumn] = React.useState<string | null>(null);

    React.useEffect(() => {
      setData(initialData);
    }, [initialData]);

    const handleCardMove = (cardId: string, sourceColumnId: string, destinationColumnId: string, destinationIndex: number) => {
      if (readonly) return;

      const sourceColumn = data.columns.find(col => col.id === sourceColumnId);
      const destColumn = data.columns.find(col => col.id === destinationColumnId);

      if (!sourceColumn || !destColumn) return;

      const sourceCards = Array.from(sourceColumn.cards);
      const destCards = sourceColumnId === destinationColumnId
        ? sourceCards
        : Array.from(destColumn.cards);

      const cardIndex = sourceCards.findIndex(card => card.id === cardId);
      if (cardIndex === -1) return;

      const [movedCard] = sourceCards.splice(cardIndex, 1);

      if (sourceColumnId === destinationColumnId) {
        sourceCards.splice(destinationIndex, 0, movedCard);
      } else {
        destCards.splice(destinationIndex, 0, movedCard);
      }

      const newData = {
        ...data,
        columns: data.columns.map(col => {
          if (col.id === sourceColumnId) {
            return { ...col, cards: sourceCards };
          }
          if (col.id === destinationColumnId) {
            return { ...col, cards: destCards };
          }
          return col;
        }),
      };

      setData(newData);
      onCardMove?.(cardId, sourceColumnId, destinationColumnId, destinationIndex);
    };

    const contextValue: KanbanContextType = {
      data,
      setData,
      onCardMove: handleCardMove,
      onCardAdd,
      onCardEdit,
      onCardDelete,
      onColumnAdd,
      onColumnEdit,
      onColumnDelete,
      readonly,
      variant: variant || 'default',
      size: size || 'md',
      draggedCard,
      setDraggedCard,
      draggedFromColumn,
      setDraggedFromColumn,
    };

    return (
      <KanbanContext.Provider value={contextValue}>
        <div
          ref={ref}
          className={cn(kanbanVariants({ variant, size }), className)}
          {...props}
        >
          {children || <KanbanBoard />}
        </div>
      </KanbanContext.Provider>
    );
  }
);

Kanban.displayName = 'Kanban';

// Kanban Board component
export interface KanbanBoardProps extends React.HTMLAttributes<HTMLDivElement> {}

const KanbanBoard = React.forwardRef<HTMLDivElement, KanbanBoardProps>(
  ({ className, ...props }, ref) => {
    const { data } = useKanban();

    return (
      <div ref={ref} className={cn('flex gap-4', className)} {...props}>
        {data.columns.map((column) => (
          <KanbanColumn key={column.id} column={column} />
        ))}
        <KanbanAddColumn />
      </div>
    );
  }
);

KanbanBoard.displayName = 'KanbanBoard';

// Kanban Column component
export interface KanbanColumnProps extends React.HTMLAttributes<HTMLDivElement> {
  column: {
    id: string;
    title: string;
    cards: Array<{
      id: string;
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      assignee?: string;
      tags?: string[];
      dueDate?: Date;
      color?: string;
    }>;
    limit?: number;
    color?: string;
  };
}

const KanbanColumn = React.forwardRef<HTMLDivElement, KanbanColumnProps>(
  ({ className, column, ...props }, ref) => {
    const { variant, size, readonly, draggedCard, setDraggedCard, draggedFromColumn, setDraggedFromColumn, onCardMove } = useKanban();
    const [isDragOver, setIsDragOver] = React.useState(false);

    const handleDragOver = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);
    };

    const handleDrop = (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      if (!draggedCard || !draggedFromColumn || readonly) return;

      const dropY = e.clientY;
      const columnElement = e.currentTarget as HTMLElement;
      const cardElements = Array.from(columnElement.querySelectorAll('[data-card-id]'));

      let insertIndex = column.cards.length;

      for (let i = 0; i < cardElements.length; i++) {
        const cardElement = cardElements[i] as HTMLElement;
        const rect = cardElement.getBoundingClientRect();
        const cardMiddle = rect.top + rect.height / 2;

        if (dropY < cardMiddle) {
          insertIndex = i;
          break;
        }
      }

      onCardMove?.(draggedCard.id, draggedFromColumn, column.id, insertIndex);
      setDraggedCard(null);
      setDraggedFromColumn(null);
    };

    return (
      <div
        ref={ref}
        className={cn(columnVariants({ variant, size }), className)}
        {...props}
      >
        <KanbanColumnHeader column={column} />
        <div
          className={cn(
            "flex-1 p-2 min-h-[200px] transition-colors",
            isDragOver && "bg-muted/70"
          )}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          {column.cards.map((card, index) => (
            <KanbanCard key={card.id} card={card} columnId={column.id} />
          ))}
          {!readonly && <KanbanAddCard columnId={column.id} />}
        </div>
      </div>
    );
  }
);

KanbanColumn.displayName = 'KanbanColumn';

// Kanban Column Header component
export interface KanbanColumnHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  column: {
    id: string;
    title: string;
    cards: Array<{
      id: string;
      title: string;
      description?: string;
      priority?: 'low' | 'medium' | 'high';
      assignee?: string;
      tags?: string[];
      dueDate?: Date;
      color?: string;
    }>;
    limit?: number;
    color?: string;
  };
}

const KanbanColumnHeader = React.forwardRef<HTMLDivElement, KanbanColumnHeaderProps>(
  ({ className, column, ...props }, ref) => {
    const { readonly, onColumnEdit, onColumnDelete } = useKanban();

    return (
      <div
        ref={ref}
        className={cn('flex items-center justify-between p-3 border-b', className)}
        {...props}
      >
        <div className="flex items-center gap-2">
          {column.color && (
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: column.color }}
            />
          )}
          <h3 className="font-semibold">{column.title}</h3>
          <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">
            {column.cards.length}
            {column.limit && `/${column.limit}`}
          </span>
        </div>
        {!readonly && (
          <div className="flex items-center gap-1">
            <button
              className="p-1 hover:bg-muted rounded"
              onClick={() => onColumnEdit?.(column.id, {})}
            >
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    );
  }
);

KanbanColumnHeader.displayName = 'KanbanColumnHeader';

// Kanban Card component
export interface KanbanCardProps extends React.HTMLAttributes<HTMLDivElement> {
  card: {
    id: string;
    title: string;
    description?: string;
    priority?: 'low' | 'medium' | 'high';
    assignee?: string;
    tags?: string[];
    dueDate?: Date;
    color?: string;
  };
  columnId: string;
}

const KanbanCard = React.forwardRef<HTMLDivElement, KanbanCardProps>(
  ({ className, card, columnId, ...props }, ref) => {
    const { variant, size, readonly, onCardEdit, onCardDelete, draggedCard, setDraggedCard, setDraggedFromColumn } = useKanban();
    const [isDragging, setIsDragging] = React.useState(false);

    const priorityColors = {
      low: 'bg-green-100 text-green-800',
      medium: 'bg-yellow-100 text-yellow-800',
      high: 'bg-red-100 text-red-800',
    };

    const handleDragStart = (e: React.DragEvent) => {
      if (readonly) {
        e.preventDefault();
        return;
      }

      setDraggedCard(card);
      setDraggedFromColumn(columnId);
      setIsDragging(true);

      // Set drag data for accessibility
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/plain', card.id);
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    return (
      <div
        ref={ref}
        className={cn(
          cardVariants({ variant, size }),
          'group',
          isDragging && 'opacity-50 rotate-3 shadow-lg',
          draggedCard?.id === card.id && 'opacity-50',
          className
        )}
        draggable={!readonly}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        data-card-id={card.id}
        {...props}
      >
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1">
            <h4 className="font-medium line-clamp-2">{card.title}</h4>
            {card.description && (
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                {card.description}
              </p>
            )}
          </div>
          {!readonly && (
            <button
              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-muted rounded transition-opacity"
              onClick={() => onCardDelete?.(card.id, columnId)}
            >
              <X className="h-3 w-3" />
            </button>
          )}
        </div>

        {(card.tags || card.priority || card.assignee || card.dueDate) && (
          <div className="flex flex-wrap items-center gap-2 mt-3">
            {card.priority && (
              <span
                className={cn(
                  'text-xs px-2 py-1 rounded-full font-medium',
                  priorityColors[card.priority]
                )}
              >
                {card.priority}
              </span>
            )}
            {card.tags?.map((tag) => (
              <span
                key={tag}
                className="text-xs px-2 py-1 bg-muted text-muted-foreground rounded-full"
              >
                {tag}
              </span>
            ))}
            {card.assignee && (
              <div className="flex items-center gap-1 text-xs text-muted-foreground">
                <div className="w-5 h-5 bg-primary text-primary-foreground rounded-full flex items-center justify-center font-medium">
                  {card.assignee.charAt(0).toUpperCase()}
                </div>
                <span>{card.assignee}</span>
              </div>
            )}
            {card.dueDate && (
              <span className="text-xs text-muted-foreground">
                Due {card.dueDate.toLocaleDateString()}
              </span>
            )}
          </div>
        )}

        {card.color && (
          <div
            className="w-full h-1 rounded-full mt-3"
            style={{ backgroundColor: card.color }}
          />
        )}
      </div>
    );
  }
);

KanbanCard.displayName = 'KanbanCard';

// Add Card component
export interface KanbanAddCardProps extends React.HTMLAttributes<HTMLButtonElement> {
  columnId: string;
}

const KanbanAddCard = React.forwardRef<HTMLButtonElement, KanbanAddCardProps>(
  ({ className, columnId, ...props }, ref) => {
    const { onCardAdd } = useKanban();
    const [isAdding, setIsAdding] = React.useState(false);
    const [title, setTitle] = React.useState('');

    const handleAdd = () => {
      if (title.trim()) {
        onCardAdd?.(columnId, { title: title.trim() });
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
            placeholder="Enter card title..."
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
        Add a card
      </button>
    );
  }
);

KanbanAddCard.displayName = 'KanbanAddCard';

// Add Column component
export interface KanbanAddColumnProps extends React.HTMLAttributes<HTMLButtonElement> {}

const KanbanAddColumn = React.forwardRef<HTMLButtonElement, KanbanAddColumnProps>(
  ({ className, ...props }, ref) => {
    const { onColumnAdd, readonly } = useKanban();
    const [isAdding, setIsAdding] = React.useState(false);
    const [title, setTitle] = React.useState('');

    if (readonly) return null;

    const handleAdd = () => {
      if (title.trim()) {
        onColumnAdd?.({ title: title.trim() });
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
        <div className="min-w-[280px] max-w-[320px] p-3 bg-muted/50 rounded-lg">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAdd}
            placeholder="Enter column title..."
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
          'min-w-[280px] max-w-[320px] p-4 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-lg border border-dashed border-muted-foreground/25 hover:border-muted-foreground/50 transition-colors flex items-center justify-center gap-2',
          className
        )}
        onClick={() => setIsAdding(true)}
        {...props}
      >
        <Plus className="h-4 w-4" />
        Add another list
      </button>
    );
  }
);

KanbanAddColumn.displayName = 'KanbanAddColumn';

// Header component
export interface KanbanHeaderProps extends React.HTMLAttributes<HTMLDivElement> {}

const KanbanHeader = React.forwardRef<HTMLDivElement, KanbanHeaderProps>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex items-start justify-between p-4 border-b', className)}
        {...props}
      >
        {children}
      </div>
    );
  }
);

KanbanHeader.displayName = 'KanbanHeader';

// Controls component
export interface KanbanControlsProps extends React.HTMLAttributes<HTMLDivElement> {}

const KanbanControls = React.forwardRef<HTMLDivElement, KanbanControlsProps>(
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

KanbanControls.displayName = 'KanbanControls';

export {
  Kanban,
  KanbanBoard,
  KanbanColumn,
  KanbanColumnHeader,
  KanbanCard,
  KanbanAddCard,
  KanbanAddColumn,
  KanbanHeader,
  KanbanControls,
  kanbanVariants,
  columnVariants,
  cardVariants,
};

export type { KanbanData, KanbanCard as KanbanCardType, KanbanColumn as KanbanColumnType };
