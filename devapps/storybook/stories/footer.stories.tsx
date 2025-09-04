/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Facebook, Github, Instagram, Linkedin, Twitter } from 'lucide-react';

import {
  Footer,
  FooterContent,
  FooterCopyright,
  FooterDivider,
  FooterGrid,
  FooterLinks,
  FooterSection,
  FooterSocial,
} from '@repo/design-system/ui/footer';

/**
 * Footer sections for the bottom of every page to show valuable information like sitemap links, copyright notice, and social media profiles.
 */
const meta: Meta<typeof Footer> = {
  title: 'ui/Footer',
  component: Footer,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'simple', 'full'],
    },
    size: {
      control: 'select',
      options: ['default', 'sm', 'lg'],
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    variant: 'default',
    size: 'default',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: (args) => (
    <Footer {...args}>
      <FooterContent>
        <FooterCopyright
          year={2023}
          company="Flowbite™"
          companyUrl="https://flowbite.com/"
        />
        <FooterLinks
          links={[
            { label: 'About', href: '#' },
            { label: 'Privacy Policy', href: '#' },
            { label: 'Licensing', href: '#' },
            { label: 'Contact', href: '#' },
          ]}
        />
      </FooterContent>
    </Footer>
  ),
};

export const Simple: Story = {
  render: (args) => (
    <Footer {...args} variant="simple">
      <FooterContent>
        <FooterCopyright year={2023} company="Your Company" />
        <FooterLinks
          links={[
            { label: 'Terms', href: '#' },
            { label: 'Privacy', href: '#' },
            { label: 'Support', href: '#' },
          ]}
        />
      </FooterContent>
    </Footer>
  ),
};

export const WithSections: Story = {
  render: (args) => (
    <Footer {...args} variant="full">
      <FooterGrid>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 sm:gap-6">
          <FooterSection
            title="Resources"
            links={[
              {
                label: 'Flowbite',
                href: 'https://flowbite.com/',
                external: true,
              },
              {
                label: 'Tailwind CSS',
                href: 'https://tailwindcss.com/',
                external: true,
              },
            ]}
          />
          <FooterSection
            title="Follow us"
            links={[
              {
                label: 'Github',
                href: 'https://github.com/themesberg/flowbite',
                external: true,
              },
              {
                label: 'Discord',
                href: 'https://discord.gg/4eeurUVvTy',
                external: true,
              },
            ]}
          />
          <FooterSection
            title="Legal"
            links={[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Terms & Conditions', href: '#' },
            ]}
          />
        </div>
      </FooterGrid>
      <FooterDivider />
      <FooterContent>
        <FooterCopyright
          year={2023}
          company="Flowbite™"
          companyUrl="https://flowbite.com/"
        />
        <FooterSocial
          links={[
            {
              label: 'Facebook',
              href: '#',
              icon: <Facebook className="h-4 w-4" />,
            },
            {
              label: 'Discord',
              href: '#',
              icon: <Instagram className="h-4 w-4" />,
            },
            {
              label: 'Twitter',
              href: '#',
              icon: <Twitter className="h-4 w-4" />,
            },
            {
              label: 'GitHub',
              href: '#',
              icon: <Github className="h-4 w-4" />,
            },
          ]}
        />
      </FooterContent>
    </Footer>
  ),
};

export const CompanyFooter: Story = {
  render: (args) => (
    <Footer {...args} variant="full">
      <FooterGrid>
        <div className="grid grid-cols-2 gap-8 sm:grid-cols-4 sm:gap-6">
          <FooterSection
            title="Company"
            links={[
              { label: 'About', href: '#' },
              { label: 'Careers', href: '#' },
              { label: 'Brand Center', href: '#' },
              { label: 'Blog', href: '#' },
            ]}
          />
          <FooterSection
            title="Help center"
            links={[
              { label: 'Discord Server', href: '#' },
              { label: 'Twitter', href: '#' },
              { label: 'Facebook', href: '#' },
              { label: 'Contact Us', href: '#' },
            ]}
          />
          <FooterSection
            title="Legal"
            links={[
              { label: 'Privacy Policy', href: '#' },
              { label: 'Licensing', href: '#' },
              { label: 'Terms & Conditions', href: '#' },
            ]}
          />
          <FooterSection
            title="Download"
            links={[
              { label: 'iOS', href: '#' },
              { label: 'Android', href: '#' },
              { label: 'Windows', href: '#' },
              { label: 'MacOS', href: '#' },
            ]}
          />
        </div>
      </FooterGrid>
      <FooterDivider />
      <FooterContent>
        <FooterCopyright
          year={2023}
          company="Flowbite™"
          companyUrl="https://flowbite.com/"
        />
        <FooterSocial
          links={[
            {
              label: 'Facebook',
              href: '#',
              icon: <Facebook className="h-4 w-4" />,
            },
            {
              label: 'Instagram',
              href: '#',
              icon: <Instagram className="h-4 w-4" />,
            },
            {
              label: 'Twitter',
              href: '#',
              icon: <Twitter className="h-4 w-4" />,
            },
            {
              label: 'GitHub',
              href: '#',
              icon: <Github className="h-4 w-4" />,
            },
            {
              label: 'LinkedIn',
              href: '#',
              icon: <Linkedin className="h-4 w-4" />,
            },
          ]}
        />
      </FooterContent>
    </Footer>
  ),
};

export const SocialOnly: Story = {
  render: (args) => (
    <Footer {...args} variant="simple">
      <FooterContent>
        <FooterCopyright company="Your Brand" />
        <FooterSocial
          links={[
            {
              label: 'Twitter',
              href: '#',
              icon: <Twitter className="h-4 w-4" />,
            },
            {
              label: 'GitHub',
              href: '#',
              icon: <Github className="h-4 w-4" />,
            },
            {
              label: 'LinkedIn',
              href: '#',
              icon: <Linkedin className="h-4 w-4" />,
            },
          ]}
        />
      </FooterContent>
    </Footer>
  ),
};

export const Small: Story = {
  render: (args) => (
    <Footer {...args} size="sm">
      <FooterContent>
        <FooterCopyright year={2023} company="Compact Co." />
        <FooterLinks
          links={[
            { label: 'About', href: '#' },
            { label: 'Contact', href: '#' },
          ]}
        />
      </FooterContent>
    </Footer>
  ),
};

export const Large: Story = {
  render: (args) => (
    <Footer {...args} size="lg">
      <FooterContent>
        <FooterCopyright
          year={2023}
          company="Large Corp"
          companyUrl="https://example.com"
        />
        <FooterLinks
          links={[
            { label: 'Products', href: '#' },
            { label: 'Services', href: '#' },
            { label: 'About', href: '#' },
            { label: 'Contact', href: '#' },
          ]}
        />
      </FooterContent>
    </Footer>
  ),
};
