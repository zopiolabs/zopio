/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import { Button } from '@repo/design-system/ui/button';
import {
  Hero,
  HeroActions,
  HeroCard,
  HeroDescription,
  HeroImage,
  HeroTitle,
} from '@repo/design-system/ui/hero';
import { Input } from '@repo/design-system/ui/input';
import { Label } from '@repo/design-system/ui/label';
import Link from 'next/link';

/**
 * Hero component for displaying large promotional sections with titles, descriptions, images, and call-to-action buttons.
 */
const meta: Meta<typeof Hero> = {
  title: 'ui/Hero',
  component: Hero,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'primary', 'gradient', 'image'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'auto'],
    },
    layout: {
      control: 'select',
      options: ['center', 'image-left', 'image-right', 'split'],
    },
    spacing: {
      control: 'select',
      options: ['default', 'sm', 'lg', 'xl'],
    },
    overlay: {
      control: 'boolean',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    variant: 'default',
    size: 'default',
    layout: 'center',
    spacing: 'default',
    overlay: false,
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * A simple centered hero section with title, description, and call-to-action button.
 */
export const Default: Story = {
  render: (args) => (
    <Hero {...args}>
      <div className="max-w-md">
        <HeroTitle>Hello there</HeroTitle>
        <HeroDescription>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </HeroDescription>
        <HeroActions>
          <Button size="lg">Get Started</Button>
        </HeroActions>
      </div>
    </Hero>
  ),
};

/**
 * A hero section with an image positioned to the left of the content.
 */
export const WithImageLeft: Story = {
  render: (args) => (
    <Hero {...args} layout="image-left">
      <HeroImage
        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        alt="Hero image"
      />
      <div>
        <HeroTitle>Box Office News!</HeroTitle>
        <HeroDescription>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </HeroDescription>
        <HeroActions>
          <Button size="lg">Get Started</Button>
        </HeroActions>
      </div>
    </Hero>
  ),
};

/**
 * A hero section with an image positioned to the right of the content.
 */
export const WithImageRight: Story = {
  render: (args) => (
    <Hero {...args} layout="image-right">
      <div className="text-center lg:text-left">
        <HeroTitle>Amazing Product</HeroTitle>
        <HeroDescription>
          Discover the future of technology with our innovative solutions. Built
          for modern teams who demand excellence and reliability.
        </HeroDescription>
        <HeroActions>
          <Button size="lg">Learn More</Button>
          <Button variant="outline" size="lg">
            Watch Demo
          </Button>
        </HeroActions>
      </div>
      <HeroImage
        src="https://img.daisyui.com/images/stock/photo-1635805737707-575885ab0820.webp"
        alt="Product showcase"
      />
    </Hero>
  ),
};

/**
 * A hero section with a login form card alongside promotional content.
 */
export const WithLoginForm: Story = {
  render: (args) => (
    <Hero {...args} layout="split">
      <div className="text-center lg:text-left">
        <HeroTitle>Login now!</HeroTitle>
        <HeroDescription>
          Provident cupiditate voluptatem et in. Quaerat fugiat ut assumenda
          excepturi exercitationem quasi. In deleniti eaque aut repudiandae et a
          id nisi.
        </HeroDescription>
      </div>
      <HeroCard>
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input type="email" id="email" placeholder="Email" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input type="password" id="password" placeholder="Password" />
          </div>
          <div>
            <Link href="#" className="text-primary text-sm hover:underline">
              Forgot password?
            </Link>
          </div>
          <Button className="mt-4 w-full">Login</Button>
        </div>
      </HeroCard>
    </Hero>
  ),
};

/**
 * A primary variant hero with enhanced visual prominence.
 */
export const Primary: Story = {
  render: (args) => (
    <Hero {...args} variant="primary">
      <div className="max-w-2xl text-center">
        <HeroTitle>Welcome to the Future</HeroTitle>
        <HeroDescription className="text-primary-foreground/80">
          Experience next-generation technology that transforms the way you
          work, collaborate, and achieve your goals.
        </HeroDescription>
        <HeroActions>
          <Button variant="secondary" size="lg">
            Start Free Trial
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary"
          >
            Learn More
          </Button>
        </HeroActions>
      </div>
    </Hero>
  ),
};

/**
 * A gradient hero section with modern visual appeal.
 */
export const Gradient: Story = {
  render: (args) => (
    <Hero {...args} variant="gradient">
      <div className="max-w-3xl text-center text-white">
        <HeroTitle>Innovative Solutions</HeroTitle>
        <HeroDescription className="text-white/90">
          Transform your business with cutting-edge technology and expert
          guidance. Join thousands of companies already using our platform.
        </HeroDescription>
        <HeroActions>
          <Button variant="secondary" size="lg">
            Get Started Today
          </Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            View Pricing
          </Button>
        </HeroActions>
      </div>
    </Hero>
  ),
};

/**
 * A hero section with a background image and overlay.
 */
export const WithBackgroundImage: Story = {
  render: (args) => (
    <Hero
      {...args}
      variant="image"
      overlay={true}
      backgroundImage="https://img.daisyui.com/images/stock/photo-1507003211169-0a1dd7228f2d.webp"
    >
      <div className="relative z-10 max-w-2xl text-center text-white">
        <HeroTitle>Explore the World</HeroTitle>
        <HeroDescription className="text-white/90">
          Discover breathtaking destinations and create unforgettable memories.
          Your adventure starts here with our comprehensive travel platform.
        </HeroDescription>
        <HeroActions>
          <Button size="lg">Start Exploring</Button>
          <Button
            variant="outline"
            size="lg"
            className="border-white text-white hover:bg-white hover:text-primary"
          >
            View Destinations
          </Button>
        </HeroActions>
      </div>
    </Hero>
  ),
};

/**
 * A compact hero section suitable for smaller spaces.
 */
export const Compact: Story = {
  render: (args) => (
    <Hero {...args} size="auto">
      <div className="max-w-xl text-center">
        <HeroTitle as="h2" className="text-3xl md:text-4xl">
          Quick Start Guide
        </HeroTitle>
        <HeroDescription className="py-4">
          Get up and running in minutes with our simple setup process.
        </HeroDescription>
        <HeroActions>
          <Button>Get Started</Button>
        </HeroActions>
      </div>
    </Hero>
  ),
};

/**
 * A large hero section for maximum impact.
 */
export const Large: Story = {
  render: (args) => (
    <Hero {...args} size="lg" spacing="xl">
      <div className="max-w-4xl text-center">
        <HeroTitle className="text-6xl md:text-7xl lg:text-8xl">
          Big Ideas
        </HeroTitle>
        <HeroDescription className="py-8 text-xl md:text-2xl">
          Think bigger. Dream larger. Achieve more with our comprehensive
          platform designed for ambitious teams and visionary leaders.
        </HeroDescription>
        <HeroActions>
          <Button size="lg" className="px-8 py-4 text-lg">
            Start Building
          </Button>
          <Button variant="outline" size="lg" className="px-8 py-4 text-lg">
            Learn More
          </Button>
        </HeroActions>
      </div>
    </Hero>
  ),
};
