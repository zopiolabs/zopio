/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import {
  CreditCard,
  Laptop,
  Shield,
  Smartphone,
  Star,
  Tablet,
  Zap,
} from 'lucide-react';
import { useState } from 'react';

import { Button } from '@repo/design-system/ui/button';
import {
  Choicebox,
  ChoiceboxGroup,
  useChoicebox,
} from '@repo/design-system/ui/choicebox';

/**
 * Choiceboxes are a great way to show radio or checkbox options with a card style.
 */
const meta: Meta<typeof Choicebox> = {
  title: 'ui/Choicebox',
  component: Choicebox,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'selected'],
      description: 'Visual variant of the choicebox',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the choicebox',
    },
    orientation: {
      control: { type: 'select' },
      options: ['horizontal', 'vertical'],
      description: 'Layout orientation',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disable the choicebox',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic radio button choiceboxes.
 */
export const Default: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <div className="w-96">
        <ChoiceboxGroup
          value={value}
          onValueChange={(val) => setValue(val as string)}
          type="radio"
        >
          <Choicebox
            value="option1"
            title="Option 1"
            description="This is the first option"
          />
          <Choicebox
            value="option2"
            title="Option 2"
            description="This is the second option"
          />
          <Choicebox
            value="option3"
            title="Option 3"
            description="This is the third option"
          />
        </ChoiceboxGroup>

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {value}
        </div>
      </div>
    );
  },
};

/**
 * Checkbox choiceboxes for multiple selection.
 */
export const Checkbox: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['feature1']);

    return (
      <div className="w-96">
        <ChoiceboxGroup
          value={values}
          onValueChange={(val) => setValues(val as string[])}
          type="checkbox"
        >
          <Choicebox
            value="feature1"
            title="Advanced Analytics"
            description="Get detailed insights into your data"
          />
          <Choicebox
            value="feature2"
            title="Priority Support"
            description="24/7 support with faster response times"
          />
          <Choicebox
            value="feature3"
            title="Custom Integrations"
            description="Connect with your existing tools"
          />
          <Choicebox
            value="feature4"
            title="Team Collaboration"
            description="Work together with unlimited team members"
          />
        </ChoiceboxGroup>

        <div className="mt-4 rounded bg-muted p-3 text-sm">
          Selected: {values.join(', ') || 'None'}
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
    const [value, setValue] = useState('medium');

    return (
      <div className="w-96 space-y-6">
        <div>
          <h4 className="mb-2 font-medium text-sm">Small</h4>
          <ChoiceboxGroup
            value={value}
            onValueChange={(val) => setValue(val as string)}
            type="radio"
          >
            <Choicebox
              value="small"
              size="sm"
              title="Small Option"
              description="Compact size"
            />
          </ChoiceboxGroup>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-sm">Medium</h4>
          <ChoiceboxGroup
            value={value}
            onValueChange={(val) => setValue(val as string)}
            type="radio"
          >
            <Choicebox
              value="medium"
              size="md"
              title="Medium Option"
              description="Standard size with good balance"
            />
          </ChoiceboxGroup>
        </div>

        <div>
          <h4 className="mb-2 font-medium text-sm">Large</h4>
          <ChoiceboxGroup
            value={value}
            onValueChange={(val) => setValue(val as string)}
            type="radio"
          >
            <Choicebox
              value="large"
              size="lg"
              title="Large Option"
              description="Spacious size for better visibility and touch targets"
            />
          </ChoiceboxGroup>
        </div>
      </div>
    );
  },
};

/**
 * Horizontal layout.
 */
export const Horizontal: Story = {
  render: () => {
    const [value, setValue] = useState('starter');

    return (
      <div className="w-full max-w-4xl">
        <ChoiceboxGroup
          value={value}
          onValueChange={(val) => setValue(val as string)}
          type="radio"
          orientation="horizontal"
        >
          <Choicebox
            value="starter"
            orientation="vertical"
            className="flex-1"
            header="STARTER"
            title="$9/month"
            description="Perfect for individuals getting started"
          />
          <Choicebox
            value="pro"
            orientation="vertical"
            className="flex-1"
            header="PRO"
            title="$29/month"
            description="Great for growing teams and businesses"
          />
          <Choicebox
            value="enterprise"
            orientation="vertical"
            className="flex-1"
            header="ENTERPRISE"
            title="Custom"
            description="Advanced features for large organizations"
          />
        </ChoiceboxGroup>
      </div>
    );
  },
};

/**
 * With custom indicators and icons.
 */
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState('mobile');

    return (
      <div className="w-96">
        <ChoiceboxGroup
          value={value}
          onValueChange={(val) => setValue(val as string)}
          type="radio"
        >
          <Choicebox
            value="mobile"
            title="Mobile App"
            description="iOS and Android applications"
            indicator={<Smartphone className="h-5 w-5 text-primary" />}
          />
          <Choicebox
            value="desktop"
            title="Desktop App"
            description="Windows, macOS, and Linux"
            indicator={<Laptop className="h-5 w-5 text-primary" />}
          />
          <Choicebox
            value="tablet"
            title="Tablet App"
            description="Optimized for iPad and tablets"
            indicator={<Tablet className="h-5 w-5 text-primary" />}
          />
        </ChoiceboxGroup>
      </div>
    );
  },
};

/**
 * Payment method selection.
 */
