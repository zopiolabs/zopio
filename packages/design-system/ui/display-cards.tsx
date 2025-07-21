/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import { cn } from "../lib/utils";
import { AudioLines } from "lucide-react";
import React from "react";

export interface DisplayCardProps {
  className?: string;
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  date?: string;
  iconClassName?: string;
  titleClassName?: string;
}

export const DisplayCard = React.forwardRef<HTMLDivElement, DisplayCardProps>(
  ({
    className,
    icon = <AudioLines className="size-4 text-green-300" />,
    title = "Featured",
    description = "This is a skewed card with some text",
    date = "Sep 23",
    iconClassName = "text-green-500",
    titleClassName = "text-green-500",
    ...props
  }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative flex h-36 w-[22rem] -skew-y-[8deg] select-none flex-col justify-between rounded-xl border-2 bg-muted/70 backdrop-blur-sm px-4 py-3 transition-all duration-700 after:absolute after:-right-1 after:top-[-5%] after:h-[110%] after:w-[20rem] after:bg-gradient-to-l after:from-background after:to-transparent after:content-[''] hover:border-white/20 hover:bg-muted [&>*]:flex [&>*]:items-center [&>*]:gap-2",
          className
        )}
        {...props}
      >
        <div>
          <span className="relative inline-block rounded-full bg-green-800 p-1">
            {icon}
          </span>
          <p className={cn("text-lg", titleClassName)}>{title}</p>
        </div>
        <p className="whitespace-nowrap text-lg">{description}</p>
        <p className="text-muted-foreground">{date}</p>
      </div>
    );
  }
);

DisplayCard.displayName = "DisplayCard";

export interface DisplayCardsProps {
  cards?: DisplayCardProps[];
}

export const DisplayCards = React.forwardRef<HTMLDivElement, DisplayCardsProps>(
  ({ cards, ...props }, ref) => {
    const defaultCards = [
      {
        className: "[grid-area:stack] hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
      },
      {
        className: "[grid-area:stack] translate-x-16 translate-y-10 hover:-translate-y-10 before:absolute before:w-[100%] before:outline-1 before:rounded-xl before:outline-border before:h-[100%] before:content-[''] before:bg-blend-overlay before:bg-background/50 grayscale-[100%] hover:before:opacity-0 before:transition-opacity before:duration-700 hover:grayscale-0 before:left-0 before:top-0",
      },
      {
        className: "[grid-area:stack] translate-x-32 translate-y-20 hover:translate-y-10",
      },
    ];

    const displayCards = cards || defaultCards;

    return (
      <div 
        ref={ref}
        className="grid [grid-template-areas:'stack'] place-items-center opacity-100 animate-in fade-in-0 duration-700"
        {...props}
      >
        {displayCards.map((cardProps, index) => (
          <DisplayCard key={index} {...cardProps} />
        ))}
      </div>
    );
  }
);

DisplayCards.displayName = "DisplayCards";

export default DisplayCards;
