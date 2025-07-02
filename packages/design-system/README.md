# Design System

The design system package provides a comprehensive set of UI components, styles, and utilities to ensure a consistent user experience across the Zopio application.

## Features

- **UI Components**: A collection of reusable UI components built with shadcn/ui
- **Shared Components**: Higher-level components that can be used across different modules
- **Theme Tokens**: Consistent design tokens for colors, typography, spacing, etc.
- **i18n Support**: Built-in internationalization support for all components
- **Utilities**: Helper functions for styling, accessibility, and more

## Installation

```bash
pnpm install @repo/design-system
```

## Usage

### Importing Components

```tsx
// Import UI components
import { Button } from "@repo/design-system/components/ui/button";
import { Input } from "@repo/design-system/components/ui/input";

// Import shared components
import { FormField } from "@repo/design-system/components/shared";

// Use components
function MyForm() {
  return (
    <form>
      <FormField
        label="Name"
        name="name"
        placeholder="Enter your name"
        required
      />
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

### Using Theme Tokens

```tsx
import { tokens } from "@repo/design-system/theme";

// Access tokens directly
const primaryColor = tokens.colors.primary.DEFAULT;
const spacing = tokens.spacing[4]; // 1rem

// Use in styled components or CSS-in-JS
const StyledComponent = styled.div`
  color: ${tokens.colors.primary.DEFAULT};
  font-size: ${tokens.typography.fontSize.base};
  margin: ${tokens.spacing[4]};
`;
```

### Using i18n

```tsx
import { useTranslation } from "@repo/design-system/i18n";

function MyComponent() {
  // Use translations with a specific namespace
  const { t } = useTranslation("form");
  
  return (
    <div>
      <h2>{t("title")}</h2>
      <p>{t("description")}</p>
      <button>{t("submit")}</button>
    </div>
  );
}
```

## Component Categories

### Basic UI Components

- **Button**: Primary action element with multiple variants
- **Input**: Text input field
- **Checkbox**: Toggle selection
- **Radio**: Single selection from multiple options
- **Select**: Dropdown selection
- **Textarea**: Multi-line text input
- **Switch**: Toggle switch
- **Slider**: Range selection

### Layout Components

- **Card**: Container for related content
- **Dialog**: Modal dialog
- **Popover**: Contextual overlay
- **Tabs**: Tabbed interface
- **Accordion**: Expandable sections

### Form Components

- **FormField**: Combines label, input, and error message
- **SelectField**: Select dropdown with label and validation
- **Form**: Complete form with validation and submission

### Data Display

- **Table**: Data table with sorting and pagination
- **List**: Ordered or unordered list
- **Avatar**: User or entity representation
- **Badge**: Status indicator

### Feedback

- **Alert**: Important message
- **Toast**: Temporary notification
- **Progress**: Loading or progress indicator
- **Skeleton**: Loading placeholder

## Customization

The design system is built to be customizable while maintaining consistency. You can customize components in several ways:

### Theme Customization

You can override theme tokens by creating a custom theme:

```tsx
import { tokens } from "@repo/design-system/theme";

// Create custom theme
const customTheme = {
  ...tokens,
  colors: {
    ...tokens.colors,
    primary: {
      ...tokens.colors.primary,
      DEFAULT: '#0070f3', // Custom primary color
    },
  },
};
```

### Component Customization

Most components accept className props for styling:

```tsx
<Button 
  className="custom-button" 
  variant="outline"
>
  Custom Button
</Button>
```

## Best Practices

- Use the shared components whenever possible to maintain consistency
- Follow the design token system for colors, spacing, and typography
- Use the i18n system for all user-facing text
- Ensure components are accessible by following WCAG guidelines
- Test components in both light and dark modes

## Contributing

When adding new components or modifying existing ones:

1. Follow the established patterns and conventions
2. Update documentation with examples
3. Add proper TypeScript types
4. Include i18n support
5. Ensure accessibility compliance
6. Add tests for new functionality

## License

BUSL-1.1 - See the [LICENSE](../../LICENSE) file for details.

This package is part of the core Zopio framework, which uses the Business Source License 1.1.
