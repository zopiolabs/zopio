/**
 * SPDX-License-Identifier: MIT
 */

"use client";

import * as React from "react";
import { cn } from "@repo/design-system/lib/utils"; // Assumes you have a cn utility for className merging
import { Card } from "@repo/design-system/ui/card";

export interface HeroPillProps {
  text: string;
  href: string;
  icon?: React.ReactNode;
}

export interface HeroActionProps {
  href: string;
  text: string;
  icon?: React.ReactNode;
}

export interface HeroContentProps {
  title: string;
  titleHighlight: string;
  description?: string;
  primaryAction: HeroActionProps;
  secondaryAction?: HeroActionProps;
}

export interface HeroProps {
  pill?: HeroPillProps;
  content: HeroContentProps;
  preview?: React.ReactNode;
  className?: string;
}

export type HeroComponentProps = HeroProps & Omit<React.HTMLAttributes<HTMLDivElement>, 'content'>

export function Hero({
  pill,
  content,
  preview,
  className,
  ...props
}: HeroComponentProps) {
  return (
    <section
      className={cn(
        "flex w-full flex-col items-center justify-center gap-8 py-12 md:flex-row md:items-start md:gap-12 md:py-24",
        className
      )}
      {...props}
    >
      <div className="flex max-w-xl flex-1 flex-col items-center md:items-start">
        {pill && (
          <a
            href={pill.href}
            className="mb-4 inline-flex items-center gap-2 rounded-full bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground transition-colors hover:bg-muted/80 dark:bg-muted dark:text-muted-foreground"
          >
            {pill.icon && (
              <span className="mr-1 flex h-4 w-4 items-center justify-center">{pill.icon}</span>
            )}
            {pill.text}
          </a>
        )}
        <h1 className="mb-2 text-center text-4xl font-bold tracking-tight md:text-left md:text-5xl">
          {content.title} {" "}
          <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {content.titleHighlight}
          </span>
        </h1>
        {content.description && (
          <p className="mb-6 text-center text-lg text-muted-foreground md:text-left">
            {content.description}
          </p>
        )}
        <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-start">
          <a
            href={content.primaryAction.href}
            className="inline-flex items-center justify-center gap-2 rounded-md bg-primary px-6 py-2 text-base font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
          >
            {content.primaryAction.icon}
            {content.primaryAction.text}
          </a>
          {content.secondaryAction && (
            <a
              href={content.secondaryAction.href}
              className="inline-flex items-center justify-center gap-2 rounded-md border border-input bg-background px-6 py-2 text-base font-medium text-foreground shadow-sm transition-colors hover:bg-muted/80 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              {content.secondaryAction.icon}
              {content.secondaryAction.text}
            </a>
          )}
        </div>
      </div>
      {preview && (
        <div className="flex flex-1 items-center justify-center">
          <Card className="w-full max-w-lg p-4 shadow-lg dark:bg-muted">
            {preview}
          </Card>
        </div>
      )}
    </section>
  );
}

Hero.displayName = "Hero";

// Helper for className merging (if not present, replace with your own implementation)
// function cn(...classes: (string | undefined | false | null)[]) {
//   return classes.filter(Boolean).join(" ");
// }
