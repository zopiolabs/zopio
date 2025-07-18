/**
 * SPDX-License-Identifier: MIT
 */

import {
  Ticker,
  TickerIcon,
  TickerPrice,
  TickerPriceChange,
  TickerSymbol,
} from '@repo/design-system/ui/ticker';
import type { Meta, StoryObj } from '@storybook/nextjs';

const meta: Meta<typeof Ticker> = {
  title: 'ui/Ticker',
  component: Ticker,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof Ticker>;

/**
 * Basic ticker with percentage change
 */
export const WithPercentageChange: Story = {
  render: () => (
    <Ticker>
      <TickerIcon
        src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png"
        symbol="BTC"
      />
      <TickerSymbol symbol="BTC" />
      <TickerPrice price={42000.5} />
      <TickerPriceChange change={5.23} isPercent />
    </Ticker>
  ),
};

/**
 * Different currencies and locales
 */
export const CurrenciesAndLocales: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Ticker currency="USD" locale="en-US">
        <TickerIcon
          src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png"
          symbol="ETH"
        />
        <TickerSymbol symbol="ETH" />
        <TickerPrice price={2500.75} />
        <TickerPriceChange change={-1.25} isPercent />
      </Ticker>

      <Ticker currency="EUR" locale="de-DE">
        <TickerIcon
          src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png"
          symbol="ETH"
        />
        <TickerSymbol symbol="ETH" />
        <TickerPrice price={2300.5} />
        <TickerPriceChange change={-1.25} isPercent />
      </Ticker>

      <Ticker currency="JPY" locale="ja-JP">
        <TickerIcon
          src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png"
          symbol="ETH"
        />
        <TickerSymbol symbol="ETH" />
        <TickerPrice price={375000} />
        <TickerPriceChange change={-1.25} isPercent />
      </Ticker>
    </div>
  ),
};

/**
 * Icon fallback to symbol when image source is invalid
 */
export const IconFallback: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Ticker>
        <TickerIcon src="https://invalid-url.com/image.png" symbol="SOL" />
        <TickerSymbol symbol="SOL" />
        <TickerPrice price={98.45} />
        <TickerPriceChange change={2.34} isPercent />
      </Ticker>
    </div>
  ),
};

/**
 * Inline usage within text
 */
export const InlineUsage: Story = {
  render: () => (
    <div className="max-w-lg text-base">
      <p>
        In other autonomous vehicle news, Alphabet-owned{' '}
        <Ticker>
          <TickerSymbol symbol="GOOG" />
          <TickerPrice price={175.41} />
          <TickerPriceChange change={2.13} />
        </Ticker>{' '}
        Waymo is looking to bring its robotaxi service to New York.
      </p>
      <p className="mt-4">
        Tesla{' '}
        <Ticker>
          <TickerSymbol symbol="TSLA" />
          <TickerPrice price={242.62} />
          <TickerPriceChange change={-3.45} />
        </Ticker>{' '}
        announced new battery technology that could increase range by 20%.
      </p>
    </div>
  ),
};

/**
 * Absolute price change (non-percentage)
 */
export const AbsolutePriceChange: Story = {
  render: () => (
    <div className="flex flex-col gap-4">
      <Ticker>
        <TickerIcon
          src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/btc.png"
          symbol="BTC"
        />
        <TickerSymbol symbol="BTC" />
        <TickerPrice price={42000.5} />
        <TickerPriceChange change={1250.75} />
      </Ticker>

      <Ticker>
        <TickerIcon
          src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/128/color/eth.png"
          symbol="ETH"
        />
        <TickerSymbol symbol="ETH" />
        <TickerPrice price={2500.75} />
        <TickerPriceChange change={-125.25} />
      </Ticker>
    </div>
  ),
};
