# @repo/design-system

## Overview

The `@repo/design-system` package provides a comprehensive set of UI components, styles, and utilities to ensure a consistent user experience across all Zopio applications. Built on shadcn/ui with Tailwind CSS, it implements the Zopio design language with full support for theming, accessibility, and internationalization.

## Module Categories

### UI Components

- **Basic Elements**: Buttons, inputs, checkboxes, radio buttons, selects, textareas, switches, sliders
- **Layout Components**: Cards, dialogs, popovers, tabs, accordions, navigation menus, sidebars
- **Form Components**: Form fields, validation integration, input groups
- **Data Display**: Tables, lists, avatars, badges, charts, calendars
- **Feedback Components**: Alerts, toasts, progress indicators, skeletons
- **Advanced UI**: Command palettes, carousels, color pickers, resizable panels

### Providers & Context

- **ThemeProvider**: Dark/light mode support with system preference detection
- **DesignSystemProvider**: Comprehensive provider that wraps all necessary contexts
- **TooltipProvider**: Accessible tooltips with customizable delays and positioning
- **ToastProvider**: Global notification system with customizable appearance

### Utilities & Hooks

- **Theme Tokens**: Consistent design tokens for colors, typography, spacing, etc.
- **Responsive Utilities**: Helpers for responsive design and mobile detection
- **Accessibility Utilities**: Tools for ensuring WCAG compliance
- **Animation Utilities**: Consistent motion and transition helpers

## Usage Guidelines

### Basic Setup

1. Wrap your application with the DesignSystemProvider:

```tsx
import { DesignSystemProvider } from '@repo/design-system/design-system-provider';

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DesignSystemProvider
          defaultTheme="system"
          enableSystem
          storageKey="zopio-theme"
        >
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
```

2. Import the global styles in your root layout:

```tsx
import '@repo/design-system/styles/globals.css';
```

### Importing Components

```tsx
// Import individual UI components
import { Button } from '@repo/design-system/ui/button';
import { Input } from '@repo/design-system/ui/input';

// Import from the main entry point (not recommended for production due to bundle size)
import { Button, Input } from '@repo/design-system';

// Use components
function LoginForm() {
  return (
    <form className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email">Email</label>
        <Input id="email" type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-2">
        <label htmlFor="password">Password</label>
        <Input id="password" type="password" placeholder="Enter your password" />
      </div>
      <Button type="submit">Log In</Button>
    </form>
  );
}
```

### Using Theme Tokens

```tsx
import { colors } from '@repo/design-system';

// Access tokens directly
const primaryColor = colors.primary[500];
const secondaryColor = colors.secondary[400];

// Use with Tailwind classes
function ThemedComponent() {
  return (
    <div className="bg-primary text-primary-foreground p-4 rounded-md">
      <h2 className="text-xl font-semibold">Themed Component</h2>
      <p className="text-sm opacity-90">Using design system tokens</p>
    </div>
  );
}
```

### Using Hooks

```tsx
import { useMobile } from '@repo/design-system/hooks/use-mobile';
import { useToast } from '@repo/design-system/hooks/use-toast';

function ResponsiveComponent() {
  const isMobile = useMobile();
  const { toast } = useToast();
  
  const handleAction = () => {
    toast({
      title: 'Action completed',
      description: 'Your changes have been saved successfully.',
    });
  };
  
  return (
    <div>
      {isMobile ? (
        <Button size="sm" onClick={handleAction}>Save</Button>
      ) : (
        <Button onClick={handleAction}>Save Changes</Button>
      )}
    </div>
  );
}
```

### Building Forms

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@repo/design-system/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@repo/design-system/ui/form';
import { Input } from '@repo/design-system/ui/input';

const formSchema = z.object({
  username: z.string().min(2).max(50),
  email: z.string().email(),
});

function ProfileForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: '',
      email: '',
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="johndoe" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input placeholder="john@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Update profile</Button>
      </form>
    </Form>
  );
}
```

## Installation

This package is part of the Zopio monorepo and is available as a workspace package.

```bash
pnpm add @repo/design-system
```

## Component Categories

### Basic UI Components

- **Button**: Primary action element with multiple variants (default, outline, ghost, link)
- **Input**: Text input field with validation states
- **Checkbox**: Toggle selection with customizable states
- **Radio**: Single selection from multiple options
- **Select**: Dropdown selection with search and multi-select capabilities
- **Textarea**: Multi-line text input with auto-resize
- **Switch**: Toggle switch for boolean settings
- **Slider**: Range selection with single or multi-point selection

### Layout Components

- **Card**: Container for related content with header, footer, and content sections
- **Dialog**: Modal dialog for focused user interactions
- **Popover**: Contextual overlay for additional information
- **Tabs**: Tabbed interface for organizing content
- **Accordion**: Expandable sections for progressive disclosure
- **Sidebar**: Collapsible navigation sidebar with responsive behavior
- **Resizable**: Resizable panels and split views

### Form Components

- **Form**: Complete form with validation integration
- **FormField**: Combines label, input, and error message
- **InputOTP**: One-time password input for verification codes
- **Calendar**: Date picker with range selection

### Data Display

- **Table**: Data table with sorting, filtering, and pagination
- **List**: Ordered or unordered list with customizable rendering
- **Avatar**: User or entity representation with fallbacks
- **Badge**: Status indicator with multiple variants
- **Chart**: Data visualization components

### Feedback Components

- **Alert**: Important message with different severity levels
- **Toast**: Temporary notification system
- **Progress**: Loading or progress indicator
- **Skeleton**: Loading placeholder for content

### Navigation Components

- **NavigationMenu**: Accessible navigation menu with dropdowns
- **Breadcrumb**: Path-based navigation indicator
- **Pagination**: Page navigation for multi-page content
- **Command**: Command palette for keyboard-driven navigation

## Customization

### Theme Customization

You can customize the theme by extending the default theme tokens:

```tsx
// theme/custom-theme.ts
import { tokens } from '@repo/design-system/theme';

