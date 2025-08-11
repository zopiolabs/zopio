/**
 * SPDX-License-Identifier: MIT
 */

import FormBuilder from '@repo/design-system/ui/form-builder';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof FormBuilder> = {
  title: 'FormBuilder/FormBuilder',
  component: FormBuilder,
  parameters: {
    layout: 'fullscreen',
    docs: {
      description: {
        component:
          'A complete form builder interface with drag-and-drop components, property editing, and export functionality. Build forms visually with a component library, real-time preview, and code generation.',
      },
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof FormBuilder>;

export const Default: Story = {
  name: 'Form Builder',
  parameters: {
    docs: {
      description: {
        story:
          'The main form builder interface with all components and functionality. Includes component library sidebar, form preview area, and properties panel.',
      },
    },
  },
};

export const Documentation: Story = {
  name: 'How to Use',
  parameters: {
    docs: {
      description: {
        story: `
## Features

- **Component Library**: Drag components from the sidebar to build your form
- **Visual Editor**: Real-time form preview with component selection
- **Properties Panel**: Configure component properties, validation, and styling
- **Export Functionality**: Generate production-ready React code with shadcn/ui components
- **Preview Mode**: See how your form will look to end users

## Usage

1. **Add Components**: Click on components in the left sidebar to add them to your form
2. **Configure Properties**: Select a component in the preview to edit its properties in the right panel
3. **Preview**: Click the "Preview" button to see how your form will look to users
4. **Export**: Click "Export" to get the generated React code and installation instructions

## Component Types

### Input Fields
- Text, Email, Password, Number, URL, Telephone
- Textarea for multi-line text
- File upload
- Date picker

### Selection Fields
- Select dropdown
- Checkbox (single and groups)
- Radio button groups
- Toggle switches

### Actions
- Generic buttons
- Submit buttons
- Reset buttons

### Typography
- Rich text blocks for content
        `,
      },
    },
  },
  render: () => <FormBuilder />,
};
