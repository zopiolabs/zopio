/**
 * SPDX-License-Identifier: MIT
 */

import { NumberFlowMotion } from '@repo/design-system/ui/number-flow-motion';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { useCallback, useEffect, useState } from 'react';

const meta: Meta<typeof NumberFlowMotion> = {
  title: 'UI/NumberFlowMotion',
  component: NumberFlowMotion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof NumberFlowMotion>;

export const Default: Story = {
  render: () => {
    const [value, setValue] = useState(0.25);

    const handleClick = useCallback(() => {
      setValue((prev) => {
        // Generate a random value between -0.5 and 0.5
        const change = (Math.random() - 0.5) * 0.2;
        return Math.max(-0.5, Math.min(0.5, prev + change));
      });
    }, []);

    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="flex flex-col items-center gap-4">
        <NumberFlowMotion value={value} className="text-2xl" />
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to change value
        </p>
      </div>
    );
  },
};

export const StockPrice: Story = {
  render: () => {
    const [value, setValue] = useState(0.0324);
    const [price, setPrice] = useState(142.56);

    const handleClick = useCallback(() => {
      setValue((prev) => {
        // Generate a random value between -0.1 and 0.1
        const change = (Math.random() - 0.5) * 0.05;
        return Math.max(-0.15, Math.min(0.15, prev + change));
      });

      setPrice((prev) => {
        const change = prev * (1 + (Math.random() - 0.5) * 0.02);
        return Math.round(change * 100) / 100;
      });
    }, []);

    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="flex flex-col items-start gap-2 rounded-lg border p-6">
        <h3 className="font-bold text-xl">ACME Inc.</h3>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-2xl">${price.toFixed(2)}</span>
          <NumberFlowMotion value={value} className="text-sm" />
        </div>
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to simulate price change
        </p>
      </div>
    );
  },
};

export const CustomFormat: Story = {
  render: () => {
    const [value, setValue] = useState(2456789);

    const handleClick = useCallback(() => {
      setValue((prev) => {
        // Generate a random value change
        const change = Math.floor((Math.random() - 0.3) * 100000);
        return Math.max(0, prev + change);
      });
    }, []);

    useEffect(() => {
      document.addEventListener('click', handleClick);
      return () => document.removeEventListener('click', handleClick);
    }, [handleClick]);

    return (
      <div className="flex flex-col items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="font-medium text-lg">Visitors:</span>
          <NumberFlowMotion
            value={value}
            format={{
              notation: 'compact',
              compactDisplay: 'short',
              maximumFractionDigits: 1,
            }}
            showTrend={false}
            className="text-xl"
          />
        </div>
        <p className="mt-4 text-gray-500 text-sm">
          Click anywhere to change value
        </p>
      </div>
    );
  },
};
