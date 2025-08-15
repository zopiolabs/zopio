/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { AlertTriangle, CheckCircle, ExternalLink, Info } from 'lucide-react';
import { useState } from 'react';

import {
  Banner,
  BannerAction,
  BannerContent,
  BannerDescription,
  BannerIcon,
  BannerTitle,
} from '@repo/design-system/ui/banner';
import { Button } from '@repo/design-system/ui/button';
import Link from 'next/link';

/**
 * A banner is a full-width component that can be used to show a message and action to the user.
 */
const meta: Meta<typeof Banner> = {
  title: 'ui/Banner',
  component: Banner,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: ['default', 'destructive', 'warning', 'success', 'info'],
      description: 'Visual variant of the banner',
    },
    inset: {
      control: { type: 'boolean' },
      description: 'Whether to show the banner with inset styling',
    },
    open: {
      control: { type: 'boolean' },
      description: 'Controlled open state',
    },
    defaultOpen: {
      control: { type: 'boolean' },
      description: 'Default open state (uncontrolled)',
    },
    closable: {
      control: { type: 'boolean' },
      description: 'Whether the banner can be closed',
    },
  },
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default banner.
 */
export const Default: Story = {
  args: {
    children: 'Important message',
  },
};

/**
 * Different variants.
 */
export const Variants: Story = {
  render: () => (
    <div className="space-y-4">
      <Banner variant="default">
        <BannerContent>
          <BannerTitle>Default Banner</BannerTitle>
          <BannerDescription>
            This is a default banner message.
          </BannerDescription>
        </BannerContent>
      </Banner>

      <Banner variant="destructive">
        <BannerIcon>
          <AlertTriangle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Error</BannerTitle>
          <BannerDescription>
            Something's gone horribly wrong.
          </BannerDescription>
        </BannerContent>
      </Banner>

      <Banner variant="warning">
        <BannerIcon>
          <AlertTriangle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Warning</BannerTitle>
          <BannerDescription>
            You're almost out of disk space.
          </BannerDescription>
        </BannerContent>
      </Banner>

      <Banner variant="success">
        <BannerIcon>
          <CheckCircle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Success</BannerTitle>
          <BannerDescription>
            Your changes have been saved successfully.
          </BannerDescription>
        </BannerContent>
      </Banner>

      <Banner variant="info">
        <BannerIcon>
          <Info className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Information</BannerTitle>
          <BannerDescription>
            You've been selected for a secret mission.
          </BannerDescription>
        </BannerContent>
      </Banner>
    </div>
  ),
};

/**
 * Inset variant with rounded corners.
 */
export const Inset: Story = {
  render: () => (
    <div className="space-y-4 bg-muted/30 p-4">
      <Banner variant="default" inset>
        <BannerContent>
          <BannerTitle>Inset Banner</BannerTitle>
          <BannerDescription>
            This banner has rounded corners and margins.
          </BannerDescription>
        </BannerContent>
      </Banner>

      <Banner variant="warning" inset>
        <BannerIcon>
          <AlertTriangle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Warning</BannerTitle>
          <BannerDescription>
            This is an inset warning banner.
          </BannerDescription>
        </BannerContent>
      </Banner>
    </div>
  ),
};

/**
 * Banner with actions.
 */
export const WithActions: Story = {
  render: () => (
    <div className="space-y-4">
      <Banner variant="info">
        <BannerIcon>
          <Info className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>New Feature Available</BannerTitle>
          <BannerDescription>
            Check out our latest updates and improvements.
          </BannerDescription>
        </BannerContent>
        <BannerAction>
          <Button variant="secondary" size="sm">
            Learn More
          </Button>
        </BannerAction>
      </Banner>

      <Banner variant="warning">
        <BannerIcon>
          <AlertTriangle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Storage Almost Full</BannerTitle>
          <BannerDescription>
            You're using 95% of your storage space.
          </BannerDescription>
        </BannerContent>
        <BannerAction>
          <Button variant="secondary" size="sm">
            Upgrade Plan
          </Button>
          <Button variant="ghost" size="sm">
            Manage Files
          </Button>
        </BannerAction>
      </Banner>
    </div>
  ),
};

/**
 * Controlled banner state.
 */
export const Controlled: Story = {
  render: () => {
    const [isOpen, setIsOpen] = useState(true);

    return (
      <div className="space-y-4">
        <div className="flex gap-2">
          <Button onClick={() => setIsOpen(true)} disabled={isOpen} size="sm">
            Show Banner
          </Button>
          <Button
            onClick={() => setIsOpen(false)}
            disabled={!isOpen}
            variant="outline"
            size="sm"
          >
            Hide Banner
          </Button>
        </div>

        <Banner variant="success" open={isOpen} onOpenChange={setIsOpen}>
          <BannerIcon>
            <CheckCircle className="h-4 w-4" />
          </BannerIcon>
          <BannerContent>
            <BannerTitle>Controlled Banner</BannerTitle>
            <BannerDescription>
              This banner's visibility is controlled by external state.
            </BannerDescription>
          </BannerContent>
        </Banner>
      </div>
    );
  },
};

