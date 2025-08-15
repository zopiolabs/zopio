/**
 * SPDX-License-Identifier: MIT
 */

import * as React from "react";
import { type VariantProps, cva } from "class-variance-authority";

import { cn } from "@repo/design-system/lib/utils";

const footerVariants = cva(
  "bg-background rounded-lg shadow-sm",
  {
    variants: {
      variant: {
        default: "m-4",
        simple: "border-t",
        full: "",
      },
      size: {
        default: "",
        sm: "text-sm",
        lg: "text-lg",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface FooterProps extends React.HTMLAttributes<HTMLElement> {
  variant?: VariantProps<typeof footerVariants>["variant"];
  size?: VariantProps<typeof footerVariants>["size"];
}

export interface FooterSectionProps extends React.HTMLAttributes<HTMLDivElement> {
  title?: string;
  links?: Array<{
    label: string;
    href: string;
    external?: boolean;
  }>;
}

export interface FooterCopyrightProps extends React.HTMLAttributes<HTMLSpanElement> {
  year?: number;
  company?: string;
  companyUrl?: string;
}

export interface FooterSocialProps extends React.HTMLAttributes<HTMLDivElement> {
  links?: Array<{
    label: string;
    href: string;
    icon: React.ReactNode;
  }>;
}

const Footer = React.forwardRef<HTMLElement, FooterProps>(
  ({ className, variant, size, children, ...props }, ref) => {
    return (
      <footer
        ref={ref}
        className={cn(footerVariants({ variant, size, className }))}
        {...props}
      >
        {children}
      </footer>
    );
  }
);

const FooterContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

const FooterGrid = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "w-full mx-auto max-w-screen-xl p-4 py-6 lg:py-8",
          className
        )}
        {...props}
      >
        <div className="md:flex md:justify-between">
          {children}
        </div>
      </div>
    );
  }
);

const FooterSection = React.forwardRef<HTMLDivElement, FooterSectionProps>(
  ({ className, title, links, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn("mb-6 md:mb-0", className)} {...props}>
        {title && (
          <h2 className="mb-6 text-sm font-semibold text-foreground uppercase">
            {title}
          </h2>
        )}
        {links && (
          <ul className="text-muted-foreground font-medium">
            {links.map((link, index) => (
              <li key={index} className="mb-4">
                <a
                  href={link.href}
                  className="hover:underline"
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noopener noreferrer" : undefined}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        )}
        {children}
      </div>
    );
  }
);

const FooterCopyright = React.forwardRef<HTMLSpanElement, FooterCopyrightProps>(
  ({ className, year = new Date().getFullYear(), company, companyUrl, children, ...props }, ref) => {
    return (
      <span
        ref={ref}
        className={cn(
          "text-sm text-muted-foreground sm:text-center",
          className
        )}
        {...props}
      >
        {children || (
          <>
            © {year}{" "}
            {company && companyUrl ? (
              <a href={companyUrl} className="hover:underline">
                {company}
              </a>
            ) : (
              company
            )}
            {company && ". All Rights Reserved."}
          </>
        )}
      </span>
    );
  }
);

const FooterLinks = React.forwardRef<HTMLUListElement, React.HTMLAttributes<HTMLUListElement> & {
  links?: Array<{
    label: string;
    href: string;
  }>;
}>(
  ({ className, links, children, ...props }, ref) => {
    return (
      <ul
        ref={ref}
        className={cn(
          "flex flex-wrap items-center mt-3 text-sm font-medium text-muted-foreground sm:mt-0",
          className
        )}
        {...props}
      >
        {links?.map((link, index) => (
          <li key={index}>
            <a
              href={link.href}
              className="hover:underline me-4 md:me-6"
            >
              {link.label}
            </a>
          </li>
        ))}
        {children}
      </ul>
    );
  }
);

const FooterSocial = React.forwardRef<HTMLDivElement, FooterSocialProps>(
  ({ className, links, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn("flex mt-4 sm:justify-center sm:mt-0", className)}
        {...props}
      >
        {links?.map((link, index) => (
          <a
            key={index}
            href={link.href}
            className="text-muted-foreground hover:text-foreground ms-5"
            target="_blank"
            rel="noopener noreferrer"
            aria-label={link.label}
          >
            {link.icon}
          </a>
        ))}
        {children}
      </div>
    );
  }
);

const FooterDivider = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn("my-6 border-border sm:mx-auto lg:my-8", className)}
        {...props}
      />
    );
  }
);

Footer.displayName = "Footer";
FooterContent.displayName = "FooterContent";
FooterGrid.displayName = "FooterGrid";
FooterSection.displayName = "FooterSection";
FooterCopyright.displayName = "FooterCopyright";
FooterLinks.displayName = "FooterLinks";
FooterSocial.displayName = "FooterSocial";
FooterDivider.displayName = "FooterDivider";

export {
  Footer,
  FooterContent,
  FooterGrid,
  FooterSection,
  FooterCopyright,
  FooterLinks,
  FooterSocial,
  FooterDivider,
  footerVariants,
};
