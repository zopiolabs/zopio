/**
 * SPDX-License-Identifier: MIT
 */

import type * as nextjs from '@storybook/nextjs';

import {
  Container,
  type ContainerSize,
} from '@repo/design-system/ui/container';

/**
 * Container component that centers content horizontally with a maximum width.
 * It's the most basic layout element used to constrain content width.
 */
const meta: nextjs.Meta<typeof Container> = {
  title: 'ui/Container',
  component: Container,
  tags: ['autodocs'],
  argTypes: {
    maxWidth: {
      control: 'select',
      options: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        'full',
      ],
      description: 'Maximum width of the container',
      table: {
        defaultValue: { summary: '8xl' },
      },
    },
    fluid: {
      control: 'boolean',
      description:
        'If true, the container will take up the full width of its parent',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    centered: {
      control: 'boolean',
      description: 'If true, the container will be centered horizontally',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    withPadding: {
      control: 'boolean',
      description:
        'If true, the container will have padding on the left and right',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
  },
  parameters: {
    layout: 'padded',
  },
};

export default meta;

type Story = nextjs.StoryObj<typeof meta>;

const ExampleContent = () => (
  <div className="w-full rounded-lg border-2 border-gray-300 border-dashed bg-gray-50 p-8 text-center">
    <p className="text-gray-600">Container Content</p>
  </div>
);

/**
 * The default container with maximum width of 8xl (1440px).
 */
export const Default: Story = {
  render: (args) => (
    <Container {...args}>
      <ExampleContent />
    </Container>
  ),
};

/**
 * Container with different maximum width sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {[
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
      ].map((size) => (
        <div key={size} className="flex flex-col gap-2">
          <p className="font-medium text-gray-500 text-sm">maxWidth: {size}</p>
          <Container maxWidth={size as ContainerSize}>
            <ExampleContent />
          </Container>
        </div>
      ))}
    </div>
  ),
};

/**
 * A fluid container that takes up the full width of its parent.
 */
export const Fluid: Story = {
  args: {
    fluid: true,
  },
  render: (args) => (
    <Container {...args}>
      <ExampleContent />
    </Container>
  ),
};

/**
 * Container without horizontal centering.
 */
export const NotCentered: Story = {
  args: {
    centered: false,
  },
  render: (args) => (
    <Container {...args}>
      <ExampleContent />
    </Container>
  ),
};

/**
 * Container without horizontal padding.
 */
export const WithoutPadding: Story = {
  args: {
    withPadding: false,
  },
  render: (args) => (
    <Container {...args}>
      <ExampleContent />
    </Container>
  ),
};

/**
 * Container with custom styling.
 */
export const CustomStyling: Story = {
  args: {
    className: 'bg-blue-50 rounded-xl shadow-md py-8',
  },
  render: (args) => (
    <Container {...args}>
      <ExampleContent />
    </Container>
  ),
};

/**
 * Nested containers example.
 */
export const Nested: Story = {
  render: () => (
    <Container maxWidth="8xl" className="rounded-lg bg-gray-100 p-8">
      <p className="mb-4 text-gray-600">Outer Container (8xl)</p>
      <Container maxWidth="4xl" className="rounded-lg bg-white p-8 shadow-sm">
        <p className="mb-4 text-gray-600">Inner Container (4xl)</p>
        <Container maxWidth="md" className="rounded-lg bg-blue-50 p-8">
          <p className="text-gray-600">Innermost Container (md)</p>
        </Container>
      </Container>
    </Container>
  ),
};
