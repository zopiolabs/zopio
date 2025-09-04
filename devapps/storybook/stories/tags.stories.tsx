/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import { Label } from '@repo/design-system/ui/label';
import { type Tag, Tags } from '@repo/design-system/ui/tags';

/**
 * Tags are a way to apply multiple labels to an item.
 */
const meta: Meta<typeof Tags> = {
  title: 'ui/Tags',
  component: Tags,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the tags component',
    },
    allowCreate: {
      control: { type: 'boolean' },
      description: 'Allow creating new tags',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the tags input',
    },
    maxTags: {
      control: { type: 'number' },
      description: 'Maximum number of tags allowed',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the input',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const sampleTags: Tag[] = [
  { id: '1', label: 'React', value: 'react' },
  { id: '2', label: 'TypeScript', value: 'typescript' },
  { id: '3', label: 'Next.js', value: 'nextjs' },
  { id: '4', label: 'Tailwind CSS', value: 'tailwind' },
  { id: '5', label: 'JavaScript', value: 'javascript' },
  { id: '6', label: 'Node.js', value: 'nodejs' },
  { id: '7', label: 'GraphQL', value: 'graphql' },
  { id: '8', label: 'MongoDB', value: 'mongodb' },
];

/**
 * The default tags component.
 */
export const Default: Story = {
  args: {
    availableTags: sampleTags,
    defaultValue: [sampleTags[0], sampleTags[1]],
  },
};

/**
 * Different sizes of tags components.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Small</h3>
        <Tags
          size="sm"
          availableTags={sampleTags}
          defaultValue={[sampleTags[0], sampleTags[1]]}
        />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Medium</h3>
        <Tags
          size="md"
          availableTags={sampleTags}
          defaultValue={[sampleTags[0], sampleTags[1]]}
        />
      </div>
      <div>
        <h3 className="mb-2 font-medium text-sm">Large</h3>
        <Tags
          size="lg"
          availableTags={sampleTags}
          defaultValue={[sampleTags[0], sampleTags[1]]}
        />
      </div>
    </div>
  ),
};

/**
 * Tags with create functionality.
 */
export const WithCreate: Story = {
  render: () => {
    const [tags, setTags] = useState<Tag[]>([sampleTags[0]]);
    const [availableTags, setAvailableTags] = useState(sampleTags);

    const handleTagCreate = (label: string) => {
      const newTag: Tag = {
        id: `custom-${Date.now()}`,
        label,
        value: label.toLowerCase().replace(/\s+/g, '-'),
      };
      setAvailableTags((prev) => [...prev, newTag]);
    };

    return (
      <Tags
        value={tags}
        onValueChange={setTags}
        availableTags={availableTags}
        onTagCreate={handleTagCreate}
        allowCreate
        placeholder="Type to search or create tags..."
      />
    );
  },
};

/**
 * Tags with maximum limit.
 */
export const WithMaxTags: Story = {
  args: {
    availableTags: sampleTags,
    maxTags: 3,
    placeholder: 'Maximum 3 tags allowed',
  },
};

/**
 * Disabled tags component.
 */
export const Disabled: Story = {
  args: {
    availableTags: sampleTags,
    defaultValue: [sampleTags[0], sampleTags[1]],
    disabled: true,
  },
};

/**
 * Controlled tags component.
 */
export const Controlled: Story = {
  render: () => {
    const [selectedTags, setSelectedTags] = useState<Tag[]>([sampleTags[0]]);

    return (
      <div className="space-y-4">
        <Tags
          value={selectedTags}
          onValueChange={setSelectedTags}
          availableTags={sampleTags}
          placeholder="Search available tags..."
        />
        <div className="text-muted-foreground text-sm">
          Selected: {selectedTags.map((tag) => tag.label).join(', ') || 'None'}
        </div>
        <Button
          onClick={() => setSelectedTags([])}
          className="text-blue-600 text-sm hover:text-blue-800"
        >
          Clear all tags
        </Button>
      </div>
    );
  },
};

/**
 * Tags in a form context.
 */
export const InForm: Story = {
  render: () => {
    const [skills, setSkills] = useState<Tag[]>([]);
    const [interests, setInterests] = useState<Tag[]>([]);

    const skillTags = sampleTags.slice(0, 4);
    const interestTags = [
      { id: 'i1', label: 'Photography', value: 'photography' },
      { id: 'i2', label: 'Travel', value: 'travel' },
      { id: 'i3', label: 'Music', value: 'music' },
      { id: 'i4', label: 'Sports', value: 'sports' },
    ];

    return (
      <form className="space-y-6 rounded-lg border p-6">
        <h3 className="font-semibold text-lg">Profile Information</h3>

        <div className="space-y-2">
          <Label className="font-medium text-sm">Technical Skills</Label>
          <Tags
            value={skills}
            onValueChange={setSkills}
            availableTags={skillTags}
            placeholder="Add your technical skills..."
            maxTags={5}
          />
        </div>

        <div className="space-y-2">
          <Label className="font-medium text-sm">Interests</Label>
          <Tags
            value={interests}
            onValueChange={setInterests}
            availableTags={interestTags}
            allowCreate
            placeholder="Add your interests..."
            onTagCreate={(label) => {
              const _newTag: Tag = {
                id: `interest-${Date.now()}`,
                label,
                value: label.toLowerCase().replace(/\s+/g, '-'),
              };
              // In real app, you'd add to availableTags
            }}
          />
        </div>

        <button
          type="submit"
          className="rounded bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
        >
          Save Profile
        </button>
      </form>
    );
  },
};

/**
 * Product tagging example.
 */
export const ProductTagging: Story = {
  render: () => {
    const [productTags, setProductTags] = useState<Tag[]>([
      { id: 'p1', label: 'Electronics', value: 'electronics' },
    ]);

    const categoryTags: Tag[] = [
      { id: 'c1', label: 'Electronics', value: 'electronics' },
      { id: 'c2', label: 'Computers', value: 'computers' },
      { id: 'c3', label: 'Mobile', value: 'mobile' },
      { id: 'c4', label: 'Gaming', value: 'gaming' },
      { id: 'c5', label: 'Audio', value: 'audio' },
      { id: 'c6', label: 'Accessories', value: 'accessories' },
    ];

    return (
      <div className="w-full max-w-md space-y-4 rounded-lg border p-6">
        <h3 className="font-semibold text-lg">Product Categories</h3>
        <p className="text-muted-foreground text-sm">
          Tag this product to help customers find it
        </p>

        <Tags
          value={productTags}
          onValueChange={setProductTags}
          availableTags={categoryTags}
          allowCreate
          placeholder="Search or create categories..."
          size="sm"
        />

        <div className="text-muted-foreground text-xs">
          {productTags.length} of 10 categories selected
        </div>
      </div>
    );
  },
};
