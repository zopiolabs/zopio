/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { X, Plus } from "lucide-react";
import { cn } from "../lib/utils";
import { Badge } from "./badge";

const tagsVariants = cva("space-y-2", {
  variants: {
    size: {
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
    },
  },
  defaultVariants: {
    size: "md",
  },
});

interface Tag {
  id: string;
  label: string;
  value: string;
}

interface TagsContextValue {
  selectedTags: Tag[];
  availableTags: Tag[];
  onTagSelect: (tag: Tag) => void;
  onTagRemove: (tagId: string) => void;
  onTagCreate?: (label: string) => void;
  size?: "sm" | "md" | "lg";
  allowCreate?: boolean;
  placeholder?: string;
}

const TagsContext = React.createContext<TagsContextValue | null>(null);

const useTagsContext = () => {
  const context = React.useContext(TagsContext);
  if (!context) {
    throw new Error("Tags components must be used within a TagsProvider");
  }
  return context;
};

interface TagsProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'defaultValue'>, VariantProps<typeof tagsVariants> {
  value?: Tag[];
  defaultValue?: Tag[];
  availableTags?: Tag[];
  onValueChange?: (tags: Tag[]) => void;
  onTagCreate?: (label: string) => void;
  allowCreate?: boolean;
  placeholder?: string;
  maxTags?: number;
  disabled?: boolean;
}

const Tags = React.forwardRef<HTMLDivElement, TagsProps>(
  (
    {
      className,
      size = "md",
      value: controlledValue,
      defaultValue = [],
      availableTags = [],
      onValueChange,
      onTagCreate,
      allowCreate = false,
      placeholder = "Type to add tags...",
      maxTags,
      disabled = false,
      ...props
    },
    ref
  ) => {
    const [internalValue, setInternalValue] = React.useState<Tag[]>(defaultValue);
    const [inputValue, setInputValue] = React.useState("");
    const [showSuggestions, setShowSuggestions] = React.useState(false);
    
    const isControlled = controlledValue !== undefined;
    const selectedTags = isControlled ? controlledValue : internalValue;

    const filteredTags = availableTags.filter(tag => 
      !selectedTags.find(selected => selected.id === tag.id) &&
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    const handleTagSelect = (tag: Tag) => {
      if (disabled) return;
      if (selectedTags.find(t => t.id === tag.id)) return;
      if (maxTags && selectedTags.length >= maxTags) return;

      const newTags = [...selectedTags, tag];
      if (!isControlled) {
        setInternalValue(newTags);
      }
      onValueChange?.(newTags);
      setInputValue("");
      setShowSuggestions(false);
    };

    const handleTagRemove = (tagId: string) => {
      if (disabled) return;
      const newTags = selectedTags.filter(tag => tag.id !== tagId);
      if (!isControlled) {
        setInternalValue(newTags);
      }
      onValueChange?.(newTags);
    };

    const handleCreateTag = () => {
      if (!allowCreate || !onTagCreate || disabled || !inputValue.trim()) return;
      
      const newTag: Tag = {
        id: `tag-${Date.now()}`,
        label: inputValue.trim(),
        value: inputValue.trim().toLowerCase().replace(/\s+/g, '-'),
      };
      
      onTagCreate(inputValue.trim());
      handleTagSelect(newTag);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter") {
        e.preventDefault();
        if (filteredTags.length > 0) {
          handleTagSelect(filteredTags[0]);
        } else if (allowCreate && inputValue.trim()) {
          handleCreateTag();
        }
      } else if (e.key === "Escape") {
        setShowSuggestions(false);
        setInputValue("");
      }
    };

    return (
      <div
        ref={ref}
        className={cn(tagsVariants({ size, className }))}
        {...props}
      >
        {/* Selected Tags */}
        {selectedTags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {selectedTags.map((tag) => (
              <Badge
                key={tag.id}
                variant="secondary"
                className={cn(
                  "flex items-center gap-1",
                  size === "sm" && "text-xs px-2 py-0.5",
                  size === "lg" && "text-base px-3 py-1"
                )}
              >
                {tag.label}
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleTagRemove(tag.id)}
                    className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                  >
                    <X className="h-3 w-3" />
                    <span className="sr-only">Remove {tag.label}</span>
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}

        {/* Input */}
        <div className="relative">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={disabled || (maxTags ? selectedTags.length >= maxTags : false)}
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              size === "sm" && "h-8 text-xs",
              size === "lg" && "h-12 text-base"
            )}
          />

          {/* Suggestions Dropdown */}
          {showSuggestions && (inputValue || filteredTags.length > 0) && (
            <div className="absolute top-full z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
              <div className="max-h-60 overflow-auto p-1">
                {filteredTags.map((tag) => (
                  <button
                    key={tag.id}
                    type="button"
                    onClick={() => handleTagSelect(tag)}
                    className="w-full rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    {tag.label}
                  </button>
                ))}
                
                {allowCreate && inputValue.trim() && filteredTags.length === 0 && (
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-left text-sm hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                  >
                    <Plus className="h-4 w-4" />
                    Create "{inputValue}"
                  </button>
                )}
                
                {!allowCreate && filteredTags.length === 0 && inputValue && (
                  <div className="px-2 py-1.5 text-sm text-muted-foreground">
                    No tags found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }
);

Tags.displayName = "Tags";

export { Tags, tagsVariants };
export type { TagsProps, Tag };
