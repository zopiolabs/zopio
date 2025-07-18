/**
 * SPDX-License-Identifier: MIT
 */

import {
  CreditCard,
  CreditCardBack,
  CreditCardChip,
  CreditCardCvv,
  CreditCardExpiry,
  CreditCardFlipper,
  CreditCardFront,
  CreditCardLogo,
  CreditCardMagStripe,
  CreditCardName,
  CreditCardNumber,
  CreditCardServiceProvider,
} from '@repo/design-system/ui/credit-card';
import type { Meta, StoryObj } from '@storybook/react';

const meta: Meta<typeof CreditCard> = {
  title: 'ui/Credit Card',
  component: CreditCard,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof CreditCard>;

/**
 * Apple Card example with a minimalist design
 */
export const AppleCard: Story = {
  render: () => (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-zinc-300 to-zinc-100">
          <CreditCardLogo>
            <svg
              viewBox="0 0 24 24"
              className="size-full"
              role="img"
              aria-labelledby="svgTitle"
            >
              <title id="svgTitle">Apple Card</title>
              <path
                fill="currentColor"
                d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.53 4.08zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.32 2.12-1.66 4.19-3.74 4.25z"
              />
            </svg>
          </CreditCardLogo>
          <div className="absolute bottom-0 left-0">
            <CreditCardName>John R. Doe</CreditCardName>
          </div>
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-zinc-300 to-zinc-100">
          <CreditCardMagStripe />
          <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2">
            <div className="flex justify-between">
              <CreditCardNumber>0123 4567 8901 2345</CreditCardNumber>
            </div>
            <div className="flex justify-between">
              <CreditCardExpiry>01/24</CreditCardExpiry>
              <CreditCardCvv>123</CreditCardCvv>
            </div>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};

/**
 * Back only view of a credit card
 */
export const BackOnly: Story = {
  render: () => (
    <CreditCard>
      <CreditCardBack className="bg-gradient-to-br from-blue-900 to-blue-700">
        <CreditCardMagStripe />
        <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2">
          <div className="flex justify-between">
            <CreditCardNumber>0123 4567 8901 2345</CreditCardNumber>
          </div>
          <div className="flex justify-between">
            <CreditCardName>John R. Doe</CreditCardName>
          </div>
          <div className="flex justify-between">
            <CreditCardExpiry>01/24</CreditCardExpiry>
            <CreditCardCvv>123</CreditCardCvv>
          </div>
        </div>
      </CreditCardBack>
    </CreditCard>
  ),
};

/**
 * American Express card with a different layout
 */
export const AmexCard: Story = {
  render: () => (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-blue-500 to-blue-400">
          <CreditCardLogo>
            <svg
              viewBox="0 0 24 24"
              className="size-full"
              role="img"
              aria-labelledby="svgTitle"
            >
              <title id="svgTitle">Amex Card</title>
              <path
                fill="currentColor"
                d="M22 10.83V20h-7.17v-1.5h-1.5V20H2V4h11.33v1.5h1.5V4H22v6.83zm-8.67-4.5v11.34h1.5V6.33h-1.5zm-10 11.34h9.67v-3h1.5v3H20v-7.67h-6.17v-1.5H20V5.33h-5.83v3h-1.5v-3H3.33v12.34z"
              />
            </svg>
          </CreditCardLogo>
          <CreditCardChip />
          <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2">
            <CreditCardNumber>0123 4567 8901 2345</CreditCardNumber>
            <div className="flex justify-between">
              <CreditCardName>John R. Doe</CreditCardName>
              <CreditCardExpiry>01/24</CreditCardExpiry>
            </div>
          </div>
          <CreditCardServiceProvider type="Amex" />
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-blue-500 to-blue-400">
          <CreditCardMagStripe />
          <div className="absolute top-1/2 right-0 left-0 flex justify-center">
            <CreditCardCvv>123</CreditCardCvv>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};

/**
 * Visa card with standard layout
 */
export const VisaCard: Story = {
  render: () => (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-blue-900 to-blue-700">
          <CreditCardChip />
          <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2">
            <CreditCardNumber>0123 4567 8901 2345</CreditCardNumber>
            <div className="flex justify-between">
              <CreditCardName>John R. Doe</CreditCardName>
              <CreditCardExpiry>01/24</CreditCardExpiry>
            </div>
          </div>
          <CreditCardServiceProvider type="Visa" />
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-blue-900 to-blue-700">
          <CreditCardMagStripe />
          <div className="absolute top-1/2 right-0 left-0 flex justify-center">
            <CreditCardCvv>123</CreditCardCvv>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};

/**
 * MasterCard with custom styling
 */
export const MasterCard: Story = {
  render: () => (
    <CreditCard>
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-red-600 to-orange-500">
          <CreditCardChip />
          <div className="absolute right-0 bottom-0 left-0 flex flex-col gap-2">
            <CreditCardNumber>0123 4567 8901 2345</CreditCardNumber>
            <div className="flex justify-between">
              <CreditCardName>John R. Doe</CreditCardName>
              <CreditCardExpiry>01/24</CreditCardExpiry>
            </div>
          </div>
          <CreditCardServiceProvider type="Mastercard" />
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-red-600 to-orange-500">
          <CreditCardMagStripe />
          <div className="absolute top-1/2 right-0 left-0 flex justify-center">
            <CreditCardCvv>123</CreditCardCvv>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};
