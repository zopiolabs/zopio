/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Star, AlertCircle, Calendar, Users } from "lucide-react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";
import { Badge } from "./badge";
import { Progress } from "./progress";
import { Avatar, AvatarFallback, AvatarImage } from "./avatar";

const expandableCardVariants = cva(
  "relative overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm transition-all duration-300",
  {
    variants: {
      variant: {
        default: "hover:shadow-md",
        elevated: "shadow-lg hover:shadow-xl",
        minimal: "border-0 shadow-none",
      },
      size: {
        sm: "p-4",
        default: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface Contributor {
  name: string;
  image?: string;
}

export interface Task {
  title: string;
  completed: boolean;
}

export interface ExpandableCardProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof expandableCardVariants> {
  title: string;
  progress: number;
  dueDate: string;
  contributors: Contributor[];
  tasks: Task[];
  githubStars?: number;
  openIssues?: number;
  defaultExpanded?: boolean;
}

const ExpandableCard = React.forwardRef<HTMLDivElement, ExpandableCardProps>(
  (
    {
      className,
      variant,
      size,
      title,
      progress,
      dueDate,
      contributors,
      tasks,
      githubStars,
      openIssues,
      defaultExpanded = false,
      ...props
    },
    ref
  ) => {
    const [isExpanded, setIsExpanded] = React.useState(defaultExpanded);

    const completedTasks = tasks.filter(task => task.completed).length;
    const totalTasks = tasks.length;

    const formatDate = (dateString: string) => {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    };

    const getProgressColor = (progress: number) => {
      if (progress >= 80) return "text-green-600";
      if (progress >= 50) return "text-yellow-600";
      return "text-red-600";
    };

    return (
      <motion.div
        ref={ref}
        className={cn(expandableCardVariants({ variant, size }), className)}
        layout
        {...(props as any)}
      >
        {/* Header */}
        <div 
          className="flex cursor-pointer items-center justify-between"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex-1 space-y-2">
            <h3 className="font-semibold text-lg">{title}</h3>
            
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(dueDate)}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{contributors.length} contributors</span>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Progress</span>
                <span className={cn("text-sm font-semibold", getProgressColor(progress))}>
                  {progress}%
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </div>

          <motion.div
            animate={{ rotate: isExpanded ? 180 : 0 }}
            transition={{ duration: 0.2 }}
            className="ml-4"
          >
            <ChevronDown className="h-5 w-5 text-muted-foreground" />
          </motion.div>
        </div>

        {/* Expandable Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="overflow-hidden"
            >
              <div className="mt-6 space-y-6">
                {/* Contributors */}
                <div>
                  <h4 className="mb-3 font-medium">Contributors</h4>
                  <div className="flex -space-x-2">
                    {contributors.slice(0, 5).map((contributor, index) => (
                      <Avatar key={index} className="h-8 w-8 border-2 border-background">
                        <AvatarImage src={contributor.image} alt={contributor.name} />
                        <AvatarFallback className="text-xs">
                          {contributor.name.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    ))}
                    {contributors.length > 5 && (
                      <div className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-background bg-muted text-xs font-medium">
                        +{contributors.length - 5}
                      </div>
                    )}
                  </div>
                </div>

                {/* Tasks */}
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h4 className="font-medium">Tasks</h4>
                    <Badge variant="secondary">
                      {completedTasks}/{totalTasks} completed
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    {tasks.map((task, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div
                          className={cn(
                            "h-4 w-4 rounded border-2 flex items-center justify-center",
                            task.completed
                              ? "bg-green-500 border-green-500"
                              : "border-muted-foreground"
                          )}
                        >
                          {task.completed && (
                            <svg className="h-2.5 w-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </div>
                        <span
                          className={cn(
                            "text-sm",
                            task.completed
                              ? "line-through text-muted-foreground"
                              : "text-foreground"
                          )}
                        >
                          {task.title}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Stats */}
                {(githubStars !== undefined || openIssues !== undefined) && (
                  <div className="flex gap-4 pt-4 border-t">
                    {githubStars !== undefined && (
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="font-medium">{githubStars}</span>
                        <span className="text-muted-foreground">stars</span>
                      </div>
                    )}
                    {openIssues !== undefined && (
                      <div className="flex items-center gap-2 text-sm">
                        <AlertCircle className="h-4 w-4 text-orange-500" />
                        <span className="font-medium">{openIssues}</span>
                        <span className="text-muted-foreground">open issues</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }
);

ExpandableCard.displayName = "ExpandableCard";

export { ExpandableCard, expandableCardVariants };
