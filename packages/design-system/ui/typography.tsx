/**
 * SPDX-License-Identifier: MIT
 */

import { cn } from '@repo/design-system/lib/utils';
import type { ReactNode } from 'react';

interface TypographyProps {
  children: ReactNode;
  className?: string;
  [key: string]: any;
}

export function TypographyH1({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h1
      className={cn(
        'scroll-m-20 font-extrabold text-4xl tracking-tight lg:text-5xl',
        className
      )}
      {...props}
    >
      {children}
    </h1>
  );
}

export function TypographyH2({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h2
      className={cn(
        'scroll-m-20 border-b pb-2 font-semibold text-3xl tracking-tight first:mt-0',
        className
      )}
      {...props}
    >
      {children}
    </h2>
  );
}

export function TypographyH3({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h3
      className={cn(
        'scroll-m-20 font-semibold text-2xl tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

export function TypographyH4({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <h4
      className={cn(
        'scroll-m-20 font-semibold text-xl tracking-tight',
        className
      )}
      {...props}
    >
      {children}
    </h4>
  );
}

export function TypographyP({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <p
      className={cn('leading-7 [&:not(:first-child)]:mt-6', className)}
      {...props}
    >
      {children}
    </p>
  );
}

export function TypographyBlockquote({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <blockquote
      className={cn('mt-6 border-l-2 pl-6 italic', className)}
      {...props}
    >
      {children}
    </blockquote>
  );
}

export function TypographyList({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <ul className={cn('my-6 ml-6 list-disc [&>li]:mt-2', className)} {...props}>
      {children}
    </ul>
  );
}

export function TypographyInlineCode({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <code
      className={cn(
        'relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm',
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

export function TypographyLead({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-xl', className)} {...props}>
      {children}
    </p>
  );
}

export function TypographyLarge({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <div className={cn('font-semibold text-lg', className)} {...props}>
      {children}
    </div>
  );
}

export function TypographySmall({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <small
      className={cn('font-medium text-sm leading-none', className)}
      {...props}
    >
      {children}
    </small>
  );
}

export function TypographyMuted({
  children,
  className,
  ...props
}: TypographyProps) {
  return (
    <p className={cn('text-muted-foreground text-sm', className)} {...props}>
      {children}
    </p>
  );
}
