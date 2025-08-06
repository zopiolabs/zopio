/**
 * SPDX-License-Identifier: MIT
 */

import { Pricing } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Pricing> = {
  title: 'UI/Pricing',
  component: Pricing,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Pricing>;

const defaultPlans = [
  {
    name: 'STARTER',
    price: '50',
    yearlyPrice: '40',
    period: 'per month',
    features: [
      'Up to 10 projects',
      'Basic analytics',
      '48-hour support response time',
      'Limited API access',
      'Community support',
    ],
    description: 'Perfect for individuals and small projects',
    buttonText: 'Start Free Trial',
    href: '/sign-up',
    isPopular: false,
  },
  {
    name: 'PROFESSIONAL',
    price: '99',
    yearlyPrice: '79',
    period: 'per month',
    features: [
      'Unlimited projects',
      'Advanced analytics',
      '24-hour support response time',
      'Full API access',
      'Priority support',
      'Team collaboration',
      'Custom integrations',
    ],
    description: 'Ideal for growing teams and businesses',
    buttonText: 'Get Started',
    href: '/sign-up',
    isPopular: true,
  },
  {
    name: 'ENTERPRISE',
    price: '299',
    yearlyPrice: '239',
    period: 'per month',
    features: [
      'Everything in Professional',
      'Custom solutions',
      'Dedicated account manager',
      '1-hour support response time',
      'SSO Authentication',
      'Advanced security',
      'Custom contracts',
      'SLA agreement',
    ],
    description: 'For large organizations with specific needs',
    buttonText: 'Contact Sales',
    href: '/contact',
    isPopular: false,
  },
];

/**
 * Default pricing component with monthly/annual toggle
 */
export const Default: Story = {
  args: {
    plans: defaultPlans,
    title: 'Simple, Transparent Pricing',
    subtitle: 'Choose the plan that works for you',
    defaultIsMonthly: true,
    showToggle: true,
    toggleLabel: 'Annual billing',
    toggleDiscountLabel: '(Save 20%)',
  },
};

/**
 * Pricing component with annual billing as default
 */
export const AnnualDefault: Story = {
  args: {
    plans: defaultPlans,
    title: 'Simple, Transparent Pricing',
    subtitle: 'Choose the plan that works for you',
    defaultIsMonthly: false,
    showToggle: true,
    toggleLabel: 'Annual billing',
    toggleDiscountLabel: '(Save 20%)',
  },
};

/**
 * Pricing component without toggle
 */
export const NoToggle: Story = {
  args: {
    plans: defaultPlans,
    title: 'Simple, Transparent Pricing',
    subtitle: 'Choose the plan that works for you',
    defaultIsMonthly: true,
    showToggle: false,
  },
};

/**
 * Pricing component with custom title and subtitle
 */
export const CustomHeadings: Story = {
  args: {
    plans: defaultPlans,
    title: 'Choose Your Plan',
    subtitle: 'Flexible pricing options for teams of all sizes',
    defaultIsMonthly: true,
    showToggle: true,
    toggleLabel: 'Yearly',
    toggleDiscountLabel: '(20% off)',
  },
};

/**
 * Pricing component with custom plans
 */
export const CustomPlans: Story = {
  args: {
    plans: [
      {
        name: 'BASIC',
        price: '19',
        yearlyPrice: '15',
        period: 'per month',
        features: [
          'Single user',
          '5 GB storage',
          'Email support',
          'Basic reporting',
        ],
        description: 'For individual creators',
        buttonText: 'Get Started',
        href: '/sign-up',
        isPopular: false,
      },
      {
        name: 'TEAM',
        price: '49',
        yearlyPrice: '39',
        period: 'per month',
        features: [
          'Up to 5 users',
          '50 GB storage',
          'Priority support',
          'Advanced reporting',
          'Team collaboration',
        ],
        description: 'Perfect for small teams',
        buttonText: 'Start Free Trial',
        href: '/sign-up',
        isPopular: true,
      },
      {
        name: 'BUSINESS',
        price: '99',
        yearlyPrice: '79',
        period: 'per month',
        features: [
          'Unlimited users',
          '500 GB storage',
          '24/7 support',
          'Custom reporting',
          'Advanced security',
          'API access',
        ],
        description: 'For growing businesses',
        buttonText: 'Contact Sales',
        href: '/contact',
        isPopular: false,
      },
    ],
    title: 'Business Plans',
    subtitle: 'Scale your business with our flexible plans',
  },
};

/**
 * Dark theme pricing component
 */
export const DarkTheme: Story = {
  parameters: {
    backgrounds: { default: 'dark' },
  },
  args: {
    plans: defaultPlans,
    title: 'Simple, Transparent Pricing',
    subtitle: 'Choose the plan that works for you',
    defaultIsMonthly: true,
    showToggle: true,
    toggleLabel: 'Annual billing',
    toggleDiscountLabel: '(Save 20%)',
  },
  render: (args) => (
    <div className="rounded-xl bg-gray-950 p-8">
      <Pricing {...args} />
    </div>
  ),
};
