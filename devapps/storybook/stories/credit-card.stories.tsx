/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { Copy, CreditCard as CreditCardIcon } from 'lucide-react';
import { useState } from 'react';

import {
  CreditCard,
  CreditCardBack,
  CreditCardControls,
  CreditCardFront,
  CreditCardNumber,
  FlipCardButton,
  ToggleSensitiveButton,
  formatCardNumber,
  formatExpiryDate,
  useCreditCard,
} from '@repo/design-system/ui/credit-card';

/**
 * A component that displays credit card information with security features and card type detection.
 */
const meta: Meta<typeof CreditCard> = {
  title: 'ui/Credit Card',
  component: CreditCard,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: { type: 'select' },
      options: [
        'visa',
        'mastercard',
        'amex',
        'discover',
        'default',
        'dark',
        'light',
      ],
      description: 'Card brand styling variant',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the credit card',
    },
    number: {
      control: { type: 'text' },
      description: 'Credit card number',
    },
    name: {
      control: { type: 'text' },
      description: 'Cardholder name',
    },
    expiry: {
      control: { type: 'text' },
      description: 'Expiry date (MM/YY format)',
    },
    cvv: {
      control: { type: 'text' },
      description: 'CVV security code',
    },
    showSensitive: {
      control: { type: 'boolean' },
      description: 'Show sensitive information',
    },
    flipped: {
      control: { type: 'boolean' },
      description: 'Show back of card',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Basic credit card with default styling.
 */
export const Default: Story = {
  render: () => (
    <div className="space-y-4">
      <CreditCard
        number="4532 1234 5678 9012"
        name="John Doe"
        expiry="12/25"
        cvv="123"
      />
      <CreditCardControls>
        <ToggleSensitiveButton />
        <FlipCardButton />
      </CreditCardControls>
    </div>
  ),
};

/**
 * Different card sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Small</h4>
        <CreditCard
          size="sm"
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Medium</h4>
        <CreditCard
          size="md"
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Large</h4>
        <CreditCard
          size="lg"
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>
    </div>
  ),
};

/**
 * Different card brand variants.
 */
export const CardBrands: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Visa</h4>
        <CreditCard
          variant="visa"
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Mastercard</h4>
        <CreditCard
          variant="mastercard"
          number="5555 5555 5555 4444"
          name="Jane Smith"
          expiry="08/26"
          cvv="456"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">American Express</h4>
        <CreditCard
          variant="amex"
          number="3782 822463 10005"
          name="Bob Johnson"
          expiry="03/27"
          cvv="789"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Discover</h4>
        <CreditCard
          variant="discover"
          number="6011 1111 1111 1117"
          name="Alice Brown"
          expiry="09/28"
          cvv="321"
        />
      </div>
    </div>
  ),
};

/**
 * Auto-detected card types from number.
 */
export const AutoDetection: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">
          Auto-detected Visa (starts with 4)
        </h4>
        <CreditCard
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">
          Auto-detected Mastercard (starts with 5)
        </h4>
        <CreditCard
          number="5555 5555 5555 4444"
          name="Jane Smith"
          expiry="08/26"
          cvv="456"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">
          Auto-detected Amex (starts with 3)
        </h4>
        <CreditCard
          number="3782 822463 10005"
          name="Bob Johnson"
          expiry="03/27"
          cvv="789"
        />
      </div>
    </div>
  ),
};

/**
 * Different styling variants.
 */
export const StyleVariants: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Default</h4>
        <CreditCard
          variant="default"
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Dark</h4>
        <CreditCard
          variant="dark"
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Light</h4>
        <CreditCard
          variant="light"
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
        />
      </div>
    </div>
  ),
};

/**
 * Card with sensitive information hidden by default.
 */
export const HiddenSensitive: Story = {
  render: () => {
    const [showSensitive, setShowSensitive] = useState(false);

    return (
      <div className="space-y-4">
        <CreditCard
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
          showSensitive={showSensitive}
          onToggleSensitive={setShowSensitive}
        />
        <CreditCardControls>
          <ToggleSensitiveButton />
          <span className="text-muted-foreground text-sm">
            {showSensitive ? 'Sensitive info visible' : 'Sensitive info hidden'}
          </span>
        </CreditCardControls>
      </div>
    );
  },
};

/**
 * Flippable card showing front and back.
 */
