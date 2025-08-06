/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { LucideCheck, LucideStar } from 'lucide-react';

import { Radio, RadioGroup } from '@repo/design-system/ui';

/**
 * A radio component that allows users to select a single option from a list.
 * Supports various sizes, card layouts, and customization options.
 */
const meta: Meta<typeof Radio> = {
  title: 'UI/Radio',
  component: Radio,
  tags: ['autodocs'],
  argTypes: {
    size: {
      control: {
        type: 'select',
        options: ['sm', 'md', 'lg'],
      },
    },
    disabled: {
      control: 'boolean',
    },
    isCard: {
      control: 'boolean',
    },
    hideIndicator: {
      control: 'boolean',
    },
  },
  args: {
    value: 'default',
    label: 'Radio option',
    description: 'Description for the radio option',
    size: 'md',
    disabled: false,
    isCard: false,
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * The default radio button with label and description.
 */
export const Default: Story = {
  render: (args) => (
    <RadioGroup defaultValue="default">
      <Radio {...args} value="default" />
    </RadioGroup>
  ),
};

/**
 * Radio buttons with different sizes.
 */
export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <RadioGroup defaultValue="small">
        <Radio
          {...args}
          size="sm"
          value="small"
          label="Small radio"
          description="Compact size for dense UIs"
        />
      </RadioGroup>

      <RadioGroup defaultValue="medium">
        <Radio
          {...args}
          size="md"
          value="medium"
          label="Medium radio"
          description="Default size for most use cases"
        />
      </RadioGroup>

      <RadioGroup defaultValue="large">
        <Radio
          {...args}
          size="lg"
          value="large"
          label="Large radio"
          description="Larger size for better visibility"
        />
      </RadioGroup>
    </div>
  ),
};

/**
 * Radio button with disabled state.
 */
export const Disabled: Story = {
  render: (args) => (
    <div className="flex flex-col gap-4">
      <RadioGroup defaultValue="enabled">
        <Radio
          {...args}
          value="enabled"
          label="Enabled radio"
          description="This radio button is enabled"
          disabled={false}
        />
      </RadioGroup>

      <RadioGroup>
        <Radio
          {...args}
          value="disabled"
          label="Disabled radio"
          description="This radio button is disabled"
          disabled={true}
        />
      </RadioGroup>
    </div>
  ),
};

/**
 * Radio buttons in a group with a single selection.
 */
export const RadioGroupExample: Story = {
  render: (args) => (
    <RadioGroup defaultValue="comfortable" className="space-y-3">
      <Radio
        {...args}
        value="default"
        label="Default"
        description="System default spacing"
      />
      <Radio
        {...args}
        value="comfortable"
        label="Comfortable"
        description="More space between elements"
      />
      <Radio
        {...args}
        value="compact"
        label="Compact"
        description="Less space between elements"
      />
    </RadioGroup>
  ),
};

/**
 * Radio buttons with card layout.
 */
export const CardRadio: Story = {
  render: (args) => (
    <RadioGroup defaultValue="card1" className="space-y-3">
      <Radio
        {...args}
        isCard
        value="card1"
        label="Card Radio Option 1"
        description="Select this option to enable feature A"
      />
      <Radio
        {...args}
        isCard
        value="card2"
        label="Card Radio Option 2"
        description="Select this option to enable feature B"
      />
      <Radio
        {...args}
        isCard
        value="card3"
        label="Card Radio Option 3"
        description="Select this option to enable feature C"
      />
    </RadioGroup>
  ),
};

/**
 * Radio buttons with custom icons.
 */
export const CustomIcon: Story = {
  render: (args) => (
    <RadioGroup defaultValue="star" className="space-y-3">
      <Radio
        {...args}
        value="star"
        label="With Star Icon"
        description="Uses a star icon instead of the default circle"
        icon={
          <LucideStar className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-2 w-2 fill-primary text-primary" />
        }
      />
      <Radio
        {...args}
        value="check"
        label="With Check Icon"
        description="Uses a check icon instead of the default circle"
        icon={
          <LucideCheck className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 h-2 w-2 text-primary" />
        }
      />
    </RadioGroup>
  ),
};

/**
 * Radio buttons with custom styling using classNames.
 */
