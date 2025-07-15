# @repo/payments

A secure and type-safe Stripe integration package for Zopio applications.

## Overview

The `@repo/payments` package provides a standardized way to integrate Stripe payment processing capabilities into Zopio applications. It offers a server-side Stripe client with proper environment variable validation, webhook handling support, and AI-powered payment tools.

## Features

- **Type-safe Stripe Client**: Pre-configured Stripe client with the latest API version
- **Environment Variable Validation**: Secure validation of Stripe API keys using Zod
- **AI-powered Payment Tools**: Integration with Stripe's Agent Toolkit for AI-assisted payment operations
- **Server-only Protection**: Prevents accidental client-side usage of sensitive payment code

## Installation

```bash
pnpm add @repo/payments
```

## Usage Guidelines

### Basic Stripe Client

```typescript
import { stripe } from '@repo/payments';

// Create a payment intent
const paymentIntent = await stripe.paymentIntents.create({
  amount: 1000, // $10.00
  currency: 'usd',
  payment_method_types: ['card'],
});
```

### Environment Variables

This package requires the following environment variables:

```env
# Required
STRIPE_SECRET_KEY=sk_test_...

# Optional (for webhook validation)
STRIPE_WEBHOOK_SECRET=whsec_...
```

### AI Payment Tools

The package includes Stripe's Agent Toolkit for AI-powered payment operations:

```typescript
import { paymentsAgentToolkit } from '@repo/payments/ai';

// Create a payment link using AI toolkit
const paymentLink = await paymentsAgentToolkit.paymentLinks.create({
  line_items: [
    {
      price: 'price_123',
      quantity: 1,
    },
  ],
});
```

## API Reference

### Main Exports

| Export | Description |
|--------|-------------|
| `stripe` | Configured Stripe client instance |
| `Stripe` | Type export from the Stripe package |

### AI Module Exports

| Export | Description |
|--------|-------------|
| `paymentsAgentToolkit` | Stripe Agent Toolkit instance for AI operations |

## Security Considerations

- This package uses `server-only` to prevent accidental inclusion in client-side code
- API keys are validated at runtime to ensure proper format
- Webhook secrets are properly validated when provided

## Integration Examples

### Processing a Payment

```typescript
import { stripe } from '@repo/payments';

export async function createCheckoutSession(priceId: string) {
  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    mode: 'payment',
    success_url: `${process.env.HOST}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.HOST}/canceled`,
  });
  
  return session;
}
```

### Handling Webhooks

```typescript
import { stripe } from '@repo/payments';
import { keys } from '@repo/payments/keys';

export async function handleWebhook(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  const webhookSecret = keys().STRIPE_WEBHOOK_SECRET;
  
  if (!webhookSecret || !signature) {
    throw new Error('Missing webhook secret or signature');
  }
  
  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    
    // Handle the event
    switch (event.type) {
      case 'payment_intent.succeeded':
        // Handle successful payment
        break;
      // Handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }
    
    return new Response(null, { status: 200 });
  } catch (err) {
    console.error('Webhook error:', err);
    return new Response('Webhook Error', { status: 400 });
  }
}
```

## Development Guidelines

When contributing to this package:

1. Ensure all code is server-side only
2. Maintain strict typing for all exports
3. Keep the Stripe API version updated
4. Add comprehensive tests for new functionality
5. Follow the Zopio project's TypeScript and code style guidelines

## License

MIT
