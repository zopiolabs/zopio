import type { Meta, StoryObj } from '@storybook/nextjs';
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
} from '../../../packages/design-system/ui/credit-card';

const meta: Meta<typeof CreditCard> = {
  title: 'ui/CreditCard',
  component: CreditCard,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component:
          'A 3D credit card component with hover rotation effects and flip functionality for displaying credit card information.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    className: {
      control: 'text',
      description: 'Additional CSS classes',
    },
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <CreditCard className="w-96">
      <CreditCardFlipper>
        <CreditCardFront>
          <CreditCardChip />
          <CreditCardLogo>
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/20 font-bold text-xs">
              LOGO
            </div>
          </CreditCardLogo>
          <div className="flex h-full flex-col justify-end space-y-4">
            <CreditCardNumber>1234 5678 9012 3456</CreditCardNumber>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="text-xs opacity-70">CARD HOLDER</div>
                <CreditCardName>John Doe</CreditCardName>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs opacity-70">EXPIRES</div>
                <CreditCardExpiry>12/28</CreditCardExpiry>
              </div>
            </div>
          </div>
          <CreditCardServiceProvider type="Visa" />
        </CreditCardFront>
        <CreditCardBack>
          <CreditCardMagStripe />
          <div className="flex h-full flex-col justify-end">
            <div className="rounded bg-white/90 p-2 text-right text-black">
              <div className="mb-1 text-xs">CVV</div>
              <CreditCardCvv>123</CreditCardCvv>
            </div>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};

export const Mastercard: Story = {
  render: () => (
    <CreditCard className="w-96">
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-red-600 to-orange-500">
          <CreditCardChip />
          <CreditCardLogo>
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/20 font-bold text-xs">
              BANK
            </div>
          </CreditCardLogo>
          <div className="flex h-full flex-col justify-end space-y-4">
            <CreditCardNumber>5555 4444 3333 2222</CreditCardNumber>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="text-xs opacity-70">CARD HOLDER</div>
                <CreditCardName>Jane Smith</CreditCardName>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs opacity-70">EXPIRES</div>
                <CreditCardExpiry>09/27</CreditCardExpiry>
              </div>
            </div>
          </div>
          <CreditCardServiceProvider type="Mastercard" />
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-red-600 to-orange-500">
          <CreditCardMagStripe />
          <div className="flex h-full flex-col justify-end">
            <div className="rounded bg-white/90 p-2 text-right text-black">
              <div className="mb-1 text-xs">CVV</div>
              <CreditCardCvv>456</CreditCardCvv>
            </div>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};

export const AmericanExpress: Story = {
  render: () => (
    <CreditCard className="w-96">
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-blue-800 to-blue-600">
          <CreditCardChip />
          <CreditCardLogo>
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/20 font-bold text-xs">
              AMEX
            </div>
          </CreditCardLogo>
          <div className="flex h-full flex-col justify-end space-y-4">
            <CreditCardNumber>3782 822463 10005</CreditCardNumber>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="text-xs opacity-70">CARD HOLDER</div>
                <CreditCardName>Alex Johnson</CreditCardName>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs opacity-70">EXPIRES</div>
                <CreditCardExpiry>03/29</CreditCardExpiry>
              </div>
            </div>
          </div>
          <CreditCardServiceProvider type="American Express" />
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-blue-800 to-blue-600">
          <CreditCardMagStripe />
          <div className="flex h-full flex-col justify-end">
            <div className="rounded bg-white/90 p-2 text-right text-black">
              <div className="mb-1 text-xs">CVV</div>
              <CreditCardCvv>7890</CreditCardCvv>
            </div>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};

export const CustomDesign: Story = {
  render: () => (
    <CreditCard className="w-96">
      <CreditCardFlipper>
        <CreditCardFront className="bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600">
          <CreditCardChip />
          <CreditCardLogo>
            <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/30 font-bold text-xs backdrop-blur-sm">
              PREMIUM
            </div>
          </CreditCardLogo>
          <div className="flex h-full flex-col justify-end space-y-4">
            <CreditCardNumber>4111 1111 1111 1111</CreditCardNumber>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <div className="text-xs opacity-70">CARD HOLDER</div>
                <CreditCardName>Premium Member</CreditCardName>
              </div>
              <div className="space-y-1 text-right">
                <div className="text-xs opacity-70">EXPIRES</div>
                <CreditCardExpiry>12/30</CreditCardExpiry>
              </div>
            </div>
          </div>
          <CreditCardServiceProvider type="Visa" />
        </CreditCardFront>
        <CreditCardBack className="bg-gradient-to-br from-purple-900 via-purple-700 to-pink-600">
          <CreditCardMagStripe />
          <div className="flex h-full flex-col justify-end">
            <div className="rounded bg-white/90 p-2 text-right text-black backdrop-blur-sm">
              <div className="mb-1 text-xs">CVV</div>
              <CreditCardCvv>999</CreditCardCvv>
            </div>
          </div>
        </CreditCardBack>
      </CreditCardFlipper>
    </CreditCard>
  ),
};

export const WithoutFlipper: Story = {
  render: () => (
    <CreditCard className="w-96">
      <CreditCardFront className="bg-gradient-to-br from-gray-800 to-gray-600">
        <CreditCardChip />
        <CreditCardLogo>
          <div className="flex h-full w-full items-center justify-center rounded-lg bg-white/20 font-bold text-xs">
            BANK
          </div>
        </CreditCardLogo>
        <div className="flex h-full flex-col justify-end space-y-4">
          <CreditCardNumber>1234 5678 9012 3456</CreditCardNumber>
          <div className="flex items-end justify-between">
            <div className="space-y-1">
              <div className="text-xs opacity-70">CARD HOLDER</div>
              <CreditCardName>Card Holder</CreditCardName>
            </div>
            <div className="space-y-1 text-right">
              <div className="text-xs opacity-70">EXPIRES</div>
              <CreditCardExpiry>MM/YY</CreditCardExpiry>
            </div>
          </div>
        </div>
        <CreditCardServiceProvider type="Visa" />
      </CreditCardFront>
    </CreditCard>
  ),
};

export const BackOnly: Story = {
  render: () => (
    <CreditCard className="w-96">
      <CreditCardBack className="bg-gradient-to-br from-green-800 to-green-600">
        <CreditCardMagStripe />
        <div className="flex h-full flex-col justify-end space-y-4">
          <div className="rounded bg-white/90 p-3 text-black">
            <div className="mb-2 text-xs opacity-70">AUTHORIZED SIGNATURE</div>
            <div className="mb-3 h-8 border-gray-400 border-b">.</div>
            <div className="text-right">
              <div className="mb-1 text-xs">CVV</div>
              <CreditCardCvv>123</CreditCardCvv>
            </div>
          </div>
          <div className="text-center text-xs opacity-70">
            This card is property of Example Bank
          </div>
        </div>
      </CreditCardBack>
    </CreditCard>
  ),
};
