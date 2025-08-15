/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  type PricingPlan,
  PricingSection,
} from '@repo/design-system/ui/pricing-section';

/**
 * A dynamic pricing section with animated cards, confetti effects, and monthly/yearly toggle.
 */
const meta: Meta<typeof PricingSection> = {
  title: 'ui/PricingSection',
  component: PricingSection,
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'gradient', 'dark'],
    },
    showYearlyToggle: {
      control: 'boolean',
    },
    yearlyDiscount: {
      control: 'number',
    },
  },
  args: {
    variant: 'default',
    showYearlyToggle: true,
    yearlyDiscount: 20,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const basicPlans: PricingPlan[] = [
  {
    name: 'Starter',
    description: 'Perfect for individuals and small projects',
    monthlyPrice: 9,
    yearlyPrice: 108,
    features: [
      { text: 'Up to 10 projects', included: true },
      { text: 'Basic analytics', included: true },
      { text: '48-hour support response time', included: true },
      { text: 'Limited API access', included: true },
      { text: 'Community support', included: true },
      { text: 'Team collaboration', included: false },
      { text: 'Custom integrations', included: false },
    ],
    buttonText: 'Start Free Trial',
    buttonVariant: 'outline',
    onSelect: () => console.log('Starter plan selected'),
  },
  {
    name: 'Professional',
    description: 'Ideal for growing teams and businesses',
    monthlyPrice: 29,
    yearlyPrice: 348,
    features: [
      { text: 'Unlimited projects', included: true },
      { text: 'Advanced analytics', included: true },
      { text: '24-hour support response time', included: true },
      { text: 'Full API access', included: true },
      { text: 'Priority support', included: true },
      { text: 'Team collaboration', included: true },
      { text: 'Custom integrations', included: true },
    ],
    buttonText: 'Get Started',
    popular: true,
    onSelect: () => console.log('Professional plan selected'),
  },
  {
    name: 'Enterprise',
    description: 'For large organizations with specific needs',
    monthlyPrice: 99,
    yearlyPrice: 1188,
    features: [
      { text: 'Everything in Professional', included: true },
      { text: 'Custom solutions', included: true },
      { text: 'Dedicated account manager', included: true },
      { text: '1-hour support response time', included: true },
      { text: 'SSO Authentication', included: true },
      { text: 'Advanced security', included: true },
      { text: 'Custom contracts', included: true },
      { text: 'SLA agreement', included: true },
    ],
    buttonText: 'Contact Sales',
    buttonVariant: 'outline',
    onSelect: () => console.log('Enterprise plan selected'),
  },
];

/**
 * Default pricing section with three tiers.
 */
export const Default: Story = {
  args: {
    plans: basicPlans,
  },
};

/**
 * Gradient background variant.
 */
export const Gradient: Story = {
  args: {
    variant: 'gradient',
    plans: basicPlans,
  },
};

/**
 * Dark theme variant.
 */
export const Dark: Story = {
  args: {
    variant: 'dark',
    plans: basicPlans,
  },
};

/**
 * Custom titles and content.
 */
export const CustomContent: Story = {
  args: {
    title: 'Choose Your Plan',
    subtitle: 'Flexible pricing that scales with your business needs',
    plans: basicPlans,
  },
};

/**
 * Without yearly toggle.
 */
export const MonthlyOnly: Story = {
  args: {
    showYearlyToggle: false,
    plans: basicPlans,
  },
};

/**
 * Higher yearly discount.
 */
export const HighDiscount: Story = {
  args: {
    yearlyDiscount: 40,
    plans: basicPlans,
  },
};

/**
 * Two-tier pricing.
 */
export const TwoTier: Story = {
  args: {
    plans: [
      {
        name: 'Basic',
        description: 'For personal use and small projects',
        monthlyPrice: 15,
        yearlyPrice: 180,
        features: [
          { text: '5 projects', included: true },
          { text: 'Basic support', included: true },
          { text: 'Standard features', included: true },
          { text: 'Advanced features', included: false },
        ],
        buttonText: 'Get Basic',
        buttonVariant: 'outline',
      },
      {
        name: 'Pro',
        description: 'For teams and growing businesses',
        monthlyPrice: 49,
        yearlyPrice: 588,
        features: [
          { text: 'Unlimited projects', included: true },
          { text: 'Priority support', included: true },
          { text: 'Standard features', included: true },
          { text: 'Advanced features', included: true },
        ],
        buttonText: 'Get Pro',
        popular: true,
      },
    ],
  },
};

/**
 * SaaS pricing example.
 */
export const SaaS: Story = {
  args: {
    title: 'Simple, Transparent Pricing',
    subtitle: 'Start free, upgrade when you need more',
    plans: [
      {
        name: 'Free',
        description: 'Perfect for getting started',
        monthlyPrice: 0,
        yearlyPrice: 0,
        features: [
          { text: '3 projects', included: true },
          { text: '1GB storage', included: true },
          { text: 'Community support', included: true },
          { text: 'Basic templates', included: true },
          { text: 'Advanced analytics', included: false },
          { text: 'Priority support', included: false },
        ],
        buttonText: 'Start Free',
        buttonVariant: 'outline',
      },
      {
        name: 'Pro',
        description: 'For professionals and small teams',
        monthlyPrice: 19,
        yearlyPrice: 228,
        features: [
          { text: 'Unlimited projects', included: true },
          { text: '100GB storage', included: true },
          { text: 'Email support', included: true },
          { text: 'Premium templates', included: true },
          { text: 'Advanced analytics', included: true },
          { text: 'Team collaboration', included: true },
        ],
        buttonText: 'Go Pro',
        popular: true,
      },
      {
        name: 'Business',
        description: 'For larger teams and organizations',
        monthlyPrice: 49,
        yearlyPrice: 588,
        features: [
          { text: 'Everything in Pro', included: true },
          { text: '1TB storage', included: true },
          { text: 'Phone support', included: true },
          { text: 'Custom branding', included: true },
          { text: 'Advanced integrations', included: true },
          { text: 'SSO authentication', included: true },
        ],
        buttonText: 'Contact Sales',
        buttonVariant: 'outline',
      },
    ],
  },
};
