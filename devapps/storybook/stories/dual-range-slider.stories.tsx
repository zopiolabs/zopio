/**
 * SPDX-License-Identifier: MIT
 */

import type { Meta, StoryObj } from '@storybook/nextjs';
import { useState } from 'react';

import { DualRangeSlider } from '@repo/design-system/ui';

const meta: Meta<typeof DualRangeSlider> = {
  title: 'UI/DualRangeSlider',
  component: DualRangeSlider,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([0, 100]);
    return (
      <div className="w-[280px]">
        <DualRangeSlider
          value={values}
          onValueChange={setValues}
          min={0}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

export const WithLabels: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([25, 75]);
    return (
      <div className="w-[280px]">
        <DualRangeSlider
          label={(value) => `${value}`}
          value={values}
          onValueChange={setValues}
          min={0}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

export const BottomLabels: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([20, 80]);
    return (
      <div className="w-[280px]">
        <DualRangeSlider
          label={(value) => `${value}`}
          labelPosition="bottom"
          value={values}
          onValueChange={setValues}
          min={0}
          max={100}
          step={1}
        />
      </div>
    );
  },
};

export const CustomRange: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([10, 90]);
    return (
      <div className="w-[280px]">
        <DualRangeSlider
          label={(value) => `$${value}`}
          value={values}
          onValueChange={setValues}
          min={0}
          max={200}
          step={5}
        />
      </div>
    );
  },
};

export const CustomStep: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([20, 80]);
    return (
      <div className="w-[280px]">
        <DualRangeSlider
          label={(value) => `${value}%`}
          value={values}
          onValueChange={setValues}
          min={0}
          max={100}
          step={10}
        />
      </div>
    );
  },
};

export const Disabled: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([30, 70]);
    return (
      <div className="w-[280px]">
        <DualRangeSlider
          label={(value) => `${value}`}
          value={values}
          onValueChange={setValues}
          min={0}
          max={100}
          step={1}
          disabled
        />
      </div>
    );
  },
};

export const CustomStyling: Story = {
  render: () => {
    const [values, setValues] = useState<number[]>([25, 75]);
    return (
      <div className="w-[280px]">
        <DualRangeSlider
          label={(value) => `${value}`}
          value={values}
          onValueChange={setValues}
          min={0}
          max={100}
          step={1}
          className="py-4"
        />
      </div>
    );
  },
};
