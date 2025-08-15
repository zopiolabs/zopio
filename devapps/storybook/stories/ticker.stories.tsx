/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';

import {
  Ticker,
  TickerChange,
  TickerIcon,
  TickerPrice,
  TickerSymbol,
} from '@repo/design-system/ui/ticker';

/**
 * A composable finance ticker for displaying symbols, prices and changes.
 */
const meta: Meta<typeof Ticker> = {
  title: 'ui/Ticker',
  component: Ticker,
  tags: ['autodocs'],
  argTypes: {
    symbol: {
      control: { type: 'text' },
      description: 'Stock symbol or ticker symbol',
    },
    price: {
      control: { type: 'number' },
      description: 'Current price',
    },
    change: {
      control: { type: 'number' },
      description: 'Price change amount',
    },
    changePercent: {
      control: { type: 'number' },
      description: 'Price change percentage',
    },
    currency: {
      control: { type: 'text' },
      description: 'ISO 4217 currency code',
    },
    locale: {
      control: { type: 'text' },
      description: 'IETF BCP 47 locale',
    },
    size: {
      control: { type: 'select' },
      options: ['sm', 'md', 'lg'],
      description: 'Size of the ticker',
    },
    showIcon: {
      control: { type: 'boolean' },
      description: 'Show company icon',
    },
    showPercentage: {
      control: { type: 'boolean' },
      description: 'Show percentage change',
    },
    iconSrc: {
      control: { type: 'text' },
      description: 'URL for company icon',
    },
  },
  parameters: {
    layout: 'centered',
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * The default ticker.
 */
export const Default: Story = {
  args: {
    symbol: 'AAPL',
    price: 175.41,
    change: 2.13,
    changePercent: 1.23,
  },
};

/**
 * Different sizes.
 */
export const Sizes: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Ticker symbol="AAPL" price={175.41} change={2.13} size="sm" />
        <span className="text-muted-foreground text-xs">Small</span>
      </div>

      <div className="flex items-center gap-4">
        <Ticker symbol="AAPL" price={175.41} change={2.13} size="md" />
        <span className="text-muted-foreground text-xs">Medium</span>
      </div>

      <div className="flex items-center gap-4">
        <Ticker symbol="AAPL" price={175.41} change={2.13} size="lg" />
        <span className="text-muted-foreground text-xs">Large</span>
      </div>
    </div>
  ),
};

/**
 * Positive and negative changes.
 */
export const Changes: Story = {
  render: () => (
    <div className="space-y-4">
      <Ticker symbol="AAPL" price={175.41} change={2.13} changePercent={1.23} />

      <Ticker
        symbol="TSLA"
        price={242.68}
        change={-5.42}
        changePercent={-2.18}
      />

      <Ticker symbol="MSFT" price={378.85} change={0} changePercent={0} />
    </div>
  ),
};

/**
 * With percentage display.
 */
export const WithPercentage: Story = {
  render: () => (
    <div className="space-y-4">
      <Ticker
        symbol="GOOGL"
        price={175.41}
        change={2.13}
        changePercent={1.23}
        showPercentage={true}
      />

      <Ticker
        symbol="AMZN"
        price={142.68}
        change={-3.42}
        changePercent={-2.34}
        showPercentage={true}
      />
    </div>
  ),
};

/**
 * With company icons.
 */
export const WithIcons: Story = {
  render: () => (
    <div className="space-y-4">
      <Ticker
        symbol="AAPL"
        price={175.41}
        change={2.13}
        changePercent={1.23}
        showIcon={true}
        iconSrc="https://logo.clearbit.com/apple.com"
        iconAlt="Apple Inc."
      />

      <Ticker
        symbol="GOOGL"
        price={142.68}
        change={-1.42}
        changePercent={-0.99}
        showIcon={true}
        iconSrc="https://logo.clearbit.com/google.com"
        iconAlt="Alphabet Inc."
      />

      <Ticker
        symbol="MSFT"
        price={378.85}
        change={4.22}
        changePercent={1.13}
        showIcon={true}
        iconSrc="https://logo.clearbit.com/microsoft.com"
        iconAlt="Microsoft Corporation"
      />
    </div>
  ),
};

/**
 * Icon fallback to symbol.
 */
export const IconFallback: Story = {
  render: () => (
    <div className="space-y-4">
      <Ticker
        symbol="NVDA"
        price={875.28}
        change={12.45}
        changePercent={1.44}
        showIcon={true}
        iconSrc="https://invalid-url.com/logo.png"
        iconAlt="NVIDIA Corporation"
      />

      <Ticker
        symbol="META"
        price={298.58}
        change={-2.13}
        changePercent={-0.71}
        showIcon={true}
        // No iconSrc provided
      />
    </div>
  ),
};

/**
 * Different currencies and locales.
 */
export const CurrenciesAndLocales: Story = {
  render: () => (
    <div className="space-y-4">
      <div>
        <h4 className="mb-2 font-medium text-sm">US Stocks (USD)</h4>
        <Ticker
          symbol="AAPL"
          price={175.41}
          change={2.13}
          currency="USD"
          locale="en-US"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">European Stocks (EUR)</h4>
        <Ticker
          symbol="SAP"
          price={142.68}
          change={-1.42}
          currency="EUR"
          locale="de-DE"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Japanese Stocks (JPY)</h4>
        <Ticker
          symbol="7203"
          price={2845}
          change={23}
          currency="JPY"
          locale="ja-JP"
        />
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">UK Stocks (GBP)</h4>
        <Ticker
          symbol="LLOY"
          price={52.34}
          change={0.78}
          currency="GBP"
          locale="en-GB"
        />
      </div>
    </div>
  ),
};

