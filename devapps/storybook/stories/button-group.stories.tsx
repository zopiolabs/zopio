/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Mail, Settings, Trash, User } from 'lucide-react';

import { Button } from '@repo/design-system/ui';
import { ButtonGroup } from '@repo/design-system/ui';
import { Card } from '@repo/design-system/ui';

/**
 * ButtonGroup combines multiple buttons into a cohesive group with consistent styling.
 * It can be used for creating button toolbars, segmented controls, and other grouped actions.
 */
const meta: Meta<typeof ButtonGroup> = {
  title: 'ui/ButtonGroup',
  component: ButtonGroup,
  tags: ['autodocs'],
  argTypes: {
    separated: {
      control: 'boolean',
      description: 'Whether buttons should have visual separation',
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'icon'],
      description: 'Size of the buttons in the group',
    },
  },
  parameters: {
    layout: 'centered',
  },
  args: {
    separated: false,
    size: 'default',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default ButtonGroup with multiple buttons.
 */
export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Left</Button>
      <Button>Middle</Button>
      <Button>Right</Button>
    </ButtonGroup>
  ),
};

/**
 * ButtonGroup with different button variants.
 */
export const WithVariants: Story = {
  render: (args) => (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-2 font-medium text-sm">Default Variant</h3>
          <ButtonGroup {...args}>
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
        </div>

        <div>
          <h3 className="mb-2 font-medium text-sm">Secondary Variant</h3>
          <ButtonGroup {...args}>
            <Button variant="secondary">Left</Button>
            <Button variant="secondary">Middle</Button>
            <Button variant="secondary">Right</Button>
          </ButtonGroup>
        </div>

        <div>
          <h3 className="mb-2 font-medium text-sm">Outline Variant</h3>
          <ButtonGroup {...args}>
            <Button variant="outline">Left</Button>
            <Button variant="outline">Middle</Button>
            <Button variant="outline">Right</Button>
          </ButtonGroup>
        </div>

        <div>
          <h3 className="mb-2 font-medium text-sm">Ghost Variant</h3>
          <ButtonGroup {...args}>
            <Button variant="ghost">Left</Button>
            <Button variant="ghost">Middle</Button>
            <Button variant="ghost">Right</Button>
          </ButtonGroup>
        </div>
      </div>
    </Card>
  ),
};

/**
 * ButtonGroup with separated buttons.
 */
export const Separated: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Left</Button>
      <Button variant="outline">Middle</Button>
      <Button variant="outline">Right</Button>
    </ButtonGroup>
  ),
  args: {
    separated: true,
  },
};

/**
 * ButtonGroup with different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <Card className="p-6">
      <div className="flex flex-col gap-6">
        <div>
          <h3 className="mb-2 font-medium text-sm">Small Size</h3>
          <ButtonGroup size="sm">
            <Button size="sm">Left</Button>
            <Button size="sm">Middle</Button>
            <Button size="sm">Right</Button>
          </ButtonGroup>
        </div>

        <div>
          <h3 className="mb-2 font-medium text-sm">Default Size</h3>
          <ButtonGroup size="default">
            <Button>Left</Button>
            <Button>Middle</Button>
            <Button>Right</Button>
          </ButtonGroup>
        </div>

        <div>
          <h3 className="mb-2 font-medium text-sm">Large Size</h3>
          <ButtonGroup size="lg">
            <Button size="lg">Left</Button>
            <Button size="lg">Middle</Button>
            <Button size="lg">Right</Button>
          </ButtonGroup>
        </div>
      </div>
    </Card>
  ),
};

/**
 * ButtonGroup with icon buttons.
 */
export const WithIcons: Story = {
  render: (args) => (
    <ButtonGroup {...args} size="icon">
      <Button variant="outline" size="icon">
        <User className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Mail className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Settings className="h-4 w-4" />
      </Button>
      <Button variant="outline" size="icon">
        <Trash className="h-4 w-4" />
      </Button>
    </ButtonGroup>
  ),
};

/**
 * ButtonGroup that adapts to mobile screens.
 */
export const Responsive: Story = {
  render: (args) => (
    <Card className="w-full max-w-md p-6">
      <p className="mb-4 text-muted-foreground text-sm">
        This ButtonGroup stacks vertically on small screens and displays
        horizontally on larger screens.
      </p>
      <ButtonGroup {...args}>
        <Button variant="outline">Profile</Button>
        <Button variant="outline">Settings</Button>
        <Button variant="outline">Messages</Button>
        <Button variant="outline">Logout</Button>
      </ButtonGroup>
    </Card>
  ),
};