export const FlippableCard: Story = {
  render: () => {
    const [flipped, setFlipped] = useState(false);

    return (
      <div className="space-y-4">
        <CreditCard
          number="4532 1234 5678 9012"
          name="John Doe"
          expiry="12/25"
          cvv="123"
          flipped={flipped}
        />
        <CreditCardControls>
          <FlipCardButton flipped={flipped} onFlip={setFlipped} />
          <ToggleSensitiveButton />
          <span className="text-muted-foreground text-sm">
            Showing {flipped ? 'back' : 'front'}
          </span>
        </CreditCardControls>
      </div>
    );
  },
};

/**
 * Custom card layout with separate components.
 */
export const CustomLayout: Story = {
  render: () => (
    <div className="space-y-4">
      <CreditCard
        number="4532 1234 5678 9012"
        name="John Doe"
        expiry="12/25"
        cvv="123"
        variant="visa"
      >
        <CreditCardFront>
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            {/* Custom header */}
            <div className="flex items-start justify-between">
              <div className="text-xs opacity-80">PREMIUM CARD</div>
              <div className="font-bold text-xl">VISA</div>
            </div>

            {/* Custom chip design */}
            <div className="flex items-center">
              <div className="mr-4 h-8 w-12 rounded-md bg-gradient-to-br from-yellow-300 to-yellow-600">
                <div className="flex h-full w-full items-center justify-center">
                  <div className="h-6 w-8 rounded-sm bg-yellow-500 opacity-80" />
                </div>
              </div>
              <div className="text-xs opacity-60">CONTACTLESS</div>
            </div>

            {/* Card number */}
            <CreditCardNumber className="text-2xl" />

            {/* Custom footer */}
            <div className="flex items-end justify-between">
              <div>
                <div className="mb-1 text-xs opacity-60">CARDHOLDER</div>
                <div className="font-medium text-base">JOHN DOE</div>
              </div>
              <div className="text-right">
                <div className="mb-1 text-xs opacity-60">EXPIRES</div>
                <div className="font-mono text-base">12/25</div>
              </div>
            </div>
          </div>
        </CreditCardFront>

        <CreditCardBack>
          <div className="absolute inset-0 flex flex-col justify-between p-6">
            <div className="-mx-6 mt-4 h-12 w-full bg-black" />

            <div className="space-y-4">
              <div className="-mx-6 relative h-8 w-full bg-white">
                <div className="absolute top-0 right-6 flex h-full items-center">
                  <div className="border-gray-300 border-l bg-white px-2 py-1 font-mono text-black text-xs">
                    123
                  </div>
                </div>
              </div>
              <div className="text-right text-xs opacity-60">Security Code</div>
            </div>

            <div className="space-y-2 text-xs opacity-60">
              <div>Premium Banking Services</div>
              <div>24/7 Customer Support</div>
              <div>Worldwide Acceptance</div>
            </div>
          </div>
        </CreditCardBack>
      </CreditCard>

      <CreditCardControls>
        <FlipCardButton />
        <ToggleSensitiveButton />
      </CreditCardControls>
    </div>
  ),
};

/**
 * Payment form integration.
 */
export const PaymentForm: Story = {
  render: () => {
    const [cardData, setCardData] = useState({
      number: '',
      name: '',
      expiry: '',
      cvv: '',
    });

    const handleInputChange = (field: string, value: string) => {
      let formattedValue = value;

      if (field === 'number') {
        formattedValue = formatCardNumber(value);
      } else if (field === 'expiry') {
        formattedValue = formatExpiryDate(value);
      }

      setCardData((prev) => ({ ...prev, [field]: formattedValue }));
    };

    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Form */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Card Details</h3>

            <div>
              <label
                htmlFor="card-number"
                className="mb-1 block font-medium text-sm"
              >
                Card Number
              </label>
              <input
                id="card-number"
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardData.number}
                onChange={(e) => handleInputChange('number', e.target.value)}
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={19}
              />
            </div>

            <div>
              <label
                htmlFor="cardholder-name"
                className="mb-1 block font-medium text-sm"
              >
                Cardholder Name
              </label>
              <input
                id="cardholder-name"
                type="text"
                placeholder="John Doe"
                value={cardData.name}
                onChange={(e) =>
                  handleInputChange('name', e.target.value.toUpperCase())
                }
                className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="expiry-date"
                  className="mb-1 block font-medium text-sm"
                >
                  Expiry Date
                </label>
                <input
                  id="expiry-date"
                  type="text"
                  placeholder="MM/YY"
                  value={cardData.expiry}
                  onChange={(e) => handleInputChange('expiry', e.target.value)}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={5}
                />
              </div>

              <div>
                <label htmlFor="cvv" className="mb-1 block font-medium text-sm">
                  CVV
                </label>
                <input
                  id="cvv"
                  type="text"
                  placeholder="123"
                  value={cardData.cvv}
                  onChange={(e) => handleInputChange('cvv', e.target.value)}
                  className="w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  maxLength={4}
                />
              </div>
            </div>
          </div>

          {/* Card Preview */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Card Preview</h3>
            <CreditCard
              number={cardData.number || '•••• •••• •••• ••••'}
              name={cardData.name || 'CARDHOLDER NAME'}
              expiry={cardData.expiry || 'MM/YY'}
              cvv={cardData.cvv || '•••'}
            />
            <CreditCardControls>
              <FlipCardButton />
              <ToggleSensitiveButton />
            </CreditCardControls>
          </div>
        </div>
      </div>
    );
  },
};

