/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import { RadioGroup } from "@repo/design-system/ui/radio-group";
import { cn } from "@repo/design-system/lib/utils";
import { CircleIcon, GripVerticalIcon } from "lucide-react";
import * as RadioGroupPrimitive from "@radix-ui/react-radio-group";
import type { ComponentProps, HTMLAttributes, ReactNode } from "react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/design-system/ui/card";

export type ChoiceboxProps = ComponentProps<typeof RadioGroup>;

export const Choicebox = ({ className, ...props }: ChoiceboxProps) => (
  <RadioGroup className={cn("w-full", className)} {...props} />
);

export type ChoiceboxItemProps = RadioGroupPrimitive.RadioGroupItemProps & {
  children: React.ReactNode;
  className?: string;
};

export const ChoiceboxItem = ({
  className,
  children,
  ...props
}: ChoiceboxItemProps) => (
  <RadioGroupPrimitive.Item
    asChild
    className={cn(
      "text-left",
      "[&[data-state=\"checked\"]]:border-primary",
      "[&[data-state=\"checked\"]]:bg-primary-foreground"
    )}
    {...props}
  >
    <Card
      className={cn(
        "flex cursor-pointer flex-row items-start justify-between rounded-md p-4 shadow-none transition-all",
        className
      )}
    >
      {children}
    </Card>
  </RadioGroupPrimitive.Item>
);

export type ChoiceboxItemHeaderProps = ComponentProps<typeof CardHeader>;

export const ChoiceboxItemHeader = ({
  className,
  ...props
}: ComponentProps<typeof CardHeader>) => (
  <CardHeader className={cn("flex-1 p-0", className)} {...props} />
);

export type ChoiceboxItemTitleProps = ComponentProps<typeof CardTitle>;

export const ChoiceboxItemTitle = ({
  className,
  ...props
}: ChoiceboxItemTitleProps) => (
  <CardTitle
    className={cn("flex items-center gap-2 text-sm", className)}
    {...props}
  />
);

export type ChoiceboxItemSubtitleProps = HTMLAttributes<HTMLSpanElement>;

export const ChoiceboxItemSubtitle = ({
  className,
  ...props
}: ChoiceboxItemSubtitleProps) => (
  <span
    className={cn("font-normal text-muted-foreground text-xs", className)}
    {...props}
  />
);

export type ChoiceboxItemDescriptionProps = ComponentProps<
  typeof CardDescription
>;

export const ChoiceboxItemDescription = ({
  className,
  ...props
}: ChoiceboxItemDescriptionProps) => (
  <CardDescription className={cn("text-sm", className)} {...props} />
);

export type ChoiceboxItemContentProps = ComponentProps<typeof CardContent>;

export const ChoiceboxItemContent = ({
  className,
  ...props
}: ChoiceboxItemContentProps) => (
  <CardContent
    className={cn(
      "flex aspect-square size-4 shrink-0 items-center justify-center rounded-full border border-input p-0 text-primary shadow-xs outline-none transition-[color,box-shadow] focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:bg-input/30 dark:aria-invalid:ring-destructive/40",
      className
    )}
    {...props}
  />
);

export type ChoiceboxItemIndicatorProps = ComponentProps<
  typeof RadioGroupPrimitive.Indicator
>;

export const ChoiceboxItemIndicator = ({
  className,
  ...props
}: ChoiceboxItemIndicatorProps) => (
  <RadioGroupPrimitive.Indicator asChild {...props}>
    <CircleIcon className={cn("size-2 fill-primary", className)} />
  </RadioGroupPrimitive.Indicator>
);

// Draggable Choicebox Components

interface DraggableChoiceboxProps extends Omit<ChoiceboxProps, 'children'> {
  items: Array<{
    id: string;
    value: string;
    content: ReactNode;
  }>;
  onReorder: (items: Array<{ id: string; value: string; content: ReactNode }>) => void;
}

export const DraggableChoicebox = ({
  className,
  items,
  onReorder,
  ...props
}: DraggableChoiceboxProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);

      onReorder(arrayMove(items, oldIndex, newIndex));
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map(item => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <RadioGroup className={cn("w-full", className)} {...props}>
          {items.map((item) => (
            <DraggableChoiceboxItem
              key={item.id}
              id={item.id}
              value={item.value}
            >
              {item.content}
            </DraggableChoiceboxItem>
          ))}
        </RadioGroup>
      </SortableContext>
    </DndContext>
  );
};

interface DraggableChoiceboxItemProps extends Omit<ChoiceboxItemProps, 'children'> {
  id: string;
  children: ReactNode;
}

export const DraggableChoiceboxItem = ({
  id,
  className,
  children,
  ...props
}: DraggableChoiceboxItemProps) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2",
        isDragging && "z-10"
      )}
      {...attributes}
    >
      <div className="cursor-grab p-2" {...listeners}>
        <GripVerticalIcon className="size-4 text-muted-foreground" />
      </div>
      <RadioGroupPrimitive.Item
        asChild
        className={cn(
          "text-left flex-1",
          "[&[data-state=\"checked\"]]:border-primary",
          "[&[data-state=\"checked\"]]:bg-primary-foreground"
        )}
        {...props}
      >
        <Card
          className={cn(
            "flex cursor-pointer flex-row items-start justify-between rounded-md p-4 shadow-none transition-all",
            className
          )}
        >
          {children}
        </Card>
      </RadioGroupPrimitive.Item>
    </div>
  );
};

// All components are now exported directly with export const
