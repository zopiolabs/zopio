# @repo/trigger-rules

## Overview

The `@repo/trigger-rules` package provides a flexible rule engine for evaluating conditions and executing actions based on events in Zopio applications. It enables declarative, JSON-based rules that can trigger various actions like logging, sending webhooks, or sending emails when specific conditions are met.

## Module Categories

### Rule Engine

- **Rule Evaluation**: Core functionality for evaluating conditions against event payloads
- **Action Execution**: Handlers for different action types (log, webhook, email)

### Types

- **Rule Definition**: TypeScript types for defining rules and conditions
- **Action Payloads**: Type definitions for different action payloads

## Usage Guidelines

### Basic Usage

```typescript
import { evaluateRule, type JSONRule } from '@repo/trigger-rules';

// Define a rule
const rule: JSONRule = {
  event: 'user.created',
  conditions: {
    'user.role': 'admin'
  },
  actions: [
    {
      type: 'log',
      message: 'New admin user created: {{user.email}}'
    },
    {
      type: 'webhook',
      url: 'https://api.example.com/hooks/new-admin',
      method: 'POST',
      payload: {
        email: '{{user.email}}',
        name: '{{user.name}}'
      }
    }
  ]
};

// Evaluate the rule against an event payload
const result = await evaluateRule(rule, {
  user: {
    id: '123',
    email: 'admin@example.com',
    name: 'Admin User',
    role: 'admin'
  }
});

console.log(result); // { executed: true, actions: [...] }
```

## Installation

Add the package to your project:

```bash
pnpm add @repo/trigger-rules
```

## Development Guidelines

### Project Structure

```
trigger-rules/
├── index.ts      # Main exports with rule evaluation logic
└── package.json  # Package dependencies
```

### Types

```typescript
// Action payload types
export type ActionPayload = {
  message?: string;
  url?: string;
  to?: string;
  template?: string;
  [key: string]: unknown;
};

// JSON rule definition
export type JSONRule = {
  event: string;
  conditions?: Record<string, unknown>;
  actions: {
    type: 'log' | 'webhook' | 'email';
    [key: string]: unknown;
  }[];
};
```

### Best Practices

1. **Rule Structure**: Keep rules simple and focused on a single event type.
2. **Condition Paths**: Use dot notation for accessing nested properties in conditions.
3. **Template Variables**: Use `{{variable.path}}` syntax for dynamic values in action payloads.
4. **Error Handling**: The rule engine handles errors gracefully, but always validate rule definitions.
5. **Testing**: Test rules with various payloads to ensure conditions work as expected.

## Integration Examples

### Event-Driven Notifications

```typescript
// app/api/events/route.ts
import { evaluateRule, type JSONRule } from '@repo/trigger-rules';
import { NextResponse } from 'next/server';

// Define rules
const rules: JSONRule[] = [
  {
    event: 'order.created',
    actions: [
      {
        type: 'email',
        to: '{{customer.email}}',
        template: 'order-confirmation',
        orderNumber: '{{order.number}}',
        items: '{{order.items}}'
      }
    ]
  },
  {
    event: 'order.created',
    conditions: {
      'order.total': 1000
    },
    actions: [
      {
        type: 'log',
        message: 'High-value order created: {{order.number}}'
      },
      {
        type: 'webhook',
        url: 'https://api.example.com/hooks/high-value-order',
        method: 'POST',
        payload: {
          orderNumber: '{{order.number}}',
          customerEmail: '{{customer.email}}',
          total: '{{order.total}}'
        }
      }
    ]
  }
];

export async function POST(request: Request) {
  const { event, payload } = await request.json();
  
  // Find rules matching the event
  const matchingRules = rules.filter(rule => rule.event === event);
  
  // Evaluate each matching rule
  const results = await Promise.all(
    matchingRules.map(rule => evaluateRule(rule, payload))
  );
  
  return NextResponse.json({ results });
}
```

### User Activity Monitoring

```typescript
// services/activity-monitor.ts
import { evaluateRule, type JSONRule } from '@repo/trigger-rules';
import { sendEvent } from '@repo/trigger';

// Define security rules
const securityRules: JSONRule[] = [
  {
    event: 'user.login',
    conditions: {
      'location.country': 'Unknown'
    },
    actions: [
      {
        type: 'log',
        message: 'Suspicious login detected for user {{user.email}} from {{location.country}}'
      },
      {
        type: 'email',
        to: '{{user.email}}',
        template: 'security-alert',
        loginTime: '{{timestamp}}',
        ipAddress: '{{ipAddress}}',
        location: '{{location.country}}'
      }
    ]
  },
  {
    event: 'user.login',
    conditions: {
      'attempts': { $gt: 3 }
    },
    actions: [
      {
        type: 'webhook',
        url: 'https://api.example.com/hooks/security',
        method: 'POST',
        payload: {
          userId: '{{user.id}}',
          email: '{{user.email}}',
          attempts: '{{attempts}}',
          ipAddress: '{{ipAddress}}'
        }
      }
    ]
  }
];

// Monitor user login activity
export async function monitorLoginActivity(userData: any) {
  // Process the login event
  const eventPayload = {
    user: {
      id: userData.id,
      email: userData.email
    },
    timestamp: new Date().toISOString(),
    ipAddress: userData.ipAddress,
    location: userData.location,
    attempts: userData.attempts || 1
  };
  
  // Evaluate security rules
  await Promise.all(
    securityRules.map(rule => evaluateRule(rule, eventPayload))
  );
  
  // Send event to trigger.dev for background processing
  await sendEvent('user.login.processed', eventPayload);
}
```

### Dynamic Rule Management

```typescript
// services/rule-manager.ts
import { evaluateRule, type JSONRule } from '@repo/trigger-rules';
import { db } from '@repo/database';

// Get rules from database
export async function getRules(eventType: string): Promise<JSONRule[]> {
  return await db.rules.findMany({
    where: {
      event: eventType,
      active: true
    }
  });
}

// Process an event with dynamic rules
export async function processEvent(
  eventType: string,
  payload: Record<string, unknown>
) {
  // Get rules for this event type
  const rules = await getRules(eventType);
  
  // Evaluate each rule
  const results = await Promise.all(
    rules.map(rule => evaluateRule(rule, payload))
  );
  
  // Return results
  return {
    event: eventType,
    rulesProcessed: rules.length,
    actionsExecuted: results.reduce(
      (count, result) => count + (result.executed ? result.actions.length : 0),
      0
    )
  };
}
```

## Documentation References

- [JSON Path Syntax](https://goessner.net/articles/JsonPath/)
- [Webhook Best Practices](https://webhooks.fyi/)
- [Event-Driven Architecture](https://microservices.io/patterns/data/event-driven-architecture.html)

## Contributing Guidelines

1. Follow the Zopio project's TypeScript and code style guidelines.
2. Ensure proper error handling in rule evaluation.
3. Document any new features or changes to existing ones.
4. Add tests for new rule types or condition evaluators.

## License

MIT
