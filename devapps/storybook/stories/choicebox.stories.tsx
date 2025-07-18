/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import type React from 'react';
import { useState } from 'react';

import {
  Choicebox,
  ChoiceboxItem,
  ChoiceboxItemContent,
  ChoiceboxItemDescription,
  ChoiceboxItemHeader,
  ChoiceboxItemIndicator,
  ChoiceboxItemSubtitle,
  ChoiceboxItemTitle,
  DraggableChoicebox,
} from '@repo/design-system/ui/choicebox';

/**
 * Choiceboxes are a great way to show radio or checkbox options with a card style.
 */
const meta: Meta<typeof Choicebox> = {
  title: 'ui/Choicebox',
  component: Choicebox,
  tags: ['autodocs'],
  argTypes: {},
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default form of the choicebox.
 */
export const Default: Story = {
  render: () => (
    <Choicebox defaultValue="snippet" className="grid gap-4">
      <ChoiceboxItem value="snippet">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>
            Snippet
            <ChoiceboxItemSubtitle>
              Code display component
            </ChoiceboxItemSubtitle>
          </ChoiceboxItemTitle>
          <ChoiceboxItemDescription>
            Snippet is a component that allows you to display and copy code in a
            tabbed interface.
          </ChoiceboxItemDescription>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
      <ChoiceboxItem value="combobox">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>
            Combobox
            <ChoiceboxItemSubtitle>Input component</ChoiceboxItemSubtitle>
          </ChoiceboxItemTitle>
          <ChoiceboxItemDescription>
            Autocomplete input and command palette with a list of suggestions.
          </ChoiceboxItemDescription>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
    </Choicebox>
  ),
};

/**
 * Inline choiceboxes displayed in a horizontal layout.
 */
export const Inline: Story = {
  render: () => (
    <Choicebox defaultValue="snippet" className="flex gap-4">
      <ChoiceboxItem value="snippet" className="flex-1">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>
            Snippet
            <ChoiceboxItemSubtitle>
              Code display component
            </ChoiceboxItemSubtitle>
          </ChoiceboxItemTitle>
          <ChoiceboxItemDescription>
            Snippet is a component that allows you to display and copy code in a
            tabbed interface.
          </ChoiceboxItemDescription>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
      <ChoiceboxItem value="combobox" className="flex-1">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>
            Combobox
            <ChoiceboxItemSubtitle>Input component</ChoiceboxItemSubtitle>
          </ChoiceboxItemTitle>
          <ChoiceboxItemDescription>
            Autocomplete input and command palette with a list of suggestions.
          </ChoiceboxItemDescription>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
    </Choicebox>
  ),
};

/**
 * Compact choiceboxes with minimal content.
 */
export const Compact: Story = {
  render: () => (
    <Choicebox defaultValue="small" className="grid gap-2">
      <ChoiceboxItem value="small">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Small</ChoiceboxItemTitle>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
      <ChoiceboxItem value="medium">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Medium</ChoiceboxItemTitle>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
      <ChoiceboxItem value="large">
        <ChoiceboxItemHeader>
          <ChoiceboxItemTitle>Large</ChoiceboxItemTitle>
        </ChoiceboxItemHeader>
        <ChoiceboxItemContent>
          <ChoiceboxItemIndicator />
        </ChoiceboxItemContent>
      </ChoiceboxItem>
    </Choicebox>
  ),
};

/**
 * Draggable choiceboxes that can be reordered via drag and drop.
 */
export const Draggable: Story = {
  render: () => {
    // Define the item type to match the DraggableChoicebox props
    type ChoiceboxItem = {
      id: string;
      value: string;
      content: React.ReactNode;
    };

    // Using useState with the correct type
    const [items, setItems] = useState<ChoiceboxItem[]>([
      {
        id: '1',
        value: 'small',
        content: (
          <>
            <ChoiceboxItemHeader>
              <ChoiceboxItemTitle>Small</ChoiceboxItemTitle>
              <ChoiceboxItemDescription>
                The smallest size option
              </ChoiceboxItemDescription>
            </ChoiceboxItemHeader>
            <ChoiceboxItemContent>
              <ChoiceboxItemIndicator />
            </ChoiceboxItemContent>
          </>
        ),
      },
      {
        id: '2',
        value: 'medium',
        content: (
          <>
            <ChoiceboxItemHeader>
              <ChoiceboxItemTitle>Medium</ChoiceboxItemTitle>
              <ChoiceboxItemDescription>
                The medium size option
              </ChoiceboxItemDescription>
            </ChoiceboxItemHeader>
            <ChoiceboxItemContent>
              <ChoiceboxItemIndicator />
            </ChoiceboxItemContent>
          </>
        ),
      },
      {
        id: '3',
        value: 'large',
        content: (
          <>
            <ChoiceboxItemHeader>
              <ChoiceboxItemTitle>Large</ChoiceboxItemTitle>
              <ChoiceboxItemDescription>
                The largest size option
              </ChoiceboxItemDescription>
            </ChoiceboxItemHeader>
            <ChoiceboxItemContent>
              <ChoiceboxItemIndicator />
            </ChoiceboxItemContent>
          </>
        ),
      },
    ]);

    return (
      <div className="space-y-4">
        <p className="text-muted-foreground text-sm">
          Drag items to reorder them. Current order:{' '}
          {items.map((item) => item.value).join(', ')}
        </p>
        <DraggableChoicebox
          defaultValue="medium"
          className="space-y-2"
          items={items}
          onReorder={setItems}
        />
      </div>
    );
  },
};
