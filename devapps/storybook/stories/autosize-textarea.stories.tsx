/**
 * SPDX-License-Identifier: MIT
 */

import { AutosizeTextarea } from '@repo/design-system/ui/autosize-textarea';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof AutosizeTextarea> = {
  title: 'UI/AutosizeTextarea',
  component: AutosizeTextarea,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AutosizeTextarea>;

/**
 * Default autosize textarea with minimum height of 52px and unlimited max height
 */
export const Default: Story = {
  render: () => (
    <div className="w-96">
      <AutosizeTextarea placeholder="This textarea with min height 52px and unlimited max height." />
    </div>
  ),
};

/**
 * Autosize textarea with custom minimum height
 */
export const CustomMinHeight: Story = {
  render: () => (
    <div className="w-96">
      <AutosizeTextarea
        minHeight={80}
        placeholder="This textarea has a minimum height of 80px."
      />
    </div>
  ),
};

/**
 * Autosize textarea with maximum height limit
 */
export const WithMaxHeight: Story = {
  render: () => (
    <div className="w-96">
      <AutosizeTextarea
        maxHeight={150}
        placeholder="This textarea has a maximum height of 150px. When content exceeds this height, it will become scrollable."
      />
    </div>
  ),
};

/**
 * Autosize textarea with default value
 */
export const WithDefaultValue: Story = {
  render: () => (
    <div className="w-96">
      <AutosizeTextarea defaultValue="This textarea comes with pre-filled content that automatically adjusts its height. Try adding more text to see how it grows to accommodate the content." />
    </div>
  ),
};

/**
 * Controlled autosize textarea with character count
 */
export const Controlled: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [value, setValue] = useState('');

    return (
      <div className="w-96 space-y-2">
        <AutosizeTextarea
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="Type something here..."
        />
        <div className="text-right text-muted-foreground text-xs">
          Characters: {value.length}
        </div>
      </div>
    );
  },
};

/**
 * Disabled autosize textarea
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <AutosizeTextarea
        disabled
        defaultValue="This textarea is disabled and cannot be edited."
      />
    </div>
  ),
};

/**
 * Dark theme autosize textarea
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="w-96 rounded-xl bg-gray-950 p-8">
      <AutosizeTextarea
        placeholder="Dark theme autosize textarea..."
        className="border-gray-700 bg-gray-900 text-gray-200 placeholder:text-gray-500"
      />
    </div>
  ),
};

/**
 * Custom styled autosize textarea
 */
export const CustomStyled: Story = {
  render: () => (
    <div className="w-96">
      <AutosizeTextarea
        placeholder="Custom styled textarea..."
        className="rounded-xl border-2 border-purple-500 focus-visible:ring-purple-500"
      />
    </div>
  ),
};