/**
 * Card wallet display.
 */
export const CardWallet: Story = {
  render: () => {
    const cards = [
      {
        id: 1,
        number: '4532 1234 5678 9012',
        name: 'John Doe',
        expiry: '12/25',
        type: 'visa',
      },
      {
        id: 2,
        number: '5555 5555 5555 4444',
        name: 'Jane Smith',
        expiry: '08/26',
        type: 'mastercard',
      },
      {
        id: 3,
        number: '3782 822463 10005',
        name: 'Bob Johnson',
        expiry: '03/27',
        type: 'amex',
      },
    ];

    const [selectedCard, setSelectedCard] = useState(cards[0]);

    return (
      <div className="space-y-6">
        <h3 className="font-semibold text-lg">My Cards</h3>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {cards.map((card) => (
            <button
              key={card.id}
              type="button"
              className={`cursor-pointer transition-transform hover:scale-105 ${
                selectedCard.id === card.id
                  ? 'rounded-xl ring-2 ring-primary'
                  : ''
              }`}
              onClick={() => setSelectedCard(card)}
              aria-label={`Select ${card.name}'s ${card.type} card`}
            >
              <CreditCard
                size="sm"
                variant={
                  card.type as
                    | 'visa'
                    | 'mastercard'
                    | 'amex'
                    | 'discover'
                    | 'default'
                    | 'dark'
                    | 'light'
                }
                number={card.number}
                name={card.name}
                expiry={card.expiry}
                cvv="•••"
              />
            </button>
          ))}
        </div>

        <div className="space-y-4">
          <h4 className="font-medium text-md">Selected Card Details</h4>
          <CreditCard
            variant={
              selectedCard.type as
                | 'visa'
                | 'mastercard'
                | 'amex'
                | 'discover'
                | 'default'
                | 'dark'
                | 'light'
            }
            number={selectedCard.number}
            name={selectedCard.name}
            expiry={selectedCard.expiry}
            cvv="123"
          />
          <CreditCardControls>
            <FlipCardButton />
            <ToggleSensitiveButton />
            <button
              type="button"
              className="inline-flex h-9 items-center justify-center rounded-md border border-input bg-background px-3 font-medium text-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Number
            </button>
          </CreditCardControls>
        </div>
      </div>
    );
  },
};

/**
 * Empty card state.
 */
export const EmptyCard: Story = {
  render: () => (
    <div className="space-y-4">
      <CreditCard />
      <CreditCardControls>
        <button
          type="button"
          className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 font-medium text-primary-foreground text-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
        >
          <CreditCardIcon className="mr-2 h-4 w-4" />
          Add Card Details
        </button>
      </CreditCardControls>
    </div>
  ),
};

// Custom card info component for stories
const CardInfo = () => {
  const { showSensitive, cardData } = useCreditCard();

  return (
    <div className="mt-4 rounded bg-muted p-3 text-sm">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <span className="font-medium">Card Type:</span>
          <div className="capitalize">{cardData.type || 'Unknown'}</div>
        </div>
        <div>
          <span className="font-medium">Sensitive Info:</span>
          <div>{showSensitive ? 'Visible' : 'Hidden'}</div>
        </div>
        <div>
          <span className="font-medium">Number:</span>
          <div className="font-mono text-xs">{cardData.number}</div>
        </div>
        <div>
          <span className="font-medium">Expiry:</span>
          <div className="font-mono">{cardData.expiry}</div>
        </div>
      </div>
    </div>
  );
};

/**
 * Using the credit card context hook.
 */
export const WithContext: Story = {
  render: () => (
    <div className="space-y-4">
      <CreditCard
        number="4532 1234 5678 9012"
        name="John Doe"
        expiry="12/25"
        cvv="123"
        variant="visa"
      />
      <CreditCardControls>
        <FlipCardButton />
        <ToggleSensitiveButton />
      </CreditCardControls>
      <CardInfo />
    </div>
  ),
};
