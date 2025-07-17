/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import {
  Combobox,
  ComboboxContent,
  ComboboxCreateNew,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxSeparator,
  ComboboxTrigger,
} from '@repo/design-system/ui/combobox';

/**
 * Autocomplete input and command palette with a list of suggestions.
 */
const meta: Meta<typeof Combobox> = {
  title: 'ui/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

const frameworks = [
  { label: 'Next.js', value: 'next.js' },
  { label: 'SvelteKit', value: 'sveltekit' },
  { label: 'Nuxt', value: 'nuxt' },
  { label: 'Remix', value: 'remix' },
  { label: 'Astro', value: 'astro' },
  { label: 'SolidStart', value: 'solidstart' },
];

/**
 * The default form of the combobox.
 */
export const Default: Story = {
  render: () => (
    <Combobox data={frameworks} type="framework">
      <ComboboxTrigger className="w-[200px]" />
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxList>
          <ComboboxEmpty />
          <ComboboxGroup>
            {frameworks.map((framework) => (
              <ComboboxItem key={framework.value} value={framework.value}>
                {framework.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Controlled version of the combobox.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('next.js');
    const [open, setOpen] = useState(false);

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Selected value: {value || 'none'}
        </p>
        <Combobox
          data={frameworks}
          type="framework"
          value={value}
          onValueChange={setValue}
          open={open}
          onOpenChange={setOpen}
        >
          <ComboboxTrigger className="w-[200px]" />
          <ComboboxContent>
            <ComboboxInput />
            <ComboboxList>
              <ComboboxEmpty />
              <ComboboxGroup>
                {frameworks.map((framework) => (
                  <ComboboxItem key={framework.value} value={framework.value}>
                    {framework.label}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
};

/**
 * Fixed width combobox that doesn't adapt to the trigger width.
 */
export const FixedWidth: Story = {
  render: () => (
    <Combobox data={frameworks} type="framework">
      <ComboboxTrigger className="w-[200px]" />
      <ComboboxContent popoverOptions={{ className: 'w-[300px]' }}>
        <ComboboxInput />
        <ComboboxList>
          <ComboboxEmpty />
          <ComboboxGroup>
            {frameworks.map((framework) => (
              <ComboboxItem key={framework.value} value={framework.value}>
                {framework.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

/**
 * Combobox with the ability to create new items.
 */
export const CreateNew: Story = {
  render: () => {
    const [items, setItems] = useState([...frameworks]);

    const handleCreateNew = (value: string) => {
      const newItem = { label: value, value: value.toLowerCase() };
      setItems((prev) => [...prev, newItem]);
    };

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Type a new framework name and click "Create new" to add it to the
          list.
        </p>
        <Combobox data={items} type="framework">
          <ComboboxTrigger className="w-[250px]" />
          <ComboboxContent>
            <ComboboxInput />
            <ComboboxList>
              <ComboboxEmpty />
              <ComboboxGroup>
                {items.map((item) => (
                  <ComboboxItem key={item.value} value={item.value}>
                    {item.label}
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
              <ComboboxSeparator />
              <ComboboxCreateNew onCreateNew={handleCreateNew} />
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
      </div>
    );
  },
};

/**
 * Combobox with grouped items.
 */
export const GroupedItems: Story = {
  render: () => {
    const frontendFrameworks = [
      { label: 'React', value: 'react' },
      { label: 'Vue', value: 'vue' },
      { label: 'Svelte', value: 'svelte' },
    ];

    const backendFrameworks = [
      { label: 'Express', value: 'express' },
      { label: 'NestJS', value: 'nestjs' },
      { label: 'Django', value: 'django' },
    ];

    const allFrameworks = [...frontendFrameworks, ...backendFrameworks];

    return (
      <Combobox data={allFrameworks} type="framework">
        <ComboboxTrigger className="w-[200px]" />
        <ComboboxContent>
          <ComboboxInput />
          <ComboboxList>
            <ComboboxEmpty />
            <ComboboxGroup>
              {frontendFrameworks.map((framework) => (
                <ComboboxItem key={framework.value} value={framework.value}>
                  {framework.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
            <ComboboxSeparator />
            <ComboboxGroup>
              {backendFrameworks.map((framework) => (
                <ComboboxItem key={framework.value} value={framework.value}>
                  {framework.label}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    );
  },
};

/**
 * Custom trigger content example.
 */
export const CustomTrigger: Story = {
  render: () => (
    <Combobox data={frameworks} type="framework">
      <ComboboxTrigger className="w-[200px]">
        <span className="flex items-center gap-2">
          <span className="text-primary">🚀</span>
          <span>Select framework</span>
        </span>
      </ComboboxTrigger>
      <ComboboxContent>
        <ComboboxInput />
        <ComboboxList>
          <ComboboxEmpty />
          <ComboboxGroup>
            {frameworks.map((framework) => (
              <ComboboxItem key={framework.value} value={framework.value}>
                {framework.label}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};
