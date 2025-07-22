/**
 * SPDX-License-Identifier: MIT
 */

import { Card, CardContent } from '@repo/design-system/ui/card';
import { OpenSource } from '@repo/design-system/ui/open-source';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof OpenSource> = {
  title: 'ui/OpenSource',
  component: OpenSource,
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof OpenSource>;

export const Basic: Story = {
  render: () => (
    <OpenSource
      repository="codehagen/prismui"
      defaultStats={{
        stars: 300,
        contributors: [
          {
            login: 'codehagen',
            avatar_url: 'https://avatars.githubusercontent.com/u/12345678?v=4',
          },
          {
            login: 'contributor2',
            avatar_url: 'https://avatars.githubusercontent.com/u/23456789?v=4',
          },
        ],
      }}
    />
  ),
};

export const CustomTitleAndDescription: Story = {
  render: () => (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-6 font-medium text-lg">
          Custom Title and Description
        </h3>
        <OpenSource
          repository="codehagen/prismui"
          title="Join our community"
          description="PrismUI is built by the community, for the community. We'd love to have you join us!"
          buttonText="View on GitHub"
          defaultStats={{
            stars: 300,
            contributors: [
              {
                login: 'codehagen',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/12345678?v=4',
              },
              {
                login: 'contributor2',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/23456789?v=4',
              },
            ],
          }}
        />
      </CardContent>
    </Card>
  ),
};

export const DifferentRepository: Story = {
  render: () => (
    <Card>
      <CardContent className="pt-6">
        <h3 className="mb-6 font-medium text-lg">Different Repository</h3>
        <OpenSource
          repository="vercel/next.js"
          title="Built with Next.js"
          description="Next.js is the foundation of our framework. Check out their repository to learn more."
          buttonText="Explore Next.js"
          defaultStats={{
            stars: 100000,
            contributors: [
              {
                login: 'contributor1',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/34567890?v=4',
              },
              {
                login: 'contributor2',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/45678901?v=4',
              },
              {
                login: 'contributor3',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/56789012?v=4',
              },
              {
                login: 'contributor4',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/67890123?v=4',
              },
              {
                login: 'contributor5',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/78901234?v=4',
              },
              {
                login: 'contributor6',
                avatar_url:
                  'https://avatars.githubusercontent.com/u/89012345?v=4',
              },
            ],
          }}
        />
      </CardContent>
    </Card>
  ),
};

export const CustomStyling: Story = {
  render: () => (
    <OpenSource
      repository="codehagen/prismui"
      title="Custom Styled Component"
      description="This component has custom styling applied to it."
      buttonText="Check it out"
      className="border-blue-200 bg-gradient-to-r from-blue-500/10 to-purple-500/10 dark:border-blue-800"
      defaultStats={{
        stars: 500,
        contributors: [
          {
            login: 'codehagen',
            avatar_url: 'https://avatars.githubusercontent.com/u/12345678?v=4',
          },
          {
            login: 'contributor2',
            avatar_url: 'https://avatars.githubusercontent.com/u/23456789?v=4',
          },
        ],
      }}
    />
  ),
};
