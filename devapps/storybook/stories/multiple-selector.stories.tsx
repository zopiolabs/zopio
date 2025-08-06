/**
 * SPDX-License-Identifier: MIT
 */

import { MultipleSelector, type Option } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

const meta: Meta<typeof MultipleSelector> = {
  title: 'UI/MultipleSelector',
  component: MultipleSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof MultipleSelector>;

const FRAMEWORK_OPTIONS: Option[] = [
  { label: 'Next.js', value: 'nextjs' },
  { label: 'React', value: 'react' },
  { label: 'Remix', value: 'remix' },
  { label: 'Vite', value: 'vite' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Vue', value: 'vue' },
  { label: 'Svelte', value: 'svelte' },
  { label: 'Angular', value: 'angular' },
  { label: 'Ember', value: 'ember', disable: true },
  { label: 'Gatsby', value: 'gatsby', disable: true },
  { label: 'Astro', value: 'astro' },
];

const GROUPED_OPTIONS: Option[] = [
  { label: 'Next.js', value: 'nextjs', group: 'React Based' },
  { label: 'React', value: 'react', group: 'React Based' },
  { label: 'Remix', value: 'remix', group: 'React Based' },
  { label: 'Vite', value: 'vite', group: 'Build Tools' },
  { label: 'Nuxt', value: 'nuxt', group: 'Vue Based' },
  { label: 'Vue', value: 'vue', group: 'Vue Based' },
  { label: 'Svelte', value: 'svelte', group: 'Other' },
  { label: 'Angular', value: 'angular', group: 'Other' },
  { label: 'Ember', value: 'ember', group: 'Other', disable: true },
  { label: 'Gatsby', value: 'gatsby', group: 'React Based', disable: true },
  { label: 'Astro', value: 'astro', group: 'Other' },
];

/**
 * Default multiple selector with basic options
 */
export const Default: Story = {
  render: () => (
    <div className="w-full max-w-md px-10">
      <MultipleSelector
        defaultOptions={FRAMEWORK_OPTIONS}
        placeholder="Select frameworks you like..."
        emptyIndicator={
          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  ),
};

/**
 * Multiple selector with grouped options
 */
export const Grouped: Story = {
  render: () => (
    <div className="w-full max-w-md px-10">
      <MultipleSelector
        defaultOptions={GROUPED_OPTIONS}
        groupBy="group"
        placeholder="Select frameworks by category..."
        emptyIndicator={
          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  ),
};

/**
 * Multiple selector with creatable options
 */
export const Creatable: Story = {
  render: () => (
    <div className="w-full max-w-md px-10">
      <MultipleSelector
        defaultOptions={FRAMEWORK_OPTIONS}
        placeholder="Create or select frameworks..."
        creatable
        emptyIndicator={
          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  ),
};

/**
 * Multiple selector with maximum selection limit
 */
export const MaxSelected: Story = {
  render: () => (
    <div className="w-full max-w-md px-10">
      <MultipleSelector
        defaultOptions={FRAMEWORK_OPTIONS}
        placeholder="Select up to 3 frameworks..."
        maxSelected={3}
        onMaxSelected={(maxLimit) =>
          alert(`You can only select ${maxLimit} items`)
        }
        emptyIndicator={
          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  ),
};

/**
 * Multiple selector with controlled values
 */
export const Controlled: Story = {
  render: () => {
    // We need to use a wrapper component for useState
    const ControlledDemo = () => {
      const [selected, setSelected] = useState<Option[]>([
        { label: 'Next.js', value: 'nextjs' },
      ]);

      return (
        <div className="w-full max-w-md px-10">
          <div className="mb-4">
            <p className="text-gray-600 text-sm dark:text-gray-400">
              Selected: {selected.map((item) => item.label).join(', ')}
            </p>
          </div>
          <MultipleSelector
            value={selected}
            onChange={setSelected}
            defaultOptions={FRAMEWORK_OPTIONS}
            placeholder="Select frameworks..."
            emptyIndicator={
              <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
                No results found.
              </p>
            }
          />
        </div>
      );
    };

    return <ControlledDemo />;
  },
};

/**
 * Multiple selector with fixed options that can't be removed
 */
export const FixedOptions: Story = {
  render: () => (
    <div className="w-full max-w-md px-10">
      <MultipleSelector
        defaultOptions={FRAMEWORK_OPTIONS}
        placeholder="Select frameworks..."
        value={[
          { label: 'Next.js', value: 'nextjs', fixed: true },
          { label: 'React', value: 'react', fixed: true },
        ]}
        emptyIndicator={
          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  ),
};

/**
 * Dark theme multiple selector
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="rounded-xl bg-gray-950 p-8">
      <MultipleSelector
        defaultOptions={FRAMEWORK_OPTIONS}
        placeholder="Select frameworks you like..."
        emptyIndicator={
          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  ),
};

/**
 * Multiple selector with disabled state
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-full max-w-md px-10">
      <MultipleSelector
        defaultOptions={FRAMEWORK_OPTIONS}
        placeholder="This selector is disabled"
        disabled
        value={[
          { label: 'Next.js', value: 'nextjs' },
          { label: 'React', value: 'react' },
        ]}
        emptyIndicator={
          <p className="text-center text-gray-600 text-lg leading-10 dark:text-gray-400">
            No results found.
          </p>
        }
      />
    </div>
  ),
};