/**
 * Non-closable banner.
 */
export const NonClosable: Story = {
  render: () => (
    <Banner variant="info" closable={false}>
      <BannerIcon>
        <Info className="h-4 w-4" />
      </BannerIcon>
      <BannerContent>
        <BannerTitle>System Maintenance</BannerTitle>
        <BannerDescription>
          Scheduled maintenance will occur tonight from 2-4 AM EST.
        </BannerDescription>
      </BannerContent>
    </Banner>
  ),
};

/**
 * Banner with custom close handler.
 */
export const CustomCloseHandler: Story = {
  render: () => {
    const [dismissed, setDismissed] = useState(false);

    const handleClose = () => {
      // Banner dismissed - in a real app you could save to localStorage, send analytics, etc.
      setDismissed(true);
    };

    if (dismissed) {
      return (
        <div className="p-4 text-center">
          <p className="text-muted-foreground">Banner was dismissed</p>
          <Button
            onClick={() => setDismissed(false)}
            size="sm"
            className="mt-2"
          >
            Show Again
          </Button>
        </div>
      );
    }

    return (
      <Banner variant="warning" onClose={handleClose}>
        <BannerIcon>
          <AlertTriangle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Cookie Notice</BannerTitle>
          <BannerDescription>
            We use cookies to improve your experience.
          </BannerDescription>
        </BannerContent>
        <BannerAction>
          <Button variant="secondary" size="sm">
            Accept
          </Button>
        </BannerAction>
      </Banner>
    );
  },
};

/**
 * Simple text-only banners.
 */
export const SimpleText: Story = {
  render: () => (
    <div className="space-y-4">
      <Banner variant="default">Important system update available</Banner>

      <Banner variant="destructive">Service temporarily unavailable</Banner>

      <Banner variant="success">Your account has been verified</Banner>
    </div>
  ),
};

/**
 * Banner with external link.
 */
export const WithExternalLink: Story = {
  render: () => (
    <Banner variant="info">
      <BannerIcon>
        <Info className="h-4 w-4" />
      </BannerIcon>
      <BannerContent>
        <BannerTitle>Documentation Updated</BannerTitle>
        <BannerDescription>
          New guides and examples are now available.
        </BannerDescription>
      </BannerContent>
      <BannerAction>
        <Button variant="secondary" size="sm" asChild>
          <Link href="#" target="_blank" rel="noopener noreferrer">
            View Docs
            <ExternalLink className="ml-2 h-3 w-3" />
          </Link>
        </Button>
      </BannerAction>
    </Banner>
  ),
};

/**
 * Multiple banners stacked.
 */
export const Stacked: Story = {
  render: () => (
    <div>
      <Banner variant="info">
        <BannerIcon>
          <Info className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Maintenance Notice</BannerTitle>
          <BannerDescription>
            Scheduled maintenance tonight 2-4 AM EST.
          </BannerDescription>
        </BannerContent>
      </Banner>

      <Banner variant="warning">
        <BannerIcon>
          <AlertTriangle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Storage Warning</BannerTitle>
          <BannerDescription>
            You're running low on storage space.
          </BannerDescription>
        </BannerContent>
        <BannerAction>
          <Button variant="secondary" size="sm">
            Upgrade
          </Button>
        </BannerAction>
      </Banner>

      <Banner variant="success">
        <BannerIcon>
          <CheckCircle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Backup Complete</BannerTitle>
          <BannerDescription>
            Your data has been successfully backed up.
          </BannerDescription>
        </BannerContent>
      </Banner>
    </div>
  ),
};

/**
 * Real-world examples.
 */
export const RealWorldExamples: Story = {
  render: () => (
    <div className="space-y-4">
      {/* Cookie consent */}
      <Banner variant="default" inset>
        <BannerContent>
          <BannerDescription>
            We use cookies to enhance your browsing experience and analyze our
            traffic. By clicking "Accept All", you consent to our use of
            cookies.
          </BannerDescription>
        </BannerContent>
        <BannerAction>
          <Button variant="secondary" size="sm">
            Accept All
          </Button>
          <Button variant="ghost" size="sm">
            Customize
          </Button>
        </BannerAction>
      </Banner>

      {/* Security alert */}
      <Banner variant="destructive">
        <BannerIcon>
          <AlertTriangle className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>Security Alert</BannerTitle>
          <BannerDescription>
            Unusual login activity detected. Please verify your account.
          </BannerDescription>
        </BannerContent>
        <BannerAction>
          <Button variant="secondary" size="sm">
            Verify Now
          </Button>
        </BannerAction>
      </Banner>

      {/* Feature announcement */}
      <Banner variant="info" inset>
        <BannerIcon>
          <Info className="h-4 w-4" />
        </BannerIcon>
        <BannerContent>
          <BannerTitle>New Feature: Dark Mode</BannerTitle>
          <BannerDescription>
            Switch to dark mode for a better viewing experience in low light.
          </BannerDescription>
        </BannerContent>
        <BannerAction>
          <Button variant="secondary" size="sm">
            Try It Now
          </Button>
        </BannerAction>
      </Banner>
    </div>
  ),
};
