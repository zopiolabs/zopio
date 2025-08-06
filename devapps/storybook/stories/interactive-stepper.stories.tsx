/**
 * SPDX-License-Identifier: MIT
 */

import {
  InteractiveStepper,
  InteractiveStepperContent,
  InteractiveStepperDescription,
  InteractiveStepperIndicator,
  InteractiveStepperItem,
  InteractiveStepperSeparator,
  InteractiveStepperTitle,
  InteractiveStepperTrigger,
} from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import type { FC } from 'react';

interface CardProps {
  title: string;
  description: string;
}

const Card: FC<CardProps> = ({ title, description }) => (
  <div className="w-full rounded-lg border border-gray-700 bg-gray-900 p-4">
    <span className="font-semibold text-gray-300">{title}</span>
    <p className="text-gray-400 text-sm">{description}</p>
  </div>
);

const meta: Meta<typeof InteractiveStepper> = {
  title: 'UI/InteractiveStepper',
  component: InteractiveStepper,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InteractiveStepper>;

/**
 * Default vertical interactive stepper with basic steps
 */
export const Default: Story = {
  render: () => (
    <InteractiveStepper orientation="vertical">
      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order has been placed successfully
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              We are preparing your order
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order is on the way
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Order delivered to your address
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
      </InteractiveStepperItem>

      <InteractiveStepperContent step={1}>
        <Card
          title="Order Confirmed"
          description="Order #12345 placed on Jan 15, 2024"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={2}>
        <Card
          title="Processing Your Order"
          description="Estimated processing time: 1-2 business days"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={3}>
        <Card
          title="Shipping Information"
          description="Your package is on its way. Tracking number: TRK123456789"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={4}>
        <Card
          title="Order Delivered"
          description="Delivered to your location on Jan 20, 2024"
        />
      </InteractiveStepperContent>
    </InteractiveStepper>
  ),
};

/**
 * Horizontal interactive stepper with basic steps
 */
export const Horizontal: Story = {
  render: () => (
    <InteractiveStepper orientation="horizontal">
      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order has been placed successfully
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              We are preparing your order
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order is on the way
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Order delivered to your address
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
      </InteractiveStepperItem>

      <InteractiveStepperContent step={1}>
        <Card
          title="Order Confirmed"
          description="Order #12345 placed on Jan 15, 2024"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={2}>
        <Card
          title="Processing Your Order"
          description="Estimated processing time: 1-2 business days"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={3}>
        <Card
          title="Shipping Information"
          description="Your package is on its way. Tracking number: TRK123456789"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={4}>
        <Card
          title="Order Delivered"
          description="Delivered to your location on Jan 20, 2024"
        />
      </InteractiveStepperContent>
    </InteractiveStepper>
  ),
};

/**
 * Interactive stepper with content for each step
 */
export const WithContent: Story = {
  render: () => (
    <InteractiveStepper orientation="vertical">
      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order has been placed successfully
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              We are preparing your order
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order is on the way
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Order delivered to your address
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
      </InteractiveStepperItem>

      <InteractiveStepperContent step={1}>
        <Card
          title="Order #12345 Details"
          description="Your order has been received and is being processed. Placed on July 21, 2025"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={2}>
        <Card
          title="Processing Your Order"
          description="Our team is currently preparing your items for shipment. Estimated completion: July 22, 2025"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={3}>
        <Card
          title="Shipping Information"
          description="Your package is on its way to the delivery address. Tracking number: TRK123456789"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={4}>
        <Card
          title="Delivery Confirmation"
          description="Your order has been delivered successfully. Thank you for shopping with us!"
        />
      </InteractiveStepperContent>
    </InteractiveStepper>
  ),
};

/**
 * Interactive stepper with a disabled step
 */
export const WithDisabledStep: Story = {
  render: () => (
    <InteractiveStepper orientation="vertical">
      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order has been placed successfully
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              We are preparing your order
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem disabled>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Skipped</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              This step was skipped
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Order delivered to your address
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
      </InteractiveStepperItem>
    </InteractiveStepper>
  ),
};

/**
 * Interactive stepper with completed steps
 */
export const WithCompletedSteps: Story = {
  render: () => (
    <InteractiveStepper orientation="vertical" defaultValue={3}>
      <InteractiveStepperItem completed>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order has been placed successfully
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem completed>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              We are preparing your order
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Your order is on the way
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
        <InteractiveStepperSeparator />
      </InteractiveStepperItem>

      <InteractiveStepperItem>
        <InteractiveStepperTrigger>
          <InteractiveStepperIndicator />
          <div>
            <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
            <InteractiveStepperDescription>
              Order delivered to your address
            </InteractiveStepperDescription>
          </div>
        </InteractiveStepperTrigger>
      </InteractiveStepperItem>

      <InteractiveStepperContent step={1}>
        <Card
          title="Order Confirmed"
          description="Order #12345 placed on Jan 15, 2024"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={2}>
        <Card
          title="Processing Your Order"
          description="Estimated processing time: 1-2 business days"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={3}>
        <Card
          title="Shipping Information"
          description="Your package is on its way. Tracking number: TRK123456789"
        />
      </InteractiveStepperContent>

      <InteractiveStepperContent step={4}>
        <Card
          title="Order Delivered"
          description="Delivered to your location on Jan 20, 2024"
        />
      </InteractiveStepperContent>
    </InteractiveStepper>
  ),
};

/**
 * Dark theme horizontal interactive stepper with content
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  render: () => (
    <div className="rounded-xl bg-gray-950 p-8">
      <InteractiveStepper defaultValue={2} className="w-full">
        <InteractiveStepperItem completed>
          <InteractiveStepperTrigger>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Order Placed</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                A few days ago
              </InteractiveStepperDescription>
            </div>
          </InteractiveStepperTrigger>
          <InteractiveStepperSeparator />
        </InteractiveStepperItem>

        <InteractiveStepperItem>
          <InteractiveStepperTrigger>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Processing</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                Currently active
              </InteractiveStepperDescription>
            </div>
          </InteractiveStepperTrigger>
          <InteractiveStepperSeparator />
        </InteractiveStepperItem>

        <InteractiveStepperItem>
          <InteractiveStepperTrigger>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Shipped</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                On your way
              </InteractiveStepperDescription>
            </div>
          </InteractiveStepperTrigger>
          <InteractiveStepperSeparator />
        </InteractiveStepperItem>

        <InteractiveStepperItem>
          <InteractiveStepperTrigger>
            <InteractiveStepperIndicator />
            <div>
              <InteractiveStepperTitle>Delivered</InteractiveStepperTitle>
              <InteractiveStepperDescription>
                At your address
              </InteractiveStepperDescription>
            </div>
          </InteractiveStepperTrigger>
        </InteractiveStepperItem>

        <InteractiveStepperContent step={1}>
          <Card
            title={'Order Confirmed'}
            description={'Order #12345 placed on Jan 15, 2024'}
          />
        </InteractiveStepperContent>

        <InteractiveStepperContent step={2}>
          <Card
            title={'Processing Your Order'}
            description={'Estimated processing time: 1-2 business days'}
          />
        </InteractiveStepperContent>

        <InteractiveStepperContent step={3}>
          <Card title={'Order Shipped'} description={'Tracking: #ABC123XYZ'} />
        </InteractiveStepperContent>

        <InteractiveStepperContent step={4}>
          <Card
            title={'Order Delivered'}
            description={'Delivered to your location'}
          />
        </InteractiveStepperContent>
      </InteractiveStepper>
    </div>
  ),
};