export const CustomStyling: Story = {
  render: (args) => (
    <RadioGroup defaultValue="custom1" className="space-y-3">
      <Radio
        {...args}
        value="custom1"
        label="Custom Primary"
        description="Radio with custom primary color"
        classNames={{
          button: 'border-primary data-[state=checked]:border-primary-600',
          indicator: 'data-[state=checked]:bg-primary-600',
          label: 'text-primary',
        }}
      />
      <Radio
        {...args}
        value="custom2"
        label="Custom Secondary"
        description="Radio with custom secondary color"
        classNames={{
          button: 'border-secondary data-[state=checked]:border-secondary-600',
          indicator: 'data-[state=checked]:bg-secondary-600',
          label: 'text-secondary',
        }}
      />
    </RadioGroup>
  ),
};

/**
 * Radio buttons without labels or descriptions.
 */
export const WithoutLabels: Story = {
  render: (args) => (
    <RadioGroup defaultValue="option1" className="flex gap-4">
      <Radio
        {...args}
        value="option1"
        label={undefined}
        description={undefined}
      />
      <Radio
        {...args}
        value="option2"
        label={undefined}
        description={undefined}
      />
      <Radio
        {...args}
        value="option3"
        label={undefined}
        description={undefined}
      />
    </RadioGroup>
  ),
};

/**
 * Radio buttons with only labels (no descriptions).
 */
export const OnlyLabels: Story = {
  render: (args) => (
    <RadioGroup defaultValue="option1" className="space-y-2">
      <Radio
        {...args}
        value="option1"
        label="Option 1"
        description={undefined}
      />
      <Radio
        {...args}
        value="option2"
        label="Option 2"
        description={undefined}
      />
      <Radio
        {...args}
        value="option3"
        label="Option 3"
        description={undefined}
      />
    </RadioGroup>
  ),
};

/**
 * Radio buttons with card layout in horizontal arrangement.
 */
export const HorizontalCardRadio: Story = {
  render: (args) => (
    <RadioGroup defaultValue="horizontal1" className="grid grid-cols-3 gap-3">
      <Radio
        {...args}
        isCard
        value="horizontal1"
        label="Option 1"
        description="Description for option 1"
      />
      <Radio
        {...args}
        isCard
        value="horizontal2"
        label="Option 2"
        description="Description for option 2"
      />
      <Radio
        {...args}
        isCard
        value="horizontal3"
        label="Option 3"
        description="Description for option 3"
      />
    </RadioGroup>
  ),
};

/**
 * Radio card with rich content.
 */
export const RichContentRadio: Story = {
  render: (args) => (
    <RadioGroup defaultValue="rich1" className="space-y-3">
      <Radio
        {...args}
        isCard
        value="rich1"
        label={
          <div className="flex items-center gap-2">
            <LucideStar className="h-4 w-4" />
            <span>Premium Plan</span>
            <span className="ml-auto rounded-full bg-primary px-2 py-0.5 text-primary-foreground text-xs">
              Recommended
            </span>
          </div>
        }
        description={
          <div className="mt-2">
            <p>All features included:</p>
            <ul className="mt-1 list-disc pl-4 text-xs">
              <li>Unlimited projects</li>
              <li>Priority support</li>
              <li>Custom branding</li>
            </ul>
          </div>
        }
      />
      <Radio
        {...args}
        isCard
        value="rich2"
        label={
          <div className="flex items-center gap-2">
            <span>Basic Plan</span>
          </div>
        }
        description={
          <div className="mt-2">
            <p>Basic features:</p>
            <ul className="mt-1 list-disc pl-4 text-xs">
              <li>Up to 3 projects</li>
              <li>Email support</li>
            </ul>
          </div>
        }
      />
    </RadioGroup>
  ),
};

/**
 * Radio buttons with validation states.
 */
export const ValidationStates: Story = {
  render: (args) => (
    <div className="space-y-6">
      <div>
        <h3 className="mb-2 font-medium text-sm">Valid</h3>
        <RadioGroup defaultValue="valid">
          <Radio
            {...args}
            value="valid"
            label="Valid option"
            description="This field is valid"
            className="aria-valid:border-success"
            aria-valid="true"
          />
        </RadioGroup>
      </div>

      <div>
        <h3 className="mb-2 font-medium text-sm">Invalid</h3>
        <RadioGroup defaultValue="invalid">
          <Radio
            {...args}
            value="invalid"
            label="Invalid option"
            description="This field has an error"
            className="aria-invalid:border-destructive"
            aria-invalid="true"
          />
        </RadioGroup>
      </div>
    </div>
  ),
};
