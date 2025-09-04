/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { MapPin, Users } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Combobox,
  type ComboboxItemData,
} from '@repo/design-system/ui/combobox';
import { Label } from '@repo/design-system/ui/label';

/**
 * Autocomplete input and command palette with a list of suggestions.
 */
const meta: Meta<typeof Combobox> = {
  title: 'ui/Combobox',
  component: Combobox,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the combobox',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the combobox',
    },
    placeholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the trigger',
    },
    searchPlaceholder: {
      control: { type: 'text' },
      description: 'Placeholder text for the search input',
    },
    emptyMessage: {
      control: { type: 'text' },
      description: 'Message shown when no results are found',
    },
    allowCreateNew: {
      control: { type: 'boolean' },
      description: 'Allow creating new items',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const frameworks: ComboboxItemData[] = [
  { value: 'react', label: 'React' },
  { value: 'vue', label: 'Vue.js' },
  { value: 'angular', label: 'Angular' },
  { value: 'svelte', label: 'Svelte' },
  { value: 'solid', label: 'SolidJS' },
  { value: 'qwik', label: 'Qwik' },
];

/**
 * Basic combobox with framework selection.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('');

    return (
      <div className="w-80">
        <Combobox
          items={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="Select framework..."
        />

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {value || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => {
    const [values, setValues] = useState({ sm: '', md: '', lg: '' });

    return (
      <div className="w-80 space-y-4">
        <div>
          <Label className="mb-2 block font-medium text-sm">Small</Label>
          <Combobox
            size="sm"
            items={frameworks}
            value={values.sm}
            onValueChange={(val) => setValues((prev) => ({ ...prev, sm: val }))}
            placeholder="Select framework..."
          />
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Medium</Label>
          <Combobox
            size="md"
            items={frameworks}
            value={values.md}
            onValueChange={(val) => setValues((prev) => ({ ...prev, md: val }))}
            placeholder="Select framework..."
          />
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Large</Label>
          <Combobox
            size="lg"
            items={frameworks}
            value={values.lg}
            onValueChange={(val) => setValues((prev) => ({ ...prev, lg: val }))}
            placeholder="Select framework..."
          />
        </div>
      </div>
    );
  },
};

/**
 * Controlled combobox with external state management.
 */
export const Controlled: Story = {
  render: () => {
    const [value, setValue] = useState('react');

    return (
      <div className="w-80 space-y-4">
        <Combobox
          items={frameworks}
          value={value}
          onValueChange={setValue}
          placeholder="Select framework..."
        />

        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={() => setValue('vue')}>
            Select Vue
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setValue('angular')}
          >
            Select Angular
          </Button>
          <Button variant="outline" size="sm" onClick={() => setValue('')}>
            Clear
          </Button>
        </div>

        <div className="rounded bg-muted p-3 text-sm">
          Current value: {value || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Create new items functionality.
 */
export const CreateNew: Story = {
  render: () => {
    const [value, setValue] = useState('');
    const [items, setItems] = useState<ComboboxItemData[]>([
      { value: 'apple', label: 'Apple' },
      { value: 'banana', label: 'Banana' },
      { value: 'orange', label: 'Orange' },
    ]);

    const handleCreateNew = (newValue: string) => {
      const newItem = {
        value: newValue.toLowerCase().replace(/\s+/g, '-'),
        label: newValue,
      };
      setItems((prev) => [...prev, newItem]);
      setValue(newItem.value);
    };

    return (
      <div className="w-80">
        <Combobox
          items={items}
          value={value}
          onValueChange={setValue}
          placeholder="Select or create fruit..."
          allowCreateNew
          onCreateNew={handleCreateNew}
          emptyMessage="No fruits found. Type to create a new one!"
        />

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          <div>
            <strong>Selected:</strong> {value || 'None'}
          </div>
          <div>
            <strong>Total items:</strong> {items.length}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Company selection with grouped items.
 */
export const Companies: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const companies: ComboboxItemData[] = [
      { value: 'apple', label: 'Apple Inc.', group: 'Technology' },
      { value: 'google', label: 'Google', group: 'Technology' },
      { value: 'microsoft', label: 'Microsoft', group: 'Technology' },
      { value: 'tesla', label: 'Tesla', group: 'Automotive' },
      { value: 'ford', label: 'Ford', group: 'Automotive' },
      { value: 'toyota', label: 'Toyota', group: 'Automotive' },
      { value: 'jpmorgan', label: 'JPMorgan Chase', group: 'Finance' },
      { value: 'goldman', label: 'Goldman Sachs', group: 'Finance' },
    ];

    return (
      <div className="w-80">
        <Combobox
          items={companies}
          value={value}
          onValueChange={setValue}
          placeholder="Select company..."
          searchPlaceholder="Search companies..."
        />

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {companies.find((c) => c.value === value)?.label || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Location picker with icons.
 */
export const LocationPicker: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const locations: ComboboxItemData[] = [
      { value: 'new-york', label: 'New York, NY' },
      { value: 'san-francisco', label: 'San Francisco, CA' },
      { value: 'london', label: 'London, UK' },
      { value: 'tokyo', label: 'Tokyo, Japan' },
      { value: 'paris', label: 'Paris, France' },
      { value: 'berlin', label: 'Berlin, Germany' },
    ];

    return (
      <div className="w-80">
        <div className="mb-2 flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <Label className="font-medium text-sm">Location</Label>
        </div>

        <Combobox
          items={locations}
          value={value}
          onValueChange={setValue}
          placeholder="Select location..."
          searchPlaceholder="Search locations..."
        />

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {locations.find((l) => l.value === value)?.label || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Team member selection.
 */
export const TeamMembers: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const members: ComboboxItemData[] = [
      { value: 'john', label: 'John Doe', group: 'Engineering' },
      { value: 'jane', label: 'Jane Smith', group: 'Engineering' },
      { value: 'bob', label: 'Bob Johnson', group: 'Design' },
      { value: 'alice', label: 'Alice Brown', group: 'Design' },
      { value: 'charlie', label: 'Charlie Wilson', group: 'Product' },
      { value: 'diana', label: 'Diana Davis', group: 'Product' },
    ];

    return (
      <div className="w-80">
        <div className="mb-2 flex items-center gap-2">
          <Users className="h-4 w-4 text-muted-foreground" />
          <Label className="font-medium text-sm">Assign to</Label>
        </div>

        <Combobox
          items={members}
          value={value}
          onValueChange={setValue}
          placeholder="Select team member..."
          searchPlaceholder="Search members..."
        />

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {members.find((m) => m.value === value)?.label || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-80">
      <Combobox
        items={frameworks}
        placeholder="This combobox is disabled"
        disabled
      />
    </div>
  ),
};

/**
 * With some disabled options.
 */
export const DisabledOptions: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const frameworksWithDisabled: ComboboxItemData[] = [
      { value: 'react', label: 'React' },
      { value: 'vue', label: 'Vue.js' },
      { value: 'angular', label: 'Angular', disabled: true },
      { value: 'svelte', label: 'Svelte' },
      { value: 'solid', label: 'SolidJS', disabled: true },
      { value: 'qwik', label: 'Qwik' },
    ];

    return (
      <div className="w-80">
        <Combobox
          items={frameworksWithDisabled}
          value={value}
          onValueChange={setValue}
          placeholder="Select framework..."
        />

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {value || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Custom empty message.
 */
export const CustomEmpty: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const emptyItems: ComboboxItemData[] = [];

    return (
      <div className="w-80">
        <Combobox
          items={emptyItems}
          value={value}
          onValueChange={setValue}
          placeholder="Search for something..."
          emptyMessage="🔍 No results found. Try a different search term!"
        />
      </div>
    );
  },
};

/**
 * Large dataset with search.
 */
export const LargeDataset: Story = {
  render: () => {
    const [value, setValue] = useState('');

    const countries: ComboboxItemData[] = [
      { value: 'us', label: 'United States' },
      { value: 'ca', label: 'Canada' },
      { value: 'mx', label: 'Mexico' },
      { value: 'gb', label: 'United Kingdom' },
      { value: 'fr', label: 'France' },
      { value: 'de', label: 'Germany' },
      { value: 'it', label: 'Italy' },
      { value: 'es', label: 'Spain' },
      { value: 'jp', label: 'Japan' },
      { value: 'kr', label: 'South Korea' },
      { value: 'cn', label: 'China' },
      { value: 'in', label: 'India' },
      { value: 'au', label: 'Australia' },
      { value: 'br', label: 'Brazil' },
      { value: 'ar', label: 'Argentina' },
      { value: 'za', label: 'South Africa' },
      { value: 'eg', label: 'Egypt' },
      { value: 'ng', label: 'Nigeria' },
      { value: 'ru', label: 'Russia' },
      { value: 'se', label: 'Sweden' },
    ];

    return (
      <div className="w-80">
        <Combobox
          items={countries}
          value={value}
          onValueChange={setValue}
          placeholder="Select country..."
          searchPlaceholder="Search countries..."
        />

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {countries.find((c) => c.value === value)?.label || 'None'}
        </div>
      </div>
    );
  },
};

/**
 * Form integration example.
 */
export const FormIntegration: Story = {
  render: () => {
    const [formData, setFormData] = useState({
      framework: '',
      language: '',
      database: '',
    });

    const languages: ComboboxItemData[] = [
      { value: 'typescript', label: 'TypeScript' },
      { value: 'javascript', label: 'JavaScript' },
      { value: 'python', label: 'Python' },
      { value: 'go', label: 'Go' },
      { value: 'rust', label: 'Rust' },
    ];

    const databases: ComboboxItemData[] = [
      { value: 'postgresql', label: 'PostgreSQL' },
      { value: 'mysql', label: 'MySQL' },
      { value: 'mongodb', label: 'MongoDB' },
      { value: 'redis', label: 'Redis' },
      { value: 'sqlite', label: 'SQLite' },
    ];

    const handleSubmit = () => {
      alert(`Form data: ${JSON.stringify(formData, null, 2)}`);
    };

    return (
      <div className="w-80 space-y-4">
        <div>
          <Label className="mb-2 block font-medium text-sm">Framework</Label>
          <Combobox
            items={frameworks}
            value={formData.framework}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, framework: val }))
            }
            placeholder="Select framework..."
          />
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Language</Label>
          <Combobox
            items={languages}
            value={formData.language}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, language: val }))
            }
            placeholder="Select language..."
          />
        </div>

        <div>
          <Label className="mb-2 block font-medium text-sm">Database</Label>
          <Combobox
            items={databases}
            value={formData.database}
            onValueChange={(val) =>
              setFormData((prev) => ({ ...prev, database: val }))
            }
            placeholder="Select database..."
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Submit</Button>
          <Button
            variant="outline"
            onClick={() =>
              setFormData({ framework: '', language: '', database: '' })
            }
          >
            Reset
          </Button>
        </div>

        <div className="rounded bg-muted p-3 text-sm">
          <div>
            <strong>Framework:</strong> {formData.framework || 'None'}
          </div>
          <div>
            <strong>Language:</strong> {formData.language || 'None'}
          </div>
          <div>
            <strong>Database:</strong> {formData.database || 'None'}
          </div>
        </div>
      </div>
    );
  },
};