/**
 * Inline usage in text.
 */
export const InlineUsage: Story = {
  render: () => (
    <div className="max-w-2xl space-y-4">
      <p className="text-sm leading-relaxed">
        In other autonomous vehicle news, Alphabet-owned{' '}
        <Ticker
          symbol="GOOGL"
          price={175.41}
          change={2.13}
          size="sm"
          className="mx-1"
        />{' '}
        Waymo is looking to bring its robotaxi service to New York.
      </p>

      <p className="text-sm leading-relaxed">
        Apple{' '}
        <Ticker
          symbol="AAPL"
          price={175.41}
          change={-1.23}
          changePercent={-0.7}
          showPercentage={true}
          size="sm"
          className="mx-1"
        />{' '}
        reported strong quarterly earnings despite market volatility.
      </p>

      <p className="text-sm leading-relaxed">
        Tesla{' '}
        <Ticker
          symbol="TSLA"
          price={242.68}
          change={8.45}
          changePercent={3.61}
          showIcon={true}
          iconSrc="https://logo.clearbit.com/tesla.com"
          size="sm"
          className="mx-1"
        />{' '}
        continues to lead in electric vehicle innovation.
      </p>
    </div>
  ),
};

/**
 * Crypto currencies.
 */
export const Cryptocurrencies: Story = {
  render: () => (
    <div className="space-y-4">
      <Ticker
        symbol="BTC"
        price={43250.75}
        change={1250.3}
        changePercent={2.98}
        currency="USD"
        showPercentage={true}
      />

      <Ticker
        symbol="ETH"
        price={2845.62}
        change={-125.45}
        changePercent={-4.22}
        currency="USD"
        showPercentage={true}
      />

      <Ticker
        symbol="ADA"
        price={0.485}
        change={0.023}
        changePercent={4.98}
        currency="USD"
        showPercentage={true}
      />
    </div>
  ),
};

/**
 * Market dashboard example.
 */
export const MarketDashboard: Story = {
  render: () => (
    <div className="w-full max-w-4xl space-y-6">
      <div>
        <h3 className="mb-4 font-semibold text-lg">Top Gainers</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <Ticker
              symbol="NVDA"
              price={875.28}
              change={45.67}
              changePercent={5.51}
              showIcon={true}
              showPercentage={true}
              size="lg"
            />
          </div>

          <div className="rounded-lg border p-4">
            <Ticker
              symbol="AMD"
              price={142.85}
              change={8.23}
              changePercent={6.11}
              showIcon={true}
              showPercentage={true}
              size="lg"
            />
          </div>

          <div className="rounded-lg border p-4">
            <Ticker
              symbol="TSLA"
              price={242.68}
              change={12.45}
              changePercent={5.41}
              showIcon={true}
              showPercentage={true}
              size="lg"
            />
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 font-semibold text-lg">Top Losers</h3>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-lg border p-4">
            <Ticker
              symbol="META"
              price={298.58}
              change={-15.42}
              changePercent={-4.91}
              showIcon={true}
              showPercentage={true}
              size="lg"
            />
          </div>

          <div className="rounded-lg border p-4">
            <Ticker
              symbol="NFLX"
              price={445.23}
              change={-22.67}
              changePercent={-4.84}
              showIcon={true}
              showPercentage={true}
              size="lg"
            />
          </div>

          <div className="rounded-lg border p-4">
            <Ticker
              symbol="PYPL"
              price={58.92}
              change={-2.78}
              changePercent={-4.51}
              showIcon={true}
              showPercentage={true}
              size="lg"
            />
          </div>
        </div>
      </div>
    </div>
  ),
};

/**
 * Composable ticker components.
 */
export const Composable: Story = {
  render: () => (
    <div className="space-y-6">
      <div>
        <h4 className="mb-2 font-medium text-sm">Custom Layout</h4>
        <div className="flex items-center gap-3 rounded-lg border p-4">
          <TickerIcon
            src="https://logo.clearbit.com/apple.com"
            symbol="AAPL"
            show={true}
          />
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <TickerSymbol>AAPL</TickerSymbol>
              <span className="text-muted-foreground text-xs">Apple Inc.</span>
            </div>
            <div className="mt-1 flex items-center gap-2">
              <TickerPrice currency="USD" locale="en-US">
                175.41
              </TickerPrice>
              <TickerChange
                value={2.13}
                percentage={1.23}
                currency="USD"
                locale="en-US"
                showPercentage={true}
                positive={true}
              />
            </div>
          </div>
        </div>
      </div>

      <div>
        <h4 className="mb-2 font-medium text-sm">Minimal Layout</h4>
        <div className="flex items-center gap-2">
          <TickerSymbol>MSFT</TickerSymbol>
          <TickerPrice currency="USD" locale="en-US">
            378.85
          </TickerPrice>
        </div>
      </div>
    </div>
  ),
};