export const PaymentMethods: Story = {
  render: () => {
    const [value, setValue] = useState('card');

    return (
      <div className="w-96">
        <h3 className="mb-4 font-semibold text-lg">Payment Method</h3>
        <ChoiceboxGroup
          value={value}
          onValueChange={(val) => setValue(val as string)}
          type="radio"
        >
          <Choicebox
            value="card"
            title="Credit Card"
            description="Pay with Visa, Mastercard, or American Express"
            indicator={<CreditCard className="h-5 w-5 text-primary" />}
          />
          <Choicebox
            value="bank"
            title="Bank Transfer"
            description="Direct transfer from your bank account"
            indicator={
              <div className="flex h-5 w-5 items-center justify-center rounded bg-primary font-bold text-primary-foreground text-xs">
                B
              </div>
            }
          />
          <Choicebox
            value="crypto"
            title="Cryptocurrency"
            description="Pay with Bitcoin, Ethereum, or other crypto"
            indicator={
              <div className="flex h-5 w-5 items-center justify-center rounded-full bg-orange-500 font-bold text-white text-xs">
                ₿
              </div>
            }
          />
        </ChoiceboxGroup>
      </div>
    );
  },
};

/**
 * Feature selection with headers.
 */
export const WithHeaders: Story = {
  render: () => {
    const [values, setValues] = useState<string[]>(['analytics']);

    return (
      <div className="w-96">
        <h3 className="mb-4 font-semibold text-lg">Add-on Features</h3>
        <ChoiceboxGroup
          value={values}
          onValueChange={(val) => setValues(val as string[])}
          type="checkbox"
        >
          <Choicebox
            value="analytics"
            header="ANALYTICS"
            title="Advanced Analytics"
            description="Detailed insights and reporting dashboard"
            indicator={<Star className="h-5 w-5 text-yellow-500" />}
          />
          <Choicebox
            value="performance"
            header="PERFORMANCE"
            title="Performance Boost"
            description="2x faster processing and response times"
            indicator={<Zap className="h-5 w-5 text-blue-500" />}
          />
          <Choicebox
            value="security"
            header="SECURITY"
            title="Enhanced Security"
            description="Advanced encryption and security features"
            indicator={<Shield className="h-5 w-5 text-green-500" />}
          />
        </ChoiceboxGroup>
      </div>
    );
  },
};

/**
 * Disabled state.
 */
export const Disabled: Story = {
  render: () => (
    <div className="w-96">
      <ChoiceboxGroup type="radio" disabled>
        <Choicebox
          value="option1"
          title="Disabled Option 1"
          description="This option is not available"
        />
        <Choicebox
          value="option2"
          title="Disabled Option 2"
          description="This option is also not available"
        />
      </ChoiceboxGroup>
    </div>
  ),
};

/**
 * Controlled with external form.
 */
export const Controlled: Story = {
  render: () => {
    const [plan, setPlan] = useState('basic');
    const [addons, setAddons] = useState<string[]>([]);

    const handleSubmit = () => {
      alert(`Plan: ${plan}, Add-ons: ${addons.join(', ') || 'None'}`);
    };

    return (
      <div className="w-96 space-y-6">
        <div>
          <h3 className="mb-4 font-semibold text-lg">Choose Your Plan</h3>
          <ChoiceboxGroup
            value={plan}
            onValueChange={(val) => setPlan(val as string)}
            type="radio"
          >
            <Choicebox
              value="basic"
              header="BASIC"
              title="$10/month"
              description="Essential features for getting started"
            />
            <Choicebox
              value="premium"
              header="PREMIUM"
              title="$25/month"
              description="Advanced features and priority support"
            />
          </ChoiceboxGroup>
        </div>

        <div>
          <h3 className="mb-4 font-semibold text-lg">Add-ons</h3>
          <ChoiceboxGroup
            value={addons}
            onValueChange={(val) => setAddons(val as string[])}
            type="checkbox"
          >
            <Choicebox
              value="backup"
              title="Daily Backups"
              description="Automatic daily backups of your data"
            />
            <Choicebox
              value="ssl"
              title="SSL Certificate"
              description="Secure your site with HTTPS"
            />
          </ChoiceboxGroup>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleSubmit}>Continue with {plan} plan</Button>
          <Button
            variant="outline"
            onClick={() => {
              setPlan('basic');
              setAddons([]);
            }}
          >
            Reset
          </Button>
        </div>

        <div className="rounded bg-muted p-3 text-sm">
          <div>
            <strong>Plan:</strong> {plan}
          </div>
          <div>
            <strong>Add-ons:</strong> {addons.join(', ') || 'None'}
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Using the choicebox context hook.
 */
const ChoiceboxInfo = () => {
  const { value, type, disabled } = useChoicebox();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-3 gap-4">
        <div>
          <span className="font-medium">Type:</span>
          <div className="capitalize">{type}</div>
        </div>
        <div>
          <span className="font-medium">Value:</span>
          <div>{Array.isArray(value) ? value.join(', ') : value || 'None'}</div>
        </div>
        <div>
          <span className="font-medium">Disabled:</span>
          <div>{disabled ? 'Yes' : 'No'}</div>
        </div>
      </div>
    </div>
  );
};

export const WithContext: Story = {
  render: () => {
    const [value, setValue] = useState('option1');

    return (
      <div className="w-96">
        <ChoiceboxGroup
          value={value}
          onValueChange={(val) => setValue(val as string)}
          type="radio"
        >
          <Choicebox
            value="option1"
            title="Context Demo"
            description="This demonstrates the context hook"
          />
          <Choicebox
            value="option2"
            title="Live Updates"
            description="Values update in real-time"
          />
          <ChoiceboxInfo />
        </ChoiceboxGroup>
      </div>
    );
  },
};
