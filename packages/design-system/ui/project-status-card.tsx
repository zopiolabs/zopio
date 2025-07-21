/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import React, { useRef, useEffect } from "react";
import {
  Clock,
  GitBranch,
  Github,
  MessageSquare,
  CheckCircle2,
  Star,
  Users,
} from "lucide-react";
import { Badge } from "@repo/design-system/ui/badge";
import { Button } from "@repo/design-system/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@repo/design-system/ui/avatar";
import { Progress } from "@repo/design-system/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@repo/design-system/ui/tooltip";
import {
  ExpandableCard,
  ExpandableCardHeader,
  ExpandableCardContent,
  ExpandableCardFooter,
  useExpandable,
} from "@repo/design-system/ui/expandable-card";

export interface ProjectStatusCardProps {
  title: string;
  progress: number;
  dueDate: string;
  contributors: Array<{ name: string; image?: string }>;
  tasks: Array<{ title: string; completed: boolean }>;
  githubStars: number;
  openIssues: number;
  className?: string;
  lastUpdated?: string;
}

export function ProjectStatusCard({
  title,
  progress,
  dueDate,
  contributors,
  tasks,
  githubStars,
  openIssues,
  className,
  lastUpdated = "2 hours ago",
}: ProjectStatusCardProps) {
  const { isExpanded, toggleExpand, animatedHeight } = useExpandable();
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      animatedHeight.set(isExpanded ? contentRef.current.scrollHeight : 0);
    }
  }, [isExpanded, animatedHeight]);

  return (
    <ExpandableCard
      className="w-full max-w-md cursor-pointer transition-all duration-300 hover:shadow-lg"
      defaultExpanded={isExpanded}
      onExpandChange={toggleExpand}
    >
      <ExpandableCardHeader className="space-y-1">
        <div className="flex items-start justify-between w-full">
          <div className="space-y-2">
            <Badge
              variant="secondary"
              className={
                progress === 100
                  ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                  : "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
              }
            >
              {progress === 100 ? "Completed" : "In Progress"}
            </Badge>
            <h3 className="text-2xl font-semibold">{title}</h3>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button size="icon" variant="outline" className="h-8 w-8">
                  <Github className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>View on GitHub</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </ExpandableCardHeader>

      <ExpandableCardContent>
        <div className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progress</span>
              <span>{progress}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>

          <div ref={contentRef}>
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Due {dueDate}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center">
                    <Star className="h-4 w-4 mr-1 text-yellow-400" />
                    <span>{githubStars}</span>
                  </div>
                  <div className="flex items-center">
                    <GitBranch className="h-4 w-4 mr-1" />
                    <span>{openIssues} issues</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center">
                  <Users className="h-4 w-4 mr-2" />
                  Contributors
                </h4>
                <div className="flex -space-x-2">
                  {contributors.map((contributor, index) => (
                    <TooltipProvider key={index}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Avatar className="border-2 border-background">
                            <AvatarImage
                              src={
                                contributor.image ||
                                `/placeholder.svg?height=32&width=32&text=${contributor.name[0]}`
                              }
                              alt={contributor.name}
                            />
                            <AvatarFallback>
                              {contributor.name[0]}
                            </AvatarFallback>
                          </Avatar>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{contributor.name}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="font-medium text-sm">Recent Tasks</h4>
                {tasks.map((task, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between text-sm"
                  >
                    <span className="text-muted-foreground">{task.title}</span>
                    {task.completed && (
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-2">
                <Button className="w-full">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  View Discussion
                </Button>
              </div>
            </div>
          </div>
        </div>
      </ExpandableCardContent>

      <ExpandableCardFooter>
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground">
          <span>Last updated: {lastUpdated}</span>
          <span>{openIssues} open issues</span>
        </div>
      </ExpandableCardFooter>
    </ExpandableCard>
  );
}

export default ProjectStatusCard;
