/**
 * SPDX-License-Identifier: MIT
 */

import { InfiniteScroll } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { Loader2 } from 'lucide-react';
import React from 'react';

const meta: Meta<typeof InfiniteScroll> = {
  title: 'UI/InfiniteScroll',
  component: InfiniteScroll,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof InfiniteScroll>;

interface DummyProductResponse {
  products: DummyProduct[];
  total: number;
  skip: number;
  limit: number;
}

interface DummyProduct {
  id: number;
  title: string;
  price: string;
}

const Product = ({ product }: { product: DummyProduct }) => {
  return (
    <div className="flex w-full flex-col gap-2 rounded-lg border-2 border-gray-200 p-2">
      <div className="flex gap-2">
        <div className="flex flex-col justify-center gap-1">
          <div className="font-bold text-primary">
            {product.id} - {product.title}
          </div>
          <div className="text-muted-foreground text-sm">{product.price}</div>
        </div>
      </div>
    </div>
  );
};

export const InfiniteScrollDemo: Story = {
  render: () => {
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [products, setProducts] = React.useState<DummyProduct[]>([]);

    const next = async () => {
      setLoading(true);

      /**
       * Intentionally delay the search by 800ms before execution so that you can see the loading spinner.
       * In your app, you can remove this setTimeout.
       **/
      setTimeout(async () => {
        const res = await fetch(
          `https://dummyjson.com/products?limit=3&skip=${3 * page}&select=title,price`
        );
        const data = (await res.json()) as DummyProductResponse;
        setProducts((prev) => [...prev, ...data.products]);
        setPage((prev) => prev + 1);

        // Usually your response will tell you if there is no more data.
        if (data.products.length < 3) {
          setHasMore(false);
        }
        setLoading(false);
      }, 800);
    };

    return (
      <div className="max-h-[300px] w-full overflow-y-auto px-10">
        <div className="flex w-full flex-col items-center gap-3">
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={1}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
    );
  },
};

export const ReverseInfiniteScroll: Story = {
  render: () => {
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [products, setProducts] = React.useState<DummyProduct[]>([]);

    const next = async () => {
      setLoading(true);

      setTimeout(async () => {
        const res = await fetch(
          `https://dummyjson.com/products?limit=3&skip=${3 * page}&select=title,price`
        );
        const data = (await res.json()) as DummyProductResponse;
        setProducts((prev) => [...data.products, ...prev]);
        setPage((prev) => prev + 1);

        if (data.products.length < 3) {
          setHasMore(false);
        }
        setLoading(false);
      }, 800);
    };

    return (
      <div className="max-h-[300px] w-full overflow-y-auto px-10">
        <div className="flex w-full flex-col items-center gap-3">
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={1}
            reverse={true}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
        </div>
      </div>
    );
  },
};

export const CustomThreshold: Story = {
  render: () => {
    const [page, setPage] = React.useState(0);
    const [loading, setLoading] = React.useState(false);
    const [hasMore, setHasMore] = React.useState(true);
    const [products, setProducts] = React.useState<DummyProduct[]>([]);

    const next = async () => {
      setLoading(true);

      setTimeout(async () => {
        const res = await fetch(
          `https://dummyjson.com/products?limit=3&skip=${3 * page}&select=title,price`
        );
        const data = (await res.json()) as DummyProductResponse;
        setProducts((prev) => [...prev, ...data.products]);
        setPage((prev) => prev + 1);

        if (data.products.length < 3) {
          setHasMore(false);
        }
        setLoading(false);
      }, 800);
    };

    return (
      <div className="max-h-[300px] w-full overflow-y-auto px-10">
        <div className="flex w-full flex-col items-center gap-3">
          <p className="mb-2 text-muted-foreground text-sm">
            Using threshold of 0.5 (loads when element is 50% visible)
          </p>
          {products.map((product) => (
            <Product key={product.id} product={product} />
          ))}
          <InfiniteScroll
            hasMore={hasMore}
            isLoading={loading}
            next={next}
            threshold={0.5}
          >
            {hasMore && <Loader2 className="my-4 h-8 w-8 animate-spin" />}
          </InfiniteScroll>
        </div>
      </div>
    );
  },
};
