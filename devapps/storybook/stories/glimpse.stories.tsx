/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { CalendarIcon, ExternalLinkIcon } from 'lucide-react';

import { Button } from '@repo/design-system/ui/button';
import {
  Glimpse,
  GlimpseContent,
  GlimpseDescription,
  GlimpseImage,
  type GlimpseProps,
  GlimpseTitle,
  GlimpseTrigger,
} from '@repo/design-system/ui/glimpse';

/**
 * A component that shows a preview of a URL when hovering over a link.
 */
const meta = {
  title: 'ui/Glimpse',
  component: Glimpse,
  tags: ['autodocs'],
  argTypes: {},
  args: {},
  parameters: {
    layout: 'centered',
  },
} satisfies Meta<typeof Glimpse>;

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the Glimpse component.
 */
export const Default: Story = {
  render: (args: GlimpseProps) => (
    <Glimpse {...args}>
      <GlimpseTrigger asChild>
        <Button variant="link">Hover over me</Button>
      </GlimpseTrigger>
      <GlimpseContent className="w-80">
        <GlimpseTitle>Glimpse Component</GlimpseTitle>
        <GlimpseDescription>
          A component that shows a preview of a URL when hovering over a link.
        </GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  ),
};

/**
 * Example with an image.
 */
export const WithImage: Story = {
  render: (args: GlimpseProps) => (
    <Glimpse {...args}>
      <GlimpseTrigger asChild>
        <Button variant="link">Hover to see image preview</Button>
      </GlimpseTrigger>
      <GlimpseContent className="w-80">
        <GlimpseImage
          src="https://images.unsplash.com/photo-1571171637578-41bc2dd41cd2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D"
          alt="Programming"
        />
        <GlimpseTitle>Coding Environment</GlimpseTitle>
        <GlimpseDescription>
          A modern development environment with clean code and syntax
          highlighting.
        </GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  ),
};

/**
 * Example with custom styling.
 */
export const CustomStyling: Story = {
  render: (args: GlimpseProps) => (
    <Glimpse {...args}>
      <GlimpseTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2">
          <span>Custom styled glimpse</span>
          <ExternalLinkIcon />
        </Button>
      </GlimpseTrigger>
      <GlimpseContent className="w-96 border-slate-700 bg-gradient-to-br from-slate-900 to-slate-800">
        <GlimpseImage
          src="https://images.unsplash.com/photo-1550439062-609e1531270e?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OHx8cHJvZ3JhbW1pbmd8ZW58MHx8MHx8fDA%3D"
          alt="Code on screen"
          className="border-slate-700"
        />
        <GlimpseTitle className="text-white">
          Custom Styled Glimpse
        </GlimpseTitle>
        <GlimpseDescription className="text-slate-300">
          This example shows how to customize the styling of the Glimpse
          component with custom colors and gradients.
        </GlimpseDescription>
        <div className="mt-3 flex items-center gap-2 text-slate-400 text-xs">
          <CalendarIcon className="h-3 w-3" />
          <span>Last updated: July 14, 2025</span>
        </div>
      </GlimpseContent>
    </Glimpse>
  ),
};

/**
 * Example with instant hover behavior.
 */
export const Instant: Story = {
  render: (args: GlimpseProps) => (
    <Glimpse openDelay={0} closeDelay={0} {...args}>
      <GlimpseTrigger asChild>
        <Button variant="link">Instant hover (no delay)</Button>
      </GlimpseTrigger>
      <GlimpseContent className="w-80">
        <GlimpseTitle>Instant Hover</GlimpseTitle>
        <GlimpseDescription>
          This example has no delay when hovering or leaving the trigger
          element.
        </GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  ),
};

/**
 * Example showing a URL preview.
 */
export const UrlPreview: Story = {
  render: (args: GlimpseProps) => (
    <Glimpse {...args}>
      <GlimpseTrigger asChild>
        <a
          href="https://www.kibo-ui.com/components/editor"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-blue-500 hover:underline"
        >
          Editor Component <ExternalLinkIcon className="h-3 w-3" />
        </a>
      </GlimpseTrigger>
      <GlimpseContent className="w-80">
        <GlimpseImage
          src="https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8Y29kaW5nfGVufDB8fDB8fHww"
          alt="Editor Component"
        />
        <GlimpseTitle>Editor</GlimpseTitle>
        <GlimpseDescription>
          The Editor component is a powerful and flexible text editor that
          allows you to create and edit rich text content.
        </GlimpseDescription>
      </GlimpseContent>
    </Glimpse>
  ),
};
