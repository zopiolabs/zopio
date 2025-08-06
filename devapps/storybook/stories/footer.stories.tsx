/**
 * SPDX-License-Identifier: MIT
 */

import type * as nextjs from '@storybook/nextjs';
import {
  LucideFacebook,
  LucideGithub,
  LucideInstagram,
  LucideLinkedin,
  LucideTwitter,
} from 'lucide-react';

import {
  Footer,
  type FooterColorScheme,
  FooterCopyright,
  FooterDivider,
  FooterGrid,
  FooterLink,
  FooterLogo,
  FooterSection,
  FooterSocialLinks,
} from '@repo/design-system/ui';

/**
 * Footer component for website layout.
 * Can be used with different variants and color schemes.
 */
const meta: nextjs.Meta<typeof Footer> = {
  title: 'ui/Footer',
  component: Footer,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['simple', 'multi-column', 'centered', 'minimal'],
      description: 'The layout variant of the footer',
      table: {
        defaultValue: { summary: 'simple' },
      },
    },
    colorScheme: {
      control: 'select',
      options: ['light', 'dark', 'neutral', 'brand'],
      description: 'The color scheme of the footer',
      table: {
        defaultValue: { summary: 'light' },
      },
    },
    sticky: {
      control: 'boolean',
      description:
        'If true, the footer will be sticky at the bottom of the page',
      table: {
        defaultValue: { summary: 'false' },
      },
    },
    withBorder: {
      control: 'boolean',
      description: 'If true, the footer will have a border at the top',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    withPadding: {
      control: 'boolean',
      description: 'If true, the footer will have padding',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    withContainer: {
      control: 'boolean',
      description:
        'If true, the footer will have a container to constrain the width',
      table: {
        defaultValue: { summary: 'true' },
      },
    },
    containerWidth: {
      control: 'select',
      options: [
        'xs',
        'sm',
        'md',
        'lg',
        'xl',
        '2xl',
        '3xl',
        '4xl',
        '5xl',
        '6xl',
        '7xl',
        '8xl',
        'full',
      ],
      description: 'The maximum width of the container',
      table: {
        defaultValue: { summary: '8xl' },
      },
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = nextjs.StoryObj<typeof meta>;

// Sample logo component for the stories
const Logo = () => (
  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary-500 text-white">
    <span className="font-bold text-lg">Z</span>
  </div>
);

/**
 * Simple footer with copyright and links.
 */
export const Simple: Story = {
  render: (args) => (
    <Footer {...args}>
      <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
        <FooterLogo logo={<Logo />} text="Zopio" />
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Features</FooterLink>
          <FooterLink href="#">Pricing</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </div>
        <FooterCopyright />
      </div>
    </Footer>
  ),
};

/**
 * Multi-column footer with sections.
 */
export const MultiColumn: Story = {
  args: {
    variant: 'multi-column',
  },
  render: (args) => (
    <Footer {...args}>
      <FooterGrid>
        <div className="col-span-1 md:col-span-2">
          <FooterLogo logo={<Logo />} text="Zopio" />
          <p className="mt-4 max-w-xs text-gray-500 text-sm">
            Building the next generation of design systems with modern tools and
            frameworks.
          </p>
          <FooterSocialLinks className="mt-6">
            <FooterLink href="#" aria-label="Twitter">
              <LucideTwitter className="h-5 w-5" />
            </FooterLink>
            <FooterLink href="#" aria-label="GitHub">
              <LucideGithub className="h-5 w-5" />
            </FooterLink>
            <FooterLink href="#" aria-label="Instagram">
              <LucideInstagram className="h-5 w-5" />
            </FooterLink>
            <FooterLink href="#" aria-label="LinkedIn">
              <LucideLinkedin className="h-5 w-5" />
            </FooterLink>
          </FooterSocialLinks>
        </div>

        <FooterSection title="Product">
          <FooterLink href="#">Overview</FooterLink>
          <FooterLink href="#">Features</FooterLink>
          <FooterLink href="#">Solutions</FooterLink>
          <FooterLink href="#">Tutorials</FooterLink>
          <FooterLink href="#">Pricing</FooterLink>
        </FooterSection>

        <FooterSection title="Company">
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Team</FooterLink>
          <FooterLink href="#">Careers</FooterLink>
          <FooterLink href="#">Blog</FooterLink>
          <FooterLink href="#">Press</FooterLink>
        </FooterSection>

        <FooterSection title="Legal">
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Cookies</FooterLink>
          <FooterLink href="#">Licenses</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </FooterSection>
      </FooterGrid>

      <FooterDivider />

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <FooterCopyright text="© 2025 Zopio. All rights reserved." />
        <div className="flex gap-x-4 text-sm">
          <FooterLink href="#">Privacy Policy</FooterLink>
          <FooterLink href="#">Terms of Service</FooterLink>
        </div>
      </div>
    </Footer>
  ),
};

/**
 * Centered footer with social links.
 */
export const Centered: Story = {
  args: {
    variant: 'centered',
  },
  render: (args) => (
    <Footer {...args}>
      <div className="flex flex-col items-center text-center">
        <FooterLogo logo={<Logo />} text="Zopio" />

        <div className="mt-6 flex flex-wrap justify-center gap-x-6 gap-y-2">
          <FooterLink href="#">Home</FooterLink>
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Features</FooterLink>
          <FooterLink href="#">Pricing</FooterLink>
          <FooterLink href="#">Contact</FooterLink>
        </div>

        <FooterSocialLinks className="mt-6">
          <FooterLink href="#" aria-label="Facebook">
            <LucideFacebook className="h-5 w-5" />
          </FooterLink>
          <FooterLink href="#" aria-label="Twitter">
            <LucideTwitter className="h-5 w-5" />
          </FooterLink>
          <FooterLink href="#" aria-label="Instagram">
            <LucideInstagram className="h-5 w-5" />
          </FooterLink>
          <FooterLink href="#" aria-label="LinkedIn">
            <LucideLinkedin className="h-5 w-5" />
          </FooterLink>
          <FooterLink href="#" aria-label="GitHub">
            <LucideGithub className="h-5 w-5" />
          </FooterLink>
        </FooterSocialLinks>

        <FooterDivider className="mt-6 w-24" />

        <FooterCopyright
          className="mt-6"
          text="© 2025 Zopio. All rights reserved."
        />
      </div>
    </Footer>
  ),
};

/**
 * Minimal footer with just copyright.
 */
export const Minimal: Story = {
  args: {
    variant: 'minimal',
    withPadding: true,
  },
  render: (args) => (
    <Footer {...args}>
      <div className="flex items-center justify-center">
        <FooterCopyright text="© 2025 Zopio. All rights reserved." />
      </div>
    </Footer>
  ),
};

/**
 * Footer with different color schemes.
 */
export const ColorSchemes: Story = {
  render: () => (
    <div className="flex flex-col gap-8">
      {(['light', 'dark', 'neutral', 'brand'] as FooterColorScheme[]).map(
        (colorScheme) => (
          <div key={colorScheme} className="flex flex-col gap-2">
            <p className="font-medium text-gray-500 text-sm">
              colorScheme: {colorScheme}
            </p>
            <Footer
              colorScheme={colorScheme}
              withContainer={false}
              className="p-6"
            >
              <div className="flex flex-col items-center justify-between space-y-4 md:flex-row md:space-y-0">
                <FooterLogo logo={<Logo />} text="Zopio" />
                <div className="flex flex-wrap gap-x-6 gap-y-2">
                  <FooterLink href="#">About</FooterLink>
                  <FooterLink href="#">Features</FooterLink>
                  <FooterLink href="#">Contact</FooterLink>
                </div>
                <FooterCopyright />
              </div>
            </Footer>
          </div>
        )
      )}
    </div>
  ),
};

/**
 * Footer with custom styling.
 */
export const CustomStyling: Story = {
  args: {
    className: 'bg-gradient-to-r from-blue-500 to-purple-600 text-white',
    withBorder: false,
  },
  render: (args) => (
    <Footer {...args}>
      <div className="flex flex-col items-center justify-between space-y-6 md:flex-row md:space-y-0">
        <FooterLogo logo={<Logo />} text="Zopio" className="text-white" />
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          <FooterLink href="#" className="text-white hover:text-white/80">
            About
          </FooterLink>
          <FooterLink href="#" className="text-white hover:text-white/80">
            Features
          </FooterLink>
          <FooterLink href="#" className="text-white hover:text-white/80">
            Pricing
          </FooterLink>
          <FooterLink href="#" className="text-white hover:text-white/80">
            Contact
          </FooterLink>
        </div>
        <FooterCopyright className="text-white/90" />
      </div>
    </Footer>
  ),
};

/**
 * Responsive footer that adapts to different screen sizes.
 */
export const Responsive: Story = {
  render: (args) => (
    <Footer {...args}>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <FooterLogo logo={<Logo />} text="Zopio" />
          <p className="mt-4 text-gray-500 text-sm">
            Building the next generation of design systems with modern tools and
            frameworks.
          </p>
        </div>

        <FooterSection title="Resources">
          <FooterLink href="#">Documentation</FooterLink>
          <FooterLink href="#">Guides</FooterLink>
          <FooterLink href="#">API Reference</FooterLink>
        </FooterSection>

        <FooterSection title="Company">
          <FooterLink href="#">About</FooterLink>
          <FooterLink href="#">Careers</FooterLink>
          <FooterLink href="#">Blog</FooterLink>
        </FooterSection>

        <FooterSection title="Connect">
          <FooterSocialLinks className="flex-col items-start space-x-0 space-y-2">
            <FooterLink href="#" className="flex items-center gap-2">
              <LucideTwitter className="h-4 w-4" />
              Twitter
            </FooterLink>
            <FooterLink href="#" className="flex items-center gap-2">
              <LucideGithub className="h-4 w-4" />
              GitHub
            </FooterLink>
            <FooterLink href="#" className="flex items-center gap-2">
              <LucideLinkedin className="h-4 w-4" />
              LinkedIn
            </FooterLink>
          </FooterSocialLinks>
        </FooterSection>
      </div>

      <FooterDivider />

      <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
        <FooterCopyright />
        <div className="flex gap-x-4 text-sm">
          <FooterLink href="#">Privacy</FooterLink>
          <FooterLink href="#">Terms</FooterLink>
          <FooterLink href="#">Cookies</FooterLink>
        </div>
      </div>
    </Footer>
  ),
};