export const customTheme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    primary: {
      ...tokens.colors.primary,
      DEFAULT: '#0070f3',
      50: '#e6f0ff',
      100: '#cce0ff',
      200: '#99c2ff',
      300: '#66a3ff',
      400: '#3385ff',
      500: '#0066ff',
      600: '#0052cc',
      700: '#003d99',
      800: '#002966',
      900: '#001433',
    },
  },
};
```

### Component Customization

Components can be customized using Tailwind classes:

```tsx
<Button 
  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600"
>
  Gradient Button
</Button>
```

### Creating Variants

You can create custom variants for components:

```tsx
import { cva } from 'class-variance-authority';

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "underline-offset-4 hover:underline text-primary",
        // Custom variant
        success: "bg-green-500 text-white hover:bg-green-600",
      },
      // Other variant groups...
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);
```

## Development Guidelines

### Adding New Components

When creating new components:

1. Follow the established patterns and conventions
2. Use the cn utility for combining class names
3. Implement proper keyboard navigation and focus management
4. Ensure components work in both light and dark modes
5. Add comprehensive TypeScript types
6. Include proper ARIA attributes for accessibility

### Component Structure

```tsx
// Example component structure
import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@repo/design-system/lib/utils';

const exampleVariants = cva(
  'base-styles-here',
  {
    variants: {
      variant: {
        default: 'default-styles',
        secondary: 'secondary-styles',
      },
      size: {
        default: 'default-size',
        sm: 'small-size',
        lg: 'large-size',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ExampleProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof exampleVariants> {
  // Additional props here
}

const Example = React.forwardRef<HTMLDivElement, ExampleProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        className={cn(exampleVariants({ variant, size }), className)}
        ref={ref}
        {...props}
      />
    );
  }
);
Example.displayName = 'Example';

export { Example, exampleVariants };
```

## Integration Examples

### With Next.js App Router

```tsx
// app/layout.tsx
import { DesignSystemProvider } from '@repo/design-system/design-system-provider';
import '@repo/design-system/styles/globals.css';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <DesignSystemProvider>
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
```

### With Form Libraries

```tsx
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Button } from '@repo/design-system/ui/button';
import { Form } from '@repo/design-system/ui/form';
import { Input } from '@repo/design-system/ui/input';

// Form implementation as shown in the usage section
```

### With Data Fetching

```tsx
'use client';

import { useQuery } from '@tanstack/react-query';
import { Skeleton } from '@repo/design-system/ui/skeleton';
import { Card, CardContent, CardHeader, CardTitle } from '@repo/design-system/ui/card';

function UserProfile({ userId }: { userId: string }) {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['user', userId],
    queryFn: async () => {
      const res = await fetch(`/api/users/${userId}`);
      if (!res.ok) throw new Error('Failed to fetch user');
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-8 w-1/2" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-full mb-2" />
          <Skeleton className="h-4 w-2/3" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return <div>Error loading user profile</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{user.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <p>{user.email}</p>
        <p>{user.bio}</p>
      </CardContent>
    </Card>
  );
}
```

## Best Practices

- Use the design system components instead of creating custom ones
- Follow the design token system for colors, spacing, and typography
- Ensure components are accessible by following WCAG guidelines
- Test components in both light and dark modes
- Use semantic HTML elements for better accessibility
- Maintain consistent spacing and sizing using the token system
- Use the provided hooks for responsive design and toast notifications

## Documentation References

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Primitives](https://www.radix-ui.com/primitives)
- [React Hook Form Documentation](https://react-hook-form.com/)
- [Zod Documentation](https://zod.dev/)
- [WCAG Accessibility Guidelines](https://www.w3.org/WAI/standards-guidelines/wcag/)

## Contributing Guidelines

1. Ensure all new code follows the project's TypeScript configuration
2. Add SPDX license headers to all new files
3. Keep dependencies minimal and up-to-date
4. Write tests for new components
5. Follow the project's naming conventions
6. Document new components with examples

## License

MIT
