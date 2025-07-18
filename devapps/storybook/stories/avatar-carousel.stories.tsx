/**
 * SPDX-License-Identifier: MIT
 */

import { AvatarCarousel } from '@repo/design-system/ui/avatar-carousel';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof AvatarCarousel> = {
  title: 'UI/AvatarCarousel',
  component: AvatarCarousel,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof AvatarCarousel>;

const avatarData = [
  {
    src: 'https://github.com/shadcn.png',
    alt: 'shadcn',
    fallback: 'SC',
    details: {
      name: 'Shadcn',
      description: 'Creator of shadcn/ui components',
    },
  },
  {
    src: 'https://github.com/leerob.png',
    alt: 'leerob',
    fallback: 'LR',
    details: {
      name: 'Lee Robinson',
      description: 'VP of Developer Experience at Vercel',
    },
  },
  {
    src: 'https://github.com/evilrabbit.png',
    alt: 'evilrabbit',
    fallback: 'ER',
    details: {
      name: 'Evil Rabbit',
      description: 'Designer & Developer',
    },
  },
  {
    src: 'https://github.com/rauchg.png',
    alt: 'rauchg',
    fallback: 'RG',
    details: {
      name: 'Guillermo Rauch',
      description: 'CEO at Vercel',
    },
  },
  {
    src: 'https://github.com/steventey.png',
    alt: 'steventey',
    fallback: 'ST',
    details: {
      name: 'Steven Tey',
      description: 'Developer at Vercel',
    },
  },
  {
    src: 'https://github.com/timcole.png',
    alt: 'timcole',
    fallback: 'TC',
    details: {
      name: 'Timothy Cole',
      description: 'Developer & Content Creator',
    },
  },
  {
    src: 'https://github.com/jlengstorf.png',
    alt: 'jlengstorf',
    fallback: 'JL',
    details: {
      name: 'Jason Lengstorf',
      description: 'Developer & Educator',
    },
  },
  {
    src: 'https://github.com/cassidoo.png',
    alt: 'cassidoo',
    fallback: 'CO',
    details: {
      name: 'Cassidy Williams',
      description: 'Developer & Content Creator',
    },
  },
];

export const Default: Story = {
  args: {
    avatars: avatarData,
    itemsPerPage: 3,
    showPagination: true,
  },
};

export const WithoutPagination: Story = {
  args: {
    avatars: avatarData.slice(0, 5),
    showPagination: false,
  },
};

export const SinglePage: Story = {
  args: {
    avatars: avatarData.slice(0, 3),
    itemsPerPage: 3,
    showPagination: true,
  },
};

export const LargeCollection: Story = {
  args: {
    avatars: [
      ...avatarData,
      ...avatarData.map((avatar) => ({
        ...avatar,
        alt: `${avatar.alt}-copy`,
      })),
    ],
    itemsPerPage: 4,
    showPagination: true,
  },
};
