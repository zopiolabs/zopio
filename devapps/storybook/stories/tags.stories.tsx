/**
 * SPDX-License-Identifier: MIT
 */

import { cn } from '@repo/design-system/lib/utils';
import {
  Tags,
  TagsContent,
  TagsEmpty,
  TagsGroup,
  TagsInput,
  TagsItem,
  TagsList,
  TagsTrigger,
  TagsValue,
} from '@repo/design-system/ui/tags';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { CheckIcon } from 'lucide-react';
import { useState } from 'react';

const meta: Meta<typeof Tags> = {
  title: 'ui/Tags',
  component: Tags,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof Tags>;

/**
 * Basic usage of the Tags component with default settings.
 */
export const Basic: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);

    const tags = [
      { value: 'react', label: 'React' },
      { value: 'nextjs', label: 'Next.js' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'tailwind', label: 'Tailwind CSS' },
      { value: 'ui', label: 'UI' },
    ];

    return (
      <div className="w-[350px]">
        <Tags open={open} onOpenChange={setOpen}>
          <TagsTrigger>
            {selectedTags.length > 0
              ? selectedTags.map((tag) => (
                  <TagsValue
                    key={tag}
                    onRemove={() => {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    }}
                  >
                    {tags.find((t) => t.value === tag)?.label}
                  </TagsValue>
                ))
              : null}
          </TagsTrigger>
          <TagsContent>
            <TagsInput placeholder="Search tags..." />
            <TagsList>
              <TagsEmpty>No tags found.</TagsEmpty>
              <TagsGroup>
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.value);
                  return (
                    <TagsItem
                      key={tag.value}
                      onSelect={() => {
                        setSelectedTags(
                          isSelected
                            ? selectedTags.filter((t) => t !== tag.value)
                            : [...selectedTags, tag.value]
                        );
                        setOpen(true);
                      }}
                    >
                      <span>{tag.label}</span>
                      {isSelected && <CheckIcon className="ml-auto size-4" />}
                    </TagsItem>
                  );
                })}
              </TagsGroup>
            </TagsList>
          </TagsContent>
        </Tags>
      </div>
    );
  },
};

/**
 * Example with filtering available tags based on user input.
 */
export const FilterTags: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [inputValue, setInputValue] = useState('');

    const allTags = [
      { value: 'react', label: 'React' },
      { value: 'nextjs', label: 'Next.js' },
      { value: 'typescript', label: 'TypeScript' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'tailwind', label: 'Tailwind CSS' },
      { value: 'ui', label: 'UI' },
      { value: 'design-system', label: 'Design System' },
      { value: 'component', label: 'Component' },
      { value: 'accessibility', label: 'Accessibility' },
      { value: 'responsive', label: 'Responsive' },
    ];

    const filteredTags = allTags.filter((tag) =>
      tag.label.toLowerCase().includes(inputValue.toLowerCase())
    );

    return (
      <div className="w-[350px]">
        <Tags open={open} onOpenChange={setOpen}>
          <TagsTrigger>
            {selectedTags.length > 0
              ? selectedTags.map((tag) => (
                  <TagsValue
                    key={tag}
                    onRemove={() => {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    }}
                  >
                    {allTags.find((t) => t.value === tag)?.label}
                  </TagsValue>
                ))
              : null}
          </TagsTrigger>
          <TagsContent>
            <TagsInput
              placeholder="Search tags..."
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
            />
            <TagsList>
              <TagsEmpty>No tags found.</TagsEmpty>
              <TagsGroup>
                {filteredTags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.value);
                  return (
                    <TagsItem
                      key={tag.value}
                      onSelect={() => {
                        setSelectedTags(
                          isSelected
                            ? selectedTags.filter((t) => t !== tag.value)
                            : [...selectedTags, tag.value]
                        );
                        setOpen(true);
                      }}
                    >
                      <span>{tag.label}</span>
                      {isSelected && <CheckIcon className="ml-auto size-4" />}
                    </TagsItem>
                  );
                })}
              </TagsGroup>
            </TagsList>
          </TagsContent>
        </Tags>
      </div>
    );
  },
};

/**
 * Example with custom styling for tags.
 */
export const CustomStyling: Story = {
  render: () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [selectedTags, setSelectedTags] = useState<string[]>([]);
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [open, setOpen] = useState(false);

    const tagColors: Record<string, string> = {
      bug: 'bg-red-100 text-red-800 hover:bg-red-200',
      feature: 'bg-green-100 text-green-800 hover:bg-green-200',
      enhancement: 'bg-blue-100 text-blue-800 hover:bg-blue-200',
      documentation: 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200',
      design: 'bg-purple-100 text-purple-800 hover:bg-purple-200',
    };

    const tags = [
      { value: 'bug', label: 'Bug' },
      { value: 'feature', label: 'Feature' },
      { value: 'enhancement', label: 'Enhancement' },
      { value: 'documentation', label: 'Documentation' },
      { value: 'design', label: 'Design' },
    ];

    return (
      <div className="w-[350px]">
        <Tags open={open} onOpenChange={setOpen}>
          <TagsTrigger>
            {selectedTags.length > 0
              ? selectedTags.map((tag) => (
                  <TagsValue
                    key={tag}
                    onRemove={() => {
                      setSelectedTags(selectedTags.filter((t) => t !== tag));
                    }}
                    className={cn('border-none', tagColors[tag])}
                  >
                    {tags.find((t) => t.value === tag)?.label}
                  </TagsValue>
                ))
              : null}
          </TagsTrigger>
          <TagsContent>
            <TagsInput placeholder="Search tags..." />
            <TagsList>
              <TagsEmpty>No tags found.</TagsEmpty>
              <TagsGroup>
                {tags.map((tag) => {
                  const isSelected = selectedTags.includes(tag.value);
                  return (
                    <TagsItem
                      key={tag.value}
                      onSelect={() => {
                        setSelectedTags(
                          isSelected
                            ? selectedTags.filter((t) => t !== tag.value)
                            : [...selectedTags, tag.value]
                        );
                        setOpen(true);
                      }}
                      className={
                        isSelected ? cn('bg-muted', tagColors[tag.value]) : ''
                      }
                    >
                      <span>{tag.label}</span>
                      {isSelected && <CheckIcon className="ml-auto size-4" />}
                    </TagsItem>
                  );
                })}
              </TagsGroup>
            </TagsList>
          </TagsContent>
        </Tags>
      </div>
    );
  },
};
