/**
 * SPDX-License-Identifier: MIT
 */

import { QRCode } from '@repo/design-system/ui/qr-code';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof QRCode> = {
  title: 'ui/QRCode',
  component: QRCode,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A customizable QR code component that generates QR codes from text or URLs.',
      },
    },
  },
  argTypes: {
    value: {
      control: 'text',
      description: 'The text or URL to encode in the QR code',
    },
    size: {
      control: { type: 'range', min: 100, max: 500, step: 10 },
      description: 'Size of the QR code in pixels',
    },
    bgColor: {
      control: 'color',
      description: 'Background color of the QR code',
    },
    fgColor: {
      control: 'color',
      description: 'Foreground color of the QR code',
    },
    level: {
      control: 'select',
      options: ['L', 'M', 'Q', 'H'],
      description:
        'Error correction level (L=Low, M=Medium, Q=Quartile, H=High)',
    },
    includeMargin: {
      control: 'boolean',
      description: 'Whether to include a margin around the QR code',
    },
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof QRCode>;

export const Default: Story = {
  args: {
    value: 'https://example.com',
    size: 200,
  },
};

export const CustomText: Story = {
  args: {
    value: 'Hello, World! This is a QR code with custom text.',
    size: 200,
  },
};

export const LargeSize: Story = {
  args: {
    value: 'https://vercel.com',
    size: 300,
  },
};

export const SmallSize: Story = {
  args: {
    value: 'Small QR',
    size: 120,
  },
};

export const CustomColors: Story = {
  args: {
    value: 'https://github.com',
    size: 200,
    bgColor: '#f0f9ff',
    fgColor: '#1e40af',
  },
};

export const DarkTheme: Story = {
  args: {
    value: 'Dark theme QR code',
    size: 200,
    bgColor: '#1f2937',
    fgColor: '#f9fafb',
  },
};

export const HighErrorCorrection: Story = {
  args: {
    value: 'This QR code has high error correction level',
    size: 200,
    level: 'H',
  },
  parameters: {
    docs: {
      description: {
        story:
          'High error correction level allows the QR code to be readable even if partially damaged.',
      },
    },
  },
};

export const NoMargin: Story = {
  args: {
    value: 'QR code without margin',
    size: 200,
    includeMargin: false,
  },
};

export const WiFiCredentials: Story = {
  args: {
    value: 'WIFI:T:WPA;S:MyNetwork;P:MyPassword123;H:false;;',
    size: 250,
  },
  parameters: {
    docs: {
      description: {
        story:
          'QR code for WiFi credentials. Format: WIFI:T:[WPA|WEP|nopass];S:[network name];P:[password];H:[hidden];;',
      },
    },
  },
};

export const ContactCard: Story = {
  args: {
    value: `BEGIN:VCARD
VERSION:3.0
FN:John Doe
ORG:Example Company
TEL:+1234567890
EMAIL:john@example.com
URL:https://johndoe.com
END:VCARD`,
    size: 250,
  },
  parameters: {
    docs: {
      description: {
        story: 'QR code containing vCard contact information.',
      },
    },
  },
};

export const EmptyValue: Story = {
  args: {
    value: '',
    size: 200,
  },
  parameters: {
    docs: {
      description: {
        story: 'Shows placeholder when no value is provided.',
      },
    },
  },
};
