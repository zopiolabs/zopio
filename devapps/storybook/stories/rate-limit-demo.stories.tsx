/**
 * SPDX-License-Identifier: MIT
 */

import { RateLimitDemo } from '@repo/design-system/ui';
import type { Meta, StoryObj } from '@storybook/nextjs';
import { http } from 'msw';

/**
 * A demo component to showcase rate limiting functionality.
 * This component demonstrates how to implement and use rate limiting in Next.js App Router.
 */
const meta: Meta<typeof RateLimitDemo> = {
  title: 'ui/RateLimitDemo',
  component: RateLimitDemo,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    msw: {
      handlers: [
        // Mock the API endpoint for storybook
        http.get('/api/rate-limit-demo', () => {
          // Store request count in sessionStorage to simulate rate limiting
          const requestCount = sessionStorage.getItem('rate-limit-count')
            ? Number(sessionStorage.getItem('rate-limit-count'))
            : 0;

          // Increment the count
          sessionStorage.setItem('rate-limit-count', String(requestCount + 1));

          // Check if rate limit is exceeded (more than 2 requests)
          if (requestCount >= 2) {
            return new Response(
              JSON.stringify({
                error: 'Too many requests, please try again later.',
              }),
              {
                status: 429,
                headers: { 'Content-Type': 'application/json' },
              }
            );
          }

          // Successful response
          return new Response(
            JSON.stringify({
              message: `Request successful! (${requestCount + 1}/2 for this minute)`,
            }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json' },
            }
          );
        }),
      ],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

/**
 * Default implementation of the Rate Limit Demo component.
 * Try clicking the button multiple times to see the rate limiting in action.
 */
export const Default: Story = {};

/**
 * This story demonstrates how to implement rate limiting in a Next.js App Router.
 * The component shows a simple UI for testing rate limiting functionality.
 */
export const WithDescription: Story = {
  render: () => (
    <div className="max-w-md space-y-4">
      <div className="space-y-2">
        <h3 className="font-medium text-lg">Rate Limiting for Next.js</h3>
        <p className="text-muted-foreground text-sm">
          Rate limiting is essential for protecting your API from abuse and
          ensuring fair usage. This demo shows how to implement rate limiting in
          Next.js App Router.
        </p>
      </div>

      <div className="rounded-md border p-4">
        <RateLimitDemo />
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Implementation Details</h4>
        <p className="text-muted-foreground text-xs">
          The rate limit utility uses LRU Cache to track requests by IP address.
          It can be configured with custom intervals and request limits.
        </p>
        <pre className="mt-2 rounded-md bg-muted p-4 text-xs">
          {`// In your API route
import { rateLimit } from '@repo/design-system/lib/rate-limit';

const limiter = rateLimit({
  interval: 60000, // 1 minute
});

export async function GET(request) {
  try {
    await limiter.check(request, 2); // 2 requests per minute
    return NextResponse.json({ message: 'Success!' });
  } catch (error) {
    return error as NextResponse;
  }
}`}
        </pre>
      </div>
    </div>
  ),
};
